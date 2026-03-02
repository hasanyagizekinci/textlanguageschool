import Image from "next/image"
import Link from "next/link"
import { Mail, Instagram, MessageCircle } from "lucide-react"

export function Footer() {
  return (
    <footer className="py-16 border-t border-border/40 relative">
      <div className="container mx-auto px-4 relative">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {/* Logo and Description */}
            <div className="space-y-4">
              <div className="relative w-16 h-16">
                <Image src="/logo.png" alt="Text Language School" fill className="object-contain" />
              </div>
              <h3 className="font-serif text-lg">Text Language School</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                İngilizce öğrenmenin eğlenceli ve etkili yolu. Kişiye özel, samimi bir öğrenme deneyimi.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-serif text-base mb-4">Hızlı Linkler</h4>
              <nav className="space-y-2.5">
                <Link href="/" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Ana Sayfa</Link>
                <Link href="/hakkimda" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Hakkımda</Link>
                <Link href="/dersler" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Dersler</Link>
                <Link href="/meydan-oku" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Meydan Oku</Link>
                <Link href="/liderlik" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Liderlik Tablosu</Link>
                <Link href="/blog" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
                <Link href="/dersler#ucretler" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Ücretler</Link>
                <Link href="/demo-ders" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Demo Ders</Link>
              </nav>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-serif text-base mb-4">İletişim</h4>
              <div className="space-y-3">
                <a href="mailto:info@textlanguageschool.net" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Mail className="w-4 h-4" strokeWidth={1.5} />
                  <span>info@textlanguageschool.net</span>
                </a>
                <a href="https://wa.me/905334746478?text=Merhaba,%20Text%20Language%20School%20hakkında%20bilgi%20almak%20istiyorum" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                  <span>WhatsApp: +90 533 474 64 78</span>
                </a>
                <a href="https://instagram.com/textlanguageschool" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Instagram className="w-4 h-4" strokeWidth={1.5} />
                  <span>@textlanguageschool</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-border/30">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} Text Language School. Tüm hakları saklıdır.</p>
              <p className="italic">İngilizce öğrenmenin keyifli hali</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
