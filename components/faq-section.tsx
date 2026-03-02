"use client"

import { useState } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FAQItem {
  question: string
  answer: string
}

interface FAQSectionProps {
  title?: string
  subtitle?: string
  items: FAQItem[]
  className?: string
}

export function FAQSection({ title = "Sık Sorulan Sorular", subtitle, items, className }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }

  return (
    <section className={cn("py-24 md:py-32", className)}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-foreground/5 border border-border/50 mb-5">
              <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
              <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">SSS</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl mb-4 text-balance tracking-tight">{title}</h2>
            {subtitle && <p className="text-muted-foreground leading-relaxed">{subtitle}</p>}
          </div>

          <div className="space-y-3">
            {items.map((item, index) => {
              const isOpen = openIndex === index
              return (
                <div
                  key={index}
                  className="rounded-lg border border-border/50 bg-card overflow-hidden transition-all duration-300 hover:border-border"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex items-center justify-between w-full p-5 text-left gap-4"
                    aria-expanded={isOpen}
                  >
                    <h3 className="font-medium text-base leading-snug pr-4">{item.question}</h3>
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 flex-shrink-0 text-muted-foreground transition-transform duration-300",
                        isOpen && "rotate-180 text-secondary"
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300",
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="px-5 pb-5 pt-0">
                      <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
