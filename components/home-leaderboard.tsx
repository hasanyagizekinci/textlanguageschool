"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Trophy, ArrowRight, Flame } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface LeaderEntry {
  player_id: string
  nickname: string
  total_xp: number
  current_streak: number
  rank: number
}

const MEDALS = ["bg-amber-400 text-amber-950", "bg-zinc-300 text-zinc-800", "bg-orange-300 text-orange-900"]

export function HomeLeaderboard() {
  const [leaders, setLeaders] = useState<LeaderEntry[]>([])

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      if (!supabase) return
      const { data } = await supabase
        .from("leaderboard_overall")
        .select("player_id, nickname, total_xp, current_streak, rank")
        .order("rank", { ascending: true })
        .limit(5)
      if (data) setLeaders(data as LeaderEntry[])
    }
    load()
  }, [])

  if (leaders.length === 0) return null

  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-3">
            <Trophy className="w-4 h-4" />
            Liderlik Tablosu
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground text-balance">
            {"En \u0130yi Oyuncular"}
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            {"Quiz \u00e7\u00f6z, XP kazan, zirvede yerini al!"}
          </p>
        </div>

        {/* Podium - top 3 */}
        {leaders.length >= 3 && (
          <div className="flex items-end justify-center gap-3 mb-6">
            {/* 2nd place */}
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full ${MEDALS[1]} flex items-center justify-center font-bold text-lg`}>
                {leaders[1].nickname.charAt(0).toUpperCase()}
              </div>
              <div className="bg-zinc-200 dark:bg-zinc-700 rounded-t-lg w-20 h-16 mt-2 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-muted-foreground">2.</span>
                <span className="text-[11px] font-medium text-foreground truncate max-w-[72px]">{leaders[1].nickname}</span>
                <span className="text-[10px] text-muted-foreground">{leaders[1].total_xp} XP</span>
              </div>
            </div>
            {/* 1st place */}
            <div className="flex flex-col items-center -mt-4">
              <div className={`w-14 h-14 rounded-full ${MEDALS[0]} flex items-center justify-center font-bold text-xl ring-2 ring-amber-300`}>
                {leaders[0].nickname.charAt(0).toUpperCase()}
              </div>
              <div className="bg-amber-100 dark:bg-amber-900/30 rounded-t-lg w-24 h-24 mt-2 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400">1.</span>
                <span className="text-xs font-semibold text-foreground truncate max-w-[88px]">{leaders[0].nickname}</span>
                <span className="text-[11px] text-muted-foreground">{leaders[0].total_xp} XP</span>
                {leaders[0].current_streak > 0 && (
                  <span className="flex items-center gap-0.5 text-[10px] text-orange-500 mt-0.5">
                    <Flame className="w-3 h-3" />{leaders[0].current_streak}
                  </span>
                )}
              </div>
            </div>
            {/* 3rd place */}
            <div className="flex flex-col items-center">
              <div className={`w-11 h-11 rounded-full ${MEDALS[2]} flex items-center justify-center font-bold text-base`}>
                {leaders[2].nickname.charAt(0).toUpperCase()}
              </div>
              <div className="bg-orange-100 dark:bg-orange-900/20 rounded-t-lg w-20 h-12 mt-2 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-orange-700 dark:text-orange-400">3.</span>
                <span className="text-[11px] font-medium text-foreground truncate max-w-[72px]">{leaders[2].nickname}</span>
                <span className="text-[10px] text-muted-foreground">{leaders[2].total_xp} XP</span>
              </div>
            </div>
          </div>
        )}

        {/* 4th and 5th */}
        {leaders.length > 3 && (
          <div className="space-y-2 max-w-sm mx-auto mb-6">
            {leaders.slice(3).map((l) => (
              <div key={l.player_id} className="flex items-center gap-3 bg-muted/40 rounded-xl px-4 py-2.5">
                <span className="text-sm font-bold text-muted-foreground w-5">{l.rank}.</span>
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                  {l.nickname.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium flex-1 truncate">{l.nickname}</span>
                <span className="text-xs text-muted-foreground">{l.total_xp} XP</span>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/liderlik"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            {"T\u00fcm Tabloyu G\u00f6r"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
