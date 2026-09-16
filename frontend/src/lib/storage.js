// LocalStorage utilities for reader state (no accounts)
const K = {
  SETTINGS: "ri:settings",
  PROGRESS: "ri:progress", // { [chapterId]: { pct, completed, updatedAt } }
  LAST: "ri:last",         // last read chapterId
  BOOKMARKS: "ri:bookmarks", // [{ chapterId, index, title, note, createdAt }]
  HISTORY: "ri:history",   // [{ chapterId, index, chapterNumber, title, visitedAt }] most recent first
};

const HISTORY_LIMIT = 50;

const safeParse = (raw, fallback) => {
  try { return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
};

export const DEFAULT_SETTINGS = {
  theme: "dark",           // dark | sepia | light | black
  fontFamily: "serif",     // serif | sans | mono
  fontSize: 18,            // 12 - 32
  lineHeight: 1.75,        // 1.2 - 2.2
  letterSpacing: 0,        // -0.02 - 0.08 em
  width: "medium",         // narrow | medium | wide | full
  paragraphSpacing: 1.1,   // multiplier
};

export const getSettings = () => ({ ...DEFAULT_SETTINGS, ...safeParse(localStorage.getItem(K.SETTINGS), {}) });
export const saveSettings = (s) => localStorage.setItem(K.SETTINGS, JSON.stringify(s));

export const getProgress = () => safeParse(localStorage.getItem(K.PROGRESS), {});
export const setProgress = (chapterId, pct, completed = false) => {
  const p = getProgress();
  p[chapterId] = { pct, completed, updatedAt: Date.now() };
  localStorage.setItem(K.PROGRESS, JSON.stringify(p));
};

export const getLastRead = () => localStorage.getItem(K.LAST) || null;
export const setLastRead = (chapterId) => localStorage.setItem(K.LAST, chapterId);

export const getBookmarks = () => safeParse(localStorage.getItem(K.BOOKMARKS), []);
export const toggleBookmark = (entry) => {
  const list = getBookmarks();
  const i = list.findIndex((b) => b.chapterId === entry.chapterId);
  if (i >= 0) list.splice(i, 1);
  else list.unshift({ ...entry, createdAt: Date.now() });
  localStorage.setItem(K.BOOKMARKS, JSON.stringify(list));
  return getBookmarks();
};
export const isBookmarked = (chapterId) =>
  getBookmarks().some((b) => b.chapterId === chapterId);
export const updateBookmarkNote = (chapterId, note) => {
  const list = getBookmarks();
  const item = list.find((b) => b.chapterId === chapterId);
  if (item) {
    item.note = note;
    localStorage.setItem(K.BOOKMARKS, JSON.stringify(list));
  }
  return getBookmarks();
};

export const getHistory = () => safeParse(localStorage.getItem(K.HISTORY), []);
export const pushHistory = (entry) => {
  const list = getHistory().filter((h) => h.chapterId !== entry.chapterId);
  list.unshift({ ...entry, visitedAt: Date.now() });
  if (list.length > HISTORY_LIMIT) list.length = HISTORY_LIMIT;
  localStorage.setItem(K.HISTORY, JSON.stringify(list));
  return list;
};
export const clearHistory = () => localStorage.setItem(K.HISTORY, JSON.stringify([]));

// Compute the maximum chapter index the user has visited (for overall progress)
export const getFurthestIndex = () => {
  const progress = getProgress();
  const history = getHistory();
  let max = 0;
  for (const h of history) if (h.index > max) max = h.index;
  for (const cid of Object.keys(progress)) {
    const m = cid.match(/^ch(\d+)$/i);
    if (m) {
      const n = parseInt(m[1], 10);
      if (n > max) max = n;
    }
  }
  return max;
};
