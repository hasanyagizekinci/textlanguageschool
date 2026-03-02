"use client"

import { MessageCircle, Calendar } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function FloatingWhatsApp() {
  const pathname = usePathname()
  const isOnDemoPage = pathname === "/demo-ders"

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5">
      {/* Demo Ders -- subtle outline style, hidden on demo page */}
      {!isOnDemoPage && (
        <Link
          href="/demo-ders"
          className="group"
          aria-label="Ücretsiz demo ders"
        >
          <div className="relative bg-background border border-primary/30 text-primary p-3 rounded-lg shadow-sm hover:shadow-md hover:border-primary/60 transition-all duration-300 hover:scale-105">
            <Calendar className="w-5 h-5" />
          </div>
        </Link>
      )}

      {/* WhatsApp -- soft fill with periodic pulse */}
      <Link
        href="https://wa.me/905334746478"
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
        aria-label="WhatsApp ile iletişime geç"
      >
        <div className="relative bg-[#25D366]/90 hover:bg-[#25D366] text-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
          <MessageCircle className="w-5 h-5" />
          <span className="absolute inset-0 rounded-lg bg-[#25D366]/40 animate-[wa-ping_2.5s_ease-in-out_infinite]" />
        </div>
      </Link>
    </div>
  )
}
