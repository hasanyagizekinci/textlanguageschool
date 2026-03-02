import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function HomeCTA() {
  return (
    <section className="py-28 md:py-36 relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-medium tracking-wide text-primary mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            İlk ders ücretsiz
          </p>
          
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6 text-balance tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            Hemen başlayalım mı?
          </h2>
          
          <p className="text-muted-foreground mb-6 leading-relaxed max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            Ücretsiz demo dersimizde tanışalım, seviyenizi belirleyelim ve 
            size özel bir öğrenme planı oluşturalım
          </p>

          {/* Price pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-350">
            <div className="px-4 py-2 rounded-lg bg-card border border-border/50 text-sm">
              <span className="text-muted-foreground">8 Ders:</span>{" "}
              <span className="font-medium text-foreground">13.500 TL</span>
            </div>
            <div className="px-4 py-2 rounded-lg bg-card border border-border/50 text-sm">
              <span className="text-muted-foreground">12 Ders:</span>{" "}
              <span className="font-medium text-foreground">20.000 TL</span>
            </div>
            <div className="px-4 py-2 rounded-lg bg-card border border-border/50 text-sm">
              <span className="text-muted-foreground">18 Ders:</span>{" "}
              <span className="font-medium text-foreground">30.500 TL</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-450">
            <Button 
              size="lg" 
              className="text-base px-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-sm hover:shadow-md transition-all"
              asChild
            >
              <Link href="/demo-ders">Demo Ders Rezervasyonu</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-base px-8 border border-foreground/15 text-foreground rounded-lg hover:bg-foreground/5 transition-all bg-transparent"
              asChild
            >
              <Link href="/dersler#ucretler">Ücret Detaylarını Gör</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
