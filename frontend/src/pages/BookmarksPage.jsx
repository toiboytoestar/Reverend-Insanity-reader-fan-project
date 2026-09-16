import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { getBookmarks, toggleBookmark, updateBookmarkNote } from "@/lib/storage";
import { TID } from "@/lib/testIds";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bookmark, Trash2, ArrowRight } from "lucide-react";

export default function BookmarksPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getBookmarks());
  }, []);

  const remove = (b) => {
    const next = toggleBookmark({ chapterId: b.chapterId });
    setItems(next);
    toast("Bookmark removed", { description: b.title });
  };

  const setNote = (id, note) => {
    setItems(updateBookmarkNote(id, note));
  };

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
      <div className="mb-10">
        <div className="font-label text-[10px] text-orange-400 mb-3">Cultivation Journal</div>
        <h1 className="font-display text-3xl sm:text-5xl text-orange-50">Bookmarks</h1>
        <p className="mt-3 text-slate-400 font-body-serif text-lg">
          Pivotal moments and private notes. Stored locally on this device.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="border border-dashed border-orange-500/20 rounded-sm p-16 text-center">
          <Bookmark className="w-6 h-6 text-orange-500/40 mx-auto mb-4" />
          <div className="font-display text-xl text-orange-50">No bookmarks yet</div>
          <p className="text-slate-400 mt-2 font-body-serif">
            Tap the bookmark icon inside any chapter to save it here.
          </p>
          <Link
            to="/toc"
            className="inline-flex items-center gap-2 mt-6 font-label text-xs text-orange-300 hover:text-orange-200"
          >
            Browse chapters <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((b) => (
            <div
              key={b.chapterId}
              data-testid={TID.bookmarkListItem(b.chapterId)}
              className="border border-orange-500/10 bg-black/30 rounded-sm p-5 hover:border-orange-500/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <Link
                  to={`/read/${b.chapterId}`}
                  className="flex-1 min-w-0 group"
                >
                  <div className="font-label text-[10px] text-orange-500/70">
                    Chapter {b.chapterNumber ?? b.index}
                  </div>
                  <div className="font-display text-lg text-orange-50 mt-1 group-hover:text-orange-300 transition-colors">
                    {b.title}
                  </div>
                  <div className="font-label text-[10px] text-slate-500 mt-1">
                    Saved {new Date(b.createdAt).toLocaleDateString()}
                  </div>
                </Link>
                <Button
                  data-testid={TID.bookmarkRemove(b.chapterId)}
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(b)}
                  className="text-slate-400 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <Textarea
                data-testid={TID.bookmarkNoteInput(b.chapterId)}
                value={b.note || ""}
                onChange={(e) => setNote(b.chapterId, e.target.value)}
                placeholder="Add a note or quote…"
                className="mt-4 bg-black/40 border-orange-500/15 text-orange-50 placeholder:text-slate-500 focus-visible:border-orange-500/50 font-body-serif"
                rows={2}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
