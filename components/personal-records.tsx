"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Trophy, Medal, Star, TrendingUp, Copy, Check,
  MessageCircle, Send, Share2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getAllRecords, getDailyStreak, type GameRecord } from "@/lib/records"

const MEDAL_COLORS: Record<number, { bg: string; text: string; icon: string }> = {
  0: { bg: "bg-yellow-100", text: "text-yellow-700", icon: "text-yellow-500" },
  1: { bg: "bg-gray-100", text: "text-gray-600", icon: "text-gray-400" },
  2: { bg: "bg-orange-100", text: "text-orange-700", icon: "text-orange-400" },
}

export function PersonalRecords() {
  const [records, setRecords] = useState<GameRecord[]>([])
  const [streak, setStreak] = useState(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setRecords(getAllRecords())
    setStreak(getDailyStreak())
  }, [])

  const avgPercentage =
    records.length > 0
      ? Math.round(records.reduce((sum, r) => sum + r.percentage, 0) / records.length)
      : 0

  const handleShare = async () => {
    if (records.length === 0) return
    const lines = [
      "TEXT Language School - Kişisel Rekorlarım",
      "",
      ...records.slice(0, 5).map(
        (r, i) => `${i + 1}. ${r.gameName}: %${r.percentage} (${r.score}/${r.total})`
      ),
      "",
      `Ortalama: %${avgPercentage}`,
      streak > 0 ? `Günlük Seri: ${streak} gün` : "",
      "",
      "Sen de dene: textlanguageschool.net",
    ]
    const text = lines.filter(Boolean).join("\n")
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* noop */ }
  }

  if (records.length === 0) {
    return (
      <Card className="border-dashed border-muted-foreground/20">
        <CardContent className="p-6 text-center space-y-3">
          <Trophy className="w-10 h-10 text-muted-foreground/30 mx-auto" />
          <div>
            <p className="text-sm font-semibold text-muted-foreground">Henüz Rekor Yok</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Oyunları tamamladıkça en iyi skorların burada görünecek.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="border-primary/10">
          <CardContent className="p-3 text-center">
            <Trophy className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-lg font-serif font-bold text-foreground">{records.length}</p>
            <p className="text-[10px] text-muted-foreground">Oyun</p>
          </CardContent>
        </Card>
        <Card className="border-primary/10">
          <CardContent className="p-3 text-center">
            <TrendingUp className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-lg font-serif font-bold text-foreground">%{avgPercentage}</p>
            <p className="text-[10px] text-muted-foreground">Ortalama</p>
          </CardContent>
        </Card>
        <Card className="border-primary/10">
          <CardContent className="p-3 text-center">
            <Star className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-lg font-serif font-bold text-foreground">{streak}</p>
            <p className="text-[10px] text-muted-foreground">Gün Seri</p>
          </CardContent>
        </Card>
      </div>

      {/* Records list */}
      <div className="space-y-2">
        {records.map((record, idx) => {
          const medal = MEDAL_COLORS[idx]
          return (
            <div
              key={record.gameSlug}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border transition-all",
                idx < 3 ? `${medal?.bg} border-transparent` : "bg-card border-border"
              )}
            >
              {/* Rank */}
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                  idx < 3 ? medal?.bg : "bg-muted"
                )}
              >
                {idx < 3 ? (
                  <Medal className={cn("w-4 h-4", medal?.icon)} />
                ) : (
                  <span className="text-xs font-bold text-muted-foreground">{idx + 1}</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-semibold truncate", idx < 3 ? medal?.text : "text-foreground")}>
                  {record.gameName}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {new Date(record.date).toLocaleDateString("tr-TR")}
                </p>
              </div>

              {/* Score */}
              <div className="text-right shrink-0">
                <p className={cn("text-sm font-bold", idx < 3 ? medal?.text : "text-foreground")}>
                  %{record.percentage}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {record.score}/{record.total}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Share button */}
      <Button onClick={handleShare} variant="outline" className="w-full bg-transparent gap-2" size="sm">
        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
        {copied ? "Kopyalandı!" : "Rekorlarımı Paylaş"}
      </Button>
    </div>
  )
}
