import React from "react";
import { Flame, Sparkles, Target } from "lucide-react";
import { getCultivationRank } from "@/lib/cultivation";

export function RankCard({ chaptersCompleted, className = "" }) {
  const r = getCultivationRank(chaptersCompleted);
  return (
    <div
      data-testid="rank-card"
      className={`relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.02] backdrop-blur-sm p-6 ${className}`}
    >
      <div
        className="absolute -inset-6 blur-2xl pointer-events-none opacity-40"
        style={{ background: `radial-gradient(circle at 30% 30%, ${r.color}55 0%, transparent 60%)` }}
      />
      <div className="relative">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-full grid place-items-center border"
            style={{ borderColor: `${r.color}66`, background: `${r.color}18` }}
          >
            <Sparkles className="w-5 h-5" style={{ color: r.color }} />
          </div>
          <div>
            <div className="font-label text-[9px] text-slate-400">Cultivation</div>
            <div className="font-display text-xl text-slate-100 leading-tight">
              {r.title}
            </div>
            <div className="font-label text-[10px]" style={{ color: r.color }}>
              {r.label}
            </div>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex items-center justify-between font-label text-[9px] text-slate-500">
            <span>{chaptersCompleted.toLocaleString()} chapters read</span>
            {r.next ? (
              <span>{r.nextNeeded.toLocaleString()} to Rank {r.next.rank}</span>
            ) : (
              <span style={{ color: r.color }}>Peak Ascended</span>
            )}
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${r.pctToNext * 100}%`,
                background: `linear-gradient(90deg, ${r.color}, ${r.color}88)`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function StreakCard({ streak, todayCount, goal, className = "" }) {
  const pct = Math.min(1, todayCount / goal);
  const active = streak.current > 0;
  const size = 76;
  const stroke = 6;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  return (
    <div
      data-testid="streak-card"
      className={`relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.02] backdrop-blur-sm p-6 flex items-center gap-5 ${className}`}
    >
      <div className="absolute -inset-6 blur-2xl pointer-events-none opacity-30 orange-halo" />
      <div className="relative">
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="url(#g)"
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 500ms cubic-bezier(0.2,0.8,0.2,1)" }}
          />
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#EC8B60" />
              <stop offset="100%" stopColor="#8B78F0" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center leading-tight">
            <div className="font-body-mono text-lg text-slate-100">
              {todayCount}
              <span className="text-slate-500 text-sm">/{goal}</span>
            </div>
            <div className="font-label text-[8px] text-slate-500">TODAY</div>
          </div>
        </div>
      </div>
      <div className="relative flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Flame className={`w-5 h-5 ${active ? "text-orange-300" : "text-slate-600"}`} />
          <div className="font-display text-2xl text-slate-100">
            {streak.current}
            <span className="text-slate-500 text-lg"> day{streak.current === 1 ? "" : "s"}</span>
          </div>
        </div>
        <div className="font-label text-[10px] text-slate-500 mt-1">
          {active ? "reading streak" : "start a streak today"}
        </div>
        <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
          <Target className="w-3.5 h-3.5 text-violet-300" />
          <span>Longest {streak.longest || 0} · Goal {goal}/day</span>
        </div>
      </div>
    </div>
  );
}
