"use client"

import { useState, useCallback, useEffect } from "react"
import { DailyWord } from "@/components/daily-word"
import { FlashcardGame } from "@/components/flashcard-game"
import { GrammarCards } from "@/components/grammar-cards"
import { SentenceBuilder } from "@/components/sentence-builder"
import { WordMatch } from "@/components/word-match"
import { ExamPractice } from "@/components/exam-practice"
import { CollocationsQuiz } from "@/components/collocations-quiz"
import { WordFormation } from "@/components/word-formation"
import { ContextClues } from "@/components/context-clues"
import { ErrorSpotting } from "@/components/error-spotting"
import { TimedReading } from "@/components/timed-reading"
import { MinimalPairs } from "@/components/minimal-pairs"
import { ClozeTest } from "@/components/cloze-test"
import { SentenceTransform } from "@/components/sentence-transform"
import { BlitzChallenge } from "@/components/blitz-challenge"
import { AchievementBadges } from "@/components/achievement-badges"
import { WordleGame } from "@/components/wordle-game"
import { HangmanGame } from "@/components/hangman-game"
import { SnowflakeChallenge } from "@/components/snowflake-challenge"
import { DailyChallenge } from "@/components/daily-challenge"
import { PersonalRecords } from "@/components/personal-records"
import { SpeakingQuiz } from "@/components/speaking-quiz"
import { XpProgressBar } from "@/components/xp-progress-bar"

import { XpToastContainer, toggleSound } from "@/components/xp-toast"
import {
  BookOpen, Zap, BookMarked, Shuffle, Link2, GraduationCap,
  PenTool, Search, AlertTriangle, BookOpenCheck, Ear, FileText,
  Repeat, Timer, Trophy, Sparkles, ArrowLeft, Volume2, VolumeX, LayoutGrid, Skull, Snowflake,
  CalendarDays, Medal, Mic
} from "lucide-react"
import { cn } from "@/lib/utils"

type ActivityId =
  | "word" | "flashcard" | "match" | "context" | "formation"
  | "grammar" | "sentence" | "collocation" | "transform" | "error"
  | "reading" | "cloze" | "minimal"
  | "exam" | "blitz" | "badges" | "daily" | "records"
  | "wordle" | "hangman" | "snowchallenge" | "accent"

interface ActivityItem {
  id: ActivityId
  label: string
  desc: string
  icon: React.ElementType
  color: string
  bg: string
  accent: string
}

interface CategoryDef {
  id: string
  label: string
  emoji: string
  items: ActivityItem[]
}

const categories: CategoryDef[] = [
  {
    id: "vocab",
    label: "Kelime Bilgisi",
    emoji: "Aa",
    items: [
      { id: "word", label: "Günün Kelimesi", desc: "Her gün yeni bir kelime", icon: BookOpen, color: "text-rose-600", bg: "bg-rose-50", accent: "border-rose-200 hover:border-rose-300" },
      { id: "flashcard", label: "Kelime Kartları", desc: "Biliyorum / Öğreniyorum", icon: Zap, color: "text-amber-600", bg: "bg-amber-50", accent: "border-amber-200 hover:border-amber-300" },
      { id: "match", label: "Kelime Eşleştir", desc: "İngilizce-Türkçe eşleyin", icon: Link2, color: "text-violet-600", bg: "bg-violet-50", accent: "border-violet-200 hover:border-violet-300" },
      { id: "context", label: "Bağlamdan Anlam", desc: "Cümleden anlam çıkarın", icon: Search, color: "text-cyan-600", bg: "bg-cyan-50", accent: "border-cyan-200 hover:border-cyan-300" },
      { id: "formation", label: "Kelime Türetme", desc: "İsim, fiil, sıfat dönüşümü", icon: PenTool, color: "text-teal-600", bg: "bg-teal-50", accent: "border-teal-200 hover:border-teal-300" },
    ],
  },
  {
    id: "grammar",
    label: "Gramer & Yapi",
    emoji: "Gr",
    items: [
      { id: "grammar", label: "Gramer Kartları", desc: "Konu anlatımı + quiz", icon: BookMarked, color: "text-pink-600", bg: "bg-pink-50", accent: "border-pink-200 hover:border-pink-300" },
      { id: "sentence", label: "Cümle Kur", desc: "Kelimeleri doğru sıralayın", icon: Shuffle, color: "text-emerald-600", bg: "bg-emerald-50", accent: "border-emerald-200 hover:border-emerald-300" },
      { id: "collocation", label: "Collocations", desc: "Make mi Do mu?", icon: Sparkles, color: "text-indigo-600", bg: "bg-indigo-50", accent: "border-indigo-200 hover:border-indigo-300" },
      { id: "transform", label: "Cümle Dönüşümü", desc: "Active, passive, reported", icon: Repeat, color: "text-fuchsia-600", bg: "bg-fuchsia-50", accent: "border-fuchsia-200 hover:border-fuchsia-300" },
      { id: "error", label: "Hata Bul", desc: "Cümledeki yanlışı yakalayın", icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-50", accent: "border-orange-200 hover:border-orange-300" },
    ],
  },
  {
    id: "reading",
    label: "Okuma & Dinleme",
    emoji: "Ok",
    items: [
      { id: "reading", label: "Hızlı Okuma", desc: "WPM + kavrama soruları", icon: BookOpenCheck, color: "text-blue-600", bg: "bg-blue-50", accent: "border-blue-200 hover:border-blue-300" },
      { id: "cloze", label: "Boşluk Doldur", desc: "Paragrafta boşlukları doldurun", icon: FileText, color: "text-slate-600", bg: "bg-slate-50", accent: "border-slate-200 hover:border-slate-300" },
      { id: "minimal", label: "Minimal Pairs", desc: "Ship mi Sheep mi?", icon: Ear, color: "text-purple-600", bg: "bg-purple-50", accent: "border-purple-200 hover:border-purple-300" },
      { id: "accent", label: "Accent Challenge", desc: "11 profil ile aksanını analiz et", icon: Mic, color: "text-primary", bg: "bg-primary/5", accent: "border-primary/30 hover:border-primary/50" },
    ],
  },
  {
    id: "challenge",
    label: "Sınav & Oyun",
    emoji: "Sn",
    items: [
      { id: "daily", label: "Günün Challenge'ı", desc: "Her gün 10 soru, herkese aynı", icon: CalendarDays, color: "text-red-600", bg: "bg-red-50", accent: "border-red-200 hover:border-red-300" },
      { id: "exam", label: "Sınav Pratiği", desc: "YDS, YÖKDİL, IELTS, TOEFL", icon: GraduationCap, color: "text-secondary", bg: "bg-secondary/10", accent: "border-secondary/30 hover:border-secondary/50" },
      { id: "blitz", label: "Blitz Challenge", desc: "60 saniye, karışık sorular", icon: Timer, color: "text-orange-600", bg: "bg-orange-50", accent: "border-orange-200 hover:border-orange-300" },
      { id: "snowchallenge", label: "Çılga", desc: "Kar erimeden cevapla", icon: Snowflake, color: "text-sky-600", bg: "bg-sky-50", accent: "border-sky-200 hover:border-sky-300" },
      { id: "wordle", label: "Wordle", desc: "5 harfli kelimeyi bul", icon: LayoutGrid, color: "text-emerald-600", bg: "bg-emerald-50", accent: "border-emerald-200 hover:border-emerald-300" },
      { id: "hangman", label: "Adam Asmaca", desc: "Kelimeyi harflerle bul", icon: Skull, color: "text-purple-600", bg: "bg-purple-50", accent: "border-purple-200 hover:border-purple-300" },
      { id: "records", label: "En İyi Skorlarım", desc: "Kişisel rekorlarını gör", icon: Medal, color: "text-yellow-600", bg: "bg-yellow-50", accent: "border-yellow-200 hover:border-yellow-300" },
      { id: "badges", label: "Başarımlarım", desc: "XP, seri ve rozetler", icon: Trophy, color: "text-amber-600", bg: "bg-amber-50", accent: "border-amber-200 hover:border-amber-300" },
    ],
  },
]

const allItems = categories.flatMap(c => c.items)

const COMPONENTS: Record<ActivityId, React.ComponentType> = {
  word: DailyWord,
  flashcard: FlashcardGame,
  match: WordMatch,
  context: ContextClues,
  formation: WordFormation,
  grammar: GrammarCards,
  sentence: SentenceBuilder,
  collocation: CollocationsQuiz,
  transform: SentenceTransform,
  error: ErrorSpotting,
  reading: TimedReading,
  cloze: ClozeTest,
  minimal: MinimalPairs,
  exam: ExamPractice,
  blitz: BlitzChallenge,
  wordle: WordleGame,
  hangman: HangmanGame,
  snowchallenge: SnowflakeChallenge,
  daily: DailyChallenge,
  records: PersonalRecords,
  badges: AchievementBadges,
  accent: SpeakingQuiz,
}

export function LearningTools() {
  const [activeTab, setActiveTab] = useState<ActivityId | null>(null)
  const [animatingOut, setAnimatingOut] = useState(false)
  const [activeCategory, setActiveCategory] = useState("vocab")
  const [soundOn, setSoundOn] = useState(true)

  const goBack = useCallback(() => {
    setAnimatingOut(true)
    setTimeout(() => { setActiveTab(null); setAnimatingOut(false) }, 200)
  }, [])

  const selectActivity = useCallback((id: ActivityId) => setActiveTab(id), [])

  const activeItem = activeTab ? allItems.find(t => t.id === activeTab) : null
  const ActiveComponent = activeTab ? COMPONENTS[activeTab] : null

  // Listen for quick-open from header dropdown
  useEffect(() => {
    function handleOpen(e: Event) {
      const quizId = (e as CustomEvent).detail as ActivityId
      if (COMPONENTS[quizId]) {
        // Find which category contains this quiz and switch to it
        const cat = categories.find(c => c.items.some(i => i.id === quizId))
        if (cat) setActiveCategory(cat.id)
        setActiveTab(quizId)
      }
    }
    window.addEventListener("open-quiz", handleOpen)
    return () => window.removeEventListener("open-quiz", handleOpen)
  }, [])

  const activeCat = categories.find(c => c.id === activeCategory)

  return (
    <section id="pratik" className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-14 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-3 text-balance tracking-tight">
              Hemen Pratik Yapın
            </h2>
            <p className="text-muted-foreground max-w-sm mx-auto text-sm leading-relaxed">
              Kendi hızınızda, kendi yolunuzda.
            </p>
          </div>

          {/* Sound toggle */}
          <div className="flex justify-center mb-4">
            <button
              onClick={() => { const isOn = toggleSound(); setSoundOn(isOn) }}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full border border-border/50 hover:border-border"
            >
              {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              {soundOn ? "Ses Açık" : "Ses Kapalı"}
            </button>
          </div>

          <XpProgressBar />

          {/* Activity View or Menu */}
          {activeTab && activeItem && ActiveComponent ? (
            <div className={cn(
              "animate-in fade-in slide-in-from-right-4 duration-300",
              animatingOut && "opacity-0 translate-x-4 transition-all duration-200"
            )}>
              {/* Back -- gentle, not robotic */}
              <button
                onClick={goBack}
                className="inline-flex items-center gap-2 mb-6 py-2 px-3 -ml-1 rounded-full text-muted-foreground hover:text-foreground transition-colors duration-200 group touch-manipulation"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="text-sm">{activeItem.label}</span>
              </button>
              <div className="min-h-[400px]">
                <ActiveComponent />
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Featured: Accent Challenge */}
              <button
                onClick={() => selectActivity("accent")}
                className="w-full flex items-center gap-3 p-3.5 mb-5 rounded-2xl bg-primary/[0.04] border border-primary/20 hover:bg-primary/[0.08] hover:border-primary/30 active:scale-[0.99] transition-all duration-200 text-left group touch-manipulation"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                  <Mic className="w-5 h-5 text-primary" />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">Accent Challenge</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">Yeni</span>
                  </div>
                  <span className="text-xs text-muted-foreground mt-0.5">{"Aksanını analiz et, kişiselleştirilmiş egzersizler al"}</span>
                </div>
                <ArrowLeft className="w-4 h-4 text-muted-foreground/40 shrink-0 rotate-180 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Category tabs */}
              <div className="flex gap-1.5 mb-8 overflow-x-auto pb-1 scrollbar-hide">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      "shrink-0 px-4 py-2 rounded-lg text-sm transition-all duration-200 touch-manipulation",
                      activeCategory === cat.id
                        ? "bg-foreground text-background font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Activity cards */}
              {activeCat && (
                <div className="grid grid-cols-2 gap-3">
                  {activeCat.items.map((item, idx) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.id}
                        onClick={() => selectActivity(item.id)}
                        className={cn(
                          "relative text-left p-4 rounded-lg border border-border/50 bg-card transition-all duration-200 group touch-manipulation",
                          "hover:border-border hover:shadow-sm hover:-translate-y-0.5",
                          "active:translate-y-0 active:shadow-none active:scale-[0.98]",
                          activeCat.items.length % 2 !== 0 && idx === activeCat.items.length - 1 && "col-span-2"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-transform duration-200",
                          "group-hover:scale-105",
                          item.bg
                        )}>
                          <Icon className={cn("w-5 h-5", item.color)} strokeWidth={1.5} />
                        </div>
                        <h4 className="text-sm font-semibold text-foreground leading-tight mb-0.5">{item.label}</h4>
                        <p className="text-[11px] text-muted-foreground leading-snug">{item.desc}</p>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <XpToastContainer />
    </section>
  )
}
