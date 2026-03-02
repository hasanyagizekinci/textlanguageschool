import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Calendar, Video, Clock, CheckCircle2, Sparkles, Rocket, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollToTop } from "@/components/scroll-to-top"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Ücretsiz Demo Ders - Online İngilizce Deneme Dersi",
  description:
    "Ücretsiz 30 dakikalık online İngilizce demo dersi ile tanışın. Seviye belirleme, hedef analizi ve kişiselleştirilmiş program önerisi. Hemen WhatsApp'tan randevu alın!",
  keywords: [
    "ücretsiz ingilizce dersi",
    "demo ders",
    "online ingilizce deneme",
    "ingilizce seviye testi",
    "ücretsiz deneme dersi",
    "online ingilizce demo",
    "ingilizce seviye belirleme",
    "ücretsiz online ingilizce",
    "ingilizce öğrenmeye başla",
    "ingilizce ilk ders ücretsiz",
  ],
  alternates: {
    canonical: "/demo-ders",
  },
  openGraph: {
    title: "Ücretsiz Demo Ders | Text Language School",
    description: "Ücretsiz 30 dakikalık online İngilizce demo dersi. Hemen randevu alın!",
    url: "/demo-ders",
  },
}

const benefits = [
  {
    icon: Calendar,
    title: "Esnek Randevu",
    description: "Size uygun tarih ve saatte demo dersinizi planlayın",
  },
  {
    icon: Video,
    title: "Online Ders",
    description: "Konforlu bir ortamda, istediğiniz yerden katılın",
  },
  {
    icon: Clock,
    title: "30 Dakika",
    description: "Tanışma, seviye belirleme ve sorularınızı cevaplayalım",
  },
  {
    icon: CheckCircle2,
    title: "Tamamen Ücretsiz",
    description: "Hiçbir ödeme yapmadan beni ve ders tarzımı tanıyın",
  },
]

export default function DemoDersPage() {
  return (
    <>
      <ScrollToTop />
      <Navigation />
      <main className="min-h-screen pt-20">
        <section className="py-20 md:py-32 bg-gradient-to-br from-accent/10 via-primary/5 to-secondary/10 relative overflow-hidden">
          {/* Quirky animations */}
          <div className="absolute top-20 left-20 opacity-10 animate-bounce" style={{ animationDuration: "3s" }}>
            <Rocket className="w-20 h-20 text-accent" />
          </div>
          <div className="absolute bottom-32 right-10 opacity-10 animate-pulse" style={{ animationDuration: "4s" }}>
            <Sparkles className="w-24 h-24 text-primary" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">100% Ücretsiz</span>
              </div>

              <h1 className="font-serif text-4xl md:text-6xl mb-6 text-balance animate-in fade-in slide-in-from-bottom-4 duration-700">
                Ücretsiz{" "}
                <span className="text-primary relative">
                  Demo Ders
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
                Hiçbir yükümlülük olmadan tanışalım, İngilizce seviyenizi belirleyelim ve size nasıl yardımcı
                olabileceğimi göstereyim
              </p>
            </div>
          </div>
        </section>

        {/* Randevu Al - Moved to top for mobile users */}
        <section className="py-12 md:py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl md:text-4xl mb-4">Demo Ders Rezervasyonu</h2>
                <p className="text-lg text-muted-foreground">Hemen randevu alın ve başlayalım</p>
              </div>

              {/* Direct Calendly Button - Better for mobile */}
              <div className="flex flex-col items-center gap-6">
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-8 md:p-12 rounded-3xl border-2 border-primary/20 shadow-xl w-full max-w-2xl text-center">
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/20 mb-4">
                      <Calendar className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="font-serif text-2xl mb-3">Ücretsiz Demo Dersinizi Ayırtın</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Size uygun bir tarih ve saat seçin, 30 dakikalık demo dersimizde tanışalım
                    </p>
                  </div>

                  <Button
                    asChild
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <a
                      href="https://calendly.com/textlanguageschool-info/30min"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      Randevu Al
                    </a>
                  </Button>
                </div>

                {/* Alternative Contact Options */}
                <div className="grid md:grid-cols-2 gap-4 w-full max-w-2xl">
                  <div className="bg-gradient-to-br from-accent/10 to-accent/5 p-6 rounded-2xl border-2 border-accent/20 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-serif text-lg mb-1">WhatsApp</h4>
                        <a
                          href="https://wa.me/905334746478?text=Merhaba,%20demo%20ders%20hakkında%20bilgi%20almak%20istiyorum"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-accent hover:underline"
                        >
                          Hemen mesaj gönder
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 p-6 rounded-2xl border-2 border-secondary/20 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-serif text-lg mb-1">E-posta</h4>
                        <a href="mailto:info@textlanguageschool.net" className="text-sm text-secondary hover:underline">
                          E-posta gönder
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Demo Derste Neler Olur - Moved below booking */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-background to-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                <h2 className="font-serif text-3xl md:text-4xl mb-4 relative inline-block">
                  Demo Derste Neler Olur?
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

              <div className="grid md:grid-cols-2 gap-6 mb-16">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className={`flex gap-6 p-6 rounded-2xl border-2 hover:shadow-xl transition-all duration-300 group animate-in fade-in slide-in-from-bottom-4 ${
                      index % 4 === 0
                        ? "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:border-primary/40"
                        : index % 4 === 1
                          ? "bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20 hover:border-secondary/40"
                          : index % 4 === 2
                            ? "bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:border-accent/40"
                            : "bg-gradient-to-br from-primary/10 to-secondary/5 border-primary/20 hover:border-secondary/40"
                    }`}
                    style={{ animationDelay: `${100 * (index + 1)}ms` }}
                  >
                    <div className="flex-shrink-0">
                      <div
                        className={`inline-flex items-center justify-center w-14 h-14 rounded-xl group-hover:scale-110 transition-transform ${
                          index % 4 === 0
                            ? "bg-primary/20"
                            : index % 4 === 1
                              ? "bg-secondary/20"
                              : index % 4 === 2
                                ? "bg-accent/20"
                                : "bg-primary/20"
                        }`}
                      >
                        <benefit.icon
                          className={`w-7 h-7 ${
                            index % 4 === 0
                              ? "text-primary"
                              : index % 4 === 1
                                ? "text-secondary"
                                : index % 4 === 2
                                  ? "text-accent"
                                  : "text-primary"
                          }`}
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-serif text-xl mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="prose prose-lg max-w-none">
                <div className="bg-gradient-to-br from-accent/15 to-accent/5 border-2 border-accent/30 rounded-2xl p-8 shadow-lg">
                  <h3 className="font-serif text-2xl mb-6 text-foreground flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-accent" />
                    Demo Ders Icerigi
                  </h3>
                  <ul className="space-y-3 text-foreground">
                    {[
                      "Tanışma ve hedeflerinizi dinleme",
                      "Kısa bir seviye belirleme aktivitesi",
                      "Ders tarzımı ve metodlarımı tanıma",
                      "Size özel öğrenme planı önerisi",
                      "Sorularınızı yanıtlama ve paket seçenekleri",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 animate-in fade-in slide-in-from-left-4"
                        style={{ animationDelay: `${100 * (i + 1)}ms` }}
                      >
                        <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-secondary/5 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                <h2 className="font-serif text-3xl md:text-4xl mb-4 relative inline-block">
                  Sıkça Sorulan Sorular
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

              <div className="space-y-4">
                {[
                  {
                    q: "Demo ders gerçekten ücretsiz mi?",
                    a: "Evet, demo ders tamamen ücretsizdir ve herhangi bir ödeme bilgisi talep edilmez. Amacım sizinle tanışmak ve size nasıl yardımcı olabileceğimi göstermektir.",
                    color: "primary",
                  },
                  {
                    q: "Demo dersten sonra devam etmek zorunda mıyım?",
                    a: "Hayır, hiçbir zorunluluk yok. Demo dersten sonra karar verebilirsiniz. Amacım sizin için doğru seçeneği sunmaktır.",
                    color: "secondary",
                  },
                  {
                    q: "Hangi platformu kullanıyorsunuz?",
                    a: "Genellikle Zoom veya Google Meet kullanıyorum. Rezervasyon yaptıktan sonra detaylı bilgi ve bağlantı mailinize gönderilecektir.",
                    color: "accent",
                  },
                  {
                    q: "Demo ders ne kadar sürer?",
                    a: "Demo dersimiz yaklaşık 30 dakika sürmektedir. Bu süre tanışmamız, seviyenizi belirlememiz ve sorularınızı yanıtlamamız için yeterli olmaktadır.",
                    color: "primary",
                  },
                ].map((faq, i) => (
                  <div
                    key={i}
                    className={`p-6 rounded-xl border-l-4 hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-left-4 ${
                      faq.color === "primary"
                        ? "bg-primary/5 border-primary"
                        : faq.color === "secondary"
                          ? "bg-secondary/5 border-secondary"
                          : "bg-accent/5 border-accent"
                    }`}
                    style={{ animationDelay: `${100 * (i + 1)}ms` }}
                  >
                    <h3 className="font-serif text-lg mb-2">{faq.q}</h3>
                    <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
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
