"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Swords, LogIn, Zap, BookOpen, User, ChevronDown, Trophy, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export function Hero() {
  const [user, setUser] = useState<{ email?: string; nickname?: string } | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (u) {
        const nick = u.user_metadata?.nickname || u.email?.split("@")[0] || "Kullanıcı"
        setUser({ email: u.email, nickname: nick })
      }
    })
  }, [])

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Subtle gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="flex flex-col items-center text-center gap-8 max-w-3xl mx-auto">
          {/* Logo - clean, no circle */}
          <div className="animate-in fade-in zoom-in duration-700">
            <div className="w-28 h-28 md:w-36 md:h-36 relative">
              <Image src="/logo.png" alt="Text Language School Logo" fill className="object-contain" priority />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-semibold">
              <Zap className="w-3.5 h-3.5" />
              {"Ki\u015fiye \u00f6zel \u0130ngilizce e\u011fitimi"}
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-balance leading-[1.1] tracking-tight">
              {"\u0130ngilizce "}
              <span className="text-primary relative">
                {"\u00f6\u011frenmeyi"}
                <svg className="absolute -bottom-1 left-0 w-full h-3 text-primary/30" viewBox="0 0 200 12" fill="none">
                  <path d="M2 8c40-6 80-6 120-2s60 4 76-2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
              <br />
              {"maceraya d\u00f6n\u00fc\u015ft\u00fcr!"}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              {"Seviyene, hedeflerine ve \u00f6\u011frenme stiline g\u00f6re haz\u0131rlanan m\u00fcfredat ile \u0130ngilizce hedeflerine ula\u015f. Quiz \u00e7\u00f6z, meydan oku, XP kazan!"}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 w-full max-w-md mx-auto space-y-4">
            {user ? (
              <>
                {/* Logged in: profile pill */}
                <div className="flex items-center justify-center gap-3">
                  <Link href="/profil" className="doodle-card flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-border/50 bg-card hover:bg-muted/50 transition-all">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">{"Merhaba, "}{user.nickname}</span>
                  </Link>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  <Button size="lg" variant="outline" className="text-sm px-3 rounded-xl border-2 hover:border-primary/40 transition-all h-12 font-semibold" asChild>
                    <Link href="/#pratik" className="flex flex-col items-center gap-0.5">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-[11px]">{"Quiz \u00c7\u00f6z"}</span>
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="text-sm px-3 rounded-xl border-2 hover:border-amber-400/40 transition-all h-12 font-semibold" asChild>
                    <Link href="/meydan-oku" className="flex flex-col items-center gap-0.5">
                      <Swords className="w-4 h-4 text-amber-500" />
                      <span className="text-[11px]">Meydan Oku</span>
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="text-sm px-3 rounded-xl border-2 hover:border-secondary/40 transition-all h-12 font-semibold" asChild>
                    <Link href="/liderlik" className="flex flex-col items-center gap-0.5">
                      <Trophy className="w-4 h-4 text-secondary" />
                      <span className="text-[11px]">Liderlik</span>
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button size="lg" className="w-full text-base px-8 rounded-xl shadow-lg hover:shadow-xl transition-all h-13 font-semibold" asChild>
                  <Link href="/auth/giris" className="flex items-center justify-center gap-2.5">
                    <LogIn className="w-5 h-5" />
                    {"Giri\u015f Yap / Kay\u0131t Ol"}
                  </Link>
                </Button>
                <div className="grid grid-cols-3 gap-2.5">
                  <Button size="lg" variant="outline" className="text-sm px-3 rounded-xl border-2 hover:border-primary/40 transition-all h-12 font-semibold" asChild>
                    <Link href="/demo-ders" className="flex flex-col items-center gap-0.5">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span className="text-[11px]">Demo Ders</span>
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="text-sm px-3 rounded-xl border-2 hover:border-secondary/40 transition-all h-12 font-semibold" asChild>
                    <Link href="/#pratik" className="flex flex-col items-center gap-0.5">
                      <Sparkles className="w-4 h-4 text-secondary" />
                      <span className="text-[11px]">{"Quiz \u00c7\u00f6z"}</span>
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="text-sm px-3 rounded-xl border-2 hover:border-amber-400/40 transition-all h-12 font-semibold" asChild>
                    <Link href="/meydan-oku" className="flex flex-col items-center gap-0.5">
                      <Swords className="w-4 h-4 text-amber-500" />
                      <span className="text-[11px]">Meydan Oku</span>
                    </Link>
                  </Button>
                </div>
              </>
            )}

            <div className="flex items-center justify-center gap-6 pt-2">
              <Link href="/hakkimda" className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 decoration-border hover:decoration-foreground/30">
                {"Hakk\u0131mda"}
              </Link>
              <Link href="/dersler" className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 decoration-border hover:decoration-foreground/30">
                {"Dersler & \u00dccretler"}
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {"Canl\u0131 dersler"}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.5s" }} />
              {"10+ quiz t\u00fcr\u00fc"}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" style={{ animationDelay: "1s" }} />
              XP sistemi
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-border/40" />
    </section>
  )
}
