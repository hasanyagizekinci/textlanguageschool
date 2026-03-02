"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Trophy, Star, Target, Flame, Crown, Zap, BookOpen, GraduationCap,
  Award, Sparkles, Link2, FileText, Timer, LayoutGrid, Lock, Medal, Gem, Diamond,
  Snowflake, Shield, Compass, Headphones, Mic, Mountain, Wand2, Flower2,
  Share2, ChevronRight, CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import {
  loadProgress,
  STUDENT_BADGES,
  GENERIC_BADGES,
  ALL_ACHIEVEMENTS,
  BADGE_COLLECTIONS,
  LEVEL_INFO,
  isCollectionComplete,
  getBadgeHint,
  type AchievementInfo,
  type UserProgress,
  type BadgeLevel,
} from "@/lib/xp-system"
import { BadgeShareModal } from "@/components/badge-share"

const BADGE_IMAGES: Record<BadgeLevel | "milestone" | "gold", string> = {
  starter: "/badges/starter.jpg",
  explorer: "/badges/explorer.jpg",
  challenger: "/badges/challenger.jpg",
  master: "/badges/master.jpg",
  legend: "/badges/legend.jpg",
  milestone: "/badges/milestone.jpg",
  gold: "/badges/gold.jpg",
}

const ICON_MAP: Record<string, React.ElementType> = {
  Star, Target, Flame, Crown, Zap, BookOpen, GraduationCap,
  Award, Sparkles, Link2, FileText, Timer, LayoutGrid, Trophy, Medal, Gem, Diamond,
  Snowflake, Shield, Compass, Headphones, Mic, Mountain, Wand2, Flower2,
  Swords: Zap, Building: LayoutGrid, Sprout: Flower2,
}

const RARITY_STYLES: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  common: { bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-600", glow: "" },
  rare: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-600", glow: "shadow-blue-100/50" },
  epic: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-600", glow: "shadow-purple-100/50" },
  legendary: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-600", glow: "shadow-amber-100/50" },
}

const LEVEL_ORDER: BadgeLevel[] = ["starter", "explorer", "challenger", "master", "legend"]

export function AchievementBadges() {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [selectedBadge, setSelectedBadge] = useState<AchievementInfo | null>(null)
  const [shareBadge, setShareBadge] = useState<AchievementInfo | null>(null)
  const [hint, setHint] = useState<string | null>(null)
  const [view, setView] = useState<"levels" | "collections" | "milestones">("levels")

  useEffect(() => {
    const p = loadProgress()
    setProgress(p)
    setHint(getBadgeHint(p))
  }, [])

  if (!progress) return null

  const unlockedSet = new Set(progress.achievements)
  const studentUnlocked = STUDENT_BADGES.filter(b => unlockedSet.has(b.id)).length
  const totalStudent = STUDENT_BADGES.length
  const genericUnlocked = GENERIC_BADGES.filter(b => unlockedSet.has(b.id)).length
  const totalGeneric = GENERIC_BADGES.length
  const totalUnlocked = studentUnlocked + genericUnlocked
  const totalCount = totalStudent + totalGeneric
  const progressPercent = Math.round((totalUnlocked / totalCount) * 100)

  return (
    <div className="py-6">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="font-serif text-lg font-semibold">Rozet Koleksiyonu</h3>
          </div>
          <span className="text-sm font-semibold tabular-nums text-muted-foreground">{totalUnlocked}/{totalCount}</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        {hint && (
          <div className="mt-3 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700 font-medium">
            {hint}
          </div>
        )}
      </div>

      {/* View Switcher */}
      <div className="flex gap-1 mb-5 bg-muted/40 rounded-lg p-1">
        {([
          { key: "levels" as const, label: "Seviyeler" },
          { key: "collections" as const, label: "Koleksiyonlar" },
          { key: "milestones" as const, label: "Kilometre Taşları" },
        ]).map(tab => (
          <button
            key={tab.key}
            onClick={() => setView(tab.key)}
            className={cn(
              "flex-1 py-2 text-xs font-medium rounded-md transition-all",
              view === tab.key
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {view === "levels" && (
        <div className="space-y-6">
          {LEVEL_ORDER.map((levelKey) => {
            const levelBadges = STUDENT_BADGES.filter(b => b.level === levelKey)
            const info = LEVEL_INFO[levelKey]
            const levelUnlocked = levelBadges.filter(b => unlockedSet.has(b.id)).length
            const allUnlocked = levelUnlocked === levelBadges.length

            return (
              <div key={levelKey}>
                {/* Level header */}
                <div className={cn("flex items-center justify-between mb-3 px-3 py-2 rounded-xl border", info.bgColor, info.borderColor)}>
                  <div className="flex items-center gap-2.5">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-white")}
                      style={{ backgroundColor: info.color.replace("text-", "").includes("slate") ? "#64748b" : info.color.replace("text-", "").includes("blue") ? "#3b82f6" : info.color.replace("text-", "").includes("purple") ? "#8b5cf6" : info.color.replace("text-", "").includes("amber") ? "#d97706" : "#e11d48" }}
                    >
                      {LEVEL_ORDER.indexOf(levelKey) + 1}
                    </div>
                    <div>
                      <p className={cn("text-sm font-bold", info.color)}>{info.label}</p>
                      <p className="text-[10px] text-muted-foreground">{info.xpRange}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {allUnlocked && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    <span className={cn("text-xs font-semibold tabular-nums", info.color)}>{levelUnlocked}/{levelBadges.length}</span>
                  </div>
                </div>

                {/* Badge grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  {levelBadges.map(badge => {
                    const isUnlocked = unlockedSet.has(badge.id)
                    const style = RARITY_STYLES[badge.rarity]
                    const IconComp = ICON_MAP[badge.icon] || Star

                    return (
                      <button
                        key={badge.id}
                        onClick={() => setSelectedBadge(badge)}
                        className={cn(
                          "relative flex flex-col p-3 rounded-xl border transition-all duration-200 text-left group",
                          isUnlocked
                            ? `${style.bg} ${style.border} hover:shadow-md ${style.glow}`
                            : "bg-muted/20 border-dashed border-muted-foreground/15 opacity-45 hover:opacity-65"
                        )}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className={cn(
                            "relative w-11 h-11 rounded-xl overflow-hidden transition-transform group-hover:scale-105 ring-1",
                            isUnlocked ? "ring-black/10" : "ring-transparent grayscale opacity-40"
                          )}>
                            {isUnlocked ? (
                              <Image src={BADGE_IMAGES[badge.level]} alt={badge.title} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full bg-muted/40 flex items-center justify-center">
                                <Lock className="w-4 h-4 text-muted-foreground/30" />
                              </div>
                            )}
                          </div>
                          {isUnlocked && (
                            <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full", style.bg, style.text)}>
                              {badge.xpRequired} XP
                            </span>
                          )}
                        </div>
                        <p className={cn(
                          "text-xs font-bold leading-tight mb-0.5",
                          isUnlocked ? "text-foreground" : "text-muted-foreground/50"
                        )}>
                          {badge.studentName}
                        </p>
                        <p className={cn(
                          "text-[10px] font-medium leading-tight",
                          isUnlocked ? style.text : "text-muted-foreground/40"
                        )}>
                          {badge.title}
                        </p>
                        <p className="text-[9px] text-muted-foreground/60 mt-0.5 italic truncate">
                          {badge.subtitle}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {view === "collections" && (
        <div className="space-y-4">
          {BADGE_COLLECTIONS.map(collection => {
            const collectionBadges = collection.badgeIds.map(id => ALL_ACHIEVEMENTS.find(b => b.id === id)).filter(Boolean) as AchievementInfo[]
            const collectionUnlocked = collectionBadges.filter(b => unlockedSet.has(b.id)).length
            const isComplete = isCollectionComplete(collection.id, progress.achievements)

            return (
              <div key={collection.id} className={cn(
                "rounded-xl border p-4 transition-all",
                isComplete
                  ? "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300 shadow-sm shadow-amber-100/50"
                  : "bg-muted/20 border-border/40"
              )}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {isComplete && <Crown className="w-4 h-4 text-amber-500" />}
                      <h4 className={cn("text-sm font-bold", isComplete ? "text-amber-700" : "text-foreground")}>{collection.name}</h4>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{collection.description}</p>
                  </div>
                  <span className={cn(
                    "text-xs font-bold tabular-nums px-2 py-0.5 rounded-full",
                    isComplete ? "bg-amber-200 text-amber-800" : "bg-muted text-muted-foreground"
                  )}>
                    {collectionUnlocked}/{collectionBadges.length}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-muted/60 overflow-hidden mb-3">
                  <div
                    className={cn("h-full rounded-full transition-all duration-500", isComplete ? "bg-amber-400" : "bg-primary/60")}
                    style={{ width: `${(collectionUnlocked / collectionBadges.length) * 100}%` }}
                  />
                </div>

                {/* Collection badges */}
                <div className="flex gap-2 flex-wrap">
                  {collectionBadges.map(badge => {
                    const isUnlocked = unlockedSet.has(badge.id)
                    const IconComp = ICON_MAP[badge.icon] || Star
                    const style = RARITY_STYLES[badge.rarity]

                    return (
                      <button
                        key={badge.id}
                        onClick={() => setSelectedBadge(badge)}
                        className={cn(
                          "flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-left transition-all",
                          isUnlocked
                            ? `${style.bg} ${style.border}`
                            : "bg-muted/30 border-dashed border-muted-foreground/15 opacity-50"
                        )}
                      >
                        <div className={cn(
                          "relative w-6 h-6 rounded-md overflow-hidden shrink-0 ring-1",
                          isUnlocked ? "ring-black/10" : "ring-transparent grayscale"
                        )}>
                          {isUnlocked ? (
                            <Image src={BADGE_IMAGES[badge.level]} alt={badge.title} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full bg-muted/40 flex items-center justify-center">
                              <Lock className="w-2.5 h-2.5 text-muted-foreground/30" />
                            </div>
                          )}
                        </div>
                        <span className={cn("text-[11px] font-medium", isUnlocked ? "text-foreground" : "text-muted-foreground/50")}>
                          {badge.studentName}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {isComplete && (
                  <div className="mt-3 pt-3 border-t border-amber-200 flex items-center gap-2.5">
                    <div className="relative w-7 h-7 rounded-lg overflow-hidden ring-1 ring-amber-300 shrink-0">
                      <Image src={BADGE_IMAGES.gold} alt="Gold Badge" fill className="object-cover" />
                    </div>
                    <span className="text-xs font-bold text-amber-700">{collection.goldBadgeTitle}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {view === "milestones" && (
        <div className="space-y-5">
          {/* Activity milestones */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">Aktivite</p>
            <div className="grid grid-cols-2 gap-2.5">
              {GENERIC_BADGES.filter(b => b.group === "aktivite").map(badge => {
                const isUnlocked = unlockedSet.has(badge.id)
                const style = RARITY_STYLES[badge.rarity]
                const IconComp = ICON_MAP[badge.icon] || Star

                return (
                  <button
                    key={badge.id}
                    onClick={() => setSelectedBadge(badge)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                      isUnlocked
                        ? `${style.bg} ${style.border} hover:shadow-md`
                        : "bg-muted/20 border-dashed border-muted-foreground/15 opacity-45"
                    )}
                  >
                    <div className={cn(
                      "relative w-9 h-9 rounded-lg overflow-hidden shrink-0 ring-1",
                      isUnlocked ? "ring-black/10" : "ring-transparent grayscale opacity-40"
                    )}>
                      {isUnlocked ? (
                        <Image src={BADGE_IMAGES.milestone} alt={badge.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-muted/40 flex items-center justify-center">
                          <Lock className="w-3.5 h-3.5 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className={cn("text-[11px] font-bold", isUnlocked ? "text-foreground" : "text-muted-foreground/50")}>{badge.title}</p>
                      <p className="text-[9px] text-muted-foreground/60 truncate">{badge.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Streak milestones */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">Seri</p>
            <div className="grid grid-cols-2 gap-2.5">
              {GENERIC_BADGES.filter(b => b.group === "seri").map(badge => {
                const isUnlocked = unlockedSet.has(badge.id)
                const style = RARITY_STYLES[badge.rarity]

                return (
                  <button
                    key={badge.id}
                    onClick={() => setSelectedBadge(badge)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                      isUnlocked
                        ? `${style.bg} ${style.border} hover:shadow-md`
                        : "bg-muted/20 border-dashed border-muted-foreground/15 opacity-45"
                    )}
                  >
                    <div className={cn(
                      "relative w-9 h-9 rounded-lg overflow-hidden shrink-0 ring-1",
                      isUnlocked ? "ring-black/10" : "ring-transparent grayscale opacity-40"
                    )}>
                      {isUnlocked ? (
                        <Image src={BADGE_IMAGES.milestone} alt={badge.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-muted/40 flex items-center justify-center">
                          <Lock className="w-3.5 h-3.5 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className={cn("text-[11px] font-bold", isUnlocked ? "text-foreground" : "text-muted-foreground/50")}>{badge.title}</p>
                      <p className="text-[9px] text-muted-foreground/60 truncate">{badge.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedBadge && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 backdrop-blur-sm p-4 pt-12 sm:pt-20 sm:items-center"
          onClick={() => setSelectedBadge(null)}
          role="dialog"
          aria-label="Rozet detayı"
        >
          <Card
            className="max-w-xs w-full border-2 animate-in zoom-in-95 fade-in duration-200 rounded-2xl shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <CardContent className="p-6 text-center">
              {(() => {
                const isUnlocked = unlockedSet.has(selectedBadge.id)
                const style = RARITY_STYLES[selectedBadge.rarity]
                const levelInfo = LEVEL_INFO[selectedBadge.level]
                const imgSrc = selectedBadge.studentName
                  ? BADGE_IMAGES[selectedBadge.level]
                  : BADGE_IMAGES.milestone
                return (
                  <>
                    <div className={cn(
                      "relative inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-3 overflow-hidden ring-2",
                      isUnlocked ? "ring-black/10" : "ring-muted grayscale"
                    )}>
                      {isUnlocked ? (
                        <Image src={imgSrc} alt={selectedBadge.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-muted/50 flex items-center justify-center">
                          <Lock className="w-7 h-7 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>

                    {selectedBadge.studentName && (
                      <p className="text-xs text-muted-foreground font-medium mb-0.5">{selectedBadge.studentName}</p>
                    )}
                    <h4 className="font-serif text-xl font-bold mb-1">{selectedBadge.title}</h4>
                    <p className="text-sm text-muted-foreground italic mb-2">{`"${selectedBadge.subtitle}"`}</p>

                    <div className="flex items-center justify-center gap-2 mb-3">
                      <span className={cn(
                        "text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider",
                        levelInfo.bgColor, levelInfo.color
                      )}>
                        {levelInfo.label}
                      </span>
                      {selectedBadge.xpRequired > 0 && (
                        <span className={cn(
                          "text-[10px] font-bold px-2.5 py-0.5 rounded-full",
                          style.bg, style.text
                        )}>
                          {selectedBadge.xpRequired} XP
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground mb-1">{selectedBadge.category}</p>
                    <p className="text-sm text-muted-foreground mb-4">{selectedBadge.description}</p>

                    <div className={cn(
                      "text-sm font-semibold mb-4",
                      isUnlocked ? "text-emerald-600" : "text-muted-foreground"
                    )}>
                      {isUnlocked ? "Kazanıldı!" : "Henüz kazanılmadı"}
                    </div>
                  </>
                )
              })()}
              <div className="flex gap-2">
                {unlockedSet.has(selectedBadge.id) && (
                  <Button
                    className="flex-1"
                    onClick={() => { setShareBadge(selectedBadge); setSelectedBadge(null) }}
                  >
                    <Share2 className="w-4 h-4 mr-1.5" />
                    Paylaş
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setSelectedBadge(null)}
                >
                  Kapat
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Badge Share Modal */}
      {shareBadge && (
        <BadgeShareModal badge={shareBadge} onClose={() => setShareBadge(null)} />
      )}
    </div>
  )
}
