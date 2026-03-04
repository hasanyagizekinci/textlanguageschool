"use client"

import { useState, useCallback, useRef, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowLeft, RotateCcw, Trophy, Timer, Zap, ChevronRight, Info, X } from "lucide-react"
import { addXp, XP_REWARDS } from "@/lib/xp-system"
import { showXpToast } from "@/components/xp-toast"

// ─── TYPES ────────────────────────────────────────────────
type QuestionType = "mcq" | "fill" | "error"

interface Question {
  id: number
  type: QuestionType
  prompt: string
  choices?: string[]
  answer: string
  explanation: string
}

type Difficulty = "warmup" | "standard" | "challenge"
type GamePhase = "start" | "playing" | "finished"

interface GameResult {
  score: number
  correct: number
  total: number
  accuracy: number
  timeSeconds: number
  maxStreak: number
}

// ─── QUESTION BANK (70 questions, A2-B2) ──────────────────
const QUESTIONS: Question[] = [
  // MCQ – Grammar (tenses)
  { id: 1, type: "mcq", prompt: "She _____ to Paris last summer.", choices: ["go", "goes", "went", "going"], answer: "went", explanation: "Past simple: irregular verb go → went." },
  { id: 2, type: "mcq", prompt: "I have _____ here for three years.", choices: ["live", "lived", "living", "lives"], answer: "lived", explanation: "Present perfect needs past participle: lived." },
  { id: 3, type: "mcq", prompt: "They _____ TV when I called.", choices: ["watch", "watched", "were watching", "are watching"], answer: "were watching", explanation: "Past continuous for an ongoing action interrupted by another." },
  { id: 4, type: "mcq", prompt: "By next year, she _____ her degree.", choices: ["finishes", "will finish", "will have finished", "finishing"], answer: "will have finished", explanation: "Future perfect for completed action before a future point." },
  { id: 5, type: "mcq", prompt: "If I _____ rich, I would travel the world.", choices: ["am", "was", "were", "be"], answer: "were", explanation: "Second conditional uses 'were' for all subjects." },

  // MCQ – Prepositions
  { id: 6, type: "mcq", prompt: "She arrived _____ the airport on time.", choices: ["in", "at", "on", "to"], answer: "at", explanation: "We arrive 'at' specific locations like airports." },
  { id: 7, type: "mcq", prompt: "He is interested _____ learning new languages.", choices: ["at", "for", "in", "on"], answer: "in", explanation: "Interested is followed by the preposition 'in'." },
  { id: 8, type: "mcq", prompt: "The book is _____ the table.", choices: ["in", "on", "at", "by"], answer: "on", explanation: "Objects on a surface use the preposition 'on'." },
  { id: 9, type: "mcq", prompt: "We depend _____ good weather for the picnic.", choices: ["at", "in", "for", "on"], answer: "on", explanation: "Depend is always followed by 'on'." },
  { id: 10, type: "mcq", prompt: "She is afraid _____ spiders.", choices: ["from", "of", "about", "with"], answer: "of", explanation: "Afraid is followed by 'of'." },

  // MCQ – Articles
  { id: 11, type: "mcq", prompt: "_____ sun rises in the east.", choices: ["A", "An", "The", "—"], answer: "The", explanation: "'The' is used for unique things (the sun, the moon)." },
  { id: 12, type: "mcq", prompt: "She is _____ honest person.", choices: ["a", "an", "the", "—"], answer: "an", explanation: "'An' before vowel sounds: honest starts with a vowel sound." },

  // MCQ – Vocabulary
  { id: 13, type: "mcq", prompt: "The opposite of 'generous' is _____.", choices: ["kind", "selfish", "brave", "polite"], answer: "selfish", explanation: "Generous = giving; selfish = thinking only of oneself." },
  { id: 14, type: "mcq", prompt: "A synonym for 'enormous' is _____.", choices: ["tiny", "huge", "narrow", "shallow"], answer: "huge", explanation: "Enormous and huge both mean very large." },
  { id: 15, type: "mcq", prompt: "Someone who fixes teeth is a _____.", choices: ["surgeon", "dentist", "pharmacist", "vet"], answer: "dentist", explanation: "A dentist specializes in dental care." },
  { id: 16, type: "mcq", prompt: "'Reluctant' means _____.", choices: ["eager", "unwilling", "fast", "polite"], answer: "unwilling", explanation: "Reluctant = not willing to do something." },
  { id: 17, type: "mcq", prompt: "The _____ of the movie was very unexpected.", choices: ["beginning", "cast", "outcome", "genre"], answer: "outcome", explanation: "Outcome = the result or ending of something." },

  // MCQ – Sentence completion
  { id: 18, type: "mcq", prompt: "Despite the rain, they _____ to go hiking.", choices: ["decided", "deciding", "decides", "decision"], answer: "decided", explanation: "Past simple after 'Despite + noun, subject + verb'." },
  { id: 19, type: "mcq", prompt: "He speaks English fluently _____ he has never been abroad.", choices: ["because", "although", "so", "therefore"], answer: "although", explanation: "'Although' introduces a contrast/concession." },
  { id: 20, type: "mcq", prompt: "The more you practice, the _____ you become.", choices: ["good", "better", "best", "well"], answer: "better", explanation: "'The more... the + comparative' pattern." },

  // MCQ – Mixed grammar B1-B2
  { id: 21, type: "mcq", prompt: "I wish I _____ speak Japanese.", choices: ["can", "could", "will", "may"], answer: "could", explanation: "'Wish + past simple' for unreal present desires." },
  { id: 22, type: "mcq", prompt: "The report _____ by the team last week.", choices: ["wrote", "was written", "has written", "writing"], answer: "was written", explanation: "Passive voice: was/were + past participle." },
  { id: 23, type: "mcq", prompt: "She asked me where I _____.", choices: ["live", "lived", "living", "was living"], answer: "lived", explanation: "Reported speech: present simple → past simple." },
  { id: 24, type: "mcq", prompt: "You _____ have told me earlier!", choices: ["should", "would", "can", "must"], answer: "should", explanation: "'Should have + past participle' for past regret." },
  { id: 25, type: "mcq", prompt: "He denied _____ the window.", choices: ["to break", "break", "breaking", "broke"], answer: "breaking", explanation: "'Deny' is followed by a gerund (-ing form)." },

  // MCQ – Vocabulary B2
  { id: 26, type: "mcq", prompt: "'Feasible' means _____.", choices: ["impossible", "possible to do", "unfair", "expensive"], answer: "possible to do", explanation: "Feasible = practical, achievable." },
  { id: 27, type: "mcq", prompt: "The word 'alleviate' means to _____.", choices: ["make worse", "reduce", "create", "ignore"], answer: "reduce", explanation: "Alleviate = make suffering less severe." },
  { id: 28, type: "mcq", prompt: "'Obsolete' means _____.", choices: ["modern", "outdated", "expensive", "popular"], answer: "outdated", explanation: "Obsolete = no longer in use, outdated." },
  { id: 29, type: "mcq", prompt: "A 'dilemma' is a situation where you must _____.", choices: ["celebrate", "choose between two difficult options", "sleep", "exercise"], answer: "choose between two difficult options", explanation: "Dilemma = a difficult choice between two things." },
  { id: 30, type: "mcq", prompt: "'Ambiguous' means _____.", choices: ["clear", "open to more than one meaning", "loud", "simple"], answer: "open to more than one meaning", explanation: "Ambiguous = having multiple possible meanings." },

  // Fenerbahce questions (3 total, scattered naturally)
  { id: 31, type: "mcq", prompt: "The Fenerbahce match _____ at 8 PM yesterday.", choices: ["starts", "started", "starting", "has started"], answer: "started", explanation: "Past simple for a specific time in the past." },
  { id: 32, type: "fill", prompt: "My friend has been a _____ (Fenerbahce) fan since childhood.", answer: "Fenerbahce", explanation: "Simple noun completion in a natural sentence." },
  { id: 33, type: "mcq", prompt: "Even though Fenerbahce lost, the fans _____ proud.", choices: ["remained", "remaining", "remains", "remain"], answer: "remained", explanation: "Past simple for a completed state after 'even though'." },

  // FILL – Grammar
  { id: 34, type: "fill", prompt: "She has never _____ (be) to Australia.", answer: "been", explanation: "Present perfect: have/has + past participle of 'be' = been." },
  { id: 35, type: "fill", prompt: "If it _____ (rain) tomorrow, we will stay home.", answer: "rains", explanation: "First conditional: If + present simple, will + base verb." },
  { id: 36, type: "fill", prompt: "He _____ (study) English for five years now.", answer: "has studied", explanation: "Present perfect for duration: has studied / has been studying." },
  { id: 37, type: "fill", prompt: "The children were _____ (play) in the park all afternoon.", answer: "playing", explanation: "Past continuous: were + verb-ing." },
  { id: 38, type: "fill", prompt: "She _____ (not / like) coffee.", answer: "doesn't like", explanation: "Present simple negative: doesn't + base verb." },
  { id: 39, type: "fill", prompt: "By the time we arrived, the movie _____ (already / start).", answer: "had already started", explanation: "Past perfect for an action completed before another past action." },
  { id: 40, type: "fill", prompt: "I look forward to _____ (hear) from you.", answer: "hearing", explanation: "'Look forward to' is followed by a gerund." },

  // FILL – Vocabulary
  { id: 41, type: "fill", prompt: "The opposite of 'ancient' is _____.", answer: "modern", explanation: "Ancient = very old; modern = current, new." },
  { id: 42, type: "fill", prompt: "A person who writes books is called an _____.", answer: "author", explanation: "Author = a writer of books or articles." },
  { id: 43, type: "fill", prompt: "Water _____ (freeze) at zero degrees Celsius.", answer: "freezes", explanation: "Present simple for scientific facts." },
  { id: 44, type: "fill", prompt: "You need a _____ to cut paper. (starts with 's')", answer: "scissors", explanation: "Scissors are used for cutting paper." },
  { id: 45, type: "fill", prompt: "The meeting was _____ (postpone) until next Monday.", answer: "postponed", explanation: "Passive: was + past participle." },

  // FILL – Prepositions & Collocations
  { id: 46, type: "fill", prompt: "She is good _____ mathematics. (preposition)", answer: "at", explanation: "'Good at' is the correct collocation." },
  { id: 47, type: "fill", prompt: "He is responsible _____ the project. (preposition)", answer: "for", explanation: "'Responsible for' is the correct collocation." },
  { id: 48, type: "fill", prompt: "They are proud _____ their achievement. (preposition)", answer: "of", explanation: "'Proud of' is the correct collocation." },

  // ERROR – Find the mistake
  { id: 49, type: "error", prompt: "Which word is wrong? 'She don't like vegetables.'", choices: ["She", "don't", "like", "vegetables"], answer: "don't", explanation: "Third person singular: She doesn't like vegetables." },
  { id: 50, type: "error", prompt: "Which word is wrong? 'He has went to the store.'", choices: ["He", "has", "went", "store"], answer: "went", explanation: "Present perfect needs past participle: He has gone." },
  { id: 51, type: "error", prompt: "Which word is wrong? 'They was happy about the news.'", choices: ["They", "was", "happy", "news"], answer: "was", explanation: "Plural subject needs 'were': They were happy." },
  { id: 52, type: "error", prompt: "Which word is wrong? 'I have much friends at school.'", choices: ["I", "much", "friends", "school"], answer: "much", explanation: "'Many' for countable nouns: I have many friends." },
  { id: 53, type: "error", prompt: "Which word is wrong? 'She can sings very well.'", choices: ["She", "can", "sings", "well"], answer: "sings", explanation: "After modal verbs use base form: She can sing." },
  { id: 54, type: "error", prompt: "Which word is wrong? 'He is more taller than his brother.'", choices: ["is", "more", "taller", "brother"], answer: "more", explanation: "Don't use 'more' with -er comparatives: He is taller." },
  { id: 55, type: "error", prompt: "Which word is wrong? 'We enjoyed to play football.'", choices: ["We", "enjoyed", "to play", "football"], answer: "to play", explanation: "'Enjoy' is followed by gerund: enjoyed playing." },

  // MCQ – More mixed
  { id: 56, type: "mcq", prompt: "Neither the teacher _____ the students were happy.", choices: ["or", "and", "nor", "but"], answer: "nor", explanation: "'Neither...nor' is the correct correlative conjunction." },
  { id: 57, type: "mcq", prompt: "_____ I were you, I would apologize.", choices: ["If", "When", "Unless", "Although"], answer: "If", explanation: "'If I were you' is a common second conditional phrase." },
  { id: 58, type: "mcq", prompt: "He is used to _____ early.", choices: ["wake", "waking", "woke", "woken"], answer: "waking", explanation: "'Used to + gerund' for habitual actions." },
  { id: 59, type: "mcq", prompt: "This is the house _____ I grew up.", choices: ["which", "where", "what", "who"], answer: "where", explanation: "'Where' for relative clauses about places." },
  { id: 60, type: "mcq", prompt: "She _____ rather stay home tonight.", choices: ["will", "would", "should", "can"], answer: "would", explanation: "'Would rather + base verb' for preferences." },

  // MCQ – Synonyms / Antonyms
  { id: 61, type: "mcq", prompt: "The antonym of 'brave' is _____.", choices: ["cowardly", "strong", "smart", "kind"], answer: "cowardly", explanation: "Brave = courageous; cowardly = lacking courage." },
  { id: 62, type: "mcq", prompt: "A synonym for 'purchase' is _____.", choices: ["sell", "buy", "rent", "borrow"], answer: "buy", explanation: "Purchase and buy mean the same thing." },
  { id: 63, type: "mcq", prompt: "'Tranquil' is closest in meaning to _____.", choices: ["noisy", "peaceful", "exciting", "dangerous"], answer: "peaceful", explanation: "Tranquil = calm and peaceful." },
  { id: 64, type: "mcq", prompt: "The antonym of 'temporary' is _____.", choices: ["short", "permanent", "fast", "weak"], answer: "permanent", explanation: "Temporary = lasting a short time; permanent = lasting forever." },

  // FILL – More
  { id: 65, type: "fill", prompt: "He apologized _____ being late. (preposition)", answer: "for", explanation: "'Apologize for' is the correct collocation." },
  { id: 66, type: "fill", prompt: "She _____ (teach) at this school since 2015.", answer: "has taught", explanation: "Present perfect for an action continuing from past to now." },
  { id: 67, type: "fill", prompt: "The opposite of 'dangerous' is _____.", answer: "safe", explanation: "Dangerous = risky; safe = free from harm." },

  // ERROR – More
  { id: 68, type: "error", prompt: "Which word is wrong? 'The informations are incorrect.'", choices: ["The", "informations", "are", "incorrect"], answer: "informations", explanation: "'Information' is uncountable: The information is incorrect." },
  { id: 69, type: "error", prompt: "Which word is wrong? 'She suggested me to go early.'", choices: ["She", "suggested", "me to go", "early"], answer: "me to go", explanation: "'Suggest' + gerund or 'that' clause: She suggested going early." },
  { id: 70, type: "error", prompt: "Which word is wrong? 'Despite of the rain, we went out.'", choices: ["Despite", "of", "rain", "went"], answer: "of", explanation: "'Despite' is used without 'of': Despite the rain." },
]

// ─── CONFIG ───────────────────────────────────────────────
const DIFFICULTY_CONFIG: Record<Difficulty, { checkpoints: number; label: string; desc: string }> = {
  warmup:    { checkpoints: 5,  label: "Isınma", desc: "5 soru, rahat tempo" },
  standard:  { checkpoints: 8,  label: "Standart", desc: "8 soru, dengeli" },
  challenge: { checkpoints: 12, label: "Meydan Okuma", desc: "12 soru, zorlu" },
}

const CEO_LINES = [
  "Ogrenmeyi bir CEO gibi yonetiyorsun.",
  "Hedefine dogru ilerliyorsun!",
  "Bilgi yolculugunda harika gidiyorsun.",
  "Her dogru cevap seni ileriye tasiyor.",
]
const EASTER_EGG_LINE = "CEO energy: on."

// ─── SVG COMPONENTS ───────────────────────────────────────
function CeoGirlOnScooter({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 100" className={className} aria-label="CEO girl on scooter">
      {/* Scooter body - blue three-wheeler */}
      <g>
        {/* Deck */}
        <rect x="30" y="68" width="55" height="6" rx="3" fill="#3B82F6" />
        {/* Front fork */}
        <line x1="80" y1="68" x2="88" y2="56" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
        {/* Handlebar */}
        <line x1="83" y1="54" x2="93" y2="54" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
        {/* Handlebar grip */}
        <circle cx="93" cy="54" r="2" fill="#334155" />
        {/* Rear fork */}
        <line x1="35" y1="71" x2="28" y2="82" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="45" y1="71" x2="42" y2="82" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
        {/* Front wheel */}
        <circle cx="88" cy="86" r="8" fill="none" stroke="#1E40AF" strokeWidth="3" className="scooter-wheel" />
        <circle cx="88" cy="86" r="2" fill="#1E40AF" />
        {/* Rear wheels (two) */}
        <circle cx="28" cy="86" r="7" fill="none" stroke="#1E40AF" strokeWidth="3" className="scooter-wheel" />
        <circle cx="28" cy="86" r="2" fill="#1E40AF" />
        <circle cx="42" cy="86" r="7" fill="none" stroke="#1E40AF" strokeWidth="3" className="scooter-wheel" />
        <circle cx="42" cy="86" r="2" fill="#1E40AF" />
      </g>
      {/* CEO Girl */}
      <g>
        {/* Legs */}
        <line x1="62" y1="58" x2="58" y2="68" stroke="#F5D0A9" strokeWidth="3" strokeLinecap="round" />
        <line x1="68" y1="58" x2="72" y2="68" stroke="#F5D0A9" strokeWidth="3" strokeLinecap="round" />
        {/* Body / CEO T-shirt */}
        <rect x="56" y="38" width="18" height="22" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="0.5" />
        {/* CEO text on shirt */}
        <text x="65" y="52" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#3B82F6" fontFamily="sans-serif">CEO</text>
        {/* Arms */}
        <line x1="56" y1="42" x2="48" y2="52" stroke="#F5D0A9" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="74" y1="42" x2="86" y2="54" stroke="#F5D0A9" strokeWidth="2.5" strokeLinecap="round" />
        {/* Neck */}
        <line x1="65" y1="34" x2="65" y2="38" stroke="#F5D0A9" strokeWidth="3" strokeLinecap="round" />
        {/* Head */}
        <circle cx="65" cy="27" r="10" fill="#F5D0A9" />
        {/* Hair (bob) */}
        <path d="M55 24 Q55 14 65 14 Q75 14 75 24 L75 28 Q73 30 75 32 L75 24 Q73 18 65 18 Q57 18 55 24 Z" fill="#4A3728" />
        <path d="M55 24 L53 32 Q54 34 56 30 Z" fill="#4A3728" />
        {/* Eyes */}
        <circle cx="61" cy="26" r="1.2" fill="#334155" />
        <circle cx="69" cy="26" r="1.2" fill="#334155" />
        {/* Smile */}
        <path d="M62 30 Q65 33 68 30" fill="none" stroke="#334155" strokeWidth="0.8" strokeLinecap="round" />
      </g>
    </svg>
  )
}

function CeoGirlCelebrating({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 100" className={className} aria-label="CEO girl celebrating">
      <g>
        {/* Body / CEO T-shirt */}
        <rect x="46" y="42" width="28" height="28" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="0.5" />
        <text x="60" y="60" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#3B82F6" fontFamily="sans-serif">CEO</text>
        {/* Arms up */}
        <line x1="46" y1="48" x2="32" y2="28" stroke="#F5D0A9" strokeWidth="3" strokeLinecap="round" />
        <line x1="74" y1="48" x2="88" y2="28" stroke="#F5D0A9" strokeWidth="3" strokeLinecap="round" />
        {/* Hands */}
        <circle cx="31" cy="26" r="3" fill="#F5D0A9" />
        <circle cx="89" cy="26" r="3" fill="#F5D0A9" />
        {/* Neck */}
        <line x1="60" y1="36" x2="60" y2="42" stroke="#F5D0A9" strokeWidth="3.5" strokeLinecap="round" />
        {/* Head */}
        <circle cx="60" cy="27" r="12" fill="#F5D0A9" />
        {/* Hair (bob) */}
        <path d="M48 24 Q48 12 60 12 Q72 12 72 24 L72 28 Q70 30 72 34 L72 24 Q70 16 60 16 Q50 16 48 24 Z" fill="#4A3728" />
        <path d="M48 24 L45 34 Q47 36 49 30 Z" fill="#4A3728" />
        {/* Happy eyes */}
        <path d="M55 25 Q57 23 59 25" fill="none" stroke="#334155" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M61 25 Q63 23 65 25" fill="none" stroke="#334155" strokeWidth="1.2" strokeLinecap="round" />
        {/* Big smile */}
        <path d="M54 31 Q60 37 66 31" fill="none" stroke="#334155" strokeWidth="1" strokeLinecap="round" />
        {/* Legs */}
        <line x1="52" y1="70" x2="48" y2="88" stroke="#F5D0A9" strokeWidth="3" strokeLinecap="round" />
        <line x1="68" y1="70" x2="72" y2="88" stroke="#F5D0A9" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  )
}

function CheckpointIcon({ reached, current }: { reached: boolean; current: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden>
      {current ? (
        <circle cx="12" cy="12" r="9" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" className="animate-pulse" />
      ) : reached ? (
        <>
          <circle cx="12" cy="12" r="9" fill="#10B981" stroke="#059669" strokeWidth="1.5" />
          <path d="M8 12 L11 15 L16 9" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : (
        <circle cx="12" cy="12" r="7" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />
      )}
    </svg>
  )
}

// ─── SPARKLE + SNOWFLAKE micro-reward ─────────────────────
function MicroReward({ show }: { show: boolean }) {
  if (!show) return null
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
      <div className="scooter-sparkle absolute">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className="absolute inline-block w-2 h-2 rounded-full bg-blue-400 opacity-0"
            style={{
              animation: `scooter-sparkle-pop 0.7s ease-out ${i * 80}ms forwards`,
              left: `${40 + Math.cos(i * 1.2) * 30}%`,
              top: `${40 + Math.sin(i * 1.5) * 25}%`,
            }}
          />
        ))}
      </div>
      <svg viewBox="0 0 24 24" width={28} height={28} className="absolute scooter-snowflake-melt" style={{ top: "15%", right: "20%" }}>
        <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9L4.9 19.1" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  )
}

// ─── PATH COMPONENT ───────────────────────────────────────
function ScooterPath({ checkpoints, currentCheckpoint }: { checkpoints: number; currentCheckpoint: number }) {
  const pathWidth = 100
  const gap = pathWidth / (checkpoints - 1)
  const riderPos = Math.min(currentCheckpoint, checkpoints - 1) * gap

  return (
    <div className="relative w-full px-2 py-4 overflow-hidden">
      {/* Road */}
      <div className="relative h-28 flex items-end">
        {/* Track line */}
        <div className="absolute bottom-8 left-4 right-4 h-1 bg-border rounded-full" />
        {/* Progress fill */}
        <div
          className="absolute bottom-8 left-4 h-1 bg-blue-400 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${(riderPos / pathWidth) * 100}%` }}
        />
        {/* Checkpoints */}
        <div className="absolute bottom-5 left-4 right-4 flex justify-between">
          {Array.from({ length: checkpoints }).map((_, i) => (
            <CheckpointIcon key={i} reached={i < currentCheckpoint} current={i === currentCheckpoint} />
          ))}
        </div>
        {/* Rider */}
        <div
          className="absolute bottom-10 transition-all duration-700 ease-out scooter-bob"
          style={{ left: `calc(${(riderPos / pathWidth) * 100}% + 4px - 28px)` }}
        >
          <CeoGirlOnScooter className="w-14 h-14" />
        </div>
      </div>
      {/* Checkpoint labels */}
      <div className="flex justify-between px-4 mt-1">
        <span className="text-xs text-muted-foreground">Start</span>
        <span className="text-xs text-muted-foreground">Finish</span>
      </div>
    </div>
  )
}

// ─── QUESTION CARD ────────────────────────────────────────
function QuestionCard({
  question,
  onAnswer,
  feedback,
  showExplanation,
  timerEnabled,
  timerSeconds,
}: {
  question: Question
  onAnswer: (answer: string) => void
  feedback: "correct" | "wrong" | "retry" | null
  showExplanation: boolean
  timerEnabled: boolean
  timerSeconds: number
}) {
  const [fillInput, setFillInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setFillInput("")
    if (question.type === "fill") {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [question.id, question.type])

  const typeLabel = question.type === "mcq" ? "Coktan secmeli" : question.type === "fill" ? "Bosluk doldur" : "Hata bul"

  return (
    <Card className="border-border/60 shadow-sm">
      <CardContent className="p-4 md:p-6">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-md">{typeLabel}</span>
          {timerEnabled && (
            <span className={cn("flex items-center gap-1 text-xs font-semibold tabular-nums", timerSeconds <= 4 ? "text-red-500" : "text-muted-foreground")}>
              <Timer className="w-3.5 h-3.5" />
              {timerSeconds}s
            </span>
          )}
        </div>

        {/* Prompt */}
        <p className="text-base md:text-lg font-medium text-foreground leading-relaxed mb-4">{question.prompt}</p>

        {/* Choices */}
        {(question.type === "mcq" || question.type === "error") && question.choices && (
          <div className="grid grid-cols-1 gap-2">
            {question.choices.map((c, i) => {
              const isCorrectChoice = c === question.answer
              const isSelected = feedback !== null
              return (
                <button
                  key={i}
                  disabled={feedback === "correct" || showExplanation}
                  onClick={() => onAnswer(c)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all",
                    "hover:border-blue-300 hover:bg-blue-50/50 active:scale-[0.98]",
                    isSelected && isCorrectChoice && "border-green-400 bg-green-50 text-green-800",
                    isSelected && !isCorrectChoice && feedback !== null && "opacity-60",
                    feedback === "wrong" && !isCorrectChoice && "border-border",
                    !isSelected && "border-border bg-background text-foreground"
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full border border-current/20 flex items-center justify-center text-xs shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {c}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {/* Fill input */}
        {question.type === "fill" && (
          <form
            onSubmit={(e) => { e.preventDefault(); if (fillInput.trim()) onAnswer(fillInput.trim()) }}
            className="flex gap-2"
          >
            <input
              ref={inputRef}
              value={fillInput}
              onChange={(e) => setFillInput(e.target.value)}
              disabled={feedback === "correct" || showExplanation}
              placeholder="Cevabini yaz..."
              className={cn(
                "flex-1 px-4 py-3 rounded-lg border text-sm font-medium bg-background text-foreground transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-blue-300",
                feedback === "correct" && "border-green-400 bg-green-50",
                feedback === "wrong" && "border-red-300 bg-red-50/50"
              )}
              autoComplete="off"
              autoCapitalize="off"
            />
            <Button type="submit" size="sm" disabled={!fillInput.trim() || feedback === "correct" || showExplanation} className="px-4">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </form>
        )}

        {/* Feedback */}
        {feedback === "correct" && (
          <div className="mt-3 flex items-center gap-2 text-green-600 text-sm font-medium animate-fade-up">
            <Zap className="w-4 h-4" /> Dogru!
          </div>
        )}
        {feedback === "retry" && (
          <div className="mt-3 text-amber-600 text-sm font-medium animate-fade-up">
            Tekrar dene!
          </div>
        )}
        {showExplanation && (
          <div className="mt-3 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground animate-fade-up">
            <strong>Cevap:</strong> {question.answer} &mdash; {question.explanation}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ─── RESULTS SCREEN ───────────────────────────────────────
function ResultsScreen({ result, onReplay, onChangeMode }: { result: GameResult; onReplay: () => void; onChangeMode: () => void }) {
  const line = useMemo(() => {
    if (Math.random() < 0.125) return EASTER_EGG_LINE
    return CEO_LINES[Math.floor(Math.random() * CEO_LINES.length)]
  }, [])

  return (
    <div className="flex flex-col items-center gap-6 py-6 animate-fade-up">
      <CeoGirlCelebrating className="w-32 h-32" />
      <p className="text-lg font-serif font-bold text-foreground text-center text-balance">{line}</p>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        <StatBox label="Puan" value={result.score} />
        <StatBox label="Dogruluk" value={`%${result.accuracy}`} />
        <StatBox label="Sure" value={`${result.timeSeconds}s`} />
        <StatBox label="En iyi seri" value={`x${result.maxStreak}`} />
      </div>

      <div className="flex gap-3 w-full max-w-xs">
        <Button variant="outline" onClick={onChangeMode} className="flex-1 gap-2">
          <ArrowLeft className="w-4 h-4" /> Mod Sec
        </Button>
        <Button onClick={onReplay} className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <RotateCcw className="w-4 h-4" /> Tekrar
        </Button>
      </div>
    </div>
  )
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center p-3 bg-muted/50 rounded-xl border border-border/40">
      <span className="text-2xl font-bold text-foreground tabular-nums">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

// ─── GAME HOOK ────────────────────────────────────────────
function useScooterRideGame() {
  const [phase, setPhase] = useState<GamePhase>("start")
  const [difficulty, setDifficulty] = useState<Difficulty>("standard")
  const [timerEnabled, setTimerEnabled] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [feedback, setFeedback] = useState<"correct" | "wrong" | "retry" | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [retryUsed, setRetryUsed] = useState(false)
  const [showReward, setShowReward] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(12)
  const [result, setResult] = useState<GameResult | null>(null)
  const startTimeRef = useRef(0)
  const questionStartRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const totalCheckpoints = DIFFICULTY_CONFIG[difficulty].checkpoints

  const startGame = useCallback((diff: Difficulty, timer: boolean) => {
    setDifficulty(diff)
    setTimerEnabled(timer)
    const count = DIFFICULTY_CONFIG[diff].checkpoints
    // Shuffle and pick
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, count)
    setQuestions(shuffled)
    setCurrentIdx(0)
    setScore(0)
    setCorrectCount(0)
    setStreak(0)
    setMaxStreak(0)
    setFeedback(null)
    setShowExplanation(false)
    setRetryUsed(false)
    setShowReward(false)
    setResult(null)
    setTimerSeconds(12)
    startTimeRef.current = Date.now()
    questionStartRef.current = Date.now()
    setPhase("playing")
  }, [])

  const finishGame = useCallback((finalScore: number, finalCorrect: number, finalMaxStreak: number, totalQs: number) => {
    if (timerRef.current) clearInterval(timerRef.current)
    const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000)
    const accuracy = totalQs > 0 ? Math.round((finalCorrect / totalQs) * 100) : 0
    const gameResult: GameResult = {
      score: finalScore,
      correct: finalCorrect,
      total: totalQs,
      accuracy,
      timeSeconds: elapsed,
      maxStreak: finalMaxStreak,
    }
    setResult(gameResult)
    setPhase("finished")

    // Award XP
    try {
      const xpAmount = accuracy >= 90 ? XP_REWARDS.exam_perfect : XP_REWARDS.exam_complete
      const r = addXp(xpAmount, "scooter_ride")
      showXpToast(xpAmount, r)
    } catch { /* XP system not critical */ }
  }, [])

  const advance = useCallback(() => {
    const nextIdx = currentIdx + 1
    if (nextIdx >= questions.length) {
      finishGame(score, correctCount, maxStreak, questions.length)
    } else {
      setCurrentIdx(nextIdx)
      setFeedback(null)
      setShowExplanation(false)
      setRetryUsed(false)
      setShowReward(false)
      setTimerSeconds(12)
      questionStartRef.current = Date.now()
    }
  }, [currentIdx, questions.length, score, correctCount, maxStreak, finishGame])

  const handleAnswer = useCallback((answer: string) => {
    if (feedback === "correct" || showExplanation) return
    const q = questions[currentIdx]
    const isCorrect = answer.toLowerCase().trim() === q.answer.toLowerCase().trim()

    if (isCorrect) {
      const elapsed = (Date.now() - questionStartRef.current) / 1000
      let pts = 10
      if (elapsed < 5) pts += 5 // speed bonus
      const newStreak = streak + 1
      if (newStreak > 3) pts += 2 * (newStreak - 3)
      setScore(s => s + pts)
      setCorrectCount(c => c + 1)
      setStreak(newStreak)
      setMaxStreak(ms => Math.max(ms, newStreak))
      setFeedback("correct")
      setShowReward(true)
      setTimeout(() => setShowReward(false), 800)
      setTimeout(advance, 1200)
    } else {
      setStreak(0)
      if (!retryUsed) {
        setFeedback("retry")
        setRetryUsed(true)
        setTimeout(() => setFeedback(null), 600)
      } else {
        setFeedback("wrong")
        setShowExplanation(true)
        setTimeout(advance, 2500)
      }
    }
  }, [feedback, showExplanation, questions, currentIdx, streak, retryUsed, advance])

  // Timer effect
  useEffect(() => {
    if (phase !== "playing" || !timerEnabled) return
    if (feedback === "correct" || showExplanation) return

    timerRef.current = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          // Time's up - show explanation and move on
          setFeedback("wrong")
          setShowExplanation(true)
          setStreak(0)
          setTimeout(advance, 2500)
          if (timerRef.current) clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [phase, timerEnabled, currentIdx, feedback, showExplanation, advance])

  const goToStart = useCallback(() => {
    setPhase("start")
    setResult(null)
  }, [])

  return {
    phase, difficulty, timerEnabled, questions, currentIdx, score, streak,
    maxStreak, feedback, showExplanation, showReward, timerSeconds,
    result, totalCheckpoints,
    startGame, handleAnswer, goToStart,
    setTimerEnabled,
  }
}

// ─── MAIN COMPONENT ──────────────────────────────────────
export function ScooterRide() {
  const game = useScooterRideGame()
  const [showHelp, setShowHelp] = useState(false)

  // START SCREEN
  if (game.phase === "start") {
    return (
      <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-6 py-8 px-4">
        {/* Title area */}
        <div className="text-center">
          <CeoGirlOnScooter className="w-24 h-24 mx-auto mb-2 scooter-bob" />
          <h2 className="text-2xl font-serif font-bold text-foreground">Scooter Ride</h2>
          <p className="text-sm text-muted-foreground mt-1">Hizli cevapla. Daha uzaga sur.</p>
        </div>

        {/* Difficulty buttons */}
        <div className="w-full space-y-2">
          {(["warmup", "standard", "challenge"] as Difficulty[]).map((diff) => {
            const cfg = DIFFICULTY_CONFIG[diff]
            return (
              <button
                key={diff}
                onClick={() => game.startGame(diff, game.timerEnabled)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all",
                  "hover:border-blue-300 hover:bg-blue-50/40 active:scale-[0.98]",
                  "border-border bg-background text-foreground"
                )}
              >
                <div className="text-left">
                  <span className="font-semibold text-sm">{cfg.label}</span>
                  <span className="block text-xs text-muted-foreground">{cfg.desc}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            )
          })}
        </div>

        {/* Timer toggle */}
        <button
          onClick={() => game.setTimerEnabled(e => !e)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all",
            game.timerEnabled
              ? "border-blue-300 bg-blue-50 text-blue-700"
              : "border-border text-muted-foreground"
          )}
        >
          <Timer className="w-4 h-4" />
          Zamanlayici: {game.timerEnabled ? "Acik (12s)" : "Kapali"}
        </button>

        {/* How it works */}
        <button onClick={() => setShowHelp(h => !h)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
          <Info className="w-3.5 h-3.5" /> Nasil oynanir?
        </button>
        {showHelp && (
          <Card className="w-full border-border/60 animate-fade-up">
            <CardContent className="p-4 text-sm text-muted-foreground space-y-1.5">
              <div className="flex justify-between items-start">
                <p className="font-medium text-foreground">Kurallar</p>
                <button onClick={() => setShowHelp(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
              </div>
              <p>Her dogru cevap scooter'i bir sonraki noktaya tasir.</p>
              <p>Yanlis cevaplarda 1 tekrar hakkin var, sonra dogru cevap gosterilir.</p>
              <p>Hizli cevaplarsan bonus puan kazanirsin.</p>
              <p>Art arda dogru cevaplar seri bonusu verir.</p>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // FINISHED SCREEN
  if (game.phase === "finished" && game.result) {
    return (
      <div className="w-full max-w-lg mx-auto px-4">
        <ResultsScreen
          result={game.result}
          onReplay={() => game.startGame(game.difficulty, game.timerEnabled)}
          onChangeMode={game.goToStart}
        />
      </div>
    )
  }

  // PLAYING SCREEN
  const currentQ = game.questions[game.currentIdx]
  if (!currentQ) return null

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-3 px-4 py-2">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button onClick={game.goToStart} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Cikis
        </button>
        <div className="flex items-center gap-3">
          {game.streak >= 2 && (
            <span className="flex items-center gap-1 text-xs font-bold text-amber-600 animate-bounce-subtle">
              <Zap className="w-3.5 h-3.5" /> Seri x{game.streak}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs font-semibold text-foreground tabular-nums">
            <Trophy className="w-3.5 h-3.5 text-blue-500" /> {game.score}
          </span>
        </div>
      </div>

      {/* Path */}
      <div className="relative">
        <ScooterPath checkpoints={game.totalCheckpoints} currentCheckpoint={game.currentIdx} />
        <MicroReward show={game.showReward} />
      </div>

      {/* Progress text */}
      <p className="text-center text-xs text-muted-foreground">
        Soru {game.currentIdx + 1} / {game.questions.length}
      </p>

      {/* Question */}
      <QuestionCard
        question={currentQ}
        onAnswer={game.handleAnswer}
        feedback={game.feedback}
        showExplanation={game.showExplanation}
        timerEnabled={game.timerEnabled}
        timerSeconds={game.timerSeconds}
      />
    </div>
  )
}
