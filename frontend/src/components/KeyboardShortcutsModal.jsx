import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const SHORTCUTS = [
  { keys: ["→", "J", "Space"], desc: "Next chapter" },
  { keys: ["←", "K"], desc: "Previous chapter" },
  { keys: ["B"], desc: "Toggle bookmark" },
  { keys: ["S"], desc: "Open reader settings" },
  { keys: ["T"], desc: "Open Table of Contents" },
  { keys: ["F"], desc: "Cycle column width" },
  { keys: ["Z"], desc: "Distraction-free (fullscreen)" },
  { keys: ["?"], desc: "Open this shortcut guide" },
  { keys: ["Esc"], desc: "Close panels" },
];

function Key({ children }) {
  return (
    <kbd className="px-2 py-1 rounded-sm border border-orange-500/30 bg-black/50 font-body-mono text-[11px] text-orange-200 min-w-[28px] text-center">
      {children}
    </kbd>
  );
}

export default function KeyboardShortcutsModal({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0B0D0E] border-orange-500/20 text-slate-100 max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-orange-50 tracking-widest">
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-3">
          {SHORTCUTS.map((s) => (
            <div key={s.desc} className="flex items-center justify-between">
              <div className="text-sm text-slate-300 font-body-serif">{s.desc}</div>
              <div className="flex items-center gap-1.5">
                {s.keys.map((k) => (
                  <Key key={k}>{k}</Key>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
