"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, RotateCcw, CheckCircle2, XCircle, Shapes } from "lucide-react"
import { cn } from "@/lib/utils"
import { addXp, checkAndUnlockAchievements, XP_REWARDS } from "@/lib/xp-system"
import { showXpToast, showAchievementToast, playSoundEffect } from "@/components/xp-toast"
import { ShareChallenge } from "@/components/share-challenge"
import { QuizHeader } from "@/components/quiz-header"

interface FormationQ {
  id: number
  root: string
  targetType: "noun" | "verb" | "adjective" | "adverb"
  sentence: string
  options: string[]
  correct: number
  explanation: string
}

const typeLabels: Record<string, { label: string; color: string; bg: string }> = {
  noun: { label: "İsim", color: "text-blue-700", bg: "bg-blue-100" },
  verb: { label: "Fiil", color: "text-emerald-700", bg: "bg-emerald-100" },
  adjective: { label: "Sıfat", color: "text-purple-700", bg: "bg-purple-100" },
  adverb: { label: "Zarf", color: "text-orange-700", bg: "bg-orange-100" },
}

const questions: FormationQ[] = [
  { id: 1, root: "success", targetType: "adjective", sentence: "She was very _____ in her career.", options: ["success", "successful", "succeed", "successfully"], correct: 1, explanation: "'Successful' (başarılı) - success kelimesinin sıfat halidir." },
  { id: 2, root: "success", targetType: "adverb", sentence: "He _____ completed the project.", options: ["success", "successful", "succeed", "successfully"], correct: 3, explanation: "'Successfully' (başarıyla) - success kelimesinin zarf halidir." },
  { id: 3, root: "decide", targetType: "noun", sentence: "The _____ was made unanimously.", options: ["decide", "decision", "decisive", "decidedly"], correct: 1, explanation: "'Decision' (karar) - decide kelimesinin isim halidir." },
  { id: 4, root: "create", targetType: "adjective", sentence: "She is a very _____ person.", options: ["creation", "creative", "create", "creatively"], correct: 1, explanation: "'Creative' (yaratıcı) - create kelimesinin sıfat halidir." },
  { id: 5, root: "differ", targetType: "noun", sentence: "There is a big _____ between them.", options: ["differ", "different", "difference", "differently"], correct: 2, explanation: "'Difference' (fark) - differ kelimesinin isim halidir." },
  { id: 6, root: "improve", targetType: "noun", sentence: "There has been a great _____ in her grades.", options: ["improve", "improved", "improvement", "improving"], correct: 2, explanation: "'Improvement' (gelişim) - improve kelimesinin isim halidir." },
  { id: 7, root: "economy", targetType: "adjective", sentence: "The _____ crisis affected many countries.", options: ["economy", "economic", "economize", "economically"], correct: 1, explanation: "'Economic' (ekonomik) - economy kelimesinin sıfat halidir." },
  { id: 8, root: "beauty", targetType: "adverb", sentence: "The garden was _____ decorated.", options: ["beauty", "beautiful", "beautify", "beautifully"], correct: 3, explanation: "'Beautifully' (güzelce) - beauty kelimesinin zarf halidir." },
  { id: 9, root: "danger", targetType: "adjective", sentence: "Swimming in the river is _____.", options: ["danger", "dangerous", "endanger", "dangerously"], correct: 1, explanation: "'Dangerous' (tehlikeli) - danger kelimesinin sıfat halidir." },
  { id: 10, root: "employ", targetType: "noun", sentence: "The rate of _____ has increased.", options: ["employ", "employment", "employer", "employable"], correct: 1, explanation: "'Employment' (istihdam) - employ kelimesinin isim halidir." },
  { id: 11, root: "educate", targetType: "noun", sentence: "_____ is the key to success.", options: ["Educate", "Education", "Educational", "Educated"], correct: 1, explanation: "'Education' (eğitim) - educate kelimesinin isim halidir." },
  { id: 12, root: "science", targetType: "noun", sentence: "The _____ published a new research paper.", options: ["science", "scientific", "scientist", "scientifically"], correct: 2, explanation: "'Scientist' (bilim insanı) - science kelimesinin kişi ismi halidir." },
  { id: 13, root: "strong", targetType: "noun", sentence: "Physical _____ is not enough; you need mental power.", options: ["strong", "strength", "strengthen", "strongly"], correct: 1, explanation: "'Strength' (güç) - strong kelimesinin isim halidir." },
  { id: 14, root: "strong", targetType: "verb", sentence: "Exercise can _____ your muscles.", options: ["strong", "strength", "strengthen", "strongly"], correct: 2, explanation: "'Strengthen' (güçlemek) - strong kelimesinin fiil halidir." },
  { id: 15, root: "achieve", targetType: "noun", sentence: "Winning the award was a great _____.", options: ["achieve", "achievement", "achievable", "achiever"], correct: 1, explanation: "'Achievement' (başarı) - achieve kelimesinin isim halidir." },
  { id: 16, root: "rely", targetType: "adjective", sentence: "She is a very _____ employee.", options: ["rely", "reliable", "reliability", "reliably"], correct: 1, explanation: "'Reliable' (güvenilir) - rely kelimesinin sıfat halidir." },
  { id: 17, root: "compete", targetType: "noun", sentence: "The _____ between the two teams was fierce.", options: ["compete", "competition", "competitive", "competitively"], correct: 1, explanation: "'Competition' (yarışma) - compete kelimesinin isim halidir." },
  { id: 18, root: "appear", targetType: "noun", sentence: "Her _____ surprised everyone at the party.", options: ["appear", "appearance", "appearing", "apparent"], correct: 1, explanation: "'Appearance' (görünüş) - appear kelimesinin isim halidir." },
  { id: 19, root: "respond", targetType: "noun", sentence: "I'm still waiting for a _____ to my email.", options: ["respond", "response", "responsible", "responsively"], correct: 1, explanation: "'Response' (yanıt) - respond kelimesinin isim halidir." },
  { id: 20, root: "accurate", targetType: "adverb", sentence: "The data was _____ recorded.", options: ["accurate", "accuracy", "inaccurate", "accurately"], correct: 3, explanation: "'Accurately' (doğru şekilde) - accurate kelimesinin zarf halidir." },
  { id: 21, root: "produce", targetType: "adjective", sentence: "It was a very _____ meeting; we covered everything.", options: ["produce", "production", "productive", "productively"], correct: 2, explanation: "'Productive' (verimli) - produce kelimesinin sıfat halidir." },
  { id: 22, root: "manage", targetType: "noun", sentence: "Good _____ is essential for any company.", options: ["manage", "management", "manageable", "manager"], correct: 1, explanation: "'Management' (yönetim) - manage kelimesinin isim halidir." },
  { id: 23, root: "attract", targetType: "adjective", sentence: "The city centre is very _____ to tourists.", options: ["attract", "attraction", "attractive", "attractively"], correct: 2, explanation: "'Attractive' (çekici) - attract kelimesinin sıfat halidir." },
  { id: 24, root: "appreciate", targetType: "noun", sentence: "I'd like to express my _____ for your help.", options: ["appreciate", "appreciation", "appreciative", "appreciatively"], correct: 1, explanation: "'Appreciation' (takdir) - appreciate kelimesinin isim halidir." },
  { id: 25, root: "comfort", targetType: "adjective", sentence: "This sofa is really _____.", options: ["comfort", "comfortable", "comfortably", "discomfort"], correct: 1, explanation: "'Comfortable' (rahat) - comfort kelimesinin sıfat halidir." },
  { id: 26, root: "excite", targetType: "noun", sentence: "There was great _____ about the new discovery.", options: ["excite", "exciting", "excitement", "excitedly"], correct: 2, explanation: "'Excitement' (heyecan) - excite kelimesinin isim halidir." },
  { id: 27, root: "employ", targetType: "noun", sentence: "_____ rates have risen this year.", options: ["Employ", "Employment", "Employer", "Employee"], correct: 1, explanation: "'Employment' (istihdam) - employ kelimesinin isim halidir." },
  { id: 28, root: "patient", targetType: "noun", sentence: "Learning a language requires _____.", options: ["patient", "patience", "patiently", "impatient"], correct: 1, explanation: "'Patience' (sabir) - patient kelimesinin isim halidir." },
  { id: 29, root: "deep", targetType: "verb", sentence: "We need to _____ our understanding of the topic.", options: ["deep", "depth", "deepen", "deeply"], correct: 2, explanation: "'Deepen' (derinlestirmek) - deep kelimesinin fiil halidir." },
  { id: 30, root: "courage", targetType: "verb", sentence: "Parents should _____ their children to read.", options: ["courage", "courageous", "encourage", "encouragement"], correct: 2, explanation: "'Encourage' (tesvik etmek) - courage kokunden turetilmis fiildir." },
  { id: 31, root: "imagine", targetType: "adjective", sentence: "He told an _____ story that captivated everyone.", options: ["imagine", "imagination", "imaginative", "imaginarily"], correct: 2, explanation: "'Imaginative' (yaratıcı hayal gücüne sahip) - imagine kelimesinin sıfat halidir." },
  { id: 32, root: "survive", targetType: "noun", sentence: "_____ in the wilderness requires skill and courage.", options: ["Survive", "Survival", "Survivor", "Survivable"], correct: 1, explanation: "'Survival' (hayatta kalma) - survive kelimesinin isim halidir." },
  { id: 33, root: "predict", targetType: "adjective", sentence: "The weather here is very _____; it changes every hour.", options: ["predict", "prediction", "unpredictable", "predictably"], correct: 2, explanation: "'Unpredictable' (tahmin edilemez) - predict kokunden turetilmis sıfattir." },
  { id: 34, root: "generous", targetType: "noun", sentence: "She is known for her _____ towards charities.", options: ["generous", "generosity", "generously", "generate"], correct: 1, explanation: "'Generosity' (comertlik) - generous kelimesinin isim halidir." },
  { id: 35, root: "wide", targetType: "verb", sentence: "They plan to _____ the road next year.", options: ["wide", "width", "widen", "widely"], correct: 2, explanation: "'Widen' (genisletmek) - wide kelimesinin fiil halidir." },
  { id: 36, root: "communicate", targetType: "noun", sentence: "Good _____ is key in any relationship.", options: ["communicate", "communication", "communicative", "communicatively"], correct: 1, explanation: "'Communication' (iletisim) - communicate kelimesinin isim halidir." },
  { id: 37, root: "popular", targetType: "noun", sentence: "The _____ of online learning has grown rapidly.", options: ["popular", "popularity", "popularize", "popularly"], correct: 1, explanation: "'Popularity' (popularite) - popular kelimesinin isim halidir." },
  { id: 38, root: "honest", targetType: "noun", sentence: "_____ is the best policy.", options: ["Honest", "Honesty", "Honestly", "Dishonest"], correct: 1, explanation: "'Honesty' (durustluk) - honest kelimesinin isim halidir." },
  { id: 39, root: "possible", targetType: "noun", sentence: "There is a strong _____ of rain tomorrow.", options: ["possible", "possibility", "possibly", "impossible"], correct: 1, explanation: "'Possibility' (olasılık) - possible kelimesinin isim halidir." },
  { id: 40, root: "satisfy", targetType: "noun", sentence: "Customer _____ is our top priority.", options: ["satisfy", "satisfaction", "satisfying", "satisfied"], correct: 1, explanation: "'Satisfaction' (memnuniyet) - satisfy kelimesinin isim halidir." },
  { id: 41, root: "confident", targetType: "noun", sentence: "She spoke with great _____.", options: ["confident", "confidence", "confidently", "confidential"], correct: 1, explanation: "'Confidence' (guven) - confident kelimesinin isim halidir." },
  { id: 42, root: "analyse", targetType: "noun", sentence: "The _____ of the data took several weeks.", options: ["analyse", "analysis", "analytical", "analytically"], correct: 1, explanation: "'Analysis' (analiz) - analyse kelimesinin isim halidir." },
  { id: 43, root: "vary", targetType: "noun", sentence: "There is a wide _____ of products available.", options: ["vary", "variety", "variable", "various"], correct: 1, explanation: "'Variety' (cesitlilik) - vary kelimesinin isim halidir." },
  { id: 44, root: "apply", targetType: "noun", sentence: "Please submit your _____ before the deadline.", options: ["apply", "application", "applicable", "applicant"], correct: 1, explanation: "'Application' (basvuru) - apply kelimesinin isim halidir." },
  { id: 45, root: "operate", targetType: "noun", sentence: "The _____ of the machine is very simple.", options: ["operate", "operation", "operational", "operator"], correct: 1, explanation: "'Operation' (islem/operasyon) - operate kelimesinin isim halidir." },
  { id: 46, root: "consider", targetType: "adjective", sentence: "There has been a _____ increase in sales.", options: ["consider", "consideration", "considerable", "considerably"], correct: 2, explanation: "'Considerable' (onemli/buyuk) - consider kelimesinin sifat halidir." },
  { id: 47, root: "depend", targetType: "adjective", sentence: "Children are _____ on their parents.", options: ["depend", "dependent", "dependence", "dependable"], correct: 1, explanation: "'Dependent' (bagimli) - depend kelimesinin sifat halidir." },
  { id: 48, root: "conclude", targetType: "noun", sentence: "In _____, the study shows promising results.", options: ["conclude", "conclusion", "conclusive", "conclusively"], correct: 1, explanation: "'Conclusion' (sonuc) - conclude kelimesinin isim halidir." },
  { id: 49, root: "significant", targetType: "adverb", sentence: "Prices have _____ increased this year.", options: ["significant", "significance", "insignificant", "significantly"], correct: 3, explanation: "'Significantly' (onemli olcude) - significant kelimesinin zarf halidir." },
  { id: 50, root: "sense", targetType: "adjective", sentence: "Be _____ and don't take unnecessary risks.", options: ["sense", "sensible", "sensitive", "sensibly"], correct: 1, explanation: "'Sensible' (mantikli/akilli) - sense kelimesinin sifat halidir." },
  { id: 51, root: "emotion", targetType: "adjective", sentence: "It was an _____ moment for the whole family.", options: ["emotion", "emotional", "emotionally", "emotive"], correct: 1, explanation: "'Emotional' (duygusal) - emotion kelimesinin sifat halidir." },
  { id: 52, root: "origin", targetType: "adjective", sentence: "She has a very _____ approach to art.", options: ["origin", "original", "originally", "originate"], correct: 1, explanation: "'Original' (ozgun) - origin kelimesinin sifat halidir." },
  { id: 53, root: "expect", targetType: "noun", sentence: "The results exceeded our _____.", options: ["expect", "expectation", "expected", "expectedly"], correct: 1, explanation: "'Expectation' (beklenti) - expect kelimesinin isim halidir." },
  { id: 54, root: "broad", targetType: "verb", sentence: "Travelling can _____ your horizons.", options: ["broad", "broadly", "breadth", "broaden"], correct: 3, explanation: "'Broaden' (genisletmek) - broad kelimesinin fiil halidir." },
  { id: 55, root: "critic", targetType: "adjective", sentence: "It is _____ that you follow the instructions carefully.", options: ["critic", "critical", "critically", "criticism"], correct: 1, explanation: "'Critical' (kritik/onemli) - critic kelimesinin sifat halidir." },
  { id: 56, root: "survive", targetType: "noun", sentence: "The _____ of the fittest is a key concept in biology.", options: ["survive", "survival", "surviving", "survivor"], correct: 1, explanation: "'Survival' (hayatta kalma) - survive kelimesinin isim halidir." },
  { id: 57, root: "attract", targetType: "adjective", sentence: "The city centre is an _____ destination for tourists.", options: ["attract", "attraction", "attractive", "attractively"], correct: 2, explanation: "'Attractive' (cekici) - attract kelimesinin sifat halidir." },
  { id: 58, root: "economy", targetType: "adjective", sentence: "The _____ crisis affected millions of people.", options: ["economy", "economic", "economical", "economically"], correct: 1, explanation: "'Economic' (ekonomik) - ekonomi ile ilgili sifat halidir." },
  { id: 59, root: "achieve", targetType: "noun", sentence: "Winning the award was a great _____.", options: ["achieve", "achievement", "achievable", "achiever"], correct: 1, explanation: "'Achievement' (basari) - achieve kelimesinin isim halidir." },
  { id: 60, root: "prevent", targetType: "noun", sentence: "_____ is better than cure.", options: ["Prevent", "Prevention", "Preventive", "Preventable"], correct: 1, explanation: "'Prevention' (onleme) - prevent kelimesinin isim halidir." },
  { id: 61, root: "produce", targetType: "adjective", sentence: "It was a very _____ meeting and we made great progress.", options: ["produce", "product", "productive", "production"], correct: 2, explanation: "'Productive' (verimli) - produce kelimesinin sifat halidir." },
  { id: 62, root: "commerce", targetType: "adjective", sentence: "The _____ district is full of shops and offices.", options: ["commerce", "commercial", "commercially", "commercialise"], correct: 1, explanation: "'Commercial' (ticari) - commerce kelimesinin sifat halidir." },
  { id: 63, root: "interpret", targetType: "noun", sentence: "His _____ of the poem was quite unique.", options: ["interpret", "interpretation", "interpretive", "interpreter"], correct: 1, explanation: "'Interpretation' (yorum) - interpret kelimesinin isim halidir." },
  { id: 64, root: "maintain", targetType: "noun", sentence: "The building requires regular _____.", options: ["maintain", "maintenance", "maintainable", "maintainer"], correct: 1, explanation: "'Maintenance' (bakim) - maintain kelimesinin isim halidir." },
  { id: 65, root: "appreciate", targetType: "noun", sentence: "I would like to express my sincere _____.", options: ["appreciate", "appreciation", "appreciative", "appreciably"], correct: 1, explanation: "'Appreciation' (takdir) - appreciate kelimesinin isim halidir." },
  { id: 66, root: "innovate", targetType: "adjective", sentence: "Their _____ approach to teaching has won many awards.", options: ["innovate", "innovation", "innovative", "innovatively"], correct: 2, explanation: "'Innovative' (yenilikci) - innovate kelimesinin sifat halidir." },
  { id: 67, root: "intense", targetType: "verb", sentence: "The rain began to _____ in the afternoon.", options: ["intense", "intensity", "intensify", "intensive"], correct: 2, explanation: "'Intensify' (yogunlasmak) - intense kelimesinin fiil halidir." },
  { id: 68, root: "inform", targetType: "noun", sentence: "Can you give me some _____ about the course?", options: ["inform", "information", "informative", "informer"], correct: 1, explanation: "'Information' (bilgi) - inform kelimesinin isim halidir." },
  { id: 69, root: "determine", targetType: "noun", sentence: "Her sheer _____ helped her overcome every obstacle.", options: ["determine", "determination", "determined", "determinedly"], correct: 1, explanation: "'Determination' (kararlilik) - determine kelimesinin isim halidir." },
  { id: 70, root: "respond", targetType: "noun", sentence: "We are still waiting for a _____ from the company.", options: ["respond", "response", "responsive", "responsibly"], correct: 1, explanation: "'Response' (yanit) - respond kelimesinin isim halidir." },
  { id: 71, root: "compete", targetType: "adjective", sentence: "The market is extremely _____.", options: ["compete", "competition", "competitive", "competitively"], correct: 2, explanation: "'Competitive' (rekabetci) - compete kelimesinin sifat halidir." },
  { id: 72, root: "assume", targetType: "noun", sentence: "Your _____ that she was guilty was wrong.", options: ["assume", "assumption", "assumptive", "assumed"], correct: 1, explanation: "'Assumption' (varsayim) - assume kelimesinin isim halidir." },
  { id: 73, root: "contribute", targetType: "noun", sentence: "Thank you for your generous _____ to the charity.", options: ["contribute", "contribution", "contributory", "contributor"], correct: 1, explanation: "'Contribution' (katki) - contribute kelimesinin isim halidir." },
  { id: 74, root: "identify", targetType: "noun", sentence: "Can I see your _____ card, please?", options: ["identify", "identity", "identifiable", "identification"], correct: 3, explanation: "'Identification' (kimlik belgesi) - identify kelimesinin isim halidir." },
  { id: 75, root: "negotiate", targetType: "noun", sentence: "The peace _____ lasted for several months.", options: ["negotiate", "negotiations", "negotiable", "negotiator"], correct: 1, explanation: "'Negotiations' (muzakereler) - negotiate kelimesinin isim halidir." },
  { id: 76, root: "indicate", targetType: "noun", sentence: "There is no _____ that the situation will improve.", options: ["indicate", "indication", "indicative", "indicator"], correct: 1, explanation: "'Indication' (gosterge) - indicate kelimesinin isim halidir." },
  { id: 77, root: "legal", targetType: "verb", sentence: "Several countries have decided to _____ the use of cannabis.", options: ["legal", "legally", "legalise", "legality"], correct: 2, explanation: "'Legalise' (yasallastirmak) - legal kelimesinin fiil halidir." },
  { id: 78, root: "consequence", targetType: "adverb", sentence: "He was late. _____, he missed the opening speech.", options: ["Consequence", "Consequent", "Consequently", "Consequential"], correct: 2, explanation: "'Consequently' (sonuc olarak) - consequence kelimesinin zarf halidir." },
  { id: 79, root: "generous", targetType: "noun", sentence: "We are grateful for your _____.", options: ["generous", "generosity", "generously", "generate"], correct: 1, explanation: "'Generosity' (comertlik) - generous kelimesinin isim halidir." },
  { id: 80, root: "responsible", targetType: "noun", sentence: "She accepted full _____ for the mistake.", options: ["responsible", "responsibility", "responsibly", "responsive"], correct: 1, explanation: "'Responsibility' (sorumluluk) - responsible kelimesinin isim halidir." },
  { id: 81, root: "benefit", targetType: "adjective", sentence: "Regular exercise is _____ to your health.", options: ["benefit", "beneficial", "beneficially", "beneficiary"], correct: 1, explanation: "'Beneficial' (faydali) - benefit kelimesinin sifat halidir." },
  { id: 82, root: "repeat", targetType: "adjective", sentence: "There were _____ attempts to climb the mountain.", options: ["repeat", "repetition", "repeated", "repetitive"], correct: 2, explanation: "'Repeated' (tekrarlanan) - repeat kelimesinin sifat halidir." },
  { id: 83, root: "participate", targetType: "noun", sentence: "Active _____ in class activities is encouraged.", options: ["participate", "participation", "participant", "participatory"], correct: 1, explanation: "'Participation' (katilim) - participate kelimesinin isim halidir." },
  { id: 84, root: "approve", targetType: "noun", sentence: "The project needs the director's _____.", options: ["approve", "approval", "approved", "approvingly"], correct: 1, explanation: "'Approval' (onay) - approve kelimesinin isim halidir." },
  { id: 85, root: "courage", targetType: "verb", sentence: "Teachers should _____ students to ask questions.", options: ["courage", "courageous", "encourage", "courageously"], correct: 2, explanation: "'Encourage' (tesvik etmek) - courage kelimesinin fiil halidir." },
  { id: 86, root: "persuade", targetType: "adjective", sentence: "She made a very _____ argument in the debate.", options: ["persuade", "persuasion", "persuasive", "persuasively"], correct: 2, explanation: "'Persuasive' (ikna edici) - persuade kelimesinin sifat halidir." },
  { id: 87, root: "mystery", targetType: "adjective", sentence: "The disappearance of the plane remains _____.", options: ["mystery", "mysterious", "mysteriously", "mystify"], correct: 1, explanation: "'Mysterious' (gizemli) - mystery kelimesinin sifat halidir." },
  { id: 88, root: "conclude", targetType: "adjective", sentence: "The evidence was not _____ enough to convict him.", options: ["conclude", "conclusion", "conclusive", "conclusively"], correct: 2, explanation: "'Conclusive' (kesin) - conclude kelimesinin sifat halidir." },
  { id: 89, root: "predict", targetType: "adjective", sentence: "The weather in this area is very _____.", options: ["predict", "prediction", "predictable", "unpredictable"], correct: 3, explanation: "'Unpredictable' (ongorelemez) - predict kelimesinin olumsuz sifat hali." },
  { id: 90, root: "access", targetType: "adjective", sentence: "The building should be _____ to wheelchair users.", options: ["access", "accessible", "accessibly", "accessing"], correct: 1, explanation: "'Accessible' (erisilebilir) - access kelimesinin sifat halidir." },
  { id: 91, root: "rely", targetType: "adjective", sentence: "She is a very _____ person; you can always count on her.", options: ["rely", "reliable", "reliably", "reliance"], correct: 1, explanation: "'Reliable' (guvenilir) - rely kelimesinin sifat halidir." },
  { id: 92, root: "exclude", targetType: "adjective", sentence: "The club has an _____ membership policy.", options: ["exclude", "exclusion", "exclusive", "exclusively"], correct: 2, explanation: "'Exclusive' (ozel/seckin) - exclude kelimesinin sifat halidir." },
  { id: 93, root: "prohibit", targetType: "noun", sentence: "The _____ of smoking in public places was widely supported.", options: ["prohibit", "prohibition", "prohibitive", "prohibited"], correct: 1, explanation: "'Prohibition' (yasaklama) - prohibit kelimesinin isim halidir." },
  { id: 94, root: "hesitate", targetType: "noun", sentence: "She accepted the offer without any _____.", options: ["hesitate", "hesitation", "hesitant", "hesitantly"], correct: 1, explanation: "'Hesitation' (tereddut) - hesitate kelimesinin isim halidir." },
  { id: 95, root: "permit", targetType: "noun", sentence: "You need a _____ to park in this area.", options: ["permit", "permission", "permissible", "permitted"], correct: 0, explanation: "'Permit' (izin belgesi) isim olarak da kullanilir." },
  { id: 96, root: "discover", targetType: "noun", sentence: "The _____ of penicillin changed the course of medicine.", options: ["discover", "discovery", "discoverable", "discoverer"], correct: 1, explanation: "'Discovery' (keşif) - discover kelimesinin isim halidir." },
  { id: 97, root: "tolerate", targetType: "adjective", sentence: "We should be more _____ of different opinions.", options: ["tolerate", "tolerance", "tolerant", "tolerably"], correct: 2, explanation: "'Tolerant' (hosgörülü) - tolerate kelimesinin sifat halidir." },
  { id: 98, root: "frequent", targetType: "adverb", sentence: "She _____ visits her grandmother on weekends.", options: ["frequent", "frequency", "frequently", "infrequent"], correct: 2, explanation: "'Frequently' (sik sik) - frequent kelimesinin zarf halidir." },
  { id: 99, root: "advise", targetType: "noun", sentence: "Let me give you a piece of _____.", options: ["advise", "advice", "advisable", "advisory"], correct: 1, explanation: "'Advice' (tavsiye) isim, 'advise' fiildir." },
  { id: 100, root: "politics", targetType: "noun", sentence: "She is an experienced _____.", options: ["politics", "political", "politician", "politically"], correct: 2, explanation: "'Politician' (politikaci) - politics kelimesinin kisi isim halidir." },
  { id: 101, root: "strong", targetType: "verb", sentence: "We need to _____ the security system.", options: ["strong", "strength", "strengthen", "strongly"], correct: 2, explanation: "'Strengthen' (guclendirmek) - strong kelimesinin fiil halidir." },
  { id: 102, root: "memory", targetType: "adjective", sentence: "The concert was a truly _____ experience.", options: ["memory", "memorable", "memorise", "memorial"], correct: 1, explanation: "'Memorable' (unutulmaz) - memory kelimesinin sifat halidir." },
  { id: 103, root: "danger", targetType: "adjective", sentence: "Swimming in this river is extremely _____.", options: ["danger", "dangerous", "dangerously", "endanger"], correct: 1, explanation: "'Dangerous' (tehlikeli) - danger kelimesinin sifat halidir." },
  { id: 104, root: "prepare", targetType: "noun", sentence: "The _____ for the wedding took several months.", options: ["prepare", "preparation", "preparatory", "preparedness"], correct: 1, explanation: "'Preparation' (hazirlik) - prepare kelimesinin isim halidir." },
  { id: 105, root: "continue", targetType: "adjective", sentence: "The _____ noise from construction kept me awake.", options: ["continue", "continuous", "continuously", "continuation"], correct: 1, explanation: "'Continuous' (surekli) - continue kelimesinin sifat halidir." },
  { id: 106, root: "deep", targetType: "verb", sentence: "The crisis began to _____ as more people lost their jobs.", options: ["deep", "depth", "deepen", "deeply"], correct: 2, explanation: "'Deepen' (derinlesmek) - deep kelimesinin fiil halidir." },
  { id: 107, root: "enthuse", targetType: "noun", sentence: "She spoke with great _____ about her new project.", options: ["enthuse", "enthusiasm", "enthusiastic", "enthusiastically"], correct: 1, explanation: "'Enthusiasm' (heves/coskunluk) - enthuse kelimesinin isim halidir." },
  { id: 108, root: "rely", targetType: "noun", sentence: "There is too much _____ on technology in schools.", options: ["rely", "reliable", "reliance", "reliability"], correct: 2, explanation: "'Reliance' (bagimlilik) - rely kelimesinin isim halidir." },
  { id: 109, root: "anxious", targetType: "noun", sentence: "He suffers from severe _____.", options: ["anxious", "anxiety", "anxiously", "anxiousness"], correct: 1, explanation: "'Anxiety' (kaygi) - anxious kelimesinin isim halidir." },
  { id: 110, root: "stable", targetType: "noun", sentence: "Political _____ is essential for economic growth.", options: ["stable", "stability", "stabilise", "stably"], correct: 1, explanation: "'Stability' (istikrar) - stable kelimesinin isim halidir." },
]

const QS_PER_SET = 8

export function WordFormation() {
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [activeQs, setActiveQs] = useState<FormationQ[]>([])
  const [answers, setAnswers] = useState<boolean[]>([])
  const [currentSet, setCurrentSet] = useState(1)
  const [totalScore, setTotalScore] = useState(0)
  const [totalQs, setTotalQs] = useState(0)

  useEffect(() => { loadNewSet() }, [])

  const loadNewSet = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, QS_PER_SET)
    setActiveQs(shuffled)
    setCurrentQ(0)
    setSelected(null)
    setShowResult(false)
    setScore(0)
    setFinished(false)
    setAnswers([])
  }

  const handleSelect = (idx: number) => {
    if (showResult) return
    setSelected(idx)
    setShowResult(true)
    const isCorrect = idx === activeQs[currentQ].correct
    playSoundEffect(isCorrect ? "correct" : "wrong")
    if (isCorrect) {
      setScore(s => s + 1)
      const progress = addXp(XP_REWARDS.word_formation_correct, "word_formation")
      showXpToast(XP_REWARDS.word_formation_correct, "Kelime türevi doğru!")
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
  const typeInfo = typeLabels[q.targetType]

  if (finished) {
    const pct = Math.round((score / activeQs.length) * 100)
    return (
      <Card className="border border-border/50 overflow-hidden rounded-lg">
        <div className="h-1.5 bg-muted"><div className="h-full bg-gradient-to-r from-purple-400 to-pink-500 w-full" /></div>
        <CardContent className="p-6 text-center">
          {currentSet > 1 && <p className="text-sm text-muted-foreground mb-2">Set {currentSet} | Toplam: {totalScore + score}/{totalQs + activeQs.length}</p>}
          <div className={cn("w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center", pct >= 80 ? "bg-emerald-100" : pct >= 50 ? "bg-amber-100" : "bg-red-100")}>
            <span className={cn("text-2xl font-bold", pct >= 80 ? "text-emerald-600" : pct >= 50 ? "text-amber-600" : "text-red-600")}>%{pct}</span>
          </div>
          <h4 className="font-serif text-xl mb-2">{pct >= 80 ? "Mükemmel!" : pct >= 50 ? "İyi gidiyor!" : "Devam et!"}</h4>
          <div className="flex justify-center gap-1 mb-4">
            {answers.map((c, i) => <div key={i} className={cn("w-6 h-2 rounded-full", c ? "bg-emerald-400" : "bg-red-300")} />)}
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={continueSet} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"><ArrowRight className="w-4 h-4 mr-2" />Sonraki Set</Button>
            <Button onClick={() => { setCurrentSet(1); setTotalScore(0); setTotalQs(0); loadNewSet() }} variant="outline" className="w-full bg-transparent"><RotateCcw className="w-4 h-4 mr-2" />Sıfırla</Button>
          </div>
          <div className="mt-4 pt-4 border-t border-border/50">
            <ShareChallenge
              title="Kelime Turetme Sonucum"
              scoreText={`Kelime Turetme'de %${pct} basari! ${score}/${activeQs.length} dogru.`}
              challengeText="Ingilizce kelime turetme bilgini test et:"
              toolSlug="word-formation"
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
      <QuizHeader title="Kelime Turetme" current={currentQ + 1} total={activeQs.length} lastAnswerCorrect={showResult ? selected === activeQs[currentQ]?.correct : null} />

      <Card className="border border-border/50 mb-3 rounded-lg">
        <CardContent className="p-5">
          {/* Root word & target type */}
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-muted text-sm font-bold">{q.root}</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <span className={cn("px-3 py-1 rounded-full text-xs font-bold", typeInfo.bg, typeInfo.color)}>{typeInfo.label}</span>
          </div>

          <p className="text-base leading-relaxed mb-4">
            {q.sentence.split("_____").map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className="inline-block mx-1 px-3 py-0.5 rounded bg-purple-100 text-purple-700 font-bold border-b-2 border-purple-300">
                    {showResult ? q.options[q.correct] : "?"}
                  </span>
                )}
              </span>
            ))}
          </p>

          <div className="grid grid-cols-2 gap-2">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correct
              const isSelected = selected === i
              return (
                <button key={i} onClick={() => handleSelect(i)} disabled={showResult}
                  className={cn(
                    "p-3 rounded-lg text-sm font-medium transition-all border-2 text-left",
                    showResult && isCorrect && "bg-emerald-50 border-emerald-400 text-emerald-700",
                    showResult && isSelected && !isCorrect && "bg-red-50 border-red-400 text-red-700",
                    showResult && !isSelected && !isCorrect && "opacity-50 border-transparent",
                    !showResult && "border-border hover:border-purple-300 hover:bg-purple-50/50 active:scale-[0.97]"
                  )}>
                  <div className="flex items-center gap-2">
                    {showResult && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                    {opt}
                  </div>
                </button>
              )
            })}
          </div>

          {showResult && (
            <div className="mt-3 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-300">
              <span className="font-medium text-foreground">Açıklama: </span>{q.explanation}
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
