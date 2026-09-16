import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="fog-bg min-h-[calc(100vh-72px)] relative flex items-center justify-center px-6">
      <div className="absolute inset-0 orange-halo opacity-20 pointer-events-none" />
      <div className="relative text-center max-w-xl fade-up">
        <h1 className="font-display text-4xl sm:text-6xl text-slate-200 leading-tight">
          [404] Lost in the Grey Fog
        </h1>
        <p className="mt-6 font-body-serif italic text-slate-400 text-lg leading-relaxed">
          &ldquo;The path you seek is veiled by secrets. Even a Rank 9 Gu Master
          cannot find what does not exist in this era.&rdquo;
        </p>
        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          <Button
            data-testid="404-home-btn"
            onClick={() => navigate("/")}
            className="rounded-full bg-orange-400 hover:bg-orange-300 text-slate-950 font-medium px-7 h-11 text-sm shadow-[0_10px_30px_-10px_rgba(236,139,96,0.6)]"
          >
            Return to the Fog
          </Button>
          <Button
            data-testid="404-back-btn"
            onClick={() => navigate(-1)}
            variant="ghost"
            className="rounded-full bg-white/5 hover:bg-white/10 text-slate-200 font-medium px-7 h-11 text-sm border border-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
