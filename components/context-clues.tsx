"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, RotateCcw, CheckCircle2, XCircle, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { addXp, checkAndUnlockAchievements, XP_REWARDS } from "@/lib/xp-system"
import { showXpToast, showAchievementToast, playSoundEffect } from "@/components/xp-toast"
import { ShareChallenge } from "@/components/share-challenge"
import { QuizHeader } from "@/components/quiz-header"

interface ContextQ {
  id: number
  sentence: string
  highlightedWord: string
  options: string[]
  correct: number
  explanation: string
}

const questions: ContextQ[] = [
  { id: 1, sentence: "The teacher tried to **elucidate** the complex concept by giving several examples.", highlightedWord: "elucidate", options: ["Açıklamak", "Karmaşıklaştırmak", "Gizlemek", "Değiştirmek"], correct: 0, explanation: "Örnekler vererek kavramı anlatmaya çalışması, açıklama yaptığını gösterir." },
  { id: 2, sentence: "After eating the contaminated food, he felt a sense of **nausea** and had to lie down.", highlightedWord: "nausea", options: ["Mutluluk", "Mide bulantısı", "Yorgunluk", "Heyecan"], correct: 1, explanation: "Bozuk yiyecek yemek ve yatma ihtiyacı, mide bulantısına işaret eder." },
  { id: 3, sentence: "The **meticulous** artist spent hours perfecting every tiny detail of the painting.", highlightedWord: "meticulous", options: ["Tembel", "Dikkatsiz", "Titiz", "Aceleci"], correct: 2, explanation: "Her küçük detayı mükemmelleştirmek için saatler harcamak, titizliği gösterir." },
  { id: 4, sentence: "Unlike her gregarious sister, Maria was quite **reclusive** and preferred spending time alone.", highlightedWord: "reclusive", options: ["Sosyal", "Konuşkan", "Enerjik", "İnzivaya çekilmiş"], correct: 3, explanation: "'Unlike gregarious' ve 'yalnız vakit geçirmeyi tercih etmek' zıt anlamı işaret eder." },
  { id: 5, sentence: "The politician's **eloquent** speech moved the audience to tears.", highlightedWord: "eloquent", options: ["Etkili/güzel konuşma", "Sıkıcı", "Kısa", "Karışık"], correct: 0, explanation: "Dinleyicileri ağlatacak kadar etkileyici bir konuşma, etkili/güzel konuşmayı işaret eder." },
  { id: 6, sentence: "The **ubiquitous** smartphone has become an essential part of modern life.", highlightedWord: "ubiquitous", options: ["Pahalı", "Her yerde bulunan", "Eski", "Gereksiz"], correct: 1, explanation: "Modern yaşamın vazgeçilmez parçası olmak, her yerde bulunmayı gösterir." },
  { id: 7, sentence: "Despite his **affluent** background, he chose to live a simple life.", highlightedWord: "affluent", options: ["Fakir", "Ortalama", "Zengin", "Karışık"], correct: 2, explanation: "'Basit bir yaşam seçmesine rağmen' ifadesi, zıt bir durumu (zenginlik) işaret eder." },
  { id: 8, sentence: "The medicine helped to **alleviate** her pain, making her feel much better.", highlightedWord: "alleviate", options: ["Artırmak", "Oluşturmak", "Değiştirmek", "Hafifletmek"], correct: 3, explanation: "Kendini daha iyi hissetmesi, ağrısının hafifletildiğini gösterir." },
  { id: 9, sentence: "The **pragmatic** leader focused on practical solutions rather than idealistic dreams.", highlightedWord: "pragmatic", options: ["Pratik/uygulamacı", "Hayalperest", "Tembel", "Duygusal"], correct: 0, explanation: "İdealist hayaller yerine pratik çözümlere odaklanmak, pragmatikliği gösterir." },
  { id: 10, sentence: "After the long drought, the farmers were **jubilant** when it finally rained.", highlightedWord: "jubilant", options: ["Üzgün", "Kızgın", "Çok mutlu/sevinç dolu", "Kayıtsız"], correct: 2, explanation: "Uzun kuraklıktan sonra yağmurun gelmesi büyük sevinç yaratıyor." },
  { id: 11, sentence: "The company decided to **curtail** its spending due to financial difficulties.", highlightedWord: "curtail", options: ["Artırmak", "Devam ettirmek", "Değerlendirmek", "Azaltmak/kısmak"], correct: 3, explanation: "Mali zorluklar nedeniyle harcamaları azaltmak anlamlı." },
  { id: 12, sentence: "Her **candid** remarks about the project surprised everyone because she is usually very diplomatic.", highlightedWord: "candid", options: ["Açık sözlü/samimi", "Diplomatik", "Kapalı", "Belirsiz"], correct: 0, explanation: "'Genelde diplomatik' olan birisinin bu sefer şaşırtması, açık sözlü olduğunu gösterir." },
  { id: 13, sentence: "The **resilient** community rebuilt their homes within months after the earthquake.", highlightedWord: "resilient", options: ["Zayıf", "Dayanıklı/güçlü", "Zengin", "Küçük"], correct: 1, explanation: "Deprem sonrası aylar içinde evlerini yeniden inşa etmeleri dayanıklılığı gösterir." },
  { id: 14, sentence: "The professor's **verbose** lectures often lasted twice as long as scheduled.", highlightedWord: "verbose", options: ["Kısa", "İlginç", "Çok konuşan/uzun", "Sessiz"], correct: 2, explanation: "Planlanandan iki kat uzun sürmesi, çok konuşmalı/uzun olduğunu gösterir." },
  { id: 15, sentence: "The **benevolent** organization donated millions to help disaster victims.", highlightedWord: "benevolent", options: ["Bencil", "Zengin", "Ünlü", "İyiliksever"], correct: 3, explanation: "Afet mağdurlarına milyonlarca bağış yapmak iyilikseverliği gösterir." },
  { id: 16, sentence: "The new employee's **diligent** work ethic impressed all her colleagues.", highlightedWord: "diligent", options: ["Tembel", "Çalışkan/özenli", "Agresif", "Sessiz"], correct: 1, explanation: "İş ahlakının tüm meslektaşlarını etkilemesi, çalışkanlık ve özeni gösterir." },
  { id: 17, sentence: "The child's **incessant** crying lasted for hours, giving everyone a headache.", highlightedWord: "incessant", options: ["Aralıklı", "Sessiz", "Durmaksızın devam eden", "Hafif"], correct: 2, explanation: "Saatlerce sürmesi ve herkese baş ağrısı vermesi, durmaksızın olduğunu gösterir." },
  { id: 18, sentence: "His **frugal** lifestyle allowed him to save enough money to retire early.", highlightedWord: "frugal", options: ["Savurgan", "Zengin", "Lüks", "Tutumlu"], correct: 3, explanation: "Erken emekli olacak kadar para biriktirmek tutumlu bir yaşam tarzına işaret eder." },
  { id: 19, sentence: "The **audacious** plan involved breaking into the heavily guarded building.", highlightedWord: "audacious", options: ["Cüretkar/cesur", "Dikkatli", "Korkak", "Basit"], correct: 0, explanation: "Ağır güvenlikli bir binaya girmek gibi bir plan cüretkar demektir." },
  { id: 20, sentence: "The teacher's **sardonic** comments made the students uncomfortable.", highlightedWord: "sardonic", options: ["Nazik", "Alaycı/iğneleyici", "Eğlenceli", "Destekleyici"], correct: 1, explanation: "Öğrencileri rahatsız eden yorumlar alaycı/iğneleyici olduğunu gösterir." },
  { id: 21, sentence: "The **intrepid** explorer ventured into the unknown jungle despite the warnings.", highlightedWord: "intrepid", options: ["Korkak", "Tecrübesiz", "Gözüpek/cesur", "Kayıp"], correct: 2, explanation: "Uyarılara rağmen bilinmeyen bir ormana girmek cesurluğu gösterir." },
  { id: 22, sentence: "The storm caused **havoc** across the region, destroying homes and roads.", highlightedWord: "havoc", options: ["Huzur", "Düzen", "Sessizlik", "Yıkım/kaos"], correct: 3, explanation: "Evleri ve yolları yıkması büyük kaos/yıkım olduğunu gösterir." },
  { id: 23, sentence: "She felt **ambivalent** about the job offer — excited about the role but worried about the long commute.", highlightedWord: "ambivalent", options: ["İkircikli/kararsız", "Kararlı", "Mutlu", "Kızgın"], correct: 0, explanation: "Hem heyecanlı hem endişeli olmak çelişkili/ikircikli duygulara işaret eder." },
  { id: 24, sentence: "The CEO's **draconian** policies resulted in mass employee resignations.", highlightedWord: "draconian", options: ["Esnek", "Adil", "Çok sert/acımasız", "Popüler"], correct: 2, explanation: "Toplu istifaya yol açan politikalar çok sert/acımasız olmalı." },
  { id: 25, sentence: "The charity's **altruistic** mission aims to provide clean water to developing nations.", highlightedWord: "altruistic", options: ["Bencil", "Özverili/diğerkam", "Ticari", "Politik"], correct: 1, explanation: "Gelişmekte olan ülkelere temiz su sağlamak özverili bir amaca işaret eder." },
  { id: 26, sentence: "After years of conflict, the two nations finally reached a **tenuous** peace agreement.", highlightedWord: "tenuous", options: ["Sağlam", "Kalıcı", "Zayıf/kırılgan", "Güçlü"], correct: 2, explanation: "Yıllarca süren çatışma sonrası varılan barış, kırılgan/zayıf olarak nitelenir." },
  { id: 27, sentence: "The once-prosperous town fell into **destitution** after the factory closed down.", highlightedWord: "destitution", options: ["Zenginlik", "Kalabalık", "Kaos", "Yoksulluk/sefalet"], correct: 3, explanation: "Fabrika kapandıktan sonra refah kaybı yaşanması yoksulluğa işaret eder." },
  { id: 28, sentence: "The witness gave a **lucid** account of the accident, making every detail easy to understand.", highlightedWord: "lucid", options: ["Açık/anlaşılır", "Karışık", "Bulanık", "Uzun"], correct: 0, explanation: "Her detayı kolay anlaşılır kılmak, açık ve net bir anlatım olduğunu gösterir." },
  { id: 29, sentence: "His **nonchalant** attitude towards the final exam shocked his classmates.", highlightedWord: "nonchalant", options: ["Kaygılı", "Kayıtsız/umursamaz", "Çalışkan", "Heyecanlı"], correct: 1, explanation: "Final sınavına karşı takınılan bu tutumun şok yaratması, kayıtsızlığa işaret eder." },
  { id: 30, sentence: "The hikers were **famished** after their eight-hour trek through the mountains.", highlightedWord: "famished", options: ["Dinlenmiş", "Mutlu", "Çok aç", "Yorgun"], correct: 2, explanation: "Sekiz saatlik dağ yürüyüşünden sonra çok aç olmak mantıklıdır." },
  { id: 31, sentence: "Her **magnanimous** gesture of forgiving her rival earned her great respect.", highlightedWord: "magnanimous", options: ["Küçümseyici", "Bencil", "Cömert/yüce gönüllü", "Korkak"], correct: 2, explanation: "Rakibini affetmesi ve saygı kazanması yüce gönüllülüğe işaret eder." },
  { id: 32, sentence: "The **clandestine** meeting was held in a hidden room to avoid detection.", highlightedWord: "clandestine", options: ["Açık", "Resmi", "Gizli", "Kalabalık"], correct: 2, explanation: "Gizli bir odada tespit edilmemek için yapılan toplantı, gizliliğe işaret eder." },
  { id: 33, sentence: "The new policy was met with **vehement** opposition from both employees and unions.", highlightedWord: "vehement", options: ["Hafif", "Sessiz", "Destekleyici", "Şiddetli/ateşli"], correct: 3, explanation: "Hem çalışanlardan hem sendikalardan gelen güçlü muhalefet şiddetli bir tepkiyi gösterir." },
  { id: 34, sentence: "The artist was known for her **prolific** output, producing over 200 paintings in a single year.", highlightedWord: "prolific", options: ["Üretken/verimli", "Yavaş", "Tembel", "Seçici"], correct: 0, explanation: "Tek yılda 200'den fazla tablo üretmek yüksek üretkenliği gösterir." },
  { id: 35, sentence: "The children were **enthralled** by the magician's tricks and refused to leave their seats.", highlightedWord: "enthralled", options: ["Sıkılmış", "Korkmuş", "Büyülenmiş/hayran", "Kızgın"], correct: 2, explanation: "Yerlerinden kalkmayı reddetmeleri, büyülenmiş olduklarını gösterir." },
  { id: 36, sentence: "After the scandal, the politician's reputation was **tarnished** beyond repair.", highlightedWord: "tarnished", options: ["Güçlenmiş", "Lekelenmis/zedelenmiş", "Parlamış", "Korunmuş"], correct: 1, explanation: "Skandal sonrası onarılamaz hale gelen itibar, lekelenmis olduğunu gösterir." },
  { id: 37, sentence: "The **pervasive** smell of fresh bread filled every corner of the bakery.", highlightedWord: "pervasive", options: ["Hafif", "Hoş", "Yaygın/her yere yayılan", "Geçici"], correct: 2, explanation: "Fırının her köşesini dolduran koku, yaygın/her yere yayılan anlamına gelir." },
  { id: 38, sentence: "Despite being a **novice**, she played the piano with remarkable confidence.", highlightedWord: "novice", options: ["Uzman", "Profesyonel", "Yaşlı", "Acemi/yeni başlayan"], correct: 3, explanation: "'Buna rağmen' güvenle çalması, beklentinin tersine acemi olduğunu gösterir." },
  { id: 39, sentence: "The **exorbitant** price of the luxury apartment made it unaffordable for most buyers.", highlightedWord: "exorbitant", options: ["Aşırı/fahiş", "Uygun", "Düşük", "Makul"], correct: 0, explanation: "Çoğu alıcı için karşılanamaz olması, fiyatın aşırı/fahiş olduğunu gösterir." },
  { id: 40, sentence: "The scientist's **groundbreaking** research led to a completely new treatment for the disease.", highlightedWord: "groundbreaking", options: ["Sıradan", "Yıkıcı", "Çığır açan/devrimsel", "Eski"], correct: 2, explanation: "Tamamen yeni bir tedaviye yol açan araştırma çığır açan/devrimsel niteliktedir." },
  { id: 41, sentence: "The old building was in a state of **dilapidation**, with broken windows and crumbling walls.", highlightedWord: "dilapidation", options: ["Yenilenme", "Harap olma/yıkılma", "İnşaat", "Dekorasyon"], correct: 1, explanation: "Kırık camlar ve yıkılan duvarlar harap olma durumuna işaret eder." },
  { id: 42, sentence: "His **impeccable** record made him the ideal candidate for the promotion.", highlightedWord: "impeccable", options: ["Sorunlu", "Kusursuz", "Sıradan", "Tartışmalı"], correct: 1, explanation: "Terfi için ideal aday olması, kusursuz bir sicile işaret eder." },
  { id: 43, sentence: "The dictator ruled with **impunity**, never facing punishment for his crimes.", highlightedWord: "impunity", options: ["Adalet", "Cezasızlık", "Merhamet", "Korku"], correct: 1, explanation: "Suçları için hiç ceza görmemesi cezasızlığa işaret eder." },
  { id: 44, sentence: "The **enigmatic** smile on her face left everyone wondering what she was thinking.", highlightedWord: "enigmatic", options: ["Açık", "Gizemli/esrarengiz", "Üzgün", "Mutlu"], correct: 1, explanation: "Herkesin ne düşündüğünü merak etmesi, gizemli olduğunu gösterir." },
  { id: 45, sentence: "The **repercussions** of the policy change were felt across the entire industry.", highlightedWord: "repercussions", options: ["Faydalar", "Sonuçlar/yansımalar", "Kurallar", "Değişiklikler"], correct: 1, explanation: "Politika değişikliğinin tüm sektörde hissedilmesi, sonuç/yansıma anlamına gelir." },
  { id: 46, sentence: "She showed great **fortitude** during her long illness, never complaining once.", highlightedWord: "fortitude", options: ["Zayıflık", "Metanet/dayanıklılık", "Korku", "Sabırsızlık"], correct: 1, explanation: "Uzun hastalığı boyunca hiç şikayet etmemesi metanete işaret eder." },
  { id: 47, sentence: "The **ostentatious** display of wealth made the other guests uncomfortable.", highlightedWord: "ostentatious", options: ["Mütevazı", "Gösterişli/şatafatlı", "Gizli", "Sade"], correct: 1, explanation: "Diğer misafirleri rahatsız eden zenginlik gösterisi, gösterişli olduğunu belirtir." },
  { id: 48, sentence: "His **lethargic** behavior worried his parents; he barely moved from the couch all day.", highlightedWord: "lethargic", options: ["Enerjik", "Uyuşuk/halsiz", "Hırslı", "Mutlu"], correct: 1, explanation: "Bütün gün koltuktan kıpırdamaması uyuşukluk/halsizliğe işaret eder." },
  { id: 49, sentence: "The manager's **arbitrary** decisions frustrated the team because there was no logic behind them.", highlightedWord: "arbitrary", options: ["Mantıklı", "Keyfi/gelişigüzel", "Adil", "Planlı"], correct: 1, explanation: "Arkasında mantık olmaması, kararların keyfi olduğunu gösterir." },
  { id: 50, sentence: "After years of **abstinence**, he finally allowed himself a piece of chocolate.", highlightedWord: "abstinence", options: ["Aşırı tüketim", "Perhiz/kaçınma", "Kayıtsızlık", "Bağımlılık"], correct: 1, explanation: "Yıllarca sonra kendine bir parça çikolata izin vermesi, uzun süreli kaçınmaya işaret eder." },
  { id: 51, sentence: "The **gregarious** host made sure every guest felt welcome at the party.", highlightedWord: "gregarious", options: ["İçe kapanık", "Toplumsal/sosyal", "Kibirli", "Sessiz"], correct: 1, explanation: "Her misafirin kendini iyi hissetmesini sağlamak sosyal/cana yakın olmayı gösterir." },
  { id: 52, sentence: "The lawyer built a **cogent** argument that convinced even the skeptics.", highlightedWord: "cogent", options: ["Zayıf", "İnandırıcı/güçlü", "Karışık", "Uzun"], correct: 1, explanation: "Şüphecileri bile ikna etmesi, argümanın inandırıcı olduğunu gösterir." },
  { id: 53, sentence: "The government imposed **stringent** regulations on factory emissions.", highlightedWord: "stringent", options: ["Gevşek", "Katı/sıkı", "Geçici", "İsteğe bağlı"], correct: 1, explanation: "Fabrika emisyonlarına getirilen düzenlemeler katı/sıkı olarak nitelendirilir." },
  { id: 54, sentence: "Her **vivacious** personality lit up every room she entered.", highlightedWord: "vivacious", options: ["Sakin", "Canlı/hayat dolu", "Ürkek", "Ciddi"], correct: 1, explanation: "Girdiği her odayı aydınlatması canlı ve hayat dolu bir kişiliğe işaret eder." },
  { id: 55, sentence: "The **austere** living conditions in the monastery surprised the new monks.", highlightedWord: "austere", options: ["Lüks", "Sade/kemer sıkan", "Rahat", "Modern"], correct: 1, explanation: "Manastırdaki şaşırtıcı yaşam koşulları sade/kemer sıkan anlamına gelir." },
  { id: 56, sentence: "The **volatile** situation in the region made investors nervous.", highlightedWord: "volatile", options: ["Sabit", "Değişken/istikrarsız", "Güvenli", "Olumlu"], correct: 1, explanation: "Yatırımcıların gergin olması, durumun değişken/istikrarsız olduğunu gösterir." },
  { id: 57, sentence: "Her **tenacious** pursuit of the truth eventually uncovered the scandal.", highlightedWord: "tenacious", options: ["Gevşek", "Azimli/inatçı", "Kısa süreli", "Yüzeysel"], correct: 1, explanation: "Gerçeği ortaya çıkarması, azimli ve kararlı bir takip olduğunu gösterir." },
  { id: 58, sentence: "The **lucrative** contract made the small company wealthy overnight.", highlightedWord: "lucrative", options: ["Riskli", "Kazançlı/kârlı", "Zararlı", "Uzun vadeli"], correct: 1, explanation: "Şirketi bir gecede zengin etmesi, sözleşmenin kazançlı olduğunu gösterir." },
  { id: 59, sentence: "The politician made a **disparaging** remark about his opponent during the debate.", highlightedWord: "disparaging", options: ["Övücü", "Küçümseyen/aşağılayan", "Tarafsız", "Destekleyici"], correct: 1, explanation: "Rakibi hakkında yapılan bu yorum, küçümseyen/aşağılayan niteliktedir." },
  { id: 60, sentence: "The medicine had an **adverse** effect, making the patient feel worse.", highlightedWord: "adverse", options: ["Olumlu", "Olumsuz/zararlı", "Nötr", "Güçlü"], correct: 1, explanation: "Hastanın daha kötü hissetmesi ilacın olumsuz etkisini gösterir." },
  { id: 61, sentence: "The **clandestine** meeting was held in a basement to avoid detection.", highlightedWord: "clandestine", options: ["Resmi", "Gizli/el altından", "Kalabalık", "Planlı"], correct: 1, explanation: "Fark edilmemek için bodrum katta yapılması gizli olduğunu gösterir." },
  { id: 62, sentence: "His **prodigious** talent for mathematics was evident from a young age.", highlightedWord: "prodigious", options: ["Sıradan", "Olağanüstü/harika", "Zayıf", "Geç gelişen"], correct: 1, explanation: "Küçük yaştan belli olan yetenek olağanüstü niteliktedir." },
  { id: 63, sentence: "The **mundane** tasks of daily life often leave people feeling uninspired.", highlightedWord: "mundane", options: ["Heyecanlı", "Sıradan/monoton", "Karmaşık", "Yaratıcı"], correct: 1, explanation: "İnsanları ilhamsız bırakan günlük işler sıradan/monoton niteliktedir." },
  { id: 64, sentence: "The witness gave a **credible** account of the events that took place.", highlightedWord: "credible", options: ["Şüpheli", "İnandırıcı/güvenilir", "Kısa", "Karmaşık"], correct: 1, explanation: "Olayların açıklaması inandırıcı/güvenilir olarak nitelendirilir." },
  { id: 65, sentence: "The **archaic** laws were finally updated to reflect modern values.", highlightedWord: "archaic", options: ["Modern", "Eski/kadim", "Yeni", "İlerici"], correct: 1, explanation: "Modern değerleri yansıtmak için güncellenmesi, yasaların eski olduğunu gösterir." },
  { id: 66, sentence: "She spoke with such **conviction** that everyone believed her story.", highlightedWord: "conviction", options: ["Şüphe", "İnanç/kesinlik", "Korku", "Tereddüt"], correct: 1, explanation: "Herkesin hikayesine inanması, kesinlik ve inançla konuştuğunu gösterir." },
  { id: 67, sentence: "The **prolific** author published over forty novels in his career.", highlightedWord: "prolific", options: ["Yavaş", "Üretken/velut", "Tanınmayan", "Sıradan"], correct: 1, explanation: "Kırk romanın üzerinde yayımlamak üretken olduğunu gösterir." },
  { id: 68, sentence: "The charity's **benevolent** actions helped thousands of homeless people.", highlightedWord: "benevolent", options: ["Bencil", "İyiliksever/hayırsever", "Kayıtsız", "Agresif"], correct: 1, explanation: "Binlerce evsiz insana yardım etmesi iyiliksever/hayırsever olduğunu gösterir." },
  { id: 69, sentence: "He made a **spontaneous** decision to quit his job and travel the world.", highlightedWord: "spontaneous", options: ["Planlı", "Anlık/içgüdüsel", "Zorunlu", "Mantıklı"], correct: 1, explanation: "Ani bir karar vererek işini bırakması anlık/içgüdüsel olduğunu gösterir." },
  { id: 70, sentence: "The **futile** attempt to save the sinking ship ended in disaster.", highlightedWord: "futile", options: ["Başarılı", "Boşuna/nafile", "Planlı", "Umut verici"], correct: 1, explanation: "Felaketle sonuçlanan kurtarma girişimi boşuna/nafile niteliktedir." },
  { id: 71, sentence: "The **astute** businessman foresaw the market crash and sold his shares.", highlightedWord: "astute", options: ["Dikkatsiz", "Zeki/kurnaz", "Sabırsız", "Bilgisiz"], correct: 1, explanation: "Piyasa çöküşünü önceden görmesi zeki/kurnaz olduğunu gösterir." },
  { id: 72, sentence: "The **sporadic** rainfall made it difficult for farmers to plan their crops.", highlightedWord: "sporadic", options: ["Sürekli", "Düzensiz/aralıklı", "Yoğun", "Hafif"], correct: 1, explanation: "Çiftçilerin plan yapmasını zorlaştırması, yağmurun düzensiz olduğunu gösterir." },
  { id: 73, sentence: "Her **innate** sense of rhythm made her an exceptional dancer.", highlightedWord: "innate", options: ["Sonradan kazanılmış", "Doğuştan gelen", "Zayıf", "Geçici"], correct: 1, explanation: "Olağanüstü dansçı olmasını sağlayan his, doğuştan gelendir." },
  { id: 74, sentence: "The company was forced to take **drastic** measures to avoid bankruptcy.", highlightedWord: "drastic", options: ["Hafif", "Köklü/sert", "Geçici", "Küçük"], correct: 1, explanation: "İflası önlemek için alınan tedbirler köklü/sert niteliktedir." },
  { id: 75, sentence: "His **aloof** manner made it difficult for others to get close to him.", highlightedWord: "aloof", options: ["Sıcak", "Mesafeli/soğuk", "Neşeli", "Konuşkan"], correct: 1, explanation: "Başkalarının yakınlaşmasını zorlaştıran tavır, mesafeli/soğuk niteliktedir." },
  { id: 76, sentence: "The **obsolete** technology was replaced by more efficient systems.", highlightedWord: "obsolete", options: ["Modern", "Modası geçmiş/eskimiş", "İleri", "Popüler"], correct: 1, explanation: "Daha verimli sistemlerle değiştirilmesi, teknolojinin eskimiş olduğunu gösterir." },
  { id: 77, sentence: "The **ambiguous** instructions confused many of the participants.", highlightedWord: "ambiguous", options: ["Açık", "Belirsiz/çift anlamlı", "Basit", "Kısa"], correct: 1, explanation: "Katılımcıların kafasını karıştırması, talimatların belirsiz olduğunu gösterir." },
  { id: 78, sentence: "She showed **exemplary** courage by rescuing the child from the fire.", highlightedWord: "exemplary", options: ["Sıradan", "Örnek teşkil eden/üstün", "Zayıf", "Yetersiz"], correct: 1, explanation: "Yangından çocuğu kurtarmak örnek teşkil eden cesaret gösterir." },
  { id: 79, sentence: "The judge's **impartial** ruling was praised by both sides.", highlightedWord: "impartial", options: ["Taraflı", "Tarafsız/adil", "Yetersiz", "Sert"], correct: 1, explanation: "Her iki tarafın da övmesi, kararın tarafsız/adil olduğunu gösterir." },
  { id: 80, sentence: "The **rampant** spread of misinformation on social media is a growing concern.", highlightedWord: "rampant", options: ["Kontrollü", "Yaygın/kontrolsüz", "Yavaş", "Azalan"], correct: 1, explanation: "Artan bir endişe olması, yayılmanın yaygın/kontrolsüz olduğunu gösterir." },
  { id: 81, sentence: "His **reluctant** agreement to the plan was obvious from his body language.", highlightedWord: "reluctant", options: ["İstekli", "Gönülsüz/isteksiz", "Heyecanlı", "Kararlı"], correct: 1, explanation: "Beden dilinden belli olması, kabul etmesinin gönülsüz olduğunu gösterir." },
  { id: 82, sentence: "The **detrimental** effects of smoking are well documented.", highlightedWord: "detrimental", options: ["Faydalı", "Zararlı/olumsuz", "Nötr", "Küçük"], correct: 1, explanation: "İyi belgelenmiş olan sigara etkileri zararlı/olumsuz niteliktedir." },
  { id: 83, sentence: "The **exorbitant** prices at the resort discouraged many tourists.", highlightedWord: "exorbitant", options: ["Uygun", "Aşırı/fahiş", "Makul", "Düşük"], correct: 1, explanation: "Turistleri caydıran fiyatlar aşırı/fahiş niteliktedir." },
  { id: 84, sentence: "Her **meticulous** approach to research ensured accurate results.", highlightedWord: "meticulous", options: ["Dikkatsiz", "Titiz/özenli", "Hızlı", "Yüzeysel"], correct: 1, explanation: "Doğru sonuçları garanti eden yaklaşım titiz/özenli niteliktedir." },
  { id: 85, sentence: "The **pragmatic** leader focused on practical solutions rather than ideology.", highlightedWord: "pragmatic", options: ["İdealist", "Pragmatik/uygulamacı", "Hayalperest", "Katı"], correct: 1, explanation: "İdeoloji yerine pratik çözümlere odaklanmak pragmatik olmayı gösterir." },
  { id: 86, sentence: "The old man recounted his **harrowing** experience during the war.", highlightedWord: "harrowing", options: ["Keyifli", "Korkunç/yürek burkucu", "Sıradan", "Komik"], correct: 1, explanation: "Savaş deneyimi korkunç/yürek burkucu olarak nitelendirilir." },
  { id: 87, sentence: "The **pervasive** smell of smoke lingered in the building for days.", highlightedWord: "pervasive", options: ["Hafif", "Her yere yayılan/sinen", "Geçici", "Hoş"], correct: 1, explanation: "Günlerce binada kalan duman kokusu her yere yayılan/sinen niteliktedir." },
  { id: 88, sentence: "His **incessant** talking during the movie annoyed the other viewers.", highlightedWord: "incessant", options: ["Ara sıra olan", "Durmak bilmeyen/sürekli", "Alçak sesli", "Kısa süreli"], correct: 1, explanation: "Diğer seyircileri rahatsız eden konuşma durmak bilmeyen niteliktedir." },
  { id: 89, sentence: "The **prudent** investor diversified her portfolio to minimize risk.", highlightedWord: "prudent", options: ["Riskçi", "Tedbirli/ihtiyatlı", "Dikkatsiz", "Agresif"], correct: 1, explanation: "Riski en aza indirmek için portföyünü çeşitlendirmek tedbirli olmayı gösterir." },
  { id: 90, sentence: "The **unprecedented** floods caused widespread devastation across the country.", highlightedWord: "unprecedented", options: ["Beklenen", "Emsalsiz/benzeri görülmemiş", "Küçük çaplı", "Sık yaşanan"], correct: 1, explanation: "Ülke genelinde yaygın yıkıma yol açması benzeri görülmemiş olduğunu gösterir." },
  { id: 91, sentence: "She maintained a **stoic** expression despite the painful procedure.", highlightedWord: "stoic", options: ["Acılı", "Duygularını belli etmeyen/metanetli", "Ağlayan", "Korkmuş"], correct: 1, explanation: "Ağrılı işleme rağmen ifadesini koruması metanetli olduğunu gösterir." },
  { id: 92, sentence: "The company's **dubious** accounting practices attracted regulatory scrutiny.", highlightedWord: "dubious", options: ["Şeffaf", "Şüpheli/kuşkulu", "Dürüst", "Basit"], correct: 1, explanation: "Denetim kurumu incelemesini çekmesi, uygulamaların şüpheli olduğunu gösterir." },
  { id: 93, sentence: "The **philanthropic** billionaire donated millions to education charities.", highlightedWord: "philanthropic", options: ["Bencil", "Hayırsever/insancıl", "Cimri", "Kayıtsız"], correct: 1, explanation: "Eğitim yardım kuruluşlarına milyonlar bağışlamak hayırsever olmayı gösterir." },
  { id: 94, sentence: "The politician's **rhetoric** appealed to voters but lacked substance.", highlightedWord: "rhetoric", options: ["Eylemleri", "Söylemi/hitabet", "Sessizliği", "Dürüstlüğü"], correct: 1, explanation: "Seçmenlere hitap eden ama özden yoksun olan şey söylem/hitabettir." },
  { id: 95, sentence: "The **ephemeral** beauty of cherry blossoms draws millions of visitors to Japan.", highlightedWord: "ephemeral", options: ["Kalıcı", "Kısa ömürlü/geçici", "Sıradan", "Gizli"], correct: 1, explanation: "Kiraz çiçeklerinin güzelliği kısa ömürlü/geçici niteliktedir." },
  { id: 96, sentence: "The manager's **autocratic** style left no room for employee input.", highlightedWord: "autocratic", options: ["Demokratik", "Otoriter/baskıcı", "Esnek", "İşbirlikçi"], correct: 1, explanation: "Çalışan görüşüne yer bırakmaması otoriter/baskıcı yönetim tarzını gösterir." },
  { id: 97, sentence: "The **copious** notes she took during the lecture helped her pass the exam.", highlightedWord: "copious", options: ["Yetersiz", "Bol/çok miktarda", "Kısa", "Dağınık"], correct: 1, explanation: "Sınavı geçmesine yardımcı olan notlar bol/çok miktarda niteliktedir." },
  { id: 98, sentence: "He felt a sense of **melancholy** as he watched the sun set for the last time from his childhood home.", highlightedWord: "melancholy", options: ["Mutluluk", "Hüzün/kasvet", "Heyecan", "Öfke"], correct: 1, explanation: "Çocukluk evinden son kez gün batımını izlerken hissedilen duygu hüzündür." },
  { id: 99, sentence: "The **enigmatic** painting has puzzled art critics for centuries.", highlightedWord: "enigmatic", options: ["Basit", "Gizemli/esrarengiz", "Çirkin", "Tanıdık"], correct: 1, explanation: "Yüzyıllardır sanat eleştirmenlerini şaşırtması gizemli olduğunu gösterir." },
  { id: 100, sentence: "His **complacent** attitude towards the competition cost him the championship.", highlightedWord: "complacent", options: ["Tedbirli", "Rehavete kapılmış/kayıtsız", "Hırslı", "Endişeli"], correct: 1, explanation: "Şampiyonluğa mal olan tavır rehavete kapılmış olmayı gösterir." },
  { id: 101, sentence: "The **irrevocable** decision could not be changed once the contract was signed.", highlightedWord: "irrevocable", options: ["Geçici", "Geri dönüşü olmayan", "Esnek", "Hafif"], correct: 1, explanation: "Sözleşme imzalandıktan sonra değiştirilememesi geri dönüşü olmayan anlamına gelir." },
  { id: 102, sentence: "The **zealous** fans waited outside the stadium for hours before the concert.", highlightedWord: "zealous", options: ["İlgisiz", "Coşkulu/ateşli", "Sakin", "Tembel"], correct: 1, explanation: "Saatlerce stadyum dışında bekleyen taraftarlar coşkulu/ateşli niteliktedir." },
  { id: 103, sentence: "The scientist published her **seminal** work on gene editing in 2018.", highlightedWord: "seminal", options: ["Sıradan", "Çığır açan/öncü", "Tartışmalı", "Küçük"], correct: 1, explanation: "Gen düzenleme konusundaki çığır açan çalışma öncü niteliktedir." },
  { id: 104, sentence: "The **taciturn** man rarely spoke at social gatherings.", highlightedWord: "taciturn", options: ["Konuşkan", "Az konuşan/sessiz", "Esprili", "Neşeli"], correct: 1, explanation: "Sosyal toplantılarda nadiren konuşması az konuşan/sessiz olduğunu gösterir." },
  { id: 105, sentence: "The **exquisite** craftsmanship of the antique vase made it priceless.", highlightedWord: "exquisite", options: ["Kaba", "Son derece güzel/ince", "Ucuz", "Sıradan"], correct: 1, explanation: "Vazoyu paha biçilmez yapan işçilik son derece güzel/ince niteliktedir." },
  { id: 106, sentence: "The **capricious** weather in spring makes it hard to choose what to wear.", highlightedWord: "capricious", options: ["Tahmin edilebilir", "Değişken/kaprisli", "Sabit", "Ilıman"], correct: 1, explanation: "Ne giyeceğine karar vermeyi zorlaştırması havanın değişken/kaprisli olduğunu gösterir." },
  { id: 107, sentence: "The manager offered **constructive** criticism that helped improve the team's work.", highlightedWord: "constructive", options: ["Yıkıcı", "Yapıcı/geliştirici", "Kırıcı", "Boş"], correct: 1, explanation: "Ekibin çalışmasını geliştiren eleştiri yapıcı/geliştirici niteliktedir." },
  { id: 108, sentence: "His **apathetic** response to the crisis shocked everyone.", highlightedWord: "apathetic", options: ["Tutkulu", "Kayıtsız/ilgisiz", "Heyecanlı", "Endişeli"], correct: 1, explanation: "Krize verilen şaşırtıcı tepki kayıtsız/ilgisiz niteliktedir." },
  { id: 109, sentence: "The **contentious** topic divided the group into two opposing camps.", highlightedWord: "contentious", options: ["Kolay", "Tartışmalı/çekişmeli", "Sıkıcı", "Basit"], correct: 1, explanation: "Grubu ikiye bölen konu tartışmalı/çekişmeli niteliktedir." },
  { id: 110, sentence: "The **affluent** neighbourhood had large houses and manicured gardens.", highlightedWord: "affluent", options: ["Fakir", "Zengin/varlıklı", "Sıradan", "Eski"], correct: 1, explanation: "Büyük evler ve bakımlı bahçeler zengin/varlıklı bir mahalleye işaret eder." },
]

const QS_PER_SET = 6

export function ContextClues() {
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [activeQs, setActiveQs] = useState<ContextQ[]>([])
  const [answers, setAnswers] = useState<boolean[]>([])
  const [currentSet, setCurrentSet] = useState(1)
  const [totalScore, setTotalScore] = useState(0)
  const [totalQs, setTotalQs] = useState(0)

  useEffect(() => { loadNewSet() }, [])

  const loadNewSet = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, QS_PER_SET)
    setActiveQs(shuffled)
    setCurrentQ(0)
    setSelected(null)
    setShowResult(false)
    setScore(0)
    setFinished(false)
    setAnswers([])
  }

  const handleSelect = (idx: number) => {
    if (showResult) return
  setSelected(idx)
  setShowResult(true)
  const isCorrect = idx === activeQs[currentQ].correct
  playSoundEffect(isCorrect ? "correct" : "wrong")
  if (isCorrect) {
      setScore(s => s + 1)
      const progress = addXp(XP_REWARDS.context_clue_correct, "context_clue")
      showXpToast(XP_REWARDS.context_clue_correct, "Bağlam doğru!")
      const newA = checkAndUnlockAchievements(progress)
      for (const a of newA) showAchievementToast(a)
    }
    setAnswers(prev => [...prev, isCorrect])
  }

  const handleNext = () => {
    if (currentQ < activeQs.length - 1) {
      setCurrentQ(q => q + 1)
      setSelected(null)
      setShowResult(false)
    } else {
      setFinished(true)
    playSoundEffect("complete")
    }
  }

  const continueSet = () => {
    setTotalScore(prev => prev + score)
    setTotalQs(prev => prev + activeQs.length)
    setCurrentSet(s => s + 1)
    loadNewSet()
  }

  if (activeQs.length === 0) return null
  const q = activeQs[currentQ]
  const prog = ((currentQ + (finished ? 1 : 0)) / activeQs.length) * 100

  // Render sentence with highlighted word
  const renderSentence = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/)
    return parts.map((part, i) =>
      i % 2 === 1 ? (
        <span key={i} className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 font-bold">{part}</span>
      ) : (
        <span key={i}>{part}</span>
      )
    )
  }

  if (finished) {
    const pct = Math.round((score / activeQs.length) * 100)
    return (
      <Card className="border border-border/50 overflow-hidden rounded-lg">
        <div className="h-1.5 bg-muted"><div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 w-full" /></div>
        <CardContent className="p-6 text-center">
          {currentSet > 1 && <p className="text-sm text-muted-foreground mb-2">Set {currentSet} | Toplam: {totalScore + score}/{totalQs + activeQs.length}</p>}
          <div className={cn("w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center", pct >= 80 ? "bg-emerald-100" : pct >= 50 ? "bg-amber-100" : "bg-red-100")}>
            <span className={cn("text-2xl font-bold", pct >= 80 ? "text-emerald-600" : pct >= 50 ? "text-amber-600" : "text-red-600")}>%{pct}</span>
          </div>
          <h4 className="font-serif text-xl mb-2">{pct >= 80 ? "Harika!" : pct >= 50 ? "İyi!" : "Daha fazla pratik!"}</h4>
          <div className="flex justify-center gap-1 mb-4">
            {answers.map((c, i) => <div key={i} className={cn("w-6 h-2 rounded-full", c ? "bg-emerald-400" : "bg-red-300")} />)}
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={continueSet} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"><ArrowRight className="w-4 h-4 mr-2" />Sonraki Set</Button>
            <Button onClick={() => { setCurrentSet(1); setTotalScore(0); setTotalQs(0); loadNewSet() }} variant="outline" className="w-full bg-transparent"><RotateCcw className="w-4 h-4 mr-2" />Sıfırla</Button>
          </div>
          <div className="mt-4 pt-4 border-t border-border/50">
            <ShareChallenge
              title="Bağlamdan Anlam Sonucum"
              scoreText={`Bağlamdan Anlam Quiz'de %${pct} başarı! ${score}/${activeQs.length} doğru.`}
              challengeText="Bağlam ipuçlarından anlam çıkarabilir misin?"
              toolSlug="context-clues"
              challengeScore={score}
              challengeTotal={activeQs.length}
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="py-4">
      <QuizHeader
        title="Baglamdan Anlam"
        current={currentQ + 1}
        total={activeQs.length}
        lastAnswerCorrect={showResult ? selected === activeQs[currentQ]?.correct : null}
      />

      <Card className="border border-border/50 mb-3 rounded-lg">
        <CardContent className="p-5">
          <p className="text-sm text-muted-foreground mb-2">Vurgulanan kelimenin anlamını tahmin edin:</p>
          <p className="text-base leading-relaxed mb-4">{renderSentence(q.sentence)}</p>

          <div className="space-y-2">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correct
              const isSelected = selected === i
              return (
                <button key={i} onClick={() => handleSelect(i)} disabled={showResult}
                  className={cn(
                    "w-full p-3 rounded-lg text-sm font-medium transition-all border-2 text-left",
                    showResult && isCorrect && "bg-emerald-50 border-emerald-400 text-emerald-700",
                    showResult && isSelected && !isCorrect && "bg-red-50 border-red-400 text-red-700",
                    showResult && !isSelected && !isCorrect && "opacity-50 border-transparent",
                    !showResult && "border-border hover:border-amber-300 hover:bg-amber-50/50 active:scale-[0.98]"
                  )}>
                  <div className="flex items-center gap-2">
                    {showResult && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                    {opt}
                  </div>
                </button>
              )
            })}
          </div>

          {showResult && (
            <div className="mt-3 p-3 rounded-lg bg-amber-50 text-sm text-amber-900 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <span className="font-medium">İpucu: </span>{q.explanation}
            </div>
          )}
        </CardContent>
      </Card>

      {showResult && (
        <Button onClick={handleNext} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
          {currentQ < activeQs.length - 1 ? "Sonraki" : "Sonuclar"} <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      )}
    </div>
  )
}
