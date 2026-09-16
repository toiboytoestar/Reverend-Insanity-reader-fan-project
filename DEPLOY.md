# Deploying to Vercel

The Reverend Insanity Reader is a **fully static React app** — the 2,335 chapters live as JSON files under `frontend/public/data/`, so it deploys to any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages, S3+CloudFront) with **no backend required**.

## One-time setup

1. Push this repo to GitHub / GitLab / Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Set the **Root Directory** to `frontend`.
4. Vercel auto-detects **Create React App**, keep defaults:
   - Install Command: `yarn install --frozen-lockfile`
   - Build Command: `yarn build`
   - Output Directory: `build`
5. **Environment Variables**: leave empty. The app runs static-first by default.
   - Optional: set `REACT_APP_BACKEND_URL` to point at a hosted FastAPI backend if you want dynamic serving instead of static files.
6. Click **Deploy**.

That's it — the deep-linkable SPA routes (`/toc`, `/read/ch0234`, `/history`, `/bookmarks`) are handled by the SPA rewrites in `frontend/vercel.json`, and chapter JSONs are served with 1-year `immutable` cache headers.

## Local dev

```bash
cd frontend
yarn install
yarn start
```

Chapters are served from `public/data/`. The optional FastAPI backend at `../backend/server.py` is only needed for local API development.

## Rebuilding chapter data from the EPUB

If you replace the source EPUB:

```bash
cd backend
python parse_epub.py            # writes to backend/data/
cd ../frontend
rm -rf public/data
node scripts/prepare-data.js    # copies backend/data -> public/data
```

## Other static hosts

- **Netlify**: base = `frontend`, publish = `frontend/build`. Add `_redirects` with `/* /index.html 200` (or copy the rewrites from `vercel.json`).
- **Cloudflare Pages**: build command `yarn build`, output `build`, root `frontend`. Add `_redirects` as above.
- **GitHub Pages**: run `yarn build`, push `frontend/build` to `gh-pages` branch. Set `homepage` in package.json or use HashRouter.

## Notes

- Total deployed bundle: ~34 MB of chapter JSON + ~500 KB of JS/CSS.
- Every chapter is served with `Cache-Control: public, max-age=31536000, immutable`, so repeat reads are instant and free of bandwidth on Vercel's edge network.
- Reader state (progress, bookmarks, streak, rank) lives in the browser's `localStorage` — nothing is sent to any server.
