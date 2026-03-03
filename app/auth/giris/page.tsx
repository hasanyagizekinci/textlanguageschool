"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { LogIn, ArrowLeft } from "lucide-react"
import { getCurrentPlayerId, linkAuthAccount, getPlayerByAuthId, getOrCreatePlayer } from "@/lib/player"

export default function GirisPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    if (!supabase) {
      setError("Supabase bağlantısı kurulamadı.")
      return
    }
    setIsLoading(true)
    setError(null)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (authError) throw authError

      if (data.user) {
        // Ensure a player record exists
        let player = await getPlayerByAuthId(data.user.id)
        const existingPlayerId = getCurrentPlayerId()

        if (!player && existingPlayerId) {
          try { await linkAuthAccount(existingPlayerId, data.user.id) } catch {}
          player = await getPlayerByAuthId(data.user.id)
        }
        if (!player) {
          try {
            const nick = (data.user.email || "kullanici").split("@")[0].slice(0, 15)
            const newId = await getOrCreatePlayer(nick)
            await linkAuthAccount(newId, data.user.id)
            player = await getPlayerByAuthId(data.user.id)
          } catch {}
        }

        // Cache player ID in localStorage for XP system
        if (player) {
          localStorage.setItem("tls_player_id", player.id)
        }

        // Redirect
        if (data.user.email === "info@textlanguageschool.net") {
          if (player) {
            await supabase.from("players").update({ role: "teacher" }).eq("id", player.id)
          }
          window.location.href = "/ogretmen"
        } else {
          window.location.href = "/profil"
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Bir hata oluştu"
      if (message.includes("Invalid login")) {
        setError("E-posta veya şifre hatalı")
      } else {
        setError(message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 relative">
      <div className="absolute top-6 left-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Ana Sayfa
        </Link>
      </div>
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <LogIn className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-serif">{"Giriş Yap"}</CardTitle>
              <CardDescription>
                {"Hesabınıza giriş yaparak devam edin"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">E-posta</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ornek@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">{"Şifre"}</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                  {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                  <Button type="submit" className="w-full rounded-xl" disabled={isLoading}>
                    {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  {"Hesabınız yok mu? "}
                  <Link href="/auth/kayit" className="text-primary underline underline-offset-4 hover:text-primary/80">
                    {"Kayıt Ol"}
                  </Link>
                </div>
                <div className="mt-2 text-center">
                  <Link href="/" className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors">
                    {"Ana sayfaya dön"}
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
