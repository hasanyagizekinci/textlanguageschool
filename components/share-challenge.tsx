"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Share2, Check, Copy, MessageCircle, Send, Swords, Trophy, Link2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  type ChallengeData,
  encodeChallengeData,
  randomSeed,
} from "@/lib/challenge"

interface ShareChallengeProps {
  title: string
  scoreText: string
  challengeText?: string
  toolSlug?: string
  /** Enable seed-based "Meydan Oku" feature. Pass score + total to activate. */
  challengeScore?: number
  challengeTotal?: number
  /** Seed to reproduce the same questions for friends */
  challengeSeed?: number
}

export function ShareChallenge({
  title,
  scoreText,
  challengeText,
  toolSlug,
  challengeScore,
  challengeTotal,
  challengeSeed,
}: ShareChallengeProps) {
  const [copied, setCopied] = useState(false)
  // Meydan Oku state
  const [challengeStep, setChallengeStep] = useState<"idle" | "name" | "share">("idle")
  const [challengeName, setChallengeName] = useState("")
  const [challengeUrl, setChallengeUrl] = useState("")
  const [challengeCopied, setChallengeCopied] = useState(false)

  const hasMeydanOku = challengeScore !== undefined && challengeTotal !== undefined && challengeTotal > 0

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://www.textlanguageschool.net"
  const toolUrl = `${baseUrl}/meydan-oku`

  const fullText = challengeText
    ? `${scoreText}\n\n${challengeText}\n${toolUrl}`
    : `${scoreText}\n\nSen de dene: ${toolUrl}`

  const whatsappText = encodeURIComponent(fullText)
  const telegramText = encodeURIComponent(fullText)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* noop */ }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: scoreText, url: toolUrl })
      } catch { /* cancelled */ }
    } else {
      handleCopy()
    }
  }

  // Meydan Oku: generate link
  const generateChallengeLink = () => {
    if (!hasMeydanOku) return
    const displayName = challengeName.trim() || "Anonim"
    const data: ChallengeData = {
      g: toolSlug || "quiz",
      s: challengeSeed ?? randomSeed(),
      n: displayName,
      sc: challengeScore!,
      t: challengeTotal!,
      ts: Date.now(),
      m: "challenge",
    }
    const encoded = encodeChallengeData(data)
    const url = `${baseUrl}/meydan-oku?d=${encoded}`
    setChallengeUrl(url)
    setChallengeStep("share")
  }

  const percentage = hasMeydanOku ? Math.round((challengeScore! / challengeTotal!) * 100) : 0
  const challengeShareText = hasMeydanOku
    ? `${challengeName.trim() || "Anonim"} sana meydan okuyor! ${title}'da %${percentage} yaptı. Aynı soruları çöz, yenebilir misin?`
    : ""

  const handleChallengeShare = (platform: "whatsapp" | "telegram" | "copy") => {
    const text = `${challengeShareText}\n\n${challengeUrl}`
    if (platform === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank")
    } else if (platform === "telegram") {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(challengeUrl)}&text=${encodeURIComponent(challengeShareText)}`, "_blank")
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setChallengeCopied(true)
        setTimeout(() => setChallengeCopied(false), 2000)
      }).catch(() => {})
    }
  }

  return (
    <div className="space-y-4 w-full">
      {/* Meydan Oku Section */}
      {hasMeydanOku && (
        <div className="border border-primary/20 rounded-xl p-4 bg-primary/5 space-y-3">
          {challengeStep === "idle" && (
            <Button
              onClick={() => setChallengeStep("name")}
              className="w-full gap-2 bg-primary hover:bg-primary/90"
              size="sm"
            >
              <Swords className="w-4 h-4" />
              Meydan Oku!
            </Button>
          )}

          {challengeStep === "name" && (
            <div className="space-y-2">
              <p className="text-xs text-primary font-semibold text-center">Arkadaşına aynı soruları gönder!</p>
              <Input
                placeholder="Adını gir (opsiyonel)"
                value={challengeName}
                onChange={(e) => setChallengeName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && generateChallengeLink()}
                className="text-sm h-9"
              />
              <Button onClick={generateChallengeLink} className="w-full gap-2" size="sm">
                <Link2 className="w-4 h-4" />
                Link Oluştur
              </Button>
            </div>
          )}

          {challengeStep === "share" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 justify-center">
                <Trophy className="w-4 h-4 text-primary" />
                <p className="text-xs font-bold text-primary">Meydan Okuma Linki Hazır!</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleChallengeShare("whatsapp")}
                  variant="outline"
                  className="flex-1 bg-transparent hover:bg-green-50 hover:border-green-300 hover:text-green-700"
                  size="sm"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  WhatsApp
                </Button>
                <Button
                  onClick={() => handleChallengeShare("telegram")}
                  variant="outline"
                  className="flex-1 bg-transparent hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                  size="sm"
                >
                  <Send className="w-4 h-4 mr-1" />
                  Telegram
                </Button>
              </div>
              <Button
                onClick={() => handleChallengeShare("copy")}
                variant="outline"
                className="w-full bg-transparent"
                size="sm"
              >
                {challengeCopied ? <Check className="w-4 h-4 mr-1.5 text-green-600" /> : <Copy className="w-4 h-4 mr-1.5" />}
                {challengeCopied ? "Kopyalandı!" : "Linki Kopyala"}
              </Button>
            </div>
          )}

          <p className="text-[10px] text-muted-foreground text-center">
            Arkadaşın aynı soruları çözecek ve skorunuz karşılaştırılacak
          </p>
        </div>
      )}

      {/* Regular share section */}
      <p className="text-xs text-muted-foreground text-center font-medium uppercase tracking-wider">Arkadaşlarını davet et</p>
      <div className="flex gap-2">
        <Button
          onClick={() => window.open(`https://wa.me/?text=${whatsappText}`, "_blank")}
          variant="outline"
          className="flex-1 bg-transparent hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all"
          size="sm"
        >
          <MessageCircle className="w-4 h-4 mr-1.5" />
          WhatsApp
        </Button>
        <Button
          onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(toolUrl)}&text=${telegramText}`, "_blank")}
          variant="outline"
          className="flex-1 bg-transparent hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all"
          size="sm"
        >
          <Send className="w-4 h-4 mr-1.5" />
          Telegram
        </Button>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={handleNativeShare}
          variant="outline"
          className="flex-1 bg-transparent"
          size="sm"
        >
          <Share2 className="w-4 h-4 mr-1.5" />
          Paylaş
        </Button>
        <Button
          onClick={handleCopy}
          variant="outline"
          className="flex-1 bg-transparent"
          size="sm"
        >
          {copied ? <Check className="w-4 h-4 mr-1.5 text-green-600" /> : <Copy className="w-4 h-4 mr-1.5" />}
          {copied ? "Kopyalandı" : "Kopyala"}
        </Button>
      </div>
    </div>
  )
}
