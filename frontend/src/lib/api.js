// Static-first data layer for Reverend Insanity Reader.
// By default we fetch chapter JSON files served from /public/data/*, which makes
// the app deployable to any static host (Vercel, Netlify, GitHub Pages, S3, etc.)
// without a backend. If REACT_APP_BACKEND_URL is set to a real API base, we use
// that instead so the same code works with the FastAPI dev backend.

import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";
const USE_BACKEND =
  !!BACKEND_URL &&
  process.env.REACT_APP_USE_BACKEND !== "false" &&
  process.env.REACT_APP_STATIC_ONLY !== "1";

export const API = USE_BACKEND ? `${BACKEND_URL}/api` : "";

// Novel metadata (identical to backend response, inlined for static builds)
const NOVEL_META = {
  title: "Reverend Insanity",
  chinese_title: "蛊真人 (Gu Zhen Ren)",
  author: "Gu Zhen Ren",
  translator: "Fan translation",
  status: "Discontinued at Chapter 2334",
  genre: ["Xianxia", "Dark Fantasy", "Anti-hero", "Cultivation", "Time Travel"],
  tags: ["Gu Refining", "Ruthless MC", "Immortals", "Reincarnation", "Schemes", "Dao"],
  rating: 4.9,
  synopsis:
    "Humans are clever in tens of thousands of ways, Gu are the true refined essences of Heaven and Earth. The Three Temples are unrighteous, the demon is reborn. Reincarnated after five hundred years, Fang Yuan returns to his youth with the memories of an era. To once again seek immortality, he shall walk a path steeped in blood — refining Gu, scheming across nations, defying Heaven, and forging a legend that even Heaven itself cannot erase.",
  quote: '"The heart of a demon never has regret, even in death." — Fang Yuan',
};

// ---------- Static implementation ----------
let _indexCache = null;
async function loadIndex() {
  if (_indexCache) return _indexCache;
  const res = await fetch(`${process.env.PUBLIC_URL || ""}/data/index.json`);
  if (!res.ok) throw new Error(`Failed to load chapter index (${res.status})`);
  _indexCache = await res.json();
  return _indexCache;
}

async function staticFetchNovel() {
  const idx = await loadIndex();
  return {
    ...NOVEL_META,
    total_chapters: idx.total_chapters,
    total_words: idx.total_words,
  };
}

async function staticFetchChapters({ q, limit, offset = 0 } = {}) {
  const idx = await loadIndex();
  let chapters = idx.chapters;
  if (q) {
    const needle = String(q).trim().toLowerCase();
    if (needle) {
      chapters = chapters.filter(
        (c) =>
          c.title.toLowerCase().includes(needle) ||
          String(c.chapter_number || "").includes(needle)
      );
    }
  }
  const total = chapters.length;
  if (limit) chapters = chapters.slice(offset, offset + limit);
  return { total, offset, items: chapters };
}

async function staticFetchChapter(id) {
  const idx = await loadIndex();
  let chapterId = id;
  if (/^\d+$/.test(String(id))) {
    const n = parseInt(id, 10);
    if (n >= 1 && n <= idx.chapters.length) chapterId = idx.chapters[n - 1].id;
  }
  const res = await fetch(`${process.env.PUBLIC_URL || ""}/data/chapters/${chapterId}.json`);
  if (!res.ok) throw new Error(`Chapter not found (${res.status})`);
  const chapter = await res.json();
  const currentIdx = chapter.index;
  const prev = currentIdx > 1 ? idx.chapters[currentIdx - 2] : null;
  const next = currentIdx < idx.chapters.length ? idx.chapters[currentIdx] : null;
  return { ...chapter, total: idx.chapters.length, prev, next };
}

// ---------- Backend implementation (dev-only) ----------
const api = axios.create({ baseURL: API });

const backendFetchNovel = () => api.get("/novel").then((r) => r.data);
const backendFetchChapters = (params = {}) =>
  api.get("/chapters", { params }).then((r) => r.data);
const backendFetchChapter = (id) => api.get(`/chapters/${id}`).then((r) => r.data);

// ---------- Public API ----------
export const fetchNovel = USE_BACKEND ? backendFetchNovel : staticFetchNovel;
export const fetchChapters = USE_BACKEND ? backendFetchChapters : staticFetchChapters;
export const fetchChapter = USE_BACKEND ? backendFetchChapter : staticFetchChapter;

export const DATA_MODE = USE_BACKEND ? "backend" : "static";
