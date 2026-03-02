// Seeded PRNG (mulberry32), challenge encode/decode, and seeded shuffle utilities
// All challenge/duel data is encoded into URL-safe base64 strings - no backend needed.

export interface ChallengeData {
  g: string   // game type slug
  s: number   // seed for deterministic question selection
  n: string   // challenger display name
  sc: number  // challenger score (correct answers)
  t: number   // total questions
  ts: number  // timestamp
  m?: "duel" | "challenge" // mode
}

// -- Seeded PRNG (mulberry32) --
export function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Hash a string into a numeric seed
export function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i)
    hash = ((hash << 5) - hash + ch) | 0
  }
  return Math.abs(hash)
}

// Deterministic shuffle using a seed
export function seededShuffle<T>(array: T[], seed: number): T[] {
  const rng = mulberry32(seed)
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// Pick N items from array deterministically
export function seededPick<T>(array: T[], seed: number, count: number): T[] {
  return seededShuffle(array, seed).slice(0, count)
}

// -- Encode / Decode challenge data as URL-safe base64 --
export function encodeChallengeData(data: ChallengeData): string {
  try {
    const json = JSON.stringify(data)
    if (typeof window !== "undefined") {
      return btoa(unescape(encodeURIComponent(json)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "")
    }
    return Buffer.from(json).toString("base64url")
  } catch {
    return ""
  }
}

export function decodeChallengeData(encoded: string): ChallengeData | null {
  try {
    let b64 = encoded.replace(/-/g, "+").replace(/_/g, "/")
    while (b64.length % 4) b64 += "="
    const json =
      typeof window !== "undefined"
        ? decodeURIComponent(escape(atob(b64)))
        : Buffer.from(b64, "base64").toString("utf-8")
    const parsed = JSON.parse(json)
    if (parsed && typeof parsed.g === "string" && typeof parsed.sc === "number") {
      return parsed as ChallengeData
    }
    return null
  } catch {
    return null
  }
}

// Generate a random seed
export function randomSeed(): number {
  return Math.floor(Math.random() * 2147483647)
}

// Get today's date seed (same for every user worldwide)
export function todaysSeed(): number {
  const d = new Date()
  const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  return hashString(dateStr)
}

// Today's date as YYYY-MM-DD
export function todaysDateStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

// ---------- Game display names ----------
export const GAME_NAMES: Record<string, string> = {
  collocation: "Collocations",
  "context-clues": "Bağlamdan Anlam",
  "error-spotting": "Hata Bul",
  "word-formation": "Kelime Türetme",
  "sentence-transform": "Cümle Dönüşümü",
  blitz: "Blitz Challenge",
  "cloze-test": "Boşluk Doldur",
  "minimal-pairs": "Minimal Pairs",
  "exam-practice": "Sınav Pratiği",
  wordle: "Wordle",
  hangman: "Adam Asmaca",
  "sentence-builder": "Cümle Kur",
  flashcard: "Kelime Kartları",
  "word-match": "Kelime Eşleştir",
  "timed-reading": "Hızlı Okuma",
  daily: "Günlük Challenge",
}

// ---------- URL + share text builders ----------
export function buildChallengeUrl(data: ChallengeData): string {
  const base = typeof window !== "undefined" ? window.location.origin : "https://www.textlanguageschool.net"
  const encoded = encodeChallengeData(data)
  return `${base}/meydan-oku?d=${encoded}`
}

export function getChallengeShareText(data: ChallengeData, url: string): string {
  const pct = Math.round((data.sc / data.t) * 100)
  const name = GAME_NAMES[data.g] || data.g
  if (data.m === "duel") {
    return `${data.n} seni duelloya davet ediyor! ${name}'da %${pct} yaptı. Yenebilir misin?\n\n${url}`
  }
  return `${data.n} ${name}'da ${data.sc}/${data.t} (%${pct}) yaptı! Sen kaçta kalırsın?\n\n${url}`
}
