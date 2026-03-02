import Script from "next/script"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Calendar, Clock, ArrowLeft, Brain, Rocket, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "Dil Öğrenmek Neden Kişiye Özel Bir Macera Olmalı? | Text Language School Blog",
  description: "Dil öğrenmenin neden tamamen sizinle ilgili olması gerektiğini keşfedin. Her beynin öğrenme ritmi, ilgi alanlarınızın gücü ve hata yapma özgürlüğü. Kişiselleştirilmiş İngilizce eğitimi.",
  keywords: ["kişiye özel ingilizce", "ingilizce öğrenme", "bireysel dil eğitimi", "online ingilizce özel ders"],
  alternates: {
    canonical: "/blog/kisiye-ozel-macera",
  },
  openGraph: {
    title: "Dil Öğrenmek Neden Kişiye Özel Bir Macera Olmalı?",
    description: "Dil öğrenmenin neden tamamen sizinle ilgili olması gerektiğini keşfedin.",
    url: "/blog/kisiye-ozel-macera",
    type: "article",
    publishedTime: "2026-01-10T00:00:00.000Z",
    authors: ["Text Language School"],
  },
}

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Dil Öğrenmek Neden Kişiye Özel Bir Macera Olmalı?",
  description: "Dil öğrenmenin neden tamamen sizinle ilgili olması gerektiğini keşfedin.",
  datePublished: "2026-01-10T00:00:00.000Z",
  dateModified: "2026-01-10T00:00:00.000Z",
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
    "@id": "https://www.textlanguageschool.net/blog/kisiye-ozel-macera",
  },
  inLanguage: "tr",
}

export default function BlogPost() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20">
        <Script id="ld-article-kisiye" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(articleJsonLd)}
        </Script>
        <article className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Button variant="ghost" className="mb-8" asChild>
                <Link href="/blog">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Tum Yazilar
                </Link>
              </Button>

              <header className="mb-12">
                <h1 className="font-serif text-4xl md:text-5xl mb-6 leading-tight">
                  Dil Öğrenmek Neden &quot;Kişiye Özel&quot; Bir Macera Olmalı?
                </h1>
                <div className="flex items-center gap-6 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>10 Ocak 2026</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>5 dk okuma</span>
                  </div>
                </div>
              </header>

              <div className="prose prose-lg max-w-none">
                <p className="lead text-xl text-muted-foreground mb-8 text-justify">
                  Hepimiz aynı sıralarda oturduk, aynı gramer kitaplarını açtık  ve aynı &quot;Subject-Verb-Object&quot; formüllerini ezberledik. Peki, sonuç? Çoğumuz &quot;anlıyorum ama konuşamıyorum&quot; durağında takılıp kaldık. Neden mi? Çünkü dil öğrenmek kitlesel bir üretim bandı değil, bireysel bir keşif yolculuğudur.
                </p>

                <p className="text-justify">
                  İşte dil öğrenmenin neden tamamen &quot;seninle ilgili&quot; olmasi gerektiğine dair 3 temel neden:
                </p>

                <div className="bg-primary/5 p-8 rounded-xl border border-primary/20 my-8">
                  <div className="flex items-start gap-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 shrink-0">
                      <Brain className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-serif mb-3 mt-0">1. Her Beynin Bir &quot;Öğrenme Ritmi&quot; Vardır</h2>
                      <p className="mb-0">
                        Kimi insan duyduğu bir kelimeyi asla unutmaz (işitsel), kimi ise o kelimeyi bir kağıda yazip altını çizmeden rahat edemez (görsel). Bir sınıfta öğretmenin hizi, ya size çok yavaş gelir ya da yetişemezsiniz.
                      </p>
                      <p className="mt-4 mb-0 text-justify">
                        Dil ogrenimi bireyselleştiğinde, tempo tamamen size ait olur. Anlamadığınız bir yapının üzerinde günlerce durabilir veya çok iyi bildiğiniz bir konuyu &quot;zaman kaybetmeden&quot; geçebilirsiniz.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary/5 p-8 rounded-xl border border-secondary/20 my-8">
                  <div className="flex items-start gap-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-secondary/10 shrink-0">
                      <Rocket className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-serif mb-3 mt-0">2. İlgi Alanlarınız Sizin Yakıtınızdır</h2>
                      <p className="mb-0 text-justify">
                        Eğer bir mimarsaniz, neden saatlerce &quot;restoranda sipariş verme&quot; diyalogları üzerine calişasınız ki? Dil, hayatın içine karıştığında kalıcı olur.
                      </p>
                      <p className="mt-4 mb-0">
                        Bireysel bir programda, sevdiğiniz diziler üzerinden pratik yapabilir, işinizle ilgili terimlere odaklanabilir veya hobileriniz hakkında konuşarak kelime dagarcığınızı geliştirebilirsiniz. İlginizi çekmeyen bir konuyu, o dilde öğrenemezsiniz.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-accent/5 p-8 rounded-xl border border-accent/20 my-8">
                  <div className="flex items-start gap-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 shrink-0">
                      <Shield className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-xl font-serif mb-3 mt-0">3. Hata Yapma Özgürlüğü ve Özgüven</h2>
                      <p className="mb-0 text-justify">
                        Topluluk önünde konuşmak zaten zorken, bir de bunu bilmediğiniz bir dilde yapmak &quot;hata yapma korkusunu&quot; tetikler. Oysa bireysel bir süreçte (veya bire bir eğitimlerde), hata yapmak sadece bir öğrenme aracıdır.
                      </p>
                      <p className="mt-4 mb-0 text-justify">
                        Kimsenin sizi yarglamayacağını bildiğinizde, o cümleler ağzınızdan çok daha cesurca dökülür. Unutmayın; dil, mükemmel olduğunuzda değil, hata yapmaya cesaret ettiğinizde öğrenilir.
                      </p>
                    </div>
                  </div>
                </div>

                <blockquote className="border-l-4 border-primary pl-6 my-8 italic text-lg">
                  İngilizce öğrenmek sadece bir ders değil, kendinize eklediğiniz yeni bir kimliktir. Bu kimliği başkasının kalıplarına göre değil, kendi ihtiyaçlarınıza ve ruhunuza göre tasarlamalısınız.
                </blockquote>

                <h2>{""}</h2>
                <p className="text-justify">
                  Siz de kendi hızınızda, kendi ilgi alanlarınızla ve en önemlisi &quot;kendiniz olarak&quot; İngilizce öğrenmek ister misiniz? Kişiselleştirilmiş dil yolculuğunuza bugün başlayın.
                </p>

                <div className="mt-12 p-6 bg-muted/50 rounded-xl text-center">
                  <p className="text-lg font-medium mb-4">Kişiselleştirilmiş dil yolculuğunuza başlamak ister misiniz?</p>
                  <Button size="lg" className="rounded-xl" asChild>
                    <Link href="/demo-ders">Ucretsiz Demo Ders</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
