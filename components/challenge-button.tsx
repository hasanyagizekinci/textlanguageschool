"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Swords, Copy, Check, MessageCircle, Send, X, Trophy, Link2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  type ChallengeData,
  encodeChallengeData,
  randomSeed,
} from "@/lib/challenge"

interface ChallengeButtonProps {
  gameSlug: string
  gameName: string
  score: number
  total: number
  /** If provided, uses this seed so the friend gets the same questions */
  questionSeed?: number
  mode?: "challenge" | "duel"
  className?: string
}

export function ChallengeButton({
  gameSlug,
  gameName,
  score,
  total,
  questionSeed,
  mode = "challenge",
  className,
}: ChallengeButtonProps) {
  const [step, setStep] = useState<"idle" | "name" | "share">("idle")
  const [name, setName] = useState("")
  const [copied, setCopied] = useState(false)
  const [challengeUrl, setChallengeUrl] = useState("")

  const percentage = Math.round((score / total) * 100)

  const generate = () => {
    const displayName = name.trim() || "Anonim"
    const data: ChallengeData = {
      g: gameSlug,
      s: questionSeed ?? randomSeed(),
      n: displayName,
      sc: score,
      t: total,
      ts: Date.now(),
      m: mode === "duel" ? "duel" : "challenge",
    }
    const encoded = encodeChallengeData(data)
    const base =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://www.textlanguageschool.net"
    setChallengeUrl(`${base}/meydan-oku?d=${encoded}`)
    setStep("share")
  }

  const shareText =
    mode === "duel"
      ? `${name.trim() || "Bir arkadaşın"} seni ${gameName} duello'suna davet ediyor! Skoru: %${percentage} (${score}/${total}). Onu yenebilir misin?`
      : `${gameName}'de %${percentage} başarı yakaladım! Beni geçebilir misin?`

  const fullShareText = `${shareText}\n\n${challengeUrl}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullShareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* noop */ }
  }

  if (step === "idle") {
    return (
      <Button
        onClick={() => setStep("name")}
        variant="outline"
        className={cn(
          "gap-2 border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50 transition-all font-semibold",
          className
        )}
      >
        <Swords className="w-4 h-4" />
        {mode === "duel" ? "Duello Başlat" : "Meydan Oku"}
      </Button>
    )
  }

  if (step === "name") {
    return (
      <div className="w-full space-y-3 animate-fade-up">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">
            {mode === "duel" ? "Duello Daveti" : "Meydan Okuma"}
          </p>
          <button onClick={() => setStep("idle")} className="p-1 rounded-md hover:bg-muted">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/15">
          <Trophy className="w-5 h-5 text-primary shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-foreground">{gameName}</p>
            <p className="text-muted-foreground">
              Skorun: <span className="font-bold text-primary">{score}/{total}</span> (%{percentage})
            </p>
          </div>
        </div>
        <Input
          placeholder="Adını gir (opsiyonel)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generate()}
          className="bg-background"
          maxLength={20}
        />
        <Button onClick={generate} className="w-full gap-2">
          <Link2 className="w-4 h-4" />
          Link Oluştur
        </Button>
      </div>
    )
  }

  // step === "share"
  return (
    <div className="w-full space-y-3 animate-fade-up">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">
          {mode === "duel" ? "Duello Linki Hazır!" : "Meydan Okuma Linki Hazır!"}
        </p>
        <button onClick={() => setStep("idle")} className="p-1 rounded-md hover:bg-muted">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="p-3 rounded-xl bg-muted/50 border border-border">
        <p className="text-xs text-muted-foreground break-all line-clamp-2 font-mono">
          {challengeUrl}
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() =>
            window.open(
              `https://wa.me/?text=${encodeURIComponent(fullShareText)}`,
              "_blank"
            )
          }
          variant="outline"
          className="flex-1 bg-transparent hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all"
          size="sm"
        >
          <MessageCircle className="w-4 h-4 mr-1.5" />
          WhatsApp
        </Button>
        <Button
          onClick={() =>
            window.open(
              `https://t.me/share/url?url=${encodeURIComponent(challengeUrl)}&text=${encodeURIComponent(shareText)}`,
              "_blank"
            )
          }
          variant="outline"
          className="flex-1 bg-transparent hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all"
          size="sm"
        >
          <Send className="w-4 h-4 mr-1.5" />
          Telegram
        </Button>
      </div>
      <Button onClick={handleCopy} variant="outline" className="w-full bg-transparent" size="sm">
        {copied ? (
          <Check className="w-4 h-4 mr-1.5 text-green-600" />
        ) : (
          <Copy className="w-4 h-4 mr-1.5" />
        )}
        {copied ? "Kopyalandı!" : "Linki Kopyala"}
      </Button>
    </div>
  )
}
