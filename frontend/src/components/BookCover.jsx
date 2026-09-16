import React from "react";

const HERO_IMG =
  "https://images.unsplash.com/photo-1755543832265-aa4a6b8c1414?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzR8MHwxfHNlYXJjaHwyfHxhbmNpZW50JTIwZGFyayUyMGZhbnRhc3klMjBib29rJTIwdGV4dHVyZSUyMGNvdmVyJTIwYXJ0d29ya3xlbnwwfHx8fDE3ODk1NDk1MDN8MA&ixlib=rb-4.1.0&q=85";

/**
 * Premium book cover with an engraved title plate overlay.
 * Renders the leather texture image and layers an editorial title cartouche.
 */
export default function BookCover({ className = "" }) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <img
        src={HERO_IMG}
        alt="Reverend Insanity — Official Edition"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30 pointer-events-none" />

      {/* Ornamental title cartouche */}
      <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none">
        <div className="relative w-[86%] h-[68%] flex flex-col items-center justify-center text-center">
          {/* Cartouche frame */}
          <div className="absolute inset-0 rounded-sm" style={{
            border: "1px solid rgba(201, 164, 94, 0.55)",
            boxShadow: "inset 0 0 0 3px rgba(0,0,0,0.35), inset 0 0 0 4px rgba(201, 164, 94, 0.28)",
          }} />
          {/* Top ornament */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px]" style={{ color: "rgba(201, 164, 94, 0.75)" }}>❦</div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px]" style={{ color: "rgba(201, 164, 94, 0.75)" }}>❦</div>
          <div className="absolute top-1/2 left-2 -translate-y-1/2 text-[10px]" style={{ color: "rgba(201, 164, 94, 0.6)" }}>❖</div>
          <div className="absolute top-1/2 right-2 -translate-y-1/2 text-[10px]" style={{ color: "rgba(201, 164, 94, 0.6)" }}>❖</div>

          <div className="font-label text-[8px] text-gold/80" style={{ color: "rgba(201, 164, 94, 0.75)" }}>
            OFFICIAL EDITION
          </div>
          <div className="mt-3 font-display text-[clamp(1.4rem,3.2vw,2.6rem)] leading-[1.02] tracking-wide" style={{ color: "#F1E4C6" }}>
            Reverend
            <br />
            Insanity
          </div>
          <div className="mt-3 text-[9px] tabular" style={{ color: "rgba(201, 164, 94, 0.7)", letterSpacing: "0.35em" }}>
            蛊 · 真 · 人
          </div>
          <div className="mt-4 font-label text-[8px]" style={{ color: "rgba(255,255,255,0.55)" }}>
            GU · ZHEN · REN
          </div>
          <div className="mt-6 flex items-center gap-2 text-[8px]" style={{ color: "rgba(201, 164, 94, 0.6)" }}>
            <span>VOL I</span>
            <span>·</span>
            <span>MMXXVI</span>
            <span>·</span>
            <span>VII ARCS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
