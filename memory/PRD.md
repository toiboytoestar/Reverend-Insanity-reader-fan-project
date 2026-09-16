# Reverend Insanity Reader — PRD

## Problem Statement
"This is epub of novel reverend insanity. Please create website like lotm reader and orv reader to read the novel chapterwise with best website interface a novel can have. And add all the features that orv reader and lotm reader have to read the novel."

## User Choices (Feb 2026)
- All essential reader features
- No user accounts (LocalStorage only)
- Dark cultivation / xianxia aesthetic (designer's discretion)
- Four reader themes: Dark, Sepia, Light, Black

## Architecture
- **Backend**: FastAPI, serves 2,335 chapters parsed from `Reverend_Insanity.epub`. Chapters stored as JSON files in `backend/data/chapters/` with a master `backend/data/index.json`.
  - `GET /api/novel` — metadata + stats
  - `GET /api/chapters` — list, supports `q`, `limit`, `offset`
  - `GET /api/chapters/{id}` — chapter content + prev/next (accepts `ch0001` or numeric alias)
- **Frontend**: React + Tailwind + shadcn/ui. Routes `/`, `/toc`, `/read/:chapterId`, `/bookmarks`.
- **State**: LocalStorage keys `ri:settings`, `ri:progress`, `ri:last`, `ri:bookmarks`. No accounts.

## What's Implemented (Feb 2026 — Iteration 1)
- Parsed the EPUB into 2,335 chapters (~4.87M words), individual JSON files served by FastAPI.
- Landing page with hero, synopsis, Fang Yuan quote, genre badges, book cover image, stats grid, feature highlights, preview chapters.
- Table of Contents page with sticky search bar, 4 filters (All/Unread/Read/Bookmarked), chapter grid, "Load more" pagination (150 → +300).
- Reader page with prev/next, sticky top bar (back/toc/bookmark/settings/keyboard), scroll progress bar, restored scroll position on return, bottom navigation cards, mobile floating action bar.
- Reader Settings Sheet: 4 themes (Gu Abyss/Ancient Scroll/Imperial Jade/Void Realm), font family (serif/sans/mono), font size (12–32px), line height (1.2–2.2), letter spacing, column width (narrow/medium/wide/full), reset.
- Keyboard shortcuts: →/j/Space next · ←/k prev · b bookmark · s settings · t toc · f cycle width · ? help · Esc close.
- Bookmarks page with per-bookmark notes stored in LocalStorage.
- Xianxia aesthetic: Cinzel Decorative + Cormorant Garamond typography, jade emerald accents, obsidian/void backgrounds, glass-morphism headers.

## Prioritized Backlog
- **P1** Volume grouping (Volumes I–IX) in ToC and reader header.
- **P1** Reading streak / stats page (daily words read, chapters completed).
- **P2** Full-text chapter search (currently searches titles/numbers only).
- **P2** Export / import bookmarks & progress JSON for cross-device migration.
- **P2** Text-to-speech playback with sentence highlighting.
- **P2** Optional discussion / comments per chapter (would require accounts).

## Test Credentials
None — app has no authentication.
