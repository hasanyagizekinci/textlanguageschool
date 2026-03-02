// Personal records system -- stores best scores per game in localStorage

export interface GameRecord {
  gameSlug: string
  gameName: string
  score: number       // correct answers
  total: number       // total questions
  percentage: number
  date: string        // ISO date string
  streak?: number     // optional best streak (for blitz)
}

const STORAGE_KEY = "text_personal_records"

function loadRecords(): Record<string, GameRecord> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveRecords(records: Record<string, GameRecord>) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  } catch { /* quota */ }
}

/** Save a game result. Returns true if it's a new personal best. */
export function saveGameRecord(record: GameRecord): boolean {
  const records = loadRecords()
  const existing = records[record.gameSlug]
  const isNewBest =
    !existing ||
    record.percentage > existing.percentage ||
    (record.percentage === existing.percentage && record.score > existing.score)

  if (isNewBest) {
    records[record.gameSlug] = record
    saveRecords(records)
  }
  return isNewBest
}

/** Get the personal best for a specific game. */
export function getGameRecord(gameSlug: string): GameRecord | null {
  const records = loadRecords()
  return records[gameSlug] || null
}

/** Get all personal records. */
export function getAllRecords(): GameRecord[] {
  const records = loadRecords()
  return Object.values(records).sort((a, b) => b.percentage - a.percentage)
}

/** Check if a score beats the current record. */
export function isNewRecord(gameSlug: string, percentage: number): boolean {
  const existing = getGameRecord(gameSlug)
  return !existing || percentage > existing.percentage
}

/** Daily challenge records */
const DAILY_KEY = "text_daily_results"

export interface DailyResult {
  date: string
  score: number
  total: number
}

export function saveDailyResult(result: DailyResult) {
  if (typeof window === "undefined") return
  try {
    const raw = localStorage.getItem(DAILY_KEY)
    const all: DailyResult[] = raw ? JSON.parse(raw) : []
    // Only save once per day
    if (!all.find(r => r.date === result.date)) {
      all.push(result)
      // Keep last 30 days
      const trimmed = all.slice(-30)
      localStorage.setItem(DAILY_KEY, JSON.stringify(trimmed))
    }
  } catch { /* quota */ }
}

export function getDailyResult(date: string): DailyResult | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(DAILY_KEY)
    const all: DailyResult[] = raw ? JSON.parse(raw) : []
    return all.find(r => r.date === date) || null
  } catch {
    return null
  }
}

export function getDailyStreak(): number {
  if (typeof window === "undefined") return 0
  try {
    const raw = localStorage.getItem(DAILY_KEY)
    const all: DailyResult[] = raw ? JSON.parse(raw) : []
    if (all.length === 0) return 0

    let streak = 0
    const today = new Date()
    for (let i = 0; i < 365; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split("T")[0]
      if (all.find(r => r.date === dateStr)) {
        streak++
      } else {
        break
      }
    }
    return streak
  } catch {
    return 0
  }
}
