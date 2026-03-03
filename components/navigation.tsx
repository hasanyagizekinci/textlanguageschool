'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { Menu, X, ArrowRight, User, ChevronDown, BookOpen, Zap, Link2, BookMarked, Shuffle, Sparkles, Repeat, AlertTriangle, Timer, GraduationCap, LayoutGrid, Skull, Snowflake, Swords, LogOut, LogIn, Mic } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

const TEACHER_EMAIL = "info@textlanguageschool.net"

const navItems = [
  { name: 'Ana Sayfa', href: '/' },
  { name: 'Hakkımda', href: '/hakkimda' },
  { name: 'Dersler', href: '/dersler' },
  { name: 'Seviyeni Ölç', href: '/#seviye-testi' },
  { name: 'Liderlik', href: '/liderlik' },
  { name: 'Blog', href: '/blog' },
]

const quickQuizzes = [
  { id: "accent", label: "Accent Challenge", icon: Mic, color: "text-primary", featured: true },
  { id: "daily", label: "Günün Challenge'ı", icon: Timer, color: "text-rose-600" },
  { id: "flashcard", label: "Kelime Kartları", icon: Zap, color: "text-amber-600" },
  { id: "match", label: "Kelime Eşleştir", icon: Link2, color: "text-violet-600" },
  { id: "collocation", label: "Collocations", icon: Sparkles, color: "text-indigo-600" },
  { id: "grammar", label: "Gramer Kartları", icon: BookMarked, color: "text-pink-600" },
  { id: "sentence", label: "Cümle Kur", icon: Shuffle, color: "text-emerald-600" },
  { id: "transform", label: "Cümle Dönüşümü", icon: Repeat, color: "text-fuchsia-600" },
  { id: "error", label: "Hata Bul", icon: AlertTriangle, color: "text-orange-600" },
  { id: "snowchallenge", label: "Çılga", icon: Snowflake, color: "text-sky-600" },
  { id: "blitz", label: "Blitz Challenge", icon: Timer, color: "text-orange-600" },
  { id: "exam", label: "Sınav Pratiği", icon: GraduationCap, color: "text-sky-600" },
  { id: "wordle", label: "Wordle", icon: LayoutGrid, color: "text-emerald-600" },
  { id: "hangman", label: "Adam Asmaca", icon: Skull, color: "text-purple-600" },
]

export function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [quizDropdownOpen, setQuizDropdownOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isTeacher, setIsTeacher] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Check auth state
  useEffect(() => {
    const supabase = createClient()
    if (!supabase) return
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setIsLoggedIn(true)
        if (user.email === TEACHER_EMAIL) setIsTeacher(true)
      }
    })
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    if (!supabase) return
    await supabase.auth.signOut()
    setIsLoggedIn(false)
    setIsTeacher(false)
    window.location.href = "/"
  }

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileMenuOpen])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setQuizDropdownOpen(false)
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setQuizDropdownOpen(false)
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  function scrollToQuiz(quizId: string) {
    setQuizDropdownOpen(false)
    setMobileMenuOpen(false)
    const section = document.getElementById("pratik")
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
      // Dispatch a custom event so learning-tools can pick up which quiz to open
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("open-quiz", { detail: quizId }))
      }, 500)
    }
  }

  return (
    <nav className="fixed top-0 w-full bg-background/90 backdrop-blur-md border-b border-border/40 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image
              src="/logo.png"
              alt="Text Language School"
              width={60}
              height={60}
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded-none"
            />
            <span className="font-serif text-xl sm:text-2xl text-foreground hidden sm:inline">
              Text Language School
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[15px] font-serif font-semibold tracking-tight transition-colors relative ${
                  pathname === item.href
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.name}
                {pathname === item.href && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}

            {/* Pratik Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setQuizDropdownOpen(!quizDropdownOpen)}
                className="flex items-center gap-1 text-[15px] font-serif font-semibold tracking-tight text-muted-foreground hover:text-foreground transition-colors"
              >
                Pratik
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${quizDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {quizDropdownOpen && (
                <div className="absolute top-full right-0 mt-3 w-56 bg-card backdrop-blur-lg border border-border/50 rounded-lg shadow-lg shadow-black/[0.04] p-1.5 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="max-h-[420px] overflow-y-auto practice-scroll">
                    {/* Featured: Accent Challenge */}
                    <button
                      onClick={() => scrollToQuiz("accent")}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg bg-primary/5 hover:bg-primary/10 active:bg-primary/15 transition-all duration-150 text-left group focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none mb-1"
                    >
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Mic className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors">Accent Challenge</span>
                        <span className="text-[10px] text-muted-foreground">{"Aksanını analiz et"}</span>
                      </div>
                      <span className="ml-auto text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">Yeni</span>
                    </button>
                    <div className="mx-2.5 my-1.5 h-px bg-border/40" />
                    <p className="px-2.5 pt-1 pb-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold">Kelime & Kartlar</p>
                    {quickQuizzes.slice(1, 6).map((q) => {
                      const Icon = q.icon
                      return (
                        <button
                          key={q.id}
                          onClick={() => scrollToQuiz(q.id)}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-muted/50 active:bg-muted transition-all duration-150 text-left group focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
                        >
                          <Icon className={`w-4 h-4 ${q.color} shrink-0 group-hover:scale-110 transition-transform`} />
                          <span className="text-[13px] text-foreground/80 group-hover:text-foreground">{q.label}</span>
                        </button>
                      )
                    })}
                    <div className="mx-2.5 my-1.5 h-px bg-border/40" />
                    <p className="px-2.5 pt-0.5 pb-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold">Cumle & Gramer</p>
                    {quickQuizzes.slice(6, 9).map((q) => {
                      const Icon = q.icon
                      return (
                        <button
                          key={q.id}
                          onClick={() => scrollToQuiz(q.id)}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-muted/50 active:bg-muted transition-all duration-150 text-left group focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
                        >
                          <Icon className={`w-4 h-4 ${q.color} shrink-0 group-hover:scale-110 transition-transform`} />
                          <span className="text-[13px] text-foreground/80 group-hover:text-foreground">{q.label}</span>
                        </button>
                      )
                    })}
                    <div className="mx-2.5 my-1.5 h-px bg-border/40" />
                    <p className="px-2.5 pt-0.5 pb-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold">Challenge & Oyunlar</p>
                    {quickQuizzes.slice(9).map((q) => {
                      const Icon = q.icon
                      return (
                        <button
                          key={q.id}
                          onClick={() => scrollToQuiz(q.id)}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-muted/50 active:bg-muted transition-all duration-150 text-left group focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
                        >
                          <Icon className={`w-4 h-4 ${q.color} shrink-0 group-hover:scale-110 transition-transform`} />
                          <span className="text-[13px] text-foreground/80 group-hover:text-foreground">{q.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {isTeacher && (
              <Link
                href="/ogretmen"
                className="ml-1 flex items-center gap-1.5 text-[13px] font-semibold text-secondary hover:text-secondary/80 transition-colors"
              >
                <GraduationCap className="w-4 h-4" />
                <span className="hidden lg:inline">Panel</span>
              </Link>
            )}
            <Link
              href="/profil"
              className="ml-1 p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              title="Profilim"
            >
              <User className="w-5 h-5" />
            </Link>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="ml-1 p-2 rounded-full hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                title={"Çıkış Yap"}
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <Link
                href="/auth/giris"
                className="ml-1 p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                title={"Giriş Yap"}
              >
                <LogIn className="w-4 h-4" />
              </Link>
            )}
            <Button
              size="sm"
              className="ml-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-5"
              asChild
            >
              <Link href="/demo-ders" className="flex items-center gap-1.5">
                Demo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background animate-in fade-in slide-in-from-top-2 duration-200 max-h-[calc(100dvh-5rem)] overflow-y-auto practice-scroll">
          <div className="px-4 py-5 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-lg font-serif font-semibold tracking-tight transition-colors ${
                  pathname === item.href
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Action buttons */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex gap-2">
                <Link
                  href="/profil"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-muted/30 hover:bg-muted transition-colors"
                >
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">Profilim</span>
                </Link>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
                  asChild
                >
                  <Link href="/demo-ders" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-1.5">
                    Demo Ders
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
              {isTeacher && (
                <Link
                  href="/ogretmen"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-secondary/30 bg-secondary/5 hover:bg-secondary/10 transition-colors"
                >
                  <GraduationCap className="w-4 h-4 text-secondary" />
                  <span className="text-sm font-semibold text-secondary">{"Öğretmen Paneli"}</span>
                </Link>
              )}
              {isLoggedIn ? (
                <button
                  onClick={() => { setMobileMenuOpen(false); handleLogout() }}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-destructive/20 bg-destructive/5 hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-destructive" />
                  <span className="text-sm font-semibold text-destructive">{"Çıkış Yap"}</span>
                </button>
              ) : (
                <Link
                  href="/auth/giris"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
                >
                  <LogIn className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">{"Giriş Yap"}</span>
                </Link>
              )}
            </div>

            {/* Mobile Quiz Quick Access */}
            <div className="pt-3 border-t border-border/50">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-3">{"Hızlı Pratik"}</p>
              {/* Featured: Accent Challenge */}
              <button
                onClick={() => scrollToQuiz("accent")}
                className="w-full flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/10 active:scale-[0.98] transition-all touch-manipulation"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Mic className="w-5 h-5 text-primary" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-semibold text-foreground">Accent Challenge</span>
                  <span className="text-[11px] text-muted-foreground">{"Aksanını analiz et - 11 profil"}</span>
                </div>
                <span className="ml-auto text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">Yeni</span>
              </button>
              <div className="grid grid-cols-3 gap-1.5">
                {quickQuizzes.filter(q => q.id !== "accent").map((q) => {
                  const Icon = q.icon
                  return (
                    <button
                      key={q.id}
                      onClick={() => scrollToQuiz(q.id)}
                      className="flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl bg-muted/40 hover:bg-muted active:scale-[0.97] transition-all touch-manipulation"
                    >
                      <Icon className={`w-4 h-4 ${q.color} shrink-0`} />
                      <span className="text-[10px] font-medium text-foreground/80 text-center leading-tight">{q.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

    </nav>
  )
}
