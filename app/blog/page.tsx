import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Blog - İngilizce Öğrenme İpuçları, Stratejiler ve Sınav Hazırlık",
  description:
    "İngilizce öğrenme yolculuğunuzda size rehberlik edecek makaleler, ipuçları ve stratejiler. YDS, YÖKDİL, OET sınav hazırlık tavsiyeleri, kelime öğrenme teknikleri ve gramer ipuçları.",
  keywords: [
    "ingilizce öğrenme ipuçları",
    "dil öğrenme teknikleri",
    "ingilizce blog",
    "dil eğitimi makaleleri",
    "ingilizce gramer ipuçları",
    "sınav hazırlık stratejileri",
    "ingilizce konuşma teknikleri",
    "YDS hazırlık ipuçları",
    "YÖKDİL kelime listesi",
    "ingilizce kelime öğrenme yöntemleri",
    "online ingilizce öğrenme",
    "ingilizce çalışma teknikleri",
  ],
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "İngilizce Öğrenme Blogu | Text Language School",
    description: "İngilizce öğrenme yolculuğunuzda size rehberlik edecek makaleler, sınav ipuçları ve stratejiler.",
    url: "/blog",
  },
}

const blogPosts = [
  {
    title: "Dil Öğrenmek Neden Kişiye Özel Bir Macera Olmalı?",
    excerpt:
      "Dil öğrenmenin neden tamamen sizinle ilgili olması gerektiğini keşfedin. Her beynin öğrenme ritmi, ilgi alanlarınızın gücü ve hata yapma özgürlüğünün önemi hakkında.",
    date: "10 Ocak 2026",
    readTime: "5 dk",
    slug: "kisiye-ozel-macera",
    color: "primary",
  },
  {
    title: "Dil Öğrenme Pazarı ve Bilimsel Gerçekler",
    excerpt:
      "Dil öğrenme pazarındaki yanlış algıları ve Chomsky'nin dönüşümsel-üretimsel dilbilgisi modelinin dil öğretimine etkilerini keşfedin. Literatürde hiçbir bilimsel karşılığı olmayan hız odaklı yöntemler hakkında.",
    date: "20 Aralık 2025",
    readTime: "8 dk",
    slug: "dil-ogrenme-pazari",
    color: "secondary",
  },
  {
    title: "Öğrenme Yolculuğu: Meraktan Gelişime",
    excerpt:
      "Öğrenme sürecinin evreleri, dil öğrenmenin benzersiz doğası ve Text Language School'un kişiselleştirilmiş yaklaşımı. Öğrenmenin neden bu kadar kişisel bir yolculuk olduğunu keşfedin.",
    date: "18 Aralık 2025",
    readTime: "6 dk",
    slug: "ogrenme-yolculugu",
    color: "accent",
  },
  {
    title: 'Konuşma Akıcılığını Artırmada "4–3–2" Tekniği',
    excerpt:
      "İngilizce konuşma akıcılığını geliştirmek için bilimsel olarak kanıtlanmış etkili bir teknik keşfedin. Nation'ın tanımına göre akıcılık ve pratik uygulama yöntemleri.",
    date: "15 Aralık 2025",
    readTime: "7 dk",
    slug: "4-3-2-teknigi",
    color: "primary",
  },
]

export default function BlogPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20">
        <section className="py-24 md:py-32 bg-gradient-to-b from-primary/5 to-background relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-20 right-20 opacity-5 hidden lg:block rotate-12">
            <BookOpen className="w-32 h-32 text-primary" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h1 className="font-serif text-4xl md:text-6xl mb-6 text-balance">Blog & İpuçları</h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  İngilizce öğrenme yolculuğunuzda size rehberlik edecek makaleler, ipuçları ve stratejiler
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {blogPosts.map((post, index) => (
                  <Card
                    key={index}
                    className={`border-2 hover:shadow-xl transition-all duration-300 overflow-hidden group animate-in fade-in slide-in-from-bottom-4 ${
                      post.color === "primary"
                        ? "border-primary/20 hover:border-primary/40"
                        : post.color === "secondary"
                          ? "border-secondary/20 hover:border-secondary/40"
                          : "border-accent/20 hover:border-accent/40"
                    }`}
                    style={{ animationDelay: `${100 * (index + 1)}ms` }}
                  >
                    <div
                      className={`h-2 ${
                        post.color === "primary"
                          ? "bg-primary"
                          : post.color === "secondary"
                            ? "bg-secondary"
                            : "bg-accent"
                      }`}
                    />
                    <CardContent className="p-6 space-y-4">
                      <div
                        className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${
                          post.color === "primary"
                            ? "bg-primary/10"
                            : post.color === "secondary"
                              ? "bg-secondary/10"
                              : "bg-accent/10"
                        }`}
                      >
                        <BookOpen
                          className={`w-6 h-6 ${
                            post.color === "primary"
                              ? "text-primary"
                              : post.color === "secondary"
                                ? "text-secondary"
                                : "text-accent"
                          }`}
                        />
                      </div>

                      <h3 className="font-serif text-xl leading-tight group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-muted-foreground leading-relaxed text-sm">{post.excerpt}</p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>

                      <Link
                        href={`/blog/${post.slug}`}
                        className={`inline-flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all ${
                          post.color === "primary"
                            ? "text-primary"
                            : post.color === "secondary"
                              ? "text-secondary"
                              : "text-accent"
                        }`}
                      >
                        Devamını Oku <ArrowRight className="w-4 h-4" />
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
