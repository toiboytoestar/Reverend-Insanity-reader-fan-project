import React from "react";
import { useReaderSettings } from "@/context/ReaderSettings";
import { TID } from "@/lib/testIds";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const THEMES = [
  { id: "dark", name: "Gu Abyss", swatch: "#0B0D0E", ring: "#10B981" },
  { id: "sepia", name: "Ancient Scroll", swatch: "#FBF0D9", ring: "#B45309" },
  { id: "light", name: "Imperial Jade", swatch: "#FAFAFA", ring: "#059669" },
  { id: "black", name: "Void Realm", swatch: "#000000", ring: "#06B6D4" },
];

const FONTS = [
  { id: "serif", name: "Serif", sample: "Aa" },
  { id: "sans", name: "Sans", sample: "Aa" },
  { id: "mono", name: "Mono", sample: "Aa" },
];

const WIDTHS = [
  { id: "narrow", name: "Narrow" },
  { id: "medium", name: "Medium" },
  { id: "wide", name: "Wide" },
  { id: "full", name: "Full" },
];

export default function ReaderSettingsPanel({ open, onOpenChange }) {
  const { settings, update, reset } = useReaderSettings();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        data-testid={TID.settingsPanel}
        side="right"
        className="w-full sm:max-w-md bg-[#0B0D0E] border-orange-500/20 text-slate-100 overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="font-display text-2xl text-orange-50 tracking-widest">
            Reader Settings
          </SheetTitle>
          <div className="font-label text-[10px] text-orange-400">Sculpt your reading pane</div>
        </SheetHeader>

        {/* Theme */}
        <section className="mt-8">
          <div className="font-label text-[10px] text-slate-400 mb-3">Theme</div>
          <div className="grid grid-cols-2 gap-3">
            {THEMES.map((t) => {
              const active = settings.theme === t.id;
              return (
                <button
                  key={t.id}
                  data-testid={TID.themeSelector(t.id)}
                  onClick={() => update({ theme: t.id })}
                  className={`group border p-3 rounded-sm flex items-center gap-3 transition-colors ${
                    active
                      ? "border-orange-500/60 bg-orange-500/10"
                      : "border-orange-500/10 hover:border-orange-500/40"
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-sm border"
                    style={{ background: t.swatch, borderColor: active ? t.ring : "rgba(255,255,255,0.1)" }}
                  />
                  <div className="text-left">
                    <div className="font-body-serif text-sm text-orange-50">{t.name}</div>
                    <div className="font-label text-[10px] text-slate-500">{t.id}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Font family */}
        <section className="mt-8">
          <div className="font-label text-[10px] text-slate-400 mb-3">Font Family</div>
          <div className="grid grid-cols-3 gap-2">
            {FONTS.map((f) => {
              const active = settings.fontFamily === f.id;
              const cls =
                f.id === "serif" ? "font-body-serif" : f.id === "sans" ? "font-body-sans" : "font-body-mono";
              return (
                <button
                  key={f.id}
                  data-testid={TID.fontFamilySelector(f.id)}
                  onClick={() => update({ fontFamily: f.id })}
                  className={`border p-3 rounded-sm transition-colors ${
                    active
                      ? "border-orange-500/60 bg-orange-500/10 text-orange-200"
                      : "border-orange-500/10 hover:border-orange-500/40 text-slate-300"
                  }`}
                >
                  <div className={`${cls} text-2xl`}>{f.sample}</div>
                  <div className="font-label text-[10px] mt-1">{f.name}</div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Font size */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <div className="font-label text-[10px] text-slate-400">Font Size</div>
            <div className="font-body-mono text-xs text-orange-300">{settings.fontSize}px</div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              data-testid={TID.fontSizeDown}
              variant="outline"
              size="icon"
              onClick={() => update({ fontSize: Math.max(12, settings.fontSize - 1) })}
              className="border-orange-500/30 text-orange-200 hover:bg-orange-500/10"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Slider
              value={[settings.fontSize]}
              min={12}
              max={32}
              step={1}
              onValueChange={([v]) => update({ fontSize: v })}
              className="flex-1"
            />
            <Button
              data-testid={TID.fontSizeUp}
              variant="outline"
              size="icon"
              onClick={() => update({ fontSize: Math.min(32, settings.fontSize + 1) })}
              className="border-orange-500/30 text-orange-200 hover:bg-orange-500/10"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </section>

        {/* Line height */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <div className="font-label text-[10px] text-slate-400">Line Height</div>
            <div className="font-body-mono text-xs text-orange-300">{settings.lineHeight.toFixed(2)}</div>
          </div>
          <Slider
            data-testid={TID.lineHeightSlider}
            value={[Math.round(settings.lineHeight * 100)]}
            min={120}
            max={220}
            step={5}
            onValueChange={([v]) => update({ lineHeight: v / 100 })}
          />
        </section>

        {/* Letter spacing */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <div className="font-label text-[10px] text-slate-400">Letter Spacing</div>
            <div className="font-body-mono text-xs text-orange-300">{settings.letterSpacing.toFixed(3)}em</div>
          </div>
          <Slider
            value={[Math.round(settings.letterSpacing * 1000)]}
            min={-20}
            max={80}
            step={5}
            onValueChange={([v]) => update({ letterSpacing: v / 1000 })}
          />
        </section>

        {/* Container width */}
        <section className="mt-8">
          <div className="font-label text-[10px] text-slate-400 mb-3">Column Width</div>
          <div className="grid grid-cols-4 gap-2">
            {WIDTHS.map((w) => {
              const active = settings.width === w.id;
              return (
                <button
                  key={w.id}
                  data-testid={TID.widthSelector(w.id)}
                  onClick={() => update({ width: w.id })}
                  className={`border p-3 rounded-sm font-label text-[10px] tracking-widest transition-colors ${
                    active
                      ? "border-orange-500/60 bg-orange-500/10 text-orange-200"
                      : "border-orange-500/10 hover:border-orange-500/40 text-slate-300"
                  }`}
                >
                  {w.name}
                </button>
              );
            })}
          </div>
        </section>

        {/* Reset */}
        <section className="mt-10 pt-6 border-t border-orange-500/10">
          <Button
            data-testid={TID.resetSettingsBtn}
            variant="ghost"
            onClick={() => {
              reset();
              toast("Settings reset", { description: "Reader defaults restored" });
            }}
            className="text-slate-400 hover:text-orange-200 font-label text-xs tracking-widest"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-2" />
            Reset to defaults
          </Button>
        </section>
      </SheetContent>
    </Sheet>
  );
}
