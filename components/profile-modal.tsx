"use client"

import { useState, useEffect } from "react"
import { X, Trophy, Flame, Target, Star, Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { loadProgress, getLevelFromXp, getLevelTitle, getXpForNextLevel, ALL_ACHIEVEMENTS, type UserProgress } from "@/lib/xp-system"

interface ProfileModalProps {
  open: boolean
  onClose: () => void
}

export function ProfileModal({ open, onClose }: ProfileModalProps) {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [username, setUsername] = useState("")
  const [editingName, setEditingName] = useState(false)

  useEffect(() => {
    if (!open) return
    setProgress(loadProgress())
    const stored = localStorage.getItem("tls_username")
    if (stored) setUsername(stored)
  }, [open])

  const saveName = () => {
    localStorage.setItem("tls_username", username)
    setEditingName(false)
  }

  if (!open || !progress) return null

  const level = getLevelFromXp(progress.totalXp)
  const levelTitle = getLevelTitle(level)
  const nextLevelXp = getXpForNextLevel(level)
  const prevLevelXp = level > 1 ? getXpForNextLevel(level - 1) : 0
  const levelProgress = nextLevelXp > prevLevelXp
    ? Math.round(((progress.totalXp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100)
    : 100

  const unlockedBadges = ALL_ACHIEVEMENTS.filter(a => progress.achievements.includes(a.id))
  const totalQuizzes = progress.totalActivities
  const avgXpPerActivity = progress.totalActivities > 0 ? Math.round(progress.totalXp / progress.totalActivities) : 0

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div
        className="fixed inset-x-0 bottom-0 z-[61] max-h-[90dvh] overflow-y-auto overscroll-contain rounded-t-2xl bg-background shadow-2xl animate-in slide-in-from-bottom duration-300"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-label="Profil"
      >
        {/* Sticky close bar */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm flex items-center justify-between px-5 pt-4 pb-2">
          <h3 className="font-serif text-xl font-bold">Patikam</h3>
          <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 pb-8">
          {/* Avatar & Name */}
          <div className="text-center mb-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 via-slate-50 to-blue-50 border-2 border-blue-100/60 mx-auto mb-2 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 40 40">
                <line x1="20" y1="4" x2="20" y2="36" stroke="currentColor" strokeWidth="2" className="text-blue-300" />
                <line x1="4" y1="20" x2="36" y2="20" stroke="currentColor" strokeWidth="2" className="text-blue-300" />
                <line x1="8" y1="8" x2="32" y2="32" stroke="currentColor" strokeWidth="1.5" className="text-blue-200" />
                <line x1="32" y1="8" x2="8" y2="32" stroke="currentColor" strokeWidth="1.5" className="text-blue-200" />
                <circle cx="20" cy="20" r="4" fill="currentColor" className="text-blue-300" />
              </svg>
            </div>
            {editingName ? (
              <div className="flex items-center gap-2 justify-center">
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Isminiz"
                  className="text-sm border border-border rounded-lg px-3 py-1.5 w-36 text-center bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/20"
                  maxLength={20}
                  autoFocus
                  onKeyDown={e => e.key === "Enter" && saveName()}
                />
                <button onClick={saveName} className="text-sm text-primary font-semibold">Kaydet</button>
              </div>
            ) : (
              <button onClick={() => setEditingName(true)} className="text-lg font-bold hover:text-primary transition-colors">
                {username || "Isim belirle"}
              </button>
            )}
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                Seviye {level}
              </span>
              <span className="text-xs text-muted-foreground">{levelTitle}</span>
            </div>
          </div>

          {/* Level progress */}
          <div className="mb-5">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1 px-0.5">
              <span className="font-medium">{progress.totalXp} XP</span>
              <span>{nextLevelXp} XP</span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-300 via-orange-400 to-amber-400 transition-all duration-700"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 mb-5">
            {[
              { icon: Target, value: totalQuizzes, label: "Quiz", color: "text-blue-500" },
              { icon: Flame, value: progress.streak, label: "Seri", color: "text-orange-500" },
              { icon: Star, value: avgXpPerActivity, label: "Ort XP", color: "text-amber-500" },
              { icon: Trophy, value: unlockedBadges.length, label: "Rozet", color: "text-primary" },
            ].map((stat) => (
              <div key={stat.label} className="bg-muted/40 rounded-xl p-2 text-center">
                <stat.icon className={cn("w-4 h-4 mx-auto mb-0.5", stat.color)} />
                <p className="text-base font-bold leading-tight">{stat.value}</p>
                <p className="text-[9px] text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Badges */}
          <div className="border-t border-border/50 pt-4">
            <h4 className="text-sm font-bold mb-3">Rozetlerim</h4>
            {unlockedBadges.length === 0 ? (
              <div className="text-center py-4 bg-muted/30 rounded-xl">
                <Trophy className="w-7 h-7 mx-auto mb-1.5 text-muted-foreground/30" />
                <p className="text-xs text-muted-foreground">Henuz rozet yok</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {unlockedBadges.map(badge => (
                  <BadgeChip key={badge.id} badge={badge} />
                ))}
              </div>
            )}
          </div>

          {progress.bestStreak > 0 && (
            <div className="mt-4 pt-3 border-t border-border/50 text-center">
              <p className="text-xs text-muted-foreground">En Iyi Seri: <span className="font-bold text-foreground">{progress.bestStreak} gun</span></p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

const RARITY_COLOR: Record<string, string> = {
  common: "bg-slate-100 text-slate-700 border-slate-200",
  rare: "bg-blue-50 text-blue-700 border-blue-200",
  epic: "bg-purple-50 text-purple-700 border-purple-200",
  legendary: "bg-amber-50 text-amber-700 border-amber-200",
}

function BadgeChip({ badge }: { badge: typeof ALL_ACHIEVEMENTS[0] }) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const shareText = `${badge.title} rozetini kazandim! - Text Language School`
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <button
      onClick={handleShare}
      className={cn(
        "flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg border text-xs font-semibold transition-all active:scale-95",
        RARITY_COLOR[badge.rarity] || RARITY_COLOR.common
      )}
    >
      <span className="truncate">{badge.title}</span>
      {copied ? <Check className="w-3 h-3 shrink-0" /> : <Copy className="w-3 h-3 opacity-30 shrink-0" />}
    </button>
  )
}
