import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { getHistory, clearHistory } from "@/lib/storage";
import { TID } from "@/lib/testIds";
import { Button } from "@/components/ui/button";
import { History, Trash2, ArrowRight } from "lucide-react";

function timeAgo(ms) {
  const s = Math.floor((Date.now() - ms) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(ms).toLocaleDateString();
}

export default function HistoryPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getHistory());
  }, []);

  const wipe = () => {
    clearHistory();
    setItems([]);
    toast("History cleared");
  };

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <div className="font-label text-[10px] text-orange-400 mb-3">Recently Read</div>
          <h1 className="font-display text-3xl sm:text-5xl text-orange-50">History</h1>
          <p className="mt-3 text-slate-400 font-body-serif text-lg">
            Your last 50 chapters. Stored locally on this device.
          </p>
        </div>
        {items.length > 0 && (
          <Button
            data-testid={TID.historyClearBtn}
            variant="outline"
            onClick={wipe}
            className="border-rose-500/30 text-rose-300 hover:bg-rose-500/10 font-label tracking-widest text-[11px]"
          >
            <Trash2 className="w-3.5 h-3.5 mr-2" /> Clear
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="border border-dashed border-orange-500/20 rounded-sm p-16 text-center">
          <History className="w-6 h-6 text-orange-500/40 mx-auto mb-4" />
          <div className="font-display text-xl text-orange-50">No history yet</div>
          <p className="text-slate-400 mt-2 font-body-serif">
            Open any chapter and it will appear here.
          </p>
          <Link
            to="/toc"
            className="inline-flex items-center gap-2 mt-6 font-label text-xs text-orange-300 hover:text-orange-200"
          >
            Browse chapters <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((h) => (
            <Link
              key={h.chapterId}
              to={`/read/${h.chapterId}`}
              data-testid={TID.historyItem(h.chapterId)}
              className="group flex items-center gap-4 border border-orange-500/10 bg-black/30 p-4 rounded-sm hover:border-orange-500/40 hover:bg-orange-500/5 transition-colors"
            >
              <div className="font-display text-xl text-orange-500/40 group-hover:text-orange-400 w-14 text-right">
                {h.chapterNumber ?? h.index}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-body-serif text-base text-orange-50 truncate">{h.title}</div>
                <div className="font-label text-[10px] text-slate-500 mt-1">{timeAgo(h.visitedAt)}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-orange-500/40 group-hover:text-orange-300" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
