"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Star, Award } from "lucide-react"
import { cn } from "@/lib/utils"

interface XpNotification {
  id: number
  amount: number
  label: string
  achievement?: string
}

let notifId = 0

function playChime(type: "xp" | "achievement" | "correct" | "wrong" | "complete") {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    gain.gain.value = 0.08

    if (type === "xp") {
      osc.frequency.value = 880
      osc.type = "sine"
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.15)
    } else if (type === "achievement") {
      osc.frequency.value = 523.25
      osc.type = "sine"
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.4)
      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.connect(gain2)
      gain2.connect(ctx.destination)
      osc2.frequency.value = 659.25
      osc2.type = "sine"
      gain2.gain.value = 0.08
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35)
      osc2.start(ctx.currentTime + 0.12)
      osc2.stop(ctx.currentTime + 0.4)
      const osc3 = ctx.createOscillator()
      const gain3 = ctx.createGain()
      osc3.connect(gain3)
      gain3.connect(ctx.destination)
      osc3.frequency.value = 783.99
      osc3.type = "sine"
      gain3.gain.value = 0.08
      gain3.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
      osc3.start(ctx.currentTime + 0.24)
      osc3.stop(ctx.currentTime + 0.5)
    } else if (type === "correct") {
      osc.frequency.value = 660
      osc.type = "sine"
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.12)
      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.connect(gain2)
      gain2.connect(ctx.destination)
      osc2.frequency.value = 880
      osc2.type = "sine"
      gain2.gain.value = 0.06
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
      osc2.start(ctx.currentTime + 0.08)
      osc2.stop(ctx.currentTime + 0.2)
    } else if (type === "wrong") {
      osc.frequency.value = 200
      osc.type = "triangle"
      gain.gain.value = 0.05
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.2)
    } else if (type === "complete") {
      osc.frequency.value = 440
      osc.type = "sine"
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.5)
      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.connect(gain2)
      gain2.connect(ctx.destination)
      osc2.frequency.value = 554.37
      osc2.type = "sine"
      gain2.gain.value = 0.07
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
      osc2.start(ctx.currentTime + 0.15)
      osc2.stop(ctx.currentTime + 0.5)
      const osc3 = ctx.createOscillator()
      const gain3 = ctx.createGain()
      osc3.connect(gain3)
      gain3.connect(ctx.destination)
      osc3.frequency.value = 659.25
      osc3.type = "sine"
      gain3.gain.value = 0.07
      gain3.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35)
      osc3.start(ctx.currentTime + 0.3)
      osc3.stop(ctx.currentTime + 0.6)
    }
    setTimeout(() => ctx.close(), 1000)
  } catch { /* Audio not supported */ }
}

export function XpToastContainer() {
  const [notifications, setNotifications] = useState<XpNotification[]>([])
  const soundEnabled = useRef(true)

  useEffect(() => {
    const stored = localStorage.getItem("tls-sound")
    if (stored === "off") soundEnabled.current = false
  }, [])

  const handleXpGain = useCallback((e: Event) => {
    const detail = (e as CustomEvent).detail
    const id = ++notifId
    const notif: XpNotification = {
      id,
      amount: detail.amount || 0,
      label: detail.label || "",
      achievement: detail.achievement,
    }
    setNotifications(prev => [...prev.slice(-2), notif])
    if (soundEnabled.current) {
      playChime(notif.achievement ? "achievement" : "xp")
    }
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 2200)
  }, [])

  useEffect(() => {
    window.addEventListener("xp-gain-toast", handleXpGain)
    return () => window.removeEventListener("xp-gain-toast", handleXpGain)
  }, [handleXpGain])

  if (notifications.length === 0) return null

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:bottom-auto md:top-20 md:right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {notifications.map((notif, i) => (
        <div
          key={notif.id}
          className={cn(
            "animate-in fade-in zoom-in-95 slide-in-from-bottom-2 md:slide-in-from-right-4 duration-300",
            "px-4 py-2.5 rounded-2xl shadow-xl border backdrop-blur-sm",
            notif.achievement
              ? "bg-gradient-to-r from-purple-50/95 to-amber-50/95 border-purple-200/80"
              : "bg-gradient-to-r from-amber-50/95 to-orange-50/95 border-amber-200/80"
          )}
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <div className="flex items-center gap-2.5">
            {notif.achievement ? (
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4 text-purple-600" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                <Star className="w-4 h-4 text-amber-600" />
              </div>
            )}
            <div>
              {notif.achievement ? (
                <p className="text-sm font-bold text-purple-700">{notif.achievement}</p>
              ) : (
                <p className="text-sm font-bold text-amber-700">+{notif.amount} XP</p>
              )}
              {notif.label && (
                <p className="text-[11px] text-muted-foreground leading-none">{notif.label}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function showXpToast(amount: number, label?: string) {
  window.dispatchEvent(new CustomEvent("xp-gain-toast", {
    detail: { amount, label: label || "" }
  }))
  window.dispatchEvent(new Event("xp-updated"))
}

export function showAchievementToast(achievementIdOrTitle: string) {
  window.dispatchEvent(new CustomEvent("xp-gain-toast", {
    detail: { amount: 0, label: "Yeni başarım açıldı!", achievement: achievementIdOrTitle }
  }))
}

export function playSoundEffect(type: "correct" | "wrong" | "complete") {
  try {
    const stored = localStorage.getItem("tls-sound")
    if (stored === "off") return
    playChime(type)
  } catch { /* noop */ }
}

export function toggleSound(): boolean {
  const current = localStorage.getItem("tls-sound")
  const next = current === "off" ? "on" : "off"
  localStorage.setItem("tls-sound", next)
  return next === "on"
}
