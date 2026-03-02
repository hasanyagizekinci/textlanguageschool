"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Timer, Zap, Trophy, RotateCcw, ArrowRight, CheckCircle2, XCircle, Share2, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { addXp, checkAndUnlockAchievements, XP_REWARDS } from "@/lib/xp-system"
import { showXpToast, showAchievementToast, playSoundEffect } from "@/components/xp-toast"
import { ShareChallenge } from "@/components/share-challenge"

interface BlitzQuestion {
  type: "collocation" | "vocab" | "grammar" | "transform"
  question: string
  options: string[]
  correct: number
}

// Large pool of mixed questions for the blitz
const blitzPool: BlitzQuestion[] = [
  // Collocations
  { type: "collocation", question: "_____ a decision", options: ["make", "do", "take", "get"], correct: 0 },
  { type: "collocation", question: "_____ homework", options: ["make", "do", "take", "get"], correct: 1 },
  { type: "collocation", question: "_____ a mistake", options: ["do", "make", "have", "take"], correct: 1 },
  { type: "collocation", question: "_____ an effort", options: ["do", "take", "make", "give"], correct: 2 },
  { type: "collocation", question: "_____ advantage of", options: ["make", "do", "take", "get"], correct: 2 },
  { type: "collocation", question: "_____ attention to", options: ["give", "pay", "make", "do"], correct: 1 },
  { type: "collocation", question: "_____ progress", options: ["do", "make", "take", "have"], correct: 1 },
  { type: "collocation", question: "_____ a risk", options: ["make", "do", "take", "have"], correct: 2 },
  { type: "collocation", question: "_____ your best", options: ["make", "do", "take", "give"], correct: 1 },
  { type: "collocation", question: "_____ a complaint", options: ["do", "make", "take", "give"], correct: 1 },
  { type: "collocation", question: "_____ research", options: ["make", "carry out", "take", "give"], correct: 1 },
  { type: "collocation", question: "_____ into account", options: ["put", "bring", "take", "get"], correct: 2 },
  // Vocabulary
  { type: "vocab", question: "'Inevitable' ne demek?", options: ["Kaçınılmaz", "Mümkün", "Beklenmedik", "Önemli"], correct: 0 },
  { type: "vocab", question: "'Accomplish' ne demek?", options: ["Başlamak", "Başarmak", "Bitirmek", "Denemek"], correct: 1 },
  { type: "vocab", question: "'Adequate' ne demek?", options: ["Mükemmel", "Yetersiz", "Yeterli", "Fazla"], correct: 2 },
  { type: "vocab", question: "'Reluctant' ne demek?", options: ["İstekli", "İsteksiz", "Kararlı", "Şaşkın"], correct: 1 },
  { type: "vocab", question: "'Significant' ne demek?", options: ["Küçük", "Önemli", "Belirsiz", "Açık"], correct: 1 },
  { type: "vocab", question: "'Reveal' ne demek?", options: ["Gizlemek", "Göstermek", "Ortaya çıkmak", "Aramak"], correct: 2 },
  { type: "vocab", question: "'Comprehensive' ne demek?", options: ["Kapsamlı", "Kısıtlı", "Basit", "Anlaşılır"], correct: 0 },
  { type: "vocab", question: "'Ambiguous' ne demek?", options: ["Açık", "Belirsiz", "Kesin", "Doğrudan"], correct: 1 },
  { type: "vocab", question: "'Deteriorate' ne demek?", options: ["Gelişmek", "Kötüye gitmek", "Değişmek", "Durmak"], correct: 1 },
  { type: "vocab", question: "'Enhance' ne demek?", options: ["Azaltmak", "Bozmak", "Geliştirmek", "Değiştirmek"], correct: 2 },
  { type: "vocab", question: "'Perceive' ne demek?", options: ["Algılamak", "Görmezden gelmek", "Reddetmek", "Kabul etmek"], correct: 0 },
  { type: "vocab", question: "'Surplus' ne demek?", options: ["Eksik", "Yeterli", "Fazla/Artık", "Dengeli"], correct: 2 },
  // Grammar
  { type: "grammar", question: "If I _____ rich, I would travel.", options: ["am", "was", "were", "be"], correct: 2 },
  { type: "grammar", question: "She _____ here since 2020.", options: ["is", "was", "has been", "had been"], correct: 2 },
  { type: "grammar", question: "He suggested _____ early.", options: ["leave", "leaving", "to leave", "left"], correct: 1 },
  { type: "grammar", question: "The book _____ by millions.", options: ["reads", "is read", "reading", "has reading"], correct: 1 },
  { type: "grammar", question: "I wish I _____ harder.", options: ["study", "studied", "studying", "studies"], correct: 1 },
  { type: "grammar", question: "Not only _____ late, but rude.", options: ["he was", "was he", "he is", "is he"], correct: 1 },
  { type: "grammar", question: "By tomorrow, I _____ it.", options: ["finish", "finished", "will finish", "will have finished"], correct: 3 },
  { type: "grammar", question: "_____ the rain, we went out.", options: ["Although", "Despite", "However", "Because"], correct: 1 },
  { type: "grammar", question: "She denied _____ the vase.", options: ["break", "to break", "breaking", "broken"], correct: 2 },
  { type: "grammar", question: "He _____ be at home now.", options: ["must", "can", "shall", "would"], correct: 0 },
  { type: "grammar", question: "_____ had she left than it rained.", options: ["Not", "No sooner", "Barely", "Just"], correct: 1 },
  { type: "grammar", question: "I remember _____ the door.", options: ["lock", "to lock", "locking", "locked"], correct: 2 },
  // Transform / Mixed
  { type: "transform", question: "'To give up' ne demek?", options: ["Başlamak", "Vazgeçmek", "Devam etmek", "Bitirmek"], correct: 1 },
  { type: "transform", question: "'To look forward to' ne demek?", options: ["Geri bakmak", "Dört gözle beklemek", "Aramak", "Görmezden gelmek"], correct: 1 },
  { type: "transform", question: "'To come up with' ne demek?", options: ["Çıkmak", "Üretmek/Bulmak", "Gelmek", "Karşılaşmak"], correct: 1 },
  { type: "transform", question: "'To put off' ne demek?", options: ["Giymek", "Çıkarmak", "Ertelemek", "Açmak"], correct: 2 },
  { type: "transform", question: "'To carry out' ne demek?", options: ["Taşımak", "Gerçekleştirmek", "Çıkmak", "Çıkarmak"], correct: 1 },
  { type: "transform", question: "'To figure out' ne demek?", options: ["Hesaplamak", "Çözmek/Anlamak", "Saymak", "Çıkmak"], correct: 1 },
  { type: "transform", question: "'To run out of' ne demek?", options: ["Koşmak", "Tükenmek", "Kaçmak", "Devam etmek"], correct: 1 },
  { type: "transform", question: "'To break down' ne demek?", options: ["Kırmak", "Bozulmak/Çökmek", "Parçalamak", "Ayırmak"], correct: 1 },
  // Extra grammar
  { type: "grammar", question: "I wish I _____ harder last year.", options: ["study", "studied", "had studied", "would study"], correct: 2 },
  { type: "grammar", question: "By next June, she _____ here for 5 years.", options: ["works", "will work", "will have worked", "is working"], correct: 2 },
  { type: "grammar", question: "He avoided _____ the question.", options: ["answer", "answering", "to answer", "answered"], correct: 1 },
  { type: "grammar", question: "The letter _____ by the secretary yesterday.", options: ["has typed", "was typed", "is typing", "typing"], correct: 1 },
  { type: "grammar", question: "Had she studied more, she _____ the exam.", options: ["passes", "passed", "would pass", "would have passed"], correct: 3 },
  // Extra vocab
  { type: "vocab", question: "'Determine' ne demek?", options: ["Belirlemek/Saptamak", "Dayanmak", "Degistirmek", "Denemek"], correct: 0 },
  { type: "vocab", question: "'Fluctuate' ne demek?", options: ["Sabit kalmak", "Dalgalanmak", "Artmak", "Azalmak"], correct: 1 },
  { type: "vocab", question: "'Simultaneously' ne demek?", options: ["Sirayla", "Ayni anda", "Sonradan", "Onceden"], correct: 1 },
  { type: "vocab", question: "'Consequence' ne demek?", options: ["Neden", "Onem", "Sonuc", "Kural"], correct: 2 },
  { type: "vocab", question: "'Notorious' ne demek?", options: ["Meshur", "Kotu suyla anilan", "Bilinmeyen", "Saygin"], correct: 1 },
  // Extra collocations
  { type: "collocation", question: "The teacher _____ an announcement.", options: ["did", "made", "took", "gave"], correct: 1 },
  { type: "collocation", question: "Please _____ a seat.", options: ["make", "do", "take", "get"], correct: 2 },
  { type: "collocation", question: "He _____ a promise to his mother.", options: ["did", "took", "made", "gave"], correct: 2 },
  { type: "collocation", question: "Can you _____ me a favor?", options: ["make", "do", "give", "take"], correct: 1 },
  // More unique questions
  { type: "grammar", question: "She _____ English for three years before moving.", options: ["studied", "had studied", "has studied", "studies"], correct: 1 },
  { type: "vocab", question: "'Meticulous' ne demek?", options: ["Dikkatsiz", "Titiz/ozenli", "Tembel", "Yavas"], correct: 1 },
  { type: "vocab", question: "'Obsolete' ne demek?", options: ["Modern", "Kullanim disi/eski", "Yeni", "Pahali"], correct: 1 },
  { type: "collocation", question: "The company _____ a profit last quarter.", options: ["did", "made", "got", "took"], correct: 1 },
  { type: "grammar", question: "The children _____ to bed when the lights went out.", options: ["go", "went", "had gone", "have gone"], correct: 2 },
  { type: "transform", question: "'To look into' ne demek?", options: ["Bakmak", "Arastirmak", "Icine girmek", "Beklemek"], correct: 1 },
  { type: "transform", question: "'To get along with' ne demek?", options: ["Uzaklastirmak", "Iyi gecinmek", "Yakalamak", "Devam etmek"], correct: 1 },
  { type: "vocab", question: "'Thrive' ne demek?", options: ["Kuculmek", "Gerilemek", "Gelismek/buyumek", "Durmak"], correct: 2 },
  { type: "transform", question: "'To turn down' ne demek?", options: ["Açmak", "Reddetmek", "Döndürmek", "Kapamak"], correct: 1 },
  { type: "transform", question: "'To bring about' ne demek?", options: ["Getirmek", "Neden olmak", "Çıkmak", "Başlamak"], correct: 1 },
  // Fenerbahce themed English questions
  { type: "vocab", question: "'Opponent' ne demek?", options: ["Takım arkadaşı", "Rakip", "Hakem", "Teknik direktör"], correct: 1 },
  { type: "vocab", question: "'Championship' ne demek?", options: ["Maçlar", "Şampiyonluk", "Turnuva", "Kupa"], correct: 1 },
  { type: "grammar", question: "The team _____ the match yesterday.", options: ["wins", "won", "has won", "winning"], correct: 1 },
  { type: "grammar", question: "They have been _____ hard all season.", options: ["train", "trained", "training", "trains"], correct: 2 },
  { type: "vocab", question: "'Substitute' ne demek?", options: ["Başlangıç oyuncusu", "Yedek oyuncu", "Kaleci", "Kaptan"], correct: 1 },
  { type: "collocation", question: "The striker _____ a goal in the last minute.", options: ["did", "made", "scored", "took"], correct: 2 },
  { type: "vocab", question: "'Draw' (futbolda) ne demek?", options: ["Yenilgi", "Galibiyet", "Beraberlik", "Uzatma"], correct: 2 },
  { type: "grammar", question: "If they _____ harder, they would have won.", options: ["play", "played", "had played", "playing"], correct: 2 },
  { type: "vocab", question: "'Referee' ne demek?", options: ["Antrenor", "Hakem", "Kaleci", "Kaptan"], correct: 1 },
  { type: "collocation", question: "The coach _____ a decision to change formation.", options: ["did", "made", "took", "gave"], correct: 1 },
  // More unique grammar
  { type: "grammar", question: "She _____ to the office every day.", options: ["drive", "drives", "driving", "driven"], correct: 1 },
  { type: "grammar", question: "I _____ my keys anywhere.", options: ["can't find", "can't finding", "can't found", "can't finds"], correct: 0 },
  { type: "grammar", question: "They _____ already when I arrived.", options: ["left", "have left", "had left", "are leaving"], correct: 2 },
  { type: "grammar", question: "She is the woman _____ son won the prize.", options: ["who", "whom", "whose", "which"], correct: 2 },
  { type: "grammar", question: "The report _____ by next Monday.", options: ["will finish", "will be finished", "finishes", "is finishing"], correct: 1 },
  { type: "grammar", question: "I'd rather _____ at home tonight.", options: ["stay", "staying", "to stay", "stayed"], correct: 0 },
  { type: "grammar", question: "It's time we _____ a decision.", options: ["make", "made", "making", "to make"], correct: 1 },
  // More unique vocab
  { type: "vocab", question: "'Conceal' ne demek?", options: ["Gostermek", "Gizlemek", "Aramak", "Bulmak"], correct: 1 },
  { type: "vocab", question: "'Abundant' ne demek?", options: ["Yetersiz", "Bol/cok miktarda", "Nadir", "Pahali"], correct: 1 },
  { type: "vocab", question: "'Legitimate' ne demek?", options: ["Yasadisi", "Mesru/gecerli", "Sahte", "Zayif"], correct: 1 },
  { type: "vocab", question: "'Diminish' ne demek?", options: ["Artmak", "Azalmak/kuculmek", "Degismemek", "Patlamak"], correct: 1 },
  { type: "vocab", question: "'Feasible' ne demek?", options: ["Imkansiz", "Uygulanabilir/mumkun", "Pahali", "Zor"], correct: 1 },
  { type: "vocab", question: "'Impose' ne demek?", options: ["Kaldirmak", "Dayatmak/zorlamak", "Onermek", "Kabul etmek"], correct: 1 },
  { type: "vocab", question: "'Elaborate' ne demek?", options: ["Basit", "Ayrintili/kapsamli", "Kisa", "Kolay"], correct: 1 },
  // More unique collocations
  { type: "collocation", question: "The teacher _____ a speech at graduation.", options: ["made", "gave", "did", "told"], correct: 1 },
  { type: "collocation", question: "He _____ a habit of jogging each morning.", options: ["did", "made", "took", "kept"], correct: 1 },
  { type: "collocation", question: "They _____ an investigation into the matter.", options: ["made", "did", "conducted", "took"], correct: 2 },
  { type: "collocation", question: "She _____ emphasis on quality.", options: ["placed", "made", "did", "got"], correct: 0 },
  { type: "collocation", question: "The team _____ a record this season.", options: ["made", "set", "did", "broke"], correct: 1 },
  // More unique transforms
  { type: "transform", question: "'To make up' ne demek?", options: ["Indirmek", "Uydurma/barismak", "Kosmak", "Saklanmak"], correct: 1 },
  { type: "transform", question: "'To set up' ne demek?", options: ["Oturtmak", "Kurmak/olusturmak", "Yikmak", "Dondurmek"], correct: 1 },
  { type: "transform", question: "'To take over' ne demek?", options: ["Vermek", "Devralmak", "Gecmek", "Kalkmak"], correct: 1 },
  { type: "transform", question: "'To hold on' ne demek?", options: ["Birakmak", "Beklemek/tutunmak", "Kalkmak", "Kosmak"], correct: 1 },
  { type: "transform", question: "'To pull off' ne demek?", options: ["Cekmek", "Basarmak", "Dusmek", "Kaymak"], correct: 1 },
  // --- NEW GRAMMAR QUESTIONS ---
  { type: "grammar", question: "She _____ here since 2019.", options: ["lives", "has lived", "lived", "is living"], correct: 1 },
  { type: "grammar", question: "If I _____ you, I would apologize.", options: ["am", "was", "were", "be"], correct: 2 },
  { type: "grammar", question: "He asked me where I _____.", options: ["live", "lived", "am living", "do live"], correct: 1 },
  { type: "grammar", question: "She wishes she _____ harder last year.", options: ["studies", "studied", "had studied", "would study"], correct: 2 },
  { type: "grammar", question: "Not only _____ smart, but also hardworking.", options: ["she is", "is she", "she was", "was she"], correct: 1 },
  { type: "grammar", question: "I'd rather you _____ smoke in here.", options: ["don't", "won't", "didn't", "haven't"], correct: 2 },
  { type: "grammar", question: "It's high time we _____ a decision.", options: ["make", "made", "will make", "have made"], correct: 1 },
  { type: "grammar", question: "They had the roof _____ last month.", options: ["repair", "repaired", "repairing", "to repair"], correct: 1 },
  { type: "grammar", question: "She couldn't help _____ at the joke.", options: ["laugh", "laughing", "to laugh", "laughed"], correct: 1 },
  { type: "grammar", question: "By tomorrow, she _____ the report.", options: ["finishes", "will finish", "will have finished", "finished"], correct: 2 },
  { type: "grammar", question: "The manager insists that he _____ on time.", options: ["is", "be", "was", "will be"], correct: 1 },
  { type: "grammar", question: "_____ the rain, we went for a walk.", options: ["Although", "Despite", "However", "Because"], correct: 1 },
  { type: "grammar", question: "She is _____ to drive.", options: ["enough old", "old enough", "too old enough", "old too"], correct: 1 },
  { type: "grammar", question: "He denied _____ the window.", options: ["break", "to break", "breaking", "broke"], correct: 2 },
  { type: "grammar", question: "This is the town _____ I grew up.", options: ["which", "that", "where", "who"], correct: 2 },
  { type: "grammar", question: "Were I rich, I _____ travel the world.", options: ["will", "would", "can", "shall"], correct: 1 },
  { type: "grammar", question: "The sooner you start, the _____ you'll finish.", options: ["sooner", "more soon", "soonest", "soon"], correct: 0 },
  // --- NEW VOCAB QUESTIONS ---
  { type: "vocab", question: "'Reluctant' ne demek?", options: ["Istekli", "Gönülsüz/isteksiz", "Hizli", "Mutlu"], correct: 1 },
  { type: "vocab", question: "'Ambiguous' ne demek?", options: ["Net", "Belirsiz/cift anlamli", "Basit", "Kisa"], correct: 1 },
  { type: "vocab", question: "'Advocate' ne demek?", options: ["Karsitlik", "Savunmak/desteklemek", "Reddetmek", "Sorgulamak"], correct: 1 },
  { type: "vocab", question: "'Coherent' ne demek?", options: ["Dagnik", "Tutarli/mantikli", "Karisik", "Uzun"], correct: 1 },
  { type: "vocab", question: "'Fluctuate' ne demek?", options: ["Sabit kalmak", "Dalgalanmak/degismek", "Artmak", "Azalmak"], correct: 1 },
  { type: "vocab", question: "'Contemplate' ne demek?", options: ["Pes etmek", "Dusunmek/tasarlamak", "Kosmak", "Gormezden gelmek"], correct: 1 },
  { type: "vocab", question: "'Deteriorate' ne demek?", options: ["Gelismek", "Kotuye gitmek/bozulmak", "Iyilesmek", "Durmak"], correct: 1 },
  { type: "vocab", question: "'Mitigate' ne demek?", options: ["Artirmak", "Hafifletmek/azaltmak", "Yogunlastirmak", "Engellemek"], correct: 1 },
  { type: "vocab", question: "'Profound' ne demek?", options: ["Yuzeysel", "Derin/köklu", "Kisa", "Basit"], correct: 1 },
  { type: "vocab", question: "'Prevalent' ne demek?", options: ["Nadir", "Yaygin/hüküm suren", "Gizli", "Eski"], correct: 1 },
  { type: "vocab", question: "'Compelling' ne demek?", options: ["Sikici", "Ikna edici/zorlayici", "Basit", "Kisa"], correct: 1 },
  { type: "vocab", question: "'Encompass' ne demek?", options: ["Dislamak", "Kapsamak/icermek", "Daraltmak", "Kaybetmek"], correct: 1 },
  { type: "vocab", question: "'Prosperity' ne demek?", options: ["Yoksulluk", "Refah/zenginlik", "Basarisizlik", "Durgunluk"], correct: 1 },
  { type: "vocab", question: "'Skeptical' ne demek?", options: ["Inancli", "Kusku duyan/suphe eden", "Tarafsiz", "Bilgisiz"], correct: 1 },
  { type: "vocab", question: "'Undermine' ne demek?", options: ["Desteklemek", "Baltalamak/zarar vermek", "Olusturmak", "Guclendirmek"], correct: 1 },
  { type: "vocab", question: "'Concede' ne demek?", options: ["Kazanmak", "Kabul etmek/taviz vermek", "Reddetmek", "Savunmak"], correct: 1 },
  { type: "vocab", question: "'Imminent' ne demek?", options: ["Uzak", "Yakin/eli kulağında", "Gecmis", "Belirsiz"], correct: 1 },
  // --- NEW COLLOCATION QUESTIONS ---
  { type: "collocation", question: "She _____ a difference to the community.", options: ["did", "made", "took", "got"], correct: 1 },
  { type: "collocation", question: "He _____ an effort to learn her language.", options: ["did", "made", "took", "gave"], correct: 1 },
  { type: "collocation", question: "The negotiators _____ a deal after weeks.", options: ["made", "struck", "did", "Both A and B"], correct: 3 },
  { type: "collocation", question: "We need to _____ a stand against injustice.", options: ["do", "make", "take", "give"], correct: 2 },
  { type: "collocation", question: "The new law _____ into effect next month.", options: ["goes", "comes", "gets", "Both A and B"], correct: 3 },
  { type: "collocation", question: "She _____ a complaint to the manager.", options: ["did", "filed", "took", "had"], correct: 1 },
  { type: "collocation", question: "He _____ the lead in the project.", options: ["made", "did", "took", "gave"], correct: 2 },
  { type: "collocation", question: "The witness _____ an oath to tell the truth.", options: ["did", "made", "took", "gave"], correct: 2 },
  { type: "collocation", question: "She _____ no expense for the wedding.", options: ["took", "made", "did", "spared"], correct: 3 },
  { type: "collocation", question: "They _____ a discussion about the budget.", options: ["did", "made", "had", "took"], correct: 2 },
  { type: "collocation", question: "He _____ his best to finish on time.", options: ["made", "did", "took", "gave"], correct: 1 },
  { type: "collocation", question: "She _____ full responsibility for the error.", options: ["did", "made", "took", "had"], correct: 2 },
  { type: "collocation", question: "He _____ a presentation to the board.", options: ["did", "made", "gave", "took"], correct: 2 },
  // --- NEW PHRASAL VERB / TRANSFORM QUESTIONS ---
  { type: "transform", question: "'To come across' ne demek?", options: ["Gelmek", "Rastlamak/karsilasmak", "Gecmek", "Donmek"], correct: 1 },
  { type: "transform", question: "'To put up with' ne demek?", options: ["Koymak", "Katlanmak/tahammül etmek", "Kalkmak", "Durmak"], correct: 1 },
  { type: "transform", question: "'To break down' ne demek?", options: ["Kirmak", "Bozulmak/cökmek", "Dusmek", "Kaymak"], correct: 1 },
  { type: "transform", question: "'To get along with' ne demek?", options: ["Gitmek", "Gecimmek/iyi anlasmak", "Kalkmak", "Kosmak"], correct: 1 },
  { type: "transform", question: "'To look into' ne demek?", options: ["Bakmak", "Arastirmak/incelemek", "Gormek", "Izlemek"], correct: 1 },
  { type: "transform", question: "'To run out of' ne demek?", options: ["Kosmak", "Tukenmek/bitmek", "Kaymak", "Donmek"], correct: 1 },
  { type: "transform", question: "'To turn down' ne demek?", options: ["Cevirmek", "Reddetmek", "Kalkmak", "Yakmak"], correct: 1 },
  { type: "transform", question: "'To bring about' ne demek?", options: ["Getirmek", "Neden olmak/yol acmak", "Kalkmak", "Durmak"], correct: 1 },
  { type: "transform", question: "'To carry on' ne demek?", options: ["Tasimak", "Devam etmek", "Durmak", "Birakmak"], correct: 1 },
  { type: "transform", question: "'To figure out' ne demek?", options: ["Saymak", "Çözmek/anlamak", "Cizmek", "Kaybetmek"], correct: 1 },
  { type: "transform", question: "'To give up' ne demek?", options: ["Vermek", "Vazgecmek/birakmak", "Kalkmak", "Almak"], correct: 1 },
  { type: "transform", question: "'To pick up' ne demek?", options: ["Secmek", "Almak/ögrenmek", "Birakmak", "Kosmak"], correct: 1 },
  { type: "transform", question: "'To pass away' ne demek?", options: ["Gecmek", "Vefat etmek/ölmek", "Kaybetmek", "Ayrılmak"], correct: 1 },
  { type: "transform", question: "'To stand for' ne demek?", options: ["Ayakta durmak", "Temsil etmek/anlamina gelmek", "Karsi cikmak", "Oturmak"], correct: 1 },
  { type: "transform", question: "'To count on' ne demek?", options: ["Saymak", "Güvenmek/bel baglamak", "Hesaplamak", "Azaltmak"], correct: 1 },
  // --- EXTRA GRAMMAR ---
  { type: "grammar", question: "She _____ rather not discuss it now.", options: ["will", "had", "would", "has"], correct: 2 },
  { type: "grammar", question: "_____ he arrive late, start without him.", options: ["Would", "Should", "Could", "Will"], correct: 1 },
  { type: "grammar", question: "He behaves as if nothing _____.", options: ["happens", "happened", "had happened", "has happened"], correct: 2 },
  { type: "grammar", question: "We had no choice but _____ the offer.", options: ["accept", "to accept", "accepting", "accepted"], correct: 1 },
  { type: "grammar", question: "Seldom _____ such dedication in young employees.", options: ["I see", "do I see", "I saw", "I am seeing"], correct: 1 },
  { type: "grammar", question: "It was _____ an easy exam that everyone passed.", options: ["so", "such", "very", "too"], correct: 1 },
  { type: "grammar", question: "By this time next year, I _____ my degree.", options: ["finish", "will finish", "will have finished", "have finished"], correct: 2 },
  { type: "grammar", question: "The cake _____ delicious. Can I have more?", options: ["taste", "tastes", "is tasting", "tasted"], correct: 1 },
  { type: "grammar", question: "She _____ to have been a famous singer.", options: ["said", "is said", "says", "has said"], correct: 1 },
  { type: "grammar", question: "He _____ me not to open the box.", options: ["said", "told", "spoke", "talked"], correct: 1 },
  // --- EXTRA VOCAB ---
  { type: "vocab", question: "'Paradigm' ne demek?", options: ["Problem", "Model/ornek yapi", "Zorluk", "Fark"], correct: 1 },
  { type: "vocab", question: "'Resilient' ne demek?", options: ["Kirilgan", "Dayanikli/esnek", "Sert", "Yavas"], correct: 1 },
  { type: "vocab", question: "'Obstinate' ne demek?", options: ["Uyumlu", "Inatci/dik basli", "Sakin", "Nazik"], correct: 1 },
  { type: "vocab", question: "'Erratic' ne demek?", options: ["Duzenli", "Tutarsiz/dengesiz", "Yavas", "Sabit"], correct: 1 },
  { type: "vocab", question: "'Plausible' ne demek?", options: ["Imkansiz", "Makul/inanilir", "Karisik", "Kesin"], correct: 1 },
  { type: "vocab", question: "'Exacerbate' ne demek?", options: ["Iyilestirmek", "Kotuye gotürmek", "Azaltmak", "Sabitlemek"], correct: 1 },
  { type: "vocab", question: "'Scrutiny' ne demek?", options: ["Destek", "Detayli inceleme", "Yanlis", "Onay"], correct: 1 },
  { type: "vocab", question: "'Tangible' ne demek?", options: ["Soyut", "Somut/elle tutulur", "Gizli", "Yüzeysel"], correct: 1 },
  { type: "vocab", question: "'Prolific' ne demek?", options: ["Nadir", "Cok uretken", "Yavas", "Tembel"], correct: 1 },
  { type: "vocab", question: "'Inevitable' ne demek?", options: ["Onlenebilir", "Kacinilmaz", "Mumkun", "Belirsiz"], correct: 1 },
  // --- EXTRA COLLOCATION ---
  { type: "collocation", question: "He _____ an apology for his behaviour.", options: ["did", "made", "offered", "Both B and C"], correct: 3 },
  { type: "collocation", question: "She _____ a speech at the conference.", options: ["did", "made", "delivered", "Both B and C"], correct: 3 },
  { type: "collocation", question: "They _____ priority to customer service.", options: ["did", "made", "gave", "took"], correct: 2 },
  { type: "collocation", question: "He _____ a promise to help us.", options: ["did", "made", "took", "gave"], correct: 1 },
  { type: "collocation", question: "She _____ a contribution to the fund.", options: ["did", "made", "took", "had"], correct: 1 },
  // --- EXTRA TRANSFORM ---
  { type: "transform", question: "'To call off' ne demek?", options: ["Aramak", "Iptal etmek", "Cagirmak", "Kapamak"], correct: 1 },
  { type: "transform", question: "'To end up' ne demek?", options: ["Bitirmek", "Sonunda olmak/kalmak", "Kalkmak", "Durmak"], correct: 1 },
  { type: "transform", question: "'To put forward' ne demek?", options: ["Koymak", "Ileri sürmek/önermek", "Geriye almak", "Kaldirmak"], correct: 1 },
  { type: "transform", question: "'To see through' ne demek?", options: ["Görmek", "Fark etmek (hileyi)/sonuna kadar götürmek", "Izlemek", "Aramak"], correct: 1 },
  { type: "transform", question: "'To fall for' ne demek?", options: ["Düşmek", "Âşık olmak/kanmak", "Kaymak", "Kosmak"], correct: 1 },
]

const BLITZ_DURATION = 60 // seconds
const TYPE_LABELS: Record<string, string> = {
  collocation: "Collocation",
  vocab: "Kelime",
  grammar: "Gramer",
  transform: "Phrasal Verb",
}
const TYPE_COLORS: Record<string, string> = {
  collocation: "bg-blue-100 text-blue-700",
  vocab: "bg-amber-100 text-amber-700",
  grammar: "bg-emerald-100 text-emerald-700",
  transform: "bg-violet-100 text-violet-700",
}

export function BlitzChallenge() {
  const [phase, setPhase] = useState<"ready" | "playing" | "finished">("ready")
  const [questions, setQuestions] = useState<BlitzQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(BLITZ_DURATION)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null)
  const [copied, setCopied] = useState(false)
  const [bestScore, setBestScore] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("tls_blitz_best")
      if (stored) setBestScore(Number.parseInt(stored, 10))
    }
  }, [])

  const startGame = useCallback(() => {
    const shuffled = [...blitzPool].sort(() => Math.random() - 0.5)
    setQuestions(shuffled)
    setCurrentIndex(0)
    setTimeLeft(BLITZ_DURATION)
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setFeedback(null)
    setPhase("playing")
  }, [])

  useEffect(() => {
    if (phase !== "playing") return
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          setPhase("finished")
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [phase])

  // Award XP when finished
  useEffect(() => {
    if (phase !== "finished") return
    let xp = XP_REWARDS.blitz_complete
    if (score > bestScore) xp += XP_REWARDS.blitz_high_score

    if (score > bestScore && typeof window !== "undefined") {
      localStorage.setItem("tls_blitz_best", String(score))
      setBestScore(score)
    }

    const progress = addXp(xp, "blitz")
    showXpToast(xp)
    const newAchievements = checkAndUnlockAchievements(progress)
    for (const a of newAchievements) showAchievementToast(a)
  }, [phase])

  const handleAnswer = (optIndex: number) => {
    if (feedback !== null || phase !== "playing") return
    const q = questions[currentIndex]
  const isCorrect = optIndex === q.correct
  playSoundEffect(isCorrect ? "correct" : "wrong")
  
  if (isCorrect) {
  setScore(prev => prev + 1)
      setStreak(prev => {
        const ns = prev + 1
        setBestStreak(b => Math.max(b, ns))
        return ns
      })
      setFeedback("correct")
    } else {
      setStreak(0)
      setFeedback("wrong")
    }

    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current)
    feedbackTimeoutRef.current = setTimeout(() => {
      setFeedback(null)
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1)
      } else {
        // Ran out of questions - reshuffle
        const reshuffled = [...blitzPool].sort(() => Math.random() - 0.5)
        setQuestions(reshuffled)
        setCurrentIndex(0)
      }
    }, 400)
  }

  const shareResult = async () => {
    const text = `Blitz Challenge'da 60 saniyede ${score} doğru yaptım! En iyi serim: ${bestStreak}. Sen de dene:`
    const url = typeof window !== "undefined" ? window.location.origin : ""
    if (navigator.share) {
      try { await navigator.share({ title: "Blitz Sonucum", text, url }) } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Ready screen
  if (phase === "ready") {
    return (
      <div className="py-6">
        <Card className="border border-border/50 bg-card overflow-hidden rounded-lg">
          <CardContent className="p-8 text-center relative">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 left-8 w-20 h-20 rounded-full border-4 border-orange-400" />
              <div className="absolute bottom-6 right-12 w-14 h-14 rounded-full border-4 border-amber-400" />
              <div className="absolute top-12 right-8 w-8 h-8 rounded-full border-4 border-yellow-400" />
            </div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 mb-6 shadow-lg">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-serif text-2xl md:text-3xl mb-2">Blitz Challenge</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                60 saniyede mümkün olduğunca çok soruyu doğru cevaplayın. Gramer, kelime, collocation ve phrasal verb soruları karışık gelecek.
              </p>
              <div className="flex items-center justify-center gap-6 mb-8 text-sm">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-orange-600" />
                  <span>60 saniye</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-600" />
                  <span>Karışık sorular</span>
                </div>
                {bestScore > 0 && (
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-orange-600" />
                    <span>Rekor: {bestScore}</span>
                  </div>
                )}
              </div>
              <Button
                onClick={startGame}
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg px-10 text-base"
              >
                <Zap className="w-5 h-5 mr-2" />
                Başlat
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Finished screen
  if (phase === "finished") {
    const isNewBest = score >= bestScore && score > 0
    return (
      <div className="py-6">
        <Card className="border border-border/50 overflow-hidden rounded-lg">
          <CardContent className="p-8 text-center">
            <div className={cn(
              "inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4",
              isNewBest ? "bg-gradient-to-br from-yellow-400 to-orange-500" : "bg-gradient-to-br from-orange-500 to-amber-500"
            )}>
              <Trophy className="w-8 h-8 text-white" />
            </div>
            {isNewBest && (
              <div className="text-sm font-bold text-orange-600 mb-2 animate-in fade-in zoom-in duration-500">
                Yeni Rekor!
              </div>
            )}
            <h3 className="font-serif text-2xl mb-6">Blitz Tamamlandı!</h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-muted/50 rounded-xl p-3">
                <div className="text-2xl font-bold text-orange-600">{score}</div>
                <div className="text-xs text-muted-foreground">Doğru</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-3">
                <div className="text-2xl font-bold text-amber-600">{bestStreak}x</div>
                <div className="text-xs text-muted-foreground">En İyi Seri</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-3">
                <div className="text-2xl font-bold text-secondary">{bestScore}</div>
                <div className="text-xs text-muted-foreground">Rekor</div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button onClick={startGame} className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
                <RotateCcw className="w-4 h-4 mr-2" />
                Tekrar Oyna
              </Button>
                <div className="mt-2 pt-3 border-t border-border/50">
                  <ShareChallenge
                    title="Blitz Challenge Sonucum"
                    scoreText={`Blitz Challenge'da 60 saniyede ${score} doğru yaptım! En iyi serim: ${bestStreak}.`}
                    challengeText="Benim skorumu geçebilir misin? Sen de dene:"
                    toolSlug="blitz"
                    challengeScore={score}
                    challengeTotal={currentIndex}
                  />
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Playing screen
  const q = questions[currentIndex]
  const timerPercent = (timeLeft / BLITZ_DURATION) * 100
  const timerColor = timeLeft > 30 ? "bg-green-500" : timeLeft > 10 ? "bg-amber-500" : "bg-red-500"

  return (
    <div className="py-6">
      {/* Timer bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <Timer className={cn("w-4 h-4", timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-muted-foreground")} />
            <span className={cn("text-sm font-mono font-bold", timeLeft <= 10 && "text-red-500")}>{timeLeft}s</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-green-600 font-bold">{score} doğru</span>
            {streak >= 2 && (
              <span className="text-orange-600 font-bold animate-in zoom-in duration-200">{streak}x seri!</span>
            )}
          </div>
        </div>
        <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-1000 ease-linear", timerColor)}
            style={{ width: `${timerPercent}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <Card className={cn(
        "border-2 transition-all duration-200",
        feedback === "correct" && "border-green-400 bg-green-50/50",
        feedback === "wrong" && "border-red-400 bg-red-50/50",
        feedback === null && "border-border"
      )}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full", TYPE_COLORS[q.type])}>
              {TYPE_LABELS[q.type]}
            </span>
            {bestScore > 0 && (
              <span className="text-xs text-muted-foreground">Rekor: {bestScore}</span>
            )}
          </div>

          <h4 className="text-lg font-medium mb-5">{q.question}</h4>

          <div className="grid grid-cols-2 gap-2.5">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correct
              const showCorrect = feedback !== null && isCorrect
              const showWrong = feedback === "wrong" && !isCorrect && feedback !== null

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={feedback !== null}
                  className={cn(
                    "p-3.5 rounded-xl text-sm font-medium transition-all duration-150 text-left border-2",
                    feedback === null && "border-border bg-card hover:border-orange-300 hover:bg-orange-50/50 active:scale-[0.97]",
                    showCorrect && "border-green-400 bg-green-50 text-green-700",
                    showWrong && "border-border opacity-50",
                    feedback !== null && !showCorrect && !showWrong && "border-border opacity-50"
                  )}
                >
                  <span className="text-xs text-muted-foreground mr-1.5">{String.fromCharCode(65 + i)})</span>
                  {opt}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
