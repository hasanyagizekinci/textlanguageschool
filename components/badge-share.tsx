"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Share2, Instagram, MessageCircle, X, Download, Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AchievementInfo } from "@/lib/xp-system"
import { LEVEL_INFO, type BadgeLevel } from "@/lib/xp-system"
import Image from "next/image"

interface BadgeShareProps {
  badge: AchievementInfo
  onClose: () => void
}

const BADGE_IMAGES: Record<BadgeLevel, string> = {
  starter: "/badges/starter.jpg",
  explorer: "/badges/explorer.jpg",
  challenger: "/badges/challenger.jpg",
  master: "/badges/master.jpg",
  legend: "/badges/legend.jpg",
}

const LEVEL_ACCENT: Record<BadgeLevel, string> = {
  starter: "#64748b",
  explorer: "#3b82f6",
  challenger: "#8b5cf6",
  master: "#d97706",
  legend: "#e11d48",
}

const LEVEL_GRADIENTS: Record<BadgeLevel, [string, string]> = {
  starter: ["#e2e8f0", "#cbd5e1"],
  explorer: ["#dbeafe", "#93c5fd"],
  challenger: ["#ede9fe", "#c4b5fd"],
  master: ["#fef3c7", "#fbbf24"],
  legend: ["#fce7f3", "#f472b6"],
}

function getShareText(badge: AchievementInfo): string {
  const name = badge.studentName || badge.title
  return `${name} - "${badge.title}" rozetini kazandım! ${badge.subtitle} \u2728\n\ntextlanguageschool.net`
}

function getWhatsAppUrl(badge: AchievementInfo): string {
  const text = encodeURIComponent(getShareText(badge))
  return `https://wa.me/?text=${text}`
}

export function BadgeShareModal({ badge, onClose }: BadgeShareProps) {
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [canNativeShare, setCanNativeShare] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share)
  }, [])

  const generateCanvas = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current
      if (!canvas) { resolve(null); return }
      const ctx = canvas.getContext("2d")
      if (!ctx) { resolve(null); return }

      const W = 1080
      const H = 1920
      canvas.width = W
      canvas.height = H

      const level = badge.level
      const [gradStart, gradEnd] = LEVEL_GRADIENTS[level]
      const accent = LEVEL_ACCENT[level]
      const levelInfo = LEVEL_INFO[level]

      // Load logo first then draw everything
      const logoImg = new window.Image()
      logoImg.crossOrigin = "anonymous"
      logoImg.onload = () => drawScene(logoImg)
      logoImg.onerror = () => drawScene(null)
      logoImg.src = "/logo.png"

      function drawScene(logo: HTMLImageElement | null) {
      if (!ctx) { resolve(null); return }

      // Dark background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H)
      bgGrad.addColorStop(0, "#0f172a")
      bgGrad.addColorStop(0.3, "#1e293b")
      bgGrad.addColorStop(1, "#0f172a")
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, W, H)

      // Subtle decorative circles
      ctx.save()
      ctx.globalAlpha = 0.04
      ctx.beginPath()
      ctx.arc(W * 0.8, H * 0.15, 300, 0, Math.PI * 2)
      ctx.fillStyle = accent
      ctx.fill()
      ctx.beginPath()
      ctx.arc(W * 0.2, H * 0.7, 250, 0, Math.PI * 2)
      ctx.fillStyle = gradEnd
      ctx.fill()
      ctx.restore()

      // Central card
      const cardX = 80
      const cardY = 520
      const cardW = W - 160
      const cardH = 700
      const cardR = 40

      ctx.save()
      ctx.shadowColor = "rgba(0,0,0,0.3)"
      ctx.shadowBlur = 60
      ctx.shadowOffsetY = 20
      ctx.beginPath()
      ctx.roundRect(cardX, cardY, cardW, cardH, cardR)
      ctx.fillStyle = "#ffffff"
      ctx.fill()
      ctx.restore()

      const cardGrad = ctx.createLinearGradient(cardX, cardY, cardX, cardY + cardH)
      cardGrad.addColorStop(0, gradStart)
      cardGrad.addColorStop(1, "#ffffff")
      ctx.beginPath()
      ctx.roundRect(cardX, cardY, cardW, cardH, cardR)
      ctx.fillStyle = cardGrad
      ctx.fill()

      // Accent strip
      ctx.beginPath()
      ctx.roundRect(cardX, cardY, cardW, 8, [cardR, cardR, 0, 0])
      ctx.fillStyle = accent
      ctx.fill()

      // Level pill
      const pillText = levelInfo.label.toUpperCase()
      ctx.font = "bold 28px system-ui, -apple-system, sans-serif"
      const pillW = ctx.measureText(pillText).width + 60
      const pillX = (W - pillW) / 2
      const pillY = cardY + 50
      ctx.beginPath()
      ctx.roundRect(pillX, pillY, pillW, 52, 26)
      ctx.fillStyle = accent
      ctx.fill()
      ctx.fillStyle = "#ffffff"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(pillText, W / 2, pillY + 26)

      // Student name
      ctx.fillStyle = "#1e293b"
      ctx.font = "bold 64px system-ui, -apple-system, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(badge.studentName || badge.title, W / 2, cardY + 180)

      // Badge title
      ctx.fillStyle = accent
      ctx.font = "600 42px system-ui, -apple-system, sans-serif"
      ctx.fillText(badge.title, W / 2, cardY + 260)

      // Subtitle
      ctx.fillStyle = "#64748b"
      ctx.font = "italic 32px system-ui, -apple-system, sans-serif"
      ctx.fillText(`"${badge.subtitle}"`, W / 2, cardY + 330)

      // Category
      ctx.fillStyle = "#94a3b8"
      ctx.font = "500 26px system-ui, -apple-system, sans-serif"
      ctx.fillText(badge.category, W / 2, cardY + 400)

      // Separator
      ctx.strokeStyle = "#e2e8f0"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(cardX + 100, cardY + 450)
      ctx.lineTo(cardX + cardW - 100, cardY + 450)
      ctx.stroke()

      // XP
      ctx.font = "bold 48px system-ui, -apple-system, sans-serif"
      ctx.fillStyle = accent
      ctx.fillText(`${badge.xpRequired} XP`, W / 2, cardY + 530)

      // Description
      ctx.fillStyle = "#475569"
      ctx.font = "400 28px system-ui, -apple-system, sans-serif"
      ctx.fillText(badge.description, W / 2, cardY + 600)

      // Top branding with logo
      if (logo) {
        const logoSize = 100
        ctx.drawImage(logo, (W - logoSize) / 2, 60, logoSize, logoSize)
      }
      ctx.fillStyle = "#f8fafc"
      ctx.font = "bold 36px system-ui, -apple-system, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("TEXT Language School", W / 2, 200)

      ctx.fillStyle = "#94a3b8"
      ctx.font = "400 26px system-ui, -apple-system, sans-serif"
      ctx.fillText("Achievement Unlocked", W / 2, 250)

      // Level progression dots
      const levels: BadgeLevel[] = ["starter", "explorer", "challenger", "master", "legend"]
      const dotSpacing = 140
      const dotsStartX = (W - (levels.length - 1) * dotSpacing) / 2
      const dotsY = cardY + cardH + 180

      levels.forEach((lvl, i) => {
        const x = dotsStartX + i * dotSpacing
        const isCurrent = lvl === level
        const isPast = levels.indexOf(lvl) <= levels.indexOf(level)

        if (i < levels.length - 1) {
          ctx.strokeStyle = isPast ? accent : "#334155"
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.moveTo(x + 20, dotsY)
          ctx.lineTo(x + dotSpacing - 20, dotsY)
          ctx.stroke()
        }

        ctx.beginPath()
        ctx.arc(x, dotsY, isCurrent ? 22 : 14, 0, Math.PI * 2)
        ctx.fillStyle = isPast ? accent : "#334155"
        ctx.fill()

        if (isCurrent) {
          ctx.beginPath()
          ctx.arc(x, dotsY, 10, 0, Math.PI * 2)
          ctx.fillStyle = "#ffffff"
          ctx.fill()
        }

        ctx.fillStyle = isPast ? "#e2e8f0" : "#475569"
        ctx.font = `${isCurrent ? "bold" : "400"} 20px system-ui, -apple-system, sans-serif`
        ctx.textAlign = "center"
        ctx.fillText(LEVEL_INFO[lvl].label, x, dotsY + 50)
      })

      // Watermark
      ctx.fillStyle = "#475569"
      ctx.font = "500 28px system-ui, -apple-system, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("textlanguageschool.net", W / 2, H - 120)

      canvas.toBlob((blob) => resolve(blob), "image/png")

      } // end drawScene
    })
  }, [badge])

  const handleNativeShare = async () => {
    setGenerating(true)
    try {
      const blob = await generateCanvas()
      if (!blob) { setGenerating(false); return }

      const file = new File([blob], `badge-${badge.id}.png`, { type: "image/png" })
      const shareData: ShareData = {
        text: getShareText(badge),
        files: [file],
      }

      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        // Fallback: share without file
        await navigator.share({ text: getShareText(badge) })
      }
    } catch (err: any) {
      // User cancelled or share failed silently
      if (err?.name !== "AbortError") {
        console.error("Share failed:", err)
      }
    }
    setGenerating(false)
  }

  const handleWhatsApp = () => {
    window.open(getWhatsAppUrl(badge), "_blank", "noopener,noreferrer")
  }

  const handleDownload = async () => {
    setGenerating(true)
    const blob = await generateCanvas()
    if (!blob) { setGenerating(false); return }
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.download = `badge-${badge.id}-story.png`
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
    setGenerating(false)
  }

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(getShareText(badge))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const levelInfo = LEVEL_INFO[badge.level]
  const accent = LEVEL_ACCENT[badge.level]
  const badgeImage = BADGE_IMAGES[badge.level]

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 backdrop-blur-sm p-4 pt-12 sm:pt-20 sm:items-center" onClick={onClose} role="dialog" aria-label="Rozeti paylaş">
      <Card className="max-w-sm w-full border border-border/50 rounded-2xl animate-in zoom-in-95 fade-in duration-200 shadow-xl my-auto" onClick={e => e.stopPropagation()}>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-serif text-lg font-semibold">Rozeti Paylaş</h4>
            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-muted transition-colors" aria-label="Kapat">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Preview */}
          <div className="rounded-xl overflow-hidden mb-4 border border-border/30">
            <div className="bg-[#0f172a] p-5 text-center relative">
              {/* Badge image */}
              <div className="relative w-16 h-16 mx-auto mb-3 rounded-2xl overflow-hidden ring-2 ring-white/20">
                <Image src={badgeImage} alt={badge.title} fill className="object-cover" />
              </div>
              <div
                className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-2.5 text-white"
                style={{ backgroundColor: accent }}
              >
                {levelInfo.label}
              </div>
              <p className="text-white font-bold text-lg leading-tight mb-0.5">{badge.studentName || badge.title}</p>
              <p className="text-sm font-medium" style={{ color: accent }}>{badge.title}</p>
              <p className="text-[11px] text-slate-400 italic mt-1">{`"${badge.subtitle}"`}</p>
              <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-center gap-3">
                <span className="text-[11px] text-slate-500">{badge.category}</span>
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                <span className="text-[11px] font-bold" style={{ color: accent }}>{badge.xpRequired} XP</span>
              </div>
            </div>
          </div>

          {/* Hidden canvas */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Share actions */}
          <div className="space-y-2">
            {/* Primary: Native share (shows Instagram, WhatsApp, etc.) */}
            {canNativeShare && (
              <Button
                onClick={handleNativeShare}
                disabled={generating}
                className="w-full"
                size="sm"
              >
                <Share2 className="w-4 h-4 mr-2" />
                {generating ? "Hazırlanıyor..." : "Instagram / Sosyal Medyada Paylaş"}
              </Button>
            )}

            {/* WhatsApp direct */}
            <Button
              onClick={handleWhatsApp}
              variant="outline"
              className="w-full bg-transparent border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
              size="sm"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              {"WhatsApp'ta Paylaş"}
            </Button>

            {/* Secondary row */}
            <div className="flex gap-2">
              <Button onClick={handleDownload} variant="outline" className="flex-1 bg-transparent" size="sm" disabled={generating}>
                <Download className="w-4 h-4 mr-1.5" />
                Story İndir
              </Button>
              <Button onClick={handleCopyText} variant="outline" className="flex-1 bg-transparent" size="sm">
                {copied ? <Check className="w-4 h-4 mr-1.5 text-emerald-600" /> : <Copy className="w-4 h-4 mr-1.5" />}
                {copied ? "Kopyalandı" : "Metin Kopyala"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
