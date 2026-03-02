import { FAQSection } from "@/components/faq-section"

const homeFAQItems = [
  {
    question: "Online İngilizce dersler nasıl işliyor?",
    answer: "Dersler Zoom üzerinden birebir olarak yapılmaktadır. Her ders 60 dakikadır ve sizin seviyenize, hedeflerinize göre özel olarak planlanır. Ders sonrasında detaylı notlar ve ödevler paylaşılır.",
  },
  {
    question: "Hangi sınavlara hazırlık yapılıyor?",
    answer: "YDS, YÖKDİL, YDT (YKS Yabancı Dil), OET, IELTS ve TOEFL sınavlarına özel hazırlık programları mevcuttur. Her sınav için stratejik çalışma planı ve deneme testleri hazırlanır.",
  },
  {
    question: "Ücretsiz demo ders nasıl alabilirim?",
    answer: "Demo ders sayfamızdan veya WhatsApp üzerinden iletişime geçerek ücretsiz 30 dakikalık tanışma dersi alabilirsiniz. Bu derste seviyeniz belirlenir ve size özel program önerisi yapılır.",
  },
  {
    question: "Hangi seviyelere ders veriliyor?",
    answer: "A1 başlangıçtan C2 ileri seviyeye kadar tüm seviyelerde ders verilmektedir. İlk derste seviye tespit edildikten sonra size en uygun program hazırlanır.",
  },
  {
    question: "Sitedeki ücretsiz pratik araçlarını kimler kullanabilir?",
    answer: "Kelime ezberleme flashcard'ları, gramer alıştırmaları, YDS/YÖKDİL/YDT sınav pratikleri, kelime eşleştirme oyunları ve interaktif seviye testi gibi tüm araçlarımız herkese ücretsiz ve açıktır.",
  },
  {
    question: "OET sınavı nedir, kimlere yönelik?",
    answer: "OET (Occupational English Test), sağlık profesyonellerinin yurtdışında çalışabilmesi için gereken İngilizce yeterlilik sınavıdır. Doktor, hemşire, eczacı gibi sağlık çalışanlarına özel hazırlık programımız mevcuttur.",
  },
  {
    question: "İş İngilizcesi dersleri neleri kapsıyor?",
    answer: "İş görüşmeleri, sunumlar, e-posta yazımı, toplantı ve müzakere İngilizcesi, sektöre özel terminoloji gibi profesyonel ihtiyaçlarınıza yönelik kapsamlı bir program sunulmaktadır.",
  },
]

export function HomeFAQ() {
  return (
    <FAQSection
      title="Sık Sorulan Sorular"
      subtitle="Online İngilizce eğitimimiz hakkında merak ettikleriniz"
      items={homeFAQItems}
    />
  )
}
