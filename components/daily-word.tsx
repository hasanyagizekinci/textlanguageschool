"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Volume2, BookOpen, RefreshCw, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface WordOfDay {
  word: string
  pronunciation: string
  type: string
  meaning: string
  example: string
  exampleTranslation: string
}

const words: WordOfDay[] = [
  {
    word: "Serendipity",
    pronunciation: "/serendipiti/",
    type: "noun",
    meaning: "Şans eseri güzel bir şey bulmak veya keşfetmek",
    example: "Finding this cafe was pure serendipity.",
    exampleTranslation: "Bu kafeyi bulmak tamamen sans eseriydi.",
  },
  {
    word: "Resilient",
    pronunciation: "/rizilient/",
    type: "adjective",
    meaning: "Zorluklara karşı dayanıklı, çabuk toparlanan",
    example: "She's incredibly resilient after everything she's been through.",
    exampleTranslation: "Yaşadığı onca şeyden sonra inanılmaz dayanıklı.",
  },
  {
    word: "Elaborate",
    pronunciation: "/ilaboret/",
    type: "verb / adjective",
    meaning: "Detaylandırmak; ayrıntılı, karmaşık",
    example: "Could you elaborate on that point?",
    exampleTranslation: "Bu noktayı biraz daha açar mısınız?",
  },
  {
    word: "Ambiguous",
    pronunciation: "/ambigyuas/",
    type: "adjective",
    meaning: "Belirsiz, birden fazla anlama gelebilen",
    example: "The ending of the movie was deliberately ambiguous.",
    exampleTranslation: "Filmin sonu kasıtlı olarak belirsiz bırakılmıştı.",
  },
  {
    word: "Procrastinate",
    pronunciation: "/prokrastineyt/",
    type: "verb",
    meaning: "Ertelemek, işleri son dakikaya bırakmak",
    example: "I always procrastinate when I have deadlines.",
    exampleTranslation: "Teslim tarihlerim olduğunda hep erteliyorum.",
  },
  {
    word: "Nevertheless",
    pronunciation: "/nevirdeles/",
    type: "adverb",
    meaning: "Yine de, buna rağmen",
    example: "It was raining; nevertheless, we went for a walk.",
    exampleTranslation: "Yağmur yağıyordu; yine de yürüyüşe çıktık.",
  },
  {
    word: "Thorough",
    pronunciation: "/tara/",
    type: "adjective",
    meaning: "Kapsamlı, titiz, eksiksiz",
    example: "She did a thorough research before the presentation.",
    exampleTranslation: "Sunumdan önce kapsamlı bir araştırma yaptı.",
  },
  {
    word: "Peculiar",
    pronunciation: "/pikyuliar/",
    type: "adjective",
    meaning: "Tuhaf, garip, kendine özgü",
    example: "There was a peculiar smell in the room.",
    exampleTranslation: "Odada tuhaf bir koku vardı.",
  },
  {
    word: "Inevitable",
    pronunciation: "/inevitabl/",
    type: "adjective",
    meaning: "Kaçınılmaz, önlenemez",
    example: "Change is inevitable in life.",
    exampleTranslation: "Değişim hayatta kaçınılmazdır.",
  },
  {
    word: "Tremendous",
    pronunciation: "/trimendas/",
    type: "adjective",
    meaning: "Muazzam, çok büyük",
    example: "You've made tremendous progress this year.",
    exampleTranslation: "Bu yil muazzam bir ilerleme kaydettin.",
  },
  {
    word: "Adequate",
    pronunciation: "/adikwet/",
    type: "adjective",
    meaning: "Yeterli, uygun",
    example: "Is this amount adequate for your needs?",
    exampleTranslation: "Bu miktar ihtiyaçlarınız için yeterli mi?",
  },
  {
    word: "Compromise",
    pronunciation: "/kompramayz/",
    type: "noun / verb",
    meaning: "Uzlaşma, taviz vermek",
    example: "We reached a compromise after hours of discussion.",
    exampleTranslation: "Saatlerce süren tartışmanın ardından bir uzlaşmaya vardık.",
  },
  {
    word: "Significant",
    pronunciation: "/significent/",
    type: "adjective",
    meaning: "Önemli, kayda değer",
    example: "There has been a significant improvement in her English.",
    exampleTranslation: "İngilizcesinde kayda değer bir gelişme oldu.",
  },
  {
    word: "Hesitate",
    pronunciation: "/heziteyt/",
    type: "verb",
    meaning: "Tereddüt etmek, duraksama",
    example: "Don't hesitate to ask questions.",
    exampleTranslation: "Soru sormaktan çekinmeyin.",
  },
]

export function DailyWord() {
  const [wordIndex, setWordIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [direction, setDirection] = useState<"next" | "prev" | null>(null)

  useEffect(() => {
    const today = new Date()
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    )
    setWordIndex(dayOfYear % words.length)
  }, [])

  const currentWord = words[wordIndex]

  const speakWord = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord.word)
      utterance.lang = "en-US"
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const navigateWord = (dir: "next" | "prev") => {
    setDirection(dir)
    setIsFlipped(false)
    setTimeout(() => {
      setWordIndex(prev =>
        dir === "next" ? (prev + 1) % words.length : (prev - 1 + words.length) % words.length
      )
      setDirection(null)
    }, 150)
  }

  const typeColors: Record<string, { bg: string; text: string }> = {
    noun: { bg: "bg-blue-50", text: "text-blue-600" },
    verb: { bg: "bg-emerald-50", text: "text-emerald-600" },
    adjective: { bg: "bg-amber-50", text: "text-amber-600" },
    adverb: { bg: "bg-violet-50", text: "text-violet-600" },
    "noun / verb": { bg: "bg-cyan-50", text: "text-cyan-600" },
    "verb / adjective": { bg: "bg-rose-50", text: "text-rose-600" },
  }

  const typeColor = typeColors[currentWord.type] || typeColors.noun

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <h3 className="font-serif text-lg">Günün Kelimesi</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => navigateWord("prev")}
            aria-label="Önceki kelime"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <span className="text-xs text-muted-foreground w-12 text-center">{wordIndex + 1}/{words.length}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => navigateWord("next")}
            aria-label="Sonraki kelime"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "transition-all duration-150",
          direction === "next" && "translate-x-2 opacity-50",
          direction === "prev" && "-translate-x-2 opacity-50"
        )}
      >
        <Card
          className="border-2 cursor-pointer transition-all duration-300 hover:shadow-sm"
          onClick={() => setIsFlipped(!isFlipped)}
          role="button"
          tabIndex={0}
          aria-label={isFlipped ? "Kelimeye don" : "Anlami gor"}
        >
          <CardContent className="p-5">
            {!isFlipped ? (
              <div className="animate-in fade-in duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-2xl font-serif text-foreground">{currentWord.word}</h4>
                    <p className="text-sm text-muted-foreground">{currentWord.pronunciation}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", typeColor.bg, typeColor.text)}>
                      {currentWord.type}
                    </span>
                    <button
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        speakWord()
                      }}
                      aria-label="Kelimeyi seslendir"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Anlamını görmek için tıklayın
                </p>
              </div>
            ) : (
              <div className="animate-in fade-in duration-200">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-xl font-serif text-foreground">{currentWord.word}</h4>
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", typeColor.bg, typeColor.text)}>
                    {currentWord.type}
                  </span>
                </div>
                <p className="text-foreground mb-3 font-medium">{currentWord.meaning}</p>
                <div className="bg-muted/50 rounded-xl p-3 border border-border/50">
                  <p className="text-sm italic text-foreground">{`"${currentWord.example}"`}</p>
                  <p className="text-xs text-muted-foreground mt-1">{currentWord.exampleTranslation}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
