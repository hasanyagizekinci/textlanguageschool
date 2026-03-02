import Script from "next/script"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Calendar, Clock, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "Öğrenme Yolculuğu: Meraktan Gelişime | Text Language School Blog",
  description: "Öğrenme sürecinin evreleri ve dil öğrenmenin benzersiz doğası hakkında. İngilizce öğrenme motivasyonu ve Text Language School'un kişiye özel yaklaşımı.",
  keywords: ["ingilizce öğrenme motivasyonu", "dil öğrenme süreci", "ingilizce öğrenme yolculuğu", "online ingilizce"],
  alternates: {
    canonical: "/blog/ogrenme-yolculugu",
  },
  openGraph: {
    title: "Öğrenme Yolculuğu: Meraktan Gelişime",
    description: "Öğrenme sürecinin evreleri ve dil öğrenmenin benzersiz doğası hakkında.",
    url: "/blog/ogrenme-yolculugu",
    type: "article",
    publishedTime: "2025-12-18T00:00:00.000Z",
    authors: ["Text Language School"],
  },
}

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Öğrenme Yolculuğu: Meraktan Gelişime",
  description: "Öğrenme sürecinin evreleri ve dil öğrenmenin benzersiz doğası hakkında.",
  datePublished: "2025-12-18T00:00:00.000Z",
  dateModified: "2025-12-18T00:00:00.000Z",
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
    "@id": "https://www.textlanguageschool.net/blog/ogrenme-yolculugu",
  },
  inLanguage: "tr",
}

export default function BlogPost() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20">
        <Script id="ld-article-ogrenme" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(articleJsonLd)}
        </Script>
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
                  Öğrenme Yolculuğu: Meraktan Gelişime
                </h1>
                <div className="flex items-center gap-6 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>18 Aralık 2025</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>6 dk okuma</span>
                  </div>
                </div>
              </header>

              <div className="prose prose-lg max-w-none">
                <p className="lead text-xl text-muted-foreground mb-8">
                  Bir şeyler öğrenmek, insan olmanın en temel ve dönüştürücü eylemlerinden biridir. Bu yolculuk bazen
                  bir gereklilikten, bazen de meraktan doğar ve sonunda yeni bir bilginin fark ettirmeden zihnimize
                  yerleşmesiyle tamamlanır.
                </p>

                <p>
                  Evreleri herkese tanıdık gelse de deneyimi son derece kişisel olan bu süreç, yalnızca bilgi edinmekten
                  ibaret değildir; aynı zamanda dünyayı algılayışımızın genişlemesidir.
                </p>

                <h2>Öğrenmenin Evreleri</h2>
                <p>
                  Öğrenme süreci çoğu zaman düz ve sorunsuz ilerlemez. İlk hevesi, kaçınılmaz zorlukların ve
                  beceriksizlik döneminin takip ettiği bir yoldur. Yeni başlayan bir aşçı sosu yakabilir, hevesli bir
                  programcı çözülmeyen bir kodla karşılaşabilir, bitki yetiştirmeye çalışan biri ise nedenini anlamadığı
                  bir solmayı izlemek zorunda kalabilir.
                </p>

                <p>
                  Bu aşama, sabır ve kararlılık isteyen bir sınavdır; acemi olmanın alçakgönüllülüğünü gerektirir. Ancak
                  gerçek ustalığın temeli tam da bu tekrarlarda, çabalarda ve yeniden denemelerde atılır.
                </p>

                <blockquote className="border-l-4 border-secondary pl-6 my-8 italic text-lg">
                  Sonunda dağınık parçaların bir bütün oluşturduğu "işte bu" anı gelir. Akorlar doğru şekilde çalınır,
                  kod sorunsuzca çalışır, bir teori gerçek hayattaki bir olguyu açıklar.
                </blockquote>

                <h2>Dil Öğrenmenin Özel Doğası</h2>
                <p>
                  Bu evrensel öğrenme ritmi, özellikle yeni bir dil öğrenirken daha da belirginleşir. Çünkü bir dil
                  öğrenmek, sadece kelime ezberlemek değil; yeni bir düşünme biçimine, farklı bir kimlik alanına adım
                  atmaktır.
                </p>

                <p>
                  İlk merak, yeni seslerin zorlukla çıkarıldığı ve ilk cümlelerin tökezleyerek kurulduğu bir süreç
                  yaratır. Dil bilgisi kuralları, kültürel ayrıntılar ve yabancılık hissi öğrencinin karşısına sık sık
                  çıkar. Yine de bir noktada entegrasyon gerçekleşir: yeni dilde görülen ilk rüya, anlaşılan ilk espri,
                  doğru aktarılan ilk karmaşık duygu.
                </p>

                <div className="bg-accent/5 p-6 rounded-xl border border-accent/20 my-8">
                  <p className="font-semibold mb-2">
                    Bu anlar, hem bir bilgiyi kazandığımızı hem de yeni bir benlik inşa ettiğimizi gösterir.
                  </p>
                </div>

                <h2>Kişiselleştirilmiş Yaklaşımın Önemi</h2>
                <p>
                  Öğrenme bu kadar kişisel bir yolculuk olduğu için, bu yolun gerçekleştiği ortam da aynı derecede
                  önemlidir. Herkese aynı şekilde yaklaşan, tek kalıplı sistemler bir öğrencinin kendine özgü ritmini ve
                  ilerleme şeklini gölgeleyebilir. Gerçek gelişim, kişinin kendi hızını, öğrenme tarzını ve güçlü-zayıf
                  yönlerini fark etmesiyle başlar.
                </p>

                <h2>Text Language School'un Yaklaşımı</h2>
                <p>
                  Text Language School'un benimsediği anlayış tam olarak budur. Text, akıcılığa ulaşmanın ortak bir
                  hedef olduğunu kabul ederken, bu hedefe giden yolun herkes için parmak izi kadar farklı olduğunu
                  bilir. Bu nedenle öğrencileri belirli bir sisteme uydurmaya çalışmak yerine, yaklaşımını onlara göre
                  şekillendirir.
                </p>

                <p>
                  Öğrencinin bütünsel gelişimini destekler. Bu güvenli ve motive edici ortamda odak noktası, sadece
                  müfredatı tamamlamak değil, kişisel bir dönüşümden geçerek ilerlemektir.
                </p>

                <blockquote className="border-l-4 border-primary pl-6 my-8 italic text-lg">
                  Text Language School'da öğrenme, bireye saygı duyulan, dönüştürücü ve benzersiz bir yolculuk olarak
                  değer görür.
                </blockquote>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
