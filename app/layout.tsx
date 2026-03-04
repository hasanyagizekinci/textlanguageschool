import type React from "react"
import type { Metadata, Viewport } from "next"
// fonts loaded via <link> tag in <head> for reliable deployment
import { Analytics } from "@vercel/analytics/next"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { ExitIntentPopup } from "@/components/exit-intent-popup"
import { BackToTop } from "@/components/back-to-top"
import "./globals.css"

// Font config removed - using Google Fonts link tag directly

export const metadata: Metadata = {
  title: {
    default: "Text Language School | Online Ingilizce Ozel Ders Egitimi",
    template: "%s | Text Language School",
  },
  description:
    "Kisisellestirilmis online Ingilizce ozel ders. YDS, YOKDIL, IELTS hazirlik ve is Ingilizcesi. Ucretsiz demo ders!",
  keywords: [
    "ingilizce ogrenme",
    "online ingilizce",
    "ingilizce ozel ders",
    "online ingilizce kursu",
    "ingilizce egitmen",
    "text language school",
    "YDS hazirlik",
    "YOKDIL hazirlik",
    "YDT hazirlik",
    "OET hazirlik",
    "IELTS hazirlik",
    "TOEFL hazirlik",
    "is ingilizcesi",
    "online ingilizce dersi",
    "birebir ingilizce ders",
    "ingilizce konusma dersi",
    "online ingilizce ogretmen",
    "ingilizce sinav hazirlik",
    "akademik ingilizce",
    "ingilizce gramer dersi",
    "online dil okulu",
    "ucretsiz ingilizce pratik",
    "ingilizce kelime ezberleme",
    "ingilizce kelime ogrenme",
    "ingilizce calisma",
    "ingilizce seviye testi",
    "ingilizce alistirma",
    "ingilizce sinav sorulari",
    "ingilizce flashcard",
    "ingilizce kelime testi",
  ],
  authors: [{ name: "Text Language School", url: "https://www.textlanguageschool.net" }],
  creator: "Text Language School",
  publisher: "Text Language School",
  metadataBase: new URL("https://www.textlanguageschool.net"),
  alternates: {
    canonical: "/",
    languages: {
      "tr-TR": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://www.textlanguageschool.net",
    siteName: "Text Language School",
    title: "Text Language School - Online Ingilizce Ozel Ders",
    description:
      "Deneyimli egitmen ile online Ingilizce ozel ders. Kisisellestirilmis egitim programlari ile hedeflerinize ulasin.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Text Language School Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Text Language School - Online Ingilizce Ozel Ders",
    description:
      "Deneyimli egitmen ile online Ingilizce ozel ders. Kisisellestirilmis egitim programlari.",
    images: ["/logo.png"],
    creator: "@textlanguageschool",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/apple-icon.png",
  },
  category: "education",
  verification: {
    google: "GOOGLE_VERIFICATION_CODE",
  },
  other: {
    "google-ads-tag": "AW-17923438419",
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#c25a3c",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr">
      <head>
        {/* Google Fonts direct link as fallback */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Baloo+2:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
        <FloatingWhatsApp />
        <BackToTop />
        <ExitIntentPopup />
        <Analytics />
      </body>
    </html>
  )
}
