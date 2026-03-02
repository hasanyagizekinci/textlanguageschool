"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, XCircle, RefreshCw, Sparkles, ArrowRight, Trophy, GraduationCap, Share2, Check } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { playSoundEffect } from "@/components/xp-toast"
import { ShareChallenge } from "@/components/share-challenge"
import { addXp, checkAndUnlockAchievements, XP_REWARDS, markPerfectScore } from "@/lib/xp-system"
import { QuizHeader } from "@/components/quiz-header"

type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2"

interface Question {
  id: number
  question: string
  options: string[]
  correct: number
  explanation: string
}

const questionsByLevel: Record<Level, Question[]> = {
  A1: [
    // To be verb
    { id: 1, question: "I _____ from Turkey.", options: ["am", "are", "is"], correct: 0, explanation: "Birinci tekil şahıs (I) ile 'am' kullanılır." },
    { id: 2, question: "She _____ a teacher.", options: ["am", "is", "are"], correct: 1, explanation: "Üçüncü tekil şahıs (she) ile 'is' kullanılır." },
    { id: 3, question: "They _____ my friends.", options: ["is", "am", "are"], correct: 2, explanation: "Çoğul şahıslar (they) ile 'are' kullanılır." },
    { id: 4, question: "We _____ students.", options: ["am", "is", "are"], correct: 2, explanation: "Birinci çoğul şahıs (we) ile 'are' kullanılır." },
    { id: 5, question: "He _____ 25 years old.", options: ["is", "are", "am"], correct: 0, explanation: "Üçüncü tekil şahıs (he) ile 'is' kullanılır." },
    // Articles
    { id: 6, question: "This is _____ apple.", options: ["a", "an", "the"], correct: 1, explanation: "Sesli harf ile başlayan kelimelerde 'an' kullanılır." },
    { id: 7, question: "I have _____ cat.", options: ["a", "an", "the"], correct: 0, explanation: "Sessiz harf ile başlayan kelimelerde 'a' kullanılır." },
    { id: 8, question: "She is _____ honest person.", options: ["a", "an", "the"], correct: 1, explanation: "'Honest' kelimesi sessiz 'h' ile başlar, 'an' kullanılır." },
    { id: 9, question: "I need _____ umbrella.", options: ["a", "an", "the"], correct: 1, explanation: "'Umbrella' sesli harf ile başlar, 'an' kullanılır." },
    { id: 10, question: "He is _____ doctor.", options: ["a", "an", "the"], correct: 0, explanation: "'Doctor' sessiz harf ile başlar, 'a' kullanılır." },
    // Present Simple verbs
    { id: 11, question: "She _____ to school every day.", options: ["go", "goes", "going"], correct: 1, explanation: "Üçüncü tekil şahıs ile fiil '-s' takısı alır." },
    { id: 12, question: "He _____ coffee in the morning.", options: ["drink", "drinks", "drinking"], correct: 1, explanation: "Üçüncü tekil şahıs ile fiil '-s' takısı alır." },
    { id: 13, question: "They _____ football on Sundays.", options: ["plays", "play", "playing"], correct: 1, explanation: "Çoğul şahıslarla fiil yalın halde kalır." },
    { id: 14, question: "My mother _____ delicious food.", options: ["cook", "cooks", "cooking"], correct: 1, explanation: "Üçüncü tekil şahıs ile fiil '-s' takısı alır." },
    { id: 15, question: "I _____ English every day.", options: ["study", "studies", "studying"], correct: 0, explanation: "Birinci tekil şahıs ile fiil yalın halde kalır." },
    // Vocabulary
    { id: 16, question: "Happy means:", options: ["üzüntülü", "mutlu", "yorgun"], correct: 1, explanation: "'Happy' Türkçe'de 'mutlu' anlamına gelir." },
    { id: 17, question: "Big means:", options: ["küçük", "büyük", "uzun"], correct: 1, explanation: "'Big' Türkçe'de 'büyük' anlamına gelir." },
    { id: 18, question: "Cold means:", options: ["sıcak", "soğuk", "ılık"], correct: 1, explanation: "'Cold' Türkçe'de 'soğuk' anlamına gelir." },
    { id: 19, question: "Fast means:", options: ["yavaş", "hızlı", "uzun"], correct: 1, explanation: "'Fast' Türkçe'de 'hızlı' anlamına gelir." },
    { id: 20, question: "Beautiful means:", options: ["çirkin", "güzel", "yaşlı"], correct: 1, explanation: "'Beautiful' Türkçe'de 'güzel' anlamına gelir." },
    // Question words
    { id: 21, question: "Where _____ you live?", options: ["do", "does", "is"], correct: 0, explanation: "Simple Present soru cümlesinde 'you' ile 'do' kullanılır." },
    { id: 22, question: "What _____ your name?", options: ["is", "are", "do"], correct: 0, explanation: "'Your name' tekil olduğu için 'is' kullanılır." },
    { id: 23, question: "How _____ are you?", options: ["old", "many", "much"], correct: 0, explanation: "Yaş sormak için 'How old' kullanılır." },
    { id: 24, question: "_____ is your birthday?", options: ["What", "When", "Where"], correct: 1, explanation: "Zaman sormak için 'When' kullanılır." },
    { id: 25, question: "_____ do you live?", options: ["What", "When", "Where"], correct: 2, explanation: "Yer sormak için 'Where' kullanılır." },
    // Prepositions
    { id: 26, question: "I go to school _____ bus.", options: ["by", "with", "on"], correct: 0, explanation: "Ulaşım araçları için 'by' kullanılır: by bus, by car." },
    { id: 27, question: "The book is _____ the table.", options: ["in", "on", "at"], correct: 1, explanation: "Yüzey üzerinde olmak için 'on' kullanılır." },
    { id: 28, question: "She lives _____ Istanbul.", options: ["on", "at", "in"], correct: 2, explanation: "Şehirler için 'in' kullanılır." },
    { id: 29, question: "We have lunch _____ noon.", options: ["in", "on", "at"], correct: 2, explanation: "Belirli saat/zaman için 'at' kullanılır: at noon, at 5 o'clock." },
    { id: 30, question: "My birthday is _____ July.", options: ["in", "on", "at"], correct: 0, explanation: "Aylar için 'in' kullanılır: in July, in December." },
    // Possessives
    { id: 31, question: "This is _____ book.", options: ["I", "my", "me"], correct: 1, explanation: "İsimden önce iyelik sıfatı (possessive adjective) kullanılır." },
    { id: 32, question: "_____ name is Ali.", options: ["His", "He", "Him"], correct: 0, explanation: "'He' için iyelik sıfatı 'His' kullanılır." },
    { id: 33, question: "Is this _____ bag?", options: ["you", "your", "yours"], correct: 1, explanation: "İsimden önce 'your' (iyelik sıfatı) kullanılır." },
    { id: 34, question: "The cat is drinking _____ milk.", options: ["it", "it's", "its"], correct: 2, explanation: "'Its' iyelik sıfatıdır, 'it's' ise 'it is' kısaltmasıdır." },
    { id: 35, question: "_____ are my parents.", options: ["This", "These", "That"], correct: 1, explanation: "Çoğul ve yakın nesneler için 'These' kullanılır." },
    // Counting
    { id: 36, question: "How _____ water do you need?", options: ["many", "much", "some"], correct: 1, explanation: "Sayılamaz isimlerle 'much' kullanılır." },
    { id: 37, question: "How _____ books are there?", options: ["much", "many", "any"], correct: 1, explanation: "Sayılabilir çoğul isimlerle 'many' kullanılır." },
    { id: 38, question: "There aren't _____ eggs in the fridge.", options: ["some", "any", "much"], correct: 1, explanation: "Olumsuz cümlelerde 'any' kullanılır." },
    { id: 39, question: "I want _____ coffee, please.", options: ["any", "some", "many"], correct: 1, explanation: "Olumlu cümle ve rica için 'some' kullanılır." },
    { id: 40, question: "She _____ like spicy food.", options: ["don't", "doesn't", "isn't"], correct: 1, explanation: "3. tekil şahıs olumsuz: doesn't + yalın fiil." },
  ],
  A2: [
    // Present Continuous
    { id: 1, question: "I _____ TV now.", options: ["watch", "am watching", "watched"], correct: 1, explanation: "'Now' şu an yapılan eylemi ifade eder, Present Continuous kullanılır." },
    { id: 2, question: "She _____ a book at the moment.", options: ["reads", "is reading", "read"], correct: 1, explanation: "'At the moment' Present Continuous gerektirir." },
    { id: 3, question: "They _____ football right now.", options: ["play", "are playing", "played"], correct: 1, explanation: "'Right now' Present Continuous gerektirir." },
    { id: 4, question: "Look! It _____.", options: ["rains", "is raining", "rained"], correct: 1, explanation: "'Look!' ile anlık durumlar Present Continuous ile ifade edilir." },
    { id: 5, question: "We _____ dinner at the moment.", options: ["have", "are having", "had"], correct: 1, explanation: "'At the moment' Present Continuous gerektirir." },
    // There is/are
    { id: 6, question: "There _____ some books on the table.", options: ["is", "are", "am"], correct: 1, explanation: "Çoğul isimlerle (books) 'are' kullanılır." },
    { id: 7, question: "There _____ a cat in the garden.", options: ["is", "are", "am"], correct: 0, explanation: "Tekil isimle (a cat) 'is' kullanılır." },
    { id: 8, question: "There _____ three children in the park.", options: ["is", "are", "was"], correct: 1, explanation: "Çoğul isimle (children) 'are' kullanılır." },
    { id: 9, question: "There _____ some water in the glass.", options: ["is", "are", "am"], correct: 0, explanation: "'Water' sayılamaz isim olduğu için 'is' kullanılır." },
    { id: 10, question: "There _____ many people at the party.", options: ["is", "are", "was"], correct: 1, explanation: "Çoğul isimle (people) 'are' kullanılır." },
    // Vocabulary - opposites
    { id: 11, question: "Opposite of 'difficult' is:", options: ["hard", "easy", "slow"], correct: 1, explanation: "'Difficult' (zor) kelimesinin zıt anlamlısı 'easy' (kolay) dır." },
    { id: 12, question: "Opposite of 'hot' is:", options: ["warm", "cold", "cool"], correct: 1, explanation: "'Hot' (sıcak) kelimesinin zıt anlamlısı 'cold' (soğuk) dur." },
    { id: 13, question: "Opposite of 'old' is:", options: ["new", "young", "both"], correct: 2, explanation: "'Old' hem 'new' (yeni) hem 'young' (genç) ile zıt olabilir." },
    { id: 14, question: "Opposite of 'cheap' is:", options: ["expensive", "free", "low"], correct: 0, explanation: "'Cheap' (ucuz) kelimesinin zıt anlamlısı 'expensive' (pahalı) dır." },
    { id: 15, question: "Opposite of 'tall' is:", options: ["long", "short", "high"], correct: 1, explanation: "'Tall' (uzun) kelimesinin zıt anlamlısı 'short' (kısa) dır." },
    // Articles in context
    { id: 16, question: "I saw _____ interesting movie yesterday.", options: ["an", "a", "the"], correct: 0, explanation: "Sesli harf ile başlayan 'interesting' önünde 'an' kullanılır." },
    { id: 17, question: "She bought _____ new car.", options: ["a", "an", "the"], correct: 0, explanation: "'New' sessiz harf ile başlar, 'a' kullanılır." },
    { id: 18, question: "I ate _____ orange for breakfast.", options: ["a", "an", "the"], correct: 1, explanation: "'Orange' sesli harf ile başlar, 'an' kullanılır." },
    { id: 19, question: "He is _____ engineer.", options: ["a", "an", "the"], correct: 1, explanation: "'Engineer' sesli harf ile başlar, 'an' kullanılır." },
    { id: 20, question: "We need _____ hour to finish.", options: ["a", "an", "the"], correct: 1, explanation: "'Hour' sessiz 'h' ile başlar ama sesli okunur, 'an' kullanılır." },
    // Have/has
    { id: 21, question: "They _____ breakfast at 7 a.m. every day.", options: ["has", "have", "having"], correct: 1, explanation: "Çoğul şahıslar (they) ile 'have' kullanılır." },
    { id: 22, question: "She _____ two brothers.", options: ["have", "has", "having"], correct: 1, explanation: "Üçüncü tekil şahıs ile 'has' kullanılır." },
    { id: 23, question: "I _____ a headache.", options: ["has", "have", "having"], correct: 1, explanation: "Birinci tekil şahıs ile 'have' kullanılır." },
    { id: 24, question: "He _____ a big house.", options: ["have", "has", "having"], correct: 1, explanation: "Üçüncü tekil şahıs ile 'has' kullanılır." },
    { id: 25, question: "We _____ a lot of homework.", options: ["has", "have", "having"], correct: 1, explanation: "Birinci çoğul şahıs ile 'have' kullanılır." },
    // Past Simple
    { id: 26, question: "I _____ to the cinema last night.", options: ["go", "went", "going"], correct: 1, explanation: "Geçmiş zaman (last night) için Past Simple kullanılır." },
    { id: 27, question: "She _____ her homework yesterday.", options: ["do", "did", "does"], correct: 1, explanation: "'Yesterday' Past Simple gerektirir." },
    { id: 28, question: "They _____ play football last weekend.", options: ["don't", "didn't", "doesn't"], correct: 1, explanation: "Past Simple olumsuz: didn't + yalın fiil." },
    { id: 29, question: "_____ you see the movie?", options: ["Do", "Did", "Does"], correct: 1, explanation: "Past Simple soru: Did + subject + yalın fiil." },
    { id: 30, question: "We _____ a great time at the party.", options: ["have", "had", "has"], correct: 1, explanation: "Past Simple: 'have' fiilinin geçmişi 'had'." },
    // Comparatives & Superlatives
    { id: 31, question: "She is _____ than her sister.", options: ["tall", "taller", "tallest"], correct: 1, explanation: "İki şeyi karşılaştırırken '-er' eki kullanılır." },
    { id: 32, question: "This is the _____ book I've ever read.", options: ["good", "better", "best"], correct: 2, explanation: "Superlative: 'good' -> 'best' düzensiz karşılaştırma." },
    { id: 33, question: "English is _____ than I thought.", options: ["more difficult", "difficulter", "most difficult"], correct: 0, explanation: "Uzun sıfatlar 'more + adjective' ile karşılaştırılır." },
    { id: 34, question: "He runs _____ than me.", options: ["fast", "faster", "fastest"], correct: 1, explanation: "Karşılaştırma: '-er + than' yapısı." },
    { id: 35, question: "This is the _____ expensive restaurant in town.", options: ["more", "most", "much"], correct: 1, explanation: "Superlative: 'the most + long adjective'." },
    // Can/Can't & ability
    { id: 36, question: "She _____ swim very well.", options: ["can", "cans", "is can"], correct: 0, explanation: "'Can' modal fiili her zaman yalın halde kullanılır." },
    { id: 37, question: "I _____ drive when I was 16.", options: ["can't", "couldn't", "don't"], correct: 1, explanation: "Geçmişte yetenek: 'could/couldn't'." },
    { id: 38, question: "You _____ eat in the library.", options: ["mustn't", "must", "can"], correct: 0, explanation: "'Mustn't' yasaklama ifade eder." },
    { id: 39, question: "_____ I open the window?", options: ["Do", "Am", "Can"], correct: 2, explanation: "İzin istemek için 'Can I...?' kullanılır." },
    { id: 40, question: "He _____ to study harder for the exam.", options: ["need", "needs", "needing"], correct: 1, explanation: "3. tekil şahıs ile 'needs' kullanılır." },
  ],
  B1: [
    // First Conditional
    { id: 1, question: "If it _____ tomorrow, we will stay home.", options: ["rains", "rained", "will rain"], correct: 0, explanation: "First conditional'da if clause'da Simple Present kullanılır." },
    { id: 2, question: "If you _____ hard, you will pass the exam.", options: ["study", "studied", "will study"], correct: 0, explanation: "First conditional'da if clause'da Simple Present kullanılır." },
    { id: 3, question: "She will be angry if you _____ late.", options: ["are", "were", "will be"], correct: 0, explanation: "First conditional'da if clause'da Simple Present kullanılır." },
    { id: 4, question: "If I _____ time, I will help you.", options: ["have", "had", "will have"], correct: 0, explanation: "First conditional'da if clause'da Simple Present kullanılır." },
    { id: 5, question: "They will miss the bus if they _____ hurry.", options: ["don't", "didn't", "won't"], correct: 0, explanation: "First conditional'da if clause'da Simple Present kullanılır." },
    // Wish clauses
    { id: 6, question: "I wish I _____ more free time.", options: ["have", "had", "will have"], correct: 1, explanation: "'I wish' ile şimdiki zaman için past simple kullanılır." },
    { id: 7, question: "She wishes she _____ speak French.", options: ["can", "could", "will"], correct: 1, explanation: "'Wish' ile yetenek için 'could' kullanılır." },
    { id: 8, question: "I wish it _____ raining.", options: ["stops", "stopped", "will stop"], correct: 1, explanation: "'Wish' ile şimdiki zaman için past simple kullanılır." },
    { id: 9, question: "He wishes he _____ taller.", options: ["is", "were", "will be"], correct: 1, explanation: "'Wish' ile 'were' tüm şahıslar için kullanılır." },
    { id: 10, question: "We wish we _____ on holiday now.", options: ["are", "were", "will be"], correct: 1, explanation: "'Wish' ile şimdiki zaman için past simple kullanılır." },
    // Phrasal verbs
    { id: 11, question: "Please _____ your shoes before entering.", options: ["take out", "take off", "put on"], correct: 1, explanation: "'Take off' ayakkabı çıkarmak anlamında kullanılır." },
    { id: 12, question: "I need to _____ early tomorrow.", options: ["get up", "get in", "get on"], correct: 0, explanation: "'Get up' kalkmak anlamında kullanılır." },
    { id: 13, question: "Can you _____ the music? It's too loud.", options: ["turn down", "turn up", "turn on"], correct: 0, explanation: "'Turn down' sesi kısmak anlamında kullanılır." },
    { id: 14, question: "Don't forget to _____ the lights when you leave.", options: ["turn on", "turn off", "turn up"], correct: 1, explanation: "'Turn off' kapatmak anlamında kullanılır." },
    { id: 15, question: "I'm _____ my old clothes to charity.", options: ["giving away", "giving up", "giving in"], correct: 0, explanation: "'Give away' bağışlamak anlamında kullanılır." },
    // Future Perfect
    { id: 16, question: "By next year, I _____ here for five years.", options: ["will live", "will have lived", "lived"], correct: 1, explanation: "Future Perfect: gelecekte tamamlanacak eylemler için kullanılır." },
    { id: 17, question: "By 6 pm, she _____ the report.", options: ["will finish", "will have finished", "finished"], correct: 1, explanation: "Future Perfect: belirli bir zamana kadar tamamlanacak eylem." },
    { id: 18, question: "They _____ by the time we arrive.", options: ["will leave", "will have left", "left"], correct: 1, explanation: "Future Perfect: başka bir eylemden önce tamamlanacak eylem." },
    { id: 19, question: "By midnight, I _____ the book.", options: ["will read", "will have read", "read"], correct: 1, explanation: "Future Perfect: belirli bir zamana kadar tamamlanacak eylem." },
    { id: 20, question: "He _____ 1000 km by the end of the trip.", options: ["will drive", "will have driven", "drove"], correct: 1, explanation: "Future Perfect: belirli bir noktaya kadar tamamlanacak eylem." },
    // Reported speech
    { id: 21, question: "She said, 'I am tired.' → She said that _____", options: ["she was tired", "she is tired", "she will be tired"], correct: 0, explanation: "Reported speech'te zaman geriye kayar: am → was." },
    { id: 22, question: "He said, 'I will come.' → He said that _____", options: ["he will come", "he would come", "he comes"], correct: 1, explanation: "Reported speech'te will → would olur." },
    { id: 23, question: "They said, 'We are leaving.' → They said that _____", options: ["they are leaving", "they were leaving", "they leave"], correct: 1, explanation: "Reported speech'te are → were olur." },
    { id: 24, question: "She said, 'I can swim.' → She said that _____", options: ["she can swim", "she could swim", "she swims"], correct: 1, explanation: "Reported speech'te can → could olur." },
    { id: 25, question: "He said, 'I have finished.' → He said that _____", options: ["he has finished", "he had finished", "he finished"], correct: 1, explanation: "Reported speech'te have → had olur." },
    // Present Perfect vs Past Simple
    { id: 26, question: "I _____ to London three times.", options: ["went", "have been", "was"], correct: 1, explanation: "Belirsiz zaman + deneyim: Present Perfect kullanılır." },
    { id: 27, question: "She _____ her keys. She can't find them.", options: ["lost", "has lost", "is losing"], correct: 1, explanation: "Şu anki sonucu olan geçmiş eylem: Present Perfect." },
    { id: 28, question: "I _____ this film before. Let's watch something else.", options: ["saw", "have seen", "see"], correct: 1, explanation: "'Before' ile deneyim: Present Perfect kullanılır." },
    { id: 29, question: "We _____ here since 2020.", options: ["live", "have lived", "lived"], correct: 1, explanation: "'Since' ile Present Perfect kullanılır." },
    { id: 30, question: "He _____ already _____ the report.", options: ["has / finished", "have / finished", "had / finish"], correct: 0, explanation: "'Already' Present Perfect ile kullanılır: has already finished." },
    // Used to / Would
    { id: 31, question: "I _____ play football every weekend when I was young.", options: ["used to", "use to", "am used to"], correct: 0, explanation: "Geçmişteki alışkanlıklar: 'used to + V1'." },
    { id: 32, question: "She is _____ waking up early now.", options: ["used to", "use to", "used"], correct: 0, explanation: "'Be used to + gerund/noun' alışkın olmak demektir." },
    { id: 33, question: "I _____ eat a lot of junk food, but now I eat healthy.", options: ["used to", "would", "Both A and B"], correct: 2, explanation: "Geçmişteki tekrarlanan eylemler: hem 'used to' hem 'would'." },
    // Passive Voice
    { id: 34, question: "This house _____ in 1990.", options: ["built", "was built", "is built"], correct: 1, explanation: "Past Simple Passive: was/were + V3." },
    { id: 35, question: "The letter _____ yesterday.", options: ["was sent", "sent", "is sent"], correct: 0, explanation: "Past Simple Passive: was + V3." },
    // Modals of deduction
    { id: 36, question: "She's not answering. She _____ be sleeping.", options: ["must", "can't", "should"], correct: 0, explanation: "'Must' güçlü tahmin (olmalı) ifade eder." },
    { id: 37, question: "He _____ be at work. It's Sunday.", options: ["must", "can't", "might"], correct: 1, explanation: "'Can't' imkansız tahmin ifade eder." },
    { id: 38, question: "She _____ be at home or at the office. I'm not sure.", options: ["must", "might", "can't"], correct: 1, explanation: "'Might' belirsiz tahmin ifade eder." },
    { id: 39, question: "The streets are wet. It _____ rained last night.", options: ["must have", "might", "should"], correct: 0, explanation: "Geçmişe dair kesin çıkarım: must have + V3." },
    { id: 40, question: "You look tired. You _____ to go to bed.", options: ["should", "ought", "Both A and B"], correct: 2, explanation: "'Should' ve 'ought to' tavsiye bildirir." },
  ],
  B2: [
    // Modals
    { id: 1, question: "You _____ study harder if you want to pass.", options: ["must", "might", "could"], correct: 0, explanation: "'Must' zorunluluk ifade eder." },
    { id: 2, question: "She _____ be at home. Her car is in the garage.", options: ["must", "can't", "might"], correct: 0, explanation: "'Must' kesin çıkarım için kullanılır." },
    { id: 3, question: "You _____ have told me earlier!", options: ["should", "must", "would"], correct: 0, explanation: "'Should have' geçmişteki pişmanlık için kullanılır." },
    { id: 4, question: "He _____ be the thief. He was with me all night.", options: ["must", "can't", "might"], correct: 1, explanation: "'Can't' imkansızlık ifade eder." },
    { id: 5, question: "They _____ have arrived by now.", options: ["should", "must", "would"], correct: 0, explanation: "'Should have' beklenti ifade eder." },
    // Inversion
    { id: 6, question: "No sooner _____ she arrived _____ it started raining.", options: ["had / than", "did / that", "did / when"], correct: 0, explanation: "No sooner + had + V3 + than yapısı kullanılır." },
    { id: 7, question: "Hardly _____ the movie started _____ the lights went out.", options: ["had / when", "did / when", "has / when"], correct: 0, explanation: "Hardly + had + V3 + when yapısı kullanılır." },
    { id: 8, question: "Not only _____ she win, but she also broke the record.", options: ["did", "has", "was"], correct: 0, explanation: "Not only ile devrik yapı kullanılır: did + subject + verb." },
    { id: 9, question: "Never _____ I seen such a beautiful sunset.", options: ["have", "had", "did"], correct: 0, explanation: "Never ile devrik yapı: Never have I + V3." },
    { id: 10, question: "Seldom _____ he go to the cinema.", options: ["does", "did", "has"], correct: 0, explanation: "Seldom ile devrik yapı: Seldom does + subject + verb." },
    // Idioms
    { id: 11, question: "If something costs an arm and a leg, it is:", options: ["cheap", "expensive", "broken"], correct: 1, explanation: "'Costs an arm and a leg' çok pahalı demektir." },
    { id: 12, question: "To 'hit the nail on the head' means to:", options: ["make a mistake", "be exactly right", "hurt someone"], correct: 1, explanation: "'Hit the nail on the head' tam isabet demektir." },
    { id: 13, question: "'Once in a blue moon' means:", options: ["very often", "very rarely", "at night"], correct: 1, explanation: "'Once in a blue moon' çok nadir demektir." },
    { id: 14, question: "To 'break the ice' means to:", options: ["start a conversation", "end a relationship", "feel cold"], correct: 0, explanation: "'Break the ice' buzları kırmak, sohbet başlatmak demektir." },
    { id: 15, question: "'Piece of cake' means something is:", options: ["delicious", "very easy", "expensive"], correct: 1, explanation: "'Piece of cake' çok kolay demektir." },
    // Connectors
    { id: 16, question: "She likes coffee, _____ she doesn't drink it every day.", options: ["so", "but", "because"], correct: 1, explanation: "'But' zıtlık bağlacıdır." },
    { id: 17, question: "_____ the rain, we went for a walk.", options: ["Despite", "Because", "Although"], correct: 0, explanation: "'Despite' + noun/gerund yapısı kullanılır." },
    { id: 18, question: "He failed the exam _____ he studied hard.", options: ["although", "because", "so"], correct: 0, explanation: "'Although' zıtlık bağlacıdır, cümle ile kullanılır." },
    { id: 19, question: "I was tired, _____ I went to bed early.", options: ["so", "but", "although"], correct: 0, explanation: "'So' sonuç bağlacıdır." },
    { id: 20, question: "_____ being rich, he is not happy.", options: ["Despite", "Although", "Because"], correct: 0, explanation: "'Despite' + gerund yapısı kullanılır." },
    // Second Conditional
    { id: 21, question: "If I _____ you, I would apologize.", options: ["am", "were", "was"], correct: 1, explanation: "Second conditional'da 'were' tüm şahıslar için kullanılır." },
    { id: 22, question: "If she _____ harder, she would pass.", options: ["studies", "studied", "study"], correct: 1, explanation: "Second conditional'da if clause'da past simple kullanılır." },
    { id: 23, question: "I would travel the world if I _____ rich.", options: ["am", "were", "be"], correct: 1, explanation: "Second conditional'da 'were' kullanılır." },
    { id: 24, question: "If they _____ here, they would help us.", options: ["are", "were", "be"], correct: 1, explanation: "Second conditional'da 'were' kullanılır." },
    { id: 25, question: "She would be happier if she _____ less.", options: ["works", "worked", "work"], correct: 1, explanation: "Second conditional'da past simple kullanılır." },
    // Third Conditional
    { id: 26, question: "If I _____ harder, I would have passed the exam.", options: ["study", "studied", "had studied"], correct: 2, explanation: "Third conditional: If + Past Perfect, would have + V3." },
    { id: 27, question: "She _____ the job if she had applied.", options: ["would get", "would have got", "will get"], correct: 1, explanation: "Third conditional main clause: would have + V3." },
    { id: 28, question: "If they _____ earlier, they wouldn't have missed the train.", options: ["leave", "left", "had left"], correct: 2, explanation: "Third conditional if clause: had + V3." },
    // Relative clauses
    { id: 29, question: "The woman _____ son is a doctor lives next door.", options: ["who", "whose", "which"], correct: 1, explanation: "'Whose' sahiplik bildiren ilgi zamiridir." },
    { id: 30, question: "That's the restaurant _____ we had dinner.", options: ["which", "where", "that"], correct: 1, explanation: "Yer belirtmek için 'where' kullanılır." },
    // Passive advanced
    { id: 31, question: "The meeting _____ to next week.", options: ["has postponed", "has been postponed", "postponed"], correct: 1, explanation: "Present Perfect Passive: has been + V3." },
    { id: 32, question: "New houses _____ in the area right now.", options: ["are building", "are being built", "have built"], correct: 1, explanation: "Present Continuous Passive: is/are being + V3." },
    // Cleft sentences
    { id: 33, question: "It _____ John who broke the window.", options: ["is", "was", "were"], correct: 1, explanation: "Cleft sentence vurgu yapısı: It was... who/that." },
    { id: 34, question: "What I _____ is a good night's sleep.", options: ["need", "needs", "needed"], correct: 0, explanation: "Pseudo-cleft: What I + verb + is/was." },
    // Linking words
    { id: 35, question: "_____ his illness, he attended the meeting.", options: ["Despite", "Although", "However"], correct: 0, explanation: "'Despite' + noun/gerund yapısı kullanılır." },
    { id: 36, question: "She is talented; _____, she needs more practice.", options: ["however", "despite", "although"], correct: 0, explanation: "'However' bağımsız cümleler arası zıtlık bağlacıdır." },
    { id: 37, question: "He works hard _____ he can support his family.", options: ["so that", "although", "despite"], correct: 0, explanation: "'So that' amaç bağlacıdır." },
    { id: 38, question: "_____ the bad weather, the match was cancelled.", options: ["Due to", "Although", "However"], correct: 0, explanation: "'Due to' + noun: neden bildirmek için kullanılır." },
    { id: 39, question: "She speaks English _____ she were a native speaker.", options: ["as if", "like", "such as"], correct: 0, explanation: "'As if + past' gerçek olmayan karşılaştırma." },
    { id: 40, question: "_____ having studied all night, she still failed.", options: ["Despite", "Although", "Because of"], correct: 0, explanation: "'Despite + gerund' zıtlık bildiren bağlaç yapısı." },
  ],
  C1: [
    // Relative clauses
    { id: 1, question: "The man _____ car was stolen is my uncle.", options: ["whose", "which", "who"], correct: 0, explanation: "'Whose' sahiplik ifade eden ilgi zamiridir." },
    { id: 2, question: "The book _____ I read last week was amazing.", options: ["who", "which", "whose"], correct: 1, explanation: "'Which' nesneler için kullanılır." },
    { id: 3, question: "The woman _____ helped me was very kind.", options: ["which", "who", "whose"], correct: 1, explanation: "'Who' insanlar için kullanılır." },
    { id: 4, question: "The reason _____ she left is unknown.", options: ["which", "why", "that"], correct: 1, explanation: "'Reason' ile 'why' kullanılır." },
    { id: 5, question: "The city _____ I was born is Istanbul.", options: ["which", "where", "that"], correct: 1, explanation: "Yer belirtmek için 'where' kullanılır." },
    // Collocations
    { id: 6, question: "The government _____ a new policy yesterday.", options: ["adopted", "accepted", "excepted"], correct: 0, explanation: "'Adopt a policy' politika benimsemek demektir." },
    { id: 7, question: "We need to _____ a decision soon.", options: ["make", "do", "take"], correct: 0, explanation: "'Make a decision' karar vermek demektir." },
    { id: 8, question: "She _____ a lot of attention to detail.", options: ["gives", "pays", "makes"], correct: 1, explanation: "'Pay attention' dikkat etmek demektir." },
    { id: 9, question: "The company _____ bankruptcy last year.", options: ["made", "declared", "did"], correct: 1, explanation: "'Declare bankruptcy' iflas ilan etmek demektir." },
    { id: 10, question: "You should _____ advantage of this opportunity.", options: ["make", "take", "do"], correct: 1, explanation: "'Take advantage' faydalanmak demektir." },
    // Third Conditional Inversion
    { id: 11, question: "_____ I known you were coming, I would have baked a cake.", options: ["If", "Had", "Were"], correct: 1, explanation: "Third conditional inversion: Had + subject + V3." },
    { id: 12, question: "_____ she studied harder, she would have passed.", options: ["If", "Had", "Were"], correct: 1, explanation: "Third conditional inversion: Had + subject + V3." },
    { id: 13, question: "_____ I been there, I would have helped.", options: ["If", "Had", "Were"], correct: 1, explanation: "Third conditional inversion: Had + subject + been." },
    { id: 14, question: "_____ they arrived earlier, they wouldn't have missed the flight.", options: ["If", "Had", "Should"], correct: 1, explanation: "Third conditional inversion: Had + subject + V3." },
    { id: 15, question: "_____ it not rained, we would have had a picnic.", options: ["If", "Had", "Should"], correct: 1, explanation: "Third conditional negative inversion: Had it not + V3." },
    // Advanced vocabulary
    { id: 16, question: "The lecture was so _____ that half of the class fell asleep.", options: ["intriguing", "exhilarating", "monotonous"], correct: 2, explanation: "'Monotonous' tekdüze, sıkıcı anlamına gelir." },
    { id: 17, question: "Her _____ to the project was invaluable.", options: ["distribution", "contribution", "attribution"], correct: 1, explanation: "'Contribution' katkı anlamına gelir." },
    { id: 18, question: "The evidence was _____ to prove his guilt.", options: ["sufficient", "efficient", "deficient"], correct: 0, explanation: "'Sufficient' yeterli anlamına gelir." },
    { id: 19, question: "The new policy has _____ implications for the economy.", options: ["far-reaching", "far-fetched", "far-sighted"], correct: 0, explanation: "'Far-reaching' geniş kapsamlı anlamına gelir." },
    { id: 20, question: "His explanation was rather _____.", options: ["ambiguous", "ambitious", "amphibious"], correct: 0, explanation: "'Ambiguous' belirsiz, muğlak anlamına gelir." },
    // Negative inversion
    { id: 21, question: "Rarely _____ such a brilliant performance _____ before.", options: ["have I / seen", "had I / saw", "I have / seen"], correct: 0, explanation: "Negative inversion: Rarely + have + subject + V3." },
    { id: 22, question: "Little _____ he know what was about to happen.", options: ["did", "does", "had"], correct: 0, explanation: "Negative inversion: Little did + subject + verb." },
    { id: 23, question: "Only then _____ I realize my mistake.", options: ["did", "do", "had"], correct: 0, explanation: "Only then + did + subject + verb yapısı kullanılır." },
    { id: 24, question: "Under no circumstances _____ you leave early.", options: ["should", "shall", "would"], correct: 0, explanation: "Under no circumstances + modal + subject + verb." },
    { id: 25, question: "Not until midnight _____ the guests leave.", options: ["did", "do", "were"], correct: 0, explanation: "Not until + noun + did + subject + verb." },
    // Emphasis & cleft
    { id: 26, question: "What _____ me most was his honesty.", options: ["impressed", "impressing", "impress"], correct: 0, explanation: "Pseudo-cleft: What + V(past) + me was..." },
    { id: 27, question: "It is high time the government _____ action.", options: ["takes", "took", "take"], correct: 1, explanation: "'It is high time + past simple' yapısı kullanılır." },
    { id: 28, question: "So _____ was the noise that we couldn't sleep.", options: ["loud", "loudly", "louder"], correct: 0, explanation: "So + adjective + was yapısında sıfat kullanılır." },
    { id: 29, question: "He behaved as though nothing _____.", options: ["happened", "had happened", "happens"], correct: 1, explanation: "'As though' ile past perfect: sanki olmamış gibi." },
    { id: 30, question: "The more you practice, the _____ you get.", options: ["good", "better", "best"], correct: 1, explanation: "'The more... the better' karşılaştırmalı yapı." },
    // Mixed conditionals
    { id: 31, question: "If I _____ you, I would have accepted the offer.", options: ["am", "were", "was"], correct: 1, explanation: "Mixed conditional: If + were (general), would have + V3 (past result)." },
    { id: 32, question: "If she had saved money, she _____ rich now.", options: ["will be", "would be", "would have been"], correct: 1, explanation: "Mixed conditional: past condition -> present result: would + V1." },
    // Subjunctive
    { id: 33, question: "I insist that he _____ on time.", options: ["is", "be", "was"], correct: 1, explanation: "Subjunctive mood: insist/demand/suggest + that + subject + bare infinitive." },
    { id: 34, question: "It is essential that every student _____ the exam.", options: ["takes", "take", "took"], correct: 1, explanation: "Formal subjunctive: it is essential that + subject + bare infinitive." },
    { id: 35, question: "The professor recommended that she _____ the course.", options: ["takes", "take", "took"], correct: 1, explanation: "Subjunctive after 'recommend': subject + bare infinitive." },
    // Advanced connectors
    { id: 36, question: "He is intelligent; _____, he lacks motivation.", options: ["nevertheless", "therefore", "furthermore"], correct: 0, explanation: "'Nevertheless' buna rağmen anlamında zıtlık bağlacı." },
    { id: 37, question: "The results were inconclusive; _____, more research is needed.", options: ["however", "hence", "moreover"], correct: 1, explanation: "'Hence' bu nedenle anlamında sonuç bağlacı." },
    { id: 38, question: "She is not only talented _____ also hardworking.", options: ["and", "but", "yet"], correct: 1, explanation: "'Not only... but also' hem... hem de yapısı." },
    { id: 39, question: "_____ for his support, the project would have failed.", options: ["But", "If not", "Were it not"], correct: 0, explanation: "'But for' = 'If it were not for' olmasaydı anlamında." },
    { id: 40, question: "The proposal was rejected on the _____ that it was too costly.", options: ["grounds", "basis", "Both A and B"], correct: 2, explanation: "'On the grounds/basis that' gerekçesiyle anlamında." },
  ],
  C2: [
    // Nuanced grammar
    { id: 1, question: "_____ be that as it may, the decision stands.", options: ["Be", "Let", "However"], correct: 0, explanation: "'Be that as it may' her ne olursa olsun anlamında formal ifade." },
    { id: 2, question: "Scarcely _____ he sat down when the phone rang.", options: ["had", "has", "did"], correct: 0, explanation: "Scarcely + had + V3 + when yapısı: nadiren yapı." },
    { id: 3, question: "He speaks English with such fluency _____ you'd think he was a native.", options: ["that", "as", "which"], correct: 0, explanation: "'Such + noun + that' sonuç bildiren yapı." },
    { id: 4, question: "Not for one moment _____ I doubt his sincerity.", options: ["did", "do", "have"], correct: 0, explanation: "Negative adverb inversion: Not for one moment did I..." },
    { id: 5, question: "_____ it not been for the scholarship, she couldn't have studied abroad.", options: ["Were", "Had", "Should"], correct: 1, explanation: "3rd conditional inversion: Had it not been for..." },
    // Subtle word choice
    { id: 6, question: "The data _____ that climate change is accelerating.", options: ["suggests", "suggest", "Both depending on dialect"], correct: 2, explanation: "'Data' tekil (AmE) veya çoğul (BrE) olarak kullanılabilir." },
    { id: 7, question: "She _____ have known about the changes; she was informed yesterday.", options: ["must", "might", "should"], correct: 2, explanation: "'Should have' beklenti: bilmesi gerekiyordu." },
    { id: 8, question: "The committee _____ divided on the issue.", options: ["is", "are", "Both depending on emphasis"], correct: 2, explanation: "Collective nouns: tekil (birim) veya çoğul (bireyler) olabilir." },
    { id: 9, question: "He would sooner resign _____ compromise his principles.", options: ["than", "as", "that"], correct: 0, explanation: "'Would sooner... than' tercih yapısı." },
    { id: 10, question: "Try _____ you might, you won't convince her.", options: ["as", "however", "though"], correct: 0, explanation: "'Try as you might' ne kadar denersen dene yapısı." },
    // Advanced vocabulary in context
    { id: 11, question: "The allegation proved to be completely _____.", options: ["unfounded", "ungrounded", "Both are acceptable"], correct: 2, explanation: "Her ikisi de temelsiz/asılsız anlamında kullanılabilir." },
    { id: 12, question: "Her argument was _____ and well-structured.", options: ["cogent", "urgent", "pungent"], correct: 0, explanation: "'Cogent' ikna edici, mantıklı demektir." },
    { id: 13, question: "The politician _____ his earlier statement after public backlash.", options: ["retracted", "extracted", "subtracted"], correct: 0, explanation: "'Retract' geri çekmek, sözünü geri almak demektir." },
    { id: 14, question: "The judge _____ the defendant to five years in prison.", options: ["sentenced", "convicted", "accused"], correct: 0, explanation: "'Sentence someone to' cezaya çarptırmak demektir." },
    { id: 15, question: "The new policy _____ widespread criticism from the opposition.", options: ["elicited", "solicited", "illicited"], correct: 0, explanation: "'Elicit' tepki/yanıt uyandırmak demektir." },
    // Complex structures
    { id: 16, question: "_____ circumstances should you reveal this information.", options: ["Under no", "Under any", "In no"], correct: 0, explanation: "'Under no circumstances' hiçbir koşulda anlamında devrik yapı." },
    { id: 17, question: "I'd just as _____ you didn't mention it.", options: ["soon", "well", "rather"], correct: 0, explanation: "'I'd just as soon' tercih yapısı: yapmamanı tercih ederim." },
    { id: 18, question: "He is nothing if not _____.", options: ["persistent", "persisted", "persisting"], correct: 0, explanation: "'Nothing if not' kesinlikle demektir: kesinlikle ısrarcı." },
    { id: 19, question: "The results, _____ preliminary, are very promising.", options: ["albeit", "despite", "although"], correct: 0, explanation: "'Albeit' her ne kadar anlamında formal bağlaç." },
    { id: 20, question: "She has a _____ for languages that is truly remarkable.", options: ["flair", "flare", "fair"], correct: 0, explanation: "'Flair' yetenek, doğal beceri demektir." },
    // Discourse markers
    { id: 21, question: "The economy is recovering; _____, unemployment remains high.", options: ["that said", "that being", "that done"], correct: 0, explanation: "'That said' bununla birlikte anlamında geçiş ifadesi." },
    { id: 22, question: "_____ to popular belief, the study found no link between the two.", options: ["Contrary", "Opposite", "Against"], correct: 0, explanation: "'Contrary to popular belief' yaygın kanının aksine." },
    { id: 23, question: "The proposal is, _____ the least, ambitious.", options: ["to say", "to put", "to make"], correct: 0, explanation: "'To say the least' en hafif tabirle demektir." },
    { id: 24, question: "His account of events doesn't quite _____ with the evidence.", options: ["tally", "count", "match"], correct: 0, explanation: "'Tally with' uyuşmak, tutarlı olmak demektir." },
    { id: 25, question: "The situation calls _____ immediate action.", options: ["for", "on", "upon"], correct: 0, explanation: "'Call for' gerektirmek demektir." },
  ],
}

const levelDescriptions: Record<Level, string> = {
  A1: "Başlangıç",
  A2: "Temel",
  B1: "Orta",
  B2: "Orta Üstü",
  C1: "İleri",
  C2: "Uzman",
}

const levelExplanations: Record<Level, string> = {
  A1: "A1 seviyesi, İngilizce öğrenme yolculuğunuzun başlangıcıdır. Bu seviyede temel kelimeler, basit cümleler ve günlük ifadeler öğrenilir. Kendinizi tanıtabilir, basit sorular sorabilir ve anlayabilirsiniz.",
  A2: "A2 seviyesinde günlük yaşamla ilgili sık kullanılan ifadeleri anlayabilirsiniz. Basit ve rutin görevlerde iletişim kurabilirsiniz, geçmiş ve gelecek hakkında kısa cümleler oluşturabilirsiniz.",
  B1: "B1 seviyesi, bağımsız kullanıcı seviyesidir. Seyahat, iş ve günlük konularda rahatça iletişim kurabilirsiniz. Deneyimlerinizi, hayallerinizi ve planlarınızı anlatabilirsiniz.",
  B2: "B2 seviyesinde karmaşık metinleri anlayabilir, anadili konuşanlarla rahat iletişim kurabilirsiniz. Geniş bir konu yelpazesinde net ve ayrıntılı görüş bildirebilirsiniz.",
  C1: "C1 ileri seviyedir. Uzun ve karmaşık metinleri anlayabilir, akıcı ve spontan konuşabilirsiniz. Akademik ve profesyonel ortamlarda etkili iletişim kurabilirsiniz.",
  C2: "C2 uzman seviyedir. Dili neredeyse anadil düzeyinde kullanabilirsiniz. Karmaşık akademik ve profesyonel metinleri tam olarak anlayabilir, nüanslı ifadeler kullanabilirsiniz.",
}

const getDiagnosis = (level: Level, score: number, total: number): { title: string; message: string; suggestion: string } => {
  const percentage = (score / total) * 100
  
  if (percentage === 100) {
    return {
      title: "Mükemmel Performans!",
      message: `${level} seviyesindeki tüm soruları doğru cevapladınız. Bu seviyeye hakimsiniz!`,
      suggestion: "Bir üst seviyeyi deneyerek kendinizi daha da zorlayabilirsiniz."
    }
  } else if (percentage >= 80) {
    return {
      title: "Çok İyi!",
      message: `${level} seviyesinde güçlü bir performans gösterdiniz.`,
      suggestion: "Küçük eksiklerinizi kapatarak bu seviyeyi pekiştirebilirsiniz."
    }
  } else if (percentage >= 60) {
    return {
      title: "İyi Yoldasınız!",
      message: `${level} seviyesinde temel konulara hakimsiniz ancak bazı konularda pratik yapmanız gerekiyor.`,
      suggestion: "Hedefli çalışma ile kısa sürede bu seviyeyi tamamlayabilirsiniz."
    }
  } else if (percentage >= 40) {
    return {
      title: "Gelişim Alanı Mevcut",
      message: `${level} seviyesinde bazı temel konularda eksikleriniz var.`,
      suggestion: "Bu seviyenin temel gramer kurallarını tekrar etmenizi öneririm."
    }
  } else {
    return {
      title: "Pratik Gerekli",
      message: `${level} seviyesi şu an için biraz zorlayıcı görünüyor.`,
      suggestion: "Bir alt seviyeden başlayarak temellerinizi güçlendirmenizi öneririm."
    }
  }
}

const quizQuestions = [
  // Combine all questions from different levels into one array
  ...questionsByLevel.A1,
  ...questionsByLevel.A2,
  ...questionsByLevel.B1,
  ...questionsByLevel.B2,
  ...questionsByLevel.C1,
  ...questionsByLevel.C2,
]

export function InteractiveExercise() {
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [randomQuestions, setRandomQuestions] = useState<Question[]>([])
  const [copied, setCopied] = useState(false)
  const [round, setRound] = useState(1)
  const [totalScore, setTotalScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<number>>(new Set())

  // Randomly select 10 questions when level is selected (avoiding used questions)
  useEffect(() => {
    if (selectedLevel) {
      const levelQuestions = questionsByLevel[selectedLevel]
      const availableQuestions = levelQuestions.filter(q => !usedQuestionIds.has(q.id))
      
      // If not enough questions, reset used questions
      const QUESTIONS_PER_ROUND = 10
      if (availableQuestions.length < QUESTIONS_PER_ROUND) {
        setUsedQuestionIds(new Set())
        const shuffled = [...levelQuestions].sort(() => Math.random() - 0.5)
        setRandomQuestions(shuffled.slice(0, QUESTIONS_PER_ROUND))
      } else {
        const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5)
        setRandomQuestions(shuffled.slice(0, QUESTIONS_PER_ROUND))
      }
    }
  }, [selectedLevel, round])

  const handleAnswerSelect = (index: number) => {
    if (showResult) return
    setSelectedAnswer(index)
  }

  const handleCheckAnswer = () => {
  if (selectedAnswer === null) return
  setShowResult(true)
  const isCorrect = selectedAnswer === randomQuestions[currentQuestion].correct
  playSoundEffect(isCorrect ? "correct" : "wrong")
  if (isCorrect) {
  setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < randomQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
  setQuizCompleted(true)
  playSoundEffect("complete")
  const isPerfect = score === randomQuestions.length
  const updated = addXp(isPerfect ? XP_REWARDS.exam_perfect : XP_REWARDS.exam_complete, "exam")
  if (isPerfect) markPerfectScore()
  checkAndUnlockAchievements(updated)
  }
  }

  const handleRestart = () => {
    // Mark current questions as used
    const newUsedIds = new Set(usedQuestionIds)
    for (const q of randomQuestions) {
      newUsedIds.add(q.id)
    }
    setUsedQuestionIds(newUsedIds)
    
    // Update totals
    setTotalScore(prev => prev + score)
    setTotalQuestions(prev => prev + randomQuestions.length)
    setRound(prev => prev + 1)
    
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setQuizCompleted(false)
  }

  const handleChangeLevel = () => {
    setSelectedLevel(null)
    setRandomQuestions([])
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setQuizCompleted(false)
    setCopied(false)
    setRound(1)
    setTotalScore(0)
    setTotalQuestions(0)
    setUsedQuestionIds(new Set())
  }

  const shareResult = async () => {
    if (!selectedLevel) return
    
    const percentage = Math.round((score / randomQuestions.length) * 100)
    const text = `${selectedLevel} seviyesinde ${randomQuestions.length} sorudan ${score} doğru yaptım (%${percentage})! Sen de seviyeni ölç:`
    const url = typeof window !== "undefined" ? `${window.location.origin}/#seviye-testi` : ""
    
    if (navigator.share) {
      try {
        await navigator.share({ title: "Seviye Testi Sonucum", text, url })
      } catch {
        // User cancelled
      }
    } else {
      const fullText = `${text}\n${url}`
      await navigator.clipboard.writeText(fullText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const question = randomQuestions[currentQuestion]
  const isCorrect = selectedAnswer === question?.correct

  return (
    <section id="seviye-testi" className="py-24 md:py-32 scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-4">Mini Quiz</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4 tracking-tight">
              Seviyenizi Test Edin
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
              10 soruluk kapsamlı bir quiz ile gramer bilginizi ölçün
            </p>
          </div>

          {/* Quiz Card */}
          <Card className="border border-border/50 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 rounded-lg">
            <CardContent className="p-6 md:p-8">
              {/* Level Selection */}
              {!selectedLevel ? (
                <div className="text-center py-6 animate-in fade-in zoom-in duration-500">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-muted mb-6">
                    <GraduationCap className="w-7 h-7 text-muted-foreground" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl mb-2">Seviyenizi Seçin</h3>
                  <p className="text-muted-foreground text-sm mb-8">
                    Kendinize en uygun seviyeyi seçin ve başlayın
                  </p>
                  
                  <div className="max-w-xs mx-auto mb-6">
                    <Select onValueChange={(value) => setSelectedLevel(value as Level)}>
                      <SelectTrigger className="w-full h-12 text-base border border-border/60 rounded-lg">
                        <SelectValue placeholder="Seviye seçin..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A1">A1 - Başlangıç</SelectItem>
                        <SelectItem value="A2">A2 - Temel</SelectItem>
                        <SelectItem value="B1">B1 - Orta</SelectItem>
                        <SelectItem value="B2">B2 - Orta Üstü</SelectItem>
                        <SelectItem value="C1">C1 - İleri</SelectItem>
                        <SelectItem value="C2">C2 - Uzman</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Seviyenizi bilmiyor musunuz?{" "}
                    <Link href="/demo-ders" className="text-primary hover:underline font-medium">
                      Ücretsiz demo derste belirleyelim
                    </Link>
                  </p>
                </div>
              ) : !quizCompleted ? (
                <>
                  {/* Level badge and Progress */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-sm font-medium">
                        {selectedLevel} - {levelDescriptions[selectedLevel]}
                      </span>
                      <button 
                        onClick={handleChangeLevel}
                        className="text-xs text-muted-foreground hover:text-foreground underline"
                      >
                        Değiştir
                      </button>
                    </div>
                    <span className="text-sm font-medium text-secondary">
                      Puan: {score}
                    </span>
                  </div>
                  {/* Patika Snow Path Progress */}
                  <QuizHeader
                    title={`${selectedLevel} Seviye Testi`}
                    current={currentQuestion + 1}
                    total={randomQuestions.length}
                    lastAnswerCorrect={showResult ? (selectedAnswer === question?.correct) : null}
                  />

                  {/* Question */}
                  <h3 className="text-xl md:text-2xl font-medium mb-6 text-center">
                    {question?.question}
                  </h3>

                  {/* Options */}
                  <div className="grid gap-3 mb-6">
                    {question?.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={showResult}
                        className={cn(
                          "w-full p-4 rounded-xl border-2 text-left transition-all duration-200",
                          selectedAnswer === index && !showResult && "border-secondary bg-secondary/10",
                          selectedAnswer !== index && !showResult && "border-border hover:border-secondary/50 hover:bg-muted/50",
                          showResult && index === question.correct && "border-green-500 bg-green-50 text-green-700",
                          showResult && selectedAnswer === index && index !== question.correct && "border-red-500 bg-red-50 text-red-700",
                          showResult && selectedAnswer !== index && index !== question.correct && "opacity-50"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{option}</span>
                          {showResult && index === question.correct && (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          )}
                          {showResult && selectedAnswer === index && index !== question.correct && (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Explanation */}
                  {showResult && (
                    <div className={cn(
                      "p-4 rounded-xl mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300",
                      isCorrect ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"
                    )}>
                      <p className={cn(
                        "text-sm",
                        isCorrect ? "text-green-700" : "text-amber-700"
                      )}>
                        {isCorrect ? "Harika! " : ""}
                        {question?.explanation}
                      </p>
                    </div>
                  )}

                  {/* Action Button */}
                  {!showResult ? (
                    <Button
                      onClick={handleCheckAnswer}
                      disabled={selectedAnswer === null}
                      className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                      size="lg"
                    >
                      Cevabı Kontrol Et
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNextQuestion}
                      className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                      size="lg"
                    >
                      {currentQuestion < randomQuestions.length - 1 ? "Sonraki Soru" : "Sonucu Gör"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </>
              ) : (
                /* Results */
                <div className="py-4 animate-in fade-in zoom-in duration-500">
                  {/* Round info */}
                  {round > 1 && (
                    <div className="text-center mb-4 text-sm text-muted-foreground">
                      <span className="font-medium">Tur {round}</span> | Toplam: {totalScore + score}/{totalQuestions + randomQuestions.length} doğru
                    </div>
                  )}
                  
                  {/* Score Display */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary/20 mb-4">
                      <Trophy className="w-10 h-10 text-secondary" />
                    </div>
                    <h3 className="font-serif text-2xl md:text-3xl mb-2">
                      {getDiagnosis(selectedLevel, score, randomQuestions.length).title}
                    </h3>
                    <p className="text-lg text-muted-foreground">
                      Bu turda {randomQuestions.length} sorudan <span className="font-bold text-secondary">{score}</span> doğru
                    </p>
                    <div className="flex justify-center gap-1 mt-3">
                      {Array.from({ length: randomQuestions.length }).map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-8 h-2 rounded-full",
                            i < score ? "bg-green-500" : "bg-red-300"
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Level Info Card */}
                  <div className="bg-muted/50 rounded-xl p-5 mb-6 text-left">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-sm font-semibold">
                        {selectedLevel}
                      </span>
                      <span className="font-medium text-foreground">
                        {levelDescriptions[selectedLevel]} Seviye
                      </span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {questionsByLevel[selectedLevel].length - usedQuestionIds.size - randomQuestions.length} soru kaldı
                      </span>
                    </div>
                    
                    {/* Diagnosis */}
                    <div className="border-t border-border pt-4 mt-4">
                      <h4 className="font-medium text-foreground mb-2">Değerlendirme</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {getDiagnosis(selectedLevel, score, randomQuestions.length).message}
                      </p>
                      <p className="text-sm text-primary font-medium">
                        {getDiagnosis(selectedLevel, score, randomQuestions.length).suggestion}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {/* Continue button - main action */}
                    <Button
                      onClick={handleRestart}
                      className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Devam Et ({questionsByLevel[selectedLevel].length - usedQuestionIds.size - randomQuestions.length > 0 ? "Yeni Sorular" : "Baştan"})
                    </Button>
                    
                    <div className="pt-3 border-t border-border/50">
                      <ShareChallenge
                        title={`${selectedLevel} Seviye Testi Sonucum`}
                        scoreText={`${selectedLevel} seviyesinde %${Math.round((score / randomQuestions.length) * 100)} başarı! ${score}/${randomQuestions.length} doğru.`}
                        challengeText="İngilizce seviyeni ölç, beni geçebilir misin?"
                        toolSlug="level-test"
                        challengeScore={score}
                        challengeTotal={randomQuestions.length}
                      />
                    </div>
                    
                    <div className="flex gap-3 justify-center">
                      <Button
                        onClick={handleChangeLevel}
                        variant="outline"
                        className="flex-1 border-2 bg-transparent"
                      >
                        <GraduationCap className="w-4 h-4 mr-2" />
                        Seviye Değiştir
                      </Button>
                      <Button
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                        asChild
                      >
                        <Link href="/demo-ders" scroll={true}>
                          Demo Ders
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
