import { BookOpen, Video, Target, Clock } from 'lucide-react'

const features = [
  {
    icon: BookOpen,
    title: 'Kişiye Özel Program',
    description: 'Seviyenize, ihtiyaçlarınıza ve öğrenme tarzınıza göre özelleştirilmiş ders planları'
  },
  {
    icon: Video,
    title: 'Online veya Yüz Yüze',
    description: 'İstediğiniz yerde, istediğiniz zamanda esnek ders seçenekleri'
  },
  {
    icon: Target,
    title: 'Hedef Odaklı',
    description: 'Sınav hazırlığı, iş İngilizcesi veya günlük konuşma - size uygun içerik'
  },
  {
    icon: Clock,
    title: 'Esnek Saatler',
    description: 'Yoğun programınıza uygun, esnek ders saatleri'
  }
]

export function Features() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl mb-4 text-balance">
              Neden <span className="text-primary">Text Language School</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Her öğrencinin benzersiz olduğuna inanıyorum. Bu yüzden derslerim 
              tamamen sizin ihtiyaçlarınıza göre şekillenir
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex gap-4 p-6 rounded-lg border-2 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-xl">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
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
