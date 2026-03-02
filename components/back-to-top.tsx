"use client"

import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"

export function BackToTop() {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setVisible(scrollY > 400)
      setProgress(docHeight > 0 ? Math.min((scrollY / docHeight) * 100, 100) : 0)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollUp = () => window.scrollTo({ top: 0, behavior: "smooth" })

  const r = 18
  const c = 2 * Math.PI * r
  const offset = c - (progress / 100) * c

  return (
    <button
      onClick={scrollUp}
      aria-label="Yukari git"
      className={`fixed bottom-6 left-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-card border border-border/60 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 hover:scale-105 group ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      {/* Progress ring */}
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r={r} fill="none" stroke="currentColor" strokeWidth="2" className="text-border/40" />
        <circle
          cx="20"
          cy="20"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-primary transition-all duration-150"
        />
      </svg>
      <ArrowUp className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors relative z-10" />
    </button>
  )
}
