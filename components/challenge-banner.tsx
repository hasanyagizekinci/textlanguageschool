"use client"

import Link from "next/link"
import { Swords, ArrowRight, Users, Trophy, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ChallengeBanner() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 rounded-full translate-y-1/2 -translate-x-1/4" />

          <div className="relative p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-8">
            {/* Left: Icon + Text */}
            <div className="flex-1 text-center sm:text-left space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
                <Swords className="w-3.5 h-3.5" />
                Yeni
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground text-balance">
                Meydan Oku!
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-md">
                Quiz sonucunu arkadaşlarınla paylaş, onları geçmeye davet et. Düello modunda birebir yarış!
              </p>

              {/* Stats */}
              <div className="flex items-center justify-center sm:justify-start gap-6 pt-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  <span>Arkadaşlarınla yarış</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>Skorları karşılaştır</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  <span>Düello modu</span>
                </div>
              </div>
            </div>

            {/* Right: CTA */}
            <div className="shrink-0">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-8 shadow-sm hover:shadow-md transition-all"
                asChild
              >
                <Link href="/meydan-oku" className="flex items-center gap-2">
                  Hemen Oyna
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
