import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { toast } from "sonner";

/* ---------- Themes ---------- */
const THEMES = [
  { id: "dark",       label: "Dark" },
  { id: "parchment",  label: "Parchment" },
  { id: "arc",        label: "Arc Tint" },
  { id: "whitepaper", label: "White Paper" },
  { id: "darkpaper",  label: "Dark Paper" },
  { id: "inkwash",    label: "Ink Wash" },
  { id: "bloodmoon",  label: "Blood Moon" },
  { id: "jade",       label: "Jade" },
  { id: "cinnabar",   label: "Cinnabar" },
  { id: "void",       label: "Void" },
];

function themePalette(id, accent) {
  switch (id) {
    case "whitepaper":
      return {
        bg: "#FBFAF6",
        bgLayer: `radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.06) 100%), linear-gradient(180deg, #FCFBF7 0%, #F1EFE7 100%)`,
        frame: "rgba(0,0,0,0.18)",
        frameInner: "rgba(0,0,0,0.06)",
        frameShadowInset: "rgba(0,0,0,0.03)",
        text: "#111111",
        textHead: "#111111",
        eyebrow: accent,
        divider: "rgba(0,0,0,0.20)",
        muted: "rgba(0,0,0,0.45)",
        gold: "rgba(0,0,0,0.55)",
        quoteMark: accent,
      };
    case "darkpaper":
      return {
        bg: "#141312",
        bgLayer: `radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%), linear-gradient(180deg, #1A1918 0%, #0B0A09 100%)`,
        frame: "rgba(255,255,255,0.22)",
        frameInner: "rgba(255,255,255,0.08)",
        frameShadowInset: "rgba(0,0,0,0.35)",
        text: "#EFE9DB",
        textHead: "#F5F0E3",
        eyebrow: "#EFE9DB",
        divider: "rgba(255,255,255,0.28)",
        muted: "rgba(255,255,255,0.45)",
        gold: "rgba(255,255,255,0.55)",
        quoteMark: "#EFE9DB",
      };
    case "parchment":
      return {
        bg: "#F3E9CE",
        bgLayer: `radial-gradient(60% 45% at 72% 32%, ${accent}22 0%, transparent 60%), radial-gradient(45% 40% at 18% 82%, rgba(140,70,40,0.10) 0%, transparent 60%), linear-gradient(180deg, #F3E9CE 0%, #E4D5AE 100%)`,
        frame: "rgba(120, 80, 40, 0.45)",
        frameInner: "rgba(140, 100, 50, 0.20)",
        frameShadowInset: "rgba(120, 80, 40, 0.10)",
        text: "#241A0F",
        textHead: "#241A0F",
        eyebrow: accent,
        divider: "rgba(120, 80, 40, 0.35)",
        muted: "rgba(70, 45, 20, 0.55)",
        gold: "rgba(140, 100, 50, 0.75)",
        quoteMark: accent,
      };
    case "arc":
      return {
        bg: accent,
        bgLayer: `radial-gradient(70% 60% at 30% 20%, rgba(255,255,255,0.14) 0%, transparent 60%), radial-gradient(70% 55% at 80% 80%, rgba(0,0,0,0.35) 0%, transparent 60%), linear-gradient(160deg, ${accent} 0%, #0A0C10 130%)`,
        frame: "rgba(255,255,255,0.35)",
        frameInner: "rgba(255,255,255,0.14)",
        frameShadowInset: "rgba(0,0,0,0.35)",
        text: "#FFF8EA",
        textHead: "#FFFFFF",
        eyebrow: "#FFFFFF",
        divider: "rgba(255,255,255,0.35)",
        muted: "rgba(255,255,255,0.6)",
        gold: "rgba(255,255,255,0.7)",
        quoteMark: "#FFFFFF",
      };
    case "inkwash":
      return {
        bg: "#F7F5F0",
        bgLayer: `radial-gradient(50% 40% at 78% 22%, rgba(0,0,0,0.10) 0%, transparent 60%), radial-gradient(45% 40% at 15% 85%, rgba(0,0,0,0.08) 0%, transparent 60%), linear-gradient(180deg, #F9F7F2 0%, #EFEBE1 100%)`,
        frame: "rgba(0,0,0,0.45)",
        frameInner: "rgba(0,0,0,0.15)",
        frameShadowInset: "rgba(0,0,0,0.05)",
        text: "#101010",
        textHead: "#101010",
        eyebrow: "#101010",
        divider: "rgba(0,0,0,0.5)",
        muted: "rgba(0,0,0,0.5)",
        gold: "rgba(0,0,0,0.75)",
        quoteMark: "#101010",
      };
    case "bloodmoon":
      return {
        bg: "#1A0508",
        bgLayer: `radial-gradient(60% 55% at 72% 22%, rgba(230,70,60,0.35) 0%, transparent 60%), radial-gradient(80% 60% at 50% 100%, rgba(10,0,4,0.85) 0%, transparent 60%), linear-gradient(180deg, #2A0A10 0%, #0B0204 100%)`,
        frame: "rgba(201,164,94,0.55)",
        frameInner: "rgba(201,164,94,0.25)",
        frameShadowInset: "rgba(0,0,0,0.5)",
        text: "#F5DEA6",
        textHead: "#F7D488",
        eyebrow: "#F7D488",
        divider: "rgba(201,164,94,0.45)",
        muted: "rgba(245,208,138,0.55)",
        gold: "rgba(201,164,94,0.9)",
        quoteMark: "#F7D488",
      };
    case "jade":
      return {
        bg: "#062821",
        bgLayer: `radial-gradient(70% 60% at 30% 20%, rgba(90,230,180,0.18) 0%, transparent 60%), radial-gradient(60% 50% at 80% 100%, rgba(6,20,16,0.9) 0%, transparent 60%), linear-gradient(180deg, #0B3B30 0%, #041711 100%)`,
        frame: "rgba(201,164,94,0.55)",
        frameInner: "rgba(201,164,94,0.28)",
        frameShadowInset: "rgba(0,0,0,0.45)",
        text: "#EDE1BE",
        textHead: "#F5E8C6",
        eyebrow: "#8FE0B8",
        divider: "rgba(201,164,94,0.45)",
        muted: "rgba(237,225,190,0.5)",
        gold: "rgba(201,164,94,0.85)",
        quoteMark: "#8FE0B8",
      };
    case "cinnabar":
      return {
        bg: "#8A1E1E",
        bgLayer: `radial-gradient(60% 55% at 70% 25%, rgba(255,240,220,0.18) 0%, transparent 60%), radial-gradient(80% 60% at 50% 100%, rgba(40,0,0,0.6) 0%, transparent 60%), linear-gradient(160deg, #9B2323 0%, #430A0E 100%)`,
        frame: "rgba(255,240,210,0.6)",
        frameInner: "rgba(255,240,210,0.28)",
        frameShadowInset: "rgba(80,0,0,0.4)",
        text: "#FFF3D8",
        textHead: "#FFF8E6",
        eyebrow: "#FFE8B0",
        divider: "rgba(255,240,210,0.5)",
        muted: "rgba(255,243,216,0.6)",
        gold: "rgba(255,220,150,0.85)",
        quoteMark: "#FFE8B0",
      };
    case "void":
      return {
        bg: "#000000",
        bgLayer: `radial-gradient(60% 50% at 72% 25%, rgba(140,120,240,0.18) 0%, transparent 60%), radial-gradient(70% 60% at 25% 85%, rgba(60,80,200,0.12) 0%, transparent 60%), radial-gradient(30% 30% at 15% 20%, rgba(255,255,255,0.05) 0%, transparent 60%), #000`,
        frame: "rgba(255,255,255,0.35)",
        frameInner: "rgba(140,120,240,0.22)",
        frameShadowInset: "rgba(0,0,0,0.6)",
        text: "#E7DFF8",
        textHead: "#FFFFFF",
        eyebrow: "#B8A9FF",
        divider: "rgba(255,255,255,0.28)",
        muted: "rgba(255,255,255,0.45)",
        gold: "rgba(184,169,255,0.75)",
        quoteMark: "#B8A9FF",
      };
    case "dark":
    default:
      return {
        bg: "#0A0C10",
        bgLayer: `radial-gradient(60% 45% at 72% 32%, ${accent}22 0%, transparent 60%), radial-gradient(45% 40% at 18% 82%, rgba(220,90,70,0.14) 0%, transparent 60%), linear-gradient(180deg, #0A0C10 0%, #06080B 100%)`,
        frame: "rgba(201,164,94,0.35)",
        frameInner: "rgba(201,164,94,0.18)",
        frameShadowInset: "rgba(0,0,0,0.4)",
        text: "#F1E4C6",
        textHead: "#F1E4C6",
        eyebrow: accent,
        divider: "rgba(201,164,94,0.28)",
        muted: "rgba(255,255,255,0.4)",
        gold: "rgba(201,164,94,0.75)",
        quoteMark: accent,
      };
  }
}

/* ---------- Text styles ---------- */
const TEXT_STYLES = [
  { id: "classic",    label: "Classic"    },
  { id: "modern",     label: "Modern"     },
  { id: "manuscript", label: "Manuscript" },
  { id: "poetic",     label: "Poetic"     },
];

function textPreset(id) {
  switch (id) {
    case "modern":
      return {
        family: "'Plus Jakarta Sans', system-ui, sans-serif",
        italic: false,
        weight: 500,
        letterSpacing: 0,
        transform: "none",
        lineHeight: 1.4,
        showQuoteMarks: true,
        quoteMarkScale: 1.15,
        sizeMul: 0.95,
      };
    case "manuscript":
      return {
        family: "'Cinzel', 'EB Garamond', serif",
        italic: false,
        weight: 500,
        letterSpacing: 3,
        transform: "uppercase",
        lineHeight: 1.55,
        showQuoteMarks: false,
        sizeMul: 0.68,
      };
    case "poetic":
      return {
        family: "'EB Garamond', 'Cormorant Garamond', serif",
        italic: true,
        weight: 500,
        letterSpacing: 0,
        transform: "none",
        lineHeight: 1.5,
        showQuoteMarks: false,
        sizeMul: 1.12,
      };
    case "classic":
    default:
      return {
        family: "'EB Garamond', 'Cormorant Garamond', serif",
        italic: true,
        weight: 500,
        letterSpacing: 0,
        transform: "none",
        lineHeight: 1.35,
        showQuoteMarks: true,
        quoteMarkScale: 1.4,
        sizeMul: 1,
      };
  }
}

export default function QuoteCardModal({ open, onOpenChange, quote, chapter, arc }) {
  const cardRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [textStyle, setTextStyle] = useState("classic");

  const accent = arc?.hue || "#EC8B60";
  const P = themePalette(theme, accent);
  const S = textPreset(textStyle);
  const trimmed = (quote || "").trim();
  const len = trimmed.length;
  const baseSize = len > 260 ? 30 : len > 160 ? 38 : len > 80 ? 46 : 54;
  const quoteFontPx = Math.max(20, Math.round(baseSize * S.sizeMul));

  const download = async () => {
    if (!cardRef.current) return;
    setBusy(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: P.bg,
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      const chapNum = chapter?.chapter_number ?? chapter?.index ?? "quote";
      a.download = `reverend-insanity-ch${chapNum}-${theme}-${textStyle}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast("Quote card saved", { description: "Share it anywhere you like." });
    } catch (e) {
      console.error(e);
      toast("Couldn't generate image", { description: "Try again in a moment." });
    } finally {
      setBusy(false);
    }
  };

  const share = async () => {
    if (!cardRef.current || !navigator.share) return download();
    setBusy(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: P.bg,
      });
      const blob = await (await fetch(dataUrl)).blob();
      const chapNum = chapter?.chapter_number ?? chapter?.index ?? "quote";
      const file = new File([blob], `reverend-insanity-ch${chapNum}-${theme}.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "Reverend Insanity", text: `Chapter ${chapNum} · @toiboytoestar` });
      } else {
        download();
      }
    } catch (e) {
      if (e?.name !== "AbortError") download();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-testid="quote-card-modal"
        className="bg-[#0B0D0E] border-white/10 text-slate-100 max-w-[560px] p-0 overflow-hidden"
      >
        <DialogHeader className="p-5 border-b border-white/10">
          <DialogTitle className="font-display text-xl text-slate-100 tracking-wide">
            Share as image
          </DialogTitle>
          <div className="font-label text-[10px] text-slate-400">
            Preview · exports at 2160×2700
          </div>
        </DialogHeader>

        <div className="p-5 flex flex-col items-center gap-4 max-h-[80vh] overflow-y-auto">
          {/* Theme picker */}
          <div className="w-full">
            <div className="font-label text-[9px] text-slate-500 mb-2">Theme</div>
            <div className="flex flex-wrap gap-1.5" data-testid="quote-theme-picker">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  data-testid={`quote-theme-${t.id}`}
                  onClick={() => setTheme(t.id)}
                  className={`font-label text-[10px] tracking-widest rounded-full px-3 h-8 border transition-colors ${
                    theme === t.id
                      ? "border-orange-400/50 text-orange-200 bg-orange-500/10"
                      : "border-white/10 text-slate-400 hover:text-orange-200 hover:border-orange-400/30"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text-style picker */}
          <div className="w-full">
            <div className="font-label text-[9px] text-slate-500 mb-2">Text style</div>
            <div className="flex flex-wrap gap-1.5" data-testid="quote-textstyle-picker">
              {TEXT_STYLES.map((t) => (
                <button
                  key={t.id}
                  data-testid={`quote-textstyle-${t.id}`}
                  onClick={() => setTextStyle(t.id)}
                  className={`font-label text-[10px] tracking-widest rounded-full px-3 h-8 border transition-colors ${
                    textStyle === t.id
                      ? "border-orange-400/50 text-orange-200 bg-orange-500/10"
                      : "border-white/10 text-slate-400 hover:text-orange-200 hover:border-orange-400/30"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scaled preview */}
          <div className="relative" style={{ width: 360, height: 450 }}>
            <div
              ref={cardRef}
              data-testid="quote-card"
              style={{
                width: 1080,
                height: 1350,
                transform: "scale(0.3333)",
                transformOrigin: "top left",
                position: "absolute",
                top: 0,
                left: 0,
                background: P.bg,
                color: P.text,
                overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", inset: 0, background: P.bgLayer }} />
              <div
                style={{
                  position: "absolute",
                  inset: 60,
                  border: `1px solid ${P.frame}`,
                  boxShadow: `inset 0 0 0 8px ${P.frameShadowInset}, inset 0 0 0 9px ${P.frameInner}`,
                  borderRadius: 4,
                }}
              />
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    ...(i === 0 && { top: 80, left: 80 }),
                    ...(i === 1 && { top: 80, right: 80 }),
                    ...(i === 2 && { bottom: 80, right: 80 }),
                    ...(i === 3 && { bottom: 80, left: 80 }),
                    color: P.gold,
                    fontFamily: "'EB Garamond', serif",
                    fontSize: 32,
                    lineHeight: 1,
                  }}
                >
                  ❦
                </div>
              ))}

              <div
                style={{
                  position: "absolute",
                  inset: 120,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: 20,
                }}
              >
                <div>
                  <div style={{ fontFamily: "'Cinzel', sans-serif", fontSize: 20, letterSpacing: 6, color: P.eyebrow, fontWeight: 500 }}>
                    {arc ? `ARC · ${arc.name.toUpperCase()}` : "REVEREND INSANITY"}
                  </div>
                  <div style={{ fontFamily: "'Cinzel', sans-serif", fontSize: 16, letterSpacing: 5, color: P.gold, marginTop: 12 }}>
                    CHAPTER {chapter?.chapter_number ?? chapter?.index ?? "—"}
                  </div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, lineHeight: 1.1, color: P.textHead, marginTop: 8, fontWeight: 500 }}>
                    {chapter?.title?.replace(/^chapter\s+\d+\s*[-–—:]\s*/i, "")}
                  </div>
                </div>

                <div
                  style={{
                    fontFamily: S.family,
                    fontSize: quoteFontPx,
                    lineHeight: S.lineHeight,
                    color: P.text,
                    fontWeight: S.weight,
                    fontStyle: S.italic ? "italic" : "normal",
                    letterSpacing: S.letterSpacing,
                    textTransform: S.transform,
                    padding: "20px 0",
                  }}
                >
                  {S.showQuoteMarks && (
                    <span style={{ color: P.quoteMark, fontSize: quoteFontPx * (S.quoteMarkScale || 1.2), fontFamily: "'EB Garamond', serif", marginRight: 4, fontStyle: "normal" }}>&ldquo;</span>
                  )}
                  {trimmed}
                  {S.showQuoteMarks && (
                    <span style={{ color: P.quoteMark, fontSize: quoteFontPx * (S.quoteMarkScale || 1.2), fontFamily: "'EB Garamond', serif", marginLeft: 4, fontStyle: "normal" }}>&rdquo;</span>
                  )}
                </div>

                <div style={{ borderTop: `1px solid ${P.divider}`, paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, color: P.textHead, fontWeight: 600 }}>
                      Reverend Insanity
                    </div>
                    <div style={{ fontFamily: "'Cinzel', sans-serif", fontSize: 14, letterSpacing: 4, color: P.gold, marginTop: 6 }}>
                      GU · ZHEN · REN
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'Cinzel', sans-serif", fontSize: 12, letterSpacing: 3, color: P.muted }}>
                      FAN READER · MMXXVI
                    </div>
                    <div style={{ fontFamily: "'Cinzel', sans-serif", fontSize: 14, letterSpacing: 3, color: P.eyebrow, marginTop: 6 }}>
                      @TOIBOYTOESTAR
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full">
            <Button
              data-testid="quote-download-btn"
              onClick={download}
              disabled={busy}
              className="flex-1 rounded-full bg-orange-400 hover:bg-orange-300 text-slate-950 font-medium h-11"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PNG
            </Button>
            {typeof navigator !== "undefined" && navigator.share && (
              <Button
                data-testid="quote-share-btn"
                onClick={share}
                disabled={busy}
                variant="ghost"
                className="rounded-full bg-white/5 hover:bg-white/10 text-slate-200 h-11 px-5 border border-white/10"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
