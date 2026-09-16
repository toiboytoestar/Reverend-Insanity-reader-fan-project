// Cultivation Rank system based on chapters completed.
// Matches the Reverend Insanity world (Gu Master Rank 1-5, Gu Immortal Rank 6-9).
export const RANKS = [
  { rank: 1, threshold: 0,    title: "Rank 1 Gu Master",     label: "Novice",       color: "#94A3B8" },
  { rank: 2, threshold: 10,   title: "Rank 2 Gu Master",     label: "Aspirant",     color: "#A3B8B2" },
  { rank: 3, threshold: 25,   title: "Rank 3 Gu Master",     label: "Adept",        color: "#B8AC94" },
  { rank: 4, threshold: 50,   title: "Rank 4 Gu Master",     label: "Master",       color: "#EC8B60" },
  { rank: 5, threshold: 100,  title: "Rank 5 Gu Master",     label: "Grandmaster",  color: "#F59E0B" },
  { rank: 6, threshold: 250,  title: "Rank 6 Gu Immortal",   label: "Ascender",     color: "#8B78F0" },
  { rank: 7, threshold: 500,  title: "Rank 7 Gu Immortal",   label: "Lord",         color: "#A78BFA" },
  { rank: 8, threshold: 1000, title: "Rank 8 Gu Immortal",   label: "Venerable",    color: "#F472B6" },
  { rank: 9, threshold: 2000, title: "Rank 9 Gu Immortal",   label: "Heavenly Venerable", color: "#FBBF24" },
];

export function getCultivationRank(chaptersCompleted) {
  let current = RANKS[0];
  for (const r of RANKS) {
    if (chaptersCompleted >= r.threshold) current = r;
    else break;
  }
  const idx = RANKS.indexOf(current);
  const next = RANKS[idx + 1] || null;
  const nextNeeded = next ? next.threshold - chaptersCompleted : 0;
  const pctToNext = next
    ? (chaptersCompleted - current.threshold) / (next.threshold - current.threshold)
    : 1;
  return {
    ...current,
    idx,
    next,
    nextNeeded,
    pctToNext: Math.min(1, Math.max(0, pctToNext)),
  };
}
