"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, RotateCcw, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { addXp, checkAndUnlockAchievements, XP_REWARDS } from "@/lib/xp-system"
import { showXpToast, showAchievementToast, playSoundEffect } from "@/components/xp-toast"
import { ShareChallenge } from "@/components/share-challenge"
import { QuizHeader } from "@/components/quiz-header"

interface ErrorQ {
  id: number
  words: string[]
  errorIndex: number
  correction: string
  explanation: string
}

const questions: ErrorQ[] = [
  { id: 1, words: ["She", "don't", "like", "chocolate."], errorIndex: 1, correction: "doesn't", explanation: "3. tekil şahıs (she) için 'doesn't' kullanılır, 'don't' değil." },
  { id: 2, words: ["He", "has", "went", "to", "the", "store."], errorIndex: 2, correction: "gone", explanation: "'Has' ile Present Perfect kullanılır: has gone (V3)." },
  { id: 3, words: ["They", "was", "playing", "football", "yesterday."], errorIndex: 1, correction: "were", explanation: "'They' çoğul özne ile 'were' kullanılır, 'was' değil." },
  { id: 4, words: ["I", "have", "been", "to", "Paris", "last", "year."], errorIndex: 2, correction: "(remove - use 'went')", explanation: "'Last year' belirli geçmiş zaman ifadesi olduğu için Present Perfect değil Simple Past kullanılır: 'I went to Paris last year.'" },
  { id: 5, words: ["She", "is", "more", "taller", "than", "her", "sister."], errorIndex: 2, correction: "(remove)", explanation: "'Taller' zaten karşılaştırma halidir, 'more' gereksizdir." },
  { id: 6, words: ["If", "I", "will", "see", "him,", "I'll", "tell", "him."], errorIndex: 2, correction: "see (remove will)", explanation: "First conditional: If + Simple Present. 'If I see him...' doğrudur." },
  { id: 7, words: ["He", "suggested", "me", "to", "go", "home."], errorIndex: 2, correction: "that I", explanation: "'Suggest' fiilinden sonra 'suggest that someone (should)...' kullanılır." },
  { id: 8, words: ["The", "informations", "is", "very", "useful."], errorIndex: 1, correction: "information", explanation: "'Information' sayılamaz bir isimdir, çoğul eki almaz." },
  { id: 9, words: ["She", "enjoys", "to", "swim", "every", "morning."], errorIndex: 2, correction: "swimming", explanation: "'Enjoy' fiilinden sonra gerund (-ing) kullanılır: enjoys swimming." },
  { id: 10, words: ["I'm", "used", "to", "wake", "up", "early."], errorIndex: 3, correction: "waking", explanation: "'Be used to' + gerund: I'm used to waking up early." },
  { id: 11, words: ["He", "made", "me", "to", "do", "the", "work."], errorIndex: 3, correction: "(remove to)", explanation: "'Make someone do' yapısında 'to' kullanılmaz." },
  { id: 12, words: ["Despite", "of", "the", "rain,", "we", "went", "out."], errorIndex: 1, correction: "(remove of)", explanation: "'Despite' tek başına kullanılır. 'In spite of' ile karıştırılır." },
  { id: 13, words: ["Each", "of", "the", "students", "have", "a", "book."], errorIndex: 4, correction: "has", explanation: "'Each' tekil anlam taşır, tekil fiil (has) gerektirir." },
  { id: 14, words: ["Neither", "Tom", "nor", "his", "friends", "was", "there."], errorIndex: 5, correction: "were", explanation: "'Neither...nor' ile fiil, yakın özneye (friends - çoğul) uyar: were." },
  { id: 15, words: ["I", "wish", "I", "can", "speak", "French."], errorIndex: 3, correction: "could", explanation: "'I wish' ile şimdiki zaman dileği için past tense kullanılır: could." },
  { id: 16, words: ["The", "news", "are", "shocking", "today."], errorIndex: 2, correction: "is", explanation: "'News' gramer olarak tekildir: The news is shocking." },
  { id: 17, words: ["She", "asked", "me", "where", "did", "I", "live."], errorIndex: 4, correction: "I lived (remove did)", explanation: "Dolaylı soruda devrik yapı kullanılmaz: where I lived." },
  { id: 18, words: ["He", "is", "enough", "old", "to", "drive."], errorIndex: 2, correction: "old enough", explanation: "'Enough' sıfattan sonra gelir: old enough to drive." },
  { id: 19, words: ["I", "look", "forward", "to", "hear", "from", "you."], errorIndex: 4, correction: "hearing", explanation: "'Look forward to' + gerund: look forward to hearing." },
  { id: 20, words: ["He", "told", "that", "he", "was", "tired."], errorIndex: 2, correction: "me/us (add object)", explanation: "'Tell' dolaylı nesne gerektirir: He told me that..." },
  { id: 21, words: ["She", "is", "married", "with", "a", "doctor."], errorIndex: 3, correction: "to", explanation: "'Married to' doğru preposition: married to a doctor." },
  { id: 22, words: ["I", "prefer", "tea", "than", "coffee."], errorIndex: 3, correction: "to", explanation: "'Prefer' ile 'to' kullanılır: prefer tea to coffee." },
  { id: 23, words: ["We", "discussed", "about", "the", "problem."], errorIndex: 2, correction: "(remove about)", explanation: "'Discuss' geçişli fiildir, 'about' gerekmez: discussed the problem." },
  { id: 24, words: ["He", "explained", "me", "the", "answer."], errorIndex: 2, correction: "to me", explanation: "'Explain' + to + person: explained the answer to me." },
  { id: 25, words: ["The", "furnitures", "in", "this", "room", "are", "old."], errorIndex: 1, correction: "furniture", explanation: "'Furniture' sayılamaz isimdir, çoğul eki almaz." },
  { id: 26, words: ["She", "has", "been", "working", "since", "three", "hours."], errorIndex: 4, correction: "for", explanation: "Süre bildirmek için 'for' kullanılır, 'since' belirli zaman noktası için." },
  { id: 27, words: ["I", "am", "agree", "with", "you."], errorIndex: 2, correction: "(remove am)", explanation: "'Agree' bir fiildir, 'be' ile kullanılmaz: I agree with you." },
  { id: 28, words: ["He", "denied", "to", "help", "us."], errorIndex: 2, correction: "helping", explanation: "'Deny' + gerund: denied helping us." },
  { id: 29, words: ["I", "have", "less", "friends", "than", "my", "brother."], errorIndex: 2, correction: "fewer", explanation: "'Fewer' sayılabilir isimlerle, 'less' sayılamaz isimlerle kullanılır." },
  { id: 30, words: ["She", "said", "me", "that", "she", "was", "busy."], errorIndex: 1, correction: "told", explanation: "'Say' dolaylı nesne almaz. 'Tell' + nesne: She told me that..." },
  { id: 31, words: ["The", "police", "is", "investigating", "the", "case."], errorIndex: 2, correction: "are", explanation: "'Police' daima çoğul fiil alır: The police are investigating." },
  { id: 32, words: ["He", "avoided", "to", "answer", "the", "question."], errorIndex: 2, correction: "answering", explanation: "'Avoid' + gerund: avoided answering." },
  { id: 33, words: ["She", "is", "too", "much", "beautiful."], errorIndex: 2, correction: "very (remove too much)", explanation: "'Too much' sıfatlarla kullanılmaz. 'Very' veya 'extremely' doğrudur." },
  { id: 34, words: ["I", "have", "been", "living", "here", "for", "2010."], errorIndex: 5, correction: "since", explanation: "Belirli bir yıl/tarih için 'since' kullanılır, 'for' süre bildirir." },
  { id: 35, words: ["He", "suggested", "to", "go", "to", "the", "cinema."], errorIndex: 2, correction: "going", explanation: "'Suggest' + gerund: suggested going. 'To + V' yapısı yanlıştır." },
  { id: 36, words: ["She", "has", "a", "ten-years-old", "daughter."], errorIndex: 3, correction: "ten-year-old", explanation: "Bileşik sıfatlarda isim tekil kalır: a ten-year-old daughter." },
  { id: 37, words: ["I", "couldn't", "find", "my", "keys", "nowhere."], errorIndex: 5, correction: "anywhere", explanation: "Çifte olumsuzluk yoktur. 'Couldn't' + 'anywhere' doğrudur." },
  { id: 38, words: ["The", "teacher", "let", "us", "to", "leave", "early."], errorIndex: 4, correction: "(remove to)", explanation: "'Let' + object + bare infinitive: let us leave." },
  { id: 39, words: ["He", "is", "interesting", "in", "history."], errorIndex: 2, correction: "interested", explanation: "'Interested in' - kişi için '-ed' soneki kullanılır, '-ing' değil." },
  { id: 40, words: ["I", "must", "to", "finish", "my", "homework."], errorIndex: 2, correction: "(remove to)", explanation: "Modal fiillerden sonra 'to' kullanılmaz: I must finish." },
  { id: 41, words: ["He", "is", "more", "better", "than", "me."], errorIndex: 2, correction: "(remove more)", explanation: "'Better' zaten karşılaştırma halidir, 'more' gereksizdir." },
  { id: 42, words: ["She", "can", "to", "swim", "very", "well."], errorIndex: 2, correction: "(remove to)", explanation: "Modal 'can' sonrası 'to' kullanılmaz: She can swim." },
  { id: 43, words: ["We", "have", "been", "here", "since", "two", "hours."], errorIndex: 4, correction: "for", explanation: "Süre bildirmek için 'for' kullanılır, 'since' belirli bir zaman noktası içindir." },
  { id: 44, words: ["The", "children", "was", "excited", "about", "the", "trip."], errorIndex: 2, correction: "were", explanation: "'Children' çoğul özne olduğu için 'were' kullanılır." },
  { id: 45, words: ["I", "am", "knowing", "the", "answer."], errorIndex: 2, correction: "know", explanation: "'Know' durum fiilidir, continuous yapıda kullanılmaz: I know." },
  { id: 46, words: ["She", "has", "went", "to", "the", "supermarket."], errorIndex: 2, correction: "gone", explanation: "Present Perfect: has + V3. 'went' değil 'gone' kullanılır." },
  { id: 47, words: ["He", "speaks", "English", "very", "good."], errorIndex: 4, correction: "well", explanation: "Fiili nitelendirmek için zarf gerekir: speaks well (iyi konuşur)." },
  { id: 48, words: ["I", "have", "seen", "him", "yesterday."], errorIndex: 4, correction: "(remove - use saw)", explanation: "'Yesterday' geçmiş zaman zarfıdır, Present Perfect ile kullanılmaz." },
  { id: 49, words: ["She", "is", "afraid", "from", "spiders."], errorIndex: 3, correction: "of", explanation: "'Afraid of' doğru preposition'dır, 'from' değil." },
  { id: 50, words: ["They", "suggested", "us", "to", "go", "home."], errorIndex: 2, correction: "that we", explanation: "'Suggest that someone (should)...' yapısı kullanılır, 'suggest someone to' yanlıştır." },
  { id: 51, words: ["He", "prevented", "me", "to", "enter", "the", "room."], errorIndex: 3, correction: "from entering", explanation: "'Prevent someone from doing' doğru yapıdır." },
  { id: 52, words: ["The", "advice", "he", "gave", "were", "useful."], errorIndex: 4, correction: "was", explanation: "'Advice' sayılamaz isimdir, tekil fiil alır: was useful." },
  { id: 53, words: ["She", "insisted", "to", "pay", "the", "bill."], errorIndex: 2, correction: "on paying", explanation: "'Insist on doing' doğru yapıdır, 'insist to do' yanlıştır." },
  { id: 54, words: ["Despite", "he", "was", "tired,", "he", "continued."], errorIndex: 1, correction: "being (remove he was)", explanation: "'Despite' + noun/gerund: Despite being tired." },
  { id: 55, words: ["I", "prefer", "reading", "than", "watching", "TV."], errorIndex: 3, correction: "to", explanation: "'Prefer doing to doing' yapısı kullanılır, 'than' değil." },
  { id: 56, words: ["She", "said", "me", "that", "she", "was", "busy."], errorIndex: 1, correction: "told", explanation: "'Say' nesne almaz direkt, 'told me' kullanılır." },
  { id: 57, words: ["I", "look", "forward", "to", "hear", "from", "you."], errorIndex: 4, correction: "hearing", explanation: "'Look forward to + gerund': hearing kullanılır." },
  { id: 58, words: ["He", "suggested", "me", "to", "apply", "for", "the", "job."], errorIndex: 2, correction: "that I", explanation: "'Suggest that someone (should)' yapısı doğrudur." },
  { id: 59, words: ["The", "news", "were", "shocking", "for", "everyone."], errorIndex: 2, correction: "was", explanation: "'News' sayılamaz isimdir, tekil fiil alır: was shocking." },
  { id: 60, words: ["She", "is", "enough", "old", "to", "drive."], errorIndex: 2, correction: "old enough", explanation: "Sıralama 'adjective + enough' şeklinde olmalıdır." },
  { id: 61, words: ["He", "works", "hardly", "every", "single", "day."], errorIndex: 2, correction: "hard", explanation: "'Hard' zarf olarak kullanılır, 'hardly' zorlukla demektir." },
  { id: 62, words: ["I", "used", "to", "swimming", "every", "morning."], errorIndex: 3, correction: "swim", explanation: "'Used to + base verb': used to swim doğrudur." },
  { id: 63, words: ["She", "is", "married", "with", "a", "doctor."], errorIndex: 3, correction: "to", explanation: "'Married to' doğru preposition'dır, 'with' değil." },
  { id: 64, words: ["He", "denied", "to", "steal", "the", "money."], errorIndex: 2, correction: "stealing (remove to)", explanation: "'Deny + gerund' yapısı kullanılır." },
  { id: 65, words: ["They", "discussed", "about", "the", "new", "project."], errorIndex: 2, correction: "(remove about)", explanation: "'Discuss' geçişli fiildir, 'about' almaz." },
  { id: 66, words: ["Each", "students", "must", "submit", "their", "work."], errorIndex: 1, correction: "student", explanation: "'Each' tekil isimle kullanılır: each student." },
  { id: 67, words: ["He", "asked", "where", "was", "the", "station."], errorIndex: 3, correction: "the station was", explanation: "Dolaylı soru: where the station was (düz cümle sırası)." },
  { id: 68, words: ["She", "has", "less", "friends", "than", "her", "sister."], errorIndex: 2, correction: "fewer", explanation: "'Friends' sayılabilir isim, 'fewer' kullanılır." },
  { id: 69, words: ["I", "am", "agree", "with", "your", "opinion."], errorIndex: 2, correction: "(remove am)", explanation: "'Agree' fiildir, 'am agree' yanlıştır. I agree doğru." },
  { id: 70, words: ["He", "made", "me", "to", "clean", "the", "room."], errorIndex: 3, correction: "(remove to)", explanation: "'Make someone + base verb': to kullanılmaz." },
  { id: 71, words: ["She", "is", "boring", "of", "the", "class."], errorIndex: 2, correction: "bored", explanation: "'Bored of' sıkılmış demek, 'boring' sıkıcı demek." },
  { id: 72, words: ["We", "went", "to", "home", "after", "the", "party."], errorIndex: 3, correction: "(remove to)", explanation: "'Go home' yapısında 'to' kullanılmaz." },
  { id: 73, words: ["The", "police", "is", "investigating", "the", "crime."], errorIndex: 2, correction: "are", explanation: "'Police' çoğul isimdir, 'are investigating' kullanılır." },
  { id: 74, words: ["He", "explained", "me", "the", "problem", "clearly."], errorIndex: 2, correction: "to me", explanation: "'Explain to someone' yapısı doğrudur." },
  { id: 75, words: ["She", "stopped", "to", "smoke", "last", "year."], errorIndex: 2, correction: "smoking", explanation: "'Stop + gerund' (bırakmak), 'stop to' (durup yapmak)." },
  { id: 76, words: ["I", "have", "been", "living", "here", "from", "2010."], errorIndex: 5, correction: "since", explanation: "Belirli bir yıl için 'since' kullanılır, 'from' değil." },
  { id: 77, words: ["He", "is", "the", "most", "tallest", "in", "class."], errorIndex: 3, correction: "(remove most)", explanation: "'Tallest' zaten en üstünlük derecesidir, 'most' gereksiz." },
  { id: 78, words: ["She", "doesn't", "know", "nothing", "about", "it."], errorIndex: 3, correction: "anything", explanation: "Çifte olumsuzluk yanlıştır: doesn't know anything." },
  { id: 79, words: ["I", "wish", "I", "can", "speak", "French", "fluently."], errorIndex: 3, correction: "could", explanation: "'Wish + past tense': I wish I could speak." },
  { id: 80, words: ["He", "is", "too", "much", "tired", "to", "work."], errorIndex: 3, correction: "(remove much)", explanation: "'Too tired' doğrudur, 'too much' sıfattan önce kullanılmaz." },
  { id: 81, words: ["They", "are", "planning", "to", "went", "abroad."], errorIndex: 4, correction: "go", explanation: "'To + base verb': to go doğru yapıdır." },
  { id: 82, words: ["She", "gave", "to", "him", "a", "present."], errorIndex: 2, correction: "(remove to) or 'gave a present to him'", explanation: "'Give someone something' veya 'give something to someone'." },
  { id: 83, words: ["The", "furnitures", "in", "the", "room", "are", "old."], errorIndex: 1, correction: "furniture", explanation: "'Furniture' sayılamaz isimdir, çoğul yapılmaz." },
  { id: 84, words: ["He", "apologized", "for", "to", "arrive", "late."], errorIndex: 3, correction: "arriving (remove to)", explanation: "'Apologize for + gerund': for arriving late." },
  { id: 85, words: ["She", "is", "interested", "for", "learning", "Korean."], errorIndex: 3, correction: "in", explanation: "'Interested in' doğru preposition'dır." },
  { id: 86, words: ["I", "have", "a", "work", "to", "finish."], errorIndex: 3, correction: "piece of work / job / task", explanation: "'Work' sayılamaz isimdir, 'a work' yanlıştır." },
  { id: 87, words: ["They", "are", "waiting", "since", "two", "hours."], errorIndex: 3, correction: "for", explanation: "Süre bildirmek için 'for' kullanılır." },
  { id: 88, words: ["He", "said", "that", "he", "will", "come", "tomorrow."], errorIndex: 4, correction: "would", explanation: "Reported speech: will -> would." },
  { id: 89, words: ["She", "succeeded", "to", "pass", "the", "exam."], errorIndex: 2, correction: "in passing (remove to)", explanation: "'Succeed in + gerund' doğru yapıdır." },
  { id: 90, words: ["The", "informations", "you", "gave", "were", "useful."], errorIndex: 1, correction: "information", explanation: "'Information' sayılamaz isimdir, çoğul yapılmaz." },
  { id: 91, words: ["He", "accused", "me", "for", "stealing", "his", "pen."], errorIndex: 3, correction: "of", explanation: "'Accuse someone of' doğru preposition'dır." },
  { id: 92, words: ["She", "managed", "passing", "the", "driving", "test."], errorIndex: 2, correction: "to pass", explanation: "'Manage to + infinitive' doğru yapıdır." },
  { id: 93, words: ["I", "am", "looking", "forward", "to", "meet", "you."], errorIndex: 5, correction: "meeting", explanation: "'Look forward to + gerund': to meeting." },
  { id: 94, words: ["The", "teacher", "let", "us", "to", "go", "early."], errorIndex: 4, correction: "(remove to)", explanation: "'Let someone + base verb': to kullanılmaz." },
  { id: 95, words: ["He", "spends", "a", "lot", "of", "moneys."], errorIndex: 5, correction: "money", explanation: "'Money' sayılamaz isimdir, çoğul yapılmaz." },
  { id: 96, words: ["She", "is", "capable", "to", "do", "the", "job."], errorIndex: 3, correction: "of doing", explanation: "'Capable of + gerund' doğru yapıdır." },
  { id: 97, words: ["I", "would", "rather", "to", "stay", "home."], errorIndex: 3, correction: "(remove to)", explanation: "'Would rather + base verb': to kullanılmaz." },
  { id: 98, words: ["He", "prevented", "me", "to", "leave", "the", "building."], errorIndex: 3, correction: "from leaving", explanation: "'Prevent someone from + gerund' doğru yapıdır." },
  { id: 99, words: ["She", "enjoys", "to", "read", "novels."], errorIndex: 2, correction: "reading (remove to)", explanation: "'Enjoy + gerund' yapısı kullanılır." },
  { id: 100, words: ["It", "depends", "of", "the", "weather."], errorIndex: 2, correction: "on", explanation: "'Depend on' doğru preposition'dır." },
  { id: 101, words: ["He", "borrowed", "me", "his", "car."], errorIndex: 1, correction: "lent", explanation: "'Lend someone something': lent me his car." },
  { id: 102, words: ["She", "is", "used", "to", "get", "up", "early."], errorIndex: 4, correction: "getting", explanation: "'Be used to + gerund': to getting up early." },
  { id: 103, words: ["I", "couldn't", "help", "but", "to", "laugh."], errorIndex: 4, correction: "(remove to)", explanation: "'Couldn't help but + base verb': to kullanılmaz." },
  { id: 104, words: ["The", "majority", "of", "students", "agrees."], errorIndex: 4, correction: "agree", explanation: "'The majority of students' çoğul özne: agree kullanılır." },
  { id: 105, words: ["He", "robbed", "my", "wallet", "at", "the", "station."], errorIndex: 1, correction: "stole", explanation: "'Rob a person/place', 'steal an object': stole my wallet." },
  { id: 106, words: ["She", "couldn't", "cope", "to", "the", "stress."], errorIndex: 3, correction: "with", explanation: "'Cope with' doğru preposition'dır." },
  { id: 107, words: ["The", "luggage", "are", "too", "heavy."], errorIndex: 2, correction: "is", explanation: "'Luggage' sayılamaz isimdir, tekil fiil alır." },
  { id: 108, words: ["I", "met", "him", "two", "years", "before."], errorIndex: 5, correction: "ago", explanation: "Geçmiş zaman: 'two years ago', 'before' past perfect ile kullanılır." },
  { id: 109, words: ["He", "admitted", "to", "be", "wrong."], errorIndex: 3, correction: "being", explanation: "'Admit to + gerund' veya 'admit + gerund' doğrudur." },
  { id: 110, words: ["She", "is", "very", "annoying", "with", "the", "noise."], errorIndex: 3, correction: "annoyed", explanation: "'Annoyed' (kişinin hissi), 'annoying' (rahatsız eden şey)." },
]

const QS_PER_SET = 7

export function ErrorSpotting() {
  const [currentQ, setCurrentQ] = useState(0)
  const [selectedWord, setSelectedWord] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [activeQs, setActiveQs] = useState<ErrorQ[]>([])
  const [answers, setAnswers] = useState<boolean[]>([])
  const [currentSet, setCurrentSet] = useState(1)
  const [totalScore, setTotalScore] = useState(0)
  const [totalQs, setTotalQs] = useState(0)

  useEffect(() => { loadNewSet() }, [])

  const loadNewSet = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, QS_PER_SET)
    setActiveQs(shuffled)
    setCurrentQ(0)
    setSelectedWord(null)
    setShowResult(false)
    setScore(0)
    setFinished(false)
    setAnswers([])
  }

  const handleWordClick = (idx: number) => {
    if (showResult) return
    setSelectedWord(idx)
  setShowResult(true)
  const isCorrect = idx === activeQs[currentQ].errorIndex
  playSoundEffect(isCorrect ? "correct" : "wrong")
  if (isCorrect) {
      setScore(s => s + 1)
      const progress = addXp(XP_REWARDS.error_spot_correct, "error_spotting")
      showXpToast(XP_REWARDS.error_spot_correct, "Hatayı buldun!")
      const newA = checkAndUnlockAchievements(progress)
      for (const a of newA) showAchievementToast(a)
    }
    setAnswers(prev => [...prev, isCorrect])
  }

  const handleNext = () => {
    if (currentQ < activeQs.length - 1) {
      setCurrentQ(q => q + 1)
      setSelectedWord(null)
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

  if (finished) {
    const pct = Math.round((score / activeQs.length) * 100)
    return (
      <Card className="border border-border/50 overflow-hidden rounded-lg">
        <div className="h-1.5 bg-muted"><div className="h-full bg-gradient-to-r from-rose-400 to-red-500 w-full" /></div>
        <CardContent className="p-6 text-center">
          {currentSet > 1 && <p className="text-sm text-muted-foreground mb-2">Set {currentSet} | Toplam: {totalScore + score}/{totalQs + activeQs.length}</p>}
          <div className={cn("w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center", pct >= 80 ? "bg-emerald-100" : pct >= 50 ? "bg-amber-100" : "bg-red-100")}>
            <span className={cn("text-2xl font-bold", pct >= 80 ? "text-emerald-600" : pct >= 50 ? "text-amber-600" : "text-red-600")}>%{pct}</span>
          </div>
          <h4 className="font-serif text-xl mb-2">{pct >= 80 ? "Keskin göz!" : pct >= 50 ? "Fena değil!" : "Daha dikkatli!"}</h4>
          <div className="flex justify-center gap-1 mb-4">
            {answers.map((c, i) => <div key={i} className={cn("w-6 h-2 rounded-full", c ? "bg-emerald-400" : "bg-red-300")} />)}
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={continueSet} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"><ArrowRight className="w-4 h-4 mr-2" />Sonraki Set</Button>
            <Button onClick={() => { setCurrentSet(1); setTotalScore(0); setTotalQs(0); loadNewSet() }} variant="outline" className="w-full bg-transparent">              <RotateCcw className="w-4 h-4 mr-2" />Sıfırla</Button>
          </div>
          <div className="mt-4 pt-4 border-t border-border/50">
            <ShareChallenge
              title="Hata Bul Sonucum"
              scoreText={`Hata Bul'da %${pct} başarı! ${score}/${activeQs.length} hatanın yerini buldun.`}
              challengeText="Sen de cümlelerdeki hataları bulabilir misin?"
              toolSlug="error-spotting"
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
      <QuizHeader title="Hata Bul" current={currentQ + 1} total={activeQs.length} lastAnswerCorrect={showResult ? selectedWord === activeQs[currentQ]?.errorIndex : null} />

      <Card className="border border-border/50 mb-3 rounded-lg">
        <CardContent className="p-5">
          <p className="text-sm text-muted-foreground mb-3">Cümlede yanlışlık olan kelimeye tıklayın:</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {q.words.map((word, i) => {
              const isError = i === q.errorIndex
              const isSelected = selectedWord === i
              return (
                <button
                  key={i}
                  onClick={() => handleWordClick(i)}
                  disabled={showResult}
                  className={cn(
                    "px-3 py-2 rounded-lg text-base font-medium transition-all border-2",
                    // Before answer
                    !showResult && "border-border hover:border-rose-300 hover:bg-rose-50/50 active:scale-95 cursor-pointer",
                    // Correct answer shown
                    showResult && isError && "bg-red-100 border-red-400 text-red-700 line-through decoration-2",
                    // User selected wrong word
                    showResult && isSelected && !isError && "bg-amber-100 border-amber-400 text-amber-700",
                    // Other words after result
                    showResult && !isError && !isSelected && "border-transparent opacity-60"
                  )}
                >
                  {word}
                </button>
              )
            })}
          </div>

          {showResult && (
            <div className={cn(
              "p-3 rounded-lg text-sm animate-in fade-in slide-in-from-bottom-2 duration-300",
              selectedWord === q.errorIndex ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
            )}>
              <p className="font-medium mb-1">
                {selectedWord === q.errorIndex ? "Doğru! " : "Yanlış! "}
                <span className="font-normal">
                  {"\"" + q.words[q.errorIndex] + "\""} yerine {"\""}{q.correction}{"\""}
                </span>
              </p>
              <p className="text-muted-foreground">{q.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {showResult && (
        <Button onClick={handleNext} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
          {currentQ < activeQs.length - 1 ? "Sonraki" : "Sonuçlar"} <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      )}
    </div>
  )
}
