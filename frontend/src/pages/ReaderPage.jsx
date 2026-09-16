import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import useSWR from "swr";
import { toast } from "sonner";
import { fetchChapter } from "@/lib/api";
import {
  getBookmarks,
  isBookmarked,
  setLastRead,
  setProgress,
  toggleBookmark,
  getProgress,
  pushHistory,
  recordChapterComplete,
} from "@/lib/storage";
import { getCultivationRank } from "@/lib/cultivation";
import { useReaderSettings, widthMap, fontFamilyMap } from "@/context/ReaderSettings";
import ReaderSettingsPanel from "@/components/ReaderSettingsPanel";
import TocDrawer from "@/components/TocDrawer";
import KeyboardShortcutsModal from "@/components/KeyboardShortcutsModal";
import { TID } from "@/lib/testIds";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ListOrdered,
  Settings,
  Keyboard,
  ArrowUp,
  Home,
  Maximize2,
  Minimize2,
} from "lucide-react";

const WIDTH_ORDER = ["narrow", "medium", "wide", "full"];

export default function ReaderPage() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const { settings, update } = useReaderSettings();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [distractionFree, setDistractionFree] = useState(false);
  const restoredRef = useRef(false);
  const contentRef = useRef(null);

  const { data: chapter, isLoading } = useSWR(
    chapterId ? ["chapter", chapterId] : null,
    () => fetchChapter(chapterId)
  );

  // Track last read + history
  useEffect(() => {
    if (chapterId) setLastRead(chapterId);
  }, [chapterId]);

  useEffect(() => {
    if (!chapter) return;
    pushHistory({
      chapterId: chapter.id,
      index: chapter.index,
      chapterNumber: chapter.chapter_number,
      title: chapter.title,
    });
  }, [chapter?.id]);

  // Bookmark state
  useEffect(() => {
    setBookmarked(isBookmarked(chapterId));
  }, [chapterId]);

  // Restore scroll position on load
  useEffect(() => {
    if (!chapter) return;
    restoredRef.current = false;
    const p = getProgress()[chapter.id];
    if (p?.pct && p.pct < 0.98) {
      requestAnimationFrame(() => {
        const doc = document.documentElement;
        const total = doc.scrollHeight - window.innerHeight;
        window.scrollTo({ top: total * p.pct, behavior: "auto" });
        restoredRef.current = true;
      });
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
      restoredRef.current = true;
    }
  }, [chapter?.id]);

  // Track scroll progress + save + celebrate first completion
  useEffect(() => {
    if (!chapter) return;
    let raf = null;
    let saveTimer = null;
    let celebrated = false;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const total = Math.max(1, doc.scrollHeight - window.innerHeight);
        const pct = Math.min(1, Math.max(0, window.scrollY / total));
        setScrollPct(pct);
        if (restoredRef.current) {
          clearTimeout(saveTimer);
          saveTimer = setTimeout(() => {
            setProgress(chapter.id, pct, pct >= 0.95);
          }, 400);
          // First-time completion celebration
          if (pct >= 0.95 && !celebrated) {
            celebrated = true;
            const result = recordChapterComplete(chapter.id);
            if (result.wasNew) {
              const before = result.todayCount - 1;
              const hitGoal = before < result.goal && result.todayCount >= result.goal;
              const streakUp = result.streak.current > 1 && result.streak.lastDay === new Date().toISOString().slice(0, 10);
              // Cultivation rank up?
              const totalCompleted = Object.values(getProgress()).filter((v) => v.completed).length;
              const rankBefore = getCultivationRank(totalCompleted - 1);
              const rankAfter = getCultivationRank(totalCompleted);
              if (rankAfter.rank > rankBefore.rank) {
                toast(`Ascended to ${rankAfter.title}`, {
                  description: `${rankAfter.label} · ${totalCompleted.toLocaleString()} chapters cultivated`,
                });
              } else if (hitGoal) {
                toast(`Daily goal complete — ${result.todayCount}/${result.goal}`, {
                  description: streakUp ? `${result.streak.current}-day streak alive` : "Rest well, cultivator.",
                });
              } else if (streakUp) {
                toast(`${result.streak.current}-day streak`, {
                  description: `${result.todayCount}/${result.goal} chapters today`,
                });
              } else {
                toast("Chapter complete", {
                  description: `${result.todayCount}/${result.goal} chapters today`,
                });
              }
            }
          }
        }
        raf = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(saveTimer);
    };
  }, [chapter?.id]);

  const goPrev = useCallback(() => {
    if (chapter?.prev) navigate(`/read/${chapter.prev.id}`);
  }, [chapter, navigate]);
  const goNext = useCallback(() => {
    if (chapter?.next) navigate(`/read/${chapter.next.id}`);
  }, [chapter, navigate]);

  const handleBookmark = useCallback(() => {
    if (!chapter) return;
    const next = toggleBookmark({
      chapterId: chapter.id,
      index: chapter.index,
      chapterNumber: chapter.chapter_number,
      title: chapter.title,
    });
    const on = next.some((b) => b.chapterId === chapter.id);
    setBookmarked(on);
    toast(on ? "Bookmarked" : "Bookmark removed", { description: chapter.title });
  }, [chapter]);

  const cycleWidth = useCallback(() => {
    const idx = WIDTH_ORDER.indexOf(settings.width);
    update({ width: WIDTH_ORDER[(idx + 1) % WIDTH_ORDER.length] });
  }, [settings.width, update]);

  const toggleDistractionFree = useCallback(async () => {
    setDistractionFree((v) => {
      const next = !v;
      try {
        if (next && !document.fullscreenElement) {
          document.documentElement.requestFullscreen?.().catch(() => {});
        } else if (!next && document.fullscreenElement) {
          document.exitFullscreen?.().catch(() => {});
        }
      } catch (_) {}
      return next;
    });
  }, []);

  // Sync internal state if user exits native fullscreen via Esc
  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) setDistractionFree(false);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowRight" || e.key === "j" || e.key === "J" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft" || e.key === "k" || e.key === "K") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "b" || e.key === "B") {
        handleBookmark();
      } else if (e.key === "s" || e.key === "S") {
        setSettingsOpen((v) => !v);
      } else if (e.key === "t" || e.key === "T") {
        setTocOpen((v) => !v);
      } else if (e.key === "f" || e.key === "F") {
        cycleWidth();
      } else if (e.key === "z" || e.key === "Z") {
        toggleDistractionFree();
      } else if (e.key === "?") {
        setShortcutsOpen((v) => !v);
      } else if (e.key === "Escape") {
        setSettingsOpen(false);
        setTocOpen(false);
        setShortcutsOpen(false);
        if (distractionFree) toggleDistractionFree();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, handleBookmark, cycleWidth, toggleDistractionFree, distractionFree]);

  const themeClass = `reader-theme-${settings.theme}`;
  const widthClass = widthMap[settings.width] || widthMap.medium;
  const fontClass = fontFamilyMap[settings.fontFamily] || fontFamilyMap.serif;

  const readingTime = useMemo(
    () => (chapter ? Math.max(1, Math.round(chapter.word_count / 250)) : 0),
    [chapter]
  );

  return (
    <div className={`min-h-screen ${themeClass} reader-pane`} data-testid={TID.readerContainer}>
      {/* Top bar */}
      {!distractionFree && (
      <div className="sticky top-0 z-30 backdrop-blur-md" style={{ background: "color-mix(in oklab, var(--reader-bg) 80%, transparent)" }}>
        <div className="border-b" style={{ borderColor: "var(--reader-border)" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1 sm:gap-2 min-w-0">
              <Button
                data-testid={TID.readerBackBtn}
                variant="ghost"
                size="icon"
                onClick={() => navigate("/toc")}
                className="hover:bg-white/5"
                style={{ color: "var(--reader-muted)" }}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Link to="/" className="hidden sm:flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
                <Home className="w-4 h-4" style={{ color: "var(--reader-muted)" }} />
              </Link>
              <div className="min-w-0">
                <div className="font-label text-[10px]" style={{ color: "var(--reader-muted)" }}>
                  {chapter ? `Chapter ${chapter.chapter_number ?? chapter.index} · ${chapter.index}/${chapter.total}` : "Loading"}
                </div>
                <div className="font-body-serif text-sm truncate" style={{ color: "var(--reader-text)" }}>
                  {chapter?.title || "…"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                data-testid={TID.readerTocBtn}
                variant="ghost"
                size="icon"
                onClick={() => setTocOpen(true)}
                className="hover:bg-white/5"
                style={{ color: "var(--reader-muted)" }}
              >
                <ListOrdered className="w-4 h-4" />
              </Button>
              <Button
                data-testid={TID.readerBookmark}
                variant="ghost"
                size="icon"
                onClick={handleBookmark}
                className="hover:bg-white/5"
                style={{ color: bookmarked ? "var(--reader-accent)" : "var(--reader-muted)" }}
              >
                {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </Button>
              <Button
                data-testid={TID.readerSettingsBtn}
                variant="ghost"
                size="icon"
                onClick={() => setSettingsOpen(true)}
                className="hover:bg-white/5"
                style={{ color: "var(--reader-muted)" }}
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                data-testid={TID.readerFullscreenBtn}
                variant="ghost"
                size="icon"
                onClick={toggleDistractionFree}
                className="hover:bg-white/5"
                style={{ color: "var(--reader-muted)" }}
                title="Distraction-free (Z)"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
              <Button
                data-testid={TID.readerShortcutsBtn}
                variant="ghost"
                size="icon"
                onClick={() => setShortcutsOpen(true)}
                className="hover:bg-white/5 hidden sm:inline-flex"
                style={{ color: "var(--reader-muted)" }}
              >
                <Keyboard className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-0.5 w-full" style={{ background: "color-mix(in oklab, var(--reader-border) 60%, transparent)" }}>
            <div
              data-testid={TID.readerProgress}
              className="h-full transition-[width] duration-150"
              style={{ width: `${scrollPct * 100}%`, background: "var(--reader-accent)" }}
            />
          </div>
        </div>
      </div>
      )}

      {/* Floating exit fullscreen */}
      {distractionFree && (
        <button
          data-testid={TID.readerExitFullscreenBtn}
          onClick={toggleDistractionFree}
          className="fixed top-4 right-4 z-40 w-10 h-10 rounded-full grid place-items-center border backdrop-blur-md hover:opacity-100 opacity-40 transition-opacity"
          style={{ background: "color-mix(in oklab, var(--reader-bg) 70%, transparent)", borderColor: "var(--reader-border)", color: "var(--reader-muted)" }}
          title="Exit distraction-free (Z or Esc)"
        >
          <Minimize2 className="w-4 h-4" />
        </button>
      )}

      {/* Chapter content */}
      <div className={`mx-auto px-5 sm:px-8 py-10 sm:py-16 ${widthClass}`}>
        {isLoading || !chapter ? (
          <div className="font-label text-xs opacity-60 text-center py-20">Unfurling scroll…</div>
        ) : (
          <article ref={contentRef} data-testid={TID.readerContent}>
            <div className="font-label text-[11px] opacity-60 tracking-widest">
              Chapter {chapter.chapter_number ?? chapter.index}
            </div>
            <h1
              data-testid={TID.readerTitle}
              className="font-display mt-3 text-3xl sm:text-4xl lg:text-5xl leading-tight"
              style={{ color: "var(--reader-text)" }}
            >
              {chapter.title}
            </h1>
            <div className="mt-3 font-label text-[10px] opacity-60 tracking-widest">
              {chapter.word_count.toLocaleString()} words · ~{readingTime} min read
            </div>
            <div className="my-8 divider-jade opacity-40" style={{ background: "linear-gradient(90deg, transparent, var(--reader-accent), transparent)" }} />

            <div
              className={`${fontClass} space-y-6`}
              style={{
                fontSize: `${settings.fontSize}px`,
                lineHeight: settings.lineHeight,
                letterSpacing: `${settings.letterSpacing}em`,
                color: "var(--reader-text)",
              }}
            >
              {chapter.paragraphs.map((p, i) => (
                <p key={i} style={{ marginBottom: `${settings.paragraphSpacing}em` }}>
                  {p}
                </p>
              ))}
            </div>

            {/* Chapter nav bottom */}
            <div className="mt-16 pt-8 border-t flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between" style={{ borderColor: "var(--reader-border)" }}>
              {chapter.prev ? (
                <Link
                  to={`/read/${chapter.prev.id}`}
                  data-testid={TID.readerPrev}
                  className="group flex items-center gap-3 border p-4 rounded-sm hover:bg-white/5 transition-colors flex-1"
                  style={{ borderColor: "var(--reader-border)" }}
                >
                  <ArrowLeft className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                  <div className="min-w-0">
                    <div className="font-label text-[10px] opacity-60">Previous</div>
                    <div className="font-body-serif text-sm truncate">{chapter.prev.title}</div>
                  </div>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
              {chapter.next ? (
                <Link
                  to={`/read/${chapter.next.id}`}
                  data-testid={TID.readerNext}
                  className="group flex items-center gap-3 border p-4 rounded-sm hover:bg-white/5 transition-colors flex-1 justify-end text-right"
                  style={{ borderColor: "var(--reader-border)" }}
                >
                  <div className="min-w-0">
                    <div className="font-label text-[10px] opacity-60">Next</div>
                    <div className="font-body-serif text-sm truncate">{chapter.next.title}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                </Link>
              ) : (
                <div className="flex-1" />
              )}
            </div>
          </article>
        )}
      </div>

      {/* Mobile floating bottom bar */}
      {!distractionFree && (
      <div
        className="sm:hidden fixed bottom-0 inset-x-0 z-30 border-t backdrop-blur-md"
        style={{ background: "color-mix(in oklab, var(--reader-bg) 85%, transparent)", borderColor: "var(--reader-border)" }}
      >
        <div className="grid grid-cols-5">
          <button onClick={goPrev} disabled={!chapter?.prev} className="py-3 disabled:opacity-30" style={{ color: "var(--reader-muted)" }}>
            <ArrowLeft className="w-5 h-5 mx-auto" />
          </button>
          <button onClick={() => setTocOpen(true)} className="py-3" style={{ color: "var(--reader-muted)" }}>
            <ListOrdered className="w-5 h-5 mx-auto" />
          </button>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="py-3" style={{ color: "var(--reader-muted)" }}>
            <ArrowUp className="w-5 h-5 mx-auto" />
          </button>
          <button onClick={() => setSettingsOpen(true)} className="py-3" style={{ color: "var(--reader-muted)" }}>
            <Settings className="w-5 h-5 mx-auto" />
          </button>
          <button onClick={goNext} disabled={!chapter?.next} className="py-3 disabled:opacity-30" style={{ color: "var(--reader-muted)" }}>
            <ArrowRight className="w-5 h-5 mx-auto" />
          </button>
        </div>
      </div>
      )}

      <ReaderSettingsPanel open={settingsOpen} onOpenChange={setSettingsOpen} />
      <TocDrawer open={tocOpen} onOpenChange={setTocOpen} currentId={chapter?.id} />
      <KeyboardShortcutsModal open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
    </div>
  );
}
