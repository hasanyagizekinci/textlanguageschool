import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight, BookOpen } from "lucide-react"
import Link from "next/link"

const blogPosts = [
  {
    title: "Dil Öğrenmek Neden Kişiye Özel Bir Macera Olmalı?",
    excerpt:
      "Dil öğrenmenin neden tamamen sizinle ilgili olması gerektiğini keşfedin. Her beynin öğrenme ritmi ve ilgi alanlarınızın gücü.",
    date: "10 Ocak 2026",
    slug: "kisiye-ozel-macera",
    color: "primary",
  },
  {
    title: "Dil Öğrenme Pazarı ve Bilimsel Gerçekler",
    excerpt:
      "Dil öğrenme pazarındaki yanlış algıları ve Chomsky'nin dönüşümsel-üretimsel dilbilgisi modelinin dil öğretimine etkilerini keşfedin.",
    date: "20 Aralık 2025",
    slug: "dil-ogrenme-pazari",
    color: "secondary",
  },
  {
    title: "Öğrenme Yolculuğu: Meraktan Gelişime",
    excerpt:
      "Öğrenme sürecinin evreleri, dil öğrenmenin benzersiz doğası ve Text Language School'un kişiselleştirilmiş yaklaşımı.",
    date: "18 Aralık 2025",
    slug: "ogrenme-yolculugu",
    color: "accent",
  },
]

export function BlogPreview() {
  return (
    <section className="py-28 md:py-36 relative">

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-5 text-balance tracking-tight">
              Blog & <span className="text-secondary">İpuçları</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
              İngilizce öğrenme yolculuğunuzda size yardımcı olacak içerikler
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {blogPosts.map((post, index) => (
              <Card
                key={index}
                className="border border-border/50 hover:border-border hover:shadow-sm transition-all duration-300 overflow-hidden group animate-in fade-in slide-in-from-bottom-4 rounded-lg"
                style={{ animationDelay: `${150 * (index + 1)}ms` }}
              >
                <div className="h-px bg-border/30" />
                <CardContent className="p-6 space-y-4">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/8">
                    <BookOpen className="w-5 h-5 text-secondary" strokeWidth={1.5} />
                  </div>

                  <h3 className="font-serif text-xl leading-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed text-sm">{post.excerpt}</p>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all"
                  >
                    Devamını Oku <ArrowRight className="w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-600">
            <Button size="lg" variant="outline" className="rounded-lg border border-foreground/15 text-foreground hover:bg-foreground/5 bg-transparent transition-all" asChild>
              <Link href="/blog">Tüm Blog Yazıları</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
