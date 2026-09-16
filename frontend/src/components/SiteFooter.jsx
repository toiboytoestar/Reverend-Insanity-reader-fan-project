import React from "react";
import { useLocation } from "react-router-dom";
import { Instagram } from "lucide-react";

export default function SiteFooter() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/read/")) return null;
  return (
    <footer className="relative z-10 border-t border-white/5 bg-black/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="font-label text-[10px] text-slate-500 text-center sm:text-left">
          Reverend Insanity · Fan Reader · Original work by Gu Zhen Ren
        </div>
        <a
          href="https://instagram.com/toiboytoestar"
          target="_blank"
          rel="noopener noreferrer"
          data-testid="creator-instagram-link"
          className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 hover:border-orange-400/40 hover:bg-orange-500/10 px-4 h-9 transition-colors"
        >
          <Instagram className="w-3.5 h-3.5 text-orange-300 group-hover:text-orange-200" />
          <span className="font-label text-[10px] text-slate-400 group-hover:text-orange-200">
            Crafted by <span className="text-slate-200 group-hover:text-orange-100">toiboy Toestar</span>
            <span className="ml-2 text-orange-300/80 group-hover:text-orange-200">@toiboytoestar</span>
          </span>
        </a>
      </div>
    </footer>
  );
}
