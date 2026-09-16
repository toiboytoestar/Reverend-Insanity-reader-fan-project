import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useSWR from "swr";
import { fetchChapters } from "@/lib/api";
import { getProgress, getBookmarks } from "@/lib/storage";
import { TID } from "@/lib/testIds";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Bookmark, Check, CircleDot, Search, Circle } from "lucide-react";

export default function TocDrawer({ open, onOpenChange, currentId, onNavigate }) {
  const [query, setQuery] = useState("");
  const [progress, setProgressState] = useState({});
  const [bookmarks, setBookmarks] = useState([]);
  const { data } = useSWR(["all-chapters"], () => fetchChapters({}));

  useEffect(() => {
    if (open) {
      setProgressState(getProgress());
      setBookmarks(getBookmarks());
    }
  }, [open]);

  const list = useMemo(() => {
    const items = data?.items || [];
    if (!query.trim()) return items;
    const q = query.trim().toLowerCase();
    return items.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        String(c.chapter_number || "").includes(q) ||
        String(c.index).includes(q)
    );
  }, [data, query]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        data-testid={TID.tocDrawer}
        side="left"
        className="w-full sm:max-w-md bg-[#0B0D0E] border-orange-500/20 text-slate-100 flex flex-col"
      >
        <SheetHeader>
          <SheetTitle className="font-display text-2xl text-orange-50 tracking-widest">
            Chapters
          </SheetTitle>
          <div className="font-label text-[10px] text-orange-400">
            {data?.total?.toLocaleString() || "…"} total
          </div>
        </SheetHeader>
        <div className="relative mt-4">
          <Search className="w-4 h-4 text-orange-500/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            data-testid={TID.tocDrawerSearch}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to a chapter…"
            className="pl-10 bg-black/40 border-orange-500/20 text-orange-50 placeholder:text-slate-500"
          />
        </div>
        <div className="mt-4 flex-1 overflow-y-auto pr-1 space-y-1">
          {list.slice(0, 500).map((c) => {
            const p = progress[c.id];
            const read = !!p?.completed;
            const inProgress = !read && !!p?.pct;
            const isCurrent = c.id === currentId;
            const bookmarked = bookmarks.some((b) => b.chapterId === c.id);
            return (
              <Link
                key={c.id}
                to={`/read/${c.id}`}
                onClick={() => {
                  onNavigate?.();
                  onOpenChange(false);
                }}
                className={`flex items-center gap-3 p-3 rounded-sm border transition-colors ${
                  isCurrent
                    ? "border-orange-500/50 bg-orange-500/10"
                    : "border-transparent hover:border-orange-500/25 hover:bg-orange-500/5"
                }`}
              >
                <div className="font-display text-sm text-orange-500/50 w-10 text-right">
                  {c.chapter_number ?? c.index}
                </div>
                <div className="flex-1 min-w-0 font-body-serif text-sm text-orange-50 truncate">
                  {c.title}
                </div>
                {bookmarked && <Bookmark className="w-3 h-3 text-amber-400" />}
                {read ? (
                  <Check className="w-3.5 h-3.5 text-orange-400" />
                ) : inProgress ? (
                  <CircleDot className="w-3.5 h-3.5 text-orange-500/70" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-slate-700" />
                )}
              </Link>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
