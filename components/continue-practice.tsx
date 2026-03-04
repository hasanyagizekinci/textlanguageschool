"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const GAME_LABELS: Record<string, string> = {
  wordle: "Wordle",
  hangman: "Adam Asmaca",
  match: "Kelime Eşleştir",
  flashcard: "Kelime Kartları",
  blitz: "Blitz Challenge",
  accent: "Accent Challenge",
  scooter: "Scooter Ride",
  snowchallenge: "Kar Fırtınası",
  daily: "Günün Challenge'ı",
  exam: "Sınav Pratiği",
  grammar: "Gramer Kartları",
  sentence: "Cümle Kur",
  collocation: "Collocations",
  transform: "Cümle Dönüşümü",
  error: "Hata Bul",
}

const GAME_ROUTES: Record<string, string> = {
  scooter: "/meydan-oku?game=scooter",
  accent: "/meydan-oku?game=speaking",
  "meydan-oku": "/meydan-oku",
}

export function ContinuePractice() {
  const [lastGame, setLastGame] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("last-played-game")
    if (stored) setLastGame(stored)
  }, [])

  if (!lastGame) return null

  const label = GAME_LABELS[lastGame] || lastGame
  const href = GAME_ROUTES[lastGame] || `/#pratik`

  function handleClick() {
    // If it's an inline quiz, dispatch the open event
    if (!GAME_ROUTES[lastGame!]) {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("open-quiz", { detail: lastGame }))
      }, 600)
    }
  }

  return (
    <section className="px-4 pb-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href={href}
          onClick={handleClick}
          className="doodle-card flex items-center gap-3 p-3.5 rounded-xl border border-border/50 bg-card/80 hover:bg-card transition-all group"
        >
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <ArrowRight className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Devam Et</p>
            <p className="text-sm font-semibold text-foreground truncate">{label}</p>
          </div>
          <span className="text-xs font-medium text-primary group-hover:translate-x-0.5 transition-transform">
            {"Devam Et"}
          </span>
        </Link>
      </div>
    </section>
  )
}
