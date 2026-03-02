import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Calendar, Clock, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: 'İngilizce Konuşma Akıcılığını Artırmada "4-3-2" Tekniği | Text Language School Blog',
  description: "İngilizce konuşma akıcılığını geliştirmek için bilimsel olarak kanıtlanmış etkili bir teknik. Online İngilizce öğrenme ve konuşma pratiği için rehber.",
  keywords: ["ingilizce konuşma pratiği", "ingilizce akıcılık", "4-3-2 tekniği", "ingilizce öğrenme", "konuşma çalışması"],
  alternates: {
    canonical: "/blog/4-3-2-teknigi",
  },
  openGraph: {
    title: 'İngilizce Konuşma Akıcılığını Artırmada "4-3-2" Tekniği',
    description: "İngilizce konuşma akıcılığını geliştirmek için bilimsel olarak kanıtlanmış etkili bir teknik.",
    url: "/blog/4-3-2-teknigi",
    type: "article",
    publishedTime: "2025-12-15T00:00:00.000Z",
    authors: ["Text Language School"],
  },
}

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: 'Konuşma Akıcılığını Artırmada "4-3-2" Tekniği',
  description: "İngilizce konuşma akıcılığını geliştirmek için bilimsel olarak kanıtlanmış etkili bir teknik.",
  datePublished: "2025-12-15T00:00:00.000Z",
  dateModified: "2025-12-15T00:00:00.000Z",
  author: {
    "@type": "Organization",
    name: "Text Language School",
    url: "https://www.textlanguageschool.net",
  },
  publisher: {
    "@type": "Organization",
    name: "Text Language School",
    logo: {
      "@type": "ImageObject",
      url: "https://www.textlanguageschool.net/logo.png",
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://www.textlanguageschool.net/blog/4-3-2-teknigi",
  },
  inLanguage: "tr",
}

export default function BlogPost() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20">
        <article className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Button variant="ghost" className="mb-8" asChild>
                <Link href="/blog">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Tüm Yazılar
                </Link>
              </Button>

              <header className="mb-12">
                <h1 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
                  Konuşma Akıcılığını Artırmada "4–3–2" Tekniği
                </h1>
                <div className="flex items-center gap-6 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>15 Aralık 2025</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>7 dk okuma</span>
                  </div>
                </div>
              </header>

              <div className="prose prose-lg max-w-none">
                <p className="lead text-xl text-muted-foreground mb-8">
                  İngilizce konuşma becerisi, dil öğrenenler için çoğu zaman en zorlayıcı alanlardan biri olarak
                  görülür. İnsanlar kelimeleri ararken veya cümleleri kurarken duraksayabilir ve bu durum, iletişim
                  akışını olumsuz etkileyebilir.
                </p>

                <h2>Akıcılık Nedir?</h2>
                <p>
                  Akıcılık, Nation (2014:11) tarafından{" "}
                  <strong>"kişinin hâlihazırda bildiklerini en iyi şekilde kullanabilmesi"</strong> olarak tanımlanır.
                  Bu tanım, akıcılığın yeni kelimeler veya karmaşık dil bilgisi kuralları öğrenmekle değil,
                  <strong>zaten bilinenleri etkili ve doğru biçimde kullanmakla</strong> doğrudan ilişkili olduğunu
                  göstermektedir.
                </p>

                <p>
                  Dolayısıyla İngilizce konuşma akıcılığını artırmak isteyen bireylerin öncelikle mevcut bilgilerini
                  tekrar etmeleri ve pratik yapmaları önemlidir.
                </p>

                <h2>"4–3–2" Tekniği Nedir?</h2>
                <p>
                  Bu bağlamda, konuşma akıcılığını geliştirmek için uygulanabilecek etkili yöntemlerden biri{" "}
                  <strong>"4–3–2" Tekniğidir</strong>. Bu teknik, konuşmayı giderek azalan sürelerde farklı partnerlere
                  aktarmayı hedefleyen basit bir uygulamadır. Orijinal olarak dört kişilik gruplarda uygulanmak üzere
                  tasarlanmış olmasına rağmen, bireysel olarak da uygulanabilir. Bu yönüyle esnek ve pratik bir
                  yöntemdir.
                </p>

                <div className="bg-primary/5 p-8 rounded-xl border border-primary/20 my-8">
                  <h3 className="text-xl font-serif mb-4">4 Temel Adım</h3>
                  <ol className="space-y-4 mb-0">
                    <li>
                      <strong>1. Konu Seçimi:</strong> Konuşması çok zor olmayan bir konu seçin. Öğrencinin veya
                      katılımcının rahatlıkla ifade edebileceği bir konu belirlenir ve konu hakkında kısa bir plan
                      yapılır; fakat not alınmaz.
                    </li>
                    <li>
                      <strong>2. İlk Konuşma (4 Dakika):</strong> Seçilen konu hakkında 4 dakika boyunca bir partnere
                      konuşma yapılır. Bu süre zarfında partner konuşmaya müdahale etmez veya soru sormaz.
                    </li>
                    <li>
                      <strong>3. İkinci Konuşma (3 Dakika):</strong> Süre 3 dakikaya düşürülerek aynı konuşma tekrar
                      edilir. Bu adım, konuşmanın daha kısa sürede ve daha düzenli aktarılmasını teşvik eder.
                    </li>
                    <li>
                      <strong>4. Üçüncü Konuşma (2 Dakika):</strong> Süre 2 dakikaya düşürülür ve konuşma üçüncü
                      partnere aktarılır. Artık konuşmacı, aynı bilgiyi hızlı ve akıcı bir biçimde ifade edebilmelidir.
                    </li>
                  </ol>
                </div>

                <h2>Bireysel Uygulama</h2>
                <p>
                  Eğer katılımcının partneri yoksa, "4–3–2" tekniği bireysel olarak da uygulanabilir. Konuşmalar kendine
                  yapılabilir ve istenirse kaydedilerek daha sonra dinlenebilir. Bu şekilde kişi, hatalarını
                  gözlemleyebilir ve akıcılığını geliştirmek için geri bildirim almış olur.
                </p>

                <h2>Bilimsel Kanıtlar</h2>
                <p>
                  Araştırmalar, "4–3–2" tekniğinin konuşma akıcılığını artırmada etkili olduğunu göstermektedir. Thai ve
                  Boers (2016), De Jong ve Perfetti (2011), Ghasemi ve Mozaheb (2021) gibi dilbilimciler bu tekniğin
                  öğrenci performansını olumlu yönde etkilediğini belirtmişlerdir.
                </p>

                <p>
                  Uygulamada, öğrenciler konuşmayı tekrar ettikçe daha hızlı düşünmeye, gereksiz kelimeleri elemeye ve
                  cümleleri otomatik hâle getirmeye başlar. Bu süreç, gerçek hayattaki akıcı konuşmanın temelini
                  oluşturur.
                </p>

                <blockquote className="border-l-4 border-accent pl-6 my-8 italic text-lg">
                  "4–3–2" tekniği, İngilizce konuşma akıcılığını geliştirmek isteyen herkes için basit, uygulanabilir ve
                  etkili bir yöntemdir.
                </blockquote>

                <h2>Sonuç</h2>
                <p>
                  Teknik, tekrarlara dayalı yapısı, zaman sınırlamaları ve odaklanma stratejileri sayesinde konuşmacının
                  hem hızını hem de kendine güvenini artırır. Mevcut bilgileri tekrar ederek pratik yapmak, akıcı ve
                  etkili konuşmanın en temel yoludur ve "4–3–2" yöntemi bu amacı gerçekleştirmek için ideal bir araçtır.
                </p>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
