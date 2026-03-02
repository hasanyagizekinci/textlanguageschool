"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, RotateCcw, Shuffle, ArrowRight, Share2, Check, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import { ShareChallenge } from "@/components/share-challenge"

interface Sentence {
  id: number
  words: string[]
  translation: string
  level: string
}

const sentences: Sentence[] = [
  // A1-A2 Level
  { id: 1, words: ["I", "am", "going", "home."], translation: "Eve gidiyorum.", level: "A1" },
  { id: 2, words: ["Do", "you", "like", "coffee?"], translation: "Kahve sever misin?", level: "A1" },
  { id: 3, words: ["She", "speaks", "English", "fluently."], translation: "İngilizceyi akıcı konuşuyor.", level: "A1" },
  { id: 4, words: ["What", "is", "your", "name?"], translation: "Adın ne?", level: "A1" },
  { id: 5, words: ["He", "is", "reading", "a", "book."], translation: "Kitap okuyor.", level: "A1" },
  { id: 6, words: ["They", "live", "in", "Istanbul."], translation: "İstanbul'da yaşıyorlar.", level: "A1" },
  { id: 7, words: ["I", "have", "two", "brothers."], translation: "İki erkek kardeşim var.", level: "A1" },
  { id: 8, words: ["Where", "do", "you", "live?"], translation: "Nerede yaşıyorsun?", level: "A1" },
  { id: 9, words: ["She", "works", "in", "a", "hospital."], translation: "Bir hastanede çalışıyor.", level: "A1" },
  { id: 10, words: ["Can", "you", "help", "me?"], translation: "Bana yardım edebilir misin?", level: "A1" },
  // A2-B1 Level
  { id: 11, words: ["I", "have", "never", "been", "to", "London."], translation: "Londra'ya hiç gitmedim.", level: "A2" },
  { id: 12, words: ["We", "went", "to", "the", "cinema", "yesterday."], translation: "Dün sinemaya gittik.", level: "A2" },
  { id: 13, words: ["I", "will", "call", "you", "tomorrow."], translation: "Yarın seni arayacağım.", level: "A2" },
  { id: 14, words: ["She", "has", "been", "studying", "for", "hours."], translation: "Saatlerdir ders çalışıyor.", level: "A2" },
  { id: 15, words: ["If", "it", "rains,", "I", "will", "stay", "home."], translation: "Yağmur yağarsa evde kalacağım.", level: "A2" },
  { id: 16, words: ["He", "used", "to", "play", "football."], translation: "Eskiden futbol oynardı.", level: "A2" },
  { id: 17, words: ["I", "am", "looking", "forward", "to", "meeting", "you."], translation: "Seninle tanışmayı dört gözle bekliyorum.", level: "A2" },
  { id: 18, words: ["She", "asked", "me", "where", "I", "lived."], translation: "Bana nerede yaşadığımı sordu.", level: "A2" },
  { id: 19, words: ["The", "book", "was", "written", "by", "Orwell."], translation: "Kitap Orwell tarafından yazıldı.", level: "A2" },
  { id: 20, words: ["I", "wish", "I", "had", "more", "time."], translation: "Keşke daha fazla zamanım olsaydı.", level: "A2" },
  // B1-B2 Level
  { id: 21, words: ["Had", "I", "known,", "I", "would", "have", "helped."], translation: "Bilseydim yardım ederdim.", level: "B1" },
  { id: 22, words: ["Not", "only", "did", "she", "win,", "but", "she", "broke", "the", "record."], translation: "Sadece kazanmadı, aynı zamanda rekoru kırdı.", level: "B2" },
  { id: 23, words: ["The", "more", "you", "practice,", "the", "better", "you", "become."], translation: "Ne kadar çok pratik yaparsan o kadar iyi olursun.", level: "B1" },
  { id: 24, words: ["She", "suggested", "that", "we", "take", "a", "break."], translation: "Bir mola vermemizi önerdi.", level: "B1" },
  { id: 25, words: ["By", "the", "time", "we", "arrived,", "the", "movie", "had", "started."], translation: "Biz vardığımızda film başlamıştı.", level: "B1" },
  { id: 26, words: ["Despite", "being", "tired,", "she", "continued", "working."], translation: "Yorgun olmasına rağmen çalışmaya devam etti.", level: "B1" },
  { id: 27, words: ["He", "is", "believed", "to", "be", "the", "best."], translation: "En iyi olduğuna inanılıyor.", level: "B2" },
  { id: 28, words: ["I", "would", "rather", "stay", "home", "than", "go", "out."], translation: "Dışarı çıkmaktansa evde kalmayı tercih ederim.", level: "B1" },
  { id: 29, words: ["It", "is", "essential", "that", "you", "arrive", "on", "time."], translation: "Zamanında varmanız çok önemli.", level: "B2" },
  { id: 30, words: ["No", "sooner", "had", "I", "left", "than", "it", "started", "raining."], translation: "Cikar cikmaz yagmur basladi.", level: "B2" },
  // More A1
  { id: 31, words: ["My", "father", "is", "a", "doctor."], translation: "Babam doktor.", level: "A1" },
  { id: 32, words: ["We", "eat", "lunch", "at", "noon."], translation: "Ogle yemegini oglen yiyoruz.", level: "A1" },
  { id: 33, words: ["There", "are", "many", "books", "on", "the", "shelf."], translation: "Rafta cok kitap var.", level: "A1" },
  { id: 34, words: ["I", "usually", "walk", "to", "school."], translation: "Genelde okula yuruyerek giderim.", level: "A1" },
  { id: 35, words: ["This", "coffee", "is", "too", "hot."], translation: "Bu kahve cok sicak.", level: "A1" },
  // More A2
  { id: 36, words: ["She", "has", "already", "finished", "her", "homework."], translation: "Odevini coktan bitirdi.", level: "A2" },
  { id: 37, words: ["We", "are", "going", "to", "visit", "our", "grandparents."], translation: "Buyuk anne babamizi ziyaret edecegiz.", level: "A2" },
  { id: 38, words: ["He", "was", "sleeping", "when", "the", "phone", "rang."], translation: "Telefon caldiginda uyuyordu.", level: "A2" },
  { id: 39, words: ["I", "have", "been", "waiting", "for", "an", "hour."], translation: "Bir saattir bekliyorum.", level: "A2" },
  { id: 40, words: ["You", "should", "see", "a", "doctor", "immediately."], translation: "Hemen bir doktora gorunmelisin.", level: "A2" },
  // More B1
  { id: 41, words: ["She", "is", "used", "to", "getting", "up", "early."], translation: "Erken kalkmaya aliskin.", level: "B1" },
  { id: 42, words: ["If", "I", "were", "you,", "I", "would", "accept", "the", "offer."], translation: "Yerinde olsam teklifi kabul ederdim.", level: "B1" },
  { id: 43, words: ["He", "might", "have", "forgotten", "about", "the", "meeting."], translation: "Toplantiyi unutmus olabilir.", level: "B1" },
  { id: 44, words: ["Unless", "you", "hurry,", "you", "will", "miss", "the", "bus."], translation: "Acele etmezsen otobusu kacirirsin.", level: "B1" },
  { id: 45, words: ["Neither", "the", "teacher", "nor", "the", "students", "were", "prepared."], translation: "Ne ogretmen ne ogrenciler hazirdi.", level: "B1" },
  // More B2
  { id: 46, words: ["Rarely", "have", "I", "seen", "such", "a", "beautiful", "sunset."], translation: "Nadiren bu kadar guzel bir gun batimi gordum.", level: "B2" },
  { id: 47, words: ["The", "project", "is", "expected", "to", "be", "completed", "by", "Friday."], translation: "Projenin cumaya kadar tamamlanmasi bekleniyor.", level: "B2" },
  { id: 48, words: ["Only", "after", "reading", "the", "book", "did", "I", "understand."], translation: "Ancak kitabi okuduktan sonra anladim.", level: "B2" },
  { id: 49, words: ["She", "denied", "having", "taken", "the", "money."], translation: "Parayi aldigini inkar etti.", level: "B2" },
  { id: 50, words: ["Were", "it", "not", "for", "his", "help,", "we", "would", "have", "failed."], translation: "Onun yardimi olmasaydi basarisiz olurduk.", level: "B2" },
  // More A1
  { id: 51, words: ["She", "likes", "reading", "books."], translation: "Kitap okumayı seviyor.", level: "A1" },
  { id: 52, words: ["The", "cat", "is", "under", "the", "table."], translation: "Kedi masanın altında.", level: "A1" },
  { id: 53, words: ["I", "drink", "tea", "every", "morning."], translation: "Her sabah çay içerim.", level: "A1" },
  { id: 54, words: ["How", "old", "are", "you?"], translation: "Kaç yaşındasın?", level: "A1" },
  { id: 55, words: ["They", "play", "football", "on", "Sundays."], translation: "Pazar günleri futbol oynarlar.", level: "A1" },
  // More A2
  { id: 56, words: ["I", "was", "cooking", "when", "you", "called."], translation: "Sen aradığında yemek yapıyordum.", level: "A2" },
  { id: 57, words: ["She", "has", "just", "arrived", "at", "the", "airport."], translation: "Havaalanına yeni geldi.", level: "A2" },
  { id: 58, words: ["We", "are", "going", "to", "have", "a", "test", "tomorrow."], translation: "Yarın sınavımız olacak.", level: "A2" },
  { id: 59, words: ["He", "couldn't", "come", "because", "he", "was", "sick."], translation: "Hasta olduğu için gelemedi.", level: "A2" },
  { id: 60, words: ["I", "would", "like", "a", "glass", "of", "water."], translation: "Bir bardak su istiyorum.", level: "A2" },
  // More B1
  { id: 61, words: ["She", "must", "have", "forgotten", "about", "the", "meeting."], translation: "Toplantıyı unutmuş olmalı.", level: "B1" },
  { id: 62, words: ["If", "I", "had", "more", "money,", "I", "would", "travel", "the", "world."], translation: "Daha fazla param olsaydı dünyayı gezerdim.", level: "B1" },
  { id: 63, words: ["He", "apologized", "for", "being", "late", "to", "the", "meeting."], translation: "Toplantıya geç kaldığı için özür diledi.", level: "B1" },
  { id: 64, words: ["The", "teacher", "made", "us", "rewrite", "the", "essay."], translation: "Öğretmen bize makaleyi yeniden yazdırdı.", level: "B1" },
  { id: 65, words: ["I", "am", "not", "used", "to", "eating", "spicy", "food."], translation: "Baharatlı yemek yemeye alışık değilim.", level: "B1" },
  // More B2
  { id: 66, words: ["Under", "no", "circumstances", "should", "you", "open", "this", "door."], translation: "Hiçbir koşulda bu kapıyı açmamalısın.", level: "B2" },
  { id: 67, words: ["The", "sooner", "we", "leave,", "the", "earlier", "we", "will", "arrive."], translation: "Ne kadar erken çıkarsak o kadar erken varırız.", level: "B2" },
  { id: 68, words: ["Had", "she", "known", "the", "truth,", "she", "would", "not", "have", "agreed."], translation: "Gerçeği bilseydi kabul etmezdi.", level: "B2" },
  { id: 69, words: ["He", "is", "said", "to", "have", "invented", "a", "new", "device."], translation: "Yeni bir cihaz icat ettiği söyleniyor.", level: "B2" },
  { id: 70, words: ["So", "impressed", "was", "the", "audience", "that", "they", "gave", "a", "standing", "ovation."], translation: "Seyirciler o kadar etkilendi ki ayakta alkışladılar.", level: "B2" },
  { id: 71, words: ["My", "name", "is", "Ali."], translation: "Benim adım Ali.", level: "A1" },
  { id: 72, words: ["She", "has", "two", "brothers."], translation: "İki erkek kardeşi var.", level: "A1" },
  { id: 73, words: ["We", "eat", "lunch", "at", "noon."], translation: "Öğlen yemeği yeriz.", level: "A1" },
  { id: 74, words: ["He", "goes", "to", "school", "by", "bus."], translation: "Okula otobüsle gider.", level: "A1" },
  { id: 75, words: ["The", "weather", "is", "very", "cold", "today."], translation: "Bugün hava çok soğuk.", level: "A1" },
  { id: 76, words: ["Can", "you", "close", "the", "window,", "please?"], translation: "Pencereyi kapatabilir misin, lütfen?", level: "A1" },
  { id: 77, words: ["I", "don't", "like", "spicy", "food."], translation: "Baharatlı yemek sevmem.", level: "A1" },
  { id: 78, words: ["There", "are", "many", "trees", "in", "the", "park."], translation: "Parkta birçok ağaç var.", level: "A1" },
  { id: 79, words: ["She", "was", "reading", "a", "book", "when", "I", "called."], translation: "Aradığımda kitap okuyordu.", level: "A2" },
  { id: 80, words: ["They", "haven't", "finished", "their", "homework", "yet."], translation: "Henüz ödevlerini bitirmediler.", level: "A2" },
  { id: 81, words: ["He", "used", "to", "live", "in", "a", "small", "village."], translation: "Eskiden küçük bir köyde yaşardı.", level: "A2" },
  { id: 82, words: ["She", "is", "taller", "than", "her", "sister."], translation: "Kız kardeşinden daha uzun.", level: "A2" },
  { id: 83, words: ["I", "have", "been", "waiting", "for", "an", "hour."], translation: "Bir saattir bekliyorum.", level: "A2" },
  { id: 84, words: ["We", "should", "leave", "before", "it", "gets", "dark."], translation: "Hava kararmadan ayrılmalıyız.", level: "A2" },
  { id: 85, words: ["Would", "you", "mind", "opening", "the", "door?"], translation: "Kapıyı açar mısın?", level: "A2" },
  { id: 86, words: ["The", "film", "was", "so", "boring", "that", "I", "fell", "asleep."], translation: "Film o kadar sıkıcıydı ki uyuyakaldım.", level: "A2" },
  { id: 87, words: ["If", "it", "rains", "tomorrow,", "we", "will", "stay", "at", "home."], translation: "Yarın yağmur yağarsa evde kalacağız.", level: "B1" },
  { id: 88, words: ["She", "suggested", "that", "we", "go", "to", "the", "cinema."], translation: "Sinemaya gitmemizi önerdi.", level: "B1" },
  { id: 89, words: ["He", "has", "been", "working", "here", "since", "2015."], translation: "2015'ten beri burada çalışıyor.", level: "B1" },
  { id: 90, words: ["Despite", "being", "tired,", "she", "continued", "to", "study."], translation: "Yorgun olmasına rağmen çalışmaya devam etti.", level: "B1" },
  { id: 91, words: ["The", "house", "where", "I", "grew", "up", "has", "been", "demolished."], translation: "Büyüdüğüm ev yıkıldı.", level: "B1" },
  { id: 92, words: ["I", "would", "rather", "stay", "at", "home", "than", "go", "out."], translation: "Dışarı çıkmaktansa evde kalmayı tercih ederim.", level: "B1" },
  { id: 93, words: ["She", "insisted", "on", "paying", "for", "the", "meal."], translation: "Yemeğin parasını ödemekte ısrar etti.", level: "B1" },
  { id: 94, words: ["He", "is", "too", "young", "to", "understand", "the", "situation."], translation: "Durumu anlayamayacak kadar genç.", level: "B1" },
  { id: 95, words: ["Not", "only", "did", "she", "pass,", "but", "she", "also", "got", "the", "highest", "grade."], translation: "Sadece geçmekle kalmadı, en yüksek notu da aldı.", level: "B2" },
  { id: 96, words: ["Little", "did", "they", "know", "about", "the", "danger", "ahead."], translation: "Önlerindeki tehlike hakkında çok az şey biliyorlardı.", level: "B2" },
  { id: 97, words: ["The", "more", "you", "read,", "the", "more", "you", "learn."], translation: "Ne kadar çok okursan o kadar çok öğrenirsin.", level: "B2" },
  { id: 98, words: ["She", "is", "believed", "to", "be", "the", "best", "candidate."], translation: "En iyi aday olduğuna inanılıyor.", level: "B2" },
  { id: 99, words: ["Rarely", "does", "he", "miss", "a", "day", "of", "work."], translation: "Nadiren bir iş günü kaçırır.", level: "B2" },
  { id: 100, words: ["Had", "I", "been", "there,", "I", "would", "have", "helped", "you."], translation: "Orada olsaydım sana yardım ederdim.", level: "B2" },
  { id: 101, words: ["She", "wishes", "she", "had", "studied", "harder", "for", "the", "exam."], translation: "Keşke sınav için daha çok çalışsaydı.", level: "B2" },
  { id: 102, words: ["It", "is", "no", "use", "crying", "over", "spilt", "milk."], translation: "Dökülmüş süte ağlamanın faydası yok.", level: "B2" },
  { id: 103, words: ["He", "is", "fond", "of", "playing", "chess."], translation: "Satranç oynamayı sever.", level: "B1" },
  { id: 104, words: ["I", "look", "forward", "to", "hearing", "from", "you."], translation: "Sizden haber bekliyorum.", level: "B1" },
  { id: 105, words: ["She", "got", "used", "to", "living", "alone."], translation: "Yalnız yaşamaya alıştı.", level: "B1" },
  { id: 106, words: ["What", "time", "does", "the", "train", "leave?"], translation: "Tren saat kaçta kalkıyor?", level: "A1" },
  { id: 107, words: ["He", "asked", "me", "where", "I", "had", "been."], translation: "Bana nerede olduğumu sordu.", level: "B1" },
  { id: 108, words: ["No", "sooner", "had", "he", "arrived", "than", "it", "started", "raining."], translation: "Daha yeni gelmişti ki yağmur başladı.", level: "B2" },
  { id: 109, words: ["She", "would", "have", "called", "if", "she", "had", "known."], translation: "Bilseydi arardı.", level: "B2" },
  { id: 110, words: ["Only", "by", "working", "together", "can", "we", "achieve", "our", "goals."], translation: "Ancak birlikte çalışarak hedeflerimize ulaşabiliriz.", level: "B2" },
  { id: 111, words: ["He", "denied", "having", "stolen", "the", "money."], translation: "Parayı çaldığını inkâr etti.", level: "B2" },
  { id: 112, words: ["This", "is", "the", "most", "beautiful", "place", "I", "have", "ever", "seen."], translation: "Bu şimdiye kadar gördüğüm en güzel yer.", level: "B1" },
  { id: 113, words: ["She", "couldn't", "help", "laughing", "at", "the", "joke."], translation: "Şakaya gülmekten kendini alamadı.", level: "B1" },
  { id: 114, words: ["I", "am", "having", "my", "car", "repaired", "tomorrow."], translation: "Yarın arabamı tamir ettireceğim.", level: "B2" },
  { id: 115, words: ["We", "ran", "out", "of", "milk", "this", "morning."], translation: "Bu sabah sütümüz bitti.", level: "A2" },
  { id: 116, words: ["Neither", "the", "teacher", "nor", "the", "students", "were", "happy."], translation: "Ne öğretmen ne de öğrenciler mutluydu.", level: "B2" },
  { id: 117, words: ["By", "the", "time", "I", "arrived,", "everyone", "had", "left."], translation: "Ben vardığımda herkes gitmişti.", level: "B1" },
  { id: 118, words: ["She", "is", "such", "a", "kind", "person", "that", "everyone", "loves", "her."], translation: "O kadar nazik biri ki herkes onu seviyor.", level: "B1" },
  { id: 119, words: ["He", "accused", "her", "of", "breaking", "the", "vase."], translation: "Onu vazoyu kırmakla suçladı.", level: "B2" },
  { id: 120, words: ["Were", "I", "in", "your", "position,", "I", "would", "accept", "the", "offer."], translation: "Senin yerinde olsam teklifi kabul ederdim.", level: "B2" },
  { id: 121, words: ["She", "appears", "to", "have", "changed", "her", "mind."], translation: "Fikrini değiştirmiş gibi görünüyor.", level: "B2" },
  { id: 122, words: ["I", "wish", "I", "could", "speak", "three", "languages."], translation: "Keşke üç dil konuşabilsem.", level: "B1" },
  { id: 123, words: ["The", "children", "are", "excited", "about", "the", "school", "trip."], translation: "Çocuklar okul gezisi için heyecanlı.", level: "A2" },
  { id: 124, words: ["He", "reminded", "me", "to", "bring", "my", "passport."], translation: "Bana pasaportumu getirmemi hatırlattı.", level: "B1" },
  { id: 125, words: ["Hardly", "had", "the", "game", "begun", "when", "it", "started", "to", "rain."], translation: "Maç daha yeni başlamıştı ki yağmur yağmaya başladı.", level: "B2" },
  { id: 126, words: ["She", "made", "him", "apologize", "for", "his", "behaviour."], translation: "Davranışı için özür dilemesini sağladı.", level: "B1" },
  { id: 127, words: ["How", "long", "have", "you", "been", "studying", "English?"], translation: "Ne zamandır İngilizce öğreniyorsun?", level: "A2" },
  { id: 128, words: ["It", "took", "me", "two", "hours", "to", "finish", "the", "report."], translation: "Raporu bitirmem iki saatimi aldı.", level: "B1" },
  { id: 129, words: ["She", "turned", "down", "the", "job", "offer."], translation: "İş teklifini reddetti.", level: "B1" },
  { id: 130, words: ["Not", "until", "I", "got", "home", "did", "I", "realize", "my", "mistake."], translation: "Eve varıncaya kadar hatamı fark etmedim.", level: "B2" },
  { id: 131, words: ["He", "is", "the", "kind", "of", "person", "who", "never", "gives", "up."], translation: "O asla pes etmeyen türden bir insan.", level: "B1" },
  { id: 132, words: ["I", "had", "no", "sooner", "sat", "down", "than", "the", "phone", "rang."], translation: "Daha yeni oturmuştum ki telefon çaldı.", level: "B2" },
  { id: 133, words: ["Do", "you", "know", "how", "to", "get", "to", "the", "station?"], translation: "İstasyona nasıl gidileceğini biliyor musun?", level: "A2" },
  { id: 134, words: ["She", "left", "without", "saying", "goodbye."], translation: "Hoşça kal demeden ayrıldı.", level: "A2" },
  { id: 135, words: ["On", "no", "account", "should", "this", "door", "be", "left", "open."], translation: "Hiçbir koşulda bu kapı açık bırakılmamalı.", level: "B2" },
  { id: 136, words: ["The", "more", "I", "study,", "the", "less", "I", "seem", "to", "understand."], translation: "Ne kadar çalışırsam o kadar az anlıyor gibi hissediyorum.", level: "B2" },
  { id: 137, words: ["He", "prevented", "her", "from", "making", "a", "terrible", "mistake."], translation: "Onu korkunç bir hata yapmaktan alıkoydu.", level: "B1" },
  { id: 138, words: ["She", "is", "said", "to", "speak", "five", "languages."], translation: "Beş dil konuştuğu söyleniyor.", level: "B2" },
  { id: 139, words: ["Where", "are", "you", "going", "for", "the", "holiday?"], translation: "Tatil için nereye gidiyorsun?", level: "A1" },
  { id: 140, words: ["They", "were", "made", "to", "work", "overtime."], translation: "Fazla mesai yapmaya zorlandılar.", level: "B2" },
]

const levelColors: Record<string, { bg: string; text: string }> = {
  A1: { bg: "bg-emerald-50", text: "text-emerald-600" },
  A2: { bg: "bg-blue-50", text: "text-blue-600" },
  B1: { bg: "bg-amber-50", text: "text-amber-600" },
  B2: { bg: "bg-rose-50", text: "text-rose-600" },
}

const ROUNDS_PER_SET = 6

export function SentenceBuilder() {
  const [shuffledWords, setShuffledWords] = useState<string[]>([])
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [isChecked, setIsChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [currentSet, setCurrentSet] = useState(1)
  const [totalScore, setTotalScore] = useState(0)
  const [totalRounds, setTotalRounds] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [usedIds, setUsedIds] = useState<Set<number>>(new Set())
  const [currentSentence, setCurrentSentence] = useState<Sentence | null>(null)
  const [copied, setCopied] = useState(false)

  const loadNewSentence = () => {
    const available = sentences.filter(s => !usedIds.has(s.id))

    if (available.length === 0) {
      setUsedIds(new Set())
      const randomSentence = sentences[Math.floor(Math.random() * sentences.length)]
      setCurrentSentence(randomSentence)
      setShuffledWords([...randomSentence.words].sort(() => Math.random() - 0.5))
    } else {
      const randomSentence = available[Math.floor(Math.random() * available.length)]
      setCurrentSentence(randomSentence)
      setShuffledWords([...randomSentence.words].sort(() => Math.random() - 0.5))
    }

    setSelectedWords([])
    setIsChecked(false)
    setIsCorrect(false)
  }

  const startNewGame = () => {
    setScore(0)
    setRound(1)
    setCurrentSet(1)
    setTotalScore(0)
    setTotalRounds(0)
    setIsFinished(false)
    setUsedIds(new Set())
    setCopied(false)
    loadNewSentence()
  }

  const continueGame = () => {
    if (currentSentence) {
      setUsedIds(prev => new Set([...prev, currentSentence.id]))
    }
    setTotalScore(prev => prev + score)
    setTotalRounds(prev => prev + ROUNDS_PER_SET)
    setScore(0)
    setRound(1)
    setCurrentSet(prev => prev + 1)
    setIsFinished(false)
    loadNewSentence()
  }

  useEffect(() => {
    loadNewSentence()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleWordClick = (word: string, index: number) => {
    if (isChecked) return

    const newShuffled = [...shuffledWords]
    newShuffled.splice(index, 1)
    setShuffledWords(newShuffled)
    setSelectedWords([...selectedWords, word])
  }

  const handleSelectedWordClick = (word: string, index: number) => {
    if (isChecked) return

    const newSelected = [...selectedWords]
    newSelected.splice(index, 1)
    setSelectedWords(newSelected)
    setShuffledWords([...shuffledWords, word])
  }

  const checkAnswer = () => {
    if (!currentSentence) return
    const correctAnswer = currentSentence.words.join(" ")
    const userAnswer = selectedWords.join(" ")
    const correct = userAnswer === correctAnswer
    setIsCorrect(correct)
    setIsChecked(true)
    if (correct) setScore(score + 1)
  }

  const nextSentence = () => {
    if (currentSentence) {
      setUsedIds(prev => new Set([...prev, currentSentence.id]))
    }

    if (round >= ROUNDS_PER_SET) {
      setIsFinished(true)
    } else {
      setRound(round + 1)
      loadNewSentence()
    }
  }

  const shareResult = async () => {
    const totalCorrect = totalScore + score
    const totalQ = totalRounds + ROUNDS_PER_SET
    const percentage = Math.round((totalCorrect / totalQ) * 100)
    const text = `Cümle Kurma oyununda ${currentSet} sette ${totalQ} sorudan ${totalCorrect} doğru yaptım (%${percentage})! Sen de dene:`
    const url = typeof window !== "undefined" ? window.location.origin : ""

    if (navigator.share) {
      try {
        await navigator.share({ title: "Cümle Kurma Sonucum", text, url })
      } catch {
        // cancelled
      }
    } else {
      const fullText = `${text}\n${url}`
      await navigator.clipboard.writeText(fullText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const remainingSentences = sentences.length - usedIds.size - 1

  if (!currentSentence) return null

  const progress = (round / ROUNDS_PER_SET) * 100
  const lvlColor = levelColors[currentSentence.level] || levelColors["A1"]

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Shuffle className="w-5 h-5 text-emerald-600" />
          <h3 className="font-serif text-lg">Cümle Kur</h3>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", lvlColor.bg, lvlColor.text)}>
            {currentSentence.level}
          </span>
          {currentSet > 1 && <span className="text-xs">Set {currentSet}</span>}
          <span className="font-medium">{round}/{ROUNDS_PER_SET}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-muted rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-emerald-400 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {!isFinished ? (
        <>
          {/* Translation card */}
          <Card className="border border-border/50 mb-4 bg-muted/30 rounded-lg">
            <CardContent className="p-4">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Türkçe</p>
              <p className="text-foreground font-medium leading-relaxed">{currentSentence?.translation}</p>
            </CardContent>
          </Card>

          {/* Selected words area */}
          <Card className={cn(
            "border-2 border-dashed min-h-[64px] mb-4 transition-all duration-300",
            isChecked && isCorrect && "border-emerald-400 bg-emerald-50",
            isChecked && !isCorrect && "border-red-400 bg-red-50",
            !isChecked && selectedWords.length > 0 && "border-emerald-300/60"
          )}>
            <CardContent className="p-3 flex flex-wrap gap-2">
              {selectedWords.length === 0 ? (
                <span className="text-muted-foreground text-sm py-1">Kelimeleri sıraya dizip cümleyi kurun...</span>
              ) : (
                selectedWords.map((word, index) => (
                  <button
                    key={`sel-${index}`}
                    onClick={() => handleSelectedWordClick(word, index)}
                    disabled={isChecked}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                      isChecked
                        ? "bg-muted cursor-default"
                        : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 cursor-pointer shadow-sm active:scale-95"
                    )}
                  >
                    {word}
                  </button>
                ))
              )}
            </CardContent>
          </Card>

          {/* Available words */}
          <div className="flex flex-wrap gap-2 mb-4 min-h-[44px]">
            {shuffledWords.map((word, index) => (
              <button
                key={`avail-${index}`}
                onClick={() => handleWordClick(word, index)}
                disabled={isChecked}
                className="px-3 py-1.5 rounded-lg bg-muted text-foreground text-sm font-medium hover:bg-muted/70 transition-all active:scale-95 shadow-sm"
              >
                {word}
              </button>
            ))}
          </div>

          {/* Feedback */}
          {isChecked && (
            <div className={cn(
              "p-3 rounded-xl mb-4 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300 border",
              isCorrect ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"
            )}>
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span className="font-medium">Doğru!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 shrink-0" />
                  <span className="text-sm">Doğru cevap: {currentSentence?.words.join(" ")}</span>
                </>
              )}
            </div>
          )}

          {/* Action button */}
          {!isChecked ? (
            <Button
              onClick={checkAnswer}
              disabled={selectedWords.length === 0}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Kontrol Et
            </Button>
          ) : (
            <Button
              onClick={nextSentence}
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground animate-in fade-in duration-200"
            >
              {round >= ROUNDS_PER_SET ? "Sonucu Gor" : "Sonraki"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </>
      ) : (
        <Card className="border border-border/50 overflow-hidden rounded-lg">
          <div className="bg-emerald-50 py-3 text-center">
            <Trophy className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
            <h4 className="font-serif text-xl">Set Tamamlandı!</h4>
          </div>
          <CardContent className="p-5">
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="text-center p-3 rounded-xl bg-emerald-50">
                <div className="text-2xl font-bold text-emerald-600">{score}</div>
                <div className="text-[10px] text-emerald-600/70">Doğru</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-red-50">
                <div className="text-2xl font-bold text-red-500">{ROUNDS_PER_SET - score}</div>
                <div className="text-[10px] text-red-500/70">Yanlış</div>
              </div>
            </div>

            <div className="flex justify-center gap-1 mb-5">
              {Array.from({ length: ROUNDS_PER_SET }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-6 h-2 rounded-full",
                    i < score ? "bg-emerald-400" : "bg-red-300"
                  )}
                />
              ))}
            </div>

            {currentSet > 1 && (
              <div className="text-center text-sm text-muted-foreground mb-4 py-2 border-t border-b border-dashed">
                Toplam: {totalScore + score}/{totalRounds + ROUNDS_PER_SET} doğru
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Button onClick={continueGame} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                <ArrowRight className="w-4 h-4 mr-2" />
                Devam Et ({remainingSentences > 0 ? `${remainingSentences} cümle kaldı` : "Baştan"})
              </Button>
                <div className="mt-2 pt-3 border-t border-border/50">
                  <ShareChallenge
                    title="Cümle Kurma Sonucum"
                    scoreText={`Cümle Kurma'da %${Math.round(((totalScore + score) / (totalRounds + ROUNDS_PER_SET)) * 100)} başarı! ${totalScore + score}/${totalRounds + ROUNDS_PER_SET} doğru.`}
                    challengeText="İngilizce cümle kurma yeteneğini test et:"
                    toolSlug="sentence-builder"
                    challengeScore={totalScore + score}
                    challengeTotal={totalRounds + ROUNDS_PER_SET}
                  />
                </div>
              <Button onClick={startNewGame} variant="outline" className="w-full bg-transparent">
                <RotateCcw className="w-4 h-4 mr-2" />
                Sıfırdan Başla
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
