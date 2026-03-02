"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Mic, MicOff, RotateCcw, Globe, ChevronRight, Volume2,
  AlertCircle, Loader2, CheckCircle2, Share2, Copy, Check,
  MessageCircle, Send, BookOpen
} from "lucide-react"
import { cn } from "@/lib/utils"
import { addXp, checkAndUnlockAchievements, XP_REWARDS } from "@/lib/xp-system"
import { showXpToast, showAchievementToast, playSoundEffect } from "@/components/xp-toast"

/* ═══════════════════════════════════════════
   ACCENT PROFILES
   ═══════════════════════════════════════════ */
interface AccentProfile {
  id: string
  label: string
  labelTR: string
  description: string
  markers: string[]
  color: string
}

const PROFILES: AccentProfile[] = [
  {
    id: "turkish_standard",
    label: "Turkish Standard",
    labelTR: "Standart Türk Aksanı",
    description: "Türkçe ana dil konuşanlarının tipik İngilizce aksanı. TH/W/V zorlukları, hece zamanlı ritim ve ünsüz kümesi sorunları birlikte görülür.",
    markers: ["TH -> T/F ikamesi", "W -> V ikamesi", "Hece zamanlı ritim", "Ünsüz kümesi sadeleştirme"],
    color: "bg-rose-500",
  },
  {
    id: "turkish_educated",
    label: "Turkish Educated",
    labelTR: "Eğitimli Türk Aksanı",
    description: "İyi düzeyde İngilizce eğitimi almış Türk konuşanlar. TH/W sesleri büyük ölçüde doğru, ancak tonlama ve ritimde Türkçe etkisi devam ediyor.",
    markers: ["Hafif Türkçe tonlama", "İyi ünsüz telaffuzu", "Doğal ritim çabası"],
    color: "bg-pink-500",
  },
  {
    id: "stress_intonation",
    label: "Stress/Intonation",
    labelTR: "Vurgu ve Tonlama Odaklı",
    description: "Cümle melodisi düz, hece zamanlaması eşit. İngilizce'nin stress-timed ritmini yakalamakta zorluk. Türkçe konuşanlarda sık görülür.",
    markers: ["Düşük pitch varyansı", "Eşit hece zamanlaması", "Monoton tonlama"],
    color: "bg-amber-500",
  },
  {
    id: "vowel_cluster",
    label: "Vowel Insertion / Clusters",
    labelTR: "Ünsüz Kümeleri Odaklı",
    description: "Ünsüz kümelerinin arasına sesli harf ekleme eğilimi (\"worked\" -> \"workıd\", \"street\" -> \"sitreet\"). Türkçe ve Farsça konuşanlarda yaygın.",
    markers: ["Ekstra hece ekleme", "Ünsüz kümesi sadeleştirme", "Epenthesis"],
    color: "bg-violet-500",
  },
  {
    id: "iranian",
    label: "Iranian-influenced",
    labelTR: "İran/Farsça Etkili",
    description: "Farsça konuşanların İngilizce aksanıyla benzerlikler: W->V ikamesi, /æ/ sesinde zorluk, güçlü gutural sesler ve R telaffuzu.",
    markers: ["W -> V ikamesi", "Gutural R", "/æ/ -> /e/ ikamesi", "Güçlü vurgu"],
    color: "bg-orange-500",
  },
  {
    id: "arabic",
    label: "Arabic-influenced",
    labelTR: "Arapça Etkili",
    description: "Arapça konuşanlara özgü kalıplar: P->B ikamesi, gutural sesler, farklı ünlü uzunlukları ve belirgin emfatik ünsüzler.",
    markers: ["Gutural sesler", "P -> B ikamesi", "Emfatik ünsüzler", "Farklı ünlü kalıpları"],
    color: "bg-yellow-600",
  },
  {
    id: "russian_caucasus",
    label: "Russian / Caucasus",
    labelTR: "Rusça / Kafkas Etkili",
    description: "Rusça veya Kafkas dillerinin etkisi: TH -> Z/S ikamesi, sert ünsüz telaffuzu, belirgin rhotik R ve farklı sesli harf kalıpları.",
    markers: ["TH -> Z/S ikamesi", "Sert ünsüzler", "Güçlü rhotik R", "Farklı ünlü uzunlukları"],
    color: "bg-teal-500",
  },
  {
    id: "balkan",
    label: "Balkan-influenced",
    labelTR: "Balkan Etkili",
    description: "Balkan dillerinin etkisi: Açık ünlüler, belirgin R sesi, ritmik konuşma ve düz tonlama.",
    markers: ["Açık ünlüler", "Belirgin trilli R", "Ritmik konuşma", "W -> V eğilimi"],
    color: "bg-indigo-500",
  },
  {
    id: "greek",
    label: "Greek-influenced",
    labelTR: "Yunanca Etkili",
    description: "Yunanca konuşanların etkisi: Sesli harf ekleme, farklı S/Z telaffuzu, melodili tonlama ve belirgin vurgu kalıpları.",
    markers: ["Sesli harf ekleme", "Melodili tonlama", "Farklı S/Z sesleri", "Güçlü vurgu"],
    color: "bg-cyan-500",
  },
  {
    id: "american",
    label: "American-influenced",
    labelTR: "Amerikan Etkili",
    description: "Amerikan medya ve dizi maruziyeti ile oluşan telaffuz kalıpları. Rhotik /r/ kullanımı, flat A sesleri.",
    markers: ["Rhotik R", "Flat A sesleri", "T flapping"],
    color: "bg-blue-500",
  },
  {
    id: "british",
    label: "British-influenced",
    labelTR: "İngiliz Etkili",
    description: "İngiliz İngilizcesi maruziyeti ile oluşan kalıplar. Non-rhotik /r/, uzun A sesleri.",
    markers: ["Non-rhotik R", "Uzun A sesleri", "Glottal stop"],
    color: "bg-sky-500",
  },
]

/* ═══════════════════════════════════════════
   READING SCRIPT
   ═══════════════════════════════════════════ */
const READING_SCRIPTS = [
  {
    id: "classic",
    title: "TH & W/V Odaklı",
    titleEN: "Classic",
    text: "Three thoughtful thinkers thought through tough themes. We visited a very windy valley. I worked on a new website and I want to improve my pronunciation.",
    focus: ["TH sesleri", "W/V ayrımı", "Ünsüz kümeleri"],
  },
  {
    id: "weather",
    title: "Hava Durumu",
    titleEN: "Weather Report",
    text: "The weather this Thursday was thoroughly terrible. Thirty thousand people braved the wind and rain. Whether we like it or not, winter is coming with a vengeance.",
    focus: ["TH tekrarı", "W/Wh sesleri", "Vurgu kalıpları"],
  },
  {
    id: "travel",
    title: "Seyahat Hikayesi",
    titleEN: "Travel Story",
    text: "We traveled through three countries last summer. The villages were very beautiful with their wooden houses. I think the best thing about traveling is meeting new people everywhere.",
    focus: ["TH/V/W karışık", "Geçmiş zaman -ed", "Doğal konuşma ritmi"],
  },
  {
    id: "work",
    title: "İş Hayatı",
    titleEN: "Work Life",
    text: "My brother works at a software development company. He thinks the world of technology is both thrilling and overwhelming. Every Wednesday they have virtual meetings with twelve other teams.",
    focus: ["Ünsüz kümeleri", "Hece vurgusu", "Sayılar ve W sesleri"],
  },
  {
    id: "food",
    title: "Yemek ve Kültür",
    titleEN: "Food & Culture",
    text: "Turkish cuisine is famous throughout the whole world. Fresh vegetables, thick yogurt, and warm bread with butter are served everywhere. Nothing is more satisfying than a well-prepared traditional meal.",
    focus: ["TH çeşitleri", "W sesleri", "Ünlü uzunlukları"],
  },
  {
    id: "education",
    title: "Eğitim",
    titleEN: "Education",
    text: "Mathematics and science require both theoretical knowledge and practical skills. Students who think critically and work hard often achieve remarkable things. The truth is that learning never really stops.",
    focus: ["Akademik kelimeler", "TH/W yoğun", "Cümle melodisi"],
  },
  {
    id: "nature",
    title: "Doğa ve Çevre",
    titleEN: "Nature",
    text: "Thousands of species thrive in the vast wilderness. The growth of cities threatens their natural habitats. We should think carefully about how we treat the earth beneath our feet.",
    focus: ["TH tekrarı", "Ünsüz kümeleri (thr/str)", "Tonlama"],
  },
  {
    id: "sports",
    title: "Spor",
    titleEN: "Sports",
    text: "Watching football with friends is something I truly value. The stadium was full of enthusiastic supporters waving their scarves. With every goal, thousands of voices would erupt together in celebration.",
    focus: ["V/W ayrımı", "Ünlü çeşitliliği", "Doğal ritim"],
  },
  {
    id: "technology",
    title: "Teknoloji",
    titleEN: "Technology",
    text: "Virtual reality and artificial intelligence are reshaping everything. Researchers believe that within thirty years, machines will think and reason with astonishing depth. The growth of these technologies is both wonderful and somewhat frightening.",
    focus: ["Teknik terimler", "TH/W/V tam karışım", "Uzun cümle nefesi"],
  },
  {
    id: "story",
    title: "Kısa Hikaye",
    titleEN: "Short Story",
    text: "There was an old woman who lived in a small village near the river. Every morning she would walk through the thick forest to gather wild berries. The path was narrow, the weather was harsh, but nothing could stop her from this cherished routine.",
    focus: ["Hikaye anlatımı", "W/TH doğal akış", "Tonlama ve ritim"],
  },
]

/* Key words we check for substitution patterns */
const TH_WORDS = ["three", "thoughtful", "thinkers", "thought", "through", "tough", "themes"]
const WV_WORDS = [{ expected: "windy", vSub: "vindy" }, { expected: "we", vSub: "ve" }, { expected: "want", vSub: "vant" }, { expected: "website", vSub: "vebsite" }, { expected: "worked", vSub: "vorked" }]
const CLUSTER_WORDS = ["three", "through", "tough", "themes", "worked", "website", "improve", "pronunciation"]

/* ═══════════════════════════════════════════
   DRILL DEFINITIONS
   ═══════════════════════════════════════════ */
interface Drill {
  id: string
  title: string
  description: string
  examples: string[]
  profileIds: string[]
}

const DRILLS: Drill[] = [
  // Turkish Standard
  {
    id: "th_minimal",
    title: "TH Minimal Pairs",
    description: "Dilinizi dişlerinizin arasına koyarak /th/ sesini pratik yapın.",
    examples: ["think vs. sink", "three vs. tree", "thick vs. tick", "thought vs. taught", "bath vs. bat"],
    profileIds: ["turkish_standard", "turkish_educated"],
  },
  {
    id: "th_tongue",
    title: "TH Dil Yerleşimi",
    description: "Dil ucunu üst dişlerin kenarında tutarak nefes verin. Titreşimli (the) ve titreşimsiz (think) farkını hissedin.",
    examples: ["this, that, the, there, they", "think, thank, through, thunder"],
    profileIds: ["turkish_standard", "russian_caucasus"],
  },
  {
    id: "wv_lip",
    title: "W vs V Dudak Egzersizi",
    description: "W: dudaklar yuvarlak, V: alt dudak üst dişlere değir.",
    examples: ["wine vs. vine", "west vs. vest", "wow vs. vow", "wet vs. vet"],
    profileIds: ["turkish_standard", "iranian", "balkan"],
  },
  // Turkish Educated
  {
    id: "intonation_melody",
    title: "Cümle Melodisi Pratiği",
    description: "İngilizce cümlelerinde sesin nerede yükselip düştüğünü taklit edin. Türkçe'deki düz tonlamadan farklıdır.",
    examples: ["I LOVE chocolate. (düşer)", "Do you WANT some? (yükselir)", "WHAT a beautiful DAY! (iner-çıkar)"],
    profileIds: ["turkish_educated", "stress_intonation"],
  },
  // Stress/Intonation
  {
    id: "stress_tap",
    title: "Kelime Vurgusu: Ritim",
    description: "Her kelimede vurgulu heceye dokunarak ritmi hissedin.",
    examples: ["COM-for-ta-ble", "pro-NUN-ci-A-tion", "ar-chi-TEC-ture", "de-VE-lop-ment", "u-ni-VER-si-ty"],
    profileIds: ["stress_intonation", "turkish_educated"],
  },
  {
    id: "intonation_pattern",
    title: "Cümle Tonlaması",
    description: "Evet/hayır sorularında ses yükselir, bilgi sorularında düşer.",
    examples: ["Is this your book? (yükselir)", "Where do you live? (düşer)", "Can I help you? (yükselir)", "What time is it? (düşer)"],
    profileIds: ["stress_intonation"],
  },
  // Vowel/Cluster
  {
    id: "cluster_practice",
    title: "Ünsüz Kümesi Pratiği",
    description: "Sesli harf eklemeden ünsüz kümelerini söyleyin.",
    examples: ["str: street, strong, strange", "thr: three, through, throw", "spr: spring, spread, sprite", "spl: split, splash, splendid"],
    profileIds: ["vowel_cluster", "turkish_standard", "greek"],
  },
  {
    id: "schwa_reduction",
    title: "Schwa Ses Düşürülmesi",
    description: "Vurgusuz hecelerde seslileri schwa olarak hafifletin.",
    examples: ["comfortable -> KUMF-tuh-buhl", "vegetable -> VEJ-tuh-buhl", "different -> DIF-ruhnt", "chocolate -> CHOK-luht"],
    profileIds: ["vowel_cluster", "stress_intonation"],
  },
  // Iranian
  {
    id: "ae_vowel",
    title: "/ae/ Ünlü Pratiği",
    description: "Farsça'da olmayan /ae/ sesini pratik yapın. Ağzınızı daha fazla açın.",
    examples: ["cat, bat, hat, mat", "bad vs. bed", "man vs. men", "pan vs. pen", "land vs. lend"],
    profileIds: ["iranian"],
  },
  {
    id: "gutural_soften",
    title: "Gutural R Yumuşatma",
    description: "İngilizce R sesi boğazdan değil, dil ucunun geriye kıvrılmasıyla yapılır.",
    examples: ["red, run, read, right", "car, far, star (Amerikan)", "very, every, carry"],
    profileIds: ["iranian", "arabic"],
  },
  // Arabic
  {
    id: "pb_distinction",
    title: "P vs B Ayrımı",
    description: "P sesinde dudaklar patlatılır ve nefes verilir, B sesinde ses telleri titreşir.",
    examples: ["pin vs. bin", "pat vs. bat", "pig vs. big", "pack vs. back", "pull vs. bull"],
    profileIds: ["arabic"],
  },
  // Russian/Caucasus
  {
    id: "th_for_russian",
    title: "TH Sesi (Z/S Değil!)",
    description: "Rusça'daki gibi Z veya S değil, dil dişlerin arasına gelmelidir.",
    examples: ["the -> (dil dişlere)", "think -> (nefes verin)", "this vs. zis", "three vs. sree"],
    profileIds: ["russian_caucasus"],
  },
  {
    id: "soften_consonants",
    title: "Ünsüz Yumuşatma",
    description: "İngilizce ünsüzleri Rusça'daki kadar sert telaffuz etmeyin. Daha yumuşak ve akıcı olmalı.",
    examples: ["table (yumuşak T)", "people (yumuşak P)", "good day (bağlantılı)", "nice to meet you (akıcı)"],
    profileIds: ["russian_caucasus"],
  },
  // Balkan
  {
    id: "w_round_lips",
    title: "W Sesi Dudak Pratiği",
    description: "W sesi için dudaklarınızı tam yuvarlayın. V ile karıştırmayın.",
    examples: ["water, want, walk, way", "we, will, with, was", "away, always, aware"],
    profileIds: ["balkan", "turkish_standard"],
  },
  // Greek
  {
    id: "vowel_no_insert",
    title: "Sesli Harf Eklememe Pratiği",
    description: "Kelimelerin sonuna veya ünsüz kümelerine ekstra sesli harf eklemeyin.",
    examples: ["worked (1 hece, 'workd')", "street (1 hece, 'streed')", "speak (1 hece)", "school (1 hece)"],
    profileIds: ["greek", "vowel_cluster"],
  },
  // American
  {
    id: "rhotic_r",
    title: "Amerikan R Pratiği",
    description: "Dil ucunu geriye kıvırın, hiçbir yere dokundurmayin.",
    examples: ["car, far, star, war", "work, world, word, worth", "better, water, letter"],
    profileIds: ["american"],
  },
  // British
  {
    id: "non_rhotic",
    title: "İngiliz R Farkı",
    description: "Kelime sonundaki R sesini yutun, önceki sesliyi uzatın.",
    examples: ["car -> /kaa/", "water -> /wotuh/", "letter -> /letuh/"],
    profileIds: ["british"],
  },
]

/* ═══════════════════════════════════════════
   AUDIO FEATURE EXTRACTION (WebAudio API)
   ═══════════════════════════════════════════ */
interface AudioFeatures {
  spectralCentroid: number
  pitchMean: number
  pitchVariance: number
  speakingRate: number       // energy peaks per second (syllable proxy)
  voicingRatio: number       // fraction of voiced frames
  avgPauseLength: number     // average silence gap in seconds
  isochronyScore: number     // how evenly spaced energy peaks are (0-1, 1 = perfectly even)
  highFreqEnergyRatio: number // proxy for sibilant/fricative energy
  duration: number
}

async function extractAudioFeatures(audioBlob: Blob): Promise<AudioFeatures> {
  const audioCtx = new AudioContext()
  const arrayBuf = await audioBlob.arrayBuffer()
  const audioBuf = await audioCtx.decodeAudioData(arrayBuf)
  const data = audioBuf.getChannelData(0)
  const sr = audioBuf.sampleRate
  const duration = audioBuf.duration

  // Frame-based analysis
  const frameSize = Math.round(sr * 0.025) // 25ms frames
  const hop = Math.round(sr * 0.010)       // 10ms hop
  const numFrames = Math.floor((data.length - frameSize) / hop)

  const energies: number[] = []
  const pitches: number[] = []
  let voicedFrames = 0
  let spectralCentroidSum = 0
  let highFreqSum = 0
  let totalEnergySum = 0

  for (let f = 0; f < numFrames; f++) {
    const start = f * hop
    const frame = data.slice(start, start + frameSize)

    // Energy (RMS)
    let rms = 0
    for (let i = 0; i < frame.length; i++) rms += frame[i] * frame[i]
    rms = Math.sqrt(rms / frame.length)
    energies.push(rms)

    // Simple spectral analysis via zero-crossings + energy
    let zeroCrossings = 0
    for (let i = 1; i < frame.length; i++) {
      if ((frame[i] >= 0 && frame[i - 1] < 0) || (frame[i] < 0 && frame[i - 1] >= 0)) {
        zeroCrossings++
      }
    }
    const freqEstimate = (zeroCrossings / 2) * (sr / frame.length)
    spectralCentroidSum += freqEstimate * rms
    totalEnergySum += rms

    // High-frequency energy (>4kHz proxy via zero-crossings)
    if (freqEstimate > 4000) highFreqSum += rms

    // Simple pitch detection via autocorrelation (for voiced frames)
    if (rms > 0.01) {
      voicedFrames++
      const minLag = Math.round(sr / 500) // max 500Hz
      const maxLag = Math.round(sr / 60)  // min 60Hz
      let bestLag = minLag
      let bestCorr = -1
      for (let lag = minLag; lag <= Math.min(maxLag, frame.length - 1); lag++) {
        let corr = 0
        for (let i = 0; i < frame.length - lag; i++) {
          corr += frame[i] * frame[i + lag]
        }
        if (corr > bestCorr) {
          bestCorr = corr
          bestLag = lag
        }
      }
      if (bestCorr > 0) {
        pitches.push(sr / bestLag)
      }
    }
  }

  // Spectral centroid
  const spectralCentroid = totalEnergySum > 0 ? spectralCentroidSum / totalEnergySum : 0

  // Pitch stats
  const pitchMean = pitches.length > 0 ? pitches.reduce((a, b) => a + b, 0) / pitches.length : 0
  const pitchVariance = pitches.length > 1
    ? pitches.reduce((sum, p) => sum + (p - pitchMean) ** 2, 0) / pitches.length
    : 0

  // Voicing ratio
  const voicingRatio = numFrames > 0 ? voicedFrames / numFrames : 0

  // High-frequency energy ratio
  const highFreqEnergyRatio = totalEnergySum > 0 ? highFreqSum / totalEnergySum : 0

  // Speaking rate: count energy peaks (syllable proxy)
  const energyThreshold = Math.max(...energies) * 0.25
  let peaks = 0
  const peakTimes: number[] = []
  for (let i = 2; i < energies.length - 2; i++) {
    if (energies[i] > energyThreshold &&
        energies[i] > energies[i - 1] && energies[i] > energies[i - 2] &&
        energies[i] > energies[i + 1] && energies[i] > energies[i + 2]) {
      // Minimum distance between peaks: ~100ms
      if (peakTimes.length === 0 || (i * hop / sr - peakTimes[peakTimes.length - 1]) > 0.1) {
        peaks++
        peakTimes.push(i * hop / sr)
      }
    }
  }
  const speakingRate = duration > 0 ? peaks / duration : 0

  // Pause detection: find silence gaps
  const silenceThreshold = energyThreshold * 0.3
  let inSilence = false
  let silenceStart = 0
  const pauses: number[] = []
  for (let i = 0; i < energies.length; i++) {
    const t = i * hop / sr
    if (energies[i] < silenceThreshold) {
      if (!inSilence) { inSilence = true; silenceStart = t }
    } else {
      if (inSilence) {
        const gap = t - silenceStart
        if (gap > 0.15) pauses.push(gap)
        inSilence = false
      }
    }
  }
  const avgPauseLength = pauses.length > 0 ? pauses.reduce((a, b) => a + b, 0) / pauses.length : 0

  // Isochrony: measure how evenly spaced energy peaks are
  let isochronyScore = 0
  if (peakTimes.length > 2) {
    const intervals: number[] = []
    for (let i = 1; i < peakTimes.length; i++) intervals.push(peakTimes[i] - peakTimes[i - 1])
    const meanInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
    const variance = intervals.reduce((sum, iv) => sum + (iv - meanInterval) ** 2, 0) / intervals.length
    const cv = meanInterval > 0 ? Math.sqrt(variance) / meanInterval : 1
    isochronyScore = Math.max(0, 1 - cv) // 1 = perfectly even, 0 = very uneven
  }

  audioCtx.close()

  return {
    spectralCentroid,
    pitchMean,
    pitchVariance,
    speakingRate,
    voicingRatio,
    avgPauseLength,
    isochronyScore,
    highFreqEnergyRatio,
    duration,
  }
}

/* ═══════════════════════════════════════════
   STT-BASED SUBSTITUTION DETECTION
   ═══════════════════════════════════════════ */
interface SubstitutionResult {
  thSubstitutions: number
  thTotal: number
  wvSubstitutions: number
  wvTotal: number
  clusterInsertions: number
  clusterTotal: number
  transcript: string
}

function analyzeTranscript(transcript: string): SubstitutionResult {
  const words = transcript.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/)

  let thSub = 0
  const thTotal = TH_WORDS.length
  for (const tw of TH_WORDS) {
    // Check if STT returned a non-th version
    const noTh = tw.replace(/th/g, "t")
    const noThF = tw.replace(/th/g, "f")
    // If the TH word is NOT in transcript but a substitution IS, count it
    if (!words.includes(tw)) {
      if (words.includes(noTh) || words.includes(noThF) ||
          words.includes(tw.replace(/th/g, "d")) ||
          words.includes(tw.replace(/th/g, "s"))) {
        thSub++
      } else {
        // Word missing entirely -- might be STT error, partial count
        thSub += 0.3
      }
    }
  }

  let wvSub = 0
  const wvTotal = WV_WORDS.length
  for (const { expected, vSub } of WV_WORDS) {
    if (words.includes(vSub) || (!words.includes(expected) && words.some(w => w.startsWith("v") && expected.startsWith("w")))) {
      wvSub++
    }
  }

  let clusterIns = 0
  const clusterTotal = CLUSTER_WORDS.length
  // Check if transcript has more syllables than expected (rough proxy)
  const expectedSyllables = currentScript.text.toLowerCase().split(/[aeiou]+/i).length - 1
  const actualSyllables = transcript.toLowerCase().split(/[aeiou]+/i).length - 1
  if (actualSyllables > expectedSyllables * 1.15) {
    clusterIns = Math.round((actualSyllables - expectedSyllables) * 0.5)
  }

  return { thSubstitutions: thSub, thTotal, wvSubstitutions: wvSub, wvTotal, clusterInsertions: clusterIns, clusterTotal, transcript }
}

/* ═══════════════════════════════════════════
   SCORING ENGINE
   ═══════════════════════════════════════════ */
interface ProfileScore {
  profile: AccentProfile
  score: number
  percentage: number
}

function scoreProfiles(features: AudioFeatures, stt: SubstitutionResult): ProfileScore[] {
  const rawScores: Record<string, number> = {}

  // Helper ratios
  const thRate = stt.thTotal > 0 ? stt.thSubstitutions / stt.thTotal : 0
  const wvRate = stt.wvTotal > 0 ? stt.wvSubstitutions / stt.wvTotal : 0
  const hasThIssues = thRate > 0.3
  const hasWvIssues = wvRate > 0.3
  const isMonotone = features.pitchVariance < 900
  const isSyllableTimed = features.isochronyScore > 0.5
  const isStressTimed = features.isochronyScore < 0.4
  const hasClusterIssues = stt.clusterInsertions > 0

  // ============================================
  // TURKISH PROFILES (baseline boost: users ARE Turkish)
  // ============================================

  // A) Turkish Standard -- clear TH/WV issues + syllable-timed rhythm
  rawScores["turkish_standard"] = 20 // baseline: most users are Turkish
  if (hasThIssues) rawScores["turkish_standard"] += thRate * 25
  if (hasWvIssues) rawScores["turkish_standard"] += wvRate * 20
  if (isSyllableTimed) rawScores["turkish_standard"] += 12
  if (isMonotone) rawScores["turkish_standard"] += 8
  if (hasClusterIssues) rawScores["turkish_standard"] += Math.min(stt.clusterInsertions * 6, 15)
  rawScores["turkish_standard"] = Math.min(rawScores["turkish_standard"], 100)

  // B) Turkish Educated -- fewer substitution issues, still Turkish rhythm
  rawScores["turkish_educated"] = 15 // baseline
  if (!hasThIssues && !hasWvIssues) rawScores["turkish_educated"] += 25 // good consonants
  else if (thRate < 0.3 && wvRate < 0.3) rawScores["turkish_educated"] += 15
  if (isSyllableTimed || features.isochronyScore > 0.4) rawScores["turkish_educated"] += 10
  if (features.pitchVariance > 500 && features.pitchVariance < 1500) rawScores["turkish_educated"] += 10
  if (stt.clusterInsertions <= 1) rawScores["turkish_educated"] += 8
  rawScores["turkish_educated"] = Math.min(rawScores["turkish_educated"], 100)

  // C) Stress/Intonation -- very monotone with very even timing
  rawScores["stress_intonation"] = 10 // slight baseline (Turkish speakers often have this)
  if (features.pitchVariance < 600) rawScores["stress_intonation"] += 25
  else if (isMonotone) rawScores["stress_intonation"] += 15
  if (features.isochronyScore > 0.65) rawScores["stress_intonation"] += 20
  else if (isSyllableTimed) rawScores["stress_intonation"] += 10
  if (features.avgPauseLength > 0.5) rawScores["stress_intonation"] += 10
  if (features.speakingRate < 2.5) rawScores["stress_intonation"] += 10
  rawScores["stress_intonation"] = Math.min(rawScores["stress_intonation"], 100)

  // D) Vowel Insertion / Clusters -- needs actual cluster evidence
  rawScores["vowel_cluster"] = 5
  rawScores["vowel_cluster"] += Math.min(stt.clusterInsertions * 18, 50)
  if (features.speakingRate < 2.5 && hasClusterIssues) rawScores["vowel_cluster"] += 15
  if (features.speakingRate > 5.5) rawScores["vowel_cluster"] += 10
  rawScores["vowel_cluster"] = Math.min(rawScores["vowel_cluster"], 100)

  // ============================================
  // REGIONAL PROFILES (no baseline, need strong evidence)
  // ============================================

  // E) Iranian -- needs W->V AND low centroid AND specific pitch
  rawScores["iranian"] = 0
  if (hasWvIssues && wvRate > 0.5) rawScores["iranian"] += 25
  if (features.spectralCentroid < 1500) rawScores["iranian"] += 15
  if (features.pitchVariance > 1200 && !isSyllableTimed) rawScores["iranian"] += 12
  if (stt.thSubstitutions >= 3 && stt.wvSubstitutions >= 2) rawScores["iranian"] += 12
  rawScores["iranian"] = Math.min(rawScores["iranian"], 100)

  // F) Arabic -- needs very low centroid + very high voicing + cluster issues
  rawScores["arabic"] = 0
  if (features.spectralCentroid < 1400) rawScores["arabic"] += 15
  if (features.voicingRatio > 0.8) rawScores["arabic"] += 12
  if (hasClusterIssues && stt.clusterInsertions >= 2) rawScores["arabic"] += 10
  if (features.pitchVariance > 1000 && features.avgPauseLength > 0.4) rawScores["arabic"] += 10
  rawScores["arabic"] = Math.min(rawScores["arabic"], 100)

  // G) Russian/Caucasus -- needs ALL of: very high centroid + very high voicing + very specific pitch
  rawScores["russian_caucasus"] = 0
  // Only scores if centroid is truly extreme (>3200 = harsh/hard consonants)
  if (features.spectralCentroid > 3200) rawScores["russian_caucasus"] += 15
  // Voicing must be extreme (>0.82)
  if (features.voicingRatio > 0.82) rawScores["russian_caucasus"] += 12
  // High pitch variance with medium isochrony is specifically Russian pattern
  if (features.pitchVariance > 1500 && features.isochronyScore > 0.45 && features.isochronyScore < 0.6) rawScores["russian_caucasus"] += 12
  // TH issues WITHOUT W->V issues (Russians keep W/V distinction)
  if (hasThIssues && !hasWvIssues) rawScores["russian_caucasus"] += 10
  rawScores["russian_caucasus"] = Math.min(rawScores["russian_caucasus"], 100)

  // H) Balkan -- trilled R pattern, open vowels, rhythmic
  rawScores["balkan"] = 0
  if (features.spectralCentroid > 2200 && features.spectralCentroid < 3000) rawScores["balkan"] += 10
  if (features.isochronyScore > 0.55 && features.pitchVariance > 1000) rawScores["balkan"] += 12
  if (hasWvIssues && !hasThIssues) rawScores["balkan"] += 12 // W->V but no TH issue
  if (features.voicingRatio > 0.65 && features.voicingRatio < 0.78) rawScores["balkan"] += 8
  rawScores["balkan"] = Math.min(rawScores["balkan"], 100)

  // I) Greek -- vowel insertion + melodic + specific centroid
  rawScores["greek"] = 0
  if (hasClusterIssues && stt.clusterInsertions >= 2) rawScores["greek"] += 15
  if (features.pitchVariance > 1300) rawScores["greek"] += 12
  if (features.spectralCentroid > 1800 && features.spectralCentroid < 2600) rawScores["greek"] += 10
  if (!hasThIssues && hasClusterIssues) rawScores["greek"] += 8
  rawScores["greek"] = Math.min(rawScores["greek"], 100)

  // ============================================
  // NATIVE-LIKE PROFILES (need very clean speech)
  // ============================================

  // J) American-influenced -- clean consonants + stress-timed + wide pitch
  rawScores["american"] = 0
  if (!hasThIssues && !hasWvIssues) rawScores["american"] += 20
  if (isStressTimed) rawScores["american"] += 15
  if (features.pitchVariance > 1400) rawScores["american"] += 12
  if (features.spectralCentroid > 2200) rawScores["american"] += 8
  if (!hasClusterIssues) rawScores["american"] += 8
  rawScores["american"] = Math.min(rawScores["american"], 100)

  // K) British-influenced -- clean consonants + stress-timed + moderate centroid
  rawScores["british"] = 0
  if (!hasThIssues) rawScores["british"] += 18
  if (isStressTimed) rawScores["british"] += 15
  if (features.pitchVariance > 1000) rawScores["british"] += 10
  if (features.spectralCentroid > 1200 && features.spectralCentroid < 2800) rawScores["british"] += 10
  if (!hasWvIssues) rawScores["british"] += 8
  if (!hasClusterIssues) rawScores["british"] += 5
  rawScores["british"] = Math.min(rawScores["british"], 100)

  // ============================================
  // NORMALIZATION -- weighted softmax favoring Turkish
  // ============================================
  const entries = PROFILES.map(p => ({ profile: p, raw: rawScores[p.id] || 0 }))
  const maxRaw = Math.max(...entries.map(e => e.raw), 1)
  // Temperature 2.5 (lower = more spread, less winner-take-all)
  const expScores = entries.map(e => ({ ...e, exp: Math.exp((e.raw / maxRaw) * 2.5) }))
  const expSum = expScores.reduce((s, e) => s + e.exp, 0)

  return expScores
    .map(e => ({
      profile: e.profile,
      score: e.raw,
      percentage: Math.round((e.exp / expSum) * 100),
    }))
    .sort((a, b) => b.percentage - a.percentage)
}

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
type Phase = "intro" | "recording" | "analyzing" | "result"

export function SpeakingQuiz({ onBack }: { onBack?: () => void }) {
  const [phase, setPhase] = useState<Phase>("intro")
  const [error, setError] = useState<string | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [analyzeProgress, setAnalyzeProgress] = useState(0)
  const [results, setResults] = useState<ProfileScore[] | null>(null)
  const [sttResult, setSttResult] = useState<SubstitutionResult | null>(null)
  const [audioFeatures, setAudioFeatures] = useState<AudioFeatures | null>(null)
  const [copied, setCopied] = useState(false)
  const [showDrills, setShowDrills] = useState(false)
  const [selectedScriptIdx, setSelectedScriptIdx] = useState(() => Math.floor(Math.random() * READING_SCRIPTS.length))
  const currentScript = READING_SCRIPTS[selectedScriptIdx]

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const sttTranscriptRef = useRef<string>("")

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
    }
  }, [])

  /* ── Start Recording ── */
  const startRecording = useCallback(async () => {
    setError(null)
    setRecordingTime(0)
    audioChunksRef.current = []
    sttTranscriptRef.current = ""

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" })
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }

      mediaRecorder.start(100) // collect chunks every 100ms
      setPhase("recording")

      // Start recording timer
      const startTime = Date.now()
      timerRef.current = setInterval(() => {
        setRecordingTime(Math.floor((Date.now() - startTime) / 1000))
      }, 200)

      // Start Speech Recognition in parallel for transcript
      try {
        const SR = (window as unknown as Record<string, unknown>).SpeechRecognition ||
                   (window as unknown as Record<string, unknown>).webkitSpeechRecognition
        if (SR) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const recognition = new (SR as any)()
          recognition.lang = "en-US"
          recognition.interimResults = false
          recognition.maxAlternatives = 1
          recognition.continuous = true
          recognition.onresult = (event: { results: { transcript: string }[][] }) => {
            let fullTranscript = ""
            for (let i = 0; i < event.results.length; i++) {
              if (event.results[i]?.[0]) fullTranscript += event.results[i][0].transcript + " "
            }
            sttTranscriptRef.current = fullTranscript.trim()
          }
          recognition.onerror = () => { /* STT is best-effort, ignore errors */ }
          recognition.start()
          // Store for cleanup
          ;(mediaRecorder as unknown as Record<string, unknown>)._sttRecognition = recognition
        }
      } catch { /* STT not available, continue without it */ }

    } catch (err) {
      setError("Mikrofon izni verilemedi. Tarayici ayarlarindan mikrofon erisimini aktif edin.")
      setPhase("intro")
    }
  }, [])

  /* ── Stop Recording + Analyze ── */
  const stopRecording = useCallback(async () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }

    const recorder = mediaRecorderRef.current
    if (!recorder) return

    // Stop STT
    try {
      const sttRec = (recorder as unknown as Record<string, unknown>)._sttRecognition
      if (sttRec && typeof (sttRec as { stop?: () => void }).stop === "function") {
        (sttRec as { stop: () => void }).stop()
      }
    } catch { /* ignore */ }

    return new Promise<void>((resolve) => {
      recorder.onstop = async () => {
        // Stop mic
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop())
          streamRef.current = null
        }

        setPhase("analyzing")
        setAnalyzeProgress(10)

        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })

        // Check recording length
        if (audioBlob.size < 5000) {
          setError("Kayit \u00e7ok kisa. L\u00fctfen en az 5 saniye kayit yapin.")
          setPhase("intro")
          resolve()
          return
        }

        try {
          // Step 1: Extract audio features
          setAnalyzeProgress(30)
          const features = await extractAudioFeatures(audioBlob)
          setAudioFeatures(features)

          setAnalyzeProgress(60)

          // Step 2: Analyze STT transcript for substitutions
          const transcript = sttTranscriptRef.current || ""
          const stt = analyzeTranscript(transcript)
          setSttResult(stt)

          setAnalyzeProgress(80)

          // Step 3: Score profiles
          const profileScores = scoreProfiles(features, stt)
          setResults(profileScores)

          setAnalyzeProgress(100)

          // Award XP
          try {
            const xp = XP_REWARDS.quizComplete || 35
            addXp(xp, "speaking-quiz")
            showXpToast(xp)
            const achievements = checkAndUnlockAchievements()
            achievements.forEach(a => showAchievementToast(a))
            playSoundEffect("correct")
          } catch { /* */ }

          // Small delay for animation
          await new Promise(r => setTimeout(r, 500))
          setPhase("result")
        } catch (err) {
          console.error("[v0] Audio analysis error:", err)
          setError("Ses analizi sirasinda bir hata olustu. Tekrar deneyin.")
          setPhase("intro")
        }
        resolve()
      }
      recorder.stop()
    })
  }, [])

  /* ── Reset ── */
  const reset = useCallback(() => {
    setPhase("intro")
    setError(null)
    setRecordingTime(0)
    setAnalyzeProgress(0)
    setResults(null)
    setSttResult(null)
    setAudioFeatures(null)
    setShowDrills(false)
    setCopied(false)
    setSelectedScriptIdx(Math.floor(Math.random() * READING_SCRIPTS.length))
  }, [])

  /* ── Share ── */
  const handleShare = useCallback(() => {
    if (!results || results.length === 0) return
    const top = results[0]
    const text = `Accent Challenge sonucum: ${top.profile.labelTR} (%${top.percentage}) | Metin: ${currentScript.title} - textlanguageschool.net`
    if (navigator.share) {
      navigator.share({ title: "Accent Profile", text })
    } else {
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [results])

  const topDrills = results
    ? DRILLS.filter(d => d.profileIds.some(pid => results.slice(0, 2).some(r => r.profile.id === pid))).slice(0, 5)
    : []

  /* ── Speak script ── */
  const speakScript = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(currentScript.text)
    u.lang = "en-US"
    u.rate = 0.8
    window.speechSynthesis.speak(u)
  }, [currentScript.text])

  /* ════════════════════ INTRO ════════════════════ */
  if (phase === "intro") {
    return (
      <div className="space-y-4">
        {error && (
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="py-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-xs text-red-700">{error}</p>
            </CardContent>
          </Card>
        )}

        <Card className="border-primary/10 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary/60 to-primary/20" />
          <CardContent className="py-6 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Accent Challenge</h2>
              <p className="text-sm text-muted-foreground">{"Aksanını analiz et, kişiselleştirilmiş egzersizler al"}</p>
            </div>

            {/* Steps */}
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                <Mic className="w-3 h-3" /> {"Kayıt"}
              </span>
              <ChevronRight className="w-3 h-3" />
              <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted/50 font-medium">
                <Loader2 className="w-3 h-3" /> Analiz
              </span>
              <ChevronRight className="w-3 h-3" />
              <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted/50 font-medium">
                <CheckCircle2 className="w-3 h-3" /> {"Sonuç"}
              </span>
            </div>

            {/* Script selector */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider">{"Metin Seç"} <span className="text-muted-foreground font-normal normal-case">({READING_SCRIPTS.length} metin)</span></p>
              <div className="grid grid-cols-2 gap-1.5 max-h-[180px] overflow-y-auto pr-1">
                {READING_SCRIPTS.map((script, idx) => (
                  <button
                    key={script.id}
                    onClick={() => setSelectedScriptIdx(idx)}
                    className={`text-left p-2.5 rounded-lg border transition-all duration-150 ${
                      idx === selectedScriptIdx
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border/50 bg-background hover:border-border hover:bg-muted/30"
                    }`}
                  >
                    <p className={`text-xs font-semibold ${idx === selectedScriptIdx ? "text-primary" : "text-foreground"}`}>
                      {script.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{script.titleEN}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected reading script */}
            <div className="bg-muted/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Okuma Metni</p>
                  <div className="flex gap-1">
                    {currentScript.focus.map((f) => (
                      <span key={f} className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">{f}</span>
                    ))}
                  </div>
                </div>
                <button onClick={speakScript} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition shrink-0">
                  <Volume2 className="w-3.5 h-3.5" /> Dinle
                </button>
              </div>
              <p className="text-sm text-foreground leading-relaxed font-medium italic">
                {'"'}{currentScript.text}{'"'}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {"Bu metni sesli olarak okuyun. En az 10 saniye kayıt yapın."}
              </p>
            </div>

            <Button onClick={startRecording} className="w-full" size="lg">
              <Mic className="w-4 h-4 mr-2" /> {"Kayda Başla"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  /* ════════════════════ RECORDING ════════════════════ */
  if (phase === "recording") {
    const minTime = 10
    const canStop = recordingTime >= 5
    return (
      <div className="space-y-4">
        <Card className="border-red-200/50 overflow-hidden">
          <div className="h-1.5 bg-red-100">
            <div
              className="h-full bg-red-500 transition-all duration-300"
              style={{ width: `${Math.min((recordingTime / 15) * 100, 100)}%` }}
            />
          </div>
          <CardContent className="py-8 text-center space-y-6">
            {/* Pulsing mic */}
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
              <div className="absolute inset-2 rounded-full bg-red-500/30 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
                  <Mic className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>

            <div>
              <p className="text-3xl font-black text-foreground tabular-nums">{recordingTime}s</p>
              <p className="text-sm text-muted-foreground mt-1">
                {recordingTime < minTime
                  ? `En az ${minTime - recordingTime} saniye daha kaydedin`
                  : "Bitirmek icin durdurun"}
              </p>
            </div>

            {/* Script reminder */}
            <div className="bg-muted/30 rounded-xl p-3 max-w-sm mx-auto">
              <p className="text-xs text-muted-foreground italic leading-relaxed">
                {'"'}Three thoughtful thinkers thought through tough themes. We visited a very windy valley. I worked on a new website and I want to improve my pronunciation.{'"'}
              </p>
            </div>

            <Button
              onClick={stopRecording}
              variant={canStop ? "default" : "outline"}
              disabled={!canStop}
              size="lg"
              className={cn(canStop ? "bg-red-500 hover:bg-red-600 text-white" : "")}
            >
              <MicOff className="w-4 h-4 mr-2" />
              {canStop ? "Kaydi Durdur" : `${Math.max(0, 5 - recordingTime)}s bekleyin`}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  /* ════════════════════ ANALYZING ════════════════════ */
  if (phase === "analyzing") {
    return (
      <div className="space-y-4">
        <Card className="overflow-hidden">
          <div className="h-1.5 bg-muted">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${analyzeProgress}%` }}
            />
          </div>
          <CardContent className="py-12 text-center space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                {analyzeProgress < 30 ? "Ses dosyasi isleniyor..." :
                 analyzeProgress < 60 ? "Akustik ozellikler cikariliyor..." :
                 analyzeProgress < 80 ? "Telaffuz analiz ediliyor..." :
                 "Aksan profili hesaplaniyor..."}
              </p>
              <p className="text-xs text-muted-foreground mt-1">%{analyzeProgress}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  /* ════════════════════ RESULT ════════════════════ */
  if (phase === "result" && results && results.length > 0) {
    const top3 = results.slice(0, 3)
    const topProfile = top3[0]

    return (
      <div className="space-y-3">
        {/* Top profile card */}
        <Card className="border-primary/10 overflow-hidden">
          <div className={cn("h-2", topProfile.profile.color)} />
          <CardContent className="py-5 text-center space-y-3">
            <Globe className="w-10 h-10 text-primary mx-auto" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Aksan Profiliniz</p>
              <h2 className="text-xl font-black text-foreground mt-1">{topProfile.profile.labelTR}</h2>
              <p className="text-sm text-primary font-bold mt-0.5">%{topProfile.percentage} olasilik</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
              {topProfile.profile.description}
            </p>
          </CardContent>
        </Card>

        {/* Top 3 profiles */}
        <Card>
          <CardContent className="py-4 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Profil Dagilimi</p>
            {top3.map((r, i) => (
              <div key={r.profile.id} className="flex items-center gap-3">
                <span className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0",
                  i === 0 ? r.profile.color : "bg-muted-foreground/30"
                )}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground truncate">{r.profile.labelTR}</p>
                    <p className="text-sm font-bold text-foreground ml-2">%{r.percentage}</p>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full mt-1 overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-700", r.profile.color)}
                      style={{ width: `${r.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Markers observed */}
        <Card>
          <CardContent className="py-4 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tespit Edilen Belirtecler</p>
            <div className="flex flex-wrap gap-1.5">
              {topProfile.profile.markers.map((m, i) => (
                <span key={i} className="px-2 py-0.5 text-[10px] rounded-full bg-primary/10 text-primary font-medium">
                  {m}
                </span>
              ))}
            </div>
            {sttResult && sttResult.transcript && (
              <div className="mt-2 pt-2 border-t border-border">
                <p className="text-[10px] text-muted-foreground font-medium mb-1">STT Transkripti:</p>
                <p className="text-xs text-muted-foreground italic">{sttResult.transcript || "(transkript alinamadi)"}</p>
              </div>
            )}
            {audioFeatures && (
              <div className="mt-2 pt-2 border-t border-border grid grid-cols-2 gap-x-4 gap-y-1">
                <p className="text-[10px] text-muted-foreground">Pitch varyans: <span className="font-medium text-foreground">{Math.round(audioFeatures.pitchVariance)}</span></p>
                <p className="text-[10px] text-muted-foreground">Konusma hizi: <span className="font-medium text-foreground">{audioFeatures.speakingRate.toFixed(1)}/s</span></p>
                <p className="text-[10px] text-muted-foreground">Isochrony: <span className="font-medium text-foreground">{(audioFeatures.isochronyScore * 100).toFixed(0)}%</span></p>
                <p className="text-[10px] text-muted-foreground">Sibilant oran: <span className="font-medium text-foreground">{(audioFeatures.highFreqEnergyRatio * 100).toFixed(1)}%</span></p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Drills */}
        {topDrills.length > 0 && (
          <Card>
            <CardContent className="py-4 space-y-3">
              <button
                onClick={() => setShowDrills(!showDrills)}
                className="flex items-center justify-between w-full"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Onerilen Egzersizler ({topDrills.length})
                  </p>
                </div>
                <ChevronRight className={cn("w-4 h-4 text-muted-foreground transition-transform", showDrills && "rotate-90")} />
              </button>

              {showDrills && (
                <div className="space-y-3">
                  {topDrills.map(drill => (
                    <div key={drill.id} className="bg-muted/30 rounded-xl p-3 space-y-2">
                      <p className="text-sm font-semibold text-foreground">{drill.title}</p>
                      <p className="text-xs text-muted-foreground">{drill.description}</p>
                      <div className="space-y-0.5">
                        {drill.examples.map((ex, i) => (
                          <p key={i} className="text-xs text-foreground font-mono bg-background/50 px-2 py-0.5 rounded">{ex}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={reset} variant="outline" className="flex-1">
            <RotateCcw className="w-4 h-4 mr-2" /> Tekrar Dene
          </Button>
          <Button onClick={handleShare} className="flex-1">
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Share2 className="w-4 h-4 mr-2" />}
            {copied ? "Kopyalandi!" : "Paylas"}
          </Button>
        </div>

        <a
          href="https://textlanguageschool.net"
          className="block text-center text-xs text-primary hover:underline py-2"
        >
          Demo ders icin iletisime gecin
        </a>
      </div>
    )
  }

  return null
}
