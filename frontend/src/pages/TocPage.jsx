import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useSWR from "swr";
import { fetchChapters, fetchNovel } from "@/lib/api";
import { getProgress, getBookmarks, getLastRead } from "@/lib/storage";
import { TID } from "@/lib/testIds";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  Check,
  CircleDot,
  Search,
  Circle,
  ArrowLeft,
  BookOpen,
  Download,
  ArrowUpDown,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TiltCover from "@/components/TiltCover";
import BookCover from "@/components/BookCover";
import { ARCS, getArc } from "@/lib/volumes";
import { toRoman } from "@/lib/roman";

const HERO_IMG =
  "https://images.unsplash.com/photo-1755543832265-aa4a6b8c1414?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzR8MHwxfHNlYXJjaHwyfHxhbmNpZW50JTIwZGFyayUyMGZhbnRhc3klMjBib29rJTIwdGV4dHVyZSUyMGNvdmVyJTIwYXJ0d29ya3xlbnwwfHx8fDE3ODk1NDk1MDN8MA&ixlib=rb-4.1.0&q=85";

// Chapters are grouped by the seven Reverend Insanity regional arcs
// (see /lib/volumes.js).

const FILTERS = [
  { id: "all", label: "All", testid: TID.chapterFilterAll },
  { id: "unread", label: "Unread", testid: TID.chapterFilterUnread },
  { id: "read", label: "Read", testid: TID.chapterFilterRead },
  { id: "bookmarked", label: "Bookmarked", testid: TID.chapterFilterBookmarked },
];

export default function TocPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [arc, setArc] = useState("all");
  const [sortDesc, setSortDesc] = useState(false);
  const [progress, setProgressState] = useState({});
  const [bookmarks, setBookmarks] = useState([]);
  const [visibleCount, setVisibleCount] = useState(120);
  const [lastReadId, setLastReadId] = useState(null);

  useEffect(() => {
    setProgressState(getProgress());
    setBookmarks(getBookmarks());
    setLastReadId(getLastRead());
  }, []);

  const { data: novel } = useSWR("novel", fetchNovel);
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
    if (filter === "read") list = list.filter((c) => progress[c.id]?.completed);
    else if (filter === "unread") list = list.filter((c) => !progress[c.id]?.completed);
    else if (filter === "bookmarked") {
      const bset = new Set(bookmarks.map((b) => b.chapterId));
      list = list.filter((c) => bset.has(c.id));
    }
    if (arc !== "all") {
      const arcId = parseInt(arc, 10);
      list = list.filter((c) => getArc(c.chapter_number, c.index).id === arcId);
    }
    if (sortDesc) list = [...list].reverse();
    return list;
  }, [all, query, filter, arc, sortDesc, progress, bookmarks]);

  const shown = filtered.slice(0, visibleCount);

  // Group visible chapters by arc, and compute per-arc progress from ALL chapters
  const arcProgress = useMemo(() => {
    const map = {};
    for (const c of all) {
      const a = getArc(c.chapter_number, c.index);
      if (!map[a.id]) map[a.id] = { total: 0, read: 0 };
      map[a.id].total++;
      if (progress[c.id]?.completed) map[a.id].read++;
    }
    return map;
  }, [all, progress]);

  const groupedShown = useMemo(() => {
    const groups = [];
    let current = null;
    for (const c of shown) {
      const a = getArc(c.chapter_number, c.index);
      if (!current || current.arc.id !== a.id) {
        current = { arc: a, chapters: [] };
        groups.push(current);
      }
      current.chapters.push(c);
    }
    return groups;
  }, [shown]);

  useEffect(() => {
    setVisibleCount(120);
  }, [query, filter, arc, sortDesc]);

  return (
    <div className="fog-bg min-h-[calc(100vh-72px)] relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
        <button
          onClick={() => navigate("/")}
          className="mb-6 inline-flex items-center gap-2 text-slate-400 hover:text-orange-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-label text-[11px]">Back</span>
        </button>

        <div className="grid lg:grid-cols-[minmax(0,320px)_1fr] gap-8 lg:gap-12">
          {/* Left: sticky book column */}
          <aside className="lg:sticky lg:top-24 self-start">
            <div className="relative">
              <div className="absolute -inset-6 orange-halo opacity-40 blur-2xl pointer-events-none" />
              <TiltCover className="relative aspect-[3/4] rounded-md overflow-hidden ring-1 ring-white/10 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.8)] max-w-[280px] mx-auto lg:mx-0 cursor-pointer">
                <BookCover />
              </TiltCover>
            </div>

            <h1 className="mt-6 font-display text-2xl sm:text-3xl text-slate-100">
              Reverend Insanity
            </h1>
            <div className="mt-1 font-label text-[10px] text-slate-500">
              By · Gu Zhen Ren (蛊真人)
            </div>

            <div className="mt-5 flex items-center gap-2">
              <Button
                onClick={() =>
                  navigate(lastReadId ? `/read/${lastReadId}` : "/read/ch0002")
                }
                className="flex-1 rounded-md bg-violet-500/90 hover:bg-violet-500 text-white font-medium h-11 text-sm"
                data-testid="start-reading-btn"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                {lastReadId ? "Continue Reading" : "Start Reading"}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/bookmarks")}
                className="h-11 w-11 rounded-md bg-white/5 border border-white/10 text-slate-300 hover:text-orange-300 hover:border-orange-400/40"
                title="Bookmarks"
              >
                <Bookmark className="w-4 h-4" />
              </Button>
            </div>

            {novel && (
              <p className="mt-6 font-body-serif text-slate-400 text-[15px] leading-relaxed">
                {novel.synopsis}
              </p>
            )}
          </aside>

          {/* Right: chapter list */}
          <div>
            {/* Search + filters bar */}
            <div className="sticky top-[76px] z-20 backdrop-blur-md bg-black/60 border border-white/10 rounded-lg p-2 mb-4 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input
                  data-testid={TID.chapterSearchInput}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search title or number..."
                  className="pl-10 bg-black/40 border-white/5 text-slate-100 placeholder:text-slate-500 focus-visible:border-orange-400/40 focus-visible:ring-orange-400/20 h-10"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSortDesc((v) => !v)}
                className="h-10 w-10 bg-white/5 border border-white/10 text-slate-300 hover:text-orange-300 hover:border-orange-400/40"
                title={sortDesc ? "Sort ascending" : "Sort descending"}
                data-testid="sort-toggle"
              >
                <ArrowUpDown className="w-4 h-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="h-10 px-3 min-w-[170px] bg-white/5 border border-white/10 rounded-md flex items-center justify-between text-slate-200 hover:border-orange-400/40 text-sm"
                    data-testid="volume-selector"
                  >
                    <span className="font-label text-[11px] text-orange-300 truncate">
                      {arc === "all"
                        ? "ALL ARCS"
                        : ARCS.find((a) => String(a.id) === arc)?.name.toUpperCase()}
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="bg-[#0E1116] border-white/10 text-slate-200 w-[260px]"
                  align="end"
                >
                  <DropdownMenuItem
                    onSelect={() => setArc("all")}
                    className="focus:bg-orange-500/15 focus:text-orange-200"
                    data-testid="arc-option-all"
                  >
                    <span className="font-label text-[11px]">ALL ARCS</span>
                    <span className="ml-auto font-body-mono text-[10px] text-slate-500">
                      Ch 1 – 2,334
                    </span>
                  </DropdownMenuItem>
                  {ARCS.map((a) => (
                    <DropdownMenuItem
                      key={a.id}
                      onSelect={() => setArc(String(a.id))}
                      className="focus:bg-orange-500/15 focus:text-orange-200"
                      data-testid={`arc-option-${a.id}`}
                    >
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full mr-2"
                        style={{ background: a.hue }}
                      />
                      <span className="font-body-serif text-sm">{a.name}</span>
                      <span className="ml-auto font-body-mono text-[10px] text-slate-500">
                        Ch {a.start.toLocaleString()}–{a.end.toLocaleString()}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Filter tabs */}
            <div className="flex flex-wrap gap-1 mb-3">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  data-testid={f.testid}
                  onClick={() => setFilter(f.id)}
                  className={`font-label text-[10px] tracking-widest rounded-full px-4 h-8 border transition-colors ${
                    filter === f.id
                      ? "border-orange-400/50 text-orange-200 bg-orange-500/10"
                      : "border-white/10 text-slate-400 hover:text-orange-200 hover:border-orange-400/30"
                  }`}
                >
                  {f.label}
                </button>
              ))}
              <div className="ml-auto font-label text-[10px] text-slate-500 self-center">
                {filtered.length.toLocaleString()} chapters
              </div>
            </div>

            {/* Chapter rows */}
            {!data ? (
              <div className="text-center py-24 font-label text-xs text-slate-500">
                Summoning chapters…
              </div>
            ) : shown.length === 0 ? (
              <div className="text-center py-24">
                <div className="font-display text-xl text-slate-100">No chapters found</div>
                <p className="text-slate-400 mt-2 font-body-serif">Try another search or filter.</p>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {groupedShown.map((group) => {
                    const a = group.arc;
                    const stats = arcProgress[a.id] || { total: a.end - a.start + 1, read: 0 };
                    const pct = stats.total ? stats.read / stats.total : 0;
                    const size = 44;
                    const stroke = 4;
                    const rad = (size - stroke) / 2;
                    const circ = 2 * Math.PI * rad;
                    const dash = circ * pct;
                    return (
                      <section key={a.id} data-testid={`arc-section-${a.id}`} className="relative">
                        {/* Sticky arc banner */}
                        <div
                          data-testid={`arc-banner-${a.id}`}
                          className="sticky top-[148px] z-10 flex items-center gap-4 rounded-md overflow-hidden px-5 py-4 border backdrop-blur-md"
                          style={{
                            borderColor: `${a.hue}33`,
                            background: `linear-gradient(90deg, ${a.hue}18 0%, rgba(10,12,16,0.85) 60%)`,
                          }}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ background: a.hue, boxShadow: `0 0 12px ${a.hue}AA` }}
                          />
                          <div className="flex-1 min-w-0">
                            <div
                              className="font-label text-[10px] tracking-widest"
                              style={{ color: a.hue }}
                            >
                              ARC {toRoman(a.id)} · REGIONAL SAGA
                            </div>
                            <div className="mt-0.5 font-display text-lg sm:text-xl text-slate-100 truncate">
                              {a.name}
                            </div>
                          </div>
                          <div className="hidden sm:block text-right shrink-0">
                            <div className="font-body-mono text-[11px] tabular text-slate-300">
                              Ch {a.start.toLocaleString()}
                              <span className="text-slate-600 mx-1">–</span>
                              {a.end.toLocaleString()}
                            </div>
                            <div className="font-label text-[9px] text-slate-500 mt-0.5">
                              {stats.total.toLocaleString()} chapters
                            </div>
                          </div>
                          <div className="relative shrink-0" data-testid={`arc-progress-${a.id}`}>
                            <svg width={size} height={size} className="-rotate-90">
                              <circle cx={size / 2} cy={size / 2} r={rad} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
                              <circle
                                cx={size / 2}
                                cy={size / 2}
                                r={rad}
                                stroke={a.hue}
                                strokeWidth={stroke}
                                fill="none"
                                strokeDasharray={`${dash} ${circ - dash}`}
                                strokeLinecap="round"
                                style={{ transition: "stroke-dasharray 400ms cubic-bezier(0.2,0.8,0.2,1)" }}
                              />
                            </svg>
                            <div className="absolute inset-0 grid place-items-center">
                              <div className="font-body-mono text-[10px] tabular text-slate-100 leading-none text-center">
                                <div>{stats.read}</div>
                                <div className="text-slate-500 text-[8px]">/ {stats.total}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Chapter rows inside this arc */}
                        <div className="mt-2 space-y-1.5">
                          {group.chapters.map((c) => {
                            const p = progress[c.id];
                            const read = !!p?.completed;
                            const inProgress = !read && !!p?.pct;
                            const bookmarked = bookmarks.some((b) => b.chapterId === c.id);
                            return (
                              <Link
                                key={c.id}
                                to={`/read/${c.id}`}
                                data-testid={TID.chapterListItem(c.id)}
                                className="group flex items-center gap-4 rounded-md border border-white/5 bg-white/[0.02] hover:bg-orange-500/[0.04] hover:border-orange-400/25 p-4 sm:px-5 transition-colors"
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="font-label text-[10px] text-orange-300/90 tracking-widest">
                                    CHAPTER {c.chapter_number ?? c.index}
                                  </div>
                                  <div className="mt-1 font-body-serif text-lg sm:text-xl text-slate-100 truncate">
                                    {c.title.replace(/^chapter\s+\d+\s*[-–—:]\s*/i, "")}
                                  </div>
                                </div>
                                <div className="hidden sm:flex items-center gap-3 text-right">
                                  {bookmarked && <Bookmark className="w-3.5 h-3.5 text-orange-300" />}
                                  {read ? (
                                    <Check className="w-4 h-4 text-orange-300" />
                                  ) : inProgress ? (
                                    <CircleDot className="w-4 h-4 text-orange-300/70" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-slate-700" />
                                  )}
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </section>
                    );
                  })}
                </div>
                {visibleCount < filtered.length && (
                  <div className="mt-8 text-center">
                    <Button
                      onClick={() => setVisibleCount((v) => v + 300)}
                      variant="outline"
                      className="rounded-full border-white/10 bg-white/5 text-slate-200 hover:bg-orange-500/10 hover:text-orange-200 hover:border-orange-400/40 font-medium text-xs px-6"
                    >
                      Load more ({(filtered.length - visibleCount).toLocaleString()} remaining)
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
