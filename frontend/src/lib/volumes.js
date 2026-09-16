// Reverend Insanity storyline arcs — the seven regions/eras Fang Yuan traverses
// across the 2,334 chapter saga. Chapter ranges are approximate community-agreed
// boundaries for the major regional arcs.
export const ARCS = [
  { id: 1, name: "Southern Border",  short: "Southern Border",  start: 1,    end: 350,  hue: "#F59E0B" },
  { id: 2, name: "Eastern Sea",      short: "Eastern Sea",      start: 351,  end: 580,  hue: "#06B6D4" },
  { id: 3, name: "Northern Plains",  short: "Northern Plains",  start: 581,  end: 900,  hue: "#A3B18A" },
  { id: 4, name: "Western Desert",   short: "Western Desert",   start: 901,  end: 1400, hue: "#D97706" },
  { id: 5, name: "Central Continent",short: "Central Continent",start: 1401, end: 1900, hue: "#8B78F0" },
  { id: 6, name: "Olden Antiquity",  short: "Olden Antiquity",  start: 1901, end: 2200, hue: "#EC4899" },
  { id: 7, name: "Final Battle",     short: "Final Battle",     start: 2201, end: 2334, hue: "#EC8B60" },
];

export function getArc(chapterNumber, index) {
  const n = chapterNumber ?? index ?? 0;
  return ARCS.find((a) => n >= a.start && n <= a.end) || ARCS[0];
}
