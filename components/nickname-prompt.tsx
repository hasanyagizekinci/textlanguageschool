"use client"

import { useState } from "react"
import { usePlayer } from "@/lib/player"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

export function NicknamePrompt() {
  const { needsNickname, setNickname, loading } = usePlayer()
  const [name, setName] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  if (loading || !needsNickname) return null

  const handleSubmit = async () => {
    const trimmed = name.trim()
    if (trimmed.length < 2) {
      setError("En az 2 karakter olmalı")
      return
    }
    if (trimmed.length > 20) {
      setError("En fazla 20 karakter olabilir")
      return
    }
    setSaving(true)
    setError("")
    try {
      await setNickname(trimmed)
    } catch {
      setError("Bir hata oluştu, tekrar deneyin")
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm" />
      <div className="fixed inset-0 z-[71] flex items-center justify-center p-4">
        <div
          className="w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-300"
          role="dialog"
          aria-label="Takma ad belirle"
        >
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
              <User className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-xl font-serif font-bold text-foreground">Hoş Geldiniz!</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Liderlik tablosunda yer almak için bir takma ad belirleyin.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError("")
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Takma adınız..."
                maxLength={20}
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 text-center text-lg font-medium"
              />
              {error && (
                <p className="text-xs text-red-500 mt-1.5 text-center">{error}</p>
              )}
            </div>
            <Button
              onClick={handleSubmit}
              disabled={saving || name.trim().length < 2}
              className="w-full rounded-xl py-3 text-base font-semibold"
            >
              {saving ? "Kaydediliyor..." : "Başlayalım!"}
            </Button>
            <p className="text-[11px] text-muted-foreground/60 text-center">
              Daha sonra hesap oluşturarak ilerlemenizi koruyabilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
