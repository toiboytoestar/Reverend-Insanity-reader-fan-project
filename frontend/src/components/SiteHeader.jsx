import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { BookOpen, ListOrdered, Bookmark, Home } from "lucide-react";
import { TID } from "@/lib/testIds";

const links = [
  { to: "/", label: "Home", icon: Home, testid: TID.navHome },
  { to: "/toc", label: "Chapters", icon: ListOrdered, testid: TID.navToc },
  { to: "/bookmarks", label: "Bookmarks", icon: Bookmark, testid: TID.navBookmarks },
];

export default function SiteHeader() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/read/")) return null;
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-black/60 border-b border-emerald-500/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
        <Link to="/" data-testid={TID.siteLogo} className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-sm border border-emerald-500/40 grid place-items-center bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors">
            <BookOpen className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-base sm:text-lg tracking-widest text-emerald-100">
              REVEREND INSANITY
            </div>
            <div className="font-label text-[10px] text-emerald-500/70">Gu Master Reader</div>
          </div>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end
              data-testid={l.testid}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 sm:px-4 py-2 rounded-sm text-xs sm:text-sm font-label border transition-colors ${
                  isActive
                    ? "border-emerald-500/50 text-emerald-300 bg-emerald-500/10"
                    : "border-transparent text-slate-400 hover:text-emerald-200 hover:border-emerald-500/20"
                }`
              }
            >
              <l.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{l.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
