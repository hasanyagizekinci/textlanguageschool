"use client"

import { useState, useEffect, useRef } from "react"
import { X, Gift, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()
  const isOnDemoPage = pathname === "/demo-ders"
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (isOnDemoPage) return

    const alreadyShown = sessionStorage.getItem("exitPopupShown")
    if (alreadyShown === "true") return

    // Check if user is logged in -- don't annoy them
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        sessionStorage.setItem("exitPopupShown", "true")
        return
      }
      // Not logged in, activate exit intent
      let shown = false

      const showPopup = () => {
        if (shown) return
        shown = true
        sessionStorage.setItem("exitPopupShown", "true")
        setIsVisible(true)
      }

      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0) showPopup()
      }

      const handleVisibilityChange = () => {
        if (document.visibilityState === "hidden") showPopup()
      }

      const timer = setTimeout(() => {
        document.addEventListener("mouseleave", handleMouseLeave)
        document.addEventListener("visibilitychange", handleVisibilityChange)
      }, 3000)

      cleanupRef.current = () => {
        clearTimeout(timer)
        document.removeEventListener("mouseleave", handleMouseLeave)
        document.removeEventListener("visibilitychange", handleVisibilityChange)
      }
    })

    return () => {
      cleanupRef.current?.()
    }
  }, [isOnDemoPage])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsVisible(false)}
        onKeyDown={(e) => e.key === "Escape" && setIsVisible(false)}
      />
      <div className="relative bg-card rounded-lg shadow-xl max-w-md w-full p-6 md:p-8 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-border/50">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Gift className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-serif text-2xl md:text-3xl mb-2">
            {"Bekleyin, Gitmeden \u00d6nce!"}
          </h2>
          <p className="text-muted-foreground mb-6">
            <span className="font-semibold text-foreground">{"\u00dccretsiz demo ders"}</span>{" "}
            {"f\u0131rsat\u0131n\u0131 ka\u00e7\u0131rmay\u0131n. 30 dakikal\u0131k tan\u0131\u015fma dersinde seviyenizi belirleyelim ve size \u00f6zel bir plan olu\u015ftural\u0131m."}
          </p>
          <div className="bg-muted/50 rounded-xl p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-1">Demo derste:</p>
            <ul className="text-sm text-left space-y-1.5">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Seviye belirleme
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {"Ki\u015fiselle\u015ftirilmi\u015f plan \u00f6nerisi"}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {"Ders metodolojisi tan\u0131t\u0131m\u0131"}
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <Button
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
              asChild
            >
              <Link href="/demo-ders" onClick={() => setIsVisible(false)}>
                {"\u00dccretsiz Demo Ders Al"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <button
              onClick={() => setIsVisible(false)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {"\u015eimdilik gerek yok"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
