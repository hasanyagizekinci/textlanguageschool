"use client"

import { useEffect } from "react"
import { Instagram, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Instagram post URLs
const instagramPosts = [
  "https://www.instagram.com/p/DUPwEDngNb1/",
  "https://www.instagram.com/p/DTaU1WIAGfY/",
  "https://www.instagram.com/p/DTmmqqegLrA/",
  "https://www.instagram.com/p/DTc5ziEAG2e/",
  "https://www.instagram.com/p/DRzOLnLCHGP/",
  "https://www.instagram.com/p/DReLD5giGRC/",
]

export function InstagramFeed() {
  useEffect(() => {
    // Load Instagram embed script
    const script = document.createElement("script")
    script.src = "https://www.instagram.com/embed.js"
    script.async = true
    document.body.appendChild(script)

    // Process embeds when script loads
    script.onload = () => {
      if ((window as any).instgrm) {
        (window as any).instgrm.Embeds.process()
      }
    }

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://www.instagram.com/embed.js"]')
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [])

  return (
    <section className="py-24 md:py-32 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground/5 text-foreground text-sm font-medium mb-4 border border-border/50">
              <Instagram className="w-4 h-4" />
              <span>@textlanguageschool</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl mb-4 tracking-tight">
              Instagram'da Bizi Takip Edin
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Günlük ipuçları, motivasyon ve İngilizce öğrenme yolculuğunuzda size ilham verecek içerikler
            </p>
          </div>

          {/* Instagram Embeds Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {instagramPosts.map((postUrl, index) => (
              <div 
                key={index} 
                className="instagram-embed-container animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${100 * (index + 1)}ms` }}
              >
                <blockquote
                  className="instagram-media"
                  data-instgrm-captioned
                  data-instgrm-permalink={postUrl}
                  data-instgrm-version="14"
                  style={{
                    background: "#FFF",
                    border: 0,
                    borderRadius: "12px",
                    boxShadow: "0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)",
                    margin: "0 auto",
                    maxWidth: "100%",
                    minWidth: "280px",
                    padding: 0,
                    width: "100%",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Follow Button */}
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <Button
              size="lg"
              variant="outline"
              className="rounded-lg border border-foreground/15 text-foreground hover:bg-foreground/5 bg-transparent transition-all"
              asChild
            >
              <Link 
                href="https://www.instagram.com/textlanguageschool/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Instagram className="w-5 h-5" />
                Instagram'da Takip Et
                <ExternalLink className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
