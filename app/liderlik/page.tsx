"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Trophy, Flame, ArrowLeft, Calendar, Star, Zap } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/client"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

interface LeaderEntry {
  player_id: string
  nickname: string
  avatar_seed?: string
  total_xp?: number
  week_xp?: number
  month_xp?: number
  current_streak?: number
  best_streak?: number
  total_quizzes?: number
  rank: number
}

const MEDAL_COLORS = [
  "bg-amber-400 text-amber-950 ring-2 ring-amber-300",
  "bg-zinc-300 text-zinc-800 ring-2 ring-zinc-200",
  "bg-orange-300 text-orange-900 ring-2 ring-orange-200",
]

export default function LiderlikPage() {
  const [tab, setTab] = useState("genel")
  const [leaders, setLeaders] = useState<LeaderEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [myPlayerId, setMyPlayerId] = useState<string | null>(null)

  useEffect(() => {
    const pid = typeof window !== "undefined" ? localStorage.getItem("tls_player_id") : null
    setMyPlayerId(pid)
  }, [])

  useEffect(() => {
    async function load() {
      setLoading(true)
      const supabase = createClient()

      let query
      if (tab === "genel") {
        query = supabase.from("leaderboard_overall")
          .select("player_id, nickname, avatar_seed, total_xp, current_streak, best_streak, total_quizzes, rank")
          .order("rank", { ascending: true })
          .limit(50)
      } else if (tab === "haftalik") {
        query = supabase.from("leaderboard_weekly")
          .select("player_id, nickname, avatar_seed, week_xp, rank")
          .order("rank", { ascending: true })
          .limit(50)
      } else {
        query = supabase.from("leaderboard_monthly")
          .select("player_id, nickname, avatar_seed, month_xp, rank")
          .order("rank", { ascending: true })
          .limit(50)
      }

      const { data } = await query
      if (data) setLeaders(data as LeaderEntry[])
      setLoading(false)
    }
    load()
  }, [tab])

  function getXp(l: LeaderEntry) {
    if (tab === "haftalik") return l.week_xp ?? 0
    if (tab === "aylik") return l.month_xp ?? 0
    return l.total_xp ?? 0
  }

  return (
    <div className="relative min-h-screen">
      <Navigation />
      <main className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Link href="/" className="p-2 rounded-full hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <h1 className="font-serif text-2xl font-bold flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-500" />
                Liderlik Tablosu
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {"Quiz \u00e7\u00f6z, XP kazan, zirvede yerini al!"}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={tab} onValueChange={setTab} className="mb-6">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="genel" className="gap-1.5">
                <Star className="w-3.5 h-3.5" />
                Genel
              </TabsTrigger>
              <TabsTrigger value="haftalik" className="gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                {"Haftal\u0131k"}
              </TabsTrigger>
              <TabsTrigger value="aylik" className="gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {"Ayl\u0131k"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value={tab} className="mt-4">
              {loading ? (
                <div className="text-center py-16">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm text-muted-foreground mt-3">{"Y\u00fckleniyor..."}</p>
                </div>
              ) : leaders.length === 0 ? (
                <Card>
                  <CardContent className="py-16 text-center">
                    <Trophy className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">{"Hen\u00fcz s\u0131ralamada kimse yok."}</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">{"Quiz \u00e7\u00f6zerek ilk sen ol!"}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {leaders.map((l) => {
                    const xp = getXp(l)
                    const isMe = l.player_id === myPlayerId
                    const isTop3 = l.rank <= 3

                    return (
                      <div
                        key={l.player_id}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
                          isMe
                            ? "bg-primary/10 ring-1 ring-primary/30"
                            : isTop3
                            ? "bg-muted/60"
                            : "bg-muted/30 hover:bg-muted/50"
                        }`}
                      >
                        {/* Rank */}
                        <span className="text-sm font-bold text-muted-foreground w-6 text-right shrink-0">
                          {l.rank}.
                        </span>

                        {/* Avatar */}
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                          isTop3 && l.rank <= 3
                            ? MEDAL_COLORS[l.rank - 1]
                            : "bg-primary/10 text-primary"
                        }`}>
                          {l.nickname.charAt(0).toUpperCase()}
                        </div>

                        {/* Name */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${isMe ? "text-primary" : ""}`}>
                            {l.nickname}
                            {isMe && <span className="text-xs ml-1.5 text-primary/70">(sen)</span>}
                          </p>
                          {tab === "genel" && l.total_quizzes != null && l.total_quizzes > 0 && (
                            <p className="text-[11px] text-muted-foreground">{l.total_quizzes} quiz</p>
                          )}
                        </div>

                        {/* Streak */}
                        {(l.current_streak ?? 0) > 0 && tab === "genel" && (
                          <span className="flex items-center gap-0.5 text-xs text-orange-500 shrink-0">
                            <Flame className="w-3.5 h-3.5" />
                            {l.current_streak}
                          </span>
                        )}

                        {/* XP */}
                        <span className="text-sm font-semibold text-foreground shrink-0">
                          {xp.toLocaleString()} XP
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* CTA for non-registered */}
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground mb-3">
              {"Sende quiz \u00e7\u00f6zerek liderlik tablosunda y\u00fcksel!"}
            </p>
            <Link
              href="/meydan-oku"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              {"Hemen Quiz \u00c7\u00f6z"}
              <Zap className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
