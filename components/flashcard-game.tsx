"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, RotateCcw, Zap, ArrowRight, Share2, Check, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { playSoundEffect } from "@/components/xp-toast"
import { ShareChallenge } from "@/components/share-challenge"
import { addXp, checkAndUnlockAchievements, XP_REWARDS, markPerfectScore } from "@/lib/xp-system"

interface Flashcard {
  id: number
  english: string
  turkish: string
  category: string
}

const flashcards: Flashcard[] = [
  // Business
  { id: 1, english: "Appointment", turkish: "Randevu", category: "İş" },
  { id: 2, english: "Schedule", turkish: "Program/Takvim", category: "İş" },
  { id: 3, english: "Deadline", turkish: "Son teslim tarihi", category: "İş" },
  { id: 4, english: "Requirement", turkish: "Gereklilik", category: "İş" },
  { id: 5, english: "Determine", turkish: "Belirlemek", category: "İş" },
  { id: 6, english: "Establish", turkish: "Kurmak/Oluşturmak", category: "İş" },
  { id: 7, english: "Negotiate", turkish: "Müzakere etmek", category: "İş" },
  { id: 8, english: "Implement", turkish: "Uygulamak", category: "İş" },
  { id: 9, english: "Colleague", turkish: "İş arkadaşı", category: "İş" },
  { id: 10, english: "Proposal", turkish: "Teklif", category: "İş" },
  // General
  { id: 11, english: "Achievement", turkish: "Başarı", category: "Genel" },
  { id: 12, english: "Opportunity", turkish: "Fırsat", category: "Genel" },
  { id: 13, english: "Experience", turkish: "Deneyim", category: "Genel" },
  { id: 14, english: "Environment", turkish: "Çevre/Ortam", category: "Genel" },
  { id: 15, english: "Reasonable", turkish: "Makul/Mantıklı", category: "Genel" },
  { id: 16, english: "Available", turkish: "Müsait/Mevcut", category: "Genel" },
  { id: 17, english: "Approximately", turkish: "Yaklaşık", category: "Genel" },
  { id: 18, english: "Considerable", turkish: "Önemli/Hatırı sayılır", category: "Genel" },
  { id: 19, english: "Maintain", turkish: "Sürdürmek/Korumak", category: "Genel" },
  { id: 20, english: "Persuade", turkish: "İkna etmek", category: "Genel" },
  { id: 21, english: "Recognize", turkish: "Tanımak/Fark etmek", category: "Genel" },
  { id: 22, english: "Sufficient", turkish: "Yeterli", category: "Genel" },
  { id: 23, english: "Obvious", turkish: "Açık/Belli", category: "Genel" },
  { id: 24, english: "Relevant", turkish: "İlgili", category: "Genel" },
  // Education
  { id: 25, english: "Improvement", turkish: "Gelişme/İyileşme", category: "Eğitim" },
  { id: 26, english: "Knowledge", turkish: "Bilgi", category: "Eğitim" },
  { id: 27, english: "Research", turkish: "Araştırma", category: "Eğitim" },
  { id: 28, english: "Examine", turkish: "İncelemek", category: "Eğitim" },
  { id: 29, english: "Analysis", turkish: "Analiz", category: "Eğitim" },
  { id: 30, english: "Conclusion", turkish: "Sonuç", category: "Eğitim" },
  { id: 31, english: "Evidence", turkish: "Kanıt", category: "Eğitim" },
  { id: 32, english: "Theory", turkish: "Teori", category: "Eğitim" },
  // Advanced
  { id: 33, english: "Consequence", turkish: "Sonuç/Netice", category: "İleri" },
  { id: 34, english: "Significant", turkish: "Önemli/Anlamlı", category: "İleri" },
  { id: 35, english: "Contribute", turkish: "Katkı sağlamak", category: "İleri" },
  { id: 36, english: "Appropriate", turkish: "Uygun", category: "İleri" },
  { id: 37, english: "Circumstances", turkish: "Koşullar/Şartlar", category: "İleri" },
  { id: 38, english: "Distinguish", turkish: "Ayırt etmek", category: "İleri" },
  { id: 39, english: "Inevitable", turkish: "Kaçınılmaz", category: "İleri" },
  { id: 40, english: "Perspective", turkish: "Bakış açısı", category: "İleri" },
  // Extra
  { id: 41, english: "Compromise", turkish: "Uzlaşma", category: "İleri" },
  { id: 42, english: "Elaborate", turkish: "Detaylandırmak", category: "İleri" },
  { id: 43, english: "Resilient", turkish: "Dayanıklı", category: "İleri" },
  { id: 44, english: "Ambiguous", turkish: "Belirsiz", category: "İleri" },
  { id: 45, english: "Tremendous", turkish: "Muazzam", category: "İleri" },
  // Academic
  { id: 46, english: "Hypothesis", turkish: "Hipotez/Varsayım", category: "Akademik" },
  { id: 47, english: "Methodology", turkish: "Yöntem bilimi", category: "Akademik" },
  { id: 48, english: "Correlation", turkish: "Korelasyon/İlişki", category: "Akademik" },
  { id: 49, english: "Empirical", turkish: "Deneysel/Ampirik", category: "Akademik" },
  { id: 50, english: "Paradigm", turkish: "Paradigma/Model", category: "Akademik" },
  { id: 51, english: "Comprehensive", turkish: "Kapsamlı", category: "Akademik" },
  { id: 52, english: "Phenomenon", turkish: "Olgu/Fenomen", category: "Akademik" },
  { id: 53, english: "Scrutinize", turkish: "Dikkatle incelemek", category: "Akademik" },
  // Daily Life
  { id: 54, english: "Commute", turkish: "İşe gidip gelmek", category: "Günlük" },
  { id: 55, english: "Postpone", turkish: "Ertelemek", category: "Günlük" },
  { id: 56, english: "Reluctant", turkish: "İsteksiz/Gönülsüz", category: "Günlük" },
  { id: 57, english: "Thorough", turkish: "Kapsamlı/Titiz", category: "Günlük" },
  { id: 58, english: "Overwhelm", turkish: "Bunaltmak", category: "Günlük" },
  { id: 59, english: "Genuine", turkish: "Gerçek/Samimi", category: "Günlük" },
  { id: 60, english: "Anticipate", turkish: "Öngörmek/Beklemek", category: "Günlük" },
  { id: 61, english: "Substantial", turkish: "Önemli/Ciddi", category: "Günlük" },
  // Exam Vocabulary
  { id: 62, english: "Obsolete", turkish: "Modası geçmiş/Eskimiş", category: "Sınav" },
  { id: 63, english: "Plausible", turkish: "Makul/İnandırıcı", category: "Sınav" },
  { id: 64, english: "Detrimental", turkish: "Zararlı/Olumsuz", category: "Sınav" },
  { id: 65, english: "Arbitrary", turkish: "Keyfi/Rastgele", category: "Sınav" },
  { id: 66, english: "Prevail", turkish: "Galip gelmek/Hakim olmak", category: "Sınav" },
  { id: 67, english: "Alleviate", turkish: "Hafifletmek/Azaltmak", category: "Sınav" },
  { id: 68, english: "Encompass", turkish: "Kapsamak/İçermek", category: "Sınav" },
  { id: 69, english: "Inaugurate", turkish: "Açılışını yapmak", category: "Sınav" },
  { id: 70, english: "Juxtapose", turkish: "Yan yana koymak", category: "Sınav" },
  { id: 46, english: "Adequate", turkish: "Yeterli/Uygun", category: "Genel" },
  { id: 47, english: "Hesitate", turkish: "Tereddüt etmek", category: "Genel" },
  { id: 48, english: "Peculiar", turkish: "Tuhaf/Kendine özgü", category: "İleri" },
  // Medical / OET
  { id: 49, english: "Diagnosis", turkish: "Tanı/Teşhis", category: "Tıp" },
  { id: 50, english: "Symptom", turkish: "Belirti", category: "Tıp" },
  { id: 51, english: "Prescription", turkish: "Reçete", category: "Tıp" },
  { id: 52, english: "Treatment", turkish: "Tedavi", category: "Tıp" },
  { id: 53, english: "Surgery", turkish: "Ameliyat", category: "Tıp" },
  { id: 54, english: "Infection", turkish: "Enfeksiyon", category: "Tıp" },
  { id: 55, english: "Recovery", turkish: "İyileşme", category: "Tıp" },
  { id: 56, english: "Chronic", turkish: "Kronik", category: "Tıp" },
  { id: 57, english: "Dosage", turkish: "Doz/Miktar", category: "Tıp" },
  { id: 58, english: "Prognosis", turkish: "Öngörü/Seyir", category: "Tıp" },
  // Academic
  { id: 59, english: "Hypothesis", turkish: "Hipotez", category: "Eğitim" },
  { id: 60, english: "Methodology", turkish: "Yöntem", category: "Eğitim" },
  { id: 61, english: "Criteria", turkish: "Ölçüt/Kriter", category: "Eğitim" },
  { id: 62, english: "Phenomenon", turkish: "Olgu/Fenomen", category: "Eğitim" },
  { id: 63, english: "Correlation", turkish: "İlişki/Korelasyon", category: "Eğitim" },
  { id: 64, english: "Variable", turkish: "Değişken", category: "Eğitim" },
  { id: 65, english: "Substantial", turkish: "Önemli miktarda", category: "Eğitim" },
  { id: 66, english: "Comprehensive", turkish: "Kapsamlı", category: "Eğitim" },
  // Business extra
  { id: 67, english: "Revenue", turkish: "Gelir", category: "İş" },
  { id: 68, english: "Budget", turkish: "Bütçe", category: "İş" },
  { id: 69, english: "Strategy", turkish: "Strateji", category: "İş" },
  { id: 70, english: "Benchmark", turkish: "Olcut/Referans noktasi", category: "İş" },
  { id: 71, english: "Collaborate", turkish: "İş birliği yapmak", category: "İş" },
  { id: 72, english: "Delegate", turkish: "Devretmek/Görevlendirmek", category: "İş" },
  { id: 73, english: "Facilitate", turkish: "Kolaylaştırmak", category: "İş" },
  { id: 74, english: "Stakeholder", turkish: "Paydaş", category: "İş" },
  // General extra
  { id: 75, english: "Vulnerable", turkish: "Savunmasız", category: "Genel" },
  { id: 76, english: "Prominent", turkish: "Önde gelen", category: "Genel" },
  { id: 77, english: "Contemplate", turkish: "Düşünmek/Tasarlamak", category: "Genel" },
  { id: 78, english: "Fluctuate", turkish: "Dalgalanmak", category: "Genel" },
  { id: 79, english: "Predominant", turkish: "Baskın/Hakim", category: "Genel" },
  { id: 80, english: "Scrutinize", turkish: "Detaylı incelemek", category: "İleri" },
  { id: 81, english: "Undermine", turkish: "Baltalamak", category: "İleri" },
  { id: 82, english: "Encompass", turkish: "Kapsamak", category: "İleri" },
  { id: 83, english: "Exacerbate", turkish: "Kötü hale getirmek", category: "İleri" },
  { id: 84, english: "Meticulous", turkish: "Titiz/Özenli", category: "İleri" },
  // Daily life
  { id: 85, english: "Groceries", turkish: "Market alışverişi", category: "Genel" },
  { id: 86, english: "Receipt", turkish: "Fiş/Makbuz", category: "Genel" },
  { id: 87, english: "Neighborhood", turkish: "Mahalle", category: "Genel" },
  { id: 88, english: "Commute", turkish: "İşe gidip gelme", category: "Genel" },
  { id: 89, english: "Appliance", turkish: "Ev aleti", category: "Genel" },
  { id: 90, english: "Landlord", turkish: "Ev sahibi", category: "Genel" },
  // Travel
  { id: 91, english: "Itinerary", turkish: "Seyahat planı", category: "Genel" },
  { id: 92, english: "Departure", turkish: "Kalkış", category: "Genel" },
  { id: 93, english: "Accommodation", turkish: "Konaklama", category: "Genel" },
  { id: 94, english: "Customs", turkish: "Gümrük", category: "Genel" },
  { id: 95, english: "Currency", turkish: "Para birimi", category: "Genel" },
  { id: 96, english: "Boarding pass", turkish: "Biniş kartı", category: "Genel" },
  // Emotions & personality
  { id: 97, english: "Enthusiastic", turkish: "Hevesli/Coşkulu", category: "İleri" },
  { id: 98, english: "Stubborn", turkish: "İnatçı", category: "İleri" },
  { id: 99, english: "Generous", turkish: "Cömert", category: "İleri" },
  { id: 100, english: "Anxious", turkish: "Endişeli/Kaygılı", category: "İleri" },
  { id: 101, english: "Grateful", turkish: "Minnettar", category: "İleri" },
  { id: 102, english: "Overwhelmed", turkish: "Bunalmış", category: "İleri" },
  // Tech & modern
  { id: 103, english: "Algorithm", turkish: "Algoritma", category: "Eğitim" },
  { id: 104, english: "Bandwidth", turkish: "Bant genişliği", category: "İş" },
  { id: 105, english: "Encryption", turkish: "Şifreleme", category: "İş" },
  { id: 106, english: "Interface", turkish: "Arayüz", category: "İş" },
  // Phrasal verbs
  { id: 107, english: "Give up", turkish: "Vazgeçmek", category: "İleri" },
  { id: 108, english: "Look forward to", turkish: "Dört gözle beklemek", category: "İleri" },
  { id: 109, english: "Put off", turkish: "Ertelemek", category: "İleri" },
  { id: 110, english: "Turn down", turkish: "Reddetmek", category: "İleri" },
  { id: 111, english: "Figure out", turkish: "Çözmek/Anlamak", category: "İleri" },
  { id: 112, english: "Run out of", turkish: "Tükenmek/Bitmek", category: "İleri" },
]

const CARDS_PER_SET = 8

const categoryColors: Record<string, { bg: string; text: string }> = {
  "İş": { bg: "bg-blue-50", text: "text-blue-600" },
  "Genel": { bg: "bg-emerald-50", text: "text-emerald-600" },
    "Eğitim": { bg: "bg-amber-50", text: "text-amber-600" },
  "İleri": { bg: "bg-rose-50", text: "text-rose-600" },
  "Tıp": { bg: "bg-teal-50", text: "text-teal-600" },
}

export function FlashcardGame() {
  const [cards, setCards] = useState<Flashcard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [known, setKnown] = useState(0)
  const [unknown, setUnknown] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [currentSet, setCurrentSet] = useState(1)
  const [totalKnown, setTotalKnown] = useState(0)
  const [totalCards, setTotalCards] = useState(0)
  const [usedIds, setUsedIds] = useState<Set<number>>(new Set())
  const [copied, setCopied] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)

  useEffect(() => {
    startNewRound()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const startNewRound = () => {
    const available = flashcards.filter(c => !usedIds.has(c.id))

    let selected: Flashcard[]
    if (available.length < CARDS_PER_SET) {
      setUsedIds(new Set())
      selected = [...flashcards].sort(() => Math.random() - 0.5).slice(0, CARDS_PER_SET)
    } else {
      selected = [...available].sort(() => Math.random() - 0.5).slice(0, CARDS_PER_SET)
    }

    setCards(selected)
    setCurrentIndex(0)
    setIsFlipped(false)
    setKnown(0)
    setUnknown(0)
    setIsFinished(false)
    setSwipeDirection(null)
  }

  const continueGame = () => {
    const newUsedIds = new Set(usedIds)
    for (const c of cards) {
      newUsedIds.add(c.id)
    }
    setUsedIds(newUsedIds)

    setTotalKnown(prev => prev + known)
    setTotalCards(prev => prev + cards.length)
    setCurrentSet(prev => prev + 1)

    const available = flashcards.filter(c => !newUsedIds.has(c.id))

    let selected: Flashcard[]
    if (available.length < CARDS_PER_SET) {
      setUsedIds(new Set())
      selected = [...flashcards].sort(() => Math.random() - 0.5).slice(0, CARDS_PER_SET)
    } else {
      selected = [...available].sort(() => Math.random() - 0.5).slice(0, CARDS_PER_SET)
    }

    setCards(selected)
    setCurrentIndex(0)
    setIsFlipped(false)
    setKnown(0)
    setUnknown(0)
    setIsFinished(false)
    setSwipeDirection(null)
  }

  const resetGame = () => {
    setCurrentSet(1)
    setTotalKnown(0)
    setTotalCards(0)
    setUsedIds(new Set())
    setCopied(false)
    startNewRound()
  }

  const speakWord = useCallback(() => {
    if (cards.length === 0) return
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(cards[currentIndex].english)
      utterance.lang = "en-US"
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }, [cards, currentIndex])

  const shareResult = async () => {
    const finalKnown = totalKnown + known
    const finalCards = totalCards + cards.length
    const percentage = Math.round((finalKnown / finalCards) * 100)
    const text = `Kelime Kartları oyununda ${currentSet} sette ${finalCards} karttan ${finalKnown} tanesini bildim (%${percentage})! Sen de dene:`
    const url = typeof window !== "undefined" ? window.location.origin : ""

    if (navigator.share) {
      try {
        await navigator.share({ title: "Kelime Kartları Sonucum", text, url })
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

  const handleAnswer = (isKnown: boolean) => {
    setSwipeDirection(isKnown ? "right" : "left")

    setTimeout(() => {
  if (isKnown) {
  setKnown((prev) => prev + 1)
  playSoundEffect("correct")
  } else {
  setUnknown((prev) => prev + 1)
      }

      if (currentIndex < cards.length - 1) {
        setCurrentIndex((prev) => prev + 1)
        setIsFlipped(false)
        setSwipeDirection(null)
      } else {
        setIsFinished(true)
        setSwipeDirection(null)
        const updated = addXp(XP_REWARDS.flashcard_complete, "flashcard")
        if (known + (isKnown ? 1 : 0) === cards.length) markPerfectScore()
        checkAndUnlockAchievements(updated)
      }
    }, 200)
  }

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished) return
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault()
        setIsFlipped(f => !f)
      }
      if (isFlipped && e.key === "ArrowLeft") {
        handleAnswer(false)
      }
      if (isFlipped && e.key === "ArrowRight") {
        handleAnswer(true)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFlipped, isFinished, currentIndex])

  if (cards.length === 0) return null

  const currentCard = cards[currentIndex]
  const progress = ((currentIndex + (isFinished ? 1 : 0)) / cards.length) * 100
  const remainingCards = flashcards.length - usedIds.size - cards.length
  const catColor = categoryColors[currentCard.category] || categoryColors["Genel"]

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <h3 className="font-serif text-lg">Kelime Kartları</h3>
          {currentSet > 1 && <span className="text-xs text-muted-foreground">Set {currentSet}</span>}
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-emerald-600 font-medium">{known}</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-red-500 font-medium">{unknown}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-muted rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-amber-400 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {!isFinished ? (
        <>
          {/* Card */}
          <div
            className={cn(
              "transition-all duration-200",
              swipeDirection === "left" && "-translate-x-4 opacity-50",
              swipeDirection === "right" && "translate-x-4 opacity-50"
            )}
          >
            <Card
              className={cn(
                "border-2 cursor-pointer transition-all duration-300 min-h-[160px] flex items-center justify-center",
                isFlipped ? "bg-amber-50/50 border-amber-200" : "hover:border-border/80 hover:shadow-sm"
              )}
              onClick={() => setIsFlipped(!isFlipped)}
              role="button"
              tabIndex={0}
              aria-label={isFlipped ? `Cevap: ${currentCard.turkish}` : `Kelime: ${currentCard.english}`}
            >
              <CardContent className="p-6 text-center w-full">
                {!isFlipped ? (
                  <div className="animate-in fade-in duration-200">
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium inline-block mb-3", catColor.bg, catColor.text)}>
                      {currentCard.category}
                    </span>
                    <h4 className="text-2xl font-serif text-foreground">{currentCard.english}</h4>
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          speakWord()
                        }}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Kelimeyi seslendir"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <p className="text-xs text-muted-foreground">Çevirmek için tıklayın</p>
                    </div>
                  </div>
                ) : (
                  <div className="animate-in fade-in duration-200">
                    <h4 className="text-2xl font-serif text-amber-600">{currentCard.turkish}</h4>
                    <p className="text-sm text-muted-foreground mt-2">{currentCard.english}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Answer buttons */}
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              className="flex-1 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 bg-transparent h-12"
              onClick={() => handleAnswer(false)}
            >
              <XCircle className="w-4 h-4 mr-2" />
                    Öğreniyorum
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 bg-transparent h-12"
              onClick={() => handleAnswer(true)}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Biliyorum
            </Button>
          </div>

          <p className="text-[10px] text-muted-foreground text-center mt-2">
            Boş tuşuna basarak çevirin, ok tuşlarıyla yanıt verin
          </p>
        </>
      ) : (
        <Card className="border border-border/50 overflow-hidden rounded-lg">
          <div className="bg-amber-50 py-3 text-center">
            <Zap className="w-8 h-8 text-amber-500 mx-auto mb-1" />
            <h4 className="font-serif text-xl">Set Tamamlandı!</h4>
          </div>
          <CardContent className="p-5">
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="text-center p-3 rounded-xl bg-emerald-50">
                <div className="text-2xl font-bold text-emerald-600">{known}</div>
                <div className="text-[10px] text-emerald-600/70">Biliyorum</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-red-50">
                <div className="text-2xl font-bold text-red-500">{unknown}</div>
                    <div className="text-[10px] text-red-500/70">Öğreniyorum</div>
              </div>
            </div>

            <div className="flex justify-center gap-1 mb-5">
              {Array.from({ length: CARDS_PER_SET }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-6 h-2 rounded-full",
                    i < known ? "bg-emerald-400" : "bg-red-300"
                  )}
                />
              ))}
            </div>

            {currentSet > 1 && (
              <div className="text-center text-sm text-muted-foreground mb-4 py-2 border-t border-b border-dashed">
                Toplam: {totalKnown + known}/{totalCards + cards.length} bilinen
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Button onClick={continueGame} className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                <ArrowRight className="w-4 h-4 mr-2" />
                Devam Et ({remainingCards > 0 ? `${remainingCards} kart kaldı` : "Baştan"})
              </Button>
                <div className="mt-2 pt-3 border-t border-border/50">
                  <ShareChallenge
                    title="Kelime Kartları Sonucum"
                    scoreText={`Kelime Kartlarında %${Math.round(((totalKnown + known) / (totalCards + cards.length)) * 100)} başarı! ${totalKnown + known}/${totalCards + cards.length} kelimeyi bildim.`}
                    challengeText="Kelime bilgini test etmeye hazır mısın?"
                    toolSlug="flashcards"
                    challengeScore={totalKnown + known}
                    challengeTotal={totalCards + cards.length}
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
