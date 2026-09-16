"""Reverend Insanity Reader API."""
from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import json
import logging
from pathlib import Path
from functools import lru_cache
from typing import Optional


ROOT_DIR = Path(__file__).parent
DATA_DIR = ROOT_DIR / "data"
CHAPTERS_DIR = DATA_DIR / "chapters"
INDEX_PATH = DATA_DIR / "index.json"

load_dotenv(ROOT_DIR / ".env")

app = FastAPI(title="Reverend Insanity Reader")
api_router = APIRouter(prefix="/api")


@lru_cache(maxsize=1)
def load_index() -> dict:
    with open(INDEX_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


@lru_cache(maxsize=256)
def load_chapter(chapter_id: str) -> Optional[dict]:
    path = CHAPTERS_DIR / f"{chapter_id}.json"
    if not path.exists():
        return None
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


NOVEL_META = {
    "title": "Reverend Insanity",
    "chinese_title": "蛊真人 (Gu Zhen Ren)",
    "author": "Gu Zhen Ren",
    "translator": "Fan translation",
    "status": "Discontinued at Chapter 2334",
    "genre": ["Xianxia", "Dark Fantasy", "Anti-hero", "Cultivation", "Time Travel"],
    "tags": ["Gu Refining", "Ruthless MC", "Immortals", "Reincarnation", "Schemes", "Dao"],
    "rating": 4.9,
    "synopsis": (
        "Humans are clever in tens of thousands of ways, Gu are the true refined essences of "
        "Heaven and Earth. The Three Temples are unrighteous, the demon is reborn. "
        "Reincarnated after five hundred years, Fang Yuan returns to his youth with the "
        "memories of an era. To once again seek immortality, he shall walk a path steeped in "
        "blood — refining Gu, scheming across nations, defying Heaven, and forging a legend "
        "that even Heaven itself cannot erase."
    ),
    "quote": '"The heart of a demon never has regret, even in death." — Fang Yuan',
}


@api_router.get("/")
async def root():
    return {"message": "Reverend Insanity Reader API"}


@api_router.get("/novel")
async def get_novel():
    idx = load_index()
    return {
        **NOVEL_META,
        "total_chapters": idx["total_chapters"],
        "total_words": idx["total_words"],
    }


@api_router.get("/chapters")
async def list_chapters(
    q: Optional[str] = None,
    limit: Optional[int] = Query(None, ge=1, le=5000),
    offset: int = Query(0, ge=0),
):
    idx = load_index()
    chapters = idx["chapters"]
    if q:
        needle = q.strip().lower()
        chapters = [
            c
            for c in chapters
            if needle in c["title"].lower()
            or needle in str(c.get("chapter_number") or "")
        ]
    total = len(chapters)
    if limit is not None:
        chapters = chapters[offset : offset + limit]
    return {"total": total, "offset": offset, "items": chapters}


@api_router.get("/chapters/{chapter_id}")
async def get_chapter(chapter_id: str):
    idx = load_index()
    all_chapters = idx["chapters"]

    # Support numeric index alias like /chapters/1 -> ch0001
    if chapter_id.isdigit():
        num = int(chapter_id)
        if 1 <= num <= len(all_chapters):
            chapter_id = all_chapters[num - 1]["id"]

    chapter = load_chapter(chapter_id)
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")

    current_idx = chapter["index"]
    prev_ch = all_chapters[current_idx - 2] if current_idx > 1 else None
    next_ch = all_chapters[current_idx] if current_idx < len(all_chapters) else None
    return {
        **chapter,
        "total": len(all_chapters),
        "prev": prev_ch,
        "next": next_ch,
    }


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def warm_cache():
    load_index()
    logger.info("Loaded chapter index with %d chapters", load_index()["total_chapters"])
