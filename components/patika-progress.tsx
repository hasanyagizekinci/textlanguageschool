"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { getBadgeHint, loadProgress } from "@/lib/xp-system"

interface PatikaProgressProps {
  current: number
  total: number
  correctStreak?: number
  lastAnswerCorrect?: boolean | null
}

export function PatikaProgress({ current, total, correctStreak = 0, lastAnswerCorrect = null }: PatikaProgressProps) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0
  const [pulse, setPulse] = useState<"correct" | "wrong" | null>(null)
  const prevCorrect = useRef(lastAnswerCorrect)

  useEffect(() => {
    if (lastAnswerCorrect === null || lastAnswerCorrect === prevCorrect.current) return
    prevCorrect.current = lastAnswerCorrect
    setPulse(lastAnswerCorrect ? "correct" : "wrong")
    const t = setTimeout(() => setPulse(null), 600)
    return () => clearTimeout(t)
  }, [lastAnswerCorrect, current])

  // Badge hint
  const [hint, setHint] = useState<string | null>(null)
  useEffect(() => {
    const p = loadProgress()
    setHint(getBadgeHint(p))
  }, [current])

  return (
    <div className="mb-5">
      {hint && (
        <p className="text-[11px] text-center text-muted-foreground/70 mb-2">{hint}</p>
      )}

      {/* The path itself */}
      <div className="relative w-full h-2.5 rounded-full overflow-hidden bg-muted/50">
        {/* Frost texture -- subtle repeating pattern on unmelted snow */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(255,255,255,0.4) 4px, rgba(255,255,255,0.4) 5px)",
        }} />

        {/* Melted trail */}
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out",
            percent >= 80
              ? "bg-gradient-to-r from-amber-400/90 to-orange-300/80"
              : percent >= 50
                ? "bg-gradient-to-r from-sky-400/80 to-teal-300/70"
                : "bg-gradient-to-r from-slate-400/70 to-slate-300/60",
            pulse === "correct" && "brightness-125",
            pulse === "wrong" && "opacity-70",
          )}
          style={{ width: `${percent}%` }}
        />

        {/* Walker -- a tiny snowflake at the edge */}
        {percent > 2 && (
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-out",
              pulse === "correct" && "scale-150",
              pulse === "wrong" && "scale-75 opacity-50",
            )}
            style={{ left: `calc(${Math.min(percent, 97)}% - 5px)` }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" className={cn(
              "drop-shadow-sm",
              percent >= 80 ? "text-amber-100" : percent >= 50 ? "text-sky-100" : "text-white",
            )}>
              <g transform="translate(5,5)" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" fill="none">
                {[0,60,120,180,240,300].map(a => (
                  <line key={a} x1={0} y1={0} x2={0} y2={-3.5} transform={`rotate(${a})`} />
                ))}
              </g>
            </svg>
          </div>
        )}
      </div>

      {/* Minimal counter */}
      <div className="flex items-center justify-between mt-1 px-0.5">
        <span className="text-[10px] text-muted-foreground/60 tabular-nums">{current}/{total}</span>
        {correctStreak >= 3 && (
          <span className="text-[10px] text-amber-600/80">{correctStreak} seri</span>
        )}
      </div>
    </div>
  )
}
