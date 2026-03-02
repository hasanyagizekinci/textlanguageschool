"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, BookMarked, CheckCircle2, XCircle, Shuffle } from "lucide-react"
import { cn } from "@/lib/utils"

interface GrammarTopic {
  title: string
  formula: string
  example: string
  translation: string
  tip: string
  quiz?: {
    question: string
    options: string[]
    correct: number
  }
}

const grammarTopics: GrammarTopic[] = [
  {
    title: "Present Simple",
    formula: "Subject + V1 (he/she/it -> +s)",
    example: "She works every day.",
    translation: "O her gün çalışır.",
    tip: "Alışkanlıklar ve genel gerçekler için kullanılır.",
    quiz: {
      question: "She _____ to school every day.",
      options: ["go", "goes", "going", "gone"],
      correct: 1,
    },
  },
  {
    title: "Present Continuous",
    formula: "Subject + am/is/are + V-ing",
    example: "I am studying English now.",
    translation: "Şu an İngilizce çalışıyorum.",
    tip: "Şu anda devam eden eylemler için kullanılır.",
    quiz: {
      question: "They _____ football right now.",
      options: ["play", "plays", "are playing", "played"],
      correct: 2,
    },
  },
  {
    title: "Past Simple",
    formula: "Subject + V2 (düzenli: +ed)",
    example: "I visited London last year.",
    translation: "Geçen yıl Londra'yı ziyaret ettim.",
    tip: "Geçmişte tamamlanmış eylemler için kullanılır.",
    quiz: {
      question: "We _____ to the cinema yesterday.",
      options: ["go", "goes", "went", "going"],
      correct: 2,
    },
  },
  {
    title: "Present Perfect",
    formula: "Subject + have/has + V3",
    example: "I have lived here for 5 years.",
    translation: "5 yıldır burada yaşıyorum.",
    tip: "Geçmişte başlayıp hala devam eden veya etkisi süren eylemler için kullanılır.",
    quiz: {
      question: "She _____ three books this month.",
      options: ["reads", "read", "has read", "is reading"],
      correct: 2,
    },
  },
  {
    title: "Future (will)",
    formula: "Subject + will + V1",
    example: "I will call you tomorrow.",
    translation: "Seni yarın arayacağım.",
    tip: "Anlık kararlar ve tahminler için kullanılır.",
    quiz: {
      question: "I think it _____ tomorrow.",
      options: ["rains", "rained", "will rain", "is raining"],
      correct: 2,
    },
  },
  {
    title: "First Conditional",
    formula: "If + Present Simple, will + V1",
    example: "If it rains, I will stay home.",
    translation: "Yağmur yağarsa evde kalacağım.",
    tip: "Gelecekte gerçekleşmesi muhtemel durumlar için kullanılır.",
    quiz: {
      question: "If you _____ hard, you will pass the exam.",
      options: ["study", "studied", "will study", "studies"],
      correct: 0,
    },
  },
  {
    title: "Second Conditional",
    formula: "If + Past Simple, would + V1",
    example: "If I were rich, I would travel.",
    translation: "Zengin olsaydım seyahat ederdim.",
    tip: "Hayali veya olası olmayan durumlar için kullanılır.",
    quiz: {
      question: "If I _____ you, I would accept the offer.",
      options: ["am", "was", "were", "be"],
      correct: 2,
    },
  },
  {
    title: "Passive Voice",
    formula: "Object + be + V3 (+ by agent)",
    example: "The book was written by her.",
    translation: "Kitap onun tarafından yazıldı.",
    tip: "Eylemi yapan değil, eylemden etkilenen önemli olduğunda kullanılır.",
    quiz: {
      question: "The letter _____ yesterday.",
      options: ["sent", "was sent", "sends", "is sending"],
      correct: 1,
    },
  },
  {
    title: "Past Continuous",
    formula: "Subject + was/were + V-ing",
    example: "I was reading when you called.",
    translation: "Sen aradiginda kitap okuyordum.",
    tip: "Gecmiste devam eden bir eylem baska bir eylemle kesildiginde kullanilir.",
    quiz: {
      question: "She _____ TV when the doorbell rang.",
      options: ["watches", "watched", "was watching", "is watching"],
      correct: 2,
    },
  },
  {
    title: "Past Perfect",
    formula: "Subject + had + V3",
    example: "I had finished before he arrived.",
    translation: "O gelmeden once bitirmistim.",
    tip: "Gecmiste baska bir olaydan once tamamlanan eylem icin kullanilir.",
    quiz: {
      question: "By the time we arrived, the movie _____.",
      options: ["started", "has started", "had started", "starts"],
      correct: 2,
    },
  },
  {
    title: "Future Continuous",
    formula: "Subject + will be + V-ing",
    example: "I will be studying at 8 PM tonight.",
    translation: "Bu gece saat 8'de ders calisiyor olacagim.",
    tip: "Gelecekte belirli bir anda devam ediyor olacak eylemler icin kullanilir.",
    quiz: {
      question: "This time tomorrow, I _____ on the beach.",
      options: ["sit", "will sit", "will be sitting", "am sitting"],
      correct: 2,
    },
  },
  {
    title: "Future Perfect",
    formula: "Subject + will have + V3",
    example: "By 2030, I will have graduated.",
    translation: "2030'a kadar mezun olmus olacagim.",
    tip: "Gelecekte belirli bir zamandan once tamamlanmis olacak eylemler icin.",
    quiz: {
      question: "By next month, she _____ here for a year.",
      options: ["works", "will work", "will have worked", "is working"],
      correct: 2,
    },
  },
  {
    title: "Third Conditional",
    formula: "If + Past Perfect, would have + V3",
    example: "If I had studied, I would have passed.",
    translation: "Calissaydim, gecerdim.",
    tip: "Gecmiste gerceklesmemis durumlari ifade etmek icin kullanilir.",
    quiz: {
      question: "If they _____ earlier, they would have caught the train.",
      options: ["leave", "left", "had left", "would leave"],
      correct: 2,
    },
  },
  {
    title: "Reported Speech",
    formula: "He said (that) + tense shift",
    example: "She said she was tired.",
    translation: "Yorgun oldugunu soyledi.",
    tip: "Dogrudan konusmayi aktarirken tense bir adim geri cekilir.",
    quiz: {
      question: "He said: 'I am happy.' -> He said he _____ happy.",
      options: ["is", "was", "has been", "will be"],
      correct: 1,
    },
  },
  {
    title: "Relative Clauses",
    formula: "who/which/that/where/whose + clause",
    example: "The man who called you is my brother.",
    translation: "Seni arayan adam kardesim.",
    tip: "Bir ismi tanimlayan veya ek bilgi veren cumleciklerdir.",
    quiz: {
      question: "The hotel _____ we stayed was very nice.",
      options: ["who", "which", "where", "whose"],
      correct: 2,
    },
  },
  {
    title: "Modal Verbs (Deduction)",
    formula: "must/might/can't + V1 (present) / have V3 (past)",
    example: "She must be at home. Her car is here.",
    translation: "Evde olmali. Arabasi burada.",
    tip: "Kesinlik derecesine gore must (kesin), might (belki), can't (imkansiz).",
    quiz: {
      question: "He _____ be sleeping. The lights are off.",
      options: ["must", "can", "should", "would"],
      correct: 0,
    },
  },
  {
    title: "Wish / If only",
    formula: "I wish + Past Simple (present) / Past Perfect (past)",
    example: "I wish I spoke French.",
    translation: "Keske Fransizca konussam.",
    tip: "Simdiki zaman icin past simple, gecmis icin past perfect kullanilir.",
    quiz: {
      question: "I wish I _____ to the party last night.",
      options: ["go", "went", "had gone", "would go"],
      correct: 2,
    },
  },
  {
    title: "Used to / Would",
    formula: "Subject + used to + V1 / would + V1",
    example: "I used to play football as a child.",
    translation: "Cocukken futbol oynardim.",
    tip: "Gecmisteki aliskanliklari anlatmak icin kullanilir. State verb'lerde sadece 'used to' kullanilir.",
    quiz: {
      question: "She _____ live in London before moving to Istanbul.",
      options: ["use to", "used to", "would", "was used to"],
      correct: 1,
    },
  },
  {
    title: "Gerunds & Infinitives",
    formula: "Verb + V-ing / Verb + to V1",
    example: "She enjoys reading. / He wants to go.",
    translation: "Okumaktan hoslanir. / Gitmek istiyor.",
    tip: "Bazi fiiller sadece gerund, bazi fiiller sadece infinitive alir. Bazi fiiller ikisini de alabilir.",
    quiz: {
      question: "He admitted _____ the mistake.",
      options: ["make", "to make", "making", "made"],
      correct: 2,
    },
  },
]

type ViewMode = "cards" | "quiz"

export function GrammarCards() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("cards")
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null)
  const [quizChecked, setQuizChecked] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [quizDone, setQuizDone] = useState(false)
  const [quizOrder, setQuizOrder] = useState<number[]>([])

  const startQuiz = () => {
    const order = grammarTopics
      .map((_, i) => i)
      .filter(i => grammarTopics[i].quiz)
      .sort(() => Math.random() - 0.5)
    setQuizOrder(order)
    setQuizIndex(0)
    setQuizAnswer(null)
    setQuizChecked(false)
    setQuizScore(0)
    setQuizDone(false)
    setViewMode("quiz")
  }

  const handleQuizAnswer = (optIndex: number) => {
    if (quizChecked) return
    setQuizAnswer(optIndex)
    setQuizChecked(true)
    const topic = grammarTopics[quizOrder[quizIndex]]
    if (topic.quiz && optIndex === topic.quiz.correct) {
      setQuizScore(s => s + 1)
    }
  }

  const nextQuiz = () => {
    if (quizIndex < quizOrder.length - 1) {
      setQuizIndex(i => i + 1)
      setQuizAnswer(null)
      setQuizChecked(false)
    } else {
      setQuizDone(true)
    }
  }

  if (viewMode === "quiz") {
    if (quizDone) {
      const total = quizOrder.length
      const pct = Math.round((quizScore / total) * 100)
      return (
        <div className="py-6">
          <Card className="border border-border/50 overflow-hidden rounded-lg">
            <div className={cn(
              "py-3 text-center",
              pct >= 80 ? "bg-emerald-50" : pct >= 50 ? "bg-amber-50" : "bg-red-50"
            )}>
              <BookMarked className={cn(
                "w-8 h-8 mx-auto mb-1",
                pct >= 80 ? "text-emerald-600" : pct >= 50 ? "text-amber-600" : "text-red-600"
              )} />
              <h4 className="font-serif text-xl">Gramer Testi Bitti!</h4>
            </div>
            <CardContent className="p-5 text-center">
              <div className="text-3xl font-bold mb-1">{quizScore}/{total}</div>
              <p className="text-muted-foreground text-sm mb-4">%{pct} başarı</p>
              <div className="flex justify-center gap-1 mb-5">
                {quizOrder.map((topicIdx, i) => {
                  const topic = grammarTopics[topicIdx]
                  // We can't track per-answer here, so just use score proportion
                  return (
                    <div
                      key={i}
                      className={cn(
                        "w-6 h-2 rounded-full",
                        i < quizScore ? "bg-emerald-400" : "bg-red-300"
                      )}
                    />
                  )
                })}
              </div>
              <div className="flex flex-col gap-2">
                <Button onClick={startQuiz} className="w-full bg-rose-500 hover:bg-rose-600 text-white">
                  <Shuffle className="w-4 h-4 mr-2" />
                  Tekrar Dene
                </Button>
                <Button onClick={() => setViewMode("cards")} variant="outline" className="w-full bg-transparent">
                  <BookMarked className="w-4 h-4 mr-2" />
                  Kartlara Don
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    const topic = grammarTopics[quizOrder[quizIndex]]
    const quiz = topic.quiz!
    return (
      <div className="py-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-rose-600" />
            <h3 className="font-serif text-lg">Gramer Testi</h3>
          </div>
          <span className="text-sm text-muted-foreground">{quizIndex + 1}/{quizOrder.length}</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full mb-4 overflow-hidden">
          <div
            className="h-full bg-rose-400 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${((quizIndex + (quizChecked ? 1 : 0)) / quizOrder.length) * 100}%` }}
          />
        </div>

        <Card className="border border-border/50 mb-4 rounded-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 font-medium">{topic.title}</span>
            </div>
            <p className="font-mono text-xs text-muted-foreground mb-3">{topic.formula}</p>
            <p className="text-base font-medium leading-relaxed">{quiz.question}</p>
          </CardContent>
        </Card>

        <div className="space-y-2 mb-4">
          {quiz.options.map((opt, i) => {
            const isSelected = quizAnswer === i
            const isCorrect = i === quiz.correct
            const showCorrect = quizChecked && isCorrect
            const showWrong = quizChecked && isSelected && !isCorrect

            return (
              <button
                key={i}
                onClick={() => handleQuizAnswer(i)}
                disabled={quizChecked}
                className={cn(
                  "w-full p-3 rounded-xl border-2 text-left transition-all flex items-center gap-3 text-sm",
                  !quizChecked && !isSelected && "border-border hover:border-rose-300 hover:bg-rose-50/50",
                  !quizChecked && isSelected && "border-rose-400 bg-rose-50",
                  showCorrect && "border-emerald-500 bg-emerald-50",
                  showWrong && "border-red-500 bg-red-50",
                  quizChecked && !showCorrect && !showWrong && "opacity-50"
                )}
              >
                <span className={cn(
                  "w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0",
                  showCorrect && "border-emerald-500 bg-emerald-500 text-white",
                  showWrong && "border-red-500 bg-red-500 text-white",
                  !quizChecked && "border-muted-foreground/20"
                )}>
                  {showCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                   showWrong ? <XCircle className="w-3.5 h-3.5" /> :
                   String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            )
          })}
        </div>

        {quizChecked && (
          <>
            <div className="bg-muted/50 rounded-xl p-3 mb-4 animate-in fade-in duration-200 text-sm text-muted-foreground">
              {topic.tip}
            </div>
            <Button onClick={nextQuiz} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              {quizIndex < quizOrder.length - 1 ? "Sonraki" : "Sonuçları Gör"}
            </Button>
          </>
        )}
      </div>
    )
  }

  // Cards view
  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookMarked className="w-5 h-5 text-rose-600" />
          <h3 className="font-serif text-lg">Gramer Kartlari</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={startQuiz}
          className="text-xs bg-transparent border-rose-200 text-rose-600 hover:bg-rose-50"
        >
          <Shuffle className="w-3.5 h-3.5 mr-1.5" />
          Test Ol
        </Button>
      </div>

      <div className="space-y-2">
        {grammarTopics.map((topic, index) => (
          <Card
            key={index}
            className={cn(
              "border-2 transition-all duration-200 cursor-pointer",
              openIndex === index ? "border-rose-200 shadow-sm" : "hover:border-border/80"
            )}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center text-[10px] font-bold">
                    {index + 1}
                  </span>
                  <h4 className="font-medium text-foreground">{topic.title}</h4>
                </div>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform duration-200",
                    openIndex === index && "rotate-180"
                  )}
                />
              </div>

              {openIndex === index && (
                <div className="px-4 pb-4 pt-0 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="bg-rose-50/80 rounded-lg p-3 mb-3 border border-rose-100">
                    <p className="font-mono text-sm text-rose-700">{topic.formula}</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="italic text-foreground">{`"${topic.example}"`}</p>
                    <p className="text-muted-foreground">{topic.translation}</p>
                    <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 mt-2">
                      {topic.tip}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
