"""Parse the Reverend Insanity EPUB into JSON files for API serving."""
import json
import re
from pathlib import Path
from ebooklib import epub, ITEM_DOCUMENT
from bs4 import BeautifulSoup

ROOT = Path(__file__).parent
EPUB_PATH = ROOT / "data" / "reverend_insanity.epub"
OUT_DIR = ROOT / "data" / "chapters"
OUT_DIR.mkdir(parents=True, exist_ok=True)


def clean_text(html: str) -> tuple[str, list[str]]:
    """Extract plain text paragraphs from HTML."""
    soup = BeautifulSoup(html, "lxml")
    for tag in soup(["script", "style"]):
        tag.decompose()
    paragraphs = []
    # Prefer <p> tags
    p_tags = soup.find_all("p")
    if p_tags:
        for p in p_tags:
            text = p.get_text(" ", strip=True)
            if text:
                paragraphs.append(text)
    else:
        text = soup.get_text("\n", strip=True)
        paragraphs = [line.strip() for line in text.split("\n") if line.strip()]
    full = "\n\n".join(paragraphs)
    return full, paragraphs


def extract_title(html: str, fallback: str) -> str:
    soup = BeautifulSoup(html, "lxml")
    for tag_name in ["h1", "h2", "h3", "title"]:
        tag = soup.find(tag_name)
        if tag:
            title = tag.get_text(" ", strip=True)
            if title:
                return title
    # Fallback: first non-empty line
    text = soup.get_text("\n", strip=True)
    for line in text.split("\n"):
        line = line.strip()
        if line:
            return line[:120]
    return fallback


def parse():
    book = epub.read_epub(str(EPUB_PATH))
    meta_title = book.get_metadata("DC", "title")
    meta_author = book.get_metadata("DC", "creator")
    print(f"Title: {meta_title}")
    print(f"Author: {meta_author}")

    items = list(book.get_items_of_type(ITEM_DOCUMENT))
    print(f"Total document items: {len(items)}")

    chapters = []
    index = []
    idx = 0

    # Try to use spine order
    spine_ids = [item_id for item_id, _ in book.spine]
    spine_items = []
    for sid in spine_ids:
        item = book.get_item_with_id(sid)
        if item and item.get_type() == ITEM_DOCUMENT:
            spine_items.append(item)
    if not spine_items:
        spine_items = items

    for item in spine_items:
        try:
            html = item.get_content().decode("utf-8", errors="ignore")
        except Exception:
            continue
        title = extract_title(html, item.get_name())
        full, paragraphs = clean_text(html)
        if not full or len(full) < 30:
            # Skip covers/front matter with almost no text
            continue

        # Try to parse chapter number from title
        chap_num_match = re.search(r"chapter\s+(\d+)", title, re.IGNORECASE)
        chap_num = int(chap_num_match.group(1)) if chap_num_match else None

        idx += 1
        cid = f"ch{idx:04d}"
        word_count = len(full.split())
        chapter = {
            "id": cid,
            "index": idx,
            "title": title,
            "chapter_number": chap_num,
            "word_count": word_count,
            "paragraphs": paragraphs,
        }
        # Save individual chapter file
        (OUT_DIR / f"{cid}.json").write_text(
            json.dumps(chapter, ensure_ascii=False), encoding="utf-8"
        )
        index.append(
            {
                "id": cid,
                "index": idx,
                "title": title,
                "chapter_number": chap_num,
                "word_count": word_count,
            }
        )
        if idx % 200 == 0:
            print(f"Processed {idx} chapters...")

    # Save index
    novel_meta = {
        "title": (meta_title[0][0] if meta_title else "Reverend Insanity"),
        "author": (meta_author[0][0] if meta_author else "Gu Zhen Ren"),
        "total_chapters": len(index),
        "total_words": sum(c["word_count"] for c in index),
        "chapters": index,
    }
    (ROOT / "data" / "index.json").write_text(
        json.dumps(novel_meta, ensure_ascii=False), encoding="utf-8"
    )
    print(f"Done. Extracted {len(index)} chapters.")


if __name__ == "__main__":
    parse()
