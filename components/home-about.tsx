import { User, BookOpen, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HomeAbout() {
  return (
    <section className="py-28 md:py-36 relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-5 text-balance tracking-tight">
              Neden <span className="text-primary">Text</span>?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Seviyene, hedeflerine ve öğrenme stiline göre özel olarak hazırlanmış müfredat;
              deneyimli öğretmenlik yaklaşımı ve kişisel ders planlamasıyla birleşir.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-14">
            {[
              { icon: User, title: "Kişisel Müfredat", desc: "Her öğrenci için, seviyesine ve hedeflerine özel, tamamen kişiselleştirilmiş bir öğrenme planı sunuyoruz." },
              { icon: BookOpen, title: "Kişisel Rehberlik", desc: "Sadece ders planına değil; ilerlemenizi takip ediyor, süreci not alıyor ve bir sonraki adımı birlikte planlıyoruz." },
              { icon: Target, title: "Bütünsel Dil Gelişimi", desc: "Konuşma, yazma, kelime, listening ve cümle kurma becerilerini dengeli bir şekilde geliştiriyoruz." },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center p-8 rounded-lg bg-card border border-border/50 hover:border-border hover:shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${150 * (i + 1)}ms` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/8 mb-5">
                  <item.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-600">
            <Button size="lg" variant="outline" className="rounded-lg border border-foreground/15 text-foreground hover:bg-foreground/5 bg-transparent transition-all" asChild>
              <Link href="/hakkimda">Detaylı Bilgi</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
