"use client"

import { cn } from "@/lib/utils"

interface SnowflakeIdentityProps {
  progress: number
  streak?: number
  resultMode?: "low" | "medium" | "high" | null
}

export function SnowflakeIdentity({ progress, streak = 0, resultMode = null }: SnowflakeIdentityProps) {
  const meltLevel = Math.min(progress / 100, 1)
  const isStreakGlow = streak >= 3

  if (resultMode) {
    const colors = {
      low: "text-blue-300",
      medium: "text-teal-400",
      high: "text-amber-400",
    }
    return (
      <span className={cn("text-lg transition-all duration-500", colors[resultMode])}>
        {resultMode === "high" ? "\u2728" : resultMode === "medium" ? "\uD83D\uDCA7" : "\u2744\uFE0F"}
      </span>
    )
  }

  // Snowflake melts as progress increases: fully visible at 0%, glowing droplet at 100%
  if (meltLevel > 0.85) {
    return (
      <span className={cn(
        "inline-flex items-center justify-center w-7 h-7 rounded-full text-sm transition-all duration-500",
        isStreakGlow ? "bg-amber-100 shadow-[0_0_8px_rgba(251,191,36,0.4)]" : "bg-blue-50"
      )}>
        {"\uD83D\uDCA7"}
      </span>
    )
  }

  return (
    <span className={cn(
      "inline-flex items-center justify-center w-7 h-7 rounded-full text-base transition-all duration-500",
      isStreakGlow
        ? "bg-blue-100 shadow-[0_0_6px_rgba(147,197,253,0.6)]"
        : "bg-blue-50/80",
    )}
    style={{ opacity: Math.max(0.4, 1 - meltLevel * 0.5) }}
    >
      {"\u2744\uFE0F"}
    </span>
  )
}
