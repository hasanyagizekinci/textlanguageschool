import { GraduationCap, Heart, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function About() {
  return (
    <section id="about" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl mb-4 text-balance">
              Merhaba, ben <span className="text-primary">Çılga Sevil</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              İngiliz Dili ve Edebiyatı mezunu olarak öğretmenlik ve idarecilik tecrübelerimi 
              sizlerle paylaşmaktan mutluluk duyuyorum
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border border-border/50 hover:shadow-sm transition-shadow rounded-lg">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl">Akademik Temeli Sağlam</h3>
                <p className="text-muted-foreground leading-relaxed">
                  İngiliz Dili ve Edebiyatı mezunu olarak dil bilgisi, edebiyat ve kültürel 
                  bağlamı derinlemesine anlıyorum
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border/50 hover:shadow-sm transition-shadow rounded-lg">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-secondary/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-serif text-xl">Tecrübeli & Özverili</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Yıllara dayanan öğretmenlik ve idarecilik tecrübemle her öğrenciye 
                  en uygun öğrenme yöntemini sunuyorum
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border/50 hover:shadow-sm transition-shadow rounded-lg">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl">Eğlenceli & Samimi</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Derslerim sadece akademik değil, aynı zamanda keyifli ve motive edici. 
                  Öğrencilerimle güvene dayalı bir bağ kuruyorum
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
