import type React from "react"
import type { Metadata, Viewport } from "next"
import Script from "next/script"
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
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#c25a3c",
  width: "device-width",
  initialScale: 1,
}

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": "https://www.textlanguageschool.net/#organization",
  name: "Text Language School",
  url: "https://www.textlanguageschool.net",
  logo: {
    "@type": "ImageObject",
    url: "https://www.textlanguageschool.net/logo.png",
    width: 512,
    height: 512,
  },
  image: "https://www.textlanguageschool.net/logo.png",
  description: "Online Ingilizce ozel ders veren, kisisellestirilmis egitim programlari sunan dil okulu.",
  telephone: "+90-533-474-6478",
  email: "info@textlanguageschool.net",
  foundingDate: "2024",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+90-533-474-6478",
    contactType: "customer service",
    availableLanguage: ["Turkish", "English"],
    areaServed: "TR",
  },
  sameAs: ["https://www.instagram.com/textlanguageschool"],
  areaServed: {
    "@type": "Country",
    name: "Turkey",
  },
  knowsLanguage: ["tr", "en"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Ingilizce Ders Programlari",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Course",
          name: "Genel Ingilizce Dersleri",
          description: "Kisisellestirilmis genel Ingilizce egitim programi",
          provider: { "@id": "https://www.textlanguageschool.net/#organization" },
          inLanguage: "en",
          courseMode: "online",
          availableLanguage: "tr",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Course",
          name: "YDS Sinav Hazirlik",
          description: "YDS sinavina ozel hazirlik programi",
          provider: { "@id": "https://www.textlanguageschool.net/#organization" },
          inLanguage: "en",
          courseMode: "online",
          availableLanguage: "tr",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Course",
          name: "YOKDIL Sinav Hazirlik",
          description: "YOKDIL sinavina ozel hazirlik programi",
          provider: { "@id": "https://www.textlanguageschool.net/#organization" },
          inLanguage: "en",
          courseMode: "online",
          availableLanguage: "tr",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Course",
          name: "Is Ingilizcesi",
          description: "Profesyonel is hayati icin Ingilizce egitimi",
          provider: { "@id": "https://www.textlanguageschool.net/#organization" },
          inLanguage: "en",
          courseMode: "online",
          availableLanguage: "tr",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Course",
          name: "IELTS Hazirlik",
          description: "IELTS sinavina ozel hazirlik programi",
          provider: { "@id": "https://www.textlanguageschool.net/#organization" },
          inLanguage: "en",
          courseMode: "online",
          availableLanguage: "tr",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Course",
          name: "OET Sinav Hazirlik",
          description: "Saglik profesyonelleri icin OET sinavina ozel hazirlik programi",
          provider: { "@id": "https://www.textlanguageschool.net/#organization" },
          inLanguage: "en",
          courseMode: "online",
          availableLanguage: "tr",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Course",
          name: "YDT Sinav Hazirlik",
          description: "YKS Yabanci Dil Testi (YDT) sinavina ozel hazirlik programi",
          provider: { "@id": "https://www.textlanguageschool.net/#organization" },
          inLanguage: "en",
          courseMode: "online",
          availableLanguage: "tr",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Course",
          name: "Ucretsiz Ingilizce Pratik Araclari",
          description: "Kelime ezberleme, gramer alistirmalari, sinav pratigi ve interaktif ogrenme araclari",
          provider: { "@id": "https://www.textlanguageschool.net/#organization" },
          inLanguage: "en",
          courseMode: "online",
          isAccessibleForFree: true,
          availableLanguage: "tr",
        },
      },
    ],
  },
}

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.textlanguageschool.net/#website",
  name: "Text Language School",
  url: "https://www.textlanguageschool.net",
  description: "Kisisellestirilmis online Ingilizce ozel ders. YDS, YOKDIL, IELTS hazirlik ve is Ingilizcesi.",
  publisher: { "@id": "https://www.textlanguageschool.net/#organization" },
  inLanguage: "tr-TR",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://www.textlanguageschool.net/blog?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
}

const jsonLdLocalBusiness = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://www.textlanguageschool.net/#localbusiness",
  name: "Text Language School",
  url: "https://www.textlanguageschool.net",
  telephone: "+90-533-474-6478",
  image: "https://www.textlanguageschool.net/logo.png",
  description: "Online Ingilizce ozel ders ve sinav hazirlik programlari.",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressCountry: "TR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "41.0082",
    longitude: "28.9784",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "21:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "10:00",
      closes: "18:00",
    },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Ingilizce Dersleri",
    itemListElement: [
      {
        "@type": "OfferCatalog",
        name: "Online Ingilizce Ozel Ders",
      },
    ],
  },
}

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Ana Sayfa",
      item: "https://www.textlanguageschool.net",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Dersler",
      item: "https://www.textlanguageschool.net/dersler",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Hakkimda",
      item: "https://www.textlanguageschool.net/hakkimda",
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "Blog",
      item: "https://www.textlanguageschool.net/blog",
    },
    {
      "@type": "ListItem",
      position: 5,
      name: "Demo Ders",
      item: "https://www.textlanguageschool.net/demo-ders",
    },
  ],
}

const jsonLdFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Online Ingilizce ozel ders nasil isliyor?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Dersler Zoom uzerinden birebir olarak gerceklesir. Her ders 60 dakikadir ve tamamen sizin seviyenize ve hedeflerinize gore kisisellestirilir.",
      },
    },
    {
      "@type": "Question",
      name: "Demo ders ucretsiz mi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Evet, ilk tanisma dersimiz tamamen ucretsizdir. 30 dakikalik demo derste seviyenizi belirleyip sizin icin en uygun programi planliyoruz.",
      },
    },
    {
      "@type": "Question",
      name: "Hangi sinavlara hazirlik yapiliyor?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "YDS, YOKDIL, IELTS, TOEFL, OET ve YDT sinavlarina ozel hazirlik programlari sunulmaktadir.",
      },
    },
    {
      "@type": "Question",
      name: "Ders paketlerinin fiyatlari nedir?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "8 ders paketi 13.500 TL, 12 ders paketi 20.000 TL ve 18 ders paketi 28.000 TL'dir. Her ders 60 dakikadir.",
      },
    },
    {
      "@type": "Question",
      name: "Hangi seviyelere ders veriliyor?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A1'den C2'ye kadar tum seviyelerde ders verilmektedir. Baslangic seviyesinden ileri seviyeye kadar her ogrenciye uygun program hazirlanir.",
      },
    },
    {
      "@type": "Question",
      name: "OET sinavina hazirlik yapiliyor mu?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Evet, saglik profesyonelleri icin OET (Occupational English Test) sinavina ozel hazirlik programimiz mevcuttur. Reading, Writing, Listening ve Speaking bolumlerine ayri ayri calisilir.",
      },
    },
    {
      "@type": "Question",
      name: "Sitedeki ucretsiz Ingilizce pratik araclarini kimler kullanabilir?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ucretsiz Ingilizce pratik araclarimiz herkese aciktir. Kelime ezberleme flashcard'lari, gramer alistirmalari, YDS/YOKDIL/YDT sinav pratikleri, kelime eslestirme oyunlari ve interaktif seviye testi gibi araclari ucretsiz kullanabilirsiniz.",
      },
    },
    {
      "@type": "Question",
      name: "Online Ingilizce nasil ogrenilir?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Online Ingilizce ogrenmek icin birebir ozel dersler, interaktif alistirmalar, kelime ezberleme teknikleri ve duzenli pratik gerekir. Text Language School'da kisisellestirilmis program ile hedefinize en kisa surede ulasirsiniz.",
      },
    },
  ],
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    jsonLdOrganization,
    jsonLdWebSite,
    jsonLdLocalBusiness,
    jsonLdBreadcrumb,
    jsonLdFAQ,
  ],
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
        {/* JSON-LD Structured Data */}
        <Script id="ld-json" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify(jsonLd)}
        </Script>
        {/* Google Tag (gtag.js) */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=AW-17923438419" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17923438419');
          `}
        </Script>

        <FloatingWhatsApp />
        <BackToTop />
        <ExitIntentPopup />
        <Analytics />
      </body>
    </html>
  )
}
