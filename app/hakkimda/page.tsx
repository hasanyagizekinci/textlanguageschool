import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { GraduationCap, Briefcase, Heart, Award, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Hakkımda - İngiliz Dili ve Edebiyatı Mezunu Eğitmen",
  description:
    "Filolog, İngiliz Dili ve Edebiyatı mezunu, deneyimli İngilizce eğitmeni. Kişiselleştirilmiş öğretim metodolojisi ile online İngilizce dersleri. YDS, YÖKDİL, OET sınav hazırlık uzmanı.",
  keywords: [
    "ingilizce öğretmeni",
    "ingiliz dili ve edebiyatı",
    "online ingilizce eğitmeni",
    "deneyimli ingilizce öğretmeni",
    "ingilizce özel ders öğretmeni",
    "filolog ingilizce eğitmen",
    "ingilizce öğrenme",
    "online ingilizce öğretmen",
    "YDS eğitmeni",
    "YÖKDİL eğitmeni",
  ],
  alternates: {
    canonical: "/hakkimda",
  },
  openGraph: {
    title: "Hakkımda | Text Language School",
    description: "İngiliz Dili ve Edebiyatı mezunu, deneyimli ve tutkulu İngilizce eğitmeni. Online özel ders.",
    url: "/hakkimda",
  },
}

export default function HakkimdaPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20">
        <section className="py-20 md:py-32 bg-gradient-to-b from-primary/10 via-secondary/5 to-background relative overflow-hidden">
          {/* Quirky floating elements */}
          <div className="absolute top-20 left-10 opacity-10 animate-pulse" style={{ animationDuration: "3s" }}>
            <Sparkles className="w-16 h-16 text-primary" />
          </div>
          <div className="absolute bottom-32 right-20 opacity-10 animate-bounce" style={{ animationDuration: "4s" }}>
            <Sparkles className="w-20 h-20 text-secondary" />
          </div>

          {/* Wavy decoration */}
          <svg
            className="absolute top-0 left-0 w-full opacity-5"
            viewBox="0 0 1200 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0,50 Q300,80 600,50 T1200,50 L1200,0 L0,0 Z" fill="currentColor" className="text-primary" />
          </svg>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">Tutkuyla Öğreten</span>
              </div>

              <h1
                className="font-serif text-4xl md:text-6xl mb-6 text-balance animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: "100ms" }}
              >
                Merhaba, ben{" "}
                <span className="text-primary relative">
                  Çılga Sevil
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
                style={{ animationDelay: "200ms" }}
              >
                Filolog, İngiliz Dili ve Edebiyatı mezunu, deneyimli ve tutkulu bir İngilizce eğitmeni
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-background to-secondary/5 relative">
          {/* Decorative quote marks */}
          <div className="absolute top-10 left-10 text-primary/5 hidden lg:block">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
            </svg>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto">
              {/* Visual timeline dots */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary/20 via-secondary/20 to-transparent hidden md:block" />

              <div className="space-y-8">
                <div className="relative pl-12 animate-in fade-in slide-in-from-left-4 duration-700">
                  <div className="absolute left-0 top-2 w-6 h-6 rounded-full bg-primary/20 border-4 border-background shadow-lg" />
                  <div className="bg-background/80 backdrop-blur-sm p-6 rounded-2xl border border-primary/10 shadow-sm">
                    <p className="text-lg text-foreground leading-relaxed">
                      İngilizceye olan tutkum, lisede yabancı dil olarak İngilizceye başlamam ve üniversitede İngiliz
                      Dili ve Edebiyatı bölümünü seçmemle gelişti. Dili sadece gramer kuralları ve kelime bilgisi olarak
                      öğrenmenin yeterli olmadığını, aynı zamanda bir kültür ve ifade şekli olarak kavramam gerektiğini
                      bu süreçte fark ettim.
                    </p>
                  </div>
                </div>

                <div
                  className="relative pl-12 animate-in fade-in slide-in-from-left-4 duration-700"
                  style={{ animationDelay: "100ms" }}
                >
                  <div className="absolute left-0 top-2 w-6 h-6 rounded-full bg-secondary/20 border-4 border-background shadow-lg" />
                  <div className="bg-background/80 backdrop-blur-sm p-6 rounded-2xl border border-secondary/10 shadow-sm">
                    <p className="text-lg text-foreground leading-relaxed">
                      Mezuniyetimin ardından hem öğretmenlik hem de eğitim koordinatörlüğü deneyimleri kazandım ve
                      farklı meslek gruplarından öğrencilerle çalıştım. Bu süreç, İngilizcenin sadece kelimelerden
                      ibaret olmadığını, her alanda farklı şekilde algılandığını ve kullanıldığını bana gösterdi. Aynı
                      zamanda <strong>her öğrencinin öğrenme stilinin farklı olduğunu</strong> ve{" "}
                      <strong>kişiselleştirilmiş bir yaklaşımın başarının anahtarı olduğunu</strong> gözlemledim. İşte
                      tam bu yüzden, öğrencilerin kendi yolculuklarını en verimli şekilde deneyimleyebileceği Text
                      Language School'u kurdum.
                    </p>
                  </div>
                </div>

                <div
                  className="relative pl-12 animate-in fade-in slide-in-from-left-4 duration-700"
                  style={{ animationDelay: "200ms" }}
                >
                  <div className="absolute left-0 top-2 w-6 h-6 rounded-full bg-accent/20 border-4 border-background shadow-lg" />
                  <div className="bg-background/80 backdrop-blur-sm p-6 rounded-2xl border border-accent/10 shadow-sm">
                    <p className="text-lg text-foreground leading-relaxed">
                      Derslerimde akademik bilgiyi eğlenceli ve pratik yöntemlerle birleştiriyorum. Amacım sadece
                      İngilizce öğretmek değil;{" "}
                      <strong>öğrencilerimin İngilizceyi özgüvenle kullanmalarını sağlamak</strong>. Her öğrenciye özel
                      not tutuyor, ilerlemelerini takip ediyor ve{" "}
                      <strong>motivasyonlarını yüksek tutmak için programı iyileştirmeye açık oluyorum</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-accent/5 to-primary/5 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-20 right-10 w-40 h-40 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-20 left-10 w-60 h-60 rounded-full bg-secondary/5 blur-3xl" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                <h2 className="font-serif text-3xl md:text-4xl mb-4 relative inline-block">
                  Neden Benimle Çalışmalısınız?
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
                      className="text-accent/30"
                    />
                  </svg>
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div
                  className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 hover:border-primary/40 hover:shadow-xl transition-all duration-300 group animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: "100ms" }}
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/20 mb-4 group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl mb-3">Akademik Altyapı</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    İngiliz Dili ve Edebiyatı eğitimi ile dil bilgisi, edebiyat ve kültürel bağlamda sağlam bir bilgi
                    birikimine sahibim.
                  </p>
                </div>

                <div
                  className="p-8 rounded-2xl bg-gradient-to-br from-secondary/10 to-secondary/5 border-2 border-secondary/20 hover:border-secondary/40 hover:shadow-xl transition-all duration-300 group animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: "200ms" }}
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-secondary/20 mb-4 group-hover:scale-110 transition-transform">
                    <Briefcase className="w-7 h-7 text-secondary" />
                  </div>
                  <h3 className="font-serif text-xl mb-3">Çok Yönlü Deneyim</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Öğretmenlik ve eğitim koordinatörlüğü tecrübelerimle hem pedagojik hem de organizasyonel becerileri
                    derslerime yansıtıyorum.
                  </p>
                </div>

                <div
                  className="p-8 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border-2 border-accent/20 hover:border-accent/40 hover:shadow-xl transition-all duration-300 group animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: "300ms" }}
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent/20 mb-4 group-hover:scale-110 transition-transform">
                    <Heart className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="font-serif text-xl mb-3">Samimi ve Özenli</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Her öğrencimle samimi bir bağ kuruyor, öğrenme sürecinizi eğlenceli ve motive edici hale getirmek
                    için özen gösteriyorum.
                  </p>
                </div>

                <div
                  className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/5 border-2 border-primary/20 hover:border-secondary/40 hover:shadow-xl transition-all duration-300 group animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: "400ms" }}
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/20 mb-4 group-hover:scale-110 transition-transform">
                    <Award className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl mb-3">Sonuç Odaklı</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Hedeflerinize ulaşmanız için düzenli geri bildirim, pratik alıştırmalar ve kişiselleştirilmiş
                    ödevlerle sizi destekliyorum.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-secondary/10 via-background to-accent/10 relative overflow-hidden">
          {/* Animated star */}
          <div className="absolute top-10 right-20 animate-spin opacity-10" style={{ animationDuration: "20s" }}>
            <Sparkles className="w-24 h-24 text-accent" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="bg-background/80 backdrop-blur-sm p-12 rounded-3xl border-2 border-primary/20 shadow-2xl animate-in fade-in zoom-in-95 duration-700">
                <h2 className="font-serif text-3xl md:text-4xl mb-6">Tanışalım mı?</h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Ücretsiz demo dersimizde sizinle tanışmak, hedeflerinizi dinlemek ve size nasıl yardımcı olabileceğimi
                  göstermek isterim
                </p>
                <Button size="lg" className="text-lg px-8 rounded-xl group" asChild>
                  <Link href="/demo-ders">
                    Ücretsiz Demo Ders Al
                    <Sparkles className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
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
