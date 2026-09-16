import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { BookOpen, ListOrdered, Bookmark, Home, History } from "lucide-react";
import { TID } from "@/lib/testIds";

const links = [
  { to: "/", label: "Home", icon: Home, testid: TID.navHome },
  { to: "/toc", label: "Chapters", icon: ListOrdered, testid: TID.navToc },
  { to: "/history", label: "History", icon: History, testid: TID.navHistory },
  { to: "/bookmarks", label: "Bookmarks", icon: Bookmark, testid: TID.navBookmarks },
];

export default function SiteHeader() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/read/")) return null;
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-black/60 border-b border-orange-500/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
        <Link to="/" data-testid={TID.siteLogo} className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-md border border-orange-400/40 grid place-items-center bg-orange-500/5 group-hover:bg-orange-500/10 transition-colors">
            <BookOpen className="w-4 h-4 text-orange-300" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg sm:text-xl tracking-wide text-orange-300">
              Reverend Insanity
            </div>
            <div className="font-label text-[9px] text-slate-500">Gu Master Reader</div>
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
                `flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium border transition-colors ${
                  isActive
                    ? "border-orange-400/50 text-orange-200 bg-orange-500/10"
                    : "border-transparent text-slate-400 hover:text-orange-200 hover:border-orange-400/25"
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
