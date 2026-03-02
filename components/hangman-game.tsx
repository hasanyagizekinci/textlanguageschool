"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { showXpToast, showAchievementToast, playSoundEffect } from "@/components/xp-toast"
import { ShareChallenge } from "@/components/share-challenge"

const WORDS = [
  { en: "VOCABULARY", tr: "Kelime dağarcığı", cat: "Eğitim" },
  { en: "GRAMMAR", tr: "Dilbilgisi", cat: "Eğitim" },
  { en: "SENTENCE", tr: "Cümle", cat: "Eğitim" },
  { en: "PARAGRAPH", tr: "Paragraf", cat: "Eğitim" },
  { en: "LANGUAGE", tr: "Dil", cat: "Genel" },
  { en: "HOSPITAL", tr: "Hastane", cat: "Tıp" },
  { en: "MEDICINE", tr: "İlaç", cat: "Tıp" },
  { en: "COMPUTER", tr: "Bilgisayar", cat: "Teknoloji" },
  { en: "MOUNTAIN", tr: "Dağ", cat: "Doğa" },
  { en: "ELEPHANT", tr: "Fil", cat: "Hayvanlar" },
  { en: "KITCHEN", tr: "Mutfak", cat: "Ev" },
  { en: "LIBRARY", tr: "Kütüphane", cat: "Eğitim" },
  { en: "WEATHER", tr: "Hava durumu", cat: "Doğa" },
  { en: "TEACHER", tr: "Öğretmen", cat: "Eğitim" },
  { en: "STUDENT", tr: "Öğrenci", cat: "Eğitim" },
  { en: "JOURNEY", tr: "Yolculuk", cat: "Seyahat" },
  { en: "CULTURE", tr: "Kültür", cat: "Genel" },
  { en: "SCIENCE", tr: "Bilim", cat: "Eğitim" },
  { en: "FREEDOM", tr: "Özgürlük", cat: "Genel" },
  { en: "ECONOMY", tr: "Ekonomi", cat: "İş" },
  { en: "BALANCE", tr: "Denge", cat: "Genel" },
  { en: "PROBLEM", tr: "Sorun", cat: "Genel" },
  { en: "OPINION", tr: "Görüş", cat: "Genel" },
  { en: "COURAGE", tr: "Cesaret", cat: "Genel" },
  { en: "HISTORY", tr: "Tarih", cat: "Eğitim" },
  { en: "NETWORK", tr: "Ağ/Şebeke", cat: "Teknoloji" },
  { en: "TRAFFIC", tr: "Trafik", cat: "Seyahat" },
  { en: "PROTEIN", tr: "Protein", cat: "Sağlık" },
  { en: "AIRPORT", tr: "Havalimanı", cat: "Seyahat" },
  { en: "EXAMPLE", tr: "Örnek", cat: "Eğitim" },
  { en: "CREATIVE", tr: "Yaratici", cat: "Genel" },
  { en: "EXERCISE", tr: "Egzersiz", cat: "Saglik" },
  { en: "SANDWICH", tr: "Sandvic", cat: "Yiyecek" },
  { en: "CALENDAR", tr: "Takvim", cat: "Genel" },
  { en: "CUSTOMER", tr: "Musteri", cat: "Is" },
  { en: "ELEPHANT", tr: "Fil", cat: "Hayvanlar" },
  { en: "BUILDING", tr: "Bina", cat: "Genel" },
  { en: "BIRTHDAY", tr: "Dogum gunu", cat: "Genel" },
  { en: "DECISION", tr: "Karar", cat: "Genel" },
  { en: "FAMILIAR", tr: "Tanidik", cat: "Genel" },
  { en: "PRACTICE", tr: "Pratik", cat: "Egitim" },
  { en: "FAVORITE", tr: "Favori", cat: "Genel" },
  { en: "POSSIBLE", tr: "Mumkun", cat: "Genel" },
  { en: "RESEARCH", tr: "Arastirma", cat: "Egitim" },
  { en: "INTEREST", tr: "Ilgi", cat: "Genel" },
  { en: "SHOULDER", tr: "Omuz", cat: "Vucut" },
  { en: "STRANGER", tr: "Yabanci", cat: "Genel" },
  { en: "DAUGHTER", tr: "Kiz evlat", cat: "Aile" },
  { en: "NOTEBOOK", tr: "Defter", cat: "Egitim" },
  { en: "UMBRELLA", tr: "Semsiye", cat: "Genel" },
  { en: "PLEASURE", tr: "Zevk", cat: "Genel" },
  { en: "NEIGHBOR", tr: "Komsu", cat: "Genel" },
  { en: "ORGANIZE", tr: "Duzenlemek", cat: "Is" },
  { en: "TOMORROW", tr: "Yarin", cat: "Zaman" },
  { en: "POSITION", tr: "Pozisyon", cat: "Is" },
  { en: "STANDARD", tr: "Standart", cat: "Genel" },
  { en: "STRENGTH", tr: "Guc/Kuvvet", cat: "Genel" },
  { en: "ABSOLUTE", tr: "Mutlak/Kesin", cat: "Genel" },
  // --- DOUBLED: 60 new words ---
  { en: "ADVENTURE", tr: "Macera", cat: "Genel" },
  { en: "BEHAVIOR", tr: "Davran\u0131\u015f", cat: "Genel" },
  { en: "CEREMONY", tr: "T\u00f6ren", cat: "Genel" },
  { en: "DESCRIBE", tr: "Tan\u0131mlamak", cat: "Genel" },
  { en: "EVIDENCE", tr: "Kan\u0131t", cat: "Hukuk" },
  { en: "FLEXIBLE", tr: "Esnek", cat: "Genel" },
  { en: "GRATEFUL", tr: "Minnettar", cat: "Genel" },
  { en: "HEADLINE", tr: "Ba\u015fl\u0131k", cat: "Medya" },
  { en: "IDENTIFY", tr: "Tan\u0131mlamak", cat: "Genel" },
  { en: "JEALOUSY", tr: "K\u0131skan\u00e7l\u0131k", cat: "Duygular" },
  { en: "KEYBOARD", tr: "Klavye", cat: "Teknoloji" },
  { en: "LIFETIME", tr: "\u00d6m\u00fcr", cat: "Zaman" },
  { en: "MIDNIGHT", tr: "Gece yar\u0131s\u0131", cat: "Zaman" },
  { en: "NATIONAL", tr: "Ulusal", cat: "Genel" },
  { en: "OBSTACLE", tr: "Engel", cat: "Genel" },
  { en: "PATIENCE", tr: "Sab\u0131r", cat: "Genel" },
  { en: "QUANTITY", tr: "Miktar", cat: "Genel" },
  { en: "RELATION", tr: "\u0130li\u015fki", cat: "Genel" },
  { en: "SOFTWARE", tr: "Yaz\u0131l\u0131m", cat: "Teknoloji" },
  { en: "TEENAGER", tr: "Ergen", cat: "Genel" },
  { en: "UNIVERSE", tr: "Evren", cat: "Bilim" },
  { en: "VALUABLE", tr: "De\u011ferli", cat: "Genel" },
  { en: "WORKSHOP", tr: "At\u00f6lye", cat: "E\u011fitim" },
  { en: "YOURSELF", tr: "Kendiniz", cat: "Genel" },
  { en: "APPROACH", tr: "Yakla\u015f\u0131m", cat: "Genel" },
  { en: "BACTERIA", tr: "Bakteri", cat: "Bilim" },
  { en: "CHAMPION", tr: "\u015eampiyon", cat: "Spor" },
  { en: "DARKNESS", tr: "Karanl\u0131k", cat: "Genel" },
  { en: "ELEPHANT", tr: "Fil", cat: "Hayvanlar" },
  { en: "FEBRUARY", tr: "\u015eubat", cat: "Zaman" },
  { en: "GENEROUS", tr: "C\u00f6mert", cat: "Genel" },
  { en: "HANDBOOK", tr: "El kitab\u0131", cat: "E\u011fitim" },
  { en: "INNOCENT", tr: "Masum", cat: "Genel" },
  { en: "INVOLVED", tr: "Dahil", cat: "Genel" },
  { en: "KANGAROO", tr: "Kanguru", cat: "Hayvanlar" },
  { en: "LANDLORD", tr: "Ev sahibi", cat: "Genel" },
  { en: "MATERIAL", tr: "Malzeme", cat: "Genel" },
  { en: "NINETEEN", tr: "On dokuz", cat: "Say\u0131lar" },
  { en: "OPPONENT", tr: "Rakip", cat: "Spor" },
  { en: "PLEASANT", tr: "Ho\u015f", cat: "Genel" },
  { en: "BATHROOM", tr: "Banyo", cat: "Ev" },
  { en: "RESPONSE", tr: "Yan\u0131t", cat: "Genel" },
  { en: "SEPARATE", tr: "Ay\u0131rmak", cat: "Genel" },
  { en: "THINKING", tr: "D\u00fc\u015f\u00fcnme", cat: "Genel" },
  { en: "VACATION", tr: "Tatil", cat: "Seyahat" },
  { en: "WILDLIFE", tr: "Yaban hayat\u0131", cat: "Do\u011fa" },
  { en: "AIRPLANE", tr: "U\u00e7ak", cat: "Seyahat" },
  { en: "BRACELET", tr: "Bilezik", cat: "Aksesuar" },
  { en: "CROCODIL", tr: "Timsah", cat: "Hayvanlar" },
  { en: "DIAGNOSE", tr: "Te\u015fhis koymak", cat: "T\u0131p" },
  { en: "EXCHANGE", tr: "De\u011fi\u015fim", cat: "Genel" },
  { en: "FUNCTION", tr: "\u0130\u015flev", cat: "Genel" },
  { en: "GENOCIDE", tr: "Soyk\u0131r\u0131m", cat: "Tarih" },
  { en: "HARDSHIP", tr: "Zorluk", cat: "Genel" },
  { en: "INCLUDED", tr: "Dahil", cat: "Genel" },
  { en: "MARRIAGE", tr: "Evlilik", cat: "Genel" },
  { en: "NUMEROUS", tr: "Say\u0131s\u0131z", cat: "Genel" },
  { en: "OCCURRED", tr: "Meydana geldi", cat: "Genel" },
  { en: "PAINTING", tr: "Resim", cat: "Sanat" },
  { en: "PROVINCE", tr: "\u0130l/Eyalet", cat: "Co\u011frafya" },
]

const MAX_WRONG = 7
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

function HangmanFigure({ wrong }: { wrong: number }) {
  return (
    <svg viewBox="0 0 120 140" className="w-28 h-32 sm:w-32 sm:h-36 mx-auto">
      {/* Gallows */}
      <line x1="20" y1="130" x2="100" y2="130" stroke="currentColor" strokeWidth="3" className="text-muted-foreground" />
      <line x1="40" y1="130" x2="40" y2="20" stroke="currentColor" strokeWidth="3" className="text-muted-foreground" />
      <line x1="40" y1="20" x2="80" y2="20" stroke="currentColor" strokeWidth="3" className="text-muted-foreground" />
      <line x1="80" y1="20" x2="80" y2="35" stroke="currentColor" strokeWidth="3" className="text-muted-foreground" />
      {/* Head */}
      {wrong >= 1 && <circle cx="80" cy="45" r="10" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-foreground animate-scale-in" />}
      {/* Body */}
      {wrong >= 2 && <line x1="80" y1="55" x2="80" y2="85" stroke="currentColor" strokeWidth="2.5" className="text-foreground animate-scale-in" />}
      {/* Left arm */}
      {wrong >= 3 && <line x1="80" y1="62" x2="65" y2="78" stroke="currentColor" strokeWidth="2.5" className="text-foreground animate-scale-in" />}
      {/* Right arm */}
      {wrong >= 4 && <line x1="80" y1="62" x2="95" y2="78" stroke="currentColor" strokeWidth="2.5" className="text-foreground animate-scale-in" />}
      {/* Left leg */}
      {wrong >= 5 && <line x1="80" y1="85" x2="65" y2="105" stroke="currentColor" strokeWidth="2.5" className="text-foreground animate-scale-in" />}
      {/* Right leg */}
      {wrong >= 6 && <line x1="80" y1="85" x2="95" y2="105" stroke="currentColor" strokeWidth="2.5" className="text-foreground animate-scale-in" />}
      {/* Face */}
      {wrong >= 7 && (
        <g className="animate-scale-in">
          <line x1="76" y1="42" x2="78" y2="46" stroke="currentColor" strokeWidth="1.5" className="text-destructive" />
          <line x1="78" y1="42" x2="76" y2="46" stroke="currentColor" strokeWidth="1.5" className="text-destructive" />
          <line x1="82" y1="42" x2="84" y2="46" stroke="currentColor" strokeWidth="1.5" className="text-destructive" />
          <line x1="84" y1="42" x2="82" y2="46" stroke="currentColor" strokeWidth="1.5" className="text-destructive" />
          <path d="M75 51 Q80 48 85 51" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-destructive" />
        </g>
      )}
    </svg>
  )
}

export function HangmanGame() {
  const [wordObj, setWordObj] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)])
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set())
  const [streak, setStreak] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => { containerRef.current?.focus() }, [])

  const word = wordObj.en
  const wrongLetters = [...guessedLetters].filter(l => !word.includes(l))
  const wrongCount = wrongLetters.length
  const isLost = wrongCount >= MAX_WRONG
  const isWon = word.split("").every(l => guessedLetters.has(l))
  const gameOver = isLost || isWon

  const guess = useCallback((letter: string) => {
    if (gameOver || guessedLetters.has(letter)) return
    const next = new Set(guessedLetters)
    next.add(letter)
    setGuessedLetters(next)

    if (word.includes(letter)) {
      playSoundEffect("correct")
      const allRevealed = word.split("").every(l => next.has(l))
      if (allRevealed) {
        playSoundEffect("complete")
        const xp = Math.max(10, 25 - wrongLetters.length * 3)
        showXpToast(xp, `Adam asmaca: ${wrongLetters.length} yanlis!`)
        setStreak(s => {
          if (s + 1 >= 3) showAchievementToast("Hangman serisi!")
          return s + 1
        })
      }
    } else {
      const newWrong = wrongLetters.length + 1
      if (newWrong >= MAX_WRONG) {
        playSoundEffect("wrong")
        setStreak(0)
      } else {
        playSoundEffect("wrong")
      }
    }
  }, [gameOver, guessedLetters, word, wrongLetters])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const key = e.key.toUpperCase()
    if (/^[A-Z]$/.test(key)) guess(key)
  }, [guess])

  const reset = () => {
    setWordObj(WORDS[Math.floor(Math.random() * WORDS.length)])
    setGuessedLetters(new Set())
  }

  return (
    <div ref={containerRef} tabIndex={0} onKeyDown={handleKeyDown} className="outline-none">
      <Card className="border-0 shadow-none bg-transparent">
        <CardContent className="p-0 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Ipucu: <span className="font-medium text-foreground">{wordObj.tr}</span>
                <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-muted">{wordObj.cat}</span>
              </p>
              {streak > 0 && <p className="text-xs text-amber-600 font-medium mt-0.5">Seri: {streak}</p>}
            </div>
            <Button size="icon" variant="ghost" onClick={reset} className="h-8 w-8">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {/* Hangman figure */}
          <HangmanFigure wrong={wrongCount} />

          {/* Wrong count */}
          <div className="text-center">
            <div className="flex justify-center gap-1.5">
              {Array.from({ length: MAX_WRONG }).map((_, i) => (
                <div key={i} className={cn("w-3 h-3 rounded-full transition-colors", i < wrongCount ? "bg-destructive" : "bg-muted")} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{MAX_WRONG - wrongCount} hak kaldi</p>
          </div>

          {/* Word display */}
          <div className="flex justify-center gap-2 flex-wrap">
            {word.split("").map((letter, i) => (
              <div
                key={i}
                className={cn(
                  "w-9 h-11 sm:w-10 sm:h-12 flex items-center justify-center text-lg font-bold rounded-lg border-2 transition-all",
                  guessedLetters.has(letter) ? "border-primary bg-primary/5 text-foreground animate-scale-in" :
                  isLost ? "border-destructive/50 bg-destructive/5 text-destructive" : "border-border"
                )}
              >
                {(guessedLetters.has(letter) || isLost) ? letter : ""}
              </div>
            ))}
          </div>

          {/* Game over */}
          {gameOver && (
            <div className="text-center animate-scale-in space-y-3">
              {isWon ? (
                <p className="text-lg font-bold text-emerald-600">{wrongCount === 0 ? "Mukemmel!" : `${wrongCount} yanlis ile buldun!`}</p>
              ) : (
                <p className="text-lg font-bold text-destructive">Kelime: <span className="text-foreground">{word}</span></p>
              )}
              <div className="flex flex-col gap-2">
                <Button onClick={reset} className="w-full"><RotateCcw className="w-4 h-4 mr-2" />Yeni Kelime</Button>
                <ShareChallenge
                  title="Adam Asmaca Sonucum"
                  scoreText={isWon ? `Adam Asmaca'da sadece ${wrongCount} yanlis ile kelimeyi buldun!` : "Adam Asmaca'da kaybettim!"}
                  challengeText="Sen bu kelimeyi bulabilir misin?"
                  toolSlug="hangman"
                  challengeScore={isWon ? 1 : 0}
                  challengeTotal={1}
                />
              </div>
            </div>
          )}

          {/* Keyboard */}
          {!gameOver && (
            <div className="flex flex-wrap justify-center gap-1.5 pt-1">
              {LETTERS.map(letter => {
                const isGuessed = guessedLetters.has(letter)
                const isCorrect = isGuessed && word.includes(letter)
                const isWrong = isGuessed && !word.includes(letter)
                return (
                  <button
                    key={letter}
                    onClick={() => guess(letter)}
                    disabled={isGuessed}
                    className={cn(
                      "w-8 h-9 sm:w-9 sm:h-10 rounded-md text-sm font-semibold transition-all",
                      isCorrect ? "bg-emerald-500 text-white" :
                      isWrong ? "bg-muted text-muted-foreground/40" :
                      "bg-card border border-border hover:bg-muted hover:border-primary/30"
                    )}
                  >
                    {letter}
                  </button>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
