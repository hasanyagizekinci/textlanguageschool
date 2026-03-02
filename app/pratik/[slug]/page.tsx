"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function PratikRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/meydan-oku")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground animate-pulse">{"Y\u00f6nlendiriliyor..."}</p>
      </div>
    </div>
  )
}
