import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useSWR from "swr";
import { motion } from "framer-motion";
import { fetchNovel } from "@/lib/api";
import {
  getLastRead,
  getProgress,
  getBookmarks,
  getFurthestIndex,
  getHistory,
  getCompletedCount,
  getLiveStreak,
  getDaily,
  getGoal,
} from "@/lib/storage";
import { TID } from "@/lib/testIds";
import { Button } from "@/components/ui/button";
import { Heart, Info, ScrollText, Download, ArrowRight, BookOpen } from "lucide-react";
import TiltCover from "@/components/TiltCover";
import { RankCard, StreakCard } from "@/components/EngagementCards";

const HERO_IMG =
  "https://images.unsplash.com/photo-1755543832265-aa4a6b8c1414?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzR8MHwxfHNlYXJjaHwyfHxhbmNpZW50JTIwZGFyayUyMGZhbnRhc3klMjBib29rJTIwdGV4dHVyZSUyMGNvdmVyJTIwYXJ0d29ya3xlbnwwfHx8fDE3ODk1NDk1MDN8MA&ixlib=rb-4.1.0&q=85";

function IconRail({ items }) {
  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-2">
      {items.map((it) => (
        <button
          key={it.label}
          onClick={it.onClick}
          data-testid={it.testid}
          title={it.label}
          className="w-10 h-10 rounded-md bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center text-slate-300 hover:text-orange-300 hover:border-orange-400/50 hover:bg-orange-500/10 transition-colors"
        >
          <it.icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { data: novel } = useSWR("novel", fetchNovel);

  const [readCount, setReadCount] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [lastReadId, setLastReadId] = useState(null);
  const [furthest, setFurthest] = useState(0);
  const [recent, setRecent] = useState([]);
  const [streak, setStreak] = useState({ current: 0, longest: 0, lastDay: null });
  const [todayCount, setTodayCount] = useState(0);
  const [goal, setGoalState] = useState(3);

  useEffect(() => {
    const p = getProgress();
    setReadCount(getCompletedCount());
    setBookmarkCount(getBookmarks().length);
    setLastReadId(getLastRead());
    setFurthest(getFurthestIndex());
    setRecent(getHistory().slice(0, 5));
    setStreak(getLiveStreak());
    const today = new Date().toISOString().slice(0, 10);
    setTodayCount(getDaily()[today] || 0);
    setGoalState(getGoal().chaptersPerDay);
  }, []);

  const continueTarget = useMemo(
    () => (lastReadId ? `/read/${lastReadId}` : "/read/ch0002"),
    [lastReadId]
  );

  const railItems = [
    { icon: Heart, label: "Bookmarks", testid: "rail-bookmarks", onClick: () => navigate("/bookmarks") },
    { icon: Info, label: "About", testid: "rail-about", onClick: () => navigate("/toc") },
    { icon: ScrollText, label: "Chapters", testid: "rail-toc", onClick: () => navigate("/toc") },
    { icon: BookOpen, label: "History", testid: "rail-history", onClick: () => navigate("/history") },
  ];

  return (
    <div className="fog-bg min-h-[calc(100vh-72px)] relative">
      <IconRail items={railItems} />

      {/* Hero — Beyonder-style: cover left, title/quote/CTAs right */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-24 grid lg:grid-cols-[minmax(0,380px)_1fr] gap-10 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative mx-auto lg:mx-0"
          >
            <div className="absolute -inset-8 orange-halo opacity-70 blur-2xl" />
            <TiltCover className="relative aspect-[3/4] w-[260px] sm:w-[320px] rounded-md overflow-hidden shadow-[0_40px_80px_-25px_rgba(0,0,0,0.9)] ring-1 ring-white/10 cursor-pointer">
              <img src={HERO_IMG} alt="Reverend Insanity" className="w-full h-full object-cover pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
            </TiltCover>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-orange-300 leading-[1.05]">
              Reverend Insanity
            </h1>
            <p className="mt-2 font-label text-[10px] text-slate-400">
              蛊真人 · Gu Zhen Ren
            </p>

            <div className="mt-8 max-w-2xl">
              <p className="font-body-serif text-slate-300 text-lg leading-relaxed italic">
                &ldquo;Humans are clever in tens of thousands of ways, Gu are the
                true refined essences of Heaven and Earth. The Three Temples are
                unrighteous, the demon is reborn.&rdquo;
              </p>
              <p className="mt-4 font-body-serif text-slate-400 text-base leading-relaxed">
                {novel?.synopsis?.split(".").slice(1, 3).join(".").trim() ||
                  "Reincarnated after five hundred years, Fang Yuan returns to his youth with the memories of an era."}
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button
                data-testid={TID.continueReadingBtn}
                onClick={() => navigate(continueTarget)}
                className="rounded-full bg-orange-400 hover:bg-orange-300 text-slate-950 font-medium px-7 h-11 text-sm shadow-[0_10px_30px_-10px_rgba(236,139,96,0.6)]"
              >
                {lastReadId ? "Continue Reading" : "Read Now"}
              </Button>
              <Button
                data-testid={TID.browseTocBtn}
                onClick={() => navigate("/toc")}
                variant="ghost"
                className="rounded-full bg-violet-500/20 hover:bg-violet-500/30 text-violet-200 font-medium px-7 h-11 text-sm border border-violet-500/30"
              >
                <Download className="w-4 h-4 mr-2" />
                Chapters
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Your progress + Recent history */}
      {novel && furthest > 0 && (
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-14">
          {/* Cultivation rank + Streak */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <RankCard chaptersCompleted={readCount} />
            <StreakCard streak={streak} todayCount={todayCount} goal={goal} />
          </div>
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-4">
            <div
              data-testid={TID.overallProgressCard}
              className="border border-white/10 bg-white/[0.02] backdrop-blur-sm p-6 sm:p-8 rounded-lg relative overflow-hidden"
            >
              <div className="absolute -inset-6 orange-halo opacity-30 pointer-events-none" />
              <div className="relative">
                <div className="font-label text-[10px] text-orange-300 mb-3">Your Path</div>
                <div className="flex items-baseline gap-4 flex-wrap">
                  <div className="font-display text-4xl sm:text-5xl text-slate-100">
                    Chapter {furthest.toLocaleString()}
                    <span className="text-slate-500"> / {novel.total_chapters.toLocaleString()}</span>
                  </div>
                  <div
                    data-testid={TID.overallProgressPct}
                    className="font-body-mono text-2xl text-orange-300"
                  >
                    {((furthest / novel.total_chapters) * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="mt-5 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-violet-400"
                    style={{ width: `${(furthest / novel.total_chapters) * 100}%` }}
                  />
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {lastReadId && (
                    <Button
                      onClick={() => navigate(`/read/${lastReadId}`)}
                      className="rounded-full bg-orange-400 hover:bg-orange-300 text-slate-950 font-medium text-xs h-9 px-5"
                    >
                      Resume <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  )}
                  <Link
                    to="/history"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 text-slate-300 hover:text-orange-200 hover:border-orange-400/40 font-medium text-xs h-9 px-5 transition-colors"
                  >
                    View history
                  </Link>
                </div>
              </div>
            </div>

            <div className="border border-white/10 bg-white/[0.02] backdrop-blur-sm p-6 rounded-lg">
              <div className="font-label text-[10px] text-orange-300 mb-4">Recently Read</div>
              {recent.length === 0 ? (
                <div className="text-slate-400 font-body-serif text-sm">
                  Chapters you open will appear here.
                </div>
              ) : (
                <div className="space-y-1">
                  {recent.map((h) => (
                    <Link
                      key={h.chapterId}
                      to={`/read/${h.chapterId}`}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-white/5 transition-colors"
                    >
                      <div className="font-body-mono text-xs text-orange-300/70 w-12 text-right">
                        {String(h.chapterNumber ?? h.index).padStart(2, "0")}
                      </div>
                      <div className="flex-1 min-w-0 font-body-serif text-base text-slate-100 truncate">
                        {h.title}
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Small stats strip */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { l: "Total Chapters", v: novel.total_chapters.toLocaleString() },
              { l: "Words", v: `${Math.round(novel.total_words / 1000).toLocaleString()}K` },
              { l: "Read", v: readCount.toLocaleString() },
              { l: "Bookmarks", v: bookmarkCount.toLocaleString() },
            ].map((s) => (
              <div
                key={s.l}
                className="border border-white/10 bg-white/[0.02] backdrop-blur-sm p-4 rounded-lg"
              >
                <div className="font-body-mono text-2xl text-slate-100">{s.v}</div>
                <div className="font-label text-[10px] text-slate-500 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
