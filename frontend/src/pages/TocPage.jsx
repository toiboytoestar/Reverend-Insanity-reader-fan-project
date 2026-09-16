import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useSWR from "swr";
import { fetchChapters } from "@/lib/api";
import { getProgress, getBookmarks, isBookmarked } from "@/lib/storage";
import { TID } from "@/lib/testIds";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bookmark, Check, CircleDot, Search, Circle } from "lucide-react";

const FILTERS = [
  { id: "all", label: "All", testid: TID.chapterFilterAll },
  { id: "unread", label: "Unread", testid: TID.chapterFilterUnread },
  { id: "read", label: "Read", testid: TID.chapterFilterRead },
  { id: "bookmarked", label: "Bookmarked", testid: TID.chapterFilterBookmarked },
];

export default function TocPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [progress, setProgressState] = useState({});
  const [bookmarks, setBookmarks] = useState([]);
  const [visibleCount, setVisibleCount] = useState(150);

  useEffect(() => {
    setProgressState(getProgress());
    setBookmarks(getBookmarks());
  }, []);

  const { data } = useSWR(["all-chapters"], () => fetchChapters({}));
  const all = data?.items || [];

  const filtered = useMemo(() => {
    let list = all;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          String(c.chapter_number || "").includes(q) ||
          String(c.index).includes(q)
      );
    }
    if (filter === "read") {
      list = list.filter((c) => progress[c.id]?.completed);
    } else if (filter === "unread") {
      list = list.filter((c) => !progress[c.id]?.completed);
    } else if (filter === "bookmarked") {
      const bset = new Set(bookmarks.map((b) => b.chapterId));
      list = list.filter((c) => bset.has(c.id));
    }
    return list;
  }, [all, query, filter, progress, bookmarks]);

  const shown = filtered.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(150);
  }, [query, filter]);

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
      <div className="mb-10">
        <div className="font-label text-[10px] text-emerald-400 mb-3">Table of Contents</div>
        <h1 className="font-display text-3xl sm:text-5xl text-emerald-50">
          The Path — {data?.total?.toLocaleString() || "…"} Chapters
        </h1>
        <p className="mt-3 text-slate-400 font-body-serif text-lg max-w-2xl">
          Search, filter, and jump to any chapter. Your reading progress is remembered on this device.
        </p>
      </div>

      {/* Search & filter bar */}
      <div className="sticky top-[70px] z-30 backdrop-blur-md bg-black/70 border border-emerald-500/10 rounded-sm p-3 sm:p-4 mb-6 flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-emerald-500/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            data-testid={TID.chapterSearchInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chapters by number or title…"
            className="pl-10 bg-black/40 border-emerald-500/20 text-emerald-50 placeholder:text-slate-500 focus-visible:border-emerald-500/60"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {FILTERS.map((f) => (
            <Button
              key={f.id}
              data-testid={f.testid}
              variant="ghost"
              onClick={() => setFilter(f.id)}
              className={`font-label text-[11px] tracking-widest border rounded-sm px-3 sm:px-4 ${
                filter === f.id
                  ? "border-emerald-500/50 text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/15"
                  : "border-transparent text-slate-400 hover:text-emerald-200 hover:bg-emerald-500/5"
              }`}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Chapter grid */}
      {!data ? (
        <div className="text-center py-20 font-label text-xs text-slate-500">Summoning chapters…</div>
      ) : shown.length === 0 ? (
        <div className="text-center py-20">
          <div className="font-display text-xl text-emerald-50">No chapters found</div>
          <p className="text-slate-400 mt-2 font-body-serif">Try a different search or filter.</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
            {shown.map((c) => {
              const p = progress[c.id];
              const read = !!p?.completed;
              const inProgress = !read && !!p?.pct;
              const bookmarked = bookmarks.some((b) => b.chapterId === c.id);
              return (
                <Link
                  key={c.id}
                  to={`/read/${c.id}`}
                  data-testid={TID.chapterListItem(c.id)}
                  className="group border border-emerald-500/10 bg-black/30 p-4 rounded-sm hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-colors flex items-center gap-4"
                >
                  <div className="font-display text-xl text-emerald-500/40 group-hover:text-emerald-400 w-12 text-right">
                    {c.chapter_number ?? c.index}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-body-serif text-base text-emerald-50 truncate">{c.title}</div>
                    <div className="font-label text-[10px] text-slate-500 mt-1">
                      {c.word_count.toLocaleString()} words
                      {inProgress && (
                        <span className="ml-2 text-emerald-400">· {Math.round(p.pct * 100)}%</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {bookmarked && <Bookmark className="w-3.5 h-3.5 text-amber-400" />}
                    {read ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : inProgress ? (
                      <CircleDot className="w-4 h-4 text-emerald-500/70" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
          {visibleCount < filtered.length && (
            <div className="mt-8 text-center">
              <Button
                onClick={() => setVisibleCount((v) => v + 300)}
                variant="outline"
                className="border-emerald-500/30 text-emerald-200 hover:bg-emerald-500/10 font-label tracking-widest text-xs px-6"
              >
                Load more ({filtered.length - visibleCount} remaining)
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
