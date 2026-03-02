"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, RotateCcw, CheckCircle2, XCircle, BookOpen, Clock, Gauge } from "lucide-react"
import { cn } from "@/lib/utils"
import { addXp, checkAndUnlockAchievements, XP_REWARDS } from "@/lib/xp-system"
import { showXpToast, showAchievementToast, playSoundEffect } from "@/components/xp-toast"

interface ReadingPassage {
  id: number
  title: string
  text: string
  wordCount: number
  questions: { question: string; options: string[]; correct: number }[]
  level: "B1" | "B2" | "C1"
}

const passages: ReadingPassage[] = [
  {
    id: 1,
    title: "The Digital Revolution",
    text: "The digital revolution has fundamentally transformed the way we communicate, work, and access information. In the past two decades, the internet has evolved from a simple tool for sharing text-based information to a complex ecosystem that supports everything from e-commerce to social networking. This transformation has brought both opportunities and challenges. On the one hand, digital technology has democratized access to knowledge, enabling people in remote areas to learn about virtually any subject. On the other hand, the rapid pace of technological change has created a digital divide between those who have access to technology and those who do not. Furthermore, concerns about data privacy and cybersecurity have become increasingly prominent as more of our personal information moves online. Despite these challenges, most experts agree that the benefits of the digital revolution far outweigh its drawbacks, and that continued innovation will help address many of the current concerns.",
    wordCount: 145,
    level: "B2",
    questions: [
      { question: "What has the internet evolved into?", options: ["A simple text tool", "A complex ecosystem", "Only social media", "A shopping platform"], correct: 1 },
      { question: "What challenge does the text mention?", options: ["High internet costs", "Digital divide", "Too many websites", "Slow computers"], correct: 1 },
      { question: "What is the experts' general view?", options: ["Technology is harmful", "Benefits outweigh drawbacks", "We should stop innovating", "Privacy is not important"], correct: 1 },
    ]
  },
  {
    id: 2,
    title: "Climate Change and Agriculture",
    text: "Climate change poses one of the greatest threats to global food security. Rising temperatures, shifting rainfall patterns, and more frequent extreme weather events are already affecting crop yields in many parts of the world. Scientists predict that by 2050, global food production may need to increase by 60% to feed a growing population, yet climate change could reduce crop yields by up to 25% in some regions. Farmers are being forced to adapt by developing drought-resistant varieties, implementing water-saving irrigation techniques, and shifting planting seasons. However, these adaptations come at a significant cost, and smallholder farmers in developing countries are often the most vulnerable. International cooperation and investment in agricultural research are essential to ensuring that the world can continue to feed itself in the face of a changing climate.",
    wordCount: 134,
    level: "B2",
    questions: [
      { question: "By how much may food production need to increase by 2050?", options: ["25%", "40%", "60%", "80%"], correct: 2 },
      { question: "Who is most vulnerable to climate change effects on agriculture?", options: ["Large corporations", "Smallholder farmers", "Scientists", "Urban residents"], correct: 1 },
      { question: "What is essential according to the text?", options: ["Reducing population", "International cooperation", "Stopping farming", "Moving to cities"], correct: 1 },
    ]
  },
  {
    id: 3,
    title: "The Psychology of Learning",
    text: "Recent advances in cognitive psychology have revealed fascinating insights into how the human brain acquires and retains new information. One of the most significant findings is that distributed practice, or spacing out study sessions over time, is far more effective than cramming information into a single session. This phenomenon, known as the spacing effect, suggests that our brains need time to consolidate new memories. Another important discovery is the testing effect: actively recalling information through self-testing strengthens memory traces more effectively than passive review. Additionally, researchers have found that interleaving different topics during study sessions, rather than focusing on a single subject, leads to better long-term retention. These findings have important implications for education, suggesting that traditional methods of teaching and studying may not be the most efficient ways to learn.",
    wordCount: 140,
    level: "C1",
    questions: [
      { question: "What is more effective than cramming?", options: ["Reading faster", "Distributed practice", "Group study", "Listening to music"], correct: 1 },
      { question: "What is the 'testing effect'?", options: ["Taking exams is stressful", "Active recall strengthens memory", "Tests measure intelligence", "Passive review is better"], correct: 1 },
      { question: "What does interleaving mean in this context?", options: ["Studying one topic deeply", "Taking breaks", "Mixing different topics", "Reading textbooks"], correct: 2 },
    ]
  },
  {
    id: 4,
    title: "Renewable Energy Transition",
    text: "The global transition to renewable energy sources has accelerated dramatically in recent years, driven by both environmental concerns and economic factors. Solar and wind energy costs have fallen by more than 80% over the past decade, making them competitive with fossil fuels in many regions. Several countries have set ambitious targets to achieve carbon neutrality by 2050, which will require a complete transformation of their energy systems. However, the transition faces significant obstacles, including the need for massive investments in energy storage technology, grid infrastructure upgrades, and workforce retraining. Despite these challenges, the momentum behind renewable energy appears to be unstoppable, with global investment in clean energy reaching record levels year after year.",
    wordCount: 120,
    level: "B2",
    questions: [
      { question: "By how much have solar and wind costs fallen?", options: ["50%", "60%", "70%", "80%"], correct: 3 },
      { question: "What target have several countries set?", options: ["Zero unemployment", "Carbon neutrality by 2050", "Free energy", "Nuclear power only"], correct: 1 },
      { question: "What is described as a major obstacle?", options: ["Lack of sun", "Energy storage investment", "Too much wind", "Public opposition"], correct: 1 },
    ]
  },
  {
    id: 5,
    title: "The Art of Communication",
    text: "Effective communication is widely regarded as one of the most important skills in both personal and professional life. Research shows that approximately 55% of communication is nonverbal, conveyed through body language, facial expressions, and gestures. Another 38% comes from vocal elements such as tone, pitch, and pace, while only 7% of the message is contained in the actual words spoken. This means that how we say something is often more important than what we say. In the workplace, poor communication has been identified as the leading cause of project failure, with studies suggesting that organizations lose an average of $62.4 million per year due to communication breakdowns. Improving communication skills requires active listening, empathy, and the ability to adapt one's message to different audiences.",
    wordCount: 132,
    level: "B1",
    questions: [
      { question: "What percentage of communication is nonverbal?", options: ["7%", "38%", "55%", "62%"], correct: 2 },
      { question: "What is the leading cause of project failure?", options: ["Lack of funding", "Poor communication", "Technical issues", "Tight deadlines"], correct: 1 },
      { question: "What does improving communication require?", options: ["Speaking louder", "Active listening and empathy", "Using more words", "Writing more emails"], correct: 1 },
    ]
  },
  {
    id: 6,
    title: "The Future of Work",
    text: "The COVID-19 pandemic has permanently altered the landscape of work, accelerating trends that were already underway. Remote work, once considered a perk offered by forward-thinking companies, has become a standard expectation for millions of workers worldwide. Studies indicate that hybrid work models, combining office and remote work, are now preferred by approximately 70% of employees. This shift has profound implications for urban planning, commercial real estate, and employee well-being. Companies that embrace flexibility report higher employee satisfaction and lower turnover rates. However, challenges remain, including maintaining company culture, ensuring equitable treatment of remote and in-office workers, and addressing the blurred boundaries between work and personal life. As artificial intelligence continues to automate routine tasks, the nature of work itself is evolving, placing greater emphasis on creativity, critical thinking, and interpersonal skills.",
    wordCount: 142,
    level: "B2",
    questions: [
      { question: "What percentage of employees prefer hybrid work models?", options: ["50%", "60%", "70%", "80%"], correct: 2 },
      { question: "What do companies embracing flexibility report?", options: ["Higher costs", "Higher employee satisfaction", "More meetings", "Less productivity"], correct: 1 },
      { question: "What skills are becoming more important according to the text?", options: ["Technical skills only", "Creativity and critical thinking", "Manual labor skills", "Data entry skills"], correct: 1 },
    ]
  },
  {
    id: 7,
    title: "The Science of Sleep",
    text: "Sleep is one of the most essential yet undervalued aspects of human health. Research has consistently shown that adults require between seven and nine hours of quality sleep per night for optimal functioning. During sleep, the brain undergoes critical processes including memory consolidation, toxin removal, and emotional regulation. Chronic sleep deprivation has been linked to a wide range of health problems, including obesity, cardiovascular disease, weakened immune function, and mental health disorders. Despite this knowledge, modern society often promotes a culture of sleep sacrifice in pursuit of productivity. Ironically, studies demonstrate that well-rested individuals are significantly more productive, creative, and emotionally resilient than their sleep-deprived counterparts. Simple interventions such as maintaining a consistent sleep schedule, limiting screen exposure before bedtime, and creating a cool, dark sleeping environment can dramatically improve sleep quality.",
    wordCount: 148,
    level: "B1",
    questions: [
      { question: "How many hours of sleep do adults need per night?", options: ["5-6 hours", "6-7 hours", "7-9 hours", "9-11 hours"], correct: 2 },
      { question: "What happens during sleep according to the text?", options: ["Nothing important", "Memory consolidation and toxin removal", "Weight loss", "Muscle growth only"], correct: 1 },
      { question: "What is described as ironic in the text?", options: ["Sleep is boring", "Well-rested people are more productive", "Sleep takes too long", "Dreams are meaningless"], correct: 1 },
    ]
  },
  {
    id: 8,
    title: "Artificial Intelligence in Medicine",
    text: "Artificial intelligence is revolutionizing the field of medicine in ways that were unimaginable just a decade ago. Machine learning algorithms can now analyze medical images with accuracy that rivals or even surpasses that of experienced radiologists, detecting conditions such as cancer, diabetic retinopathy, and cardiac abnormalities at earlier stages. Natural language processing enables AI systems to sift through vast medical literature and patient records, assisting physicians in making more informed diagnostic and treatment decisions. Furthermore, AI-driven drug discovery platforms are dramatically accelerating the identification of potential therapeutic compounds, reducing development timelines from years to months. However, the integration of AI into healthcare raises important ethical considerations, including data privacy, algorithmic bias, and the potential displacement of healthcare workers. Striking the right balance between technological advancement and human oversight remains a critical challenge.",
    wordCount: 146,
    level: "C1",
    questions: [
      { question: "What can ML algorithms do with medical images?", options: ["Only store them", "Analyze them with high accuracy", "Delete unnecessary ones", "Print them faster"], correct: 1 },
      { question: "How does AI affect drug discovery?", options: ["It slows it down", "It has no effect", "It accelerates identification of compounds", "It replaces all scientists"], correct: 2 },
      { question: "What ethical concern is mentioned?", options: ["AI is too expensive", "Data privacy and algorithmic bias", "AI is too slow", "Patients prefer AI"], correct: 1 },
    ]
  },
  {
    id: 9,
    title: "Ocean Pollution",
    text: "The world's oceans face an unprecedented crisis from pollution, with an estimated eight million tonnes of plastic entering marine environments every year. This plastic waste breaks down into microplastics that have been found in the deepest ocean trenches, in Arctic ice, and even in human blood samples. Marine animals frequently mistake plastic debris for food, leading to internal injuries, starvation, and death. Beyond plastic, chemical pollutants including pesticides, heavy metals, and pharmaceutical residues contaminate ocean waters, accumulating in the food chain and ultimately reaching human consumers through seafood. Coral reefs, which support approximately 25% of all marine species, are particularly vulnerable to pollution combined with rising ocean temperatures. International efforts to address ocean pollution have intensified, with several nations implementing bans on single-use plastics and investing in cleanup technologies, but experts warn that prevention rather than cleanup must be the primary strategy.",
    wordCount: 155,
    level: "B2",
    questions: [
      { question: "How much plastic enters the ocean each year?", options: ["1 million tonnes", "5 million tonnes", "8 million tonnes", "12 million tonnes"], correct: 2 },
      { question: "What percentage of marine species do coral reefs support?", options: ["10%", "15%", "20%", "25%"], correct: 3 },
      { question: "What do experts say should be the primary strategy?", options: ["Cleanup technology", "Prevention", "Ignoring the problem", "Building more landfills"], correct: 1 },
    ]
  },
  {
    id: 10,
    title: "The Power of Habit",
    text: "Habits shape nearly 40% of our daily actions, operating largely below the level of conscious awareness. According to research in behavioural psychology, every habit follows a three-step loop: a cue that triggers the behaviour, the routine itself, and a reward that reinforces it. Understanding this loop is the key to changing unwanted habits and building positive ones. Studies have shown that it takes an average of 66 days for a new behaviour to become automatic, though this varies considerably depending on the individual and the complexity of the habit. One particularly effective strategy is habit stacking, which involves linking a new desired behaviour to an existing habit. For example, if someone wants to start meditating, they might commit to doing so immediately after their morning coffee. Small, consistent changes tend to produce more lasting results than dramatic overhauls, a principle that applies equally to personal development, fitness, and language learning.",
    wordCount: 158,
    level: "B1",
    questions: [
      { question: "What percentage of daily actions are shaped by habits?", options: ["20%", "30%", "40%", "50%"], correct: 2 },
      { question: "How many days on average does it take to form a new habit?", options: ["21 days", "30 days", "45 days", "66 days"], correct: 3 },
      { question: "What is 'habit stacking'?", options: ["Doing many things at once", "Linking a new behaviour to an existing habit", "Quitting all bad habits", "Sleeping more"], correct: 1 },
    ]
  },
  {
    id: 11,
    title: "The Microplastics Crisis",
    text: "Microplastics, defined as plastic fragments smaller than five millimetres, have become one of the most pervasive environmental pollutants on the planet. These tiny particles originate from the breakdown of larger plastic items, synthetic clothing fibres released during washing, and microbeads found in cosmetics and personal care products. Recent research has detected microplastics in virtually every environment tested, from the summit of Mount Everest to the deepest ocean trenches. Perhaps most alarmingly, studies have found microplastics in human blood, lung tissue, and even placental samples. While the full health implications remain under investigation, preliminary research suggests that microplastics may cause inflammation, cellular damage, and disruption of hormonal systems. The scale of the problem is staggering: an estimated 14 million tonnes of microplastics currently sit on the ocean floor alone. Addressing this crisis will require coordinated global action, including reducing plastic production, improving waste management infrastructure, and developing biodegradable alternatives.",
    wordCount: 155,
    level: "C1",
    questions: [
      { question: "How are microplastics defined?", options: ["Plastic under 1mm", "Plastic under 5mm", "Plastic under 10mm", "Any small plastic"], correct: 1 },
      { question: "Where have microplastics NOT been found according to the text?", options: ["Mount Everest", "Ocean trenches", "Human blood", "The text says they are found everywhere tested"], correct: 3 },
      { question: "How much microplastic is estimated to be on the ocean floor?", options: ["4 million tonnes", "8 million tonnes", "14 million tonnes", "20 million tonnes"], correct: 2 },
    ]
  },
  {
    id: 12,
    title: "The Benefits of Bilingualism",
    text: "Learning a second language offers cognitive benefits that extend far beyond the ability to communicate with more people. Research in neuroscience has consistently demonstrated that bilingual individuals exhibit enhanced executive function, including improved attention, task-switching ability, and working memory. These cognitive advantages appear to persist throughout life and may even delay the onset of age-related cognitive decline by an average of four to five years. The bilingual brain is constantly managing two language systems, which strengthens neural pathways and increases grey matter density in regions associated with language processing and executive control. Children raised in bilingual environments tend to develop stronger problem-solving skills and greater cognitive flexibility. Furthermore, bilingualism has been linked to improved empathy and cultural awareness, as speaking multiple languages encourages individuals to see the world from different perspectives. In an increasingly globalised world, the benefits of bilingualism make a compelling case for language education beginning in early childhood.",
    wordCount: 157,
    level: "B2",
    questions: [
      { question: "By how many years may bilingualism delay cognitive decline?", options: ["1-2 years", "2-3 years", "4-5 years", "6-7 years"], correct: 2 },
      { question: "What happens to the bilingual brain's grey matter?", options: ["It decreases", "Its density increases", "It stays the same", "It changes colour"], correct: 1 },
      { question: "What non-cognitive benefit is mentioned?", options: ["Better hearing", "Improved empathy", "Faster reading", "Better handwriting"], correct: 1 },
    ]
  },
  {
    id: 13,
    title: "Space Tourism",
    text: "Space tourism, once the exclusive domain of science fiction, is rapidly becoming a commercial reality. Companies like SpaceX, Blue Origin, and Virgin Galactic have successfully launched civilian passengers into space, marking the beginning of a new era in human space travel. Ticket prices, while still prohibitively expensive for most people at around $250,000 to $450,000 per seat for suborbital flights, are expected to decrease as technology matures and competition increases. Proponents argue that space tourism will drive innovation, create jobs, and inspire a new generation of scientists and engineers. Critics, however, raise legitimate concerns about the environmental impact of rocket launches, which release significant quantities of carbon dioxide and other pollutants into the upper atmosphere. There are also questions about safety regulations, as the industry remains largely self-regulated. Despite these concerns, the space tourism market is projected to reach $8 billion by 2030, signalling strong demand for out-of-this-world experiences.",
    wordCount: 160,
    level: "B2",
    questions: [
      { question: "How much does a suborbital flight ticket cost approximately?", options: ["$50,000-$100,000", "$100,000-$200,000", "$250,000-$450,000", "$500,000-$1 million"], correct: 2 },
      { question: "What environmental concern is raised about space tourism?", options: ["Noise pollution", "Water pollution", "Rocket launch emissions", "Light pollution"], correct: 2 },
      { question: "What is the projected market value by 2030?", options: ["$2 billion", "$5 billion", "$8 billion", "$12 billion"], correct: 2 },
    ]
  },
  {
    id: 14,
    title: "Urban Farming",
    text: "Urban farming is transforming city landscapes around the world, turning rooftops, abandoned lots, and even underground spaces into productive agricultural sites. This movement addresses multiple challenges simultaneously: reducing the environmental footprint of food transportation, improving access to fresh produce in food deserts, and creating green spaces that enhance urban biodiversity. Vertical farming, a key innovation in this field, uses stacked growing systems with controlled lighting and irrigation to produce crops year-round, using up to 95% less water than traditional agriculture. Cities like Singapore, Tokyo, and Amsterdam have embraced urban farming as part of their sustainability strategies. Community gardens, another form of urban agriculture, provide social benefits including neighbourhood cohesion, mental health improvement, and educational opportunities for children. While urban farming cannot fully replace rural agriculture, it offers a valuable complement that can strengthen local food systems and increase resilience against supply chain disruptions.",
    wordCount: 150,
    level: "B1",
    questions: [
      { question: "How much less water can vertical farming use compared to traditional farming?", options: ["50% less", "75% less", "85% less", "95% less"], correct: 3 },
      { question: "Which of these is NOT mentioned as a benefit of urban farming?", options: ["Reducing food transport emissions", "Lower food prices", "Improving access to fresh produce", "Enhancing biodiversity"], correct: 1 },
      { question: "What social benefit do community gardens provide?", options: ["Tax benefits", "Neighbourhood cohesion", "Property value increase", "Traffic reduction"], correct: 1 },
    ]
  },
  {
    id: 15,
    title: "The Ethics of Artificial Intelligence",
    text: "As artificial intelligence systems become increasingly integrated into decision-making processes that affect human lives, questions about AI ethics have moved from academic discussions to urgent policy debates. Algorithmic bias, where AI systems reproduce or amplify existing societal prejudices, has been documented in areas ranging from criminal justice to hiring to healthcare. For instance, facial recognition systems have been shown to have significantly higher error rates for people with darker skin tones, raising serious concerns about their use in law enforcement. The question of accountability is equally pressing: when an autonomous system makes a harmful decision, who bears responsibility \u2013 the developer, the deploying organisation, or the algorithm itself? Efforts to address these challenges include the development of ethical AI frameworks, mandatory bias audits, and the establishment of regulatory bodies dedicated to AI governance. The European Union's AI Act, adopted in 2024, represents the world's first comprehensive legal framework for artificial intelligence, classifying AI systems by risk level and imposing corresponding obligations on developers and users.",
    wordCount: 168,
    level: "C1",
    questions: [
      { question: "What is algorithmic bias?", options: ["AI being too slow", "AI reproducing societal prejudices", "AI being too expensive", "AI replacing humans"], correct: 1 },
      { question: "What problem was found with facial recognition?", options: ["It is too slow", "Higher error rates for darker skin tones", "It uses too much power", "It cannot recognise faces"], correct: 1 },
      { question: "What does the EU's AI Act do?", options: ["Bans all AI", "Classifies AI by risk level", "Only regulates chatbots", "Promotes AI development only"], correct: 1 },
    ]
  },
]

export function TimedReading() {
  const [phase, setPhase] = useState<"select" | "reading" | "questions" | "result">("select")
  const [passage, setPassage] = useState<ReadingPassage | null>(null)
  const [readingTime, setReadingTime] = useState(0)
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [wpm, setWpm] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [usedIds, setUsedIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const startReading = (p: ReadingPassage) => {
    setPassage(p)
    setPhase("reading")
    setReadingTime(0)
    timerRef.current = setInterval(() => setReadingTime(t => t + 1), 1000)
  }

  const finishReading = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (passage) {
      const minutes = readingTime / 60
      setWpm(Math.round(passage.wordCount / (minutes || 0.01)))
    }
    setPhase("questions")
    setCurrentQ(0)
    setScore(0)
    setSelected(null)
    setShowAnswer(false)
    setAnswers([])
  }

  const handleAnswer = (idx: number) => {
    if (showAnswer || !passage) return
    setSelected(idx)
    setShowAnswer(true)
    const isCorrect = idx === passage.questions[currentQ].correct
    playSoundEffect(isCorrect ? "correct" : "wrong")
    if (isCorrect) setScore(s => s + 1)
    setAnswers(prev => [...prev, isCorrect])
  }

  const nextQuestion = () => {
    if (!passage) return
    if (currentQ < passage.questions.length - 1) {
      setCurrentQ(q => q + 1)
      setSelected(null)
      setShowAnswer(false)
    } else {
      // Award XP
      const xp = XP_REWARDS.reading_complete + (wpm > 200 ? XP_REWARDS.reading_fast : 0)
      const progress = addXp(xp, "reading")
      showXpToast(xp, wpm > 200 ? "Hızlı okuyucu!" : "Okuma tamamlandı!")
      const newA = checkAndUnlockAchievements(progress)
      for (const a of newA) showAchievementToast(a)
      setUsedIds(prev => { const s = new Set(prev); s.add(passage.id); return s })
      setPhase("result")
    }
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`

  const levelColors: Record<string, string> = {
    B1: "bg-emerald-100 text-emerald-700",
    B2: "bg-blue-100 text-blue-700",
    C1: "bg-purple-100 text-purple-700",
  }

  // Selection screen
  if (phase === "select") {
    const available = passages.filter(p => !usedIds.has(p.id))
    const display = available.length > 0 ? available : passages
    return (
      <div className="py-4">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <h3 className="font-serif text-lg">Zamanli Okuma</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Bir metin secin, okuyun ve anlama sorularini cevaplayin. Okuma hiziniz otomatik hesaplanir.</p>
        <div className="space-y-2">
          {display.map(p => (
            <button key={p.id} onClick={() => startReading(p)} className="w-full p-4 rounded-xl border-2 border-border hover:border-indigo-300 hover:bg-indigo-50/30 transition-all text-left active:scale-[0.98]">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{p.title}</span>
                <span className={cn("text-xs px-2 py-0.5 rounded-full font-bold", levelColors[p.level])}>{p.level}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{p.wordCount} kelime</span>
                <span>{p.questions.length} soru</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Reading phase
  if (phase === "reading" && passage) {
    return (
      <div className="py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-serif text-lg">{passage.title}</h3>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-mono font-bold">
            <Clock className="w-3.5 h-3.5" />
            {formatTime(readingTime)}
          </div>
        </div>
        <Card className="border border-border/50 mb-4 rounded-lg">
          <CardContent className="p-5">
            <p className="text-base leading-relaxed">{passage.text}</p>
          </CardContent>
        </Card>
        <Button onClick={finishReading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
          Okudum, Sorulara Gec <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    )
  }

  // Questions phase
  if (phase === "questions" && passage) {
    const q = passage.questions[currentQ]
    return (
      <div className="py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-serif text-lg">{passage.title}</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{currentQ + 1}/{passage.questions.length}</span>
            <div className="flex items-center gap-1 text-xs text-indigo-600 font-mono">
              <Gauge className="w-3.5 h-3.5" />{wpm} WPM
            </div>
          </div>
        </div>

        {/* Passage stays visible - collapsible on mobile */}
        <details className="mb-4 group" open>
          <summary className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none mb-2 hover:text-foreground transition-colors">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Metni goster/gizle</span>
          </summary>
          <Card className="border border-border/50 rounded-lg">
            <CardContent className="p-4 max-h-48 overflow-y-auto practice-scroll">
              <p className="text-sm leading-relaxed text-muted-foreground">{passage.text}</p>
            </CardContent>
          </Card>
        </details>

        <div className="h-1.5 bg-muted rounded-full mb-4 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-400 to-violet-500 rounded-full transition-all duration-500"
            style={{ width: `${((currentQ + (showAnswer ? 1 : 0)) / passage.questions.length) * 100}%` }} />
        </div>

        <Card className="border border-border/50 mb-3 rounded-lg">
          <CardContent className="p-5">
            <p className="font-medium mb-4">{q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, i) => {
                const isCorrect = i === q.correct
                const isSelected = selected === i
                return (
                  <button key={i} onClick={() => handleAnswer(i)} disabled={showAnswer}
                    className={cn(
                      "w-full p-3 rounded-lg text-sm font-medium transition-all border-2 text-left",
                      showAnswer && isCorrect && "bg-emerald-50 border-emerald-400 text-emerald-700",
                      showAnswer && isSelected && !isCorrect && "bg-red-50 border-red-400 text-red-700",
                      showAnswer && !isSelected && !isCorrect && "opacity-50 border-transparent",
                      !showAnswer && "border-border hover:border-indigo-300 hover:bg-indigo-50/50 active:scale-[0.98]"
                    )}>
                    <div className="flex items-center gap-2">
                      {showAnswer && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                      {showAnswer && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                      {opt}
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {showAnswer && (
          <Button onClick={nextQuestion} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
            {currentQ < passage.questions.length - 1 ? "Sonraki Soru" : "Sonuclari Gor"} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    )
  }

  // Result phase
  if (phase === "result" && passage) {
    const pct = Math.round((score / passage.questions.length) * 100)
    return (
      <Card className="border border-border/50 overflow-hidden rounded-lg">
        <div className="h-1.5 bg-muted"><div className="h-full bg-gradient-to-r from-indigo-400 to-violet-500 w-full" /></div>
        <CardContent className="p-6 text-center">
          <h4 className="font-serif text-xl mb-3">Okuma Tamamlandı!</h4>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xl font-bold text-indigo-600">{wpm}</p>
              <p className="text-[11px] text-muted-foreground">Kelime/dk</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xl font-bold text-emerald-600">%{pct}</p>
              <p className="text-[11px] text-muted-foreground">Anlama</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xl font-bold text-amber-600">{formatTime(readingTime)}</p>
              <p className="text-[11px] text-muted-foreground">Sure</p>
            </div>
          </div>
          <div className="flex justify-center gap-1 mb-4">
            {answers.map((c, i) => <div key={i} className={cn("w-8 h-2 rounded-full", c ? "bg-emerald-400" : "bg-red-300")} />)}
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={() => setPhase("select")} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              <ArrowRight className="w-4 h-4 mr-2" />Baska Metin Sec
            </Button>
            <Button onClick={() => { setUsedIds(new Set()); setPhase("select") }} variant="outline" className="w-full bg-transparent">
              <RotateCcw className="w-4 h-4 mr-2" />Tümü Sıfırla
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}
