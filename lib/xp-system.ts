"use client"

// XP & Streak system - localStorage based gamification layer
// This tracks user progress across all activities

export interface UserProgress {
  totalXp: number
  level: number
  streak: number
  lastActiveDate: string // ISO date string YYYY-MM-DD
  activitiesToday: number
  activityHistory: Record<string, number> // date -> xp earned
  achievements: string[]
  bestStreak: number
  totalActivities: number
  activityCounts: Record<string, number> // activity id -> times completed
}

const STORAGE_KEY = "tls_user_progress"

const DEFAULT_PROGRESS: UserProgress = {
  totalXp: 0,
  level: 1,
  streak: 0,
  lastActiveDate: "",
  activitiesToday: 0,
  activityHistory: {},
  achievements: [],
  bestStreak: 0,
  totalActivities: 0,
  activityCounts: {},
}

// XP rewards for different activities (tuned for long-term progression)
export const XP_REWARDS = {
  exam_complete: 15,
  exam_perfect: 35,
  word_match_complete: 8,
  word_match_streak: 3,
  flashcard_complete: 6,
  flashcard_all_known: 18,
  sentence_correct: 4,
  grammar_quiz_correct: 5,
  reading_complete: 12,
  reading_fast: 6,
  collocation_correct: 4,
  word_formation_correct: 4,
  context_clue_correct: 5,
  error_spot_correct: 5,
  minimal_pair_correct: 3,
  cloze_complete: 10,
  transform_correct: 5,
  blitz_complete: 18,
  blitz_high_score: 10,
  quizComplete: 12,
  daily_first_activity: 8,
  streak_bonus_3: 15,
  streak_bonus_7: 40,
  streak_bonus_30: 120,
} as const

// Level thresholds (long-term grind curve)
export function getLevelFromXp(xp: number): number {
  if (xp < 50) return 1
  if (xp < 150) return 2
  if (xp < 400) return 3
  if (xp < 800) return 4
  if (xp < 1500) return 5
  if (xp < 3000) return 6
  if (xp < 5500) return 7
  if (xp < 9000) return 8
  if (xp < 15000) return 9
  return 10
}

export function getXpForNextLevel(level: number): number {
  const thresholds = [0, 50, 150, 400, 800, 1500, 3000, 5500, 9000, 15000, 999999]
  return thresholds[level] || 999999
}

export function getLevelTitle(level: number): string {
  const titles = [
    "",
    "Başlangıç",
    "Keşfedici",
    "Öğrenci",
    "Pratikçi",
    "Azimli",
    "İlerlemiş",
    "Uzman Adayı",
    "Uzman",
    "Usta",
    "Efsane",
  ]
  return titles[level] || "Efsane"
}

function getTodayString(): string {
  return new Date().toISOString().split("T")[0]
}

// Migration: scale old XP down to match new lower reward rates
// Old rewards averaged ~40 XP/activity, new rewards average ~8 XP → factor 0.2
const XP_MIGRATION_KEY = "tls_xp_migrated_v2"
const XP_SCALE_FACTOR = 0.2

function migrateXpIfNeeded(progress: UserProgress): UserProgress {
  if (typeof window === "undefined") return progress
  if (localStorage.getItem(XP_MIGRATION_KEY)) return progress
  if (progress.totalXp <= 0) {
    localStorage.setItem(XP_MIGRATION_KEY, "1")
    return progress
  }

  // Scale total XP down
  progress.totalXp = Math.max(1, Math.round(progress.totalXp * XP_SCALE_FACTOR))
  progress.level = getLevelFromXp(progress.totalXp)

  // Scale activity history
  for (const date of Object.keys(progress.activityHistory)) {
    progress.activityHistory[date] = Math.max(1, Math.round(progress.activityHistory[date] * XP_SCALE_FACTOR))
  }

  // Clear student badge achievements so they re-unlock at new thresholds
  progress.achievements = progress.achievements.filter(id =>
    GENERIC_BADGES.some(b => b.id === id)
  )

  localStorage.setItem(XP_MIGRATION_KEY, "1")
  saveProgress(progress)

  // Push scaled XP to Supabase
  syncXpToDb(progress.totalXp, progress.streak)

  return progress
}

export function loadProgress(): UserProgress {
  if (typeof window === "undefined") return { ...DEFAULT_PROGRESS }
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return { ...DEFAULT_PROGRESS }
    const progress = { ...DEFAULT_PROGRESS, ...JSON.parse(stored) }
    return migrateXpIfNeeded(progress)
  } catch {
    return { ...DEFAULT_PROGRESS }
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // Storage full or unavailable
  }
}

export function addXp(amount: number, activityId: string): UserProgress {
  const progress = loadProgress()
  const today = getTodayString()

  // Check streak
  if (progress.lastActiveDate !== today) {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split("T")[0]

    if (progress.lastActiveDate === yesterdayStr) {
      progress.streak += 1
    } else if (progress.lastActiveDate !== today) {
      progress.streak = 1
    }

    progress.activitiesToday = 0

    // First activity of the day bonus
    amount += XP_REWARDS.daily_first_activity

    // Streak bonuses
    if (progress.streak === 3) amount += XP_REWARDS.streak_bonus_3
    if (progress.streak === 7) amount += XP_REWARDS.streak_bonus_7
    if (progress.streak === 30) amount += XP_REWARDS.streak_bonus_30
  }

  progress.lastActiveDate = today
  progress.totalXp += amount
  progress.level = getLevelFromXp(progress.totalXp)
  progress.activitiesToday += 1
  progress.totalActivities += 1
  progress.bestStreak = Math.max(progress.bestStreak, progress.streak)

  // Track per-day XP
  progress.activityHistory[today] = (progress.activityHistory[today] || 0) + amount

  // Track activity counts
  progress.activityCounts[activityId] = (progress.activityCounts[activityId] || 0) + 1

  saveProgress(progress)

  // Sync XP to Supabase players table
  syncXpToDb(progress.totalXp, progress.streak)

  // Auto-save quiz result to DB for teacher tracking
  if (activityId) {
    saveQuizResult(activityId, amount)
  }

  return progress
}

async function getPlayerId(): Promise<string | null> {
  if (typeof window === "undefined") return null
  // Try localStorage first
  const pid = localStorage.getItem("tls_player_id")
  if (pid) return pid
  // Fallback: try auth
  try {
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()
    if (!supabase) return null
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: player } = await supabase.from("players").select("id").eq("auth_id", user.id).single()
      if (player) {
        localStorage.setItem("tls_player_id", player.id)
        return player.id
      }
    }
  } catch {}
  return null
}

async function syncXpToDb(totalXp: number, streak: number) {
  try {
    const playerId = await getPlayerId()
    if (!playerId) return
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()
    if (!supabase) return
    await supabase.from("players").update({
      total_xp: totalXp, current_streak: streak,
    }).eq("id", playerId)
  } catch {
    // Non-critical
  }
}

// Save quiz result to DB for teacher tracking
export async function saveQuizResult(quizType: string, xpEarned: number, score?: number, maxScore?: number) {
  try {
    const playerId = await getPlayerId()
    if (!playerId) return
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()
    if (!supabase) return
    await supabase.from("quiz_results").insert({
      player_id: playerId,
      quiz_type: quizType,
      xp_earned: xpEarned,
      score: score ?? null,
      max_score: maxScore ?? null,
    })
  } catch {
    // Non-critical
  }
}

export function checkAndUnlockAchievements(progress: UserProgress): string[] {
  const newAchievements: string[] = []

  // Generic milestone checks
  const genericChecks: [string, boolean][] = [
    ["first_activity", progress.totalActivities >= 1],
    ["ten_activities", progress.totalActivities >= 10],
    ["fifty_activities", progress.totalActivities >= 50],
    ["hundred_activities", progress.totalActivities >= 100],
    ["streak_3", progress.bestStreak >= 3],
    ["streak_7", progress.bestStreak >= 7],
    ["streak_14", progress.bestStreak >= 14],
    ["streak_30", progress.bestStreak >= 30],
  ]

  for (const [id, condition] of genericChecks) {
    if (condition && !progress.achievements.includes(id)) {
      newAchievements.push(id)
      progress.achievements.push(id)
    }
  }

  // Student badges unlock via XP thresholds
  for (const badge of STUDENT_BADGES) {
    if (progress.totalXp >= badge.xpRequired && !progress.achievements.includes(badge.id)) {
      newAchievements.push(badge.id)
      progress.achievements.push(badge.id)
    }
  }

  if (newAchievements.length > 0) {
    saveProgress(progress)
  }

  return newAchievements
}

export type BadgeLevel = "starter" | "explorer" | "challenger" | "master" | "legend"
export type BadgeGroup = "starter" | "explorer" | "challenger" | "master" | "legend" | "aktivite" | "seri"

export interface AchievementInfo {
  id: string
  title: string
  subtitle: string
  description: string
  icon: string
  rarity: "common" | "rare" | "epic" | "legendary"
  group: BadgeGroup
  category: string
  studentName: string
  xpRequired: number
  level: BadgeLevel
}

export interface BadgeCollection {
  id: string
  name: string
  description: string
  badgeIds: string[]
  goldBadgeTitle: string
}

// Named student badges - 5 levels, 21 badges
export const STUDENT_BADGES: AchievementInfo[] = [
  // Level 1 - Starter (first week of regular play)
  { id: "asel", title: "First Steps Star", subtitle: "Building the first 100 words", description: "İlk 100 kelimeyi öğren", icon: "Star", rarity: "common", group: "starter", category: "Kids / Vocabulary", studentName: "Asel", xpRequired: 200, level: "starter" },
  { id: "ekin", title: "Grammar Seed", subtitle: "Growing strong sentence roots", description: "Güçlü cümle kökleri yetiştir", icon: "Sprout", rarity: "common", group: "starter", category: "Grammar", studentName: "Ekin", xpRequired: 220, level: "starter" },
  { id: "aslan_b", title: "Brave Beginner", subtitle: "Starting with confidence", description: "Cesaretle başla", icon: "Shield", rarity: "common", group: "starter", category: "General English", studentName: "Aslan B.", xpRequired: 280, level: "starter" },
  { id: "aslan_k", title: "Young Explorer", subtitle: "Discovering new words", description: "Yeni kelimeler keşfet", icon: "Compass", rarity: "common", group: "starter", category: "Kids / Reading", studentName: "Aslan K.", xpRequired: 300, level: "starter" },
  { id: "junior_dimli", title: "Mini Achiever", subtitle: "Starter Level Completed", description: "Başlangıç seviyesini tamamla", icon: "Award", rarity: "common", group: "starter", category: "Kids Special", studentName: "Junior Dimli", xpRequired: 350, level: "starter" },

  // Level 2 - Explorer (2-3 weeks of play)
  { id: "elf", title: "Word Wizard", subtitle: "Expanding the language map", description: "Dil haritasını genişlet", icon: "Wand2", rarity: "rare", group: "explorer", category: "Vocabulary", studentName: "Elf", xpRequired: 800, level: "explorer" },
  { id: "rua", title: "Reading Voyager", subtitle: "Exploring meaning in context", description: "Bağlam içinde anlam keşfet", icon: "BookOpen", rarity: "rare", group: "explorer", category: "Reading", studentName: "Rua", xpRequired: 850, level: "explorer" },
  { id: "hunter", title: "Listening Tracker", subtitle: "Catching every detail", description: "Her detayı yakala", icon: "Headphones", rarity: "rare", group: "explorer", category: "Listening", studentName: "Hunter", xpRequired: 1000, level: "explorer" },
  { id: "cati", title: "Structure Builder", subtitle: "Strengthening sentence structures", description: "Cümle yapılarını güçlendirmek", icon: "Building", rarity: "rare", group: "explorer", category: "Grammar", studentName: "Çato", xpRequired: 1100, level: "explorer" },
  { id: "ugur", title: "Creative Eye", subtitle: "Designing language with style", description: "Dili tarzıyla tasarla", icon: "Sparkles", rarity: "rare", group: "explorer", category: "Design / Vocabulary", studentName: "Uğur", xpRequired: 1200, level: "explorer" },

  // Level 3 - Challenger (1-2 months of play)
  { id: "ilaydask", title: "Fluent Challenger", subtitle: "Speaking with confidence", description: "Güvenle konuş", icon: "Mic", rarity: "epic", group: "challenger", category: "Speaking", studentName: "İlaydask", xpRequired: 2500, level: "challenger" },
  { id: "ibo", title: "Fast Thinker", subtitle: "Quick responses, strong impact", description: "Hızlı cevaplar, güçlü etki", icon: "Zap", rarity: "epic", group: "challenger", category: "Vocabulary / Speaking", studentName: "İbo", xpRequired: 3000, level: "challenger" },
  { id: "osan", title: "Grammar Fighter", subtitle: "Mastering complex rules", description: "Karmaşık kurallarda ustalaşmak", icon: "Swords", rarity: "epic", group: "challenger", category: "Grammar", studentName: "Osan", xpRequired: 3500, level: "challenger" },

  // Level 4 - Master (3-5 months of play)
  { id: "sahin_koper", title: "Precision Master", subtitle: "Accuracy at every level", description: "Her seviyede doğruluk", icon: "Target", rarity: "epic", group: "master", category: "Advanced Grammar", studentName: "Şahin Koper", xpRequired: 6000, level: "master" },
  { id: "goko", title: "Speaking Authority", subtitle: "Leading conversations", description: "Konuşmalara liderlik et", icon: "Crown", rarity: "epic", group: "master", category: "Speaking", studentName: "Gökö Canım", xpRequired: 7000, level: "master" },
  { id: "bahar_blossom", title: "Language Bloom", subtitle: "Flourishing in fluency", description: "Akıcılıkta çiçek aç", icon: "Flower2", rarity: "epic", group: "master", category: "Vocabulary / Advanced", studentName: "Bahar Blossom", xpRequired: 7500, level: "master" },
  { id: "bestiem", title: "Elite Performer", subtitle: "Excellence unlocked", description: "Mükemmellik kilidini aç", icon: "Gem", rarity: "legendary", group: "master", category: "General Advanced", studentName: "Bestiem", xpRequired: 8500, level: "master" },

  // Level 5 - Legend (6+ months of dedicated play)
  { id: "joyful_sevil", title: "Fluency Legend", subtitle: "Effortless communication", description: "Zahmetsiz iletişim", icon: "Sparkles", rarity: "legendary", group: "legend", category: "Speaking Mastery", studentName: "Joyful Sevil", xpRequired: 12000, level: "legend" },
  { id: "fast_sevil", title: "Speed Champion", subtitle: "Fast, fluent, fearless", description: "Hızlı, akıcı, korkusuz", icon: "Timer", rarity: "legendary", group: "legend", category: "Real-Time Speaking", studentName: "Fast Sevil", xpRequired: 14000, level: "legend" },
  { id: "big_sevil", title: "Language Icon", subtitle: "Setting the standard", description: "Standardı belirle", icon: "Trophy", rarity: "legendary", group: "legend", category: "Overall Excellence", studentName: "Big Sevil", xpRequired: 16000, level: "legend" },
  { id: "zirve_ozcan", title: "Ultimate Legend", subtitle: "Reaching the peak of English", description: "İngilizce'nin zirvesine ulaş", icon: "Mountain", rarity: "legendary", group: "legend", category: "Grand Master", studentName: "Zirve Özcan", xpRequired: 18000, level: "legend" },
]

// Generic milestone badges (activity & streak)
export const GENERIC_BADGES: AchievementInfo[] = [
  { id: "first_activity", title: "İlk Adım", subtitle: "First Step", description: "İlk aktiviteni tamamla", icon: "Star", rarity: "common", group: "aktivite", category: "Aktivite", studentName: "", xpRequired: 0, level: "starter" },
  { id: "ten_activities", title: "Kararlıyım", subtitle: "Determined", description: "10 aktivite tamamla", icon: "Target", rarity: "common", group: "aktivite", category: "Aktivite", studentName: "", xpRequired: 0, level: "starter" },
  { id: "fifty_activities", title: "Azimli", subtitle: "Persistent", description: "50 aktivite tamamla", icon: "Flame", rarity: "rare", group: "aktivite", category: "Aktivite", studentName: "", xpRequired: 0, level: "explorer" },
  { id: "hundred_activities", title: "Durdurulamaz", subtitle: "Unstoppable", description: "100 aktivite tamamla", icon: "Crown", rarity: "epic", group: "aktivite", category: "Aktivite", studentName: "", xpRequired: 0, level: "challenger" },
  { id: "streak_3", title: "Üç Gün Serisi", subtitle: "3 Day Streak", description: "3 gün üst üste çalış", icon: "Zap", rarity: "common", group: "seri", category: "Seri", studentName: "", xpRequired: 0, level: "starter" },
  { id: "streak_7", title: "Haftalık Seri", subtitle: "Weekly Streak", description: "7 gün üst üste çalış", icon: "Flame", rarity: "rare", group: "seri", category: "Seri", studentName: "", xpRequired: 0, level: "explorer" },
  { id: "streak_14", title: "İki Hafta Serisi", subtitle: "Biweekly Streak", description: "14 gün üst üste çalış", icon: "Trophy", rarity: "epic", group: "seri", category: "Seri", studentName: "", xpRequired: 0, level: "challenger" },
  { id: "streak_30", title: "Ay Boyu Seri", subtitle: "Monthly Streak", description: "30 gün üst üste çalış", icon: "Medal", rarity: "legendary", group: "seri", category: "Seri", studentName: "", xpRequired: 0, level: "legend" },
]

export const ALL_ACHIEVEMENTS: AchievementInfo[] = [...STUDENT_BADGES, ...GENERIC_BADGES]

// Collection sets - completing all badges in a set unlocks a Gold Badge
export const BADGE_COLLECTIONS: BadgeCollection[] = [
  {
    id: "grammar_set",
    name: "Grammar Koleksiyonu",
    description: "Tüm gramer rozetlerini topla",
    badgeIds: ["ekin", "cati", "osan", "sahin_koper"],
    goldBadgeTitle: "Gold Grammar Master",
  },
  {
    id: "vocabulary_set",
    name: "Vocabulary Koleksiyonu",
    description: "Tüm kelime rozetlerini topla",
    badgeIds: ["asel", "elf", "ugur", "ibo", "bahar_blossom"],
    goldBadgeTitle: "Gold Vocabulary Master",
  },
  {
    id: "speaking_set",
    name: "Speaking Koleksiyonu",
    description: "Tüm konuşma rozetlerini topla",
    badgeIds: ["ilaydask", "goko", "joyful_sevil"],
    goldBadgeTitle: "Gold Speaking Master",
  },
  {
    id: "listening_set",
    name: "Listening Koleksiyonu",
    description: "Tüm dinleme rozetlerini topla",
    badgeIds: ["hunter"],
    goldBadgeTitle: "Gold Listening Master",
  },
]

export function isCollectionComplete(collectionId: string, unlockedIds: string[]): boolean {
  const collection = BADGE_COLLECTIONS.find(c => c.id === collectionId)
  if (!collection) return false
  return collection.badgeIds.every(id => unlockedIds.includes(id))
}

export const LEVEL_INFO: Record<BadgeLevel, { label: string; labelTr: string; color: string; bgColor: string; borderColor: string; xpRange: string }> = {
  starter: { label: "Starter", labelTr: "Başlangıç", color: "text-slate-600", bgColor: "bg-slate-100", borderColor: "border-slate-300", xpRange: "200-350 XP" },
  explorer: { label: "Explorer", labelTr: "Kaşifçi", color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-300", xpRange: "800-1.200 XP" },
  challenger: { label: "Challenger", labelTr: "Meydan Okuyan", color: "text-purple-600", bgColor: "bg-purple-50", borderColor: "border-purple-300", xpRange: "2.500-3.500 XP" },
  master: { label: "Master", labelTr: "Usta", color: "text-amber-600", bgColor: "bg-amber-50", borderColor: "border-amber-300", xpRange: "6.000-8.500 XP" },
  legend: { label: "Legend", labelTr: "Efsane", color: "text-rose-600", bgColor: "bg-rose-50", borderColor: "border-rose-300", xpRange: "12.000-18.000 XP" },
}

export function markPerfectScore(): void {
  const progress = loadProgress()
  ;(progress as any)._hadPerfect = true
  saveProgress(progress)
}

export function getBadgeHint(progress: UserProgress): string | null {
  // Find the next locked student badge closest to current XP
  const locked = STUDENT_BADGES.filter(b => !progress.achievements.includes(b.id))
    .sort((a, b) => a.xpRequired - b.xpRequired)
  if (locked.length > 0) {
    const next = locked[0]
    const remaining = next.xpRequired - progress.totalXp
    if (remaining > 0 && remaining <= 50) {
      return `${next.studentName} - "${next.title}" rozetine ${remaining} XP kaldı!`
    }
  }
  if (!progress.achievements.includes("streak_7") && progress.streak >= 4 && progress.streak < 7) {
    return `Haftalık Seri rozetine ${7 - progress.streak} gün kaldı!`
  }
  return null
}
