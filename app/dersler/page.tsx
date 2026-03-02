import Script from "next/script"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { FAQSection } from "@/components/faq-section"
import { Check, Users, BookOpen, Target, Sparkles, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "İngilizce Ders Programları ve Paketleri | Online İngilizce Özel Ders",
  description:
    "Kişiselleştirilmiş İngilizce özel ders programları. YDS, YÖKDİL, YDT, OET, IELTS, TOEFL sınav hazırlığı, iş İngilizcesi ve genel İngilizce dersleri. Uygun fiyatlı online İngilizce ders paketleri.",
  keywords: [
    "ingilizce ders paketleri",
    "ingilizce özel ders fiyatları",
    "online ingilizce kursu",
    "online ingilizce dersi fiyat",
    "birebir ingilizce ders ücreti",
    "YDS hazırlık kursu",
    "YÖKDİL hazırlık",
    "YDT hazırlık kursu",
    "OET hazırlık kursu",
    "IELTS hazırlık",
    "TOEFL hazırlık",
    "iş ingilizcesi",
    "akademik ingilizce",
    "ingilizce konuşma dersi",
    "online ingilizce öğrenme",
  ],
  alternates: {
    canonical: "/dersler",
  },
  openGraph: {
    title: "İngilizce Ders Programları ve Paketleri | Text Language School",
    description: "Kişiselleştirilmiş İngilizce özel ders programları. YDS, YÖKDİL, YDT, OET sınav hazırlığı, iş İngilizcesi ve genel İngilizce.",
    url: "/dersler",
  },
}

const courseJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Genel İngilizce Dersleri",
    description: "Konuşma, dinleme, okuma ve yazma becerilerinizi geliştirmek için kapsamlı program. A1'den C2'ye tüm seviyeler.",
    provider: {
      "@type": "Organization",
      name: "Text Language School",
      url: "https://www.textlanguageschool.net",
    },
    inLanguage: "en",
    availableLanguage: "tr",
    courseMode: "online",
    offers: [
      {
        "@type": "Offer",
        name: "8 Ders Paketi",
        price: "13500",
        priceCurrency: "TRY",
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "12 Ders Paketi",
        price: "20000",
        priceCurrency: "TRY",
        availability: "https://schema.org/InStock",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "YDS Sınav Hazırlık",
    description: "YDS sınavına özel stratejiler, sınav teknikleri ve deneme testleri ile hazırlık programı.",
    provider: {
      "@type": "Organization",
      name: "Text Language School",
      url: "https://www.textlanguageschool.net",
    },
    inLanguage: "en",
    availableLanguage: "tr",
    courseMode: "online",
  },
  {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "İş İngilizcesi",
    description: "Profesyonel iş hayatında ihtiyacınız olan İngilizceyi özgüvenle kullanın. İş görüşmeleri, sunumlar ve toplantı İngilizcesi.",
    provider: {
      "@type": "Organization",
      name: "Text Language School",
      url: "https://www.textlanguageschool.net",
    },
    inLanguage: "en",
    availableLanguage: "tr",
    courseMode: "online",
  },
  {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "OET Sınav Hazırlık",
    description: "Sağlık profesyonelleri için OET sınavına özel Reading, Writing, Listening ve Speaking hazırlık programı.",
    provider: {
      "@type": "Organization",
      name: "Text Language School",
      url: "https://www.textlanguageschool.net",
    },
    inLanguage: "en",
    availableLanguage: "tr",
    courseMode: "online",
  },
  {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "YÖKDİL Sınav Hazırlık",
    description: "YÖKDİL sınavına özel akademik İngilizce hazırlık programı. Sağlık, fen ve sosyal bilimler.",
    provider: {
      "@type": "Organization",
      name: "Text Language School",
      url: "https://www.textlanguageschool.net",
    },
    inLanguage: "en",
    availableLanguage: "tr",
    courseMode: "online",
  },
]

const lessonTypes = [
  {
    icon: Users,
    title: "Genel İngilizce",
    description: "Konuşma, dinleme, okuma ve yazma becerilerinizi geliştirmek için kapsamlı program",
    features: [
      "A1'den C2'ye tüm seviyeler",
      "Günlük hayatta kullanılabilir İngilizce",
      "İnteraktif konuşma pratiği",
      "Kişiselleştirilmiş içerik",
    ],
  },
  {
    icon: BookOpen,
    title: "Sınav Hazırlığı",
    description: "YDS, YÖKDİL, TOEFL, IELTS gibi sınavlara özel stratejiler ve pratikler",
    features: [
      "Sınav tekniklerini öğrenin",
      "Zamanlama ve strateji",
      "Örnek sınav ve deneme testleri",
      "Zayıf noktalarınıza odaklanma",
    ],
  },
  {
    icon: Target,
    title: "İş İngilizcesi",
    description: "Profesyonel hayatta ihtiyacınız olan İngilizceyi özgüvenle kullanın",
    features: [
      "İş görüşmeleri ve sunumlar",
      "E-posta ve rapor yazma",
      "Toplantı ve müzakere İngilizcesi",
      "Sektöre özel kelime bilgisi",
    ],
  },
]

const pricing = [
  {
    duration: "4 Ders",
    description: "Haftalık 1 ders",
    price: "Fiyat için iletişime geçin",
    features: ["Her ders 60 dakika", "Kişiselleştirilmiş içerik", "Ödev ve geri bildirim", "WhatsApp desteği"],
  },
  {
    duration: "8 Ders",
    description: "Haftalık 2 ders",
    price: "Fiyat için iletişime geçin",
    features: [
      "Her ders 60 dakika",
      "Kişiselleştirilmiş içerik",
      "Ders notlarını paylaşımı",
      "WhatsApp desteği",
      "Daha hızlı ilerleme",
    ],
    popular: true,
  },
  {
    duration: "Özel Paket",
    description: "İhtiyaçlarınıza özel",
    price: "Fiyat için iletişime geçin",
    features: ["Esnek ders sayısı", "Özel program tasarımı", "Yoğun kurs seçeneği", "Grup dersi indirimi"],
  },
]

export default function DerslerPage() {
  return (
    <>
      <Navigation />
      {courseJsonLd.map((schema, i) => (
        <Script key={i} id={`ld-course-${i}`} type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(schema)}
        </Script>
      ))}
      <main className="min-h-screen pt-20">
        <section className="py-20 md:py-32 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 relative overflow-hidden">
          {/* Floating decorative elements */}
          <div className="absolute top-20 left-10 opacity-10 animate-bounce" style={{ animationDuration: "3s" }}>
            <BookOpen className="w-20 h-20 text-primary" />
          </div>
          <div
            className="absolute bottom-20 right-10 opacity-10"
            style={{ animation: "pulse 4s ease-in-out infinite" }}
          >
            <TrendingUp className="w-24 h-24 text-secondary" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Kişiselleştirilmiş Eğitim</span>
              </div>

              <h1 className="font-serif text-4xl md:text-6xl mb-6 text-balance animate-in fade-in slide-in-from-bottom-4 duration-700">
                Hangi Hedefe Hazırlanıyoruz?{" "}
                <span className="text-primary relative">
                  Size Özel İngilizce Dersleri
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    height="8"
                    viewBox="0 0 200 8"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0,5 Q50,0 100,5 T200,5"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      className="text-primary/30"
                    />
                  </svg>
                </span>
              </h1>
              <p
                className="text-xl text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: "100ms" }}
              >
                Hedeflerinize ve seviyenize göre tasarlanmış, esnek ve etkili öğrenme programları
              </p>
            </div>
          </div>
        </section>

        {/* Lesson Types with better visual differentiation */}
        <section className="py-20 bg-gradient-to-b from-background to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                <h2 className="font-serif text-3xl md:text-4xl mb-4 relative inline-block">
                  Ders Programları
                  <svg
                    className="absolute -bottom-3 left-0 w-full"
                    height="12"
                    viewBox="0 0 300 12"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0,8 Q75,3 150,8 T300,8"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      className="text-secondary/30"
                    />
                  </svg>
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {lessonTypes.map((type, index) => (
                  <div
                    key={index}
                    className={`p-8 rounded-2xl border-2 hover:shadow-2xl transition-all duration-300 group animate-in fade-in slide-in-from-bottom-4 ${
                      index === 0
                        ? "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:border-primary/40"
                        : index === 1
                          ? "bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20 hover:border-secondary/40"
                          : "bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:border-accent/40"
                    }`}
                    style={{ animationDelay: `${100 * (index + 1)}ms` }}
                  >
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-6 group-hover:scale-110 transition-transform ${
                        index === 0 ? "bg-primary/20" : index === 1 ? "bg-secondary/20" : "bg-accent/20"
                      }`}
                    >
                      <type.icon
                        className={`w-7 h-7 ${
                          index === 0 ? "text-primary" : index === 1 ? "text-secondary" : "text-accent"
                        }`}
                      />
                    </div>
                    <h3 className="font-serif text-2xl mb-3">{type.title}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">{type.description}</p>
                    <ul className="space-y-3">
                      {type.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check
                            className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                              index === 0 ? "text-primary" : index === 1 ? "text-secondary" : "text-accent"
                            }`}
                          />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Metodoloji Farkı section */}
        <section className="py-20 bg-gradient-to-br from-accent/10 via-background to-secondary/10 relative overflow-hidden">
          {/* Decorative elements */}
          <div
            className="absolute top-10 left-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-pulse"
            style={{ animationDuration: "4s" }}
          />
          <div
            className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-secondary/10 blur-3xl animate-pulse"
            style={{ animationDuration: "5s" }}
          />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                <h2 className="font-serif text-3xl md:text-4xl mb-4 relative inline-block">
                  Metodoloji Farkı
                  <svg
                    className="absolute -bottom-3 left-0 w-full"
                    height="12"
                    viewBox="0 0 300 12"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0,8 Q75,3 150,8 T300,8"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      className="text-primary/30"
                    />
                  </svg>
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* First methodology card */}
                <div className="group p-8 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 border-2 border-primary/30 hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-left-4">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl mb-2">Kişisel Yol Haritamız</h3>
                      <p className="text-sm text-primary/70 mb-3">Hedefiniz - Durumunuz = Planımız</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Her öğrenci için <strong className="text-foreground">öğrenme ve algılama metodunu</strong> temel
                    alan, dört temel beceriyi (Konuşma, Yazma, Dinleme, Kelime) kapsayan bir{" "}
                    <strong className="text-foreground">kişisel antrenman programı</strong> oluşturuyorum.
                  </p>
                </div>

                {/* Second methodology card */}
                <div
                  className="group p-8 rounded-2xl bg-gradient-to-br from-secondary/15 to-secondary/5 border-2 border-secondary/30 hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-right-4"
                  style={{ animationDelay: "100ms" }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl mb-2">Gelişim Notları</h3>
                      <p className="text-sm text-secondary/70 mb-3">Ders Planı Değil, Sürekli Gelişim</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Her ders sonunda size özel <strong className="text-foreground">detaylı notlar alarak</strong> (Hangi
                    konuyu 5 dakikada, hangisini 30 dakikada anladınız?), dört temel beceriyi kapsayan bir{" "}
                    <strong className="text-foreground">kişisel antrenman programı</strong> oluşturuyorum.
                  </p>
                </div>
              </div>

              {/* Visual quote/highlight */}
              <div
                className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-accent/10 to-primary/10 border-2 border-secondary/20 text-center animate-in fade-in zoom-in-95 duration-700"
                style={{ animationDelay: "200ms" }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-4">
                  <Sparkles className="w-8 h-8 text-accent" />
                </div>
                <p className="text-lg md:text-xl leading-relaxed text-muted-foreground italic">
                  "Sabit bir müfredat değil, <strong className="text-foreground not-italic">size özel gelişen</strong>{" "}
                  bir yol haritası"
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="ucretler" className="py-20 bg-gradient-to-b from-accent/5 to-primary/5 relative overflow-hidden scroll-mt-24">
          {/* Decorative blobs */}
          <div className="absolute top-20 right-10 w-60 h-60 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-secondary/5 blur-3xl" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                <h2 className="font-serif text-3xl md:text-4xl mb-4">Ders Paketleri ve Ücretler</h2>
                <p className="text-lg text-muted-foreground">Size uygun paketi seçin veya özel paket oluşturalım</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* 8 Ders Package */}
                <div
                  className="p-8 rounded-2xl border-2 bg-background/80 backdrop-blur-sm border-border hover:shadow-xl hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: "100ms" }}
                >
                  <h3 className="font-serif text-2xl mb-2">8 Ders Paketi</h3>
                  <p className="text-muted-foreground mb-2">480 dakika - 1 Ay Eğitim</p>
                  <p className="text-sm text-muted-foreground/70 mb-4">
                    Haftada 2 oturumdan eğitim 4 hafta sürer
                  </p>
                  <div className="mb-6">
                    <p className="text-3xl font-bold text-foreground">13.500 <span className="text-lg font-normal text-muted-foreground">TL</span></p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-secondary" />
                      <span className="text-sm">Her ders 60 dakika</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-secondary" />
                      <span className="text-sm">Kişiselleştirilmiş içerik</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-secondary" />
                      <span className="text-sm">Ders notlarını paylaşımı</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-secondary" />
                      <span className="text-sm">WhatsApp desteği</span>
                    </li>
                  </ul>
                  <Button className="w-full rounded-xl bg-transparent" variant="outline" asChild>
                    <Link href="/demo-ders">Demo Ders Al</Link>
                  </Button>
                </div>

                {/* 12 Ders Package - Popular */}
                <div
                  className="p-8 rounded-2xl border-2 bg-gradient-to-br from-primary/15 to-secondary/10 border-primary shadow-2xl scale-105 hover:scale-110 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: "200ms" }}
                >
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium mb-4">
                    <Sparkles className="w-3 h-3" />
                    Popüler
                  </div>
                  <h3 className="font-serif text-2xl mb-2">12 Ders Paketi</h3>
                  <p className="text-muted-foreground mb-2">720 dakika - 1,5 Ay Eğitim</p>
                  <p className="text-sm text-muted-foreground/70 mb-4">
                    Haftada 2 oturumdan eğitim 6 hafta sürer
                  </p>
                  <div className="mb-6">
                    <p className="text-3xl font-bold text-foreground">20.000 <span className="text-lg font-normal text-muted-foreground">TL</span></p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" />
                      <span className="text-sm">Her ders 60 dakika</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" />
                      <span className="text-sm">Kişiselleştirilmiş içerik</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" />
                      <span className="text-sm">Ders notlarını paylaşımı</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" />
                      <span className="text-sm">Ders paketi sonu değerlendirme sınavı</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" />
                      <span className="text-sm">WhatsApp desteği</span>
                    </li>
                  </ul>
                  <Button className="w-full rounded-xl" asChild>
                    <Link href="/demo-ders">Demo Ders Al</Link>
                  </Button>
                </div>

                {/* 18 Ders Paketi */}
                <div
                  className="p-8 rounded-2xl border-2 bg-background/80 backdrop-blur-sm border-border hover:shadow-xl hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: "300ms" }}
                >
                  <h3 className="font-serif text-2xl mb-2">18 Ders Paketi</h3>
                  <p className="text-muted-foreground mb-2">1080 dakika - 2,5 Ay Eğitim</p>
                  <p className="text-sm text-muted-foreground/70 mb-4">Haftada 2 oturumdan eğitim 9 hafta sürer</p>
                  <div className="mb-6">
                    <p className="text-3xl font-bold text-foreground">30.500 <span className="text-lg font-normal text-muted-foreground">TL</span></p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-accent" />
                      <span className="text-sm">Her ders 60 dakika</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-accent" />
                      <span className="text-sm">Kişiselleştirilmiş içerik</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-accent" />
                      <span className="text-sm">Ders notlarını paylaşımı</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-accent" />
                      <span className="text-sm">Ders paketi sonu ve ortası değerlendirme sınavı</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-accent" />
                      <span className="text-sm">WhatsApp desteği</span>
                    </li>
                  </ul>
                  <Button className="w-full rounded-xl bg-transparent" variant="outline" asChild>
                    <Link href="/demo-ders">Demo Ders Al</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-serif text-3xl md:text-4xl text-center mb-12">Nasıl Başlıyoruz?</h2>
              <div className="space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-serif text-xl">
                    1
                  </div>
                  <div>
                    <h3 className="font-serif text-xl mb-2">Demo Ders Rezervasyonu</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Ücretsiz demo dersinizi rezerve edin. Size uygun bir tarih ve saat seçin. Bizimle iletişime geçin.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-serif text-xl">
                    2
                  </div>
                  <div>
                    <h3 className="font-serif text-xl mb-2">Tanışma ve Seviye Belirleme</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Demo derste tanışır, hedeflerinizi dinler ve seviyenizi belirleriz.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-serif text-xl">
                    3
                  </div>
                  <div>
                    <h3 className="font-serif text-xl mb-2">Kişisel Program Tasarımı</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Size özel bir öğrenme programı hazırlar ve ders paketinizi seçersiniz.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-serif text-xl">
                    4
                  </div>
                  <div>
                    <h3 className="font-serif text-xl mb-2">Öğrenme Yolculuğunuz Başlıyor</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Düzenli dersler, geri bildirimler ve desteğimle İngilizce hedeflerinize ulaşırsınız.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FAQSection
          title="Dersler Hakkında Sorular"
          subtitle="Ders programları ve paketler hakkında merak ettikleriniz"
          items={[
            {
              question: "Bir ders kaç dakika sürüyor?",
              answer: "Her ders 60 dakikadır. Ders süresince konuşma, dinleme, gramer ve kelime çalışması gibi farklı beceriler üzerinde çalışılır.",
            },
            {
              question: "YDS ve YÖKDİL hazırlık programı nasıl işliyor?",
              answer: "Öncelikle seviyeniz ve hedef puanınız belirlenir. Ardından sınav formatına özel stratejiler, kelime çalışmaları ve deneme testleri ile sistematik bir hazırlık programı uygulanır.",
            },
            {
              question: "OET hazırlık programınız var mı?",
              answer: "Evet, sağlık profesyonelleri için OET sınavına özel hazırlık programımız mevcuttur. Reading, Writing, Listening ve Speaking bölümlerine ayrı ayrı çalışılır.",
            },
            {
              question: "Ders paketini bitirdikten sonra ne oluyor?",
              answer: "Paket bitiminde ilerleme raporunuz paylaşılır ve yeni hedeflerinize göre bir sonraki paket planlanır. Dilediğiniz zaman devam edebilir veya farklı bir programa geçebilirsiniz.",
            },
            {
              question: "Ders saatlerini ben mi belirliyorum?",
              answer: "Evet, dersler tamamen esnek saatlerde planlanır. Hafta içi veya hafta sonu, size uygun saatlerde ders alabilirsiniz.",
            },
            {
              question: "Ödeme seçenekleri nelerdir?",
              answer: "Banka havalesi veya EFT ile ödeme yapılabilir. Paket seçiminize göre toplu veya taksitli ödeme imkanı mevcuttur.",
            },
          ]}
        />

        {/* First Ad Section */}
        <section className="py-20 bg-gradient-to-br from-secondary/10 via-background to-primary/10 relative overflow-hidden">
          <div className="absolute top-10 right-10 animate-pulse opacity-10" style={{ animationDuration: "3s" }}>
            <Sparkles className="w-32 h-32 text-accent" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="bg-background/80 backdrop-blur-sm p-12 rounded-3xl border-2 border-secondary/20 shadow-2xl animate-in fade-in zoom-in-95 duration-700">
                <h2 className="font-serif text-3xl md:text-4xl mb-6">İlk Adımı Atalım</h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Ücretsiz demo dersle başlayın, hiçbir ödeme yapmadan beni ve ders tarzımı tanıyın
                </p>
                <Button size="lg" className="text-lg px-8 rounded-xl group" asChild>
                  <Link href="/demo-ders">
                    Ücretsiz Demo Ders Rezervasyonu
                    <TrendingUp className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
