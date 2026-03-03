"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { getCurrentPlayerId, linkAuthAccount, getOrCreatePlayer } from "@/lib/player"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"

export default function KayitPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const supabase = createClient()
    if (!supabase) {
      setError("Supabase bağlantısı kurulamadı.")
      setLoading(false)
      return
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/giris` },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      // Link existing player or create a new one
      const existingPlayerId = getCurrentPlayerId()
      if (existingPlayerId) {
        try {
          await linkAuthAccount(existingPlayerId, data.user.id)
        } catch { /* conflict ok */ }
      } else {
        // No player record yet -- create one with email prefix as nickname
        try {
          const nick = email.split("@")[0].slice(0, 15)
          const newId = await getOrCreatePlayer(nick)
          await linkAuthAccount(newId, data.user.id)
        } catch { /* conflict ok */ }
      }
      router.push("/auth/kayit-basarili")
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 pt-20 pb-12">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Ana Sayfa
        </Link>

        <h1 className="font-serif text-2xl font-bold mb-1">{"Hesap Olu\u015ftur"}</h1>
        <p className="text-sm text-muted-foreground mb-6">
          {"Quiz sonu\u00e7lar\u0131n\u0131 kaydet, liderlik tablosunda yerini al."}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
              E-posta
            </label>
            <Input
              id="email"
              type="email"
              placeholder="ornek@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-xl"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
              {"Şifre"}
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={"En az 6 karakter"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="rounded-xl pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full rounded-xl" disabled={loading}>
            {loading ? "Kaydediliyor..." : "Kay\u0131t Ol"}
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground mt-6">
          {"Zaten hesab\u0131n var m\u0131?"}{" "}
          <Link href="/auth/giris" className="text-primary underline underline-offset-4 hover:text-primary/80">
            {"Giri\u015f Yap"}
          </Link>
        </p>
      </div>
    </main>
  )
}
