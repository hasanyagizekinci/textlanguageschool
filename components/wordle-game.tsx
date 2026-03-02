"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RotateCcw, HelpCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { showXpToast, showAchievementToast, playSoundEffect } from "@/components/xp-toast"
import { ShareChallenge } from "@/components/share-challenge"

const WORDS = [
  { en: "APPLE", tr: "Elma" }, { en: "BRAIN", tr: "Beyin" }, { en: "CHAIR", tr: "Sandalye" },
  { en: "DANCE", tr: "Dans" }, { en: "EARTH", tr: "Dunya" }, { en: "FLAME", tr: "Alev" },
  { en: "GHOST", tr: "Hayalet" }, { en: "HOUSE", tr: "Ev" }, { en: "JUICE", tr: "Meyve suyu" },
  { en: "KNIFE", tr: "Bicak" }, { en: "LIGHT", tr: "Isik" }, { en: "MONEY", tr: "Para" },
  { en: "NIGHT", tr: "Gece" }, { en: "OCEAN", tr: "Okyanus" }, { en: "PLANT", tr: "Bitki" },
  { en: "QUEEN", tr: "Kralice" }, { en: "RIVER", tr: "Nehir" }, { en: "STONE", tr: "Tas" },
  { en: "TOWER", tr: "Kule" }, { en: "UNDER", tr: "Altinda" }, { en: "VOICE", tr: "Ses" },
  { en: "WATER", tr: "Su" }, { en: "YOUTH", tr: "Genclik" }, { en: "DREAM", tr: "Ruya" },
  { en: "PEACE", tr: "Baris" }, { en: "SMILE", tr: "Gulumseme" }, { en: "STORM", tr: "Firtina" },
  { en: "TRAIN", tr: "Tren" }, { en: "WORLD", tr: "Dunya" }, { en: "CLOUD", tr: "Bulut" },
  { en: "HEART", tr: "Kalp" }, { en: "MUSIC", tr: "Muzik" }, { en: "POWER", tr: "Guc" },
  { en: "SLEEP", tr: "Uyku" }, { en: "SUGAR", tr: "Seker" }, { en: "TIGER", tr: "Kaplan" },
  { en: "BEACH", tr: "Plaj/Kumsal" }, { en: "BREAD", tr: "Ekmek" }, { en: "COLOR", tr: "Renk" },
  { en: "DRIVE", tr: "Surmek" }, { en: "GREEN", tr: "Yesil" }, { en: "HAPPY", tr: "Mutlu" },
  { en: "LEMON", tr: "Limon" }, { en: "PHOTO", tr: "Fotograf" }, { en: "QUIET", tr: "Sessiz" },
  { en: "SHARP", tr: "Keskin" }, { en: "THINK", tr: "Dusunmek" }, { en: "WATCH", tr: "Izlemek/Saat" },
  { en: "BRAVE", tr: "Cesur" }, { en: "EARLY", tr: "Erken" }, { en: "FRESH", tr: "Taze" },
  { en: "GIANT", tr: "Dev" }, { en: "HEAVY", tr: "Agir" }, { en: "IDEAL", tr: "Ideal" },
  { en: "JUDGE", tr: "Hakim" }, { en: "LABOR", tr: "Emek" }, { en: "MAGIC", tr: "Sihir" },
  { en: "NOBLE", tr: "Soylu" }, { en: "PRIDE", tr: "Gurur" }, { en: "ROYAL", tr: "Kraliyet" },
  { en: "SKILL", tr: "Beceri" }, { en: "TABLE", tr: "Masa" }, { en: "UNITY", tr: "Birlik" },
  { en: "VALUE", tr: "Deger" }, { en: "WHEEL", tr: "Tekerlek" }, { en: "ANGEL", tr: "Melek" },
  { en: "BIRTH", tr: "Dogum" }, { en: "CHASE", tr: "Kovalamak" }, { en: "DEPTH", tr: "Derinlik" },
  { en: "EVENT", tr: "Etkinlik" }, { en: "FORCE", tr: "Kuvvet" }, { en: "GRAIN", tr: "Tahil" },
  { en: "HONOR", tr: "Onur" }, { en: "IMAGE", tr: "Goruntu" }, { en: "JOINT", tr: "Eklem" },
  { en: "KNOCK", tr: "Vurmak" }, { en: "LUNAR", tr: "Ayla ilgili" }, { en: "MAYOR", tr: "Belediye baskani" },
  { en: "NERVE", tr: "Sinir" }, { en: "OLIVE", tr: "Zeytin" }, { en: "PILOT", tr: "Pilot" },
  { en: "RAISE", tr: "Kaldirmak" }, { en: "SCENE", tr: "Sahne" }, { en: "TITLE", tr: "Baslik" },
  { en: "UPPER", tr: "Ust" }, { en: "VERSE", tr: "Mısra" }, { en: "WITCH", tr: "Cadi" },
  { en: "ALARM", tr: "Alarm" }, { en: "BLOOD", tr: "Kan" }, { en: "CRANE", tr: "Vinc" },
]

const KEYBOARD_ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["ENTER","Z","X","C","V","B","N","M","DEL"],
]

const MAX_GUESSES = 6

type CellState = "correct" | "present" | "absent" | "empty" | "active"

function getLetterStates(guess: string, answer: string): CellState[] {
  const states: CellState[] = Array(5).fill("absent")
  const ansArr = answer.split("")
  const used = Array(5).fill(false)

  for (let i = 0; i < 5; i++) {
    if (guess[i] === ansArr[i]) {
      states[i] = "correct"
      used[i] = true
    }
  }
  for (let i = 0; i < 5; i++) {
    if (states[i] === "correct") continue
    const idx = ansArr.findIndex((c, j) => c === guess[i] && !used[j])
    if (idx !== -1) {
      states[i] = "present"
      used[idx] = true
    }
  }
  return states
}

export function WordleGame() {
  const [word, setWord] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)])
  const [guesses, setGuesses] = useState<string[]>([])
  const [current, setCurrent] = useState("")
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [shake, setShake] = useState(false)
  const [streak, setStreak] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    containerRef.current?.focus()
  }, [])

  const keyboardColors = useCallback(() => {
    const map: Record<string, CellState> = {}
    guesses.forEach(g => {
      const states = getLetterStates(g, word.en)
      g.split("").forEach((c, i) => {
        if (states[i] === "correct") map[c] = "correct"
        else if (states[i] === "present" && map[c] !== "correct") map[c] = "present"
        else if (!map[c]) map[c] = "absent"
      })
    })
    return map
  }, [guesses, word.en])

  const handleKey = useCallback((key: string) => {
    if (gameOver) return
    if (key === "DEL" || key === "BACKSPACE") {
      setCurrent(prev => prev.slice(0, -1))
    } else if (key === "ENTER") {
      if (current.length !== 5) {
        setShake(true)
        setTimeout(() => setShake(false), 400)
        return
      }
      const newGuesses = [...guesses, current]
      setGuesses(newGuesses)
      if (current === word.en) {
        setWon(true)
        setGameOver(true)
        setStreak(s => s + 1)
        playSoundEffect("complete")
        const xp = Math.max(10, 30 - (newGuesses.length - 1) * 5)
        showXpToast(xp, `${newGuesses.length}. tahminde buldun!`)
        if (streak + 1 >= 3) showAchievementToast("Wordle serisi!")
      } else if (newGuesses.length >= MAX_GUESSES) {
        setGameOver(true)
        setStreak(0)
        playSoundEffect("wrong")
      } else {
        playSoundEffect("correct")
      }
      setCurrent("")
    } else if (/^[A-Z]$/.test(key) && current.length < 5) {
      setCurrent(prev => prev + key)
    }
  }, [current, gameOver, guesses, word.en, streak])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const key = e.key.toUpperCase()
    if (key === "BACKSPACE") handleKey("DEL")
    else if (key === "ENTER") handleKey("ENTER")
    else if (/^[A-Z]$/.test(key)) handleKey(key)
  }, [handleKey])

  const reset = () => {
    setWord(WORDS[Math.floor(Math.random() * WORDS.length)])
    setGuesses([])
    setCurrent("")
    setGameOver(false)
    setWon(false)
  }

  const kbColors = keyboardColors()

  const cellBg = (state: CellState) => {
    if (state === "correct") return "bg-emerald-500 text-white border-emerald-500"
    if (state === "present") return "bg-amber-500 text-white border-amber-500"
    if (state === "absent") return "bg-muted text-muted-foreground border-muted"
    return "border-border"
  }

  const kbBg = (letter: string) => {
    const s = kbColors[letter]
    if (s === "correct") return "bg-emerald-500 text-white"
    if (s === "present") return "bg-amber-500 text-white"
    if (s === "absent") return "bg-muted/80 text-muted-foreground"
    return "bg-card hover:bg-muted"
  }

  return (
    <div ref={containerRef} tabIndex={0} onKeyDown={handleKeyDown} className="outline-none">
      <Card className="border-0 shadow-none bg-transparent">
        <CardContent className="p-0 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground tracking-wide">5 harfli kelimeyi bul</p>
              {streak > 0 && <p className="text-xs text-amber-600 font-medium">Seri: {streak}</p>}
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" onClick={() => setShowHelp(!showHelp)} className="h-8 w-8">
                {showHelp ? <X className="w-4 h-4" /> : <HelpCircle className="w-4 h-4" />}
              </Button>
              <Button size="icon" variant="ghost" onClick={reset} className="h-8 w-8">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {showHelp && (
            <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 space-y-1 animate-scale-in">
              <p><span className="inline-block w-4 h-4 rounded bg-emerald-500 align-middle mr-1" /> Dogru harf, dogru yer</p>
              <p><span className="inline-block w-4 h-4 rounded bg-amber-500 align-middle mr-1" /> Dogru harf, yanlis yer</p>
              <p><span className="inline-block w-4 h-4 rounded bg-muted align-middle mr-1 border" /> Kelimede yok</p>
            </div>
          )}

          {/* Grid */}
          <div className="flex flex-col items-center gap-1.5">
            {Array.from({ length: MAX_GUESSES }).map((_, row) => {
              const isGuessed = row < guesses.length
              const isCurrent = row === guesses.length && !gameOver
              const letters = isGuessed ? guesses[row].split("") : isCurrent ? current.padEnd(5, " ").split("") : Array(5).fill(" ")
              const states = isGuessed ? getLetterStates(guesses[row], word.en) : letters.map((_, i) => isCurrent && i < current.length ? "active" as CellState : "empty" as CellState)

              return (
                <div key={row} className={cn("flex gap-1.5", isCurrent && shake && "animate-shake")}>
                  {letters.map((letter, col) => (
                    <div
                      key={col}
                      className={cn(
                        "w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-lg font-bold rounded-lg border-2 transition-all duration-300",
                        cellBg(states[col]),
                        isGuessed && "animate-scale-in",
                        states[col] === "active" && "border-primary/50 scale-105"
                      )}
                      style={isGuessed ? { animationDelay: `${col * 80}ms` } : undefined}
                    >
                      {letter.trim()}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>

          {/* Game Over */}
          {gameOver && (
            <div className="text-center animate-scale-in space-y-3">
              {won ? (
                <p className="text-lg font-bold text-emerald-600">{guesses.length}. tahminde buldun!</p>
              ) : (
                <p className="text-lg font-bold text-destructive">Cevap: <span className="text-foreground">{word.en}</span> ({word.tr})</p>
              )}
              <div className="flex flex-col gap-2">
                <Button onClick={reset} className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" />Yeni Kelime
                </Button>
                <ShareChallenge
                  title="Wordle Sonucum"
                  scoreText={won ? `Wordle'i ${guesses.length}/6 tahminde cozdum!` : `Wordle'da kaybettim. Kelime: ${word.en}`}
                  challengeText="Sen kac tahminde bulabilirsin?"
                  toolSlug="wordle"
                />
              </div>
            </div>
          )}

          {/* Keyboard */}
          {!gameOver && (
            <div className="flex flex-col items-center gap-1.5 pt-2">
              {KEYBOARD_ROWS.map((row, ri) => (
                <div key={ri} className="flex gap-1">
                  {row.map(key => (
                    <button
                      key={key}
                      onClick={() => handleKey(key)}
                      className={cn(
                        "h-10 rounded-md text-xs sm:text-sm font-semibold transition-colors",
                        key.length > 1 ? "px-2.5 sm:px-3 bg-primary text-primary-foreground hover:bg-primary/90" : cn("w-8 sm:w-9", kbBg(key))
                      )}
                    >
                      {key === "DEL" ? "←" : key}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
