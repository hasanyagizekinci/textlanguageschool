"use client"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  CalendarDays, ArrowRight, CheckCircle2, XCircle, Trophy,
  Flame, RotateCcw, MessageCircle, Send, Copy, Check, ArrowLeft
} from "lucide-react"
import { cn } from "@/lib/utils"
import { todaysSeed, seededPick } from "@/lib/challenge"
import { saveDailyResult, getDailyResult, getDailyStreak } from "@/lib/records"
import { addXp, checkAndUnlockAchievements, XP_REWARDS } from "@/lib/xp-system"
import { showXpToast, showAchievementToast, playSoundEffect } from "@/components/xp-toast"
import { ShareChallenge } from "@/components/share-challenge"

interface DailyQuestion {
  question: string
  options: string[]
  correct: number
  type: string
}

// Large mixed pool -- 80 unique questions across grammar, vocab, collocations, and transforms
const DAILY_POOL: DailyQuestion[] = [
  // Grammar (20)
  { type: "Gramer", question: "She _____ English since 2019.", options: ["studies", "studied", "has studied", "is studying"], correct: 2 },
  { type: "Gramer", question: "If it _____ tomorrow, we'll stay home.", options: ["rains", "rained", "will rain", "rain"], correct: 0 },
  { type: "Gramer", question: "He told me he _____ the movie.", options: ["sees", "has seen", "had seen", "will see"], correct: 2 },
  { type: "Gramer", question: "The letter _____ by the secretary yesterday.", options: ["typed", "was typed", "has typed", "is typing"], correct: 1 },
  { type: "Gramer", question: "I wish I _____ speak French fluently.", options: ["can", "could", "will", "would"], correct: 1 },
  { type: "Gramer", question: "By 6 PM, she _____ cooking dinner.", options: ["finishes", "will finish", "will have finished", "finished"], correct: 2 },
  { type: "Gramer", question: "He avoided _____ the difficult question.", options: ["answer", "to answer", "answering", "answered"], correct: 2 },
  { type: "Gramer", question: "_____ I were you, I would apologize.", options: ["If", "Unless", "Although", "When"], correct: 0 },
  { type: "Gramer", question: "The children _____ outside when it started snowing.", options: ["play", "played", "were playing", "have played"], correct: 2 },
  { type: "Gramer", question: "She is used to _____ up early.", options: ["get", "getting", "got", "gets"], correct: 1 },
  { type: "Gramer", question: "Neither Tom _____ Jerry was at the party.", options: ["or", "and", "nor", "but"], correct: 2 },
  { type: "Gramer", question: "The hotel _____ we stayed was excellent.", options: ["who", "which", "where", "whose"], correct: 2 },
  { type: "Gramer", question: "He must _____ sleeping; the lights are off.", options: ["is", "be", "been", "being"], correct: 1 },
  { type: "Gramer", question: "She suggested _____ to the beach instead.", options: ["to go", "going", "go", "gone"], correct: 1 },
  { type: "Gramer", question: "Had we left earlier, we _____ the train.", options: ["catch", "caught", "would catch", "would have caught"], correct: 3 },
  { type: "Gramer", question: "This is the man _____ car was stolen.", options: ["who", "whom", "whose", "which"], correct: 2 },
  { type: "Gramer", question: "She _____ to the gym every Monday.", options: ["go", "goes", "going", "gone"], correct: 1 },
  { type: "Gramer", question: "I don't mind _____ late tonight.", options: ["work", "to work", "working", "worked"], correct: 2 },
  { type: "Gramer", question: "The report _____ by next Friday.", options: ["will complete", "will be completed", "completes", "completing"], correct: 1 },
  { type: "Gramer", question: "He denied _____ the window.", options: ["break", "to break", "breaking", "broke"], correct: 2 },
  // Vocabulary (30) -- answers distributed across A/B/C/D
  { type: "Kelime", question: "'Abundant' ne demek?", options: ["Bol/çok miktarda", "Yetersiz", "Nadir", "Pahalı"], correct: 0 },
  { type: "Kelime", question: "'Cautious' ne demek?", options: ["Cesur", "Dikkatsiz", "Tedbirli/dikkatli", "Aceleci"], correct: 2 },
  { type: "Kelime", question: "'Diverse' ne demek?", options: ["Benzer", "Sıkıcı", "Tek tip", "Çeşitli/farklı"], correct: 3 },
  { type: "Kelime", question: "'Essential' ne demek?", options: ["Zorunlu/temel", "Gereksiz", "Pahalı", "Nadir"], correct: 0 },
  { type: "Kelime", question: "'Genuine' ne demek?", options: ["Sahte", "Pahalı", "Gerçek/hakiki", "Eski"], correct: 2 },
  { type: "Kelime", question: "'Hazardous' ne demek?", options: ["Güvenli", "Faydalı", "Kolay", "Tehlikeli/riskli"], correct: 3 },
  { type: "Kelime", question: "'Inevitable' ne demek?", options: ["Önlenebilir", "Kaçınılmaz", "Belirsiz", "Nadir"], correct: 1 },
  { type: "Kelime", question: "'Justify' ne demek?", options: ["Suçlama", "Reddetmek", "Şikayet etmek", "Haklı göstermek"], correct: 3 },
  { type: "Kelime", question: "'Legitimate' ne demek?", options: ["Meşru/geçerli", "Yasadışı", "Sahte", "Zayıf"], correct: 0 },
  { type: "Kelime", question: "'Negotiate' ne demek?", options: ["Kavga etmek", "Reddetmek", "Müzakere etmek", "Kaçınmak"], correct: 2 },
  { type: "Kelime", question: "'Perceive' ne demek?", options: ["Görmezden gelmek", "Değiştirmek", "Reddetmek", "Algılamak/kavramak"], correct: 3 },
  { type: "Kelime", question: "'Reluctant' ne demek?", options: ["İsteksiz/gönülsüz", "İstekli", "Korkak", "Aceleci"], correct: 0 },
  { type: "Kelime", question: "'Significant' ne demek?", options: ["Önemsiz", "Önemli/anlamlı", "Küçük", "Nadir"], correct: 1 },
  { type: "Kelime", question: "'Temporary' ne demek?", options: ["Kalıcı", "Eski", "Geçici/süreli", "Yeni"], correct: 2 },
  { type: "Kelime", question: "'Vulnerable' ne demek?", options: ["Güçlü", "Cesur", "Zengin", "Savunmasız/korunmasız"], correct: 3 },
  { type: "Kelime", question: "'Adequate' ne demek?", options: ["Yeterli/uygun", "Yetersiz", "Fazla", "Nadir"], correct: 0 },
  { type: "Kelime", question: "'Compulsory' ne demek?", options: ["Opsiyonel", "Kolay", "Zorunlu/mecburi", "Zor"], correct: 2 },
  { type: "Kelime", question: "'Diminish' ne demek?", options: ["Artmak", "Azalmak/küçülmek", "Değişmemek", "Patlamak"], correct: 1 },
  { type: "Kelime", question: "'Feasible' ne demek?", options: ["İmkansız", "Pahalı", "Zor", "Uygulanabilir/mümkün"], correct: 3 },
  { type: "Kelime", question: "'Impose' ne demek?", options: ["Dayatmak/zorlamak", "Kaldırmak", "Önermek", "Kabul etmek"], correct: 0 },
  { type: "Kelime", question: "'Profound' ne demek?", options: ["Yüzeysel", "Basit", "Derin/köklü", "Kısa"], correct: 2 },
  { type: "Kelime", question: "'Retain' ne demek?", options: ["Kaybetmek", "Değiştirmek", "Yok etmek", "Muhafaza etmek/tutmak"], correct: 3 },
  { type: "Kelime", question: "'Sustainable' ne demek?", options: ["Sürdürülebilir", "Geçici", "Pahalı", "Eski"], correct: 0 },
  { type: "Kelime", question: "'Unanimous' ne demek?", options: ["Bölünmüş", "Oybirliğiyle", "Belirsiz", "Kararsız"], correct: 1 },
  { type: "Kelime", question: "'Allocate' ne demek?", options: ["Toplamak", "Harcamak", "Tahsis etmek/ayırmak", "Biriktirmek"], correct: 2 },
  { type: "Kelime", question: "'Comprehensive' ne demek?", options: ["Sınırlı", "Kısa", "Basit", "Kapsamlı/geniş"], correct: 3 },
  { type: "Kelime", question: "'Emerge' ne demek?", options: ["Ortaya çıkmak", "Saklanmak", "Kaybolmak", "Beklemek"], correct: 0 },
  { type: "Kelime", question: "'Fluctuate' ne demek?", options: ["Sabit kalmak", "Dalgalanmak", "Yükselmek", "Düşmek"], correct: 1 },
  { type: "Kelime", question: "'Hinder' ne demek?", options: ["Yardım etmek", "Hızlandırmak", "Engellemek/zorlaştırmak", "Desteklemek"], correct: 2 },
  { type: "Kelime", question: "'Predominant' ne demek?", options: ["Nadir", "Zayıf", "Gizli", "Baskın/egemen"], correct: 3 },
  // Collocations (20)
  { type: "Kollokasyon", question: "She _____ an effort to be on time.", options: ["did", "made", "took", "gave"], correct: 1 },
  { type: "Kollokasyon", question: "He _____ a deep breath before the speech.", options: ["did", "made", "took", "gave"], correct: 2 },
  { type: "Kollokasyon", question: "They _____ an agreement after long discussions.", options: ["made", "reached", "did", "took"], correct: 1 },
  { type: "Kollokasyon", question: "The teacher _____ an announcement.", options: ["did", "made", "gave", "took"], correct: 1 },
  { type: "Kollokasyon", question: "She _____ a good impression on the panel.", options: ["did", "made", "gave", "took"], correct: 1 },
  { type: "Kollokasyon", question: "He always _____ his promises.", options: ["makes", "does", "keeps", "takes"], correct: 2 },
  { type: "Kollokasyon", question: "They _____ a risk by launching early.", options: ["made", "did", "took", "gave"], correct: 2 },
  { type: "Kollokasyon", question: "Please _____ your time; no rush.", options: ["make", "do", "take", "have"], correct: 2 },
  { type: "Kollokasyon", question: "The manager _____ a decision quickly.", options: ["did", "made", "took", "gave"], correct: 1 },
  { type: "Kollokasyon", question: "She _____ a career change at 35.", options: ["did", "made", "took", "had"], correct: 1 },
  { type: "Kollokasyon", question: "He _____ the blame for the failure.", options: ["made", "did", "took", "gave"], correct: 2 },
  { type: "Kollokasyon", question: "The students _____ notes carefully.", options: ["made", "did", "took", "gave"], correct: 2 },
  { type: "Kollokasyon", question: "We need to _____ the deadline.", options: ["reach", "make", "meet", "take"], correct: 2 },
  { type: "Kollokasyon", question: "She _____ a complaint about the noise.", options: ["did", "made", "gave", "took"], correct: 1 },
  { type: "Kollokasyon", question: "He _____ a fortune in real estate.", options: ["did", "made", "took", "earned"], correct: 1 },
  { type: "Kollokasyon", question: "The jury _____ a verdict.", options: ["made", "reached", "took", "gave"], correct: 1 },
  { type: "Kollokasyon", question: "Can you _____ me a favor?", options: ["make", "do", "give", "take"], correct: 1 },
  { type: "Kollokasyon", question: "Please _____ attention to the details.", options: ["make", "do", "pay", "give"], correct: 2 },
  { type: "Kollokasyon", question: "The news _____ widespread panic.", options: ["made", "did", "caused", "brought"], correct: 2 },
  { type: "Kollokasyon", question: "He _____ a habit of reading daily.", options: ["did", "made", "took", "kept"], correct: 1 },
  // Phrasal verbs & transforms (10) -- answers distributed
  { type: "Frazal Fiil", question: "'Look into' ne demek?", options: ["Araştırmak", "Bakmak", "İçine girmek", "Beklemek"], correct: 0 },
  { type: "Frazal Fiil", question: "'Put off' ne demek?", options: ["Giymek", "Ertelemek", "Sökmek", "Kapatmak"], correct: 1 },
  { type: "Frazal Fiil", question: "'Come across' ne demek?", options: ["Geçmek", "Gelmek", "Tesadüfen karşılaşmak", "Koşmak"], correct: 2 },
  { type: "Frazal Fiil", question: "'Bring up' ne demek?", options: ["Yukarı getirmek", "Bitirmek", "Vermek", "Gündeme getirmek/yetiştirmek"], correct: 3 },
  { type: "Frazal Fiil", question: "'Turn down' ne demek?", options: ["Reddetmek", "Aşağı dönmek", "Açmak", "Kapatmak"], correct: 0 },
  { type: "Frazal Fiil", question: "'Get along with' ne demek?", options: ["Uzaklaştırmak", "İyi geçinmek", "Yakalamak", "Devam etmek"], correct: 1 },
  { type: "Frazal Fiil", question: "'Run out of' ne demek?", options: ["Düşmek", "Koşmak", "Tükenmek/bitmek", "Çıkmak"], correct: 2 },
  { type: "Frazal Fiil", question: "'Figure out' ne demek?", options: ["Saymak", "Dışarı çıkmak", "Hesaplamak", "Çözmek/anlamak"], correct: 3 },
  { type: "Frazal Fiil", question: "'Break down' ne demek?", options: ["Bozulmak/çökmek", "Kırmak", "İnmek", "Ayırmak"], correct: 0 },
  { type: "Frazal Fiil", question: "'Carry out' ne demek?", options: ["Taşımak", "Uygulamak/gerçekleştirmek", "Çıkmak", "Bitmek"], correct: 1 },
  // More Grammar
  { type: "Gramer", question: "By this time next year, I _____ graduated.", options: ["will", "will have", "have", "had"], correct: 1 },
  { type: "Gramer", question: "It's high time you _____ a job.", options: ["get", "got", "getting", "to get"], correct: 1 },
  { type: "Gramer", question: "She _____ be at the office. Her car is parked outside.", options: ["can", "must", "might", "should"], correct: 1 },
  { type: "Gramer", question: "The cake _____ by my grandmother every Sunday.", options: ["bakes", "baked", "is baked", "baking"], correct: 2 },
  { type: "Gramer", question: "He acts as if he _____ everything.", options: ["knows", "knew", "has known", "knowing"], correct: 1 },
  { type: "Gramer", question: "_____ sooner had I arrived than it began to rain.", options: ["Not", "No", "Hardly", "Barely"], correct: 1 },
  { type: "Gramer", question: "She prefers reading _____ watching television.", options: ["than", "to", "over", "from"], correct: 1 },
  { type: "Gramer", question: "I can't stand _____ in long queues.", options: ["wait", "to wait", "waiting", "waited"], correct: 2 },
  { type: "Gramer", question: "The house _____ she grew up in has been demolished.", options: ["who", "whom", "which", "whose"], correct: 2 },
  { type: "Gramer", question: "He regretted _____ so rude to his teacher.", options: ["be", "being", "to be", "been"], correct: 1 },
  // More Vocabulary -- answers distributed
  { type: "Kelime", question: "'Ambivalent' ne demek?", options: ["Kararsız/ikircikli", "Kararlı", "Mutlu", "Sinirli"], correct: 0 },
  { type: "Kelime", question: "'Pragmatic' ne demek?", options: ["Hayalperest", "Pratik/uygulamacı", "Tembel", "Duygusal"], correct: 1 },
  { type: "Kelime", question: "'Resilient' ne demek?", options: ["Kırılgan", "Zayıf", "Dayanıklı", "Yavaş"], correct: 2 },
  { type: "Kelime", question: "'Scrutinize' ne demek?", options: ["Görmezden gelmek", "Hızlıca bakmak", "Reddetmek", "Dikkatle incelemek"], correct: 3 },
  { type: "Kelime", question: "'Benevolent' ne demek?", options: ["İyiliksever", "Bencil", "Korkak", "Agresif"], correct: 0 },
  { type: "Kelime", question: "'Relinquish' ne demek?", options: ["Kazanmak", "Bırakmak/vazgeçmek", "Tutmak", "Savunmak"], correct: 1 },
  { type: "Kelime", question: "'Meticulous' ne demek?", options: ["Dikkatsiz", "Tembel", "Titiz/özenli", "Hızlı"], correct: 2 },
  { type: "Kelime", question: "'Jeopardize' ne demek?", options: ["Korumak", "Desteklemek", "Güçlendirmek", "Tehlikeye atmak"], correct: 3 },
  { type: "Kelime", question: "'Subordinate' ne demek?", options: ["Alt düzey/bağımlı", "Üst düzey", "Eşit", "Bağımsız"], correct: 0 },
  { type: "Kelime", question: "'Accumulate' ne demek?", options: ["Dağıtmak", "Biriktirmek", "Azaltmak", "Harcamak"], correct: 1 },
  // More Collocations
  { type: "Kollokasyon", question: "He _____ a confession to the police.", options: ["did", "made", "gave", "told"], correct: 1 },
  { type: "Kollokasyon", question: "She _____ an exception for him.", options: ["did", "made", "took", "gave"], correct: 1 },
  { type: "Kollokasyon", question: "They _____ into consideration all the factors.", options: ["put", "made", "took", "gave"], correct: 2 },
  { type: "Kollokasyon", question: "The storm _____ havoc across the region.", options: ["made", "wreaked", "did", "took"], correct: 1 },
  { type: "Kollokasyon", question: "We need to _____ measures against fraud.", options: ["do", "make", "take", "give"], correct: 2 },
  // More Phrasal Verbs -- answers distributed
  { type: "Frazal Fiil", question: "'Give in' ne demek?", options: ["Dışarı vermek", "Vermek", "Pes etmek/teslim olmak", "Dağıtmak"], correct: 2 },
  { type: "Frazal Fiil", question: "'Set off' ne demek?", options: ["Kurmak", "Kapatmak", "Durdurmak", "Yola çıkmak"], correct: 3 },
  { type: "Frazal Fiil", question: "'Take after' ne demek?", options: ["Benzemek", "Peşinden gitmek", "Almak", "Takip etmek"], correct: 0 },
  { type: "Frazal Fiil", question: "'Make up for' ne demek?", options: ["Makyaj yapmak", "Telafi etmek", "Uydurmak", "Kurmak"], correct: 1 },
  { type: "Frazal Fiil", question: "'Cut down on' ne demek?", options: ["Kesmek", "İndirmek", "Azaltmak", "Bölmek"], correct: 2 },
  // --- NEW GRAMER QUESTIONS ---
  { type: "Gramer", question: "She _____ the project by Friday.", options: ["will finish", "will have finished", "finishes", "finished"], correct: 1 },
  { type: "Gramer", question: "I wish I _____ at the party last night.", options: ["am", "was", "had been", "would be"], correct: 2 },
  { type: "Gramer", question: "He _____ drive a car when he was 16.", options: ["can", "could", "may", "might"], correct: 1 },
  { type: "Gramer", question: "The letter _____ by the secretary tomorrow.", options: ["will type", "will be typed", "types", "typed"], correct: 1 },
  { type: "Gramer", question: "She suggested that we _____ early.", options: ["leave", "left", "leaving", "to leave"], correct: 0 },
  { type: "Gramer", question: "No sooner _____ arrived than it started raining.", options: ["we", "had we", "we had", "did we"], correct: 1 },
  { type: "Gramer", question: "_____ having a cold, she came to work.", options: ["Although", "Despite", "However", "Because"], correct: 1 },
  { type: "Gramer", question: "He is used to _____ up early.", options: ["get", "getting", "got", "gets"], correct: 1 },
  { type: "Gramer", question: "_____ I in your shoes, I would resign.", options: ["Was", "Am", "Were", "Be"], correct: 2 },
  { type: "Gramer", question: "She seems to _____ her keys.", options: ["lost", "have lost", "losing", "lose"], correct: 1 },
  { type: "Gramer", question: "The report _____ by the time you arrive.", options: ["will finish", "will be finished", "will have been finished", "finishes"], correct: 2 },
  { type: "Gramer", question: "It's about time you _____ a job.", options: ["get", "got", "will get", "getting"], correct: 1 },
  { type: "Gramer", question: "They _____ married for 20 years next June.", options: ["are", "will be", "will have been", "have been"], correct: 2 },
  { type: "Gramer", question: "He demanded that she _____ him an explanation.", options: ["gives", "give", "gave", "giving"], correct: 1 },
  { type: "Gramer", question: "Scarcely _____ the house when the storm hit.", options: ["I left", "had I left", "I had left", "did I leave"], correct: 1 },
  { type: "Gramer", question: "She _____ rather stay home than go out.", options: ["will", "had", "would", "has"], correct: 2 },
  { type: "Gramer", question: "He behaves as though he _____ everything.", options: ["knows", "knew", "known", "is knowing"], correct: 1 },
  { type: "Gramer", question: "The students had their essays _____.", options: ["check", "checked", "checking", "to check"], correct: 1 },
  // --- NEW KELIME QUESTIONS --- answers distributed
  { type: "Kelime", question: "'Meticulous' ne demek?", options: ["Titiz/özenli", "Dağınık", "Hızlı", "Yüzeysel"], correct: 0 },
  { type: "Kelime", question: "'Negligible' ne demek?", options: ["Önemli", "Büyük", "Önemsiz/ihmal edilebilir", "Belirgin"], correct: 2 },
  { type: "Kelime", question: "'Volatile' ne demek?", options: ["Sabit", "Güvenli", "Olumlu", "Değişken/istikrarsız"], correct: 3 },
  { type: "Kelime", question: "'Tenacious' ne demek?", options: ["Gevşek", "Azimli/inatçı", "Kısa süreli", "Yüzeysel"], correct: 1 },
  { type: "Kelime", question: "'Redundant' ne demek?", options: ["Gereksiz/fazlalık", "Gerekli", "Önemli", "Eksik"], correct: 0 },
  { type: "Kelime", question: "'Alleviate' ne demek?", options: ["Ağırlaştırmak", "Artırmak", "Hafifletmek/azaltmak", "Yoğunlaştırmak"], correct: 2 },
  { type: "Kelime", question: "'Perpetual' ne demek?", options: ["Geçici", "Kısa", "Ara sıra", "Sürekli/daimi"], correct: 3 },
  { type: "Kelime", question: "'Exacerbate' ne demek?", options: ["Kötüleştirmek/şiddetlendirmek", "İyileştirmek", "Azaltmak", "Sabitlemek"], correct: 0 },
  { type: "Kelime", question: "'Scrutinize' ne demek?", options: ["Görmezden gelmek", "Dikkatle incelemek", "Hızla geçmek", "Kabul etmek"], correct: 1 },
  { type: "Kelime", question: "'Benevolent' ne demek?", options: ["Bencil", "Kayıtsız", "İyiliksever/hayırsever", "Agresif"], correct: 2 },
  { type: "Kelime", question: "'Detrimental' ne demek?", options: ["Faydalı", "Nötr", "Zararlı/olumsuz", "Küçük"], correct: 2 },
  { type: "Kelime", question: "'Lucrative' ne demek?", options: ["Riskli", "Zararlı", "Uzun vadeli", "Kazançlı/kârlı"], correct: 3 },
  { type: "Kelime", question: "'Expedite' ne demek?", options: ["Hızlandırmak/çabuklaştırmak", "Yavaşlatmak", "Durdurmak", "Ertelemek"], correct: 0 },
  { type: "Kelime", question: "'Innate' ne demek?", options: ["Sonradan kazanılmış", "Doğuştan gelen", "Geçici", "Zayıf"], correct: 1 },
  { type: "Kelime", question: "'Futile' ne demek?", options: ["Başarılı", "Umut verici", "Boşuna/nafile", "Planlı"], correct: 2 },
  { type: "Kelime", question: "'Astute' ne demek?", options: ["Dikkatsiz", "Sabırsız", "Bilgisiz", "Zeki/kurnaz"], correct: 3 },
  { type: "Kelime", question: "'Sporadic' ne demek?", options: ["Düzensiz/aralıklı", "Sürekli", "Yoğun", "Hafif"], correct: 0 },
  { type: "Kelime", question: "'Mundane' ne demek?", options: ["Heyecanlı", "Sıradan/monoton", "Karmaşık", "Yaratıcı"], correct: 1 },
  // --- NEW KOLLOKASYON QUESTIONS --- answers distributed
  { type: "Kollokasyon", question: "She _____ a mistake on the form.", options: ["made", "did", "took", "had"], correct: 0 },
  { type: "Kollokasyon", question: "He _____ a living as a writer.", options: ["did", "made", "took", "earned"], correct: 1 },
  { type: "Kollokasyon", question: "They _____ a survey among the employees.", options: ["did", "made", "conducted", "took"], correct: 2 },
  { type: "Kollokasyon", question: "She _____ a positive attitude.", options: ["did", "made", "kept", "maintained"], correct: 3 },
  { type: "Kollokasyon", question: "He _____ a fortune in real estate.", options: ["made", "did", "won", "earned"], correct: 0 },
  { type: "Kollokasyon", question: "They _____ a conclusion from the data.", options: ["made", "drew", "took", "did"], correct: 1 },
  { type: "Kollokasyon", question: "She _____ a contribution to the discussion.", options: ["did", "gave", "made", "took"], correct: 2 },
  { type: "Kollokasyon", question: "He _____ a bid for the contract.", options: ["did", "gave", "took", "made"], correct: 3 },
  { type: "Kollokasyon", question: "She _____ amends for her rudeness.", options: ["made", "did", "took", "got"], correct: 0 },
  { type: "Kollokasyon", question: "They _____ light of the situation.", options: ["did", "made", "took", "got"], correct: 1 },
  { type: "Kollokasyon", question: "He _____ a clean break from the company.", options: ["did", "took", "made", "had"], correct: 2 },
  { type: "Kollokasyon", question: "She _____ a lasting impression.", options: ["did", "gave", "took", "made"], correct: 3 },
  { type: "Kollokasyon", question: "They _____ arrangements for the trip.", options: ["made", "did", "took", "had"], correct: 0 },
  { type: "Kollokasyon", question: "He _____ a risk with his investment.", options: ["did", "made", "took", "had"], correct: 2 },
  { type: "Kollokasyon", question: "She _____ progress in her studies.", options: ["did", "took", "had", "made"], correct: 3 },
  // --- NEW FRAZAL FIIL QUESTIONS --- answers distributed
  { type: "Frazal Fiil", question: "'Bring up' ne demek?", options: ["Getirmek", "Taşımak", "Yetiştirmek/konu açmak", "Yükseltmek"], correct: 2 },
  { type: "Frazal Fiil", question: "'Put off' ne demek?", options: ["Giymek", "Koymak", "Kapatmak", "Ertelemek"], correct: 3 },
  { type: "Frazal Fiil", question: "'Come up with' ne demek?", options: ["Bulmak/üretmek (fikir)", "Gelmek", "Çıkmak", "Yaklaşmak"], correct: 0 },
  { type: "Frazal Fiil", question: "'Look up to' ne demek?", options: ["Yukarı bakmak", "Saygı duymak/hayranlık duymak", "Aramak", "Görmek"], correct: 1 },
  { type: "Frazal Fiil", question: "'Get over' ne demek?", options: ["Geçmek", "Almak", "Atlatmak/üstesinden gelmek", "Bitirmek"], correct: 2 },
  { type: "Frazal Fiil", question: "'Drop off' ne demek?", options: ["Düşürmek", "Kaybetmek", "Azalmak", "Bırakmak (bir yere)/uykuya dalmak"], correct: 3 },
  { type: "Frazal Fiil", question: "'Keep up with' ne demek?", options: ["Ayak uydurmak/takip etmek", "Tutmak", "Saklamak", "Korumak"], correct: 0 },
  { type: "Frazal Fiil", question: "'Work out' ne demek?", options: ["Çalışmak", "Egzersiz yapmak/çözmek", "İş bulmak", "Yorulmak"], correct: 1 },
  { type: "Frazal Fiil", question: "'Hang out' ne demek?", options: ["Asmak", "Tutmak", "Vakit geçirmek/takılmak", "Düşmek"], correct: 2 },
  { type: "Frazal Fiil", question: "'Look down on' ne demek?", options: ["Aşağı bakmak", "İncelemek", "Aramak", "Küçümsemek/hor görmek"], correct: 3 },
  { type: "Frazal Fiil", question: "'Go through' ne demek?", options: ["Yaşamak/deneyimlemek (zor)", "Gitmek", "Geçmek", "Bakmak"], correct: 0 },
  { type: "Frazal Fiil", question: "'Wear off' ne demek?", options: ["Giymek", "Etkisi geçmek/azalmak", "Yıpranmak", "Çıkarmak"], correct: 1 },
  { type: "Frazal Fiil", question: "'Fall behind' ne demek?", options: ["Düşmek", "Yıkılmak", "Geride kalmak/geri kalmak", "İnmek"], correct: 2 },
  { type: "Frazal Fiil", question: "'Stick to' ne demek?", options: ["Yapıştırmak", "Tutmak", "Koymak", "Sadık kalmak/bağlı kalmak"], correct: 3 },
  { type: "Frazal Fiil", question: "'Point out' ne demek?", options: ["Dikkat çekmek/belirtmek", "Göstermek", "İşaret etmek", "Saymak"], correct: 0 },
  // --- EXTRA GRAMER ---
  { type: "Gramer", question: "She _____ to the gym every morning before work.", options: ["goes", "is going", "go", "going"], correct: 0 },
  { type: "Gramer", question: "If he _____ harder, he would have succeeded.", options: ["works", "worked", "had worked", "would work"], correct: 2 },
  { type: "Gramer", question: "The building _____ in 1890.", options: ["was built", "has been built", "built", "is built"], correct: 0 },
  { type: "Gramer", question: "She told me that she _____ the following day.", options: ["comes", "will come", "would come", "is coming"], correct: 2 },
  { type: "Gramer", question: "Only after she left _____ realize my mistake.", options: ["I did", "did I", "I was", "was I"], correct: 1 },
  { type: "Gramer", question: "He can't _____ stolen the money; he wasn't there.", options: ["had", "have", "has", "having"], correct: 1 },
  { type: "Gramer", question: "_____ she known earlier, she would have acted differently.", options: ["If", "Had", "Should", "Did"], correct: 1 },
  { type: "Gramer", question: "I'd sooner _____ at home than go to the party.", options: ["stay", "stayed", "staying", "to stay"], correct: 0 },
  // --- EXTRA KELIME --- answers distributed
  { type: "Kelime", question: "'Pivotal' ne demek?", options: ["Kritik/çok önemli", "Küçük", "Zayıf", "İlgisiz"], correct: 0 },
  { type: "Kelime", question: "'Cumbersome' ne demek?", options: ["Hafif", "Küçük", "Hantal/kullanışsız", "Zarif"], correct: 2 },
  { type: "Kelime", question: "'Jeopardize' ne demek?", options: ["Korumak", "Güçlendirmek", "Geliştirmek", "Tehlikeye atmak"], correct: 3 },
  { type: "Kelime", question: "'Stringent' ne demek?", options: ["Gevşek", "Katı/sıkı", "Geçici", "Hafif"], correct: 1 },
  { type: "Kelime", question: "'Prolific' ne demek?", options: ["Üretken/velut", "Yavaş", "Tanınmayan", "Kısa"], correct: 0 },
  { type: "Kelime", question: "'Vindicate' ne demek?", options: ["Suçlamak", "Cezalandırmak", "Haklı çıkarmak/aklamak", "Yargılamak"], correct: 2 },
  { type: "Kelime", question: "'Pragmatic' ne demek?", options: ["Hayalperest", "Katı", "İdealist", "Pragmatik/uygulamacı"], correct: 3 },
  { type: "Kelime", question: "'Deter' ne demek?", options: ["Teşvik etmek", "Caydırmak/engellemek", "Desteklemek", "Çekmek"], correct: 1 },
  // --- EXTRA KOLLOKASYON ---
  { type: "Kollokasyon", question: "He _____ a role in the school play.", options: ["did", "made", "played", "took"], correct: 2 },
  { type: "Kollokasyon", question: "She _____ a deep breath before speaking.", options: ["did", "made", "took", "had"], correct: 2 },
  { type: "Kollokasyon", question: "The company _____ a loss last quarter.", options: ["did", "made", "suffered", "Both B and C"], correct: 3 },
  { type: "Kollokasyon", question: "He _____ an excuse for being late.", options: ["did", "made", "told", "gave"], correct: 1 },
  { type: "Kollokasyon", question: "They _____ a ceremony for the graduates.", options: ["did", "made", "held", "took"], correct: 2 },
  { type: "Kollokasyon", question: "She _____ a glance at the timetable.", options: ["did", "made", "took", "cast"], correct: 2 },
  { type: "Kollokasyon", question: "He _____ his duty as a citizen.", options: ["did", "made", "took", "fulfilled"], correct: 3 },
  { type: "Kollokasyon", question: "The government _____ a statement to the press.", options: ["did", "made", "issued", "Both B and C"], correct: 3 },
  // --- EXTRA FRAZAL FIIL --- answers distributed
  { type: "Frazal Fiil", question: "'Lay off' ne demek?", options: ["Yatırmak", "Koymak", "İşten çıkarmak", "Bırakmak"], correct: 2 },
  { type: "Frazal Fiil", question: "'Settle down' ne demek?", options: ["Oturmak", "İnmek", "Ayarlamak", "Yerleşmek/sakinleşmek"], correct: 3 },
  { type: "Frazal Fiil", question: "'Back up' ne demek?", options: ["Desteklemek/yedeklemek", "Geri gitmek", "Bakmak", "Çekmek"], correct: 0 },
  { type: "Frazal Fiil", question: "'Blow up' ne demek?", options: ["Esmek", "Patlamak/büyütmek (fotoğraf)", "Üflemek", "Kırmak"], correct: 1 },
  { type: "Frazal Fiil", question: "'Sort out' ne demek?", options: ["Ayırmak", "Düzenlemek", "Halletmek/çözmek", "Sıralamak"], correct: 2 },
  { type: "Frazal Fiil", question: "'Account for' ne demek?", options: ["Hesap açmak", "Saymak", "Kapatmak", "Açıklamak/oluşturmak (oran)"], correct: 3 },
  { type: "Frazal Fiil", question: "'Phase out' ne demek?", options: ["Kademeli olarak kaldırmak", "Başlatmak", "Planlamak", "Faz değiştirmek"], correct: 0 },
  { type: "Frazal Fiil", question: "'Rule out' ne demek?", options: ["Yönetmek", "Dışlamak/elemek", "Kurallamak", "Düzenlemek"], correct: 1 },
  // --- MORE KELIME ---
  { type: "Kelime", question: "'Exacerbate' ne demek?", options: ["Kötüleştirmek/şiddetlendirmek", "İyileştirmek", "Düzeltmek", "Yavaşlatmak"], correct: 0 },
  { type: "Kelime", question: "'Feasible' ne demek?", options: ["İmkansız", "Uygulanabilir/yapılabilir", "Pahalı", "Zor"], correct: 1 },
  { type: "Kelime", question: "'Diminish' ne demek?", options: ["Artmak", "Büyümek", "Azalmak/küçülmek", "Pekiştirmek"], correct: 2 },
  { type: "Kelime", question: "'Elicit' ne demek?", options: ["Seçmek", "Silmek", "Yasaklamak", "Ortaya çıkarmak/uyandırmak"], correct: 3 },
  { type: "Kelime", question: "'Inherent' ne demek?", options: ["Doğasında var olan", "Dışarıdan gelen", "Geçici", "Yapay"], correct: 0 },
  { type: "Kelime", question: "'Versatile' ne demek?", options: ["Sabit", "Çok yönlü/becerikli", "Tek amaçlı", "Sınırlı"], correct: 1 },
  { type: "Kelime", question: "'Complacent' ne demek?", options: ["Endişeli", "Hırslı", "Kayıtsız/rehavete kapılmış", "Dikkatli"], correct: 2 },
  { type: "Kelime", question: "'Unprecedented' ne demek?", options: ["Beklenen", "Sıradan", "Tekrarlanan", "Emsalsiz/benzeri görülmemiş"], correct: 3 },
  // --- MORE GRAMER ---
  { type: "Gramer", question: "Not until he arrived _____ the truth.", options: ["did we learn", "we learned", "we did learn", "learned we"], correct: 0 },
  { type: "Gramer", question: "I wish I _____ more time to study.", options: ["have", "had", "will have", "am having"], correct: 1 },
  { type: "Gramer", question: "He denied _____ the window.", options: ["to break", "break", "breaking", "broke"], correct: 2 },
  { type: "Gramer", question: "Were it not for her help, I _____.", options: ["succeed", "succeeded", "will fail", "would have failed"], correct: 3 },
  { type: "Gramer", question: "The harder you work, the _____ results you get.", options: ["better", "best", "good", "more good"], correct: 0 },
  { type: "Gramer", question: "She insisted that he _____ on time.", options: ["comes", "be", "was", "is"], correct: 1 },
  { type: "Gramer", question: "It's high time we _____ a decision.", options: ["make", "will make", "made", "making"], correct: 2 },
  { type: "Gramer", question: "He acted as if he _____ everything.", options: ["knows", "is knowing", "will know", "knew"], correct: 3 },
  // --- MORE KOLLOKASYON ---
  { type: "Kollokasyon", question: "She _____ a fortune in the stock market.", options: ["made", "did", "got", "won"], correct: 0 },
  { type: "Kollokasyon", question: "He _____ a grudge against his former boss.", options: ["made", "held", "kept", "did"], correct: 1 },
  { type: "Kollokasyon", question: "They _____ the blame on the new manager.", options: ["made", "did", "placed", "got"], correct: 2 },
  { type: "Kollokasyon", question: "The news _____ her by surprise.", options: ["made", "did", "held", "took"], correct: 3 },
]

const QUESTIONS_PER_DAY = 10

export function DailyChallenge({ onBack }: { onBack?: () => void }) {
  const todaySeed = useMemo(() => todaysSeed(), [])
  const todayStr = useMemo(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  }, [])

  const existingResult = useMemo(() => getDailyResult(todayStr), [todayStr])

  const questions = useMemo(
    () => seededPick(DAILY_POOL, todaySeed, QUESTIONS_PER_DAY),
    [todaySeed]
  )

  const [phase, setPhase] = useState<"intro" | "playing" | "result">(
    existingResult ? "result" : "intro"
  )
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(existingResult?.score ?? 0)
  const [copied, setCopied] = useState(false)

  const streak = useMemo(() => getDailyStreak(), [phase])

  const handleAnswer = useCallback(
    (idx: number) => {
      if (showAnswer) return
      setSelected(idx)
      setShowAnswer(true)
      if (idx === questions[currentQ].correct) {
        setScore((p) => p + 1)
        playSoundEffect("correct")
      } else {
        playSoundEffect("wrong")
      }
    },
    [showAnswer, questions, currentQ]
  )

  const handleNext = useCallback(() => {
    if (currentQ + 1 >= questions.length) {
      // score state may be stale (setScore from handleAnswer hasn't flushed)
      // so compute final score by checking if current answer was correct
      const lastWasCorrect = selected === questions[currentQ].correct
      const finalScore = score + (lastWasCorrect && !showAnswer ? 1 : 0)
      // Use functional setState to get the latest score value
      setScore(prev => {
        const actualScore = prev
        try {
          saveDailyResult({ date: todayStr, score: actualScore, total: QUESTIONS_PER_DAY })
          addXp(XP_REWARDS.quizComplete, "daily_challenge")
          showXpToast(XP_REWARDS.quizComplete)
          const achievements = checkAndUnlockAchievements()
          achievements.forEach((a) => showAchievementToast(a))
        } catch (e) {
          // prevent crash from blocking phase transition
        }
        return actualScore
      })
      setPhase("result")
    } else {
      setCurrentQ((p) => p + 1)
      setSelected(null)
      setShowAnswer(false)
    }
  }, [currentQ, questions, todayStr, score, selected, showAnswer])

  const percentage = Math.round((score / QUESTIONS_PER_DAY) * 100)

  const handleCopy = async () => {
    const text = `Günün Challenge'ı - ${todayStr}\nSonuç: ${score}/${QUESTIONS_PER_DAY} (%${percentage})\n${streak > 1 ? `Seri: ${streak} gün!\n` : ""}Sen de dene: ${typeof window !== "undefined" ? window.location.origin : "https://www.textlanguageschool.net"}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* noop */ }
  }

  // ---- INTRO ----
  if (phase === "intro") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-xl font-serif font-bold text-foreground">Günün Challenge'ı</h2>
            <p className="text-sm text-muted-foreground">{todayStr}</p>
          </div>
        </div>

        <Card className="border-primary/10 shadow-md">
          <CardContent className="p-6 space-y-5 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <CalendarDays className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-serif font-bold text-foreground">
                Her Gün Aynı 10 Soru
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                Bugünün challenge'ında gramer, kelime, kollokasyon ve frazal fiillerden karışık 10 soru seni bekliyor. Herkes aynı soruları çözüyor -- arkadaşlarınla karşılaştır!
              </p>
            </div>
            {streak > 0 && (
              <div className="flex items-center justify-center gap-2 text-sm">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="font-bold text-foreground">{streak} günlük seri!</span>
              </div>
            )}
            <Button onClick={() => setPhase("playing")} size="lg" className="w-full gap-2 text-base">
              <Flame className="w-5 h-5" />
              Başla!
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ---- PLAYING ----
  if (phase === "playing") {
    const q = questions[currentQ]
    if (!q) return null

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-foreground">Günün Challenge'ı</h2>
            <p className="text-xs text-muted-foreground">{todayStr}</p>
          </div>
          <span className="text-xs font-bold text-primary px-2 py-1 bg-primary/10 rounded-full">
            {currentQ + 1}/{QUESTIONS_PER_DAY}
          </span>
        </div>

        <Card>
          <CardContent className="p-5 space-y-4">
            {/* Progress */}
            <div className="w-full bg-muted rounded-full h-1.5">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${((currentQ + 1) / QUESTIONS_PER_DAY) * 100}%` }}
              />
            </div>

            <span className="inline-block px-2 py-0.5 rounded-full bg-muted text-[10px] font-bold uppercase text-muted-foreground">
              {q.type}
            </span>

            <h3 className="text-base font-semibold text-foreground leading-relaxed">{q.question}</h3>

            <div className="grid gap-2">
              {q.options.map((opt, idx) => {
                const isCorrect = idx === q.correct
                const isSelected = idx === selected
                let extraClass = "bg-transparent hover:bg-muted/50 text-foreground"
                if (showAnswer) {
                  if (isCorrect) extraClass = "bg-green-50 border-green-400 text-green-800"
                  else if (isSelected && !isCorrect) extraClass = "bg-red-50 border-red-400 text-red-800"
                  else extraClass = "opacity-50 text-muted-foreground"
                }
                return (
                  <Button
                    key={idx}
                    variant="outline"
                    onClick={() => handleAnswer(idx)}
                    disabled={showAnswer}
                    className={cn("justify-start text-left h-auto py-2.5 px-3.5 text-sm font-medium transition-all", extraClass)}
                  >
                    <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold mr-2.5 shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                    {showAnswer && isCorrect && <CheckCircle2 className="w-4 h-4 ml-auto text-green-600 shrink-0" />}
                    {showAnswer && isSelected && !isCorrect && <XCircle className="w-4 h-4 ml-auto text-red-600 shrink-0" />}
                  </Button>
                )
              })}
            </div>

            {showAnswer && (
              <Button onClick={handleNext} className="w-full gap-2">
                {currentQ + 1 >= QUESTIONS_PER_DAY ? "Sonuçları Gör" : "Sonraki"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // ---- RESULT ----
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-lg font-serif font-bold text-foreground">Günün Sonuçları</h2>
      </div>

      <Card className="border-primary/10 shadow-lg">
        <CardContent className="p-6 space-y-5 text-center">
          <div className="animate-score-pop">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Trophy className="w-8 h-8 text-primary" />
            </div>
            <p className="text-4xl font-serif font-bold text-primary">%{percentage}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {score}/{QUESTIONS_PER_DAY} doğru
            </p>
          </div>

          {streak > 0 && (
            <div className="flex items-center justify-center gap-2 py-2 px-4 bg-orange-50 border border-orange-200 rounded-xl mx-auto w-fit">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-bold text-orange-700">{streak} Günlük Seri!</span>
            </div>
          )}

          <div className="grid grid-cols-5 gap-1.5">
            {questions.map((q, i) => {
              // We don't store per-question results in daily mode once completed,
              // so just show the overall score indicator
              const isGood = i < score
              return (
                <div
                  key={i}
                  className={cn(
                    "w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold",
                    isGood ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  )}
                >
                  {i + 1}
                </div>
              )
            })}
          </div>

          {/* Share */}
          <div className="pt-2">
            <ShareChallenge
              title={`Günün Challenge'ı - ${todayStr}`}
              scoreText={`Günün Challenge'ı - ${todayStr}\nSonuç: %${percentage} (${score}/${QUESTIONS_PER_DAY})${streak > 1 ? `\nSeri: ${streak} gün!` : ""}`}
              challengeText="Sen de dene!"
              toolSlug="daily"
              challengeScore={score}
              challengeTotal={QUESTIONS_PER_DAY}
            />
          </div>

          {existingResult && (
            <p className="text-xs text-muted-foreground italic">
              Bugünün challenge'ını zaten tamamladın. Yarın yeni sorular seni bekliyor!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
