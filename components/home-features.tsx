import { BookOpen, Video, Clock, Target } from 'lucide-react'

const features = [
  {
    icon: BookOpen,
    title: 'Kişiselleştirilmiş Program',
    description: 'Seviyenize ve hedeflerinize özel hazırlanan ders içerikleri',
  },
  {
    icon: Video,
    title: 'Online & Esnek',
    description: 'İstediğiniz yerden, size uygun saatlerde online dersler',
  },
  {
    icon: Clock,
    title: 'Etkili Süreç',
    description: 'Düzenli geri bildirim ve ilerleme takibi ile hızlı gelişim',
  },
  {
    icon: Target,
    title: 'Sonuç Odaklı',
    description: 'Sınav hazırlığı, iş İngilizcesi veya günlük konuşma için özel yaklaşım',
  },
]

export function HomeFeatures() {
  return (
    <section className="py-28 md:py-36 relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-5 text-balance tracking-tight">
              Nasıl Çalışıyoruz?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Sizin için özel olarak tasarlanmış bir öğrenme deneyimi
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex gap-5 p-7 rounded-lg bg-card border border-border/50 hover:border-border hover:shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${150 * (index + 1)}ms` }}
              >
                <div className="flex-shrink-0">
                  <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-secondary/8">
                    <feature.icon className="w-5 h-5 text-secondary" strokeWidth={1.5} />
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-lg mb-1.5">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
