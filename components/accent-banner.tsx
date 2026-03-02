"use client"

import Link from "next/link"
import { Mic, ArrowRight, Globe, Headphones, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AccentBanner() {
  return (
    <section className="py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/8 via-background to-rose-50/40">
          {/* Decorative bg circles */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/5 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-rose-100/30 rounded-full" />

          <div className="relative p-7 sm:p-10 flex flex-col sm:flex-row items-center gap-8">
            {/* Left side */}
            <div className="flex-1 text-center sm:text-left space-y-4">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
                <Mic className="w-3.5 h-3.5" />
                Yeni Quiz
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground text-balance">
                Accent Challenge
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-md">
                {"Kısa bir metin oku, aksanını analiz ettirelim. Hangi telaffuz profiline uyuyorsun? Kişiselleştirilmiş egzersizlerle geliş!"}
              </p>

              {/* Features row */}
              <div className="flex items-center justify-center sm:justify-start gap-5 pt-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Globe className="w-3.5 h-3.5 text-primary" />
                  <span>11 Aksan Profili</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Headphones className="w-3.5 h-3.5 text-violet-500" />
                  <span>Ses Analizi</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{"Detaylı Rapor"}</span>
                </div>
              </div>
            </div>

            {/* Right: CTA + visual */}
            <div className="shrink-0 flex flex-col items-center gap-4">
              {/* Visual mic icon */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center animate-pulse">
                    <Mic className="w-8 h-8 text-primary" />
                  </div>
                </div>
                {/* Small ring animation */}
                <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" style={{ animationDuration: "2s" }} />
              </div>

              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-8 shadow-sm hover:shadow-md transition-all"
                asChild
              >
                <Link href="/meydan-oku?game=speaking" className="flex items-center gap-2">
                  {"Aksanımı Test Et"}
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
