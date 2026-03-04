"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DoodleArrow, DoodleStar } from "@/components/doodles"

function ScooterIllustration() {
  return (
    <svg width="120" height="90" viewBox="0 0 120 90" fill="none" className="shrink-0">
      {/* Road */}
      <line x1="0" y1="78" x2="120" y2="78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-border" />
      {/* Scooter frame */}
      <path d="M40 68 L65 68 L75 50 L70 50" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Handlebar */}
      <line x1="75" y1="50" x2="75" y2="40" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="70" y1="40" x2="80" y2="40" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
      {/* Front wheel */}
      <circle cx="75" cy="73" r="5" stroke="#3b82f6" strokeWidth="2" fill="none" />
      <circle cx="75" cy="73" r="1" fill="#3b82f6" />
      {/* Rear wheels */}
      <circle cx="40" cy="73" r="5" stroke="#3b82f6" strokeWidth="2" fill="none" />
      <circle cx="40" cy="73" r="1" fill="#3b82f6" />
      {/* Rider body */}
      <circle cx="58" cy="30" r="6" stroke="#334155" strokeWidth="2" fill="none" />
      {/* Eyes */}
      <circle cx="56" cy="29" r="0.8" fill="#334155" />
      <circle cx="60" cy="29" r="0.8" fill="#334155" />
      {/* Smile */}
      <path d="M56 32 Q58 34 60 32" stroke="#334155" strokeWidth="1" strokeLinecap="round" fill="none" />
      {/* Torso */}
      <rect x="52" y="37" width="12" height="14" rx="2" stroke="#334155" strokeWidth="2" fill="none" />
      {/* CEO text */}
      <text x="58" y="47" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#3b82f6" fontFamily="sans-serif">CEO</text>
      {/* Arms to handlebar */}
      <path d="M52 42 L48 46 M64 42 L70 42" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
      {/* Legs */}
      <path d="M55 51 L52 68 M61 51 L64 68" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
      {/* Motion lines */}
      <line x1="20" y1="50" x2="28" y2="50" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 4" />
      <line x1="15" y1="58" x2="25" y2="58" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 4" />
      <line x1="18" y1="66" x2="26" y2="66" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 4" />
    </svg>
  )
}

export function FeaturedGame() {
  return (
    <section className="py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="relative doodle-card rounded-2xl border border-border/60 bg-card p-6 sm:p-8 overflow-hidden">
          {/* Doodle decorations */}
          <div className="absolute top-3 right-3 opacity-40">
            <DoodleStar size={20} className="text-primary/40" />
          </div>
          <div className="absolute bottom-4 left-2 rotate-45 opacity-30">
            <DoodleArrow size={22} className="text-primary/30" />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Illustration */}
            <ScooterIllustration />

            {/* Content */}
            <div className="flex-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">Yeni Oyun</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground mb-1">Scooter Ride</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {"2\u20133 dakikal\u0131k h\u0131zl\u0131 \u0130ngilizce prati\u011fi"}
              </p>

              {/* Tags */}
              <div className="flex items-center gap-2 mb-4 justify-center sm:justify-start flex-wrap">
                <span className="text-[11px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">hizli</span>
                <span className="text-[11px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">kisa</span>
                <span className="text-[11px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">eglenceli</span>
              </div>

              <Button size="sm" className="rounded-xl px-6" asChild>
                <Link href="/meydan-oku?game=scooter">{"Ba\u015fla"}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
