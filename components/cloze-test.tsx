"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, RotateCcw, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { addXp, checkAndUnlockAchievements, XP_REWARDS } from "@/lib/xp-system"
import { showXpToast, showAchievementToast, playSoundEffect } from "@/components/xp-toast"

interface ClozePassage {
  id: number
  title: string
  level: "B1" | "B2" | "C1"
  segments: (string | { blank: number })[]
  blanks: { options: string[]; correct: number }[]
}

const passages: ClozePassage[] = [
  {
    id: 1, title: "The Importance of Sleep", level: "B2",
    segments: [
      "Sleep is ", { blank: 0 }, " for maintaining good health. Research shows that people who consistently get enough sleep are ", { blank: 1 }, " likely to suffer from chronic diseases. ", { blank: 2 }, " the importance of sleep is well documented, many people still fail to get the recommended seven to eight hours per night. This can ", { blank: 3 }, " to serious health problems, including obesity, heart disease, and depression."
    ],
    blanks: [
      { options: ["essential", "unnecessary", "harmful", "optional"], correct: 0 },
      { options: ["more", "less", "equally", "most"], correct: 1 },
      { options: ["Although", "Because", "Unless", "Until"], correct: 0 },
      { options: ["take", "bring", "lead", "carry"], correct: 2 },
    ]
  },
  {
    id: 2, title: "Social Media Impact", level: "B2",
    segments: [
      "Social media has ", { blank: 0 }, " changed the way people interact with each other. While it allows us to stay ", { blank: 1 }, " with friends and family across the globe, studies suggest that excessive use can ", { blank: 2 }, " affect mental health. Many experts recommend ", { blank: 3 }, " screen time and engaging in face-to-face interactions instead."
    ],
    blanks: [
      { options: ["dramatically", "hardly", "rarely", "slowly"], correct: 0 },
      { options: ["connected", "involved", "engaged", "attached"], correct: 0 },
      { options: ["positively", "negatively", "rarely", "slightly"], correct: 1 },
      { options: ["increasing", "limiting", "ignoring", "avoiding"], correct: 1 },
    ]
  },
  {
    id: 3, title: "Space Exploration", level: "C1",
    segments: [
      "The exploration of space has always ", { blank: 0 }, " humankind's imagination. Since the first moon landing in 1969, scientists have made ", { blank: 1 }, " progress in understanding our universe. Recent developments in reusable rocket technology have ", { blank: 2 }, " reduced the cost of space travel. ", { blank: 3 }, ", private companies now play a major role in pushing the boundaries of what is possible."
    ],
    blanks: [
      { options: ["captured", "ignored", "rejected", "forgotten"], correct: 0 },
      { options: ["slight", "remarkable", "minimal", "limited"], correct: 1 },
      { options: ["unfortunately", "insignificantly", "significantly", "barely"], correct: 2 },
      { options: ["Nevertheless", "However", "Consequently", "Therefore"], correct: 2 },
    ]
  },
  {
    id: 4, title: "Healthy Eating Habits", level: "B1",
    segments: [
      "A balanced diet is one of the most important ", { blank: 0 }, " of a healthy lifestyle. Eating a variety of fruits, vegetables, and whole grains ", { blank: 1 }, " the body with essential nutrients. It is also important to ", { blank: 2 }, " the consumption of processed foods and sugary drinks. Making small changes to your diet can have a ", { blank: 3 }, " impact on your overall health."
    ],
    blanks: [
      { options: ["parts", "aspects", "objects", "items"], correct: 1 },
      { options: ["removes", "prevents", "provides", "protects"], correct: 2 },
      { options: ["increase", "reduce", "maintain", "ignore"], correct: 1 },
      { options: ["negative", "minor", "significant", "harmful"], correct: 2 },
    ]
  },
  {
    id: 5, title: "Artificial Intelligence", level: "C1",
    segments: [
      "Artificial intelligence has ", { blank: 0 }, " from a theoretical concept to a practical tool that affects our daily lives. Machine learning algorithms can now ", { blank: 1 }, " patterns in data that humans might miss. ", { blank: 2 }, " AI offers tremendous benefits, ethical concerns about privacy and job displacement remain ", { blank: 3 }, " debated topics in society."
    ],
    blanks: [
      { options: ["evolved", "declined", "disappeared", "stagnated"], correct: 0 },
      { options: ["create", "identify", "ignore", "destroy"], correct: 1 },
      { options: ["Since", "While", "Unless", "Before"], correct: 1 },
      { options: ["slightly", "rarely", "hotly", "coldly"], correct: 2 },
    ]
  },
  {
    id: 6, title: "Climate Change Solutions", level: "B2",
    segments: [
      "Climate change is one of the most ", { blank: 0 }, " challenges facing our planet today. Scientists warn that if we do not take ", { blank: 1 }, " action, the consequences could be devastating. Renewable energy sources such as wind and solar power are becoming ", { blank: 2 }, " affordable. Governments must work together to ", { blank: 3 }, " carbon emissions and protect the environment for future generations."
    ],
    blanks: [
      { options: ["pressing", "minor", "outdated", "fictional"], correct: 0 },
      { options: ["immediate", "delayed", "optional", "moderate"], correct: 0 },
      { options: ["less", "increasingly", "barely", "never"], correct: 1 },
      { options: ["raise", "maintain", "reduce", "monitor"], correct: 2 },
    ]
  },
  {
    id: 7, title: "The Rise of Remote Work", level: "B2",
    segments: [
      "The pandemic ", { blank: 0 }, " a dramatic shift toward remote work. Many companies discovered that employees could be equally ", { blank: 1 }, " from home. However, remote work also comes with ", { blank: 2 }, ", such as feelings of isolation and difficulty separating personal and professional life. ", { blank: 3 }, " these issues, most surveys show that workers prefer a hybrid model."
    ],
    blanks: [
      { options: ["prevented", "triggered", "delayed", "dismissed"], correct: 1 },
      { options: ["distracted", "productive", "confused", "visible"], correct: 1 },
      { options: ["benefits", "challenges", "opportunities", "salaries"], correct: 1 },
      { options: ["Despite", "Because of", "Without", "During"], correct: 0 },
    ]
  },
  {
    id: 8, title: "Ocean Conservation", level: "C1",
    segments: [
      "The world's oceans are home to an ", { blank: 0 }, " diverse range of species, many of which remain undiscovered. Overfishing and pollution have caused ", { blank: 1 }, " damage to marine ecosystems. Marine protected areas have ", { blank: 2 }, " effective in restoring fish populations. Scientists emphasize that international ", { blank: 3 }, " is essential to preserve ocean health for coming generations."
    ],
    blanks: [
      { options: ["incredibly", "slightly", "barely", "unfortunately"], correct: 0 },
      { options: ["minimal", "reversible", "considerable", "negligible"], correct: 2 },
      { options: ["remained", "proven", "seemed", "appeared"], correct: 1 },
      { options: ["competition", "isolation", "cooperation", "indifference"], correct: 2 },
    ]
  },
  {
    id: 9, title: "Learning a Second Language", level: "B1",
    segments: [
      "Learning a foreign language can ", { blank: 0 }, " many doors both personally and professionally. Studies show that bilingual people often have better ", { blank: 1 }, " skills and are more creative thinkers. The best way to learn is through regular ", { blank: 2 }, " and exposure to native speakers. It is never too ", { blank: 3 }, " to start learning a new language."
    ],
    blanks: [
      { options: ["close", "lock", "open", "break"], correct: 2 },
      { options: ["problem-solving", "cooking", "driving", "sleeping"], correct: 0 },
      { options: ["avoidance", "practice", "delay", "criticism"], correct: 1 },
      { options: ["early", "easy", "late", "hard"], correct: 2 },
    ]
  },
  {
    id: 10, title: "Urban Green Spaces", level: "B2",
    segments: [
      "Parks and green spaces play a ", { blank: 0 }, " role in urban environments. Access to nature has been shown to ", { blank: 1 }, " stress and improve mental well-being. City planners are increasingly ", { blank: 2 }, " green infrastructure into their designs. ", { blank: 3 }, " of available space, even small community gardens can make a difference."
    ],
    blanks: [
      { options: ["minor", "harmful", "vital", "questionable"], correct: 2 },
      { options: ["increase", "cause", "ignore", "reduce"], correct: 3 },
      { options: ["removing", "incorporating", "avoiding", "deleting"], correct: 1 },
      { options: ["Regardless", "Because", "Instead", "Unless"], correct: 0 },
    ]
  },
  {
    id: 11, title: "The History of Coffee", level: "B1",
    segments: [
      "Coffee is one of the most widely ", { blank: 0 }, " beverages in the world. It was first discovered in Ethiopia, where a goat herder ", { blank: 1 }, " that his animals became energetic after eating certain berries. Coffee houses quickly ", { blank: 2 }, " important social gathering places. Today, the global coffee industry is ", { blank: 3 }, " billions of dollars annually."
    ],
    blanks: [
      { options: ["avoided", "consumed", "rejected", "feared"], correct: 1 },
      { options: ["denied", "forgot", "noticed", "regretted"], correct: 2 },
      { options: ["became", "avoided", "destroyed", "abandoned"], correct: 0 },
      { options: ["losing", "costing", "worth", "wasting"], correct: 2 },
    ]
  },
  {
    id: 12, title: "Biodiversity Under Threat", level: "C1",
    segments: [
      "Biodiversity is the ", { blank: 0 }, " of life on Earth, encompassing all living organisms and their ecosystems. Human activities such as deforestation and urbanization have led to a ", { blank: 1 }, " decline in species populations worldwide. Conservation efforts aim to ", { blank: 2 }, " endangered habitats and reintroduce species that have nearly vanished. The ", { blank: 3 }, " of biodiversity would have catastrophic consequences for humanity's food supply and medicine."
    ],
    blanks: [
      { options: ["absence", "variety", "reduction", "simplicity"], correct: 1 },
      { options: ["gradual", "sharp", "slight", "positive"], correct: 1 },
      { options: ["destroy", "ignore", "restore", "commercialize"], correct: 2 },
      { options: ["increase", "preservation", "loss", "discovery"], correct: 2 },
    ]
  },
  {
    id: 13, title: "Digital Privacy Concerns", level: "C1",
    segments: [
      "In the digital age, personal data has become an extremely ", { blank: 0 }, " commodity. Companies collect vast amounts of information about users' online ", { blank: 1 }, " without their explicit consent. Governments around the world are introducing stricter regulations to ", { blank: 2 }, " individuals' privacy rights. It is crucial that citizens remain ", { blank: 3 }, " about how their data is being used and shared."
    ],
    blanks: [
      { options: ["worthless", "dangerous", "valuable", "outdated"], correct: 2 },
      { options: ["behaviour", "appearance", "clothing", "height"], correct: 0 },
      { options: ["eliminate", "weaken", "violate", "safeguard"], correct: 3 },
      { options: ["careless", "informed", "indifferent", "silent"], correct: 1 },
    ]
  },
  {
    id: 14, title: "Volunteering Benefits", level: "B1",
    segments: [
      "Volunteering is a wonderful way to ", { blank: 0 }, " back to your community. People who volunteer regularly report higher levels of ", { blank: 1 }, " and life satisfaction. It also provides valuable opportunities to develop new ", { blank: 2 }, " and meet people from different backgrounds. Even a few hours a week can make a meaningful ", { blank: 3 }, " in someone's life."
    ],
    blanks: [
      { options: ["take", "give", "pull", "push"], correct: 1 },
      { options: ["anxiety", "sadness", "happiness", "anger"], correct: 2 },
      { options: ["problems", "debts", "enemies", "skills"], correct: 3 },
      { options: ["mess", "difference", "mistake", "complaint"], correct: 1 },
    ]
  },
  {
    id: 15, title: "The Future of Transportation", level: "B2",
    segments: [
      "Autonomous vehicles are expected to ", { blank: 0 }, " the transportation industry within the next decade. Self-driving cars could greatly reduce traffic accidents caused by human ", { blank: 1 }, ". However, there are still significant ", { blank: 2 }, " obstacles to overcome, including questions about liability. Public ", { blank: 3 }, " of driverless technology remains mixed, with many people expressing concerns about safety."
    ],
    blanks: [
      { options: ["destroy", "ignore", "transform", "abandon"], correct: 2 },
      { options: ["excellence", "error", "strength", "kindness"], correct: 1 },
      { options: ["legal", "musical", "culinary", "athletic"], correct: 0 },
      { options: ["celebration", "perception", "decoration", "publication"], correct: 1 },
    ]
  },
]

const levelColors: Record<string, string> = { B1: "bg-emerald-100 text-emerald-700", B2: "bg-blue-100 text-blue-700", C1: "bg-purple-100 text-purple-700" }

export function ClozeTest() {
  const [phase, setPhase] = useState<"select" | "test" | "result">("select")
  const [passage, setPassage] = useState<ClozePassage | null>(null)
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([])
  const [showResults, setShowResults] = useState(false)
  const [usedIds, setUsedIds] = useState<Set<number>>(new Set())

  const startTest = (p: ClozePassage) => {
    setPassage(p)
    setUserAnswers(new Array(p.blanks.length).fill(null))
    setShowResults(false)
    setPhase("test")
  }

  const selectOption = (blankIdx: number, optionIdx: number) => {
    if (showResults) return
    setUserAnswers(prev => {
      const copy = [...prev]
      copy[blankIdx] = optionIdx
      return copy
    })
  }

  const checkAnswers = () => {
    if (!passage) return
    setShowResults(true)
    playSoundEffect("complete")
    const correct = userAnswers.filter((a, i) => a === passage.blanks[i].correct).length
    const xp = XP_REWARDS.cloze_complete
    const progress = addXp(xp, "cloze")
    showXpToast(xp, `${correct}/${passage.blanks.length} doğru!`)
    const newA = checkAndUnlockAchievements(progress)
    for (const a of newA) showAchievementToast(a)
    setUsedIds(prev => { const s = new Set(prev); s.add(passage.id); return s })
  }

  const allAnswered = userAnswers.every(a => a !== null)
  const score = passage ? userAnswers.filter((a, i) => a === passage.blanks[i].correct).length : 0

  if (phase === "select") {
    const available = passages.filter(p => !usedIds.has(p.id))
    const display = available.length > 0 ? available : passages
    return (
      <div className="py-4">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-teal-600" />
          <h3 className="font-serif text-lg">Boşluk Doldurma</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Bir paragraf seçin ve boşluklar için en uygun kelimeleri seçin.</p>
        <div className="space-y-2">
          {display.map(p => (
            <button key={p.id} onClick={() => startTest(p)} className="w-full p-4 rounded-xl border-2 border-border hover:border-teal-300 hover:bg-teal-50/30 transition-all text-left active:scale-[0.98]">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{p.title}</span>
                <span className={cn("text-xs px-2 py-0.5 rounded-full font-bold", levelColors[p.level])}>{p.level}</span>
              </div>
              <span className="text-xs text-muted-foreground">{p.blanks.length} boşluk</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (!passage) return null

  if (phase === "test" && showResults) {
    const pct = Math.round((score / passage.blanks.length) * 100)
    return (
      <Card className="border border-border/50 overflow-hidden rounded-lg">
        <div className="h-1.5 bg-muted"><div className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 w-full" /></div>
        <CardContent className="p-6 text-center">
          <div className={cn("w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center", pct >= 80 ? "bg-emerald-100" : pct >= 50 ? "bg-amber-100" : "bg-red-100")}>
            <span className={cn("text-2xl font-bold", pct >= 80 ? "text-emerald-600" : pct >= 50 ? "text-amber-600" : "text-red-600")}>%{pct}</span>
          </div>
          <h4 className="font-serif text-xl mb-1">{passage.title}</h4>
          <p className="text-muted-foreground text-sm mb-3">{passage.blanks.length} boşluktan {score} doğru</p>
          <div className="flex justify-center gap-1 mb-4">
            {userAnswers.map((a, i) => <div key={i} className={cn("w-8 h-2 rounded-full", a === passage.blanks[i].correct ? "bg-emerald-400" : "bg-red-300")} />)}
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={() => setPhase("select")} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"><ArrowRight className="w-4 h-4 mr-2" />Baska Paragraf</Button>
            <Button onClick={() => { setUsedIds(new Set()); setPhase("select") }} variant="outline" className="w-full bg-transparent"><RotateCcw className="w-4 h-4 mr-2" />Tümü Sıfırla</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Active test
  let blankCounter = 0
  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-teal-600" />
          <h3 className="font-serif text-lg">{passage.title}</h3>
        </div>
        <span className={cn("text-xs px-2 py-0.5 rounded-full font-bold", levelColors[passage.level])}>{passage.level}</span>
      </div>

      <Card className="border border-border/50 mb-4 rounded-lg">
        <CardContent className="p-5">
          <p className="text-base leading-loose">
            {passage.segments.map((seg, i) => {
              if (typeof seg === "string") return <span key={i}>{seg}</span>
              const bIdx = seg.blank
              const myBlank = blankCounter++
              void myBlank // used for tracking
              const answer = userAnswers[bIdx]
              const blank = passage.blanks[bIdx]
              return (
                <span key={i} className={cn(
                  "inline-block mx-1 px-2 py-0.5 rounded font-bold border-b-2 text-sm",
                  answer !== null
                    ? "bg-teal-100 text-teal-700 border-teal-300"
                    : "bg-muted text-muted-foreground border-border"
                )}>
                  {answer !== null ? blank.options[answer] : `(${bIdx + 1})`}
                </span>
              )
            })}
          </p>
        </CardContent>
      </Card>

      {/* Options for each blank */}
      <div className="space-y-3 mb-4">
        {passage.blanks.map((blank, bIdx) => (
          <div key={bIdx}>
            <p className="text-xs font-medium text-muted-foreground mb-1.5">Boşluk {bIdx + 1}:</p>
            <div className="flex flex-wrap gap-1.5">
              {blank.options.map((opt, oIdx) => (
                <button key={oIdx} onClick={() => selectOption(bIdx, oIdx)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-all active:scale-95",
                    userAnswers[bIdx] === oIdx
                      ? "bg-teal-100 border-teal-400 text-teal-700"
                      : "border-border hover:border-teal-300 hover:bg-teal-50/50"
                  )}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Button onClick={checkAnswers} disabled={!allAnswered} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground disabled:opacity-50">
        Kontrol Et <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  )
}
