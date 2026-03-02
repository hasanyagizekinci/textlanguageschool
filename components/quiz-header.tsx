"use client"

import { PatikaProgress } from "@/components/patika-progress"
import { SnowflakeIdentity } from "@/components/snowflake-identity"

interface QuizHeaderProps {
  title: string
  current: number
  total: number
  correctStreak?: number
  lastAnswerCorrect?: boolean | null
  resultMode?: "low" | "medium" | "high" | null
}

export function QuizHeader({
  title,
  current,
  total,
  correctStreak = 0,
  lastAnswerCorrect = null,
  resultMode = null,
}: QuizHeaderProps) {
  const progress = total > 0 ? Math.round((current / total) * 100) : 0

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <SnowflakeIdentity
            progress={progress}
            streak={correctStreak}
            resultMode={resultMode}
          />
          <h3 className="text-sm font-bold text-foreground">{title}</h3>
        </div>
        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {current}/{total}
        </span>
      </div>
      {!resultMode && (
        <PatikaProgress
          current={current}
          total={total}
          correctStreak={correctStreak}
          lastAnswerCorrect={lastAnswerCorrect}
        />
      )}
    </div>
  )
}
