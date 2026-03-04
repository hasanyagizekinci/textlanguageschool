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
}

const wordPairs: WordPair[] = [
  // Adjectives
  { id: 1, english: "Beautiful", turkish: "Güzel" },
  { id: 2, english: "Important", turkish: "Önemli" },
  { id: 3, english: "Difficult", turkish: "Zor" },
  { id: 4, english: "Necessary", turkish: "Gerekli" },
  { id: 5, english: "Different", turkish: "Farklı" },
  { id: 6, english: "Possible", turkish: "Mümkün" },
  { id: 7, english: "Successful", turkish: "Başarılı" },
  { id: 8, english: "Dangerous", turkish: "Tehlikeli" },
  { id: 9, english: "Expensive", turkish: "Pahalı" },
  { id: 10, english: "Interesting", turkish: "İlginç" },
  { id: 11, english: "Comfortable", turkish: "Rahat" },
  { id: 12, english: "Available", turkish: "Mevcut" },
  { id: 13, english: "Responsible", turkish: "Sorumlu" },
  { id: 14, english: "Excellent", turkish: "Mükemmel" },
  { id: 15, english: "Confident", turkish: "Kendine güvenen" },
  { id: 16, english: "Reliable", turkish: "Güvenilir" },
  { id: 17, english: "Ambitious", turkish: "Hırslı" },
  { id: 18, english: "Sufficient", turkish: "Yeterli" },
  { id: 19, english: "Obvious", turkish: "Açık/Belli" },
  { id: 20, english: "Relevant", turkish: "İlgili" },
  // Verbs
  { id: 21, english: "Achieve", turkish: "Başarmak" },
  { id: 22, english: "Improve", turkish: "Geliştirmek" },
  { id: 23, english: "Consider", turkish: "Düşünmek/Göz önünde bulundurmak" },
  { id: 24, english: "Require", turkish: "Gerektirmek" },
  { id: 25, english: "Establish", turkish: "Kurmak" },
  { id: 26, english: "Maintain", turkish: "Sürdürmek" },
  { id: 27, english: "Persuade", turkish: "İkna etmek" },
  { id: 28, english: "Recognize", turkish: "Tanımak" },
  { id: 29, english: "Determine", turkish: "Belirlemek" },
  { id: 30, english: "Provide", turkish: "Sağlamak" },
  // Nouns
  { id: 31, english: "Achievement", turkish: "Başarı" },
  { id: 32, english: "Opportunity", turkish: "Fırsat" },
  { id: 33, english: "Experience", turkish: "Deneyim" },
  { id: 34, english: "Environment", turkish: "Çevre" },
  { id: 35, english: "Knowledge", turkish: "Bilgi" },
  { id: 36, english: "Requirement", turkish: "Gereklilik" },
  { id: 37, english: "Appointment", turkish: "Randevu" },
  { id: 38, english: "Improvement", turkish: "Gelişme" },
  { id: 39, english: "Consequence", turkish: "Sonuç" },
  { id: 40, english: "Advantage", turkish: "Avantaj" },
  // More words
  { id: 41, english: "Compromise", turkish: "Uzlaşma" },
  { id: 42, english: "Significant", turkish: "Kayda değer" },
  { id: 43, english: "Inevitable", turkish: "Kaçınılmaz" },
  { id: 44, english: "Perspective", turkish: "Bakış açısı" },
  { id: 45, english: "Contribute", turkish: "Katkı sağlamak" },
  { id: 46, english: "Appropriate", turkish: "Uygun" },
  { id: 47, english: "Distinguish", turkish: "Ayırt etmek" },
  { id: 48, english: "Circumstances", turkish: "Koşullar" },
  { id: 49, english: "Approximately", turkish: "Yaklaşık" },
  { id: 50, english: "Considerable", turkish: "Hatırı sayılır" },
  // Phrasal verbs & idioms
  { id: 51, english: "Give up", turkish: "Vazgeçmek" },
  { id: 52, english: "Look forward to", turkish: "Dört gözle beklemek" },
  { id: 53, english: "Carry out", turkish: "Gerçekleştirmek" },
  { id: 54, english: "Come up with", turkish: "Bulmak/Üretmek" },
  { id: 55, english: "Put off", turkish: "Ertelemek" },
  { id: 56, english: "Turn down", turkish: "Reddetmek" },
  { id: 57, english: "Run out of", turkish: "Tükenmek" },
  { id: 58, english: "Break down", turkish: "Bozulmak" },
  { id: 59, english: "Figure out", turkish: "Çözmek/Anlamak" },
  { id: 60, english: "Bring about", turkish: "Neden olmak" },
  // Academic words
  { id: 61, english: "Hypothesis", turkish: "Hipotez" },
  { id: 62, english: "Phenomenon", turkish: "Olgu" },
  { id: 63, english: "Methodology", turkish: "Yöntem" },
  { id: 64, english: "Correlation", turkish: "İlişki/Bağıntı" },
  { id: 65, english: "Substantial", turkish: "Önemli miktarda" },
  // Medical words
  { id: 66, english: "Diagnosis", turkish: "Tanı" },
  { id: 67, english: "Symptom", turkish: "Belirti" },
  { id: 68, english: "Treatment", turkish: "Tedavi" },
  { id: 69, english: "Prescription", turkish: "Reçete" },
  { id: 70, english: "Recovery", turkish: "İyileşme" },
  // More advanced
  { id: 71, english: "Scrutinize", turkish: "Dikkatle incelemek" },
  { id: 72, english: "Undermine", turkish: "Baltalamak" },
  { id: 73, english: "Exacerbate", turkish: "Kötüleştirmek" },
  { id: 74, english: "Facilitate", turkish: "Kolaylaştırmak" },
  { id: 75, english: "Contemplate", turkish: "Derin düşünmek" },
  { id: 76, english: "Vulnerable", turkish: "Savunmasız" },
  { id: 77, english: "Prominent", turkish: "Önde gelen" },
  { id: 78, english: "Fluctuate", turkish: "Dalgalanmak" },
  { id: 79, english: "Encompass", turkish: "Kapsamak" },
  { id: 80, english: "Meticulous", turkish: "Titiz" },
  // Daily life & travel
  { id: 81, english: "Receipt", turkish: "Fiş" },
  { id: 82, english: "Luggage", turkish: "Bagaj" },
  { id: 83, english: "Schedule", turkish: "Program" },
  { id: 84, english: "Deadline", turkish: "Son tarih" },
  { id: 85, english: "Colleague", turkish: "İş arkadaşı" },
  { id: 86, english: "Departure", turkish: "Kalkış" },
  { id: 87, english: "Currency", turkish: "Para birimi" },
  { id: 88, english: "Grateful", turkish: "Minnettar" },
  { id: 89, english: "Stubborn", turkish: "İnatçı" },
  { id: 90, english: "Generous", turkish: "Cömert" },
  // Emotions
  { id: 91, english: "Anxious", turkish: "Endişeli" },
  { id: 92, english: "Enthusiastic", turkish: "Hevesli" },
  { id: 93, english: "Overwhelmed", turkish: "Bunalmış" },
  { id: 94, english: "Resilient", turkish: "Dayanıklı" },
  { id: 95, english: "Cautious", turkish: "Tedbirli" },
  // Academic
  { id: 96, english: "Evidence", turkish: "Kanıt" },
  { id: 97, english: "Theory", turkish: "Teori" },
  { id: 98, english: "Criteria", turkish: "Ölçüt" },
  { id: 99, english: "Analysis", turkish: "Analiz" },
  { id: 100, english: "Conclusion", turkish: "Çıkarım" },
  // Business & Finance
  { id: 101, english: "Revenue", turkish: "Gelir" },
  { id: 102, english: "Negotiate", turkish: "Pazarlık etmek" },
  { id: 103, english: "Investment", turkish: "Yatırım" },
  { id: 104, english: "Entrepreneur", turkish: "Girişimci" },
  { id: 105, english: "Profit", turkish: "Kâr" },
  { id: 106, english: "Budget", turkish: "Bütçe" },
  { id: 107, english: "Bankruptcy", turkish: "İflas" },
  { id: 108, english: "Inflation", turkish: "Enflasyon" },
  { id: 109, english: "Demand", turkish: "Talep" },
  { id: 110, english: "Supply", turkish: "Arz" },
  // Technology
  { id: 111, english: "Algorithm", turkish: "Algoritma" },
  { id: 112, english: "Database", turkish: "Veritabanı" },
  { id: 113, english: "Bandwidth", turkish: "Bant genişliği" },
  { id: 114, english: "Encryption", turkish: "Şifreleme" },
  { id: 115, english: "Interface", turkish: "Arayüz" },
  { id: 116, english: "Artificial", turkish: "Yapay" },
  { id: 117, english: "Device", turkish: "Cihaz" },
  { id: 118, english: "Software", turkish: "Yazılım" },
  { id: 119, english: "Hardware", turkish: "Donanım" },
  { id: 120, english: "Network", turkish: "Ağ" },
  // Nature & Science
  { id: 121, english: "Ecosystem", turkish: "Ekosistem" },
  { id: 122, english: "Species", turkish: "Tür" },
  { id: 123, english: "Climate", turkish: "İklim" },
  { id: 124, english: "Drought", turkish: "Kuraklık" },
  { id: 125, english: "Earthquake", turkish: "Deprem" },
  { id: 126, english: "Pollution", turkish: "Kirlilik" },
  { id: 127, english: "Renewable", turkish: "Yenilenebilir" },
  { id: 128, english: "Sustainable", turkish: "Sürdürülebilir" },
  { id: 129, english: "Oxygen", turkish: "Oksijen" },
  { id: 130, english: "Gravity", turkish: "Yerçekimi" },
  // Law & Society
  { id: 131, english: "Legislation", turkish: "Mevzuat" },
  { id: 132, english: "Constitution", turkish: "Anayasa" },
  { id: 133, english: "Democracy", turkish: "Demokrasi" },
  { id: 134, english: "Justice", turkish: "Adalet" },
  { id: 135, english: "Citizenship", turkish: "Vatandaşlık" },
  { id: 136, english: "Authority", turkish: "Otorite" },
  { id: 137, english: "Welfare", turkish: "Refah" },
  { id: 138, english: "Immigration", turkish: "Göç" },
  { id: 139, english: "Inequality", turkish: "Eşitsizlik" },
  { id: 140, english: "Prejudice", turkish: "Önyargı" },
  // Education
  { id: 141, english: "Curriculum", turkish: "Müfredat" },
  { id: 142, english: "Scholarship", turkish: "Burs" },
  { id: 143, english: "Diploma", turkish: "Diploma" },
  { id: 144, english: "Lecture", turkish: "Ders/Konferans" },
  { id: 145, english: "Assignment", turkish: "Ödev" },
  { id: 146, english: "Semester", turkish: "Dönem" },
  { id: 147, english: "Literacy", turkish: "Okuryazarlık" },
  { id: 148, english: "Graduate", turkish: "Mezun" },
  { id: 149, english: "Faculty", turkish: "Fakülte" },
  { id: 150, english: "Tuition", turkish: "Öğrenim ücreti" },
  // Food & Kitchen
  { id: 151, english: "Ingredient", turkish: "Malzeme" },
  { id: 152, english: "Beverage", turkish: "İçecek" },
  { id: 153, english: "Appetite", turkish: "İştah" },
  { id: 154, english: "Cuisine", turkish: "Mutfak kültürü" },
  { id: 155, english: "Nutrition", turkish: "Beslenme" },
  { id: 156, english: "Flavor", turkish: "Lezzet" },
  { id: 157, english: "Portion", turkish: "Porsiyon" },
  { id: 158, english: "Recipe", turkish: "Tarif" },
  { id: 159, english: "Spice", turkish: "Baharat" },
  { id: 160, english: "Harvest", turkish: "Hasat" },
  // Personality & Character
  { id: 161, english: "Courageous", turkish: "Cesur" },
  { id: 162, english: "Humble", turkish: "Alçakgönüllü" },
  { id: 163, english: "Sincere", turkish: "Samimi" },
  { id: 164, english: "Selfish", turkish: "Bencil" },
  { id: 165, english: "Loyal", turkish: "Sadık" },
  { id: 166, english: "Arrogant", turkish: "Kibirli" },
  { id: 167, english: "Curious", turkish: "Meraklı" },
  { id: 168, english: "Patient", turkish: "Sabırlı" },
  { id: 169, english: "Jealous", turkish: "Kıskanç" },
  { id: 170, english: "Honest", turkish: "Dürüst" },
  // More phrasal verbs
  { id: 171, english: "Set up", turkish: "Kurmak/Hazırlamak" },
  { id: 172, english: "Look into", turkish: "Araştırmak" },
  { id: 173, english: "Get along", turkish: "İyi geçinmek" },
  { id: 174, english: "Take over", turkish: "Devralmak" },
  { id: 175, english: "Hold on", turkish: "Beklemek/Dayanmak" },
  { id: 176, english: "Make up", turkish: "Uydurmak/Barışmak" },
  { id: 177, english: "Point out", turkish: "Belirtmek" },
  { id: 178, english: "Bring up", turkish: "Gündeme getirmek" },
  { id: 179, english: "Pass away", turkish: "Vefat etmek" },
  { id: 180, english: "Show off", turkish: "Hava atmak" },
  // Health & Body
  { id: 181, english: "Immune", turkish: "Bağışık" },
  { id: 182, english: "Allergy", turkish: "Alerji" },
  { id: 183, english: "Surgery", turkish: "Ameliyat" },
  { id: 184, english: "Vaccine", turkish: "Aşı" },
  { id: 185, english: "Infection", turkish: "Enfeksiyon" },
  { id: 186, english: "Fatigue", turkish: "Yorgunluk" },
  { id: 187, english: "Therapy", turkish: "Terapi" },
  { id: 188, english: "Chronic", turkish: "Kronik" },
  { id: 189, english: "Remedy", turkish: "Çare" },
  { id: 190, english: "Dose", turkish: "Doz" },
  // Art & Culture
  { id: 191, english: "Exhibition", turkish: "Sergi" },
  { id: 192, english: "Masterpiece", turkish: "Başyapıt" },
  { id: 193, english: "Heritage", turkish: "Miras" },
  { id: 194, english: "Sculpture", turkish: "Heykel" },
  { id: 195, english: "Symphony", turkish: "Senfoni" },
  { id: 196, english: "Manuscript", turkish: "El yazması" },
  { id: 197, english: "Tragedy", turkish: "Trajedi" },
  { id: 198, english: "Genre", turkish: "Tür/Janr" },
  { id: 199, english: "Portrait", turkish: "Portre" },
  { id: 200, english: "Audience", turkish: "Seyirci" },
]

const PAIRS_PER_SET = 6

// Fisher-Yates shuffle for true randomness
function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function WordMatch() {
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

  // Ensure no duplicate english or turkish strings end up in the same round
  const selectUniquePairs = (pool: WordPair[], count: number): WordPair[] => {
    const shuffled = shuffle(pool)
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
    const available = wordPairs.filter(p => !usedIds.has(p.id))

    let selectedPairs: WordPair[]
    if (available.length < PAIRS_PER_SET) {
      setUsedIds(new Set())
      selectedPairs = selectUniquePairs(wordPairs, PAIRS_PER_SET)
    } else {
      selectedPairs = selectUniquePairs(available, PAIRS_PER_SET)
    }

    setGamePairs(selectedPairs)
    setEnglishWords(shuffle(selectedPairs.map(p => p.english)))
    setTurkishWords(shuffle(selectedPairs.map(p => p.turkish)))
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

    const available = wordPairs.filter(p => !newUsedIds.has(p.id))

    let selectedPairs: WordPair[]
    if (available.length < PAIRS_PER_SET) {
      setUsedIds(new Set())
      selectedPairs = selectUniquePairs(wordPairs, PAIRS_PER_SET)
    } else {
      selectedPairs = selectUniquePairs(available, PAIRS_PER_SET)
    }

    setGamePairs(selectedPairs)
    setEnglishWords(shuffle(selectedPairs.map(p => p.english)))
    setTurkishWords(shuffle(selectedPairs.map(p => p.turkish)))
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
    startGame()
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
    startGame()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const remainingPairs = wordPairs.length - usedIds.size - gamePairs.length
  const progress = (matched.length / PAIRS_PER_SET) * 100

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Link2 className="w-5 h-5 text-violet-600" />
          <h3 className="font-serif text-lg">Eşleştirme</h3>
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
