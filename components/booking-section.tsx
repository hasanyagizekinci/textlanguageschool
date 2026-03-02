"use client"

import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect } from "react"

export function BookingSection() {
  useEffect(() => {
    // Load Calendly widget script
    const script = document.createElement("script")
    script.src = "https://assets.calendly.com/assets/external/widget.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const openCalendly = () => {
    // @ts-ignore - Calendly is loaded externally
    if (window.Calendly) {
      // @ts-ignore
      window.Calendly.initPopupWidget({ url: "https://calendly.com" })
    }
  }

  return (
    <section id="booking" className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="border border-border/50 rounded-lg">
            <CardContent className="p-8 md:p-12 text-center space-y-6">
              <div className="w-12 h-12 mx-auto rounded-lg bg-muted flex items-center justify-center">
                <Calendar className="w-6 h-6 text-muted-foreground" strokeWidth={1.5} />
              </div>

              <div className="space-y-4">
                <h2 className="font-serif text-3xl md:text-4xl text-balance tracking-tight">
                  Ücretsiz Demo Ders
                </h2>
                <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
                  30 dakikalık ücretsiz demo derste tanışalım, seviyenizi değerlendirelim ve size en uygun öğrenme
                  planını birlikte belirleyelim
                </p>
              </div>

              <div className="pt-4">
                <Button
                  size="lg"
                  className="px-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
                  onClick={openCalendly}
                >
                  Demo Ders Planla
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Calendly linkinizi buraya ekleyerek randevu sisteminizi aktif edebilirsiniz
                </p>
              </div>

              <div className="pt-6 border-t">
                <p className="text-muted-foreground">
                  Sorularınız mı var?{" "}
                  <a href="mailto:info@textlanguageschool.net" className="text-primary hover:underline font-semibold">
                    info@textlanguageschool.net
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
