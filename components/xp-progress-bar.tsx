"use client"

import { useState, useEffect } from "react"
import { loadProgress, getLevelTitle, getXpForNextLevel, type UserProgress } from "@/lib/xp-system"
import { Flame, Star, Trophy, TrendingUp, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

export function XpProgressBar() {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    setProgress(loadProgress())
    const handleUpdate = () => setProgress(loadProgress())
    window.addEventListener("xp-updated", handleUpdate)
    return () => window.removeEventListener("xp-updated", handleUpdate)
  }, [])

  if (!progress || progress.totalXp === 0) return null

  const currentLevelXp = getXpForNextLevel(progress.level - 1)
  const nextLevelXp = getXpForNextLevel(progress.level)
  const xpInLevel = progress.totalXp - currentLevelXp
  const xpNeeded = nextLevelXp - currentLevelXp
  const percent = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100))

  return (
    <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-500">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full group"
        aria-expanded={expanded}
        aria-label="XP detaylari"
      >
        <div className="rounded-lg border border-border/50 bg-card p-3 md:p-4 transition-shadow hover:shadow-sm">
          {/* Top row */}
          <div className="flex items-center gap-3">
            {/* Level badge */}
            <div className="relative shrink-0">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-foreground flex items-center justify-center text-background font-bold text-sm md:text-base">
                {progress.level}
              </div>
              {progress.streak >= 3 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-secondary border-2 border-card flex items-center justify-center">
                  <Flame className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>

            {/* Info + bar */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-foreground">{getLevelTitle(progress.level)}</span>
                  {progress.streak > 0 && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      {progress.streak} gün seri
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono font-medium text-muted-foreground tabular-nums">
                    {progress.totalXp} XP
                  </span>
                  {expanded ? (
                    <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* XP bar */}
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-foreground/70 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-muted-foreground">Seviye {progress.level}</span>
                <span className="text-[10px] text-muted-foreground">{xpInLevel}/{xpNeeded} XP</span>
              </div>
            </div>
          </div>

          {/* Expanded stats */}
          {expanded && (
            <div className="mt-3 pt-3 border-t border-border/40 grid grid-cols-4 gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
              {[
                { icon: Star, value: progress.totalXp, label: "Toplam XP", color: "text-muted-foreground" },
                { icon: Flame, value: progress.streak, label: "Gün Seri", color: "text-muted-foreground" },
                { icon: Trophy, value: progress.achievements.length, label: "Rozet", color: "text-muted-foreground" },
                { icon: TrendingUp, value: progress.totalActivities, label: "Aktivite", color: "text-muted-foreground" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center p-2 rounded-lg bg-muted/40">
                  <stat.icon className={cn("w-3.5 h-3.5 mb-1", stat.color)} strokeWidth={1.5} />
                  <span className="text-sm font-semibold tabular-nums">{stat.value}</span>
                  <span className="text-[10px] text-muted-foreground leading-none">{stat.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </button>
    </div>
  )
}
