"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useState, useMemo, useCallback, useEffect, type ComponentType } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Swords, Trophy, ArrowRight, CheckCircle2, XCircle, ArrowLeft,
  Share2, MessageCircle, Send, Copy, Check, Flame, Crown,
  Timer, GraduationCap, LayoutGrid, Skull, Snowflake,
  CalendarDays, BookMarked, Search, AlertTriangle, Repeat,
  Shuffle, PenTool, Ear, FileText, Zap, BookOpen, Mic
} from "lucide-react"
import { cn } from "@/lib/utils"
import { decodeChallengeData, seededPick, type ChallengeData } from "@/lib/challenge"
import { addXp, XP_REWARDS } from "@/lib/xp-system"
import { showXpToast } from "@/components/xp-toast"
import Image from "next/image"
import Link from "next/link"

// Game component imports
import { BlitzChallenge } from "@/components/blitz-challenge"
import { CollocationsQuiz } from "@/components/collocations-quiz"
import { ContextClues } from "@/components/context-clues"
import { ErrorSpotting } from "@/components/error-spotting"
import { WordFormation } from "@/components/word-formation"
import { SentenceTransform } from "@/components/sentence-transform"
import { SentenceBuilder } from "@/components/sentence-builder"
import { ExamPractice } from "@/components/exam-practice"
import { WordleGame } from "@/components/wordle-game"
import { HangmanGame } from "@/components/hangman-game"
import { SnowflakeChallenge } from "@/components/snowflake-challenge"
import { DailyChallenge } from "@/components/daily-challenge"
import { MinimalPairs } from "@/components/minimal-pairs"
import { ClozeTest } from "@/components/cloze-test"
import { TimedReading } from "@/components/timed-reading"
import { GrammarCards } from "@/components/grammar-cards"
import { FlashcardGame } from "@/components/flashcard-game"
import { WordMatch } from "@/components/word-match"
import { SpeakingQuiz } from "@/components/speaking-quiz"
import { ScooterRide } from "@/components/scooter-ride"

// ---- Challenge game definitions ----
type GameId = string

interface ChallengeGame {
  id: GameId
  label: string
  desc: string
  icon: ComponentType<{ className?: string }>
  color: string
  bg: string
  accent: string
}

const CHALLENGE_GAMES: ChallengeGame[] = [
  { id: "daily", label: "Gunun Challenge'ı", desc: "Her gun 10 soru, herkese aynı", icon: CalendarDays, color: "text-red-600", bg: "bg-red-50", accent: "border-red-200 hover:border-red-300" },
  { id: "blitz", label: "Blitz Challenge", desc: "60 saniye, karışık sorular", icon: Timer, color: "text-orange-600", bg: "bg-orange-50", accent: "border-orange-200 hover:border-orange-300" },
  { id: "speaking", label: "Accent Challenge", desc: "11 profil ile aksanını analiz et", icon: Mic, color: "text-primary", bg: "bg-primary/5", accent: "border-primary/30 hover:border-primary/50" },
  { id: "snowchallenge", label: "Kar Fırtınası", desc: "Kar erimeden cevapla", icon: Snowflake, color: "text-sky-600", bg: "bg-sky-50", accent: "border-sky-200 hover:border-sky-300" },
  { id: "collocation", label: "Collocations", desc: "Doğru kelime eşleşmelerini bul", icon: BookMarked, color: "text-indigo-600", bg: "bg-indigo-50", accent: "border-indigo-200 hover:border-indigo-300" },
  { id: "context", label: "Bağlamdan Anlam", desc: "Cümleden anlamı çıkar", icon: Search, color: "text-teal-600", bg: "bg-teal-50", accent: "border-teal-200 hover:border-teal-300" },
  { id: "error", label: "Hata Bul", desc: "Cümledeki hatayı yakala", icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50", accent: "border-rose-200 hover:border-rose-300" },
  { id: "formation", label: "Kelime Turetme", desc: "Kelime kökünden türet", icon: PenTool, color: "text-violet-600", bg: "bg-violet-50", accent: "border-violet-200 hover:border-violet-300" },
  { id: "transform", label: "Cümle Dönüştürme", desc: "Cümleyi farklı yapıya çevir", icon: Repeat, color: "text-cyan-600", bg: "bg-cyan-50", accent: "border-cyan-200 hover:border-cyan-300" },
  { id: "sentence", label: "Cümle Kur", desc: "Kelimeleri doğru sıraya diz", icon: Shuffle, color: "text-lime-600", bg: "bg-lime-50", accent: "border-lime-200 hover:border-lime-300" },
  { id: "exam", label: "Sınav Pratiği", desc: "YDS, YÖKDİL, IELTS, TOEFL", icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-50", accent: "border-blue-200 hover:border-blue-300" },
  { id: "wordle", label: "Wordle", desc: "5 harfli kelimeyi bul", icon: LayoutGrid, color: "text-emerald-600", bg: "bg-emerald-50", accent: "border-emerald-200 hover:border-emerald-300" },
  { id: "hangman", label: "Adam Asmaca", desc: "Kelimeyi harflerle bul", icon: Skull, color: "text-purple-600", bg: "bg-purple-50", accent: "border-purple-200 hover:border-purple-300" },
  { id: "minimal", label: "Minimal Pairs", desc: "Benzer sesleri ayırt et", icon: Ear, color: "text-pink-600", bg: "bg-pink-50", accent: "border-pink-200 hover:border-pink-300" },
  { id: "cloze", label: "Boşluk Doldur", desc: "Paragraftaki boşlukları tamamla", icon: FileText, color: "text-amber-600", bg: "bg-amber-50", accent: "border-amber-200 hover:border-amber-300" },
  { id: "grammar", label: "Gramer Kartları", desc: "Gramer kurallarını pekiştir", icon: BookOpen, color: "text-green-600", bg: "bg-green-50", accent: "border-green-200 hover:border-green-300" },
  { id: "flashcard", label: "Kelime Kartları", desc: "Flashcard ile kelime öğren", icon: Zap, color: "text-yellow-600", bg: "bg-yellow-50", accent: "border-yellow-200 hover:border-yellow-300" },
  { id: "match", label: "Kelime Eşleştir", desc: "İngilizce-Türkçe eşle", icon: Shuffle, color: "text-fuchsia-600", bg: "bg-fuchsia-50", accent: "border-fuchsia-200 hover:border-fuchsia-300" },
  { id: "reading", label: "Hızlı Okuma", desc: "Zamana karşı oku ve anla", icon: Timer, color: "text-stone-600", bg: "bg-stone-50", accent: "border-stone-200 hover:border-stone-300" },
  { id: "scooter", label: "Scooter Ride", desc: "Cevapla, scooter'i sur!", icon: Zap, color: "text-blue-600", bg: "bg-blue-50", accent: "border-blue-200 hover:border-blue-300" },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GAME_COMPONENTS: Record<string, ComponentType<any>> = {
  daily: DailyChallenge,
  blitz: BlitzChallenge,
  speaking: SpeakingQuiz,
  snowchallenge: SnowflakeChallenge,
  collocation: CollocationsQuiz,
  context: ContextClues,
  error: ErrorSpotting,
  formation: WordFormation,
  transform: SentenceTransform,
  sentence: SentenceBuilder,
  exam: ExamPractice,
  wordle: WordleGame,
  hangman: HangmanGame,
  minimal: MinimalPairs,
  cloze: ClozeTest,
  grammar: GrammarCards,
  flashcard: FlashcardGame,
  match: WordMatch,
  reading: TimedReading,
  scooter: ScooterRide,
}

// ---- Hub component (no ?d= param) ----
function ChallengesHub() {
  const searchParams = useSearchParams()
  const [activeGame, setActiveGame] = useState<string | null>(null)
  const [animatingOut, setAnimatingOut] = useState(false)

  // Auto-open game from ?game= query param
  useEffect(() => {
    const gameParam = searchParams.get("game")
    if (gameParam && GAME_COMPONENTS[gameParam]) {
      setActiveGame(gameParam)
    }
  }, [searchParams])

  const goBack = useCallback(() => {
    setAnimatingOut(true)
    setTimeout(() => { setActiveGame(null); setAnimatingOut(false) }, 200)
  }, [])

  const activeItem = activeGame ? CHALLENGE_GAMES.find(g => g.id === activeGame) : null
  const ActiveComponent = activeGame ? GAME_COMPONENTS[activeGame] : null

  // If a game is active, show it inline
  if (activeGame && ActiveComponent && activeItem) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={goBack}
            className={cn(
              "flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4",
              animatingOut && "opacity-0"
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            Tum Challenge'lara Dön
          </button>
          <div className={cn(
            "transition-all duration-200",
            animatingOut ? "opacity-0 scale-95" : "opacity-100 scale-100"
          )}>
            <ActiveComponent onBack={goBack} />
          </div>
        </div>
      </div>
    )
  }

  // Hub grid
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Swords className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground text-balance">Meydan Oku</h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Bir challenge seç, çöz ve sonunda arkadaşlarına aynı soruları gönder. Onlar da aynı soruları çözsün -- kimin daha iyi olduğunu görün!
          </p>
        </div>

        {/* How it works */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <div className="flex-1 flex items-center gap-3 p-4 rounded-xl bg-muted/40 border border-border/50">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold shrink-0">1</span>
            <div>
              <p className="text-sm font-semibold text-foreground">Challenge Seç</p>
              <p className="text-xs text-muted-foreground">Aşağıdaki oyunlardan birini seç</p>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-3 p-4 rounded-xl bg-muted/40 border border-border/50">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold shrink-0">2</span>
            <div>
              <p className="text-sm font-semibold text-foreground">Çöz ve Skor Al</p>
              <p className="text-xs text-muted-foreground">Soruları cevapla, skorunu gör</p>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-3 p-4 rounded-xl bg-muted/40 border border-border/50">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold shrink-0">3</span>
            <div>
              <p className="text-sm font-semibold text-foreground">Meydan Oku!</p>
              <p className="text-xs text-muted-foreground">Aynı soruları arkadaşlarına gönder</p>
            </div>
          </div>
        </div>

        {/* Games grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {CHALLENGE_GAMES.map((game) => {
            const Icon = game.icon
            return (
              <button
                key={game.id}
                onClick={() => setActiveGame(game.id)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer bg-background",
                  game.accent
                )}
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", game.bg)}>
                  <Icon className={cn("w-5 h-5", game.color)} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-tight">{game.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{game.desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ---- Question pool for incoming challenges ----
interface ChallengeQuestion {
  question: string
  options: string[]
  correct: number
  type: string
}

const QUESTION_POOL: ChallengeQuestion[] = [
  // Grammar
  { type: "Gramer", question: "She _____ English for three years before moving abroad.", options: ["studied", "had studied", "has studied", "studies"], correct: 1 },
  { type: "Gramer", question: "If I _____ you, I would take the offer.", options: ["am", "was", "were", "be"], correct: 2 },
  { type: "Gramer", question: "By this time tomorrow, we _____ in Paris.", options: ["arrive", "will arrive", "will have arrived", "arriving"], correct: 2 },
  { type: "Gramer", question: "He suggested _____ to the cinema.", options: ["to go", "going", "go", "gone"], correct: 1 },
  { type: "Gramer", question: "The book _____ by millions of people worldwide.", options: ["has read", "has been read", "is reading", "was reading"], correct: 1 },
  { type: "Gramer", question: "I wish I _____ more time to study last week.", options: ["have", "had", "had had", "would have"], correct: 2 },
  { type: "Gramer", question: "She _____ TV when the doorbell rang.", options: ["watches", "watched", "was watching", "has watched"], correct: 2 },
  { type: "Gramer", question: "Neither the manager _____ the employees were available.", options: ["or", "nor", "and", "but"], correct: 1 },
  { type: "Gramer", question: "He admitted _____ the mistake.", options: ["make", "to make", "making", "made"], correct: 2 },
  { type: "Gramer", question: "The meeting _____ by the time we arrived.", options: ["started", "has started", "had started", "starts"], correct: 2 },
  { type: "Gramer", question: "You _____ see a doctor immediately.", options: ["should", "can", "may", "would"], correct: 0 },
  { type: "Gramer", question: "She asked me where I _____.", options: ["live", "lived", "am living", "do live"], correct: 1 },
  // Vocabulary
  { type: "Kelime", question: "'Reluctant' ne demek?", options: ["İstekli", "Gönülsüz/isteksiz", "Korkak", "Aceleci"], correct: 1 },
  { type: "Kelime", question: "'Thrive' ne demek?", options: ["Küçülmek", "Gerilemek", "Gelişmek/büyümek", "Durmak"], correct: 2 },
  { type: "Kelime", question: "'Obsolete' ne demek?", options: ["Modern", "Kullanım dışı", "Yeni", "Pahalı"], correct: 1 },
  { type: "Kelime", question: "'Meticulous' ne demek?", options: ["Dikkatsiz", "Titiz/özenli", "Tembel", "Yavaş"], correct: 1 },
  { type: "Kelime", question: "'Ambiguous' ne demek?", options: ["Net", "Belirsiz/iki anlamlı", "Kesin", "Basit"], correct: 1 },
  { type: "Kelime", question: "'Benevolent' ne demek?", options: ["Zalim", "Kayıtsız", "Hayırsever/iyi niyetli", "Güçlü"], correct: 2 },
  { type: "Kelime", question: "'Pragmatic' ne demek?", options: ["Hayalci", "Duygusal", "Pratik/gerçekçi", "Teorik"], correct: 2 },
  { type: "Kelime", question: "'Elaborate' ne demek?", options: ["Basit", "Detaylı/kapsamlı", "Kısa", "Kolay"], correct: 1 },
  { type: "Kelime", question: "'Plausible' ne demek?", options: ["İmkansız", "İnandırıcı/makul", "Saçma", "Kesin"], correct: 1 },
  { type: "Kelime", question: "'Unanimous' ne demek?", options: ["Bölünmüş", "Oybirliğiyle", "Belirsiz", "Kararsız"], correct: 1 },
  { type: "Kelime", question: "'Notorious' ne demek?", options: ["Meşhur", "Kötü şöhretle anılan", "Bilinmeyen", "Saygın"], correct: 1 },
  { type: "Kelime", question: "'Fluctuate' ne demek?", options: ["Sabit kalmak", "Dalgalanmak", "Artmak", "Azalmak"], correct: 1 },
  // Collocations
  { type: "Kollokasyon", question: "She _____ an effort to help everyone.", options: ["did", "made", "took", "gave"], correct: 1 },
  { type: "Kollokasyon", question: "Please _____ a seat.", options: ["make", "do", "take", "get"], correct: 2 },
  { type: "Kollokasyon", question: "He always _____ his promises.", options: ["makes", "does", "keeps", "takes"], correct: 2 },
  { type: "Kollokasyon", question: "The company _____ a profit last year.", options: ["did", "made", "got", "took"], correct: 1 },
  { type: "Kollokasyon", question: "They _____ a risk by investing early.", options: ["made", "did", "took", "gave"], correct: 2 },
  { type: "Kollokasyon", question: "Can you _____ me a favor?", options: ["make", "do", "give", "take"], correct: 1 },
  { type: "Kollokasyon", question: "He _____ a deep breath before speaking.", options: ["did", "made", "took", "gave"], correct: 2 },
  { type: "Kollokasyon", question: "She _____ a good impression on the interviewer.", options: ["did", "made", "gave", "took"], correct: 1 },
  { type: "Kollokasyon", question: "The students _____ notes during the lecture.", options: ["made", "did", "took", "gave"], correct: 2 },
  { type: "Kollokasyon", question: "We need to _____ a decision by tomorrow.", options: ["do", "make", "take", "give"], correct: 1 },
  { type: "Kollokasyon", question: "He _____ the blame for the team's failure.", options: ["made", "did", "took", "gave"], correct: 2 },
  { type: "Kollokasyon", question: "She _____ a career change at forty.", options: ["did", "made", "took", "had"], correct: 1 },
  // Grammar - Extra
  { type: "Gramer", question: "By next June, she _____ here for five years.", options: ["works", "will work", "will have worked", "is working"], correct: 2 },
  { type: "Gramer", question: "Had she studied more, she _____ the exam.", options: ["passes", "passed", "would pass", "would have passed"], correct: 3 },
  { type: "Gramer", question: "Not only _____ he late, but he was also rude.", options: ["he was", "was he", "he is", "is he"], correct: 1 },
  { type: "Gramer", question: "It is essential that every student _____ the rules.", options: ["follows", "follow", "following", "followed"], correct: 1 },
  { type: "Gramer", question: "The more you practice, _____ you become.", options: ["better", "the better", "best", "the best"], correct: 1 },
  { type: "Gramer", question: "She denied _____ the vase.", options: ["break", "to break", "breaking", "broken"], correct: 2 },
  { type: "Gramer", question: "I'd rather you _____ smoke in the house.", options: ["don't", "didn't", "won't", "haven't"], correct: 1 },
  { type: "Gramer", question: "It's high time we _____ something about pollution.", options: ["do", "did", "have done", "will do"], correct: 1 },
  { type: "Gramer", question: "He avoided _____ the difficult question.", options: ["answer", "answering", "to answer", "answered"], correct: 1 },
  { type: "Gramer", question: "_____ the heavy rain, the match continued.", options: ["Although", "Despite", "However", "Because"], correct: 1 },
  { type: "Gramer", question: "She is _____ to have left the country.", options: ["believed", "believes", "believing", "believe"], correct: 0 },
  { type: "Gramer", question: "Only after the meeting _____ he realize his mistake.", options: ["does", "did", "was", "had"], correct: 1 },
  // Vocabulary - Extra
  { type: "Kelime", question: "'Inevitable' ne demek?", options: ["Mümkün", "Kaçınılmaz", "Beklenmedik", "Önemli"], correct: 1 },
  { type: "Kelime", question: "'Accomplish' ne demek?", options: ["Başlamak", "Başarmak", "Bitirmek", "Denemek"], correct: 1 },
  { type: "Kelime", question: "'Adequate' ne demek?", options: ["Mükemmel", "Yetersiz", "Yeterli", "Fazla"], correct: 2 },
  { type: "Kelime", question: "'Comprehensive' ne demek?", options: ["Kısıtlı", "Basit", "Kapsamlı", "Anlaşılır"], correct: 2 },
  { type: "Kelime", question: "'Deteriorate' ne demek?", options: ["Gelişmek", "Kötüye gitmek", "Değişmek", "Durmak"], correct: 1 },
  { type: "Kelime", question: "'Enhance' ne demek?", options: ["Azaltmak", "Bozmak", "Geliştirmek", "Değiştirmek"], correct: 2 },
  { type: "Kelime", question: "'Perceive' ne demek?", options: ["Algılamak", "Görmezden gelmek", "Reddetmek", "Kabul etmek"], correct: 0 },
  { type: "Kelime", question: "'Surplus' ne demek?", options: ["Eksik", "Yeterli", "Fazla/Artık", "Dengeli"], correct: 2 },
  { type: "Kelime", question: "'Simultaneously' ne demek?", options: ["Sırayla", "Aynı anda", "Sonradan", "Önceden"], correct: 1 },
  { type: "Kelime", question: "'Consequence' ne demek?", options: ["Neden", "Önem", "Sonuç", "Kural"], correct: 2 },
  { type: "Kelime", question: "'Resilient' ne demek?", options: ["Kırılgan", "Dayanıklı", "Zayıf", "Hızlı"], correct: 1 },
  { type: "Kelime", question: "'Scrutinize' ne demek?", options: ["Görmezden gelmek", "Dikkatle incelemek", "Hızlıca bakmak", "Reddetmek"], correct: 1 },
  // Phrasal Verbs
  { type: "Deyim", question: "'To give up' ne demek?", options: ["Başlamak", "Vazgeçmek", "Devam etmek", "Bitirmek"], correct: 1 },
  { type: "Deyim", question: "'To come up with' ne demek?", options: ["Çıkmak", "Üretmek/Bulmak", "Gelmek", "Karşılaşmak"], correct: 1 },
  { type: "Deyim", question: "'To put off' ne demek?", options: ["Giymek", "Çıkarmak", "Ertelemek", "Açmak"], correct: 2 },
  { type: "Deyim", question: "'To carry out' ne demek?", options: ["Taşımak", "Gerçekleştirmek", "Çıkmak", "Çıkarmak"], correct: 1 },
  { type: "Deyim", question: "'To figure out' ne demek?", options: ["Hesaplamak", "Çözmek/Anlamak", "Saymak", "Çıkmak"], correct: 1 },
  { type: "Deyim", question: "'To run out of' ne demek?", options: ["Koşmak", "Tükenmek", "Kaçmak", "Devam etmek"], correct: 1 },
  { type: "Deyim", question: "'To break down' ne demek?", options: ["Kırmak", "Bozulmak/Çökmek", "Parçalamak", "Ayırmak"], correct: 1 },
  { type: "Deyim", question: "'To look forward to' ne demek?", options: ["Geri bakmak", "Dört gözle beklemek", "Aramak", "Görmezden gelmek"], correct: 1 },
  { type: "Deyim", question: "'To turn down' ne demek?", options: ["Açmak", "Kabul etmek", "Reddetmek", "Yükseltmek"], correct: 2 },
  { type: "Deyim", question: "'To bring up' ne demek?", options: ["Getirmek", "Gündeme getirmek/Yetiştirmek", "İndirmek", "Almak"], correct: 1 },
  // Kollokasyon - Extra
  { type: "Kollokasyon", question: "He _____ a speech at the graduation ceremony.", options: ["made", "gave", "did", "told"], correct: 1 },
  { type: "Kollokasyon", question: "The new policy _____ effect immediately.", options: ["made", "did", "took", "had"], correct: 2 },
  { type: "Kollokasyon", question: "We need to _____ the necessary arrangements.", options: ["do", "make", "take", "get"], correct: 1 },
  { type: "Kollokasyon", question: "She _____ a good impression on the interviewer.", options: ["did", "made", "gave", "took"], correct: 1 },
  { type: "Kollokasyon", question: "The teacher _____ a question about the assignment.", options: ["made", "raised", "did", "took"], correct: 1 },
  { type: "Kollokasyon", question: "He always _____ his word.", options: ["makes", "does", "keeps", "takes"], correct: 2 },
  { type: "Kollokasyon", question: "She _____ an apology for being late.", options: ["did", "made", "gave", "took"], correct: 1 },
  { type: "Kollokasyon", question: "The company _____ bankruptcy last month.", options: ["made", "did", "filed for", "took"], correct: 2 },
  // Bağlam (Context)
  { type: "Bağlam", question: "The teacher tried to elucidate the topic. 'Elucidate' ne demek?", options: ["Karmaşıklaştırmak", "Açıklamak", "Gizlemek", "Değiştirmek"], correct: 1 },
  { type: "Bağlam", question: "Despite his affluent background, he lived simply. 'Affluent' ne demek?", options: ["Fakir", "Zengin", "Ortalama", "Karışık"], correct: 1 },
  { type: "Bağlam", question: "The politician's eloquent speech moved the audience. 'Eloquent' ne demek?", options: ["Sıkıcı", "Etkili/güzel konuşma", "Kısa", "Karışık"], correct: 1 },
  { type: "Bağlam", question: "Her candid remarks surprised everyone. 'Candid' ne demek?", options: ["Diplomatik", "Açık sözlü", "Kapalı", "Belirsiz"], correct: 1 },
  { type: "Bağlam", question: "The frugal man saved enough to retire early. 'Frugal' ne demek?", options: ["Savurgan", "Tutumlu", "Zengin", "Lüks"], correct: 1 },
  { type: "Bağlam", question: "The ubiquitous smartphone has changed our lives. 'Ubiquitous' ne demek?", options: ["Pahalı", "Her yerde bulunan", "Eski", "Gereksiz"], correct: 1 },
]

const GAME_NAMES: Record<string, string> = {
  collocations: "Kollokasyon Quiz",
  collocation: "Collocations",
  "context-clues": "Bağlamdan Anlam",
  "error-spotting": "Hata Bul",
  "word-formation": "Kelime Türetme",
  "sentence-transform": "Cümle Dönüştürme",
  blitz: "Blitz Challenge",
  "exam-practice": "Sınav Pratiği",
  flashcards: "Flashcard",
  flashcard: "Kelime Kartları",
  "minimal-pairs": "Minimal Pairs",
  hangman: "Adam Asmaca",
  wordle: "Wordle",
  "sentence-builder": "Cümle Kurma",
  "word-match": "Kelime Eşleştir",
  "timed-reading": "Hızlı Okuma",
  daily: "Günün Challenge'ı",
}

// ---- Incoming challenge handler (with ?d= param) ----
function IncomingChallenge({ challengeData }: { challengeData: ChallengeData }) {
  const [friendName, setFriendName] = useState("")
  const [phase, setPhase] = useState<"intro" | "playing" | "result">("intro")
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [friendScore, setFriendScore] = useState(0)
  const [copied, setCopied] = useState(false)

  const questions = useMemo(() => {
    return seededPick(QUESTION_POOL, challengeData.s, challengeData.t > 0 ? Math.min(challengeData.t, 10) : 10)
  }, [challengeData])

  const handleAnswer = useCallback(
    (idx: number) => {
      if (showAnswer) return
      setSelected(idx)
      setShowAnswer(true)
      const q = questions[currentQ]
      if (q && idx === q.correct) {
        setFriendScore((prev) => prev + 1)
      }
    },
    [showAnswer, questions, currentQ]
  )

  const handleNext = useCallback(() => {
    if (currentQ + 1 >= questions.length) {
      addXp(XP_REWARDS.quizComplete, "meydan_okuma")
      showXpToast(XP_REWARDS.quizComplete, "Meydan okuma tamamlandi!")
      setPhase("result")
    } else {
      setCurrentQ((p) => p + 1)
      setSelected(null)
      setShowAnswer(false)
    }
  }, [currentQ, questions.length])

  const isDuel = challengeData.m === "duel"
  const challengerPerc = challengeData.t > 0 ? Math.round((challengeData.sc / challengeData.t) * 100) : 0
  const gameName = GAME_NAMES[challengeData.g] || challengeData.g

  // ---- INTRO ----
  if (phase === "intro") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background via-background to-muted/30">
        <Card className="max-w-md w-full shadow-xl border-primary/10">
          <CardContent className="p-8 space-y-6 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              {isDuel ? (
                <Swords className="w-8 h-8 text-primary" />
              ) : (
                <Trophy className="w-8 h-8 text-primary" />
              )}
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-serif font-bold text-foreground text-balance">
                {isDuel ? "Duello Daveti!" : "Meydan Okuma!"}
              </h1>
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">{challengeData.n}</span>{" "}
                sana {gameName} {isDuel ? "duello'sunda" : "meydan okumasında"} meydan okuyor!
              </p>
            </div>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/15 space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                {challengeData.n} skoru
              </p>
              <p className="text-3xl font-serif font-bold text-primary">
                %{challengerPerc}
              </p>
              <p className="text-xs text-muted-foreground">
                {challengeData.sc}/{challengeData.t} doğru
              </p>
            </div>

            <div className="space-y-3">
              <Input
                placeholder="Adını gir"
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setPhase("playing")}
                className="text-center bg-background"
                maxLength={20}
              />
              <Button onClick={() => setPhase("playing")} size="lg" className="w-full gap-2 text-base">
                <Flame className="w-5 h-5" />
                {isDuel ? "Duellosunu Kabul Et!" : "Meydan Okumaya Başla!"}
              </Button>
            </div>

            <Link href="/" className="block">
              <p className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                TEXT Language School
              </p>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ---- PLAYING ----
  if (phase === "playing") {
    const q = questions[currentQ]
    if (!q) return null

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="max-w-lg w-full shadow-lg">
          <CardContent className="p-6 space-y-5">
            {/* Progress */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">{currentQ + 1} / {questions.length}</span>
              <span className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-bold uppercase">{q.type}</span>
              <span className="font-medium">Skor: {friendScore}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question */}
            <h2 className="text-lg font-semibold text-foreground leading-relaxed">{q.question}</h2>

            {/* Options */}
            <div className="grid gap-2.5">
              {q.options.map((opt, idx) => {
                const isCorrect = idx === q.correct
                const isSelected = idx === selected
                let variant = "outline" as const
                let extraClass = "bg-transparent hover:bg-muted/50 text-foreground"

                if (showAnswer) {
                  if (isCorrect) {
                    extraClass = "bg-green-50 border-green-400 text-green-800"
                  } else if (isSelected && !isCorrect) {
                    extraClass = "bg-red-50 border-red-400 text-red-800"
                  } else {
                    extraClass = "opacity-50 text-muted-foreground"
                  }
                }

                return (
                  <Button
                    key={idx}
                    variant={variant}
                    onClick={() => handleAnswer(idx)}
                    disabled={showAnswer}
                    className={cn(
                      "justify-start text-left h-auto py-3 px-4 text-sm font-medium transition-all",
                      extraClass
                    )}
                  >
                    <span className="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold mr-3 shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                    {showAnswer && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 ml-auto text-green-600 shrink-0" />
                    )}
                    {showAnswer && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 ml-auto text-red-600 shrink-0" />
                    )}
                  </Button>
                )
              })}
            </div>

            {showAnswer && (
              <Button onClick={handleNext} className="w-full gap-2">
                {currentQ + 1 >= questions.length ? "Sonuçları Gör" : "Sonraki Soru"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // ---- RESULT ----
  const friendPerc = questions.length > 0 ? Math.round((friendScore / questions.length) * 100) : 0
  const friendWins = friendPerc > challengerPerc
  const tie = friendPerc === challengerPerc
  const displayFriendName = friendName.trim() || "Sen"

  const resultShareText = isDuel
    ? `${displayFriendName} vs ${challengeData.n} - ${gameName} Duellosu!\n${displayFriendName}: %${friendPerc} | ${challengeData.n}: %${challengerPerc}\n${friendWins ? `${displayFriendName} kazandı!` : tie ? "Berabere!" : `${challengeData.n} kazandı!`}`
    : `${gameName} Meydan Okuması!\n${displayFriendName}: %${friendPerc} | ${challengeData.n}: %${challengerPerc}`

  const handleCopyResult = async () => {
    const url = typeof window !== "undefined" ? window.location.href : ""
    try {
      await navigator.clipboard.writeText(`${resultShareText}\n\nSen de dene: ${url}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* noop */ }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background via-background to-muted/30">
      <Card className="max-w-md w-full shadow-xl">
        <CardContent className="p-8 space-y-6">
          {/* Winner banner */}
          <div className="text-center space-y-2 animate-score-pop">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Crown className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-foreground">
              {tie ? "Berabere!" : friendWins ? `${displayFriendName} Kazandı!` : `${challengeData.n} Kazandı!`}
            </h1>
            <p className="text-sm text-muted-foreground">{gameName}</p>
          </div>

          {/* Score comparison */}
          <div className="grid grid-cols-3 items-center gap-2">
            {/* Friend */}
            <div className={cn(
              "text-center p-4 rounded-xl border-2 transition-all",
              friendWins ? "border-primary bg-primary/5" : "border-border bg-muted/20"
            )}>
              <p className="text-xs text-muted-foreground truncate mb-1">{displayFriendName}</p>
              <p className={cn("text-3xl font-serif font-bold", friendWins ? "text-primary" : "text-foreground")}>
                %{friendPerc}
              </p>
              <p className="text-xs text-muted-foreground">{friendScore}/{questions.length}</p>
            </div>

            {/* VS */}
            <div className="text-center">
              <span className="text-lg font-serif font-bold text-muted-foreground">VS</span>
            </div>

            {/* Challenger */}
            <div className={cn(
              "text-center p-4 rounded-xl border-2 transition-all",
              !friendWins && !tie ? "border-primary bg-primary/5" : "border-border bg-muted/20"
            )}>
              <p className="text-xs text-muted-foreground truncate mb-1">{challengeData.n}</p>
              <p className={cn("text-3xl font-serif font-bold", !friendWins && !tie ? "text-primary" : "text-foreground")}>
                %{challengerPerc}
              </p>
              <p className="text-xs text-muted-foreground">{challengeData.sc}/{challengeData.t}</p>
            </div>
          </div>

          {/* Share */}
          <div className="space-y-2 pt-2">
            <p className="text-xs text-muted-foreground text-center font-medium uppercase tracking-wider">
              Sonucu Paylaş
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() =>
                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(resultShareText + "\n\n" + window.location.href)}`,
                    "_blank"
                  )
                }
                variant="outline"
                className="flex-1 bg-transparent hover:bg-green-50 hover:border-green-300 hover:text-green-700"
                size="sm"
              >
                <MessageCircle className="w-4 h-4 mr-1.5" />
                WhatsApp
              </Button>
              <Button
                onClick={() =>
                  window.open(
                    `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(resultShareText)}`,
                    "_blank"
                  )
                }
                variant="outline"
                className="flex-1 bg-transparent hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                size="sm"
              >
                <Send className="w-4 h-4 mr-1.5" />
                Telegram
              </Button>
            </div>
            <Button onClick={handleCopyResult} variant="outline" className="w-full bg-transparent" size="sm">
              {copied ? <Check className="w-4 h-4 mr-1.5 text-green-600" /> : <Copy className="w-4 h-4 mr-1.5" />}
              {copied ? "Kopyalandı!" : "Kopyala"}
            </Button>
          </div>

          {/* CTA */}
          <div className="flex gap-2 pt-2">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full">
                <Image src="/logo.png" alt="TEXT" width={20} height={20} className="mr-1.5 object-contain" />
                Ana Sayfa
              </Button>
            </Link>
            <Link href="/meydan-oku" className="flex-1">
              <Button className="w-full gap-1.5">
                Sen de Oyna
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Map challenge game slugs to GAME_COMPONENTS keys
const SLUG_TO_GAME_KEY: Record<string, string> = {
  daily: "daily",
  blitz: "blitz",
  snowchallenge: "snowchallenge",
  collocations: "collocation",
  collocation: "collocation",
  "context-clues": "context",
  context: "context",
  "error-spotting": "error",
  error: "error",
  "word-formation": "formation",
  formation: "formation",
  "sentence-transform": "transform",
  transform: "transform",
  "sentence-builder": "sentence",
  sentence: "sentence",
  exam: "exam",
  "exam-practice": "exam",
  wordle: "wordle",
  hangman: "hangman",
  "minimal-pairs": "minimal",
  minimal: "minimal",
  "cloze-test": "cloze",
  cloze: "cloze",
  flashcards: "flashcard",
  flashcard: "flashcard",
  "word-match": "match",
  match: "match",
  "timed-reading": "reading",
  reading: "reading",
  grammar: "grammar",
  "level-test": "exam",
  quiz: "daily",
}

// Incoming challenge wrapper - shows intro then loads actual game
function IncomingChallengeWrapper({ challengeData }: { challengeData: ChallengeData }) {
  const [phase, setPhase] = useState<"intro" | "playing" | "fallback">("intro")
  const [friendName, setFriendName] = useState("")

  const gameKey = SLUG_TO_GAME_KEY[challengeData.g] || null
  const GameComp = gameKey ? GAME_COMPONENTS[gameKey] : null
  const isDuel = challengeData.m === "duel"
  const challengerPerc = challengeData.t > 0 ? Math.round((challengeData.sc / challengeData.t) * 100) : 0
  const gameName = GAME_NAMES[challengeData.g] || challengeData.g

  // If we can't find the game component, fall back to the generic IncomingChallenge
  if (phase === "intro") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background via-background to-muted/30">
        <Card className="max-w-md w-full shadow-xl border-primary/10">
          <CardContent className="p-8 space-y-6 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              {isDuel ? (
                <Swords className="w-8 h-8 text-primary" />
              ) : (
                <Trophy className="w-8 h-8 text-primary" />
              )}
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-serif font-bold text-foreground text-balance">
                {isDuel ? "Duello Daveti!" : "Meydan Okuma!"}
              </h1>
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">{challengeData.n}</span>{" "}
                sana {gameName} {isDuel ? "duello'sunda" : "meydan okumasında"} meydan okuyor!
              </p>
            </div>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/15 space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                {challengeData.n} skoru
              </p>
              <p className="text-3xl font-serif font-bold text-primary">
                %{challengerPerc}
              </p>
              <p className="text-xs text-muted-foreground">
                {challengeData.sc}/{challengeData.t} doğru
              </p>
            </div>

            <div className="space-y-3">
              <Input
                placeholder="Adını gir"
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setPhase(GameComp ? "playing" : "fallback")
                }}
                className="text-center bg-background"
                maxLength={20}
              />
              <Button
                onClick={() => setPhase(GameComp ? "playing" : "fallback")}
                size="lg"
                className="w-full gap-2 text-base"
              >
                <Flame className="w-5 h-5" />
                {isDuel ? "Duellosunu Kabul Et!" : "Meydan Okumaya Başla!"}
              </Button>
            </div>

            <Link href="/" className="block">
              <p className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                TEXT Language School
              </p>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // If no matching game component, fall back to generic quiz
  if (phase === "fallback" || !GameComp) {
    return <IncomingChallenge challengeData={challengeData} />
  }

  // Playing phase: render the actual game component
  return (
    <div className="min-h-screen bg-background">
      {/* Challenger banner */}
      <div className="bg-primary/5 border-b border-primary/10 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              {challengeData.n} sana meydan okuyor!
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-muted-foreground">Hedef:</span>
            <span className="font-bold text-primary">%{challengerPerc}</span>
            <span className="text-muted-foreground">({challengeData.sc}/{challengeData.t})</span>
          </div>
        </div>
      </div>

      {/* Actual game */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <GameComp />
      </div>
    </div>
  )
}

function PageRouter() {
  const searchParams = useSearchParams()
  const encoded = searchParams.get("d")
  const challengeData = useMemo(() => (encoded ? decodeChallengeData(encoded) : null), [encoded])

  // No ?d= param: show the challenges hub
  if (!encoded) {
    return <ChallengesHub />
  }

  // Invalid challenge link
  if (!challengeData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-4">
            <Swords className="w-12 h-12 text-muted-foreground mx-auto" />
            <h1 className="text-xl font-serif font-bold text-foreground">Geçersiz Link</h1>
            <p className="text-sm text-muted-foreground">
              Bu meydan okuma linki geçersiz veya süresi dolmuş olabilir.
            </p>
            <Link href="/meydan-oku">
              <Button className="mt-4">Challenge'lara Dön</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Valid challenge data: show the incoming challenge wrapper
  return <IncomingChallengeWrapper challengeData={challengeData} />
}

export default function MeydanOkuPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground animate-pulse">Yükleniyor...</p>
          </div>
        </div>
      }
    >
      <PageRouter />
    </Suspense>
  )
}
