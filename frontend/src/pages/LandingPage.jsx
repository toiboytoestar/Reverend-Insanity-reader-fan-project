import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useSWR from "swr";
import { motion } from "framer-motion";
import { fetchNovel, fetchChapters } from "@/lib/api";
import { getLastRead, getProgress, getBookmarks } from "@/lib/storage";
import { TID } from "@/lib/testIds";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Bookmark, Feather, Clock, ScrollText, Skull, Sparkles, ArrowRight } from "lucide-react";

const HERO_IMG =
  "https://images.unsplash.com/photo-1755543832265-aa4a6b8c1414?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzR8MHwxfHNlYXJjaHwyfHxhbmNpZW50JTIwZGFyayUyMGZhbnRhc3klMjBib29rJTIwdGV4dHVyZSUyMGNvdmVyJTIwYXJ0d29ya3xlbnwwfHx8fDE3ODk1NDk1MDN8MA&ixlib=rb-4.1.0&q=85";

function Stat({ label, value, icon: Icon }) {
  return (
    <div className="border border-emerald-500/10 bg-black/30 backdrop-blur-sm p-5 rounded-sm hover:border-emerald-500/30 transition-colors">
      <Icon className="w-4 h-4 text-emerald-400 mb-3" />
      <div className="font-display text-2xl text-emerald-50">{value}</div>
      <div className="font-label text-[10px] text-slate-400 mt-1">{label}</div>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { data: novel } = useSWR("novel", fetchNovel);
  const { data: chapters } = useSWR(["chapters-preview"], () =>
    fetchChapters({ limit: 6 })
  );

  const [readCount, setReadCount] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [lastReadId, setLastReadId] = useState(null);

  useEffect(() => {
    const p = getProgress();
    setReadCount(Object.values(p).filter((v) => v.completed).length);
    setBookmarkCount(getBookmarks().length);
    setLastReadId(getLastRead());
  }, []);

  const continueTarget = useMemo(() => {
    if (lastReadId) return `/read/${lastReadId}`;
    return "/read/ch0002"; // Chapter 1
  }, [lastReadId]);

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 jade-halo opacity-70 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-24 grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="font-label text-[10px] text-emerald-400">A Ruthless Gu Cultivation Saga</span>
              <div className="h-px flex-1 bg-emerald-500/30" />
            </div>
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[1.02] text-emerald-50 tracking-wide">
              REVEREND
              <br />
              <span className="text-emerald-400">INSANITY</span>
            </h1>
            <p className="mt-3 font-label text-xs text-slate-500">
              蛊真人 · Gu Zhen Ren
            </p>

            <div className="mt-8 max-w-2xl">
              <p className="text-slate-300 leading-relaxed font-body-serif text-lg">
                {novel?.synopsis}
              </p>
              <p className="mt-4 italic text-emerald-300/80 font-body-serif">
                {novel?.quote}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {(novel?.genre || []).map((g) => (
                <Badge
                  key={g}
                  variant="outline"
                  className="border-emerald-500/30 text-emerald-200 bg-emerald-500/5 font-label text-[10px]"
                >
                  {g}
                </Badge>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button
                data-testid={TID.continueReadingBtn}
                onClick={() => navigate(continueTarget)}
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-label tracking-widest px-6 py-6 rounded-sm text-xs"
              >
                {lastReadId ? "Continue Reading" : "Begin the Path"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                data-testid={TID.browseTocBtn}
                onClick={() => navigate("/toc")}
                variant="outline"
                className="border-emerald-500/40 text-emerald-200 hover:bg-emerald-500/10 font-label tracking-widest px-6 py-6 rounded-sm text-xs"
              >
                Table of Contents
                <ScrollText className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9 }}
            className="relative"
          >
            <div className="absolute -inset-6 jade-halo opacity-80 blur-2xl" />
            <div className="relative aspect-[3/4] border border-emerald-500/25 rounded-sm overflow-hidden shadow-[0_30px_80px_-20px_rgba(16,185,129,0.35)]">
              <img
                src={HERO_IMG}
                alt="Reverend Insanity cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="font-label text-[10px] text-emerald-300 tracking-widest">Volume I — IX</div>
                <div className="font-display text-2xl text-emerald-50 mt-1">The Gu Path</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-10">
        <div className="divider-jade mb-10" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat label="Total Chapters" value={novel?.total_chapters?.toLocaleString() || "—"} icon={ScrollText} />
          <Stat label="Words in the Saga" value={novel ? `${Math.round(novel.total_words / 1000).toLocaleString()}K` : "—"} icon={Feather} />
          <Stat label="Chapters Read" value={readCount.toLocaleString()} icon={BookOpen} />
          <Stat label="Bookmarks" value={bookmarkCount.toLocaleString()} icon={Bookmark} />
        </div>
      </section>

      {/* Feature highlights */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div className="mb-10 max-w-2xl">
          <div className="font-label text-[10px] text-emerald-400 mb-3">The Reader</div>
          <h2 className="font-display text-3xl sm:text-4xl text-emerald-50">
            Crafted for the long cultivation.
          </h2>
          <p className="mt-4 text-slate-400 font-body-serif text-lg leading-relaxed">
            Four immersive themes, adjustable typography, silent progress tracking,
            bookmarks with private notes, and keyboard-first navigation — everything a
            Gu Master needs to walk 2,334 chapters of ruthless ambition.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Sparkles, title: "Four Reading Themes", body: "Gu Abyss, Ancient Scroll Sepia, Imperial Jade, and Pure Void — each tuned for hours of reading." },
            { icon: Clock, title: "Silent Progress Saving", body: "Your scroll position, completed chapters, and last read are stored locally — resume anywhere on this device." },
            { icon: Bookmark, title: "Bookmarks with Notes", body: "Mark pivotal moments and jot down quotes or thoughts. Your private cultivation journal." },
            { icon: ScrollText, title: "Search & Filter", body: "Search by chapter number or title, filter unread / read / bookmarked at a glance." },
            { icon: Feather, title: "Typography Control", body: "Serif, sans, or mono. Font size 12–32px. Line-height, letter-spacing, and column width — every knob." },
            { icon: Skull, title: "Keyboard Shortcuts", body: "→ / J next · ← / K prev · B bookmark · S settings · T toc · ? help. Read fast, read fluid." },
          ].map((f) => (
            <div
              key={f.title}
              className="border border-emerald-500/10 bg-black/30 p-6 rounded-sm hover:border-emerald-500/30 transition-colors"
            >
              <f.icon className="w-5 h-5 text-emerald-400 mb-4" />
              <div className="font-display text-lg text-emerald-50">{f.title}</div>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Preview chapters */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="font-label text-[10px] text-emerald-400 mb-2">Opening Volume</div>
            <h2 className="font-display text-2xl sm:text-3xl text-emerald-50">Begin the descent</h2>
          </div>
          <Link
            to="/toc"
            className="font-label text-xs text-emerald-300 hover:text-emerald-200 flex items-center gap-2"
          >
            All chapters <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {(chapters?.items || []).map((c) => (
            <Link
              key={c.id}
              to={`/read/${c.id}`}
              data-testid={TID.chapterCard(c.id)}
              className="group border border-emerald-500/10 bg-black/30 p-5 rounded-sm hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-colors flex items-start gap-4"
            >
              <div className="font-display text-3xl text-emerald-500/40 group-hover:text-emerald-400 transition-colors leading-none w-14">
                {String(c.index).padStart(2, "0")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-body-serif text-lg text-emerald-50 truncate">{c.title}</div>
                <div className="font-label text-[10px] text-slate-500 mt-2">
                  {c.word_count.toLocaleString()} words · ~{Math.max(1, Math.round(c.word_count / 250))} min
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-500/40 group-hover:text-emerald-300 mt-1 transition-colors" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
