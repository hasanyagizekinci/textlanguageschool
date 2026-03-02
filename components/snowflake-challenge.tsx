"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QuizHeader } from "@/components/quiz-header"
import { ShareChallenge } from "@/components/share-challenge"
import { addXp } from "@/lib/xp-system"
import { cn } from "@/lib/utils"
import { Snowflake, Clock, RotateCcw, ChevronRight } from "lucide-react"

// --- Types ---
type Difficulty = "beginner" | "intermediate" | "advanced"
type QuestionType = "vocab" | "fill" | "correct" | "synonym" | "tense"

interface Question {
  type: QuestionType
  prompt: string
  options: string[]
  correct: number
  difficulty: Difficulty
}

// --- Question Bank ---
const QUESTIONS: Question[] = [
  // Beginner A1-A2
  { type: "vocab", prompt: "'Abandon' ne demek?", options: ["Terk etmek", "Kabul etmek", "Toplamak", "Planlamak"], correct: 0, difficulty: "beginner" },
  { type: "fill", prompt: "She ___ to school every day.", options: ["goes", "go", "going", "gone"], correct: 0, difficulty: "beginner" },
  { type: "correct", prompt: "Hangisi yanlış?", options: ["He don't like coffee.", "She doesn't like tea.", "They don't play.", "I don't agree."], correct: 0, difficulty: "beginner" },
  { type: "synonym", prompt: "'Happy' ile eş anlamlı?", options: ["Joyful", "Angry", "Tired", "Hungry"], correct: 0, difficulty: "beginner" },
  { type: "tense", prompt: "'I ___ dinner now.' Doğru zaman?", options: ["am cooking", "cooked", "cook", "will cook"], correct: 0, difficulty: "beginner" },
  { type: "vocab", prompt: "'Receive' ne demek?", options: ["Göndermek", "Almak", "Vermek", "Kaybetmek"], correct: 1, difficulty: "beginner" },
  { type: "fill", prompt: "They ___ playing football yesterday.", options: ["was", "were", "are", "is"], correct: 1, difficulty: "beginner" },
  { type: "correct", prompt: "Hangisi yanlış?", options: ["She can sings well.", "He can swim fast.", "I can help you.", "We can try again."], correct: 0, difficulty: "beginner" },
  { type: "synonym", prompt: "'Big' ile eş anlamlı?", options: ["Small", "Large", "Thin", "Short"], correct: 1, difficulty: "beginner" },
  { type: "tense", prompt: "'She ___ a book last night.'", options: ["reads", "read", "is reading", "has read"], correct: 1, difficulty: "beginner" },
  { type: "vocab", prompt: "'Purchase' ne demek?", options: ["Satmak", "Kiralamak", "Satın almak", "İade etmek"], correct: 2, difficulty: "beginner" },
  { type: "fill", prompt: "There ___ many people at the party.", options: ["was", "were", "is", "has"], correct: 1, difficulty: "beginner" },
  { type: "vocab", prompt: "'Encourage' ne demek?", options: ["Cesaretlendirmek", "Cezalandırmak", "Engellemek", "Unutmak"], correct: 0, difficulty: "beginner" },
  { type: "fill", prompt: "My sister ___ tennis every Saturday.", options: ["play", "plays", "playing", "played"], correct: 1, difficulty: "beginner" },
  { type: "correct", prompt: "Hangisi yanlış?", options: ["She have a cat.", "He has a dog.", "We have lunch.", "They have homework."], correct: 0, difficulty: "beginner" },
  { type: "synonym", prompt: "'Sad' ile eş anlamlı?", options: ["Upset", "Glad", "Brave", "Quick"], correct: 0, difficulty: "beginner" },
  { type: "tense", prompt: "'We ___ to the park yesterday.'", options: ["go", "goes", "went", "going"], correct: 2, difficulty: "beginner" },
  { type: "vocab", prompt: "'Borrow' ne demek?", options: ["Vermek", "Ödünç almak", "Satmak", "Kırmak"], correct: 1, difficulty: "beginner" },
  { type: "fill", prompt: "He ___ not like broccoli.", options: ["do", "does", "is", "has"], correct: 1, difficulty: "beginner" },
  { type: "correct", prompt: "Hangisi yanlış?", options: ["They is happy.", "She is tall.", "We are students.", "I am here."], correct: 0, difficulty: "beginner" },
  { type: "synonym", prompt: "'Fast' ile eş anlamlı?", options: ["Slow", "Quick", "Heavy", "Soft"], correct: 1, difficulty: "beginner" },
  { type: "tense", prompt: "'Look! The baby ___.'", options: ["cries", "is crying", "cried", "cry"], correct: 1, difficulty: "beginner" },

  // Intermediate B1-B2
  { type: "vocab", prompt: "'Reluctant' ne demek?", options: ["İstekli", "İsteksiz", "Hızlı", "Dikkatli"], correct: 1, difficulty: "intermediate" },
  { type: "fill", prompt: "If I ___ rich, I would travel.", options: ["am", "were", "was being", "will be"], correct: 1, difficulty: "intermediate" },
  { type: "correct", prompt: "Hangisi yanlış?", options: ["Despite of the rain, we went.", "In spite of the rain, we went.", "Although it rained, we went.", "Even though it rained, we went."], correct: 0, difficulty: "intermediate" },
  { type: "synonym", prompt: "'Commence' ile eş anlamlı?", options: ["Finish", "Begin", "Delay", "Cancel"], correct: 1, difficulty: "intermediate" },
  { type: "tense", prompt: "'By next year, she ___ here for a decade.'", options: ["works", "will work", "will have worked", "has worked"], correct: 2, difficulty: "intermediate" },
  { type: "vocab", prompt: "'Subsequent' ne demek?", options: ["Önceki", "Sonraki", "Eşzamanlı", "Kararsız"], correct: 1, difficulty: "intermediate" },
  { type: "fill", prompt: "He wished he ___ harder.", options: ["studies", "studied", "had studied", "would study"], correct: 2, difficulty: "intermediate" },
  { type: "correct", prompt: "Hangisi yanlış?", options: ["I look forward to meet you.", "I look forward to meeting you.", "I am looking forward to meeting you.", "I look forward to your reply."], correct: 0, difficulty: "intermediate" },
  { type: "synonym", prompt: "'Diminish' ile eş anlamlı?", options: ["Increase", "Decrease", "Maintain", "Improve"], correct: 1, difficulty: "intermediate" },
  { type: "tense", prompt: "'They ___ for two hours when we arrived.'", options: ["waited", "have waited", "had been waiting", "were waiting"], correct: 2, difficulty: "intermediate" },
  { type: "vocab", prompt: "'Comprehensive' ne demek?", options: ["Sınırlı", "Kapsamlı", "Basit", "Belirsiz"], correct: 1, difficulty: "intermediate" },
  { type: "fill", prompt: "She suggested that he ___ a doctor.", options: ["sees", "see", "saw", "seeing"], correct: 1, difficulty: "intermediate" },
  { type: "vocab", prompt: "'Inevitable' ne demek?", options: ["Kaçınılmaz", "Mümkün", "Gereksiz", "Şüpheli"], correct: 0, difficulty: "intermediate" },
  { type: "fill", prompt: "She ___ English since she was ten.", options: ["learns", "learned", "has been learning", "is learning"], correct: 2, difficulty: "intermediate" },
  { type: "correct", prompt: "Hangisi yanlış?", options: ["He suggested to go early.", "He suggested going early.", "He suggested that we go early.", "He suggested leaving at dawn."], correct: 0, difficulty: "intermediate" },
  { type: "synonym", prompt: "'Accomplish' ile eş anlamlı?", options: ["Fail", "Achieve", "Abandon", "Reject"], correct: 1, difficulty: "intermediate" },
  { type: "tense", prompt: "'By the time she arrived, we ___.'", options: ["left", "have left", "had left", "leave"], correct: 2, difficulty: "intermediate" },
  { type: "vocab", prompt: "'Ambiguous' ne demek?", options: ["Net", "Belirsiz", "Kesin", "Güçlü"], correct: 1, difficulty: "intermediate" },
  { type: "fill", prompt: "I wish I ___ taller.", options: ["am", "were", "was being", "will be"], correct: 1, difficulty: "intermediate" },
  { type: "correct", prompt: "Hangisi yanlış?", options: ["She must goes now.", "She must go now.", "She has to go now.", "She needs to go now."], correct: 0, difficulty: "intermediate" },
  { type: "synonym", prompt: "'Enormous' ile eş anlamlı?", options: ["Tiny", "Huge", "Average", "Narrow"], correct: 1, difficulty: "intermediate" },
  { type: "tense", prompt: "'If I had known, I ___ you.'", options: ["will help", "would help", "would have helped", "helped"], correct: 2, difficulty: "intermediate" },

  // Advanced C1-C2
  { type: "vocab", prompt: "'Ubiquitous' ne demek?", options: ["Nadir", "Her yerde bulunan", "Gizli", "Tehlikeli"], correct: 1, difficulty: "advanced" },
  { type: "fill", prompt: "Not until the meeting ended ___ the truth.", options: ["he revealed", "did he reveal", "he did reveal", "revealed he"], correct: 1, difficulty: "advanced" },
  { type: "correct", prompt: "Hangisi yanlış?", options: ["Seldom does he arrive late.", "Never I have seen such beauty.", "Rarely do they complain.", "Not only did she win, but she also broke the record."], correct: 1, difficulty: "advanced" },
  { type: "synonym", prompt: "'Ephemeral' ile eş anlamlı?", options: ["Permanent", "Transient", "Significant", "Robust"], correct: 1, difficulty: "advanced" },
  { type: "tense", prompt: "'Had she ___ earlier, she would have caught the train.'", options: ["leave", "left", "leaving", "leaves"], correct: 1, difficulty: "advanced" },
  { type: "vocab", prompt: "'Pragmatic' ne demek?", options: ["Hayalperest", "Pratik/gerçekçi", "Duygusal", "Teorik"], correct: 1, difficulty: "advanced" },
  { type: "fill", prompt: "The report ___ by the time the director arrives.", options: ["will finish", "will be finished", "will have been finished", "is finished"], correct: 2, difficulty: "advanced" },
  { type: "correct", prompt: "Hangisi yanlış?", options: ["Were it not for his help, we would have failed.", "Should you need help, contact us.", "Had I knew the answer, I would have told you.", "Not until dawn did the storm subside."], correct: 2, difficulty: "advanced" },
  { type: "synonym", prompt: "'Exacerbate' ile eş anlamlı?", options: ["Alleviate", "Worsen", "Stabilize", "Resolve"], correct: 1, difficulty: "advanced" },
  { type: "tense", prompt: "'It is high time we ___ a decision.'", options: ["make", "made", "have made", "will make"], correct: 1, difficulty: "advanced" },
  { type: "vocab", prompt: "'Quintessential' ne demek?", options: ["Sıradan", "Mükemmel örneği olan", "Eksik", "Tartışmalı"], correct: 1, difficulty: "advanced" },
  { type: "fill", prompt: "So ___ was the damage that the building was demolished.", options: ["extensive", "extend", "extending", "extensiveness"], correct: 0, difficulty: "advanced" },
  { type: "vocab", prompt: "'Conundrum' ne demek?", options: ["Çözüm", "Bulmaca/İkilem", "Başarı", "Fırsat"], correct: 1, difficulty: "advanced" },
  { type: "fill", prompt: "Seldom ___ such an eloquent speech been delivered.", options: ["has", "have", "had", "is"], correct: 0, difficulty: "advanced" },
  { type: "correct", prompt: "Hangisi yanlış?", options: ["Hardly had I sat when the phone rang.", "Barely had she finished when he arrived.", "No sooner I had left than it rained.", "Not until midnight did the guests leave."], correct: 2, difficulty: "advanced" },
  { type: "synonym", prompt: "'Mitigate' ile eş anlamlı?", options: ["Worsen", "Alleviate", "Intensify", "Provoke"], correct: 1, difficulty: "advanced" },
  { type: "tense", prompt: "'Were she ___ the truth, things would be different.'", options: ["to tell", "telling", "told", "tells"], correct: 0, difficulty: "advanced" },
  { type: "vocab", prompt: "'Juxtapose' ne demek?", options: ["Ayırmak", "Yan yana koymak", "Gizlemek", "Basitleştirmek"], correct: 1, difficulty: "advanced" },
  { type: "fill", prompt: "Only after the trial ___ the full story emerge.", options: ["did", "does", "has", "was"], correct: 0, difficulty: "advanced" },
  { type: "correct", prompt: "Hangisi yanlış?", options: ["She insisted that he leaves.", "She insisted that he leave.", "She demanded that he be present.", "She suggested that we take a break."], correct: 0, difficulty: "advanced" },
  { type: "synonym", prompt: "'Tenacious' ile eş anlamlı?", options: ["Weak", "Persistent", "Careless", "Timid"], correct: 1, difficulty: "advanced" },
  { type: "tense", prompt: "'It is imperative that every student ___ on time.'", options: ["arrives", "arrive", "arrived", "arriving"], correct: 1, difficulty: "advanced" },
]

const ROUND_TIME = 60
const QUESTIONS_PER_ROUND = 12

const LEVEL_MAP: Record<Difficulty, { label: string; cefr: string; desc: string }> = {
  beginner:     { label: "Başlangıç",  cefr: "A1 - A2", desc: "Temel kelime ve gramer" },
  intermediate: { label: "Orta Seviye", cefr: "B1 - B2", desc: "Karmaşık yapılar" },
  advanced:     { label: "İleri",       cefr: "C1 - C2", desc: "Akademik ve ileri düzey" },
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// --- Melting Snowflake SVG ---
// melt: 0 = pristine (100% size), 1 = fully melted (0% size)
// Snowflake shrinks proportionally to remaining time with a subtle melt pool beneath.
function MeltingSnowflake({ melt }: { melt: number }) {
  const remaining = Math.max(0, 1 - melt)        // 1 at start, 0 at end
  const scale = remaining                          // linear shrink: 100% -> 0%
  const opacity = Math.max(0.08, remaining * 0.9 + 0.1)
  const blur = melt * melt * 3                     // subtle blur ramps up quadratically
  const arms = 6
  const armLen = 42 * Math.max(0.1, remaining)
  const barbLen = 28 * Math.max(0.1, remaining)
  const poolOpacity = Math.min(0.18, melt * 0.25)  // subtle growing pool
  const poolScale = 0.3 + melt * 0.7               // grows as snowflake melts

  return (
    <div className="flex flex-col items-center justify-center relative" aria-hidden="true">
      <svg
        width={120}
        height={120}
        viewBox="-60 -60 120 120"
        style={{
          opacity,
          transform: `scale(${scale})`,
          filter: blur > 0.1 ? `blur(${blur}px)` : undefined,
          transition: "transform 1s linear, opacity 1s linear, filter 1s linear",
        }}
      >
        {Array.from({ length: arms }).map((_, i) => {
          const angle = (i * 360) / arms
          const armFade = Math.max(0, remaining * 1.2 - (i % 3) * 0.05)
          return (
            <g key={i} transform={`rotate(${angle})`} opacity={armFade}>
              <line x1={0} y1={0} x2={0} y2={-armLen} stroke="currentColor" strokeWidth={1} strokeLinecap="round" />
              <line x1={0} y1={-barbLen * 0.5} x2={-7 * remaining} y2={-barbLen * 0.72} stroke="currentColor" strokeWidth={0.7} strokeLinecap="round" />
              <line x1={0} y1={-barbLen * 0.5} x2={7 * remaining} y2={-barbLen * 0.72} stroke="currentColor" strokeWidth={0.7} strokeLinecap="round" />
              {remaining > 0.35 && (
                <>
                  <line x1={0} y1={-barbLen * 0.75} x2={-4.5 * remaining} y2={-barbLen * 0.88} stroke="currentColor" strokeWidth={0.45} strokeLinecap="round" />
                  <line x1={0} y1={-barbLen * 0.75} x2={4.5 * remaining} y2={-barbLen * 0.88} stroke="currentColor" strokeWidth={0.45} strokeLinecap="round" />
                </>
              )}
            </g>
          )
        })}
        <circle cx={0} cy={0} r={2.5 * Math.max(0.2, remaining)} fill="currentColor" opacity={opacity} />
      </svg>
      {/* Accumulated melt pool -- subtle white/ivory ellipse growing beneath */}
      {melt > 0.05 && (
        <div
          className="absolute bottom-0 rounded-full"
          style={{
            width: `${poolScale * 80}px`,
            height: `${poolScale * 16}px`,
            background: `radial-gradient(ellipse, rgba(255,255,255,${poolOpacity}) 0%, transparent 70%)`,
            transition: "all 1s linear",
            filter: "blur(4px)",
          }}
        />
      )}
    </div>
  )
}

// --- Main Component ---
export function SnowflakeChallenge() {
  const [phase, setPhase] = useState<"welcome" | "playing" | "result">("welcome")
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME)
  const [selected, setSelected] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Load previous score
  const prevScore = typeof window !== "undefined"
    ? parseInt(localStorage.getItem("snowflake_challenge_best") || "0", 10)
    : 0

  const startGame = useCallback((diff: Difficulty) => {
    setDifficulty(diff)
    const pool = QUESTIONS.filter(q => q.difficulty === diff)
    setQuestions(shuffleArray(pool).slice(0, QUESTIONS_PER_ROUND))
    setCurrent(0)
    setScore(0)
    setStreak(0)
    setMaxStreak(0)
    setCorrectCount(0)
    setTimeLeft(ROUND_TIME)
    setSelected(null)
    setLastCorrect(null)
    setPhase("playing")
  }, [])

  // Timer
  useEffect(() => {
    if (phase !== "playing") return
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          setPhase("result")
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [phase])

  const handleAnswer = useCallback((idx: number) => {
    if (selected !== null) return
    setSelected(idx)
    const q = questions[current]
    const isCorrect = idx === q.correct

    if (isCorrect) {
      const multiplier = streak >= 4 ? 2 : streak >= 2 ? 1.5 : 1
      setScore(prev => prev + Math.round(10 * multiplier))
      setStreak(prev => prev + 1)
      setMaxStreak(prev => Math.max(prev, streak + 1))
      setCorrectCount(prev => prev + 1)
      setLastCorrect(true)
    } else {
      setStreak(0)
      setLastCorrect(false)
    }

    setTimeout(() => {
      if (current + 1 >= questions.length) {
        if (timerRef.current) clearInterval(timerRef.current)
        setPhase("result")
      } else {
        setCurrent(prev => prev + 1)
        setSelected(null)
      }
    }, 800)
  }, [selected, current, questions, streak])

  // Save best score
  useEffect(() => {
    if (phase === "result" && score > 0) {
      addXp(score, "snowflake_challenge")
      const best = parseInt(localStorage.getItem("snowflake_challenge_best") || "0", 10)
      if (score > best) {
        localStorage.setItem("snowflake_challenge_best", String(score))
      }
    }
  }, [phase, score])

  const melt = 1 - timeLeft / ROUND_TIME
  const accuracy = current > 0 ? Math.round((correctCount / (current + (phase === "result" ? 0 : 0))) * 100) : 0
  const answeredTotal = phase === "result" ? (selected !== null ? current + 1 : current) : current

  const cefrEstimate = difficulty
    ? accuracy >= 80
      ? difficulty === "advanced" ? "C1 - C2" : difficulty === "intermediate" ? "B2+" : "A2 - B1"
      : accuracy >= 50
        ? difficulty === "advanced" ? "B2 - C1" : difficulty === "intermediate" ? "B1 - B2" : "A2"
        : difficulty === "advanced" ? "B1 - B2" : difficulty === "intermediate" ? "A2 - B1" : "A1 - A2"
    : ""

  const feedbackLine =
    accuracy >= 80
      ? "Bu seviyeye hakimsiniz, tebrikler!"
      : accuracy >= 60
        ? "Sağlam bir temeliniz var, biraz daha pratikle zirvedesiniz."
        : accuracy >= 40
          ? "İyi bir başlangıç, düzenli pratik fark yaratacak."
          : "Her adım ilerleme demek, devam edin!"

  const improvement = prevScore > 0 ? score - prevScore : null

  // --- WELCOME ---
  if (phase === "welcome") {
    return (
      <Card className="border border-border/50 overflow-hidden rounded-lg">
        <CardContent className="p-6 md:p-8">
          <div className="text-center mb-8">
            <div className="text-foreground/20 mb-4">
              <MeltingSnowflake melt={0} />
            </div>
            <h3 className="font-serif text-xl md:text-2xl mb-2">Çılga</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
              60 saniyede kar tanesi erimeden soruları yanıtlayın.
            </p>
          </div>

          <div className="space-y-2.5 max-w-xs mx-auto">
            {(Object.entries(LEVEL_MAP) as [Difficulty, typeof LEVEL_MAP["beginner"]][]).map(([key, val]) => (
              <button
                key={key}
                onClick={() => startGame(key)}
                className="w-full text-left p-4 rounded-lg border border-border/50 hover:border-border hover:shadow-sm transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-foreground">{val.label}</div>
                    <div className="text-[11px] text-muted-foreground">{val.cefr} &middot; {val.desc}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-foreground transition-colors" />
                </div>
              </button>
            ))}
          </div>

          {prevScore > 0 && (
            <p className="text-center text-xs text-muted-foreground mt-6">
              En iyi skor: <span className="font-semibold">{prevScore}</span>
            </p>
          )}
        </CardContent>
      </Card>
    )
  }

  // --- PLAYING ---
  if (phase === "playing" && questions.length > 0) {
    const q = questions[current]
    return (
      <Card className="border border-border/50 overflow-hidden rounded-lg">
        <CardContent className="p-5 md:p-6">
          <QuizHeader
            title="Çılga"
            current={current + 1}
            total={questions.length}
            correctStreak={streak}
            lastAnswerCorrect={lastCorrect}
          />

          {/* Timer + Snowflake */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              <span className={cn(
                "text-sm font-mono tabular-nums font-medium",
                timeLeft <= 10 ? "text-destructive" : "text-muted-foreground"
              )}>
                {timeLeft}s
              </span>
            </div>

            <div className="text-foreground/15">
              <MeltingSnowflake melt={melt} />
            </div>

            <div className="text-sm font-mono tabular-nums text-muted-foreground">
              {score} puan
            </div>
          </div>

          {/* Combo indicator */}
          {streak >= 2 && (
            <div className="text-center mb-3">
              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-primary/10 text-primary">
                {streak} seri {streak >= 4 ? "(x2)" : "(x1.5)"}
              </span>
            </div>
          )}

          {/* Question */}
          <div className="mb-5">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
              {q.type === "vocab" ? "Kelime" : q.type === "fill" ? "Boşluk Doldur" : q.type === "correct" ? "Hata Bul" : q.type === "synonym" ? "Eş Anlam" : "Zaman Kipi"}
            </span>
            <p className="text-base font-medium text-foreground mt-1 leading-relaxed">{q.prompt}</p>
          </div>

          {/* Options */}
          <div className="space-y-2">
            {q.options.map((opt, idx) => {
              const isSelected = selected === idx
              const isCorrect = idx === q.correct
              const showResult = selected !== null

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={selected !== null}
                  className={cn(
                    "w-full text-left p-3 rounded-lg border text-sm transition-all",
                    showResult && isCorrect && "border-emerald-400 bg-emerald-50 text-emerald-800",
                    showResult && isSelected && !isCorrect && "border-destructive/50 bg-destructive/5 text-destructive",
                    !showResult && "border-border/50 hover:border-border hover:bg-muted/30 active:scale-[0.98]",
                    showResult && !isSelected && !isCorrect && "opacity-50"
                  )}
                >
                  <span className="font-medium">{String.fromCharCode(65 + idx)}.</span> {opt}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  // --- RESULT ---
  const finalAccuracy = answeredTotal > 0 ? Math.round((correctCount / answeredTotal) * 100) : 0

  return (
    <Card className="border border-border/50 overflow-hidden rounded-lg">
      <CardContent className="p-6 md:p-8">
        <QuizHeader
            title="Çılga"
            current={answeredTotal}
            total={questions.length}
          correctStreak={maxStreak}
          resultMode={finalAccuracy >= 70 ? "high" : finalAccuracy >= 40 ? "medium" : "low"}
        />

        <div className="text-center py-4">
          <div className="text-foreground/10 mb-4">
            <MeltingSnowflake melt={1} />
          </div>

          <h4 className="font-serif text-xl mb-1">
            {finalAccuracy >= 70 ? "Harika!" : finalAccuracy >= 40 ? "Fena Değil!" : "Devam Et!"}
          </h4>
          <p className="text-sm text-muted-foreground mb-6">{feedbackLine}</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2.5 mb-6">
            <div className="text-center p-3 rounded-lg bg-muted/40">
              <div className="text-xl font-bold text-foreground">{score}</div>
              <div className="text-[10px] text-muted-foreground">Puan</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/40">
              <div className="text-xl font-bold text-foreground">%{finalAccuracy}</div>
              <div className="text-[10px] text-muted-foreground">Doğruluk</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/40">
              <div className="text-xl font-bold text-foreground">{cefrEstimate}</div>
              <div className="text-[10px] text-muted-foreground">Tahmini</div>
            </div>
          </div>

          {/* Previous score comparison */}
          {improvement !== null && (
            <p className="text-xs text-muted-foreground mb-4">
              Önceki en iyi: {prevScore} &middot;{" "}
              <span className={improvement > 0 ? "text-emerald-600 font-medium" : improvement < 0 ? "text-destructive" : ""}>
                {improvement > 0 ? `+${improvement} gelişme` : improvement < 0 ? `${improvement} puan` : "Aynı skor"}
              </span>
            </p>
          )}

          <div className="space-y-3">
            <Button
              onClick={() => startGame(difficulty!)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Tekrar Oyna
            </Button>

            <ShareChallenge
              title="Çılga Sonucum"
              scoreText={`Çılga'da ${score} puan, %${finalAccuracy} doğruluk! Tahmini seviye: ${cefrEstimate}.`}
              challengeText="Kar tanesi erimeden kaç soru bilebilirsin?"
              toolSlug="snowchallenge"
              challengeScore={correctCount}
              challengeTotal={answeredTotal}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
