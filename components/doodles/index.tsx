import { cn } from "@/lib/utils"

interface DoodleProps {
  className?: string
  size?: number
}

export function DoodleStar({ className, size = 24 }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn("text-foreground/30", className)}>
      <path
        d="M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function DoodleArrow({ className, size = 24 }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn("text-foreground/30", className)}>
      <path
        d="M4 12c4-1 8-0.5 14-1M14 7c2 2.5 4 4 4 5s-1.5 2.5-4 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function DoodleCircle({ className, size = 24 }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn("text-foreground/30", className)}>
      <path
        d="M12 4c4.5-0.5 8.5 3 8 8s-4 8.5-8.5 8-8-3.5-7.5-8S7.5 4.5 12 4z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function DoodleUnderline({ className, size = 80 }: DoodleProps) {
  return (
    <svg width={size} height={size * 0.15} viewBox="0 0 80 12" fill="none" className={cn("text-foreground/25", className)}>
      <path
        d="M2 8c12-4 28-5 40-3s24 2 36-1"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function DoodleSparkle({ className, size = 20 }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={cn("text-foreground/30", className)}>
      <path
        d="M10 2v4M10 14v4M2 10h4M14 10h4M4.5 4.5l2.5 2.5M13 13l2.5 2.5M15.5 4.5l-2.5 2.5M7 13l-2.5 2.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function DoodleBurst({ className, size = 24 }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn("text-foreground/30", className)}>
      <path
        d="M12 4v3M12 17v3M4 12h3M17 12h3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function DoodleTarget({ className, size = 24 }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn("text-foreground/30", className)}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 3" />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  )
}

export function DoodleLightning({ className, size = 24 }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn("text-foreground/30", className)}>
      <path
        d="M13 2L5 14h6l-2 8 9-12h-6l2-8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function DoodleFlag({ className, size = 24 }: DoodleProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn("text-foreground/30", className)}>
      <path
        d="M5 3v18M5 3c3 2 6 0 9 2s6 0 6 0v10c-3 2-6 0-6 0s-6-2-9 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Small sparkle burst for success animations */
export function SparkleEffect({ active, className }: { active: boolean; className?: string }) {
  if (!active) return null
  return (
    <span className={cn("pointer-events-none absolute inset-0 flex items-center justify-center", className)}>
      {Array.from({ length: 8 }).map((_, i) => (
        <span
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/70 sparkle-particle"
          style={{
            transform: `rotate(${i * 45}deg) translateY(-10px)`,
            animationDelay: `${i * 30}ms`,
          }}
        />
      ))}
    </span>
  )
}
