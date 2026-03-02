"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, RotateCcw, Volume2, Ear } from "lucide-react"
import { cn } from "@/lib/utils"
import { addXp, checkAndUnlockAchievements, XP_REWARDS } from "@/lib/xp-system"
import { showXpToast, showAchievementToast, playSoundEffect } from "@/components/xp-toast"
import { ShareChallenge } from "@/components/share-challenge"
import { QuizHeader } from "@/components/quiz-header"

interface MinimalPair {
  id: number
  wordA: string
  wordB: string
  ipaA: string
  ipaB: string
  tip: string
}

const pairs: MinimalPair[] = [
  { id: 1, wordA: "ship", wordB: "sheep", ipaA: "/ʃɪp/", ipaB: "/ʃiːp/", tip: "Kısa /ɪ/ vs uzun /iː/ sesi. 'Ship' kısa, 'sheep' uzun." },
  { id: 2, wordA: "bed", wordB: "bad", ipaA: "/bed/", ipaB: "/bæd/", tip: "/e/ vs /æ/ sesi. 'Bed' daha kapalı, 'bad' daha açık ağız." },
  { id: 3, wordA: "sit", wordB: "seat", ipaA: "/sɪt/", ipaB: "/siːt/", tip: "Kısa /ɪ/ vs uzun /iː/. 'Sit' kısa, 'seat' uzun." },
  { id: 4, wordA: "live", wordB: "leave", ipaA: "/lɪv/", ipaB: "/liːv/", tip: "Kısa /ɪ/ vs uzun /iː/. 'Live' kısa, 'leave' uzun." },
  { id: 5, wordA: "bit", wordB: "beat", ipaA: "/bɪt/", ipaB: "/biːt/", tip: "Kısa /ɪ/ vs uzun /iː/." },
  { id: 6, wordA: "pull", wordB: "pool", ipaA: "/pʊl/", ipaB: "/puːl/", tip: "Kısa /ʊ/ vs uzun /uː/." },
  { id: 7, wordA: "cat", wordB: "cut", ipaA: "/kæt/", ipaB: "/kʌt/", tip: "/æ/ vs /ʌ/ sesi. Ağız pozisyonu farklı." },
  { id: 8, wordA: "hat", wordB: "hot", ipaA: "/hæt/", ipaB: "/hɒt/", tip: "/æ/ vs /ɒ/ sesi." },
  { id: 9, wordA: "pen", wordB: "pan", ipaA: "/pen/", ipaB: "/pæn/", tip: "/e/ vs /æ/ sesi." },
  { id: 10, wordA: "full", wordB: "fool", ipaA: "/fʊl/", ipaB: "/fuːl/", tip: "Kısa /ʊ/ vs uzun /uː/." },
  { id: 11, wordA: "think", wordB: "sink", ipaA: "/θɪŋk/", ipaB: "/sɪŋk/", tip: "/θ/ vs /s/ sesi. 'Think' dil dişler arasında." },
  { id: 12, wordA: "three", wordB: "free", ipaA: "/θriː/", ipaB: "/friː/", tip: "/θ/ vs /f/ sesi." },
  { id: 13, wordA: "right", wordB: "light", ipaA: "/raɪt/", ipaB: "/laɪt/", tip: "/r/ vs /l/ sesi. Türkçe'de karşıtlığı olmayan zor çift." },
  { id: 14, wordA: "rice", wordB: "lice", ipaA: "/raɪs/", ipaB: "/laɪs/", tip: "/r/ vs /l/ sesi." },
  { id: 15, wordA: "van", wordB: "ban", ipaA: "/væn/", ipaB: "/bæn/", tip: "/v/ vs /b/ sesi. Dudak ve diş pozisyonu farkı." },
  { id: 16, wordA: "wet", wordB: "vet", ipaA: "/wet/", ipaB: "/vet/", tip: "/w/ vs /v/ sesi." },
  { id: 17, wordA: "bat", wordB: "pat", ipaA: "/bæt/", ipaB: "/pæt/", tip: "/b/ vs /p/ sesi. Titreşimli vs titreşimsiz." },
  { id: 18, wordA: "den", wordB: "then", ipaA: "/den/", ipaB: "/ðen/", tip: "/d/ vs /ð/ sesi. 'Then' dil dişler arasında." },
  { id: 19, wordA: "sing", wordB: "thing", ipaA: "/sɪŋ/", ipaB: "/θɪŋ/", tip: "/s/ vs /θ/ sesi." },
  { id: 20, wordA: "cheap", wordB: "jeep", ipaA: "/tʃiːp/", ipaB: "/dʒiːp/", tip: "/tʃ/ vs /dʒ/ sesi. Titreşimsiz vs titreşimli." },
  { id: 21, wordA: "coat", wordB: "goat", ipaA: "/kəʊt/", ipaB: "/ɡəʊt/", tip: "/k/ vs /ɡ/ sesi. Titreşimsiz vs titreşimli." },
  { id: 22, wordA: "fan", wordB: "van", ipaA: "/fæn/", ipaB: "/væn/", tip: "/f/ vs /v/ sesi. Dudak-diş ünsüzleri." },
  { id: 23, wordA: "beach", wordB: "peach", ipaA: "/biːtʃ/", ipaB: "/piːtʃ/", tip: "/b/ vs /p/ sesi." },
  { id: 24, wordA: "so", wordB: "show", ipaA: "/səʊ/", ipaB: "/ʃəʊ/", tip: "/s/ vs /ʃ/ sesi." },
  { id: 25, wordA: "tin", wordB: "thin", ipaA: "/tɪn/", ipaB: "/θɪn/", tip: "/t/ vs /θ/ sesi. 'Thin' dil dişler arasında." },
  { id: 26, wordA: "pray", wordB: "play", ipaA: "/preɪ/", ipaB: "/pleɪ/", tip: "/r/ vs /l/ sesi. Türkçe konuşanlar için zor çift." },
  { id: 27, wordA: "jaw", wordB: "shore", ipaA: "/dʒɔː/", ipaB: "/ʃɔː/", tip: "/dʒ/ vs /ʃ/ sesi. Titre\u015fimli vs titre\u015fimsiz." },
  { id: 28, wordA: "fill", wordB: "feel", ipaA: "/fɪl/", ipaB: "/fiːl/", tip: "Kısa /ɪ/ vs uzun /iː/. 'Fill' kısa, 'feel' uzun." },
  { id: 29, wordA: "cap", wordB: "cab", ipaA: "/kæp/", ipaB: "/kæb/", tip: "/p/ vs /b/ sesi. Son sesteki titresim farkı." },
  { id: 30, wordA: "back", wordB: "bag", ipaA: "/bæk/", ipaB: "/bæɡ/", tip: "/k/ vs /ɡ/ sesi. Titre\u015fimli vs titre\u015fimsiz." },
  { id: 31, wordA: "trunk", wordB: "drunk", ipaA: "/trʌŋk/", ipaB: "/drʌŋk/", tip: "/t/ vs /d/ sesi. Ba\u015flang\u0131\u00e7 titre\u015fim fark\u0131." },
  { id: 32, wordA: "came", wordB: "game", ipaA: "/keɪm/", ipaB: "/ɡeɪm/", tip: "/k/ vs /ɡ/ sesi." },
  { id: 33, wordA: "sip", wordB: "zip", ipaA: "/sɪp/", ipaB: "/zɪp/", tip: "/s/ vs /z/ sesi. Titre\u015fimli vs titre\u015fimsiz." },
  { id: 34, wordA: "chain", wordB: "Jane", ipaA: "/tʃeɪn/", ipaB: "/dʒeɪn/", tip: "/tʃ/ vs /dʒ/ sesi. Titre\u015fimli vs titre\u015fimsiz." },
  { id: 35, wordA: "west", wordB: "vest", ipaA: "/west/", ipaB: "/vest/", tip: "/w/ vs /v/ sesi. Dudak \u015fekli fark\u0131." },
  { id: 36, wordA: "sink", wordB: "zinc", ipaA: "/sɪŋk/", ipaB: "/zɪŋk/", tip: "/s/ vs /z/ sesi." },
  { id: 37, wordA: "year", wordB: "ear", ipaA: "/jɪə/", ipaB: "/ɪə/", tip: "/j/ sesi ba\u015f\u0131nda var vs yok." },
  { id: 38, wordA: "cart", wordB: "card", ipaA: "/kɑːt/", ipaB: "/kɑːd/", tip: "/t/ vs /d/ son ses fark\u0131." },
  { id: 39, wordA: "lock", wordB: "rock", ipaA: "/lɒk/", ipaB: "/rɒk/", tip: "/l/ vs /r/ sesi. \u00d6zellikle zor bir \u00e7ift." },
  { id: 40, wordA: "path", wordB: "pass", ipaA: "/pɑːθ/", ipaB: "/pɑːs/", tip: "/\u03b8/ vs /s/ sesi. Dil di\u015flerin aras\u0131nda vs di\u015flerden uzakta." },
  // --- DOUBLED: 40 new pairs ---
  { id: 41, wordA: "berry", wordB: "very", ipaA: "/\u02c8ber.i/", ipaB: "/\u02c8ver.i/", tip: "/b/ vs /v/ sesi. Dudak kapat\u0131l\u0131r vs di\u015f-dudak." },
  { id: 42, wordA: "pin", wordB: "bin", ipaA: "/p\u026an/", ipaB: "/b\u026an/", tip: "/p/ vs /b/ sesi. Titre\u015fimsiz vs titre\u015fimli." },
  { id: 43, wordA: "ten", wordB: "den", ipaA: "/ten/", ipaB: "/den/", tip: "/t/ vs /d/ sesi." },
  { id: 44, wordA: "coat", wordB: "code", ipaA: "/k\u0259\u028at/", ipaB: "/k\u0259\u028ad/", tip: "/t/ vs /d/ son ses fark\u0131." },
  { id: 45, wordA: "few", wordB: "view", ipaA: "/fju\u02d0/", ipaB: "/vju\u02d0/", tip: "/f/ vs /v/ sesi." },
  { id: 46, wordA: "fine", wordB: "vine", ipaA: "/fa\u026an/", ipaB: "/va\u026an/", tip: "/f/ vs /v/ sesi." },
  { id: 47, wordA: "pig", wordB: "big", ipaA: "/p\u026a\u0261/", ipaB: "/b\u026a\u0261/", tip: "/p/ vs /b/ sesi." },
  { id: 48, wordA: "tie", wordB: "die", ipaA: "/ta\u026a/", ipaB: "/da\u026a/", tip: "/t/ vs /d/ sesi." },
  { id: 49, wordA: "cold", wordB: "gold", ipaA: "/k\u0259\u028ald/", ipaB: "/\u0261\u0259\u028ald/", tip: "/k/ vs /\u0261/ sesi." },
  { id: 50, wordA: "crow", wordB: "grow", ipaA: "/kr\u0259\u028a/", ipaB: "/\u0261r\u0259\u028a/", tip: "/k/ vs /\u0261/ sesi." },
  { id: 51, wordA: "led", wordB: "red", ipaA: "/led/", ipaB: "/red/", tip: "/l/ vs /r/ sesi." },
  { id: 52, wordA: "long", wordB: "wrong", ipaA: "/l\u0252\u014b/", ipaB: "/r\u0252\u014b/", tip: "/l/ vs /r/ sesi." },
  { id: 53, wordA: "cot", wordB: "caught", ipaA: "/k\u0252t/", ipaB: "/k\u0254\u02d0t/", tip: "K\u0131sa /\u0252/ vs uzun /\u0254\u02d0/ sesi." },
  { id: 54, wordA: "luck", wordB: "look", ipaA: "/l\u028ck/", ipaB: "/l\u028ak/", tip: "/\u028c/ vs /\u028a/ sesi." },
  { id: 55, wordA: "match", wordB: "much", ipaA: "/m\u00e6t\u0283/", ipaB: "/m\u028ct\u0283/", tip: "/\u00e6/ vs /\u028c/ sesi." },
  { id: 56, wordA: "debt", wordB: "date", ipaA: "/det/", ipaB: "/de\u026at/", tip: "K\u0131sa /e/ vs diftong /e\u026a/." },
  { id: 57, wordA: "pet", wordB: "pat", ipaA: "/pet/", ipaB: "/p\u00e6t/", tip: "/e/ vs /\u00e6/ sesi." },
  { id: 58, wordA: "set", wordB: "sat", ipaA: "/set/", ipaB: "/s\u00e6t/", tip: "/e/ vs /\u00e6/ sesi." },
  { id: 59, wordA: "men", wordB: "man", ipaA: "/men/", ipaB: "/m\u00e6n/", tip: "/e/ vs /\u00e6/ sesi." },
  { id: 60, wordA: "red", wordB: "rid", ipaA: "/red/", ipaB: "/r\u026ad/", tip: "/e/ vs /\u026a/ sesi." },
  { id: 61, wordA: "said", wordB: "sad", ipaA: "/sed/", ipaB: "/s\u00e6d/", tip: "/e/ vs /\u00e6/ sesi." },
  { id: 62, wordA: "hall", wordB: "hole", ipaA: "/h\u0254\u02d0l/", ipaB: "/h\u0259\u028al/", tip: "/\u0254\u02d0/ vs /\u0259\u028a/ sesi." },
  { id: 63, wordA: "walk", wordB: "work", ipaA: "/w\u0254\u02d0k/", ipaB: "/w\u025c\u02d0k/", tip: "/\u0254\u02d0/ vs /\u025c\u02d0/ sesi." },
  { id: 64, wordA: "peel", wordB: "pill", ipaA: "/pi\u02d0l/", ipaB: "/p\u026al/", tip: "Uzun /i\u02d0/ vs k\u0131sa /\u026a/." },
  { id: 65, wordA: "heat", wordB: "hit", ipaA: "/hi\u02d0t/", ipaB: "/h\u026at/", tip: "Uzun /i\u02d0/ vs k\u0131sa /\u026a/." },
  { id: 66, wordA: "deal", wordB: "dill", ipaA: "/di\u02d0l/", ipaB: "/d\u026al/", tip: "Uzun /i\u02d0/ vs k\u0131sa /\u026a/." },
  { id: 67, wordA: "fool", wordB: "full", ipaA: "/fu\u02d0l/", ipaB: "/f\u028al/", tip: "Uzun /u\u02d0/ vs k\u0131sa /\u028a/." },
  { id: 68, wordA: "luke", wordB: "look", ipaA: "/lu\u02d0k/", ipaB: "/l\u028ak/", tip: "Uzun /u\u02d0/ vs k\u0131sa /\u028a/." },
  { id: 69, wordA: "suit", wordB: "soot", ipaA: "/su\u02d0t/", ipaB: "/s\u028at/", tip: "Uzun /u\u02d0/ vs k\u0131sa /\u028a/." },
  { id: 70, wordA: "chop", wordB: "shop", ipaA: "/t\u0283\u0252p/", ipaB: "/\u0283\u0252p/", tip: "/t\u0283/ vs /\u0283/ sesi." },
  { id: 71, wordA: "chip", wordB: "ship", ipaA: "/t\u0283\u026ap/", ipaB: "/\u0283\u026ap/", tip: "/t\u0283/ vs /\u0283/ sesi." },
  { id: 72, wordA: "sheer", wordB: "cheer", ipaA: "/\u0283\u026a\u0259/", ipaB: "/t\u0283\u026a\u0259/", tip: "/\u0283/ vs /t\u0283/ sesi." },
  { id: 73, wordA: "wine", wordB: "whine", ipaA: "/wa\u026an/", ipaB: "/wa\u026an/", tip: "Baz\u0131 leh\u00e7elerde /w/ vs /\u028d/ fark\u0131." },
  { id: 74, wordA: "witch", wordB: "which", ipaA: "/w\u026at\u0283/", ipaB: "/w\u026at\u0283/", tip: "Baz\u0131 leh\u00e7elerde /w/ vs /\u028d/ fark\u0131." },
  { id: 75, wordA: "sue", wordB: "shoe", ipaA: "/su\u02d0/", ipaB: "/\u0283u\u02d0/", tip: "/s/ vs /\u0283/ sesi." },
  { id: 76, wordA: "save", wordB: "shave", ipaA: "/se\u026av/", ipaB: "/\u0283e\u026av/", tip: "/s/ vs /\u0283/ sesi." },
  { id: 77, wordA: "mass", wordB: "mash", ipaA: "/m\u00e6s/", ipaB: "/m\u00e6\u0283/", tip: "/s/ vs /\u0283/ son sesi." },
  { id: 78, wordA: "bus", wordB: "buzz", ipaA: "/b\u028cs/", ipaB: "/b\u028cz/", tip: "/s/ vs /z/ son sesi." },
  { id: 79, wordA: "race", wordB: "raise", ipaA: "/re\u026as/", ipaB: "/re\u026az/", tip: "/s/ vs /z/ son sesi." },
  { id: 80, wordA: "lace", wordB: "laze", ipaA: "/le\u026as/", ipaB: "/le\u026az/", tip: "/s/ vs /z/ son sesi." },
]

const QS_PER_SET = 8

export function MinimalPairs() {
  const [activeQs, setActiveQs] = useState<(MinimalPair & { correctAnswer: "A" | "B" })[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<"A" | "B" | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [currentSet, setCurrentSet] = useState(1)
  const [totalScore, setTotalScore] = useState(0)
  const [totalQs, setTotalQs] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => { loadNewSet() }, [])

  const loadNewSet = () => {
    const shuffled = [...pairs].sort(() => Math.random() - 0.5).slice(0, QS_PER_SET)
    const withAnswers = shuffled.map(p => ({
      ...p,
      correctAnswer: (Math.random() > 0.5 ? "A" : "B") as "A" | "B",
    }))
    setActiveQs(withAnswers)
    setCurrentQ(0)
    setSelected(null)
    setShowResult(false)
    setScore(0)
    setFinished(false)
    setAnswers([])
  }

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return
    setIsPlaying(true)
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "en-US"
    utterance.rate = 0.8
    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }, [])

  const playCurrentWord = useCallback(() => {
    if (activeQs.length === 0) return
    const q = activeQs[currentQ]
    const word = q.correctAnswer === "A" ? q.wordA : q.wordB
    speak(word)
  }, [activeQs, currentQ, speak])

  const handleSelect = (choice: "A" | "B") => {
    if (showResult) return
  setSelected(choice)
  setShowResult(true)
  const isCorrect = choice === activeQs[currentQ].correctAnswer
  playSoundEffect(isCorrect ? "correct" : "wrong")
  if (isCorrect) {
      setScore(s => s + 1)
      const progress = addXp(XP_REWARDS.minimal_pair_correct, "minimal_pair")
      showXpToast(XP_REWARDS.minimal_pair_correct, "Doğru duydu!")
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

  if (finished) {
    const pct = Math.round((score / activeQs.length) * 100)
    return (
      <Card className="border border-border/50 overflow-hidden rounded-lg">
        <div className="h-1.5 bg-muted"><div className="h-full bg-gradient-to-r from-sky-400 to-blue-500 w-full" /></div>
        <CardContent className="p-6 text-center">
          {currentSet > 1 && <p className="text-sm text-muted-foreground mb-2">Set {currentSet} | Toplam: {totalScore + score}/{totalQs + activeQs.length}</p>}
          <div className={cn("w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center", pct >= 80 ? "bg-emerald-100" : pct >= 50 ? "bg-amber-100" : "bg-red-100")}>
            <span className={cn("text-2xl font-bold", pct >= 80 ? "text-emerald-600" : pct >= 50 ? "text-amber-600" : "text-red-600")}>%{pct}</span>
          </div>
          <h4 className="font-serif text-xl mb-2">{pct >= 80 ? "Kulak keskin!" : pct >= 50 ? "Geliyor!" : "Daha fazla dinle!"}</h4>
          <div className="flex justify-center gap-1 mb-4">
            {answers.map((c, i) => <div key={i} className={cn("w-6 h-2 rounded-full", c ? "bg-emerald-400" : "bg-red-300")} />)}
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={continueSet} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"><ArrowRight className="w-4 h-4 mr-2" />Sonraki Set</Button>
            <Button onClick={() => { setCurrentSet(1); setTotalScore(0); setTotalQs(0); loadNewSet() }} variant="outline" className="w-full bg-transparent"><RotateCcw className="w-4 h-4 mr-2" />Sıfırla</Button>
          </div>
          <div className="mt-4 pt-4 border-t border-border/50">
            <ShareChallenge
              title="Minimal Pairs Sonucum"
              scoreText={`Minimal Pairs'de %${pct} başarı! ${score}/${activeQs.length} doğru.`}
              challengeText="Kulak testine hazır mısın? Sen de dene:"
              toolSlug="minimal-pairs"
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
      <QuizHeader title="Ses Cifti" current={currentQ + 1} total={activeQs.length} lastAnswerCorrect={showResult ? selected !== null : null} />

      <Card className="border border-border/50 mb-3 rounded-lg">
        <CardContent className="p-5">
          <p className="text-sm text-muted-foreground mb-3">Sesi dinleyin ve hangi kelimeyi duyduğunuzu seçin:</p>

          {/* Play button */}
          <button
            onClick={playCurrentWord}
            disabled={isPlaying}
            className={cn(
              "w-full py-6 rounded-xl border-2 border-dashed mb-4 flex flex-col items-center gap-2 transition-all",
              isPlaying ? "border-sky-400 bg-sky-50" : "border-border hover:border-sky-300 hover:bg-sky-50/50 active:scale-[0.98]"
            )}
          >
            <div className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center transition-all",
              isPlaying ? "bg-sky-500 animate-pulse" : "bg-sky-100"
            )}>
              <Volume2 className={cn("w-7 h-7", isPlaying ? "text-white" : "text-sky-600")} />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {isPlaying ? "Dinleniyor..." : "Dinlemek için tıklayın"}
            </span>
          </button>

          {/* Word choices */}
          <div className="grid grid-cols-2 gap-3">
            {(["A", "B"] as const).map(choice => {
              const word = choice === "A" ? q.wordA : q.wordB
              const ipa = choice === "A" ? q.ipaA : q.ipaB
              const isCorrect = choice === q.correctAnswer
              const isSelected = selected === choice
              return (
                <button key={choice} onClick={() => handleSelect(choice)} disabled={showResult}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all text-center",
                    showResult && isCorrect && "bg-emerald-50 border-emerald-400",
                    showResult && isSelected && !isCorrect && "bg-red-50 border-red-400",
                    showResult && !isSelected && !isCorrect && "opacity-50 border-transparent",
                    !showResult && "border-border hover:border-sky-300 hover:bg-sky-50/50 active:scale-95"
                  )}>
                  <span className="text-lg font-bold block">{word}</span>
                  <span className="text-xs text-muted-foreground font-mono">{ipa}</span>
                </button>
              )
            })}
          </div>

          {showResult && (
            <div className={cn(
              "mt-3 p-3 rounded-lg text-sm animate-in fade-in slide-in-from-bottom-2 duration-300",
              selected === q.correctAnswer ? "bg-emerald-50 text-emerald-800" : "bg-sky-50 text-sky-800"
            )}>
              {q.tip}
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
