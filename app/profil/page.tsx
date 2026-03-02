"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  X, Trophy, Flame, Target, Star, Copy, Check, BookOpen, Zap, Award,
  ChevronRight, TrendingUp, Calendar, BarChart3, GraduationCap, Link2,
  FileText, Timer, Snowflake, Sparkles, LayoutGrid, ArrowUpRight,
  Share2, Crown, Shield, Compass, Headphones, Mic, Mountain, Wand2,
  Flower2, Gem, Diamond, Medal, Lock, CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import {
  loadProgress, getLevelFromXp, getLevelTitle, getXpForNextLevel,
  STUDENT_BADGES, GENERIC_BADGES, ALL_ACHIEVEMENTS, BADGE_COLLECTIONS,
  LEVEL_INFO, isCollectionComplete,
  type UserProgress, type BadgeLevel
} from "@/lib/xp-system"
import { BadgeShareModal } from "@/components/badge-share"
import { StudentPortal } from "@/components/student-portal"
import type { AchievementInfo } from "@/lib/xp-system"

const RARITY_COLOR: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  common: { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", glow: "" },
  rare: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", glow: "" },
  epic: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", glow: "shadow-sm shadow-purple-100" },
  legendary: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", glow: "shadow-sm shadow-amber-100" },
}

const BADGE_IMAGES: Record<string, string> = {
  starter: "/badges/starter.jpg",
  explorer: "/badges/explorer.jpg",
  challenger: "/badges/challenger.jpg",
  master: "/badges/master.jpg",
  legend: "/badges/legend.jpg",
  milestone: "/badges/milestone.jpg",
  gold: "/badges/gold.jpg",
}
  
const RARITY_LABELS: Record<string, string> = {
  common: "Ortak",
  rare: "Nadir",
  epic: "Epik",
  legendary: "Efsanevi",
}

const LEVEL_ORDER: BadgeLevel[] = ["starter", "explorer", "challenger", "master", "legend"]

const ACTIVITY_LABELS: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  exam: { label: "Seviye Testi", color: "bg-blue-500", icon: GraduationCap },
  flashcard: { label: "Kelime Kartları", color: "bg-amber-500", icon: Zap },
  word_match: { label: "Eşleştirme", color: "bg-violet-500", icon: Link2 },
  "word-match": { label: "Eşleştirme", color: "bg-violet-500", icon: Link2 },
  reading: { label: "Zamanlı Okuma", color: "bg-indigo-500", icon: FileText },
  "timed-reading": { label: "Zamanlı Okuma", color: "bg-indigo-500", icon: FileText },
  sentence_transform: { label: "Cümle Dönüşümü", color: "bg-emerald-500", icon: BookOpen },
  "sentence-transform": { label: "Cümle Dönüşümü", color: "bg-emerald-500", icon: BookOpen },
  blitz: { label: "Blitz Challenge", color: "bg-cyan-500", icon: Timer },
  "blitz-challenge": { label: "Blitz Challenge", color: "bg-cyan-500", icon: Timer },
  snowflake_challenge: { label: "Kar Tanesi", color: "bg-sky-500", icon: Snowflake },
  snowflake: { label: "Kar Tanesi", color: "bg-sky-500", icon: Snowflake },
  grammar_quiz: { label: "Gramer Quiz", color: "bg-rose-500", icon: Star },
  collocation: { label: "Eşdizimliler", color: "bg-teal-500", icon: Target },
  collocations: { label: "Eşdizimliler", color: "bg-teal-500", icon: Target },
  word_formation: { label: "Kelime Türetme", color: "bg-lime-500", icon: Sparkles },
  "word-formation": { label: "Kelime Türetme", color: "bg-lime-500", icon: Sparkles },
  context_clue: { label: "Bağlam İpuçları", color: "bg-orange-500", icon: Award },
  "context-clues": { label: "Bağlam İpuçları", color: "bg-orange-500", icon: Award },
  error_spot: { label: "Hata Bulma", color: "bg-red-500", icon: Target },
  "error-spotting": { label: "Hata Bulma", color: "bg-red-500", icon: Target },
  error_spotting: { label: "Hata Bulma", color: "bg-red-500", icon: Target },
  minimal_pair: { label: "Minimal Çiftler", color: "bg-pink-500", icon: Flame },
  "minimal-pairs": { label: "Minimal Çiftler", color: "bg-pink-500", icon: Flame },
  cloze: { label: "Boşluk Doldurma", color: "bg-purple-500", icon: LayoutGrid },
  "cloze-test": { label: "Boşluk Doldurma", color: "bg-purple-500", icon: LayoutGrid },
  daily_challenge: { label: "Günlük Meydan Okuma", color: "bg-muted-foreground", icon: Star },
  interactive: { label: "Etkileşimli", color: "bg-indigo-400", icon: Sparkles },
  hangman: { label: "Adam Asmaca", color: "bg-amber-600", icon: Star },
  "sentence-builder": { label: "Cümle Kurma", color: "bg-green-500", icon: BookOpen },
  "speaking-quiz": { label: "Konuşma Quizi", color: "bg-primary", icon: Mic },
}

function getDiagnosisCard(progress: UserProgress): { title: string; message: string; tip: string; color: string } {
  const { totalXp, totalActivities, bestStreak, activityCounts } = progress
  const uniqueActivities = Object.keys(activityCounts || {}).length

  if (totalActivities === 0) {
    return {
      title: "Baslangic Noktasi",
      message: "Henuz hic aktivite tamamlanmamis. Ana sayfadan bir aktiviteyle baslayabilirsin!",
      tip: "Seviyeni Olc ile baslaman onerilir - boylece dogru zorluk seviyesinden baslarsin.",
      color: "text-muted-foreground"
    }
  }
  if (totalActivities < 5) {
    return {
      title: "Ilk Adimlar",
      message: `${totalActivities} aktivite tamamladin. Guzel bir baslangic, devam et!`,
      tip: "Her gun en az 1 aktivite yapmayi hedefle. Duzenlilik, yogunluktan onemlidir.",
      color: "text-blue-600"
    }
  }
  if (uniqueActivities < 3) {
    return {
      title: "Odakli Ogrenci",
      message: `Sadece ${uniqueActivities} tur aktivite denedin. Farkli turler farkli becerileri gelistirir!`,
      tip: "Kelime kartlari, eslestirme ve okuma gibi farkli turleri deneyin.",
      color: "text-amber-600"
    }
  }
  if (bestStreak < 3) {
    return {
      title: "Duzenlilik Zamani",
      message: `En iyi serin ${bestStreak} gun. Duzenli pratik hafizayi guclendiren en onemli faktor!`,
      tip: "Her gun sadece 5 dakika bile ayirsan, serini uzatabilirsin.",
      color: "text-orange-600"
    }
  }
  if (totalXp < 1000) {
    return {
      title: "Aktif Ogrenci",
      message: `${totalXp} XP kazandin ve ${uniqueActivities} farkli aktivite turunu denedin. Iyi gidiyorsun!`,
      tip: "Zor seviyelere gecmeyi dene, daha fazla XP kazanir ve daha hizli ilerlersin.",
      color: "text-emerald-600"
    }
  }
  if (totalXp < 3000) {
    return {
      title: "Deneyimli Ogrenci",
      message: `${totalXp} XP, ${totalActivities} aktivite. Ciddi bir ilerleme kaydediyorsun!`,
      tip: "Her hafta tum aktivite turlerini en az 1 kez yapmak, eksik alanlari kapamana yardimci olur.",
      color: "text-purple-600"
    }
  }
  return {
    title: "Usta Seviyesi",
    message: `${totalXp} XP, ${totalActivities} aktivite, ${bestStreak} gun en iyi seri. Muhtesem!`,
    tip: "Artik ogrendiklerini baskalarina ogretmeyi dusunebilirsin. Ogretmek, ogrenmenin en iyi yoludur!",
    color: "text-secondary"
  }
}

const LEVEL_DESCRIPTIONS: Record<number, string> = {
  1: "Ingilizce ogrenme yolculugunuzun basinda. Her gun biraz pratik yaparak hizla ilerleyebilirsiniz.",
  2: "Kesfetmeye basladiniz. Temel kaliplari taniyorsunuz, duzenli pratik buyuk fark yaratacak.",
  3: "Ogrenci seviyesindesiniz. Gramer yapilari oturmaya basliyor, kelime hazineniz buyuyor.",
  4: "Pratik yapma aliskanliginiz oturuyor. Daha karisik yapilarla calismaya hazirsiniz.",
  5: "Orta seviyeye ulastiniz! Bircok konuda rahat iletisim kurabilirsiniz.",
  6: "Ilerleme kayda deger. Karmasik metinleri anlayabiliyor, nuansli ifadeler kullanabiliyorsunuz.",
  7: "Uzman adayi seviyesindesiniz. Akademik ve profesyonel Ingilizce'ye hakim olmaya yakinsiniz.",
  8: "Uzman seviyesindesiniz! Karmasik yapilar ve ileri duzey kelimeler artik konfor alaninizda.",
  9: "Usta seviyesindesiniz. Ingilizce'yi neredeyse anadil duzeyinde kullanabiliyorsunuz.",
  10: "Efsane seviyesi! Tum aktivitelerde ustunluk gosterdiniz, ilham verici bir basari.",
}

function WeeklyChart({ history }: { history: Record<string, number> }) {
  const days = useMemo(() => {
    const result: { label: string; xp: number; date: string }[] = []
    const dayNames = ["Pz", "Pt", "Sa", "Ca", "Pe", "Cu", "Ct"]
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split("T")[0]
      result.push({
        label: dayNames[d.getDay()],
        xp: history[dateStr] || 0,
        date: dateStr,
      })
    }
    return result
  }, [history])

  const maxXp = Math.max(...days.map(d => d.xp), 1)

  return (
    <div className="flex items-end gap-1.5 h-24 w-full">
      {days.map((day) => {
        const height = day.xp > 0 ? Math.max(8, (day.xp / maxXp) * 100) : 4
        const isToday = day.date === new Date().toISOString().split("T")[0]
        return (
          <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
            {day.xp > 0 && (
              <span className="text-[9px] font-medium text-muted-foreground">{day.xp}</span>
            )}
            <div
              className={cn(
                "w-full rounded-t-md transition-all duration-500",
                day.xp > 0 ? "bg-primary/70" : "bg-muted",
                isToday && day.xp > 0 && "bg-primary"
              )}
              style={{ height: `${height}%`, minHeight: day.xp > 0 ? '8px' : '3px' }}
            />
            <span className={cn(
              "text-[9px]",
              isToday ? "font-bold text-foreground" : "text-muted-foreground"
            )}>{day.label}</span>
          </div>
        )
      })}
    </div>
  )
}

// Featured badge row on overview tab
function FeaturedBadges({ progress, onShare }: { progress: UserProgress; onShare: (badge: AchievementInfo) => void }) {
  const unlockedStudentBadges = STUDENT_BADGES.filter(b => progress.achievements.includes(b.id))
    .sort((a, b) => b.xpRequired - a.xpRequired)
    .slice(0, 3)

  if (unlockedStudentBadges.length === 0) {
    // Show next badge to unlock
    const nextBadge = STUDENT_BADGES.find(b => !progress.achievements.includes(b.id))
    if (!nextBadge) return null
    const levelInfo = LEVEL_INFO[nextBadge.level]

    return (
      <div className="bg-muted/20 rounded-xl p-4 border border-border/30">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500" />
            Siradaki Rozet
          </h3>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-muted-foreground/20 bg-muted/10">
          <div className="w-10 h-10 rounded-xl bg-muted/40 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4 text-muted-foreground/40" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-muted-foreground/70">{nextBadge.studentName} - {nextBadge.title}</p>
            <p className="text-[10px] text-muted-foreground/50">{nextBadge.xpRequired} XP gerekli</p>
            <div className="mt-1.5 h-1 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary/50 rounded-full" style={{ width: `${Math.min(100, (progress.totalXp / nextBadge.xpRequired) * 100)}%` }} />
            </div>
          </div>
          <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full", levelInfo.bgColor, levelInfo.color)}>
            {levelInfo.label}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-muted/20 rounded-xl p-4 border border-border/30">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-amber-500" />
          Son Rozetler
        </h3>
        <span className="text-[10px] text-muted-foreground font-medium">
          {STUDENT_BADGES.filter(b => progress.achievements.includes(b.id)).length}/{STUDENT_BADGES.length}
        </span>
      </div>
      <div className="space-y-2">
        {unlockedStudentBadges.map(badge => {
          const rarity = RARITY_COLOR[badge.rarity]
          const levelInfo = LEVEL_INFO[badge.level]

          return (
            <div key={badge.id} className={cn("flex items-center gap-3 p-2.5 rounded-xl border", rarity.bg, rarity.border)}>
              <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 ring-1 ring-black/10">
                <Image src={BADGE_IMAGES[badge.level] || BADGE_IMAGES.milestone} alt={badge.title} fill className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className={cn("text-xs font-bold truncate", rarity.text)}>{badge.studentName}</p>
                  <span className={cn("text-[8px] font-bold px-1.5 py-0.5 rounded-full shrink-0", levelInfo.bgColor, levelInfo.color)}>
                    {levelInfo.label}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground truncate">{badge.title} - {badge.subtitle}</p>
              </div>
              <button
                onClick={() => onShare(badge)}
                className="p-1.5 rounded-lg hover:bg-background/60 transition-colors shrink-0"
                aria-label={`${badge.title} rozetini paylas`}
              >
                <Share2 className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function ProfilPage() {
  const router = useRouter()
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [username, setUsername] = useState("")
  const [editingName, setEditingName] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "gelisim" | "badges">("overview")
  const [shareBadge, setShareBadge] = useState<AchievementInfo | null>(null)

  useEffect(() => {
    setProgress(loadProgress())
    const stored = localStorage.getItem("tls_username")
    if (stored) setUsername(stored)
  }, [])

  const saveName = () => {
    localStorage.setItem("tls_username", username)
    setEditingName(false)
  }

  if (!progress) return null

  const safeActivityCounts = progress.activityCounts && typeof progress.activityCounts === "object" ? progress.activityCounts : {}
  const safeActivityHistory = progress.activityHistory && typeof progress.activityHistory === "object" ? progress.activityHistory : {}
  const safeAchievements = Array.isArray(progress.achievements) ? progress.achievements : []

  const level = getLevelFromXp(progress.totalXp || 0)
  const levelTitle = getLevelTitle(level)
  const nextLevelXp = getXpForNextLevel(level)
  const prevLevelXp = level > 1 ? getXpForNextLevel(level - 1) : 0
  const levelProgress = nextLevelXp > prevLevelXp
    ? Math.round(((progress.totalXp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100)
    : 100

  const unlockedSet = new Set(safeAchievements)
  const totalQuizzes = progress.totalActivities
  const avgXpPerActivity = totalQuizzes > 0 ? Math.round(progress.totalXp / totalQuizzes) : 0
  const unlockedCount = ALL_ACHIEVEMENTS.filter(a => unlockedSet.has(a.id)).length
  const totalBadges = ALL_ACHIEVEMENTS.length

  const topActivities = Object.entries(safeActivityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const weekXp = (() => {
    let total = 0
    for (let i = 0; i < 7; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split("T")[0]
      total += safeActivityHistory[dateStr] || 0
    }
    return total
  })()

  const daysActiveThisMonth = (() => {
    const now = new Date()
    const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    return Object.keys(safeActivityHistory).filter(d => d.startsWith(monthStr)).length
  })()

  return (
    <main className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-2xl font-bold">Profilim</h1>
          <button
            onClick={() => router.push("/")}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Ana sayfaya dön"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Avatar & Name Card */}
        <div className="bg-muted/30 rounded-2xl p-6 mb-6 border border-border/50">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-primary/10 border-2 border-primary/20 flex items-center justify-center shrink-0">
              <svg width="28" height="28" viewBox="0 0 40 40">
                <line x1="20" y1="4" x2="20" y2="36" stroke="currentColor" strokeWidth="2" className="text-primary/40" />
                <line x1="4" y1="20" x2="36" y2="20" stroke="currentColor" strokeWidth="2" className="text-primary/40" />
                <line x1="8" y1="8" x2="32" y2="32" stroke="currentColor" strokeWidth="1.5" className="text-primary/25" />
                <line x1="32" y1="8" x2="8" y2="32" stroke="currentColor" strokeWidth="1.5" className="text-primary/25" />
                <circle cx="20" cy="20" r="4" fill="currentColor" className="text-primary/40" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Isminiz"
                    className="text-sm border border-border rounded-lg px-3 py-1.5 w-full bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/20"
                    maxLength={20}
                    autoFocus
                    onKeyDown={e => e.key === "Enter" && saveName()}
                  />
                  <button onClick={saveName} className="text-sm text-primary font-semibold whitespace-nowrap">Kaydet</button>
                </div>
              ) : (
                <button onClick={() => setEditingName(true)} className="text-lg font-bold hover:text-primary transition-colors text-left">
                  {username || "Isim belirle"}
                </button>
              )}
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Seviye {level}</span>
                <span className="text-xs text-muted-foreground">{levelTitle}</span>
              </div>
            </div>
          </div>

          {/* Level progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
              <span className="font-medium">{progress.totalXp} XP</span>
              <span>Sonraki seviye: {nextLevelXp} XP</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary transition-all duration-700"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
              {LEVEL_DESCRIPTIONS[level] || "Harika bir seviyedesiniz!"}
            </p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[
            { icon: Target, value: totalQuizzes, label: "Aktivite", color: "text-blue-500" },
            { icon: Flame, value: progress.streak, label: "Gun Seri", color: "text-orange-500" },
            { icon: TrendingUp, value: avgXpPerActivity, label: "Ort. XP", color: "text-emerald-500" },
            { icon: Award, value: `${unlockedCount}/${totalBadges}`, label: "Rozet", color: "text-primary" },
          ].map((stat) => (
            <div key={stat.label} className="bg-muted/40 rounded-xl p-3 text-center border border-border/30">
              <stat.icon className={cn("w-4 h-4 mx-auto mb-1", stat.color)} strokeWidth={1.5} />
              <p className="text-base font-bold leading-tight">{stat.value}</p>
              <p className="text-[9px] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tab navigation */}
        <div className="flex gap-1 mb-6 bg-muted/40 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={cn(
              "flex-1 py-2 text-sm font-medium rounded-md transition-all",
              activeTab === "overview" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <BarChart3 className="w-3.5 h-3.5 inline mr-1.5" />
            Genel
          </button>
          <button
            onClick={() => setActiveTab("gelisim")}
            className={cn(
              "flex-1 py-2 text-sm font-medium rounded-md transition-all",
              activeTab === "gelisim" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <TrendingUp className="w-3.5 h-3.5 inline mr-1.5" />
            {"Gelisim"}
          </button>
          <button
            onClick={() => setActiveTab("badges")}
            className={cn(
              "flex-1 py-2 text-sm font-medium rounded-md transition-all",
              activeTab === "badges" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Trophy className="w-3.5 h-3.5 inline mr-1.5" />
            Rozetler
          </button>
        </div>

        {activeTab === "overview" ? (
          <div className="space-y-6">
            {/* Featured Badges - direct access from overview */}
            <FeaturedBadges progress={progress} onShare={setShareBadge} />

            {/* Weekly activity chart */}
            <div className="bg-muted/20 rounded-xl p-4 border border-border/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  {"Haftalik Aktivite"}
                </h3>
                <span className="text-xs font-medium text-primary">{weekXp} XP</span>
              </div>
              <WeeklyChart history={safeActivityHistory} />
            </div>

            {/* Extended stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/20 rounded-xl p-4 border border-border/30">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{"En Iyi Seri"}</p>
                <p className="text-2xl font-bold text-orange-500">{progress.bestStreak} <span className="text-sm font-normal text-muted-foreground">{"gun"}</span></p>
              </div>
              <div className="bg-muted/20 rounded-xl p-4 border border-border/30">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Bu Ay Aktif</p>
                <p className="text-2xl font-bold text-emerald-500">{daysActiveThisMonth} <span className="text-sm font-normal text-muted-foreground">{"gun"}</span></p>
              </div>
              <div className="bg-muted/20 rounded-xl p-4 border border-border/30">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Toplam XP</p>
                <p className="text-2xl font-bold text-primary">{progress.totalXp.toLocaleString()}</p>
              </div>
              <div className="bg-muted/20 rounded-xl p-4 border border-border/30">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{"Bugunun XP"}</p>
                <p className="text-2xl font-bold text-amber-500">{safeActivityHistory[new Date().toISOString().split("T")[0]] || 0}</p>
              </div>
            </div>

            {/* Top activities */}
            {topActivities.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  {"En Çok Kullanılan Aktiviteler"}
                </h3>
                <div className="space-y-2">
                  {topActivities.map(([id, count]) => {
                    const info = ACTIVITY_LABELS[id] || { label: id, color: "bg-muted-foreground" }
                    const maxCount = topActivities[0][1]
                    const width = Math.max(10, (count / maxCount) * 100)
                    return (
                      <div key={id} className="flex items-center gap-3">
                        <div className={cn("w-2 h-2 rounded-full shrink-0", info.color)} />
                        <span className="text-xs font-medium w-28 truncate">{info.label}</span>
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className={cn("h-full rounded-full transition-all", info.color)}
                            style={{ width: `${width}%`, opacity: 0.7 }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground tabular-nums w-8 text-right">{count}x</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {totalQuizzes === 0 && (
              <div className="text-center py-8">
                <Zap className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-1">{"Henuz aktivite tamamlanmamis"}</p>
                <p className="text-xs text-muted-foreground/70">{"Ana sayfadaki aktivitelerden baslayarak XP kazanin!"}</p>
              </div>
            )}
          </div>
        ) : activeTab === "gelisim" ? (
          <div className="space-y-5">
            {/* Diagnosis card */}
            {(() => {
              const diagnosis = getDiagnosisCard(progress)
              return (
                <div className="bg-muted/20 rounded-xl p-4 border border-border/30">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <TrendingUp className={cn("w-5 h-5", diagnosis.color)} />
                    </div>
                    <div className="min-w-0">
                      <h3 className={cn("text-sm font-bold mb-1", diagnosis.color)}>{diagnosis.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-2">{diagnosis.message}</p>
                      <div className="bg-background/60 rounded-lg p-2.5 border border-border/20">
                        <p className="text-[11px] text-foreground/80 leading-relaxed">
                          <span className="font-semibold">{"Ipucu: "}</span>{diagnosis.tip}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })()}

            {/* Per-activity breakdown */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-muted-foreground" />
                {"Aktivite Bazli Gelisim"}
              </h3>
              {Object.keys(safeActivityCounts).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(safeActivityCounts)
                    .sort(([, a], [, b]) => b - a)
                    .map(([actId, count]) => {
                      const info = ACTIVITY_LABELS[actId] || { label: actId, color: "bg-muted-foreground", icon: Star }
                      const IconComp = info.icon
                      const maxVal = Math.max(...Object.values(safeActivityCounts), 1)
                      const pct = Math.max(8, (count / maxVal) * 100)
                      return (
                        <div key={actId} className="bg-muted/20 rounded-lg p-3 border border-border/20">
                          <div className="flex items-center gap-2.5 mb-2">
                            <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-white", info.color)}>
                              <IconComp className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold truncate">{info.label}</span>
                                <span className="text-xs text-muted-foreground tabular-nums">{count}x</span>
                              </div>
                            </div>
                          </div>
                          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className={cn("h-full rounded-full transition-all duration-500", info.color)}
                              style={{ width: `${pct}%`, opacity: 0.65 }}
                            />
                          </div>
                        </div>
                      )
                    })}
                </div>
              ) : (
                <div className="text-center py-6 bg-muted/10 rounded-xl border border-border/20">
                  <Target className="w-7 h-7 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">{"Henuz aktivite verisi yok"}</p>
                </div>
              )}
            </div>

            {/* Skill areas */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-muted-foreground" />
                {"Beceri Alanlari"}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    label: "Kelime Bilgisi",
                    count: (safeActivityCounts.flashcard || 0) + (safeActivityCounts.word_match || 0),
                    color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200"
                  },
                  {
                    label: "Gramer",
                    count: (safeActivityCounts.exam || 0) + (safeActivityCounts.grammar_quiz || 0) + (safeActivityCounts.sentence_transform || 0),
                    color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-200"
                  },
                  {
                    label: "Okuma",
                    count: (safeActivityCounts.reading || 0) + (safeActivityCounts.context_clue || 0) + (safeActivityCounts.cloze || 0),
                    color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-200"
                  },
                  {
                    label: "Hiz & Refleks",
                    count: (safeActivityCounts.blitz || 0) + (safeActivityCounts.snowflake_challenge || 0),
                    color: "text-rose-500", bg: "bg-rose-50", border: "border-rose-200"
                  },
                ].map((area) => (
                  <div key={area.label} className={cn("rounded-xl p-3 border", area.bg, area.border)}>
                    <p className={cn("text-lg font-bold tabular-nums", area.color)}>{area.count}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">{area.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
                <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                {"Siradaki Hedefler"}
              </h3>
              <div className="space-y-2">
                {[
                  { target: 10, current: progress.totalActivities, label: "10 aktivite tamamla", done: progress.totalActivities >= 10 },
                  { target: 500, current: progress.totalXp, label: "500 XP'ye ulas", done: progress.totalXp >= 500 },
                  { target: 7, current: progress.bestStreak, label: "7 gunluk seri yap", done: progress.bestStreak >= 7 },
                  { target: 5, current: Object.keys(safeActivityCounts).length, label: "5 farkli aktivite dene", done: Object.keys(safeActivityCounts).length >= 5 },
                ].map((milestone, i) => (
                  <div key={i} className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border",
                    milestone.done ? "bg-emerald-50 border-emerald-200" : "bg-muted/20 border-border/30"
                  )}>
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                      milestone.done ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                    )}>
                      {milestone.done ? <Check className="w-3.5 h-3.5" /> : <span>{i + 1}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-xs font-medium", milestone.done && "line-through text-muted-foreground")}>{milestone.label}</p>
                      {!milestone.done && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-primary/60 rounded-full" style={{ width: `${Math.min(100, (milestone.current / milestone.target) * 100)}%` }} />
                          </div>
                          <span className="text-[10px] text-muted-foreground tabular-nums">{milestone.current}/{milestone.target}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Badges Tab - Level-based display with share buttons */
          <div className="space-y-6">
            {/* Badge progress summary */}
            <div className="bg-muted/20 rounded-xl p-4 border border-border/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">{"Rozet Ilerlemeniz"}</span>
                <span className="text-xs text-muted-foreground">{unlockedCount}/{totalBadges}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden mb-3">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-700"
                  style={{ width: `${(unlockedCount / totalBadges) * 100}%` }}
                />
              </div>
              {/* Level summary */}
              <div className="flex items-center justify-between">
                {LEVEL_ORDER.map(lvl => {
                  const info = LEVEL_INFO[lvl]
                  const lvlBadges = STUDENT_BADGES.filter(b => b.level === lvl)
                  const lvlUnlocked = lvlBadges.filter(b => unlockedSet.has(b.id)).length
                  return (
                    <div key={lvl} className="text-center">
                      <span className={cn("text-[10px] font-semibold", info.color)}>{lvlUnlocked}/{lvlBadges.length}</span>
                      <p className="text-[8px] text-muted-foreground uppercase tracking-wider">{info.label}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Collection progress */}
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-500" />
                Koleksiyonlar
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {BADGE_COLLECTIONS.map(collection => {
                  const collectionBadges = collection.badgeIds
                  const collectionUnlocked = collectionBadges.filter(id => unlockedSet.has(id)).length
                  const isComplete = isCollectionComplete(collection.id, safeAchievements)
                  return (
                    <div key={collection.id} className={cn(
                      "rounded-xl p-3 border",
                      isComplete ? "bg-amber-50 border-amber-300" : "bg-muted/20 border-border/30"
                    )}>
                      <div className="flex items-center gap-1.5 mb-1">
                        {isComplete && <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                        <p className={cn("text-[11px] font-bold truncate", isComplete ? "text-amber-700" : "text-foreground")}>
                          {collection.name}
                        </p>
                      </div>
                      <div className="h-1 rounded-full bg-muted/60 overflow-hidden mb-1">
                        <div
                          className={cn("h-full rounded-full", isComplete ? "bg-amber-400" : "bg-primary/50")}
                          style={{ width: `${(collectionUnlocked / collectionBadges.length) * 100}%` }}
                        />
                      </div>
                      <p className="text-[9px] text-muted-foreground tabular-nums">{collectionUnlocked}/{collectionBadges.length}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Level-grouped badges */}
            {LEVEL_ORDER.map(levelKey => {
              const levelBadges = STUDENT_BADGES.filter(b => b.level === levelKey)
              const info = LEVEL_INFO[levelKey]
              const levelUnlocked = levelBadges.filter(b => unlockedSet.has(b.id)).length

              return (
                <div key={levelKey}>
                  <div className={cn("flex items-center justify-between mb-2 px-2.5 py-1.5 rounded-lg border", info.bgColor, info.borderColor)}>
                    <p className={cn("text-xs font-bold", info.color)}>{info.label}</p>
                    <span className={cn("text-[10px] font-semibold tabular-nums", info.color)}>{levelUnlocked}/{levelBadges.length}</span>
                  </div>
                  <div className="space-y-1.5">
                    {levelBadges.map(badge => {
                      const isUnlocked = unlockedSet.has(badge.id)
                      const rarity = RARITY_COLOR[badge.rarity]

                      if (!isUnlocked) {
                        return (
                          <div key={badge.id} className="flex items-center gap-3 p-2.5 rounded-xl border border-dashed border-muted-foreground/15 opacity-45">
                            <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-muted/40 shrink-0 grayscale">
                              <Image src={BADGE_IMAGES[badge.level] || BADGE_IMAGES.milestone} alt="" fill className="object-cover opacity-30" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium text-muted-foreground/50">{badge.studentName} - {badge.title}</p>
                              <p className="text-[10px] text-muted-foreground/30">{badge.xpRequired} XP gerekli</p>
                            </div>
                          </div>
                        )
                      }

                      return (
                        <div key={badge.id} className={cn("flex items-center gap-3 p-2.5 rounded-xl border transition-all", rarity.bg, rarity.border, rarity.glow)}>
                          <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 ring-1 ring-black/10">
                            <Image src={BADGE_IMAGES[badge.level]} alt={badge.title} fill className="object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <p className={cn("text-xs font-bold truncate", rarity.text)}>{badge.studentName}</p>
                              <span className={cn("text-[8px] font-bold px-1.5 py-0.5 rounded-full shrink-0", rarity.bg, rarity.text)}>
                                {badge.xpRequired} XP
                              </span>
                            </div>
                            <p className="text-[10px] text-muted-foreground truncate">{badge.title} - {badge.subtitle}</p>
                          </div>
                          <button
                            onClick={() => setShareBadge(badge)}
                            className="p-1.5 rounded-lg hover:bg-background/60 transition-colors shrink-0"
                            aria-label={`${badge.title} rozetini paylas`}
                          >
                            <Share2 className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}

            {/* Generic milestones */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">Kilometre Taslari</p>
              <div className="grid grid-cols-2 gap-1.5">
                {GENERIC_BADGES.map(badge => {
                  const isUnlocked = unlockedSet.has(badge.id)
                  const rarity = RARITY_COLOR[badge.rarity]

                  return (
                    <div key={badge.id} className={cn(
                      "flex items-center gap-2 p-2 rounded-lg border",
                      isUnlocked
                        ? `${rarity.bg} ${rarity.border}`
                        : "border-dashed border-muted-foreground/15 opacity-45"
                    )}>
                      <div className={cn(
                        "relative w-7 h-7 rounded-md overflow-hidden shrink-0 ring-1",
                        isUnlocked ? "ring-black/10" : "ring-transparent grayscale"
                      )}>
                        {isUnlocked ? (
                          <Image src={BADGE_IMAGES.milestone} alt={badge.title} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-muted/40 flex items-center justify-center">
                            <Lock className="w-3 h-3 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className={cn("text-[10px] font-bold truncate", isUnlocked ? rarity.text : "text-muted-foreground/50")}>{badge.title}</p>
                        <p className="text-[8px] text-muted-foreground/50 truncate">{badge.subtitle}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Student Portal: rank, homework, files */}
      <StudentPortal />

      {/* Badge Share Modal */}
      {shareBadge && (
        <BadgeShareModal badge={shareBadge} onClose={() => setShareBadge(null)} />
      )}
    </main>
  )
}
