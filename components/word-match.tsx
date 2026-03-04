"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw, Link2, ArrowRight, Share2, Check, Trophy, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { playSoundEffect } from "@/components/xp-toast"
import { ShareChallenge } from "@/components/share-challenge"
import { addXp, checkAndUnlockAchievements, XP_REWARDS, markPerfectScore } from "@/lib/xp-system"

interface WordPair {
  id: number
  english: string
  turkish: string
  level: "A1" | "A2" | "B1" | "B2" | "C1"
}

type LevelFilter = "all" | "A1" | "A2" | "B1" | "B2" | "C1"

const LEVELS: { value: LevelFilter; label: string; desc: string }[] = [
  { value: "all", label: "Hepsi", desc: "Tum seviyeler" },
  { value: "A1", label: "A1", desc: "Baslangic" },
  { value: "A2", label: "A2", desc: "Temel" },
  { value: "B1", label: "B1", desc: "Orta" },
  { value: "B2", label: "B2", desc: "Orta-Ileri" },
  { value: "C1", label: "C1", desc: "Ileri" },
]

const wordPairs: WordPair[] = [
  // A1 - Basic everyday words
  { id: 1, english: "Beautiful", turkish: "Guzel", level: "A1" },
  { id: 2, english: "Important", turkish: "Onemli", level: "A1" },
  { id: 3, english: "Difficult", turkish: "Zor", level: "A1" },
  { id: 4, english: "Different", turkish: "Farkli", level: "A1" },
  { id: 5, english: "Expensive", turkish: "Pahali", level: "A1" },
  { id: 6, english: "Interesting", turkish: "Ilginc", level: "A1" },
  { id: 7, english: "Comfortable", turkish: "Rahat", level: "A1" },
  { id: 8, english: "Dangerous", turkish: "Tehlikeli", level: "A1" },
  { id: 9, english: "Knowledge", turkish: "Bilgi", level: "A1" },
  { id: 10, english: "Experience", turkish: "Deneyim", level: "A1" },
  { id: 11, english: "Receipt", turkish: "Fis", level: "A1" },
  { id: 12, english: "Luggage", turkish: "Bagaj", level: "A1" },
  { id: 13, english: "Schedule", turkish: "Program", level: "A1" },
  { id: 14, english: "Generous", turkish: "Comert", level: "A1" },
  { id: 15, english: "Stubborn", turkish: "Inatci", level: "A1" },
  { id: 16, english: "Grateful", turkish: "Minnettar", level: "A1" },
  { id: 17, english: "Anxious", turkish: "Endiseli", level: "A1" },
  { id: 18, english: "Give up", turkish: "Vazgecmek", level: "A1" },
  // A2 - Elementary
  { id: 19, english: "Necessary", turkish: "Gerekli", level: "A2" },
  { id: 20, english: "Possible", turkish: "Mumkun", level: "A2" },
  { id: 21, english: "Successful", turkish: "Basarili", level: "A2" },
  { id: 22, english: "Excellent", turkish: "Mukemmel", level: "A2" },
  { id: 23, english: "Available", turkish: "Mevcut", level: "A2" },
  { id: 24, english: "Responsible", turkish: "Sorumlu", level: "A2" },
  { id: 25, english: "Improve", turkish: "Gelistirmek", level: "A2" },
  { id: 26, english: "Achieve", turkish: "Basarmak", level: "A2" },
  { id: 27, english: "Provide", turkish: "Saglamak", level: "A2" },
  { id: 28, english: "Recognize", turkish: "Tanimak", level: "A2" },
  { id: 29, english: "Achievement", turkish: "Basari", level: "A2" },
  { id: 30, english: "Opportunity", turkish: "Firsat", level: "A2" },
  { id: 31, english: "Environment", turkish: "Cevre", level: "A2" },
  { id: 32, english: "Advantage", turkish: "Avantaj", level: "A2" },
  { id: 33, english: "Deadline", turkish: "Son tarih", level: "A2" },
  { id: 34, english: "Colleague", turkish: "Is arkadasi", level: "A2" },
  { id: 35, english: "Departure", turkish: "Kalkis", level: "A2" },
  { id: 36, english: "Currency", turkish: "Para birimi", level: "A2" },
  { id: 37, english: "Put off", turkish: "Ertelemek", level: "A2" },
  { id: 38, english: "Break down", turkish: "Bozulmak", level: "A2" },
  // B1 - Intermediate
  { id: 39, english: "Confident", turkish: "Kendine guvenen", level: "B1" },
  { id: 40, english: "Reliable", turkish: "Guvenilir", level: "B1" },
  { id: 41, english: "Ambitious", turkish: "Hirsli", level: "B1" },
  { id: 42, english: "Sufficient", turkish: "Yeterli", level: "B1" },
  { id: 43, english: "Obvious", turkish: "Acik/Belli", level: "B1" },
  { id: 44, english: "Relevant", turkish: "Ilgili", level: "B1" },
  { id: 45, english: "Consider", turkish: "Dusunmek", level: "B1" },
  { id: 46, english: "Require", turkish: "Gerektirmek", level: "B1" },
  { id: 47, english: "Establish", turkish: "Kurmak", level: "B1" },
  { id: 48, english: "Maintain", turkish: "Surdurmek", level: "B1" },
  { id: 49, english: "Persuade", turkish: "Ikna etmek", level: "B1" },
  { id: 50, english: "Determine", turkish: "Belirlemek", level: "B1" },
  { id: 51, english: "Requirement", turkish: "Gereklilik", level: "B1" },
  { id: 52, english: "Appointment", turkish: "Randevu", level: "B1" },
  { id: 53, english: "Improvement", turkish: "Gelisme", level: "B1" },
  { id: 54, english: "Consequence", turkish: "Sonuc", level: "B1" },
  { id: 55, english: "Enthusiastic", turkish: "Hevesli", level: "B1" },
  { id: 56, english: "Resilient", turkish: "Dayanikli", level: "B1" },
  { id: 57, english: "Look forward to", turkish: "Dort gozle beklemek", level: "B1" },
  { id: 58, english: "Carry out", turkish: "Gerceklestirmek", level: "B1" },
  { id: 59, english: "Come up with", turkish: "Bulmak/Uretmek", level: "B1" },
  { id: 60, english: "Turn down", turkish: "Reddetmek", level: "B1" },
  { id: 61, english: "Figure out", turkish: "Cozmek/Anlamak", level: "B1" },
  { id: 62, english: "Evidence", turkish: "Kanit", level: "B1" },
  { id: 63, english: "Theory", turkish: "Teori", level: "B1" },
  { id: 64, english: "Analysis", turkish: "Analiz", level: "B1" },
  { id: 65, english: "Conclusion", turkish: "Sonuc/Vargı", level: "B1" },
  // B2 - Upper Intermediate
  { id: 66, english: "Compromise", turkish: "Uzlasma", level: "B2" },
  { id: 67, english: "Significant", turkish: "Kayda deger", level: "B2" },
  { id: 68, english: "Inevitable", turkish: "Kacinilmaz", level: "B2" },
  { id: 69, english: "Perspective", turkish: "Bakis acisi", level: "B2" },
  { id: 70, english: "Contribute", turkish: "Katki saglamak", level: "B2" },
  { id: 71, english: "Appropriate", turkish: "Uygun", level: "B2" },
  { id: 72, english: "Distinguish", turkish: "Ayirt etmek", level: "B2" },
  { id: 73, english: "Circumstances", turkish: "Kosullar", level: "B2" },
  { id: 74, english: "Approximately", turkish: "Yaklasik", level: "B2" },
  { id: 75, english: "Considerable", turkish: "Hatiri sayilir", level: "B2" },
  { id: 76, english: "Substantial", turkish: "Onemli miktarda", level: "B2" },
  { id: 77, english: "Diagnosis", turkish: "Tani", level: "B2" },
  { id: 78, english: "Symptom", turkish: "Belirti", level: "B2" },
  { id: 79, english: "Treatment", turkish: "Tedavi", level: "B2" },
  { id: 80, english: "Prescription", turkish: "Recete", level: "B2" },
  { id: 81, english: "Recovery", turkish: "Iyilesme", level: "B2" },
  { id: 82, english: "Vulnerable", turkish: "Savunmasiz", level: "B2" },
  { id: 83, english: "Prominent", turkish: "Onde gelen", level: "B2" },
  { id: 84, english: "Overwhelmed", turkish: "Bunalmis", level: "B2" },
  { id: 85, english: "Run out of", turkish: "Tukenmek", level: "B2" },
  { id: 86, english: "Bring about", turkish: "Neden olmak", level: "B2" },
  { id: 87, english: "Criteria", turkish: "Olcut", level: "B2" },
  // C1 - Advanced
  { id: 88, english: "Hypothesis", turkish: "Hipotez", level: "C1" },
  { id: 89, english: "Phenomenon", turkish: "Olgu", level: "C1" },
  { id: 90, english: "Methodology", turkish: "Yontem", level: "C1" },
  { id: 91, english: "Correlation", turkish: "Iliski/Korelasyon", level: "C1" },
  { id: 92, english: "Scrutinize", turkish: "Incelemek", level: "C1" },
  { id: 93, english: "Undermine", turkish: "Baltalamak", level: "C1" },
  { id: 94, english: "Exacerbate", turkish: "Kotulestirmek", level: "C1" },
  { id: 95, english: "Facilitate", turkish: "Kolaylastirmak", level: "C1" },
  { id: 96, english: "Contemplate", turkish: "Derin dusunmek", level: "C1" },
  { id: 97, english: "Fluctuate", turkish: "Dalgalanmak", level: "C1" },
  { id: 98, english: "Encompass", turkish: "Kapsamak", level: "C1" },
  { id: 99, english: "Meticulous", turkish: "Titiz", level: "C1" },
]

const PAIRS_PER_SET = 6

export function WordMatch() {
  const [selectedLevel, setSelectedLevel] = useState<LevelFilter>("all")
  const [gameStarted, setGameStarted] = useState(false)
  const [gamePairs, setGamePairs] = useState<WordPair[]>([])
  const [englishWords, setEnglishWords] = useState<string[]>([])
  const [turkishWords, setTurkishWords] = useState<string[]>([])
  const [selectedEnglish, setSelectedEnglish] = useState<string | null>(null)
  const [selectedTurkish, setSelectedTurkish] = useState<string | null>(null)
  const [matched, setMatched] = useState<string[]>([])
  const [wrongPair, setWrongPair] = useState<{ en: string; tr: string } | null>(null)
  const [isFinished, setIsFinished] = useState(false)
  const [moves, setMoves] = useState(0)
  const [currentSet, setCurrentSet] = useState(1)
  const [totalMoves, setTotalMoves] = useState(0)
  const [totalMatches, setTotalMatches] = useState(0)
  const [usedIds, setUsedIds] = useState<Set<number>>(new Set())
  const [copied, setCopied] = useState(false)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [lastMatchAnimation, setLastMatchAnimation] = useState<string | null>(null)

  const getFilteredPairs = () => {
    if (selectedLevel === "all") return wordPairs
    return wordPairs.filter(p => p.level === selectedLevel)
  }

  // Ensure no duplicate english or turkish strings end up in the same round
  const selectUniquePairs = (pool: WordPair[], count: number): WordPair[] => {
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    const result: WordPair[] = []
    const usedEn = new Set<string>()
    const usedTr = new Set<string>()
    for (const p of shuffled) {
      if (result.length >= count) break
      if (usedEn.has(p.english) || usedTr.has(p.turkish)) continue
      usedEn.add(p.english)
      usedTr.add(p.turkish)
      result.push(p)
    }
    return result
  }

  const startGame = () => {
    const pool = getFilteredPairs()
    const available = pool.filter(p => !usedIds.has(p.id))

    let selectedPairs: WordPair[]
    if (available.length < PAIRS_PER_SET) {
      setUsedIds(new Set())
      selectedPairs = selectUniquePairs(pool, PAIRS_PER_SET)
    } else {
      selectedPairs = selectUniquePairs(available, PAIRS_PER_SET)
    }
    setGameStarted(true)

    setGamePairs(selectedPairs)
    setEnglishWords(selectedPairs.map(p => p.english).sort(() => Math.random() - 0.5))
    setTurkishWords(selectedPairs.map(p => p.turkish).sort(() => Math.random() - 0.5))
    setSelectedEnglish(null)
    setSelectedTurkish(null)
    setMatched([])
    setWrongPair(null)
    setIsFinished(false)
    setMoves(0)
    setStreak(0)
    setLastMatchAnimation(null)
  }

  const continueGame = () => {
    const newUsedIds = new Set(usedIds)
    for (const p of gamePairs) {
      newUsedIds.add(p.id)
    }
    setUsedIds(newUsedIds)

    setTotalMoves(prev => prev + moves)
    setTotalMatches(prev => prev + matched.length)
    setCurrentSet(prev => prev + 1)

    const pool = getFilteredPairs()
    const available = pool.filter(p => !newUsedIds.has(p.id))

    let selectedPairs: WordPair[]
    if (available.length < PAIRS_PER_SET) {
      setUsedIds(new Set())
      selectedPairs = selectUniquePairs(pool, PAIRS_PER_SET)
    } else {
      selectedPairs = selectUniquePairs(available, PAIRS_PER_SET)
    }

    setGamePairs(selectedPairs)
    setEnglishWords(selectedPairs.map(p => p.english).sort(() => Math.random() - 0.5))
    setTurkishWords(selectedPairs.map(p => p.turkish).sort(() => Math.random() - 0.5))
    setSelectedEnglish(null)
    setSelectedTurkish(null)
    setMatched([])
    setWrongPair(null)
    setIsFinished(false)
    setMoves(0)
    setStreak(0)
    setLastMatchAnimation(null)
  }

  const resetGame = () => {
    setCurrentSet(1)
    setTotalMoves(0)
    setTotalMatches(0)
    setUsedIds(new Set())
    setCopied(false)
    setBestStreak(0)
    setGameStarted(false)
  }

  const shareResult = async () => {
    const finalMoves = totalMoves + moves
    const finalMatches = totalMatches + matched.length
    const text = `Kelime Eşleştirme oyununda ${currentSet} sette ${finalMatches} kelimeyi ${finalMoves} hamlede eşleştirdim! Sen de dene:`
    const url = typeof window !== "undefined" ? window.location.origin : ""

    if (navigator.share) {
      try {
        await navigator.share({ title: "Eşleştirme Sonucum", text, url })
      } catch {
        // cancelled
      }
    } else {
      const fullText = `${text}\n${url}`
      await navigator.clipboard.writeText(fullText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  useEffect(() => {
    if (selectedEnglish && selectedTurkish) {
      setMoves(m => m + 1)
      const pair = gamePairs.find(p => p.english === selectedEnglish)
  if (pair && pair.turkish === selectedTurkish) {
  const newMatched = [...matched, selectedEnglish]
  setMatched(newMatched)
  playSoundEffect("correct")
  setLastMatchAnimation(selectedEnglish)
  setTimeout(() => setLastMatchAnimation(null), 600)
        const newStreak = streak + 1
        setStreak(newStreak)
        if (newStreak > bestStreak) setBestStreak(newStreak)
        setSelectedEnglish(null)
        setSelectedTurkish(null)
        if (newMatched.length === gamePairs.length) {
          setIsFinished(true)
          const updated = addXp(XP_REWARDS.word_match_complete, "word_match")
          if (moves <= PAIRS_PER_SET) markPerfectScore()
          checkAndUnlockAchievements(updated)
        }
  } else {
  setStreak(0)
  playSoundEffect("wrong")
  setWrongPair({ en: selectedEnglish, tr: selectedTurkish })
        setTimeout(() => {
          setSelectedEnglish(null)
          setSelectedTurkish(null)
          setWrongPair(null)
        }, 600)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEnglish, selectedTurkish])

  const handleEnglishClick = (word: string) => {
    if (matched.includes(word) || wrongPair) return
    setSelectedEnglish(word === selectedEnglish ? null : word)
  }

  const handleTurkishClick = (word: string) => {
    if (matched.some(m => gamePairs.find(p => p.english === m)?.turkish === word) || wrongPair) return
    setSelectedTurkish(word === selectedTurkish ? null : word)
  }

  const remainingPairs = getFilteredPairs().length - usedIds.size - gamePairs.length
  const progress = (matched.length / PAIRS_PER_SET) * 100

  if (!gameStarted) {
    return (
      <div className="py-6">
        <div className="flex items-center gap-2 mb-4">
          <Link2 className="w-5 h-5 text-violet-600" />
          <h3 className="font-serif text-lg">Kelime Eslestirme</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Seviyeni sec ve eslestirmeye basla!</p>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {LEVELS.map(l => (
            <button
              key={l.value}
              onClick={() => setSelectedLevel(l.value)}
              className={cn(
                "rounded-xl border-2 p-3 text-center transition-all",
                selectedLevel === l.value
                  ? "border-violet-400 bg-violet-50 text-violet-700 shadow-sm"
                  : "border-border bg-background hover:border-violet-300 hover:bg-violet-50/50"
              )}
            >
              <div className="font-bold text-sm">{l.label}</div>
              <div className="text-[10px] text-muted-foreground">{l.desc}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                {l.value === "all" ? wordPairs.length : wordPairs.filter(p => p.level === l.value).length} kelime
              </div>
            </button>
          ))}
        </div>
        <Button onClick={() => startGame()} className="w-full bg-violet-600 hover:bg-violet-700 text-white">
          <Zap className="w-4 h-4 mr-2" />
          Basla
        </Button>
      </div>
    )
  }

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Link2 className="w-5 h-5 text-violet-600" />
          <h3 className="font-serif text-lg">Eslestirme</h3>
          {selectedLevel !== "all" && (
            <span className="text-[10px] bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded-full font-medium">{selectedLevel}</span>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {streak >= 2 && (
            <span className="flex items-center gap-1 text-amber-500 font-medium animate-in fade-in duration-200">
              <Zap className="w-3.5 h-3.5" />{streak}x
            </span>
          )}
          <span>{matched.length}/{PAIRS_PER_SET}</span>
          {currentSet > 1 && <span className="text-xs">Set {currentSet}</span>}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-muted rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-violet-500 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {!isFinished ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            {/* English column */}
            <div className="space-y-2" role="listbox" aria-label="İngilizce kelimeler">
              <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest px-1 mb-1">
                English
              </div>
              {englishWords.map((word) => {
                const isMatched = matched.includes(word)
                const isSelected = selectedEnglish === word
                const isWrong = wrongPair?.en === word
                const justMatched = lastMatchAnimation === word
                return (
                  <button
                    key={word}
                    onClick={() => handleEnglishClick(word)}
                    disabled={isMatched}
                    role="option"
                    aria-selected={isSelected}
                    className={cn(
                      "w-full p-3 rounded-xl text-sm font-medium transition-all text-left border-2",
                      isMatched && "bg-emerald-50 text-emerald-600 border-emerald-200 opacity-60",
                      justMatched && "scale-95",
                      !isMatched && !isSelected && !isWrong && "bg-background border-border hover:border-violet-300 hover:bg-violet-50/50",
                      isSelected && !isWrong && "bg-violet-50 text-violet-700 border-violet-400 shadow-sm",
                      isWrong && "bg-red-50 text-red-600 border-red-400 animate-[shake_0.4s_ease-in-out]",
                      "relative z-10 touch-manipulation pointer-events-auto"
                    )}
                  >
                    {word}
                  </button>
                )
              })}
            </div>

            {/* Turkish column */}
            <div className="space-y-2" role="listbox" aria-label="Türkçe kelimeler">
              <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest px-1 mb-1">
                Türkçe
              </div>
              {turkishWords.map((word) => {
                const matchedPair = gamePairs.find(p => p.turkish === word)
                const isMatched = matchedPair ? matched.includes(matchedPair.english) : false
                const isSelected = selectedTurkish === word
                const isWrong = wrongPair?.tr === word
                const justMatched = matchedPair && lastMatchAnimation === matchedPair.english
                return (
                  <button
                    key={word}
                    onClick={() => handleTurkishClick(word)}
                    disabled={isMatched}
                    role="option"
                    aria-selected={isSelected}
                    className={cn(
                      "w-full p-3 rounded-xl text-sm font-medium transition-all text-left border-2",
                      isMatched && "bg-emerald-50 text-emerald-600 border-emerald-200 opacity-60",
                      justMatched && "scale-95",
                      !isMatched && !isSelected && !isWrong && "bg-background border-border hover:border-secondary/40 hover:bg-secondary/5",
                      isSelected && !isWrong && "bg-secondary/10 text-secondary border-secondary/60 shadow-sm",
                      isWrong && "bg-red-50 text-red-600 border-red-400 animate-[shake_0.4s_ease-in-out]",
                      "relative z-10 touch-manipulation pointer-events-auto"
                    )}
                  >
                    {word}
                  </button>
                )
              })}
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-3">
            İngilizce ve Türkçe kelimeleri eşleştirin
          </p>
        </>
      ) : (
        <Card className="border border-border/50 overflow-hidden rounded-lg">
          <div className="bg-violet-50 py-3 text-center">
            <Trophy className="w-8 h-8 text-violet-600 mx-auto mb-1" />
            <h4 className="font-serif text-xl">Set Tamamlandı!</h4>
          </div>
          <CardContent className="p-5">
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="text-center p-2.5 rounded-xl bg-muted/50">
                <div className="text-xl font-bold">{moves}</div>
                <div className="text-[10px] text-muted-foreground">Hamle</div>
              </div>
              <div className="text-center p-2.5 rounded-xl bg-muted/50">
                <div className="text-xl font-bold">{PAIRS_PER_SET}</div>
                <div className="text-[10px] text-muted-foreground">Eşleşme</div>
              </div>
              <div className="text-center p-2.5 rounded-xl bg-muted/50">
                <div className="text-xl font-bold">{bestStreak}x</div>
                <div className="text-[10px] text-muted-foreground">En İyi Seri</div>
              </div>
            </div>

            {currentSet > 1 && (
              <div className="text-center text-sm text-muted-foreground mb-4 py-2 border-t border-b border-dashed">
                Toplam: {totalMoves + moves} hamle, {totalMatches + matched.length} eşleşme
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Button onClick={continueGame} className="w-full bg-violet-600 hover:bg-violet-700 text-white">
                <ArrowRight className="w-4 h-4 mr-2" />
                Devam Et ({remainingPairs > 0 ? `${remainingPairs} kelime kaldı` : "Baştan"})
              </Button>
                <div className="mt-2 pt-3 border-t border-border/50">
                  <ShareChallenge
                    title="Kelime Eşleştirme Sonucum"
                    scoreText={`Kelime Eşleştirme'de ${currentSet} sette ${totalMatches + matched.length} kelimeyi ${totalMoves + moves} hamlede eşleştirdim!`}
                    challengeText="Sen daha az hamlede yapabilir misin?"
                    toolSlug="word-match"
                    challengeScore={totalMatches + matched.length}
                    challengeTotal={totalMoves + moves}
                  />
                </div>
              <Button onClick={resetGame} variant="outline" className="w-full bg-transparent">
                <RotateCcw className="w-4 h-4 mr-2" />
                Sıfırdan Başla
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
