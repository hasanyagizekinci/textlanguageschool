"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, XCircle, RefreshCw, ArrowRight, GraduationCap, Share2, Check, Clock, Trophy, Target, Volume2, VolumeX } from "lucide-react"
import { playSoundEffect, toggleSound } from "@/components/xp-toast"
import { ShareChallenge } from "@/components/share-challenge"
import { PatikaProgress } from "@/components/patika-progress"
import { SnowflakeIdentity } from "@/components/snowflake-identity"
import { cn } from "@/lib/utils"

type ExamType = "yds" | "yokdil" | "ydt" | "oet"

interface Question {
  id: number
  question: string
  options: string[]
  correct: number
  explanation: string
}

const examQuestions: Record<ExamType, Question[]> = {
  yds: [
    { id: 1, question: "The scientist's findings were so _____ that they changed the entire field of research.", options: ["mundane", "groundbreaking", "superficial", "predictable"], correct: 1, explanation: "'Groundbreaking' çığır açan anlamına gelir." },
    { id: 2, question: "_____ the heavy rain, the outdoor concert was not cancelled.", options: ["Due to", "In spite of", "Because of", "Owing to"], correct: 1, explanation: "'In spite of' (rağmen) zıtlık bağlacıdır." },
    { id: 3, question: "The company has been _____ criticized for its environmental policies.", options: ["harshly", "kindly", "gently", "softly"], correct: 0, explanation: "'Harshly criticized' sert eleştirilmek anlamında yaygın collocation'dir." },
    { id: 4, question: "It is essential that every employee _____ the safety regulations.", options: ["follows", "follow", "following", "followed"], correct: 1, explanation: "It is essential that yapısından sonra subjunctive mood kullanılır." },
    { id: 5, question: "The manager insisted _____ seeing all the documents before the meeting.", options: ["in", "on", "at", "for"], correct: 1, explanation: "'Insist on' bir şeyde ısrar etmek anlamında sabit kalıptır." },
    { id: 6, question: "The government has _____ new measures to combat unemployment.", options: ["taken", "made", "done", "given"], correct: 0, explanation: "'Take measures' önlem almak anlamında yaygın collocation'dir." },
    { id: 7, question: "_____ having little experience, she managed to complete the project successfully.", options: ["Although", "Despite", "However", "Nevertheless"], correct: 1, explanation: "'Despite' + noun/gerund yapısı kullanılır." },
    { id: 8, question: "The results of the experiment were _____ with the hypothesis.", options: ["consistent", "persistent", "resistant", "insistent"], correct: 0, explanation: "'Consistent with' ile tutarlı anlamında kullanılır." },
    { id: 9, question: "By the time we arrived, the meeting _____.", options: ["has started", "had started", "started", "was starting"], correct: 1, explanation: "Past Perfect: geçmişte baska bir olaydan once olan eylem." },
    { id: 10, question: "She _____ her success to hard work and dedication.", options: ["owes", "attributes", "dedicates", "Both A and B"], correct: 3, explanation: "Hem 'owes' hem 'attributes' başarıyı bir şeye bağlamak için kullanılır." },
    { id: 11, question: "The proposal was _____ rejected by the committee.", options: ["deeply", "flatly", "highly", "widely"], correct: 1, explanation: "'Flatly rejected' kesinlikle reddedilmek anlamında collocation'dir." },
    { id: 12, question: "_____ sooner had she left than the phone rang.", options: ["Not", "No", "Never", "None"], correct: 1, explanation: "No sooner + had + V3 + than yapısı kullanılır." },
    { id: 13, question: "The project was completed _____ schedule.", options: ["in", "at", "on", "by"], correct: 2, explanation: "'On schedule' zamaninda anlamında sabit kalıptır." },
    { id: 14, question: "He _____ great importance to punctuality.", options: ["connects", "links", "joins", "attaches"], correct: 3, explanation: "'Attach importance' önem vermek demektir." },
    { id: 15, question: "The new law will come _____ effect next month.", options: ["in", "into", "to", "on"], correct: 1, explanation: "'Come into effect' yürürlüğe girmek demektir." },
    { id: 16, question: "She made a _____ contribution to the research.", options: ["signified", "significant", "significance", "signify"], correct: 1, explanation: "'Significant contribution' önemli katki demektir." },
    { id: 17, question: "The report _____ that changes need to be made.", options: ["closes", "finishes", "concludes", "ends"], correct: 2, explanation: "'Concludes that' sonucuna varmak demektir." },
    { id: 18, question: "_____ circumstances should you leave the building.", options: ["In no", "At no", "On no", "Under no"], correct: 3, explanation: "'Under no circumstances' hiçbir koşulda anlamında kullanılır." },
    { id: 19, question: "The theory has been _____ debated among scholars.", options: ["widely", "broadly", "largely", "greatly"], correct: 0, explanation: "'Widely debated' geniş çapta tartışılmak demektir." },
    { id: 20, question: "He _____ to the conclusion that more research was needed.", options: ["went", "came", "got", "reached"], correct: 1, explanation: "'Came to the conclusion' sonucuna varmak demektir." },
    { id: 21, question: "The committee _____ the proposal after lengthy deliberation.", options: ["turned up", "turned in", "turned down", "turned out"], correct: 2, explanation: "'Turn down' reddetmek demektir." },
    { id: 22, question: "_____ for the bad weather, we would have arrived on time.", options: ["If it were not", "Had it not been", "Were it not", "Should it not be"], correct: 1, explanation: "Mixed conditional inversion: Had it not been for." },
    { id: 23, question: "The evidence _____ light on the cause of the accident.", options: ["shed", "threw", "cast", "All of the above"], correct: 3, explanation: "'Shed/throw/cast light on' bir konuyu aydınlatmak." },
    { id: 24, question: "She takes _____ her mother in terms of appearance.", options: ["on", "up", "over", "after"], correct: 3, explanation: "'Take after' benzemek anlamında phrasal verb." },
    { id: 25, question: "The new regulations are _____ to take effect next month.", options: ["due", "about", "bound", "likely"], correct: 0, explanation: "'Due to' planlanmis bir zamanda olmak uzere." },
    { id: 26, question: "It was not until she left _____ he realized how much he missed her.", options: ["when", "that", "which", "than"], correct: 1, explanation: "'It was not until... that' vurgu yapısı." },
    { id: 27, question: "The politician _____ on his promise to reduce taxes.", options: ["came back", "went back", "got back", "held back"], correct: 1, explanation: "'Go back on a promise' sözünden dönmek." },
    { id: 28, question: "_____ the fact that he was injured, he continued playing.", options: ["Despite", "In spite", "Regardless", "Notwithstanding"], correct: 3, explanation: "'Notwithstanding' rağmen anlamında formal kullanim." },
    { id: 29, question: "The two theories are mutually _____.", options: ["inclusive", "exclusive", "conclusive", "elusive"], correct: 1, explanation: "'Mutually exclusive' birbirini dışlayan demektir." },
    { id: 30, question: "She _____ great emphasis on the importance of education.", options: ["made", "did", "placed", "got"], correct: 2, explanation: "'Place emphasis on' vurgulamak demektir." },
    { id: 31, question: "The study _____ that early intervention can prevent long-term damage.", options: ["demonstrates", "indicates", "reveals", "All of the above"], correct: 3, explanation: "Hepsi bilimsel bulguları ifade etmek için kullanılabilir." },
    { id: 32, question: "_____ the controversy, the new policy was implemented.", options: ["Although", "However", "Nevertheless", "In spite of"], correct: 3, explanation: "'In spite of' + noun: tartışmaya rağmen." },
    { id: 33, question: "He is _____ regarded as one of the finest writers of his generation.", options: ["widely", "broadly", "greatly", "deeply"], correct: 0, explanation: "'Widely regarded' geniş çapta kabul görmüş demektir." },
    { id: 34, question: "The new legislation aims to _____ discrimination in the workplace.", options: ["create", "eliminate", "encourage", "maintain"], correct: 1, explanation: "'Eliminate discrimination' ayrımcılığı ortadan kaldırmak." },
    { id: 35, question: "The benefits of the program far _____ its costs.", options: ["overcome", "overlap", "outweigh", "overtake"], correct: 2, explanation: "'Outweigh' daha ağır basmak anlamındadır." },
    { id: 36, question: "She found it difficult to _____ with the loss of her pet.", options: ["handle", "manage", "deal", "cope"], correct: 3, explanation: "'Cope with' baş etmek anlamında yaygın collocation." },
    { id: 37, question: "The company _____ great strides in renewable energy research.", options: ["has made", "has done", "has taken", "has got"], correct: 0, explanation: "'Make strides' ilerleme kaydetmek demektir." },
    { id: 38, question: "On no _____ should the equipment be left unattended.", options: ["condition", "account", "ground", "reason"], correct: 1, explanation: "'On no account' hiçbir şekilde anlamında inversion yapısı." },
    { id: 39, question: "The artist _____ inspiration from nature for his latest collection.", options: ["took", "got", "drew", "received"], correct: 2, explanation: "'Drew inspiration from' ilham almak demektir." },
    { id: 40, question: "The government _____ a ban on the import of certain goods.", options: ["imposed", "placed", "set", "All of the above"], correct: 3, explanation: "Hepsi yasak koymak anlamında kullanılabilir." },
    { id: 41, question: "She _____ a crucial role in resolving the conflict.", options: ["made", "did", "took", "played"], correct: 3, explanation: "'Play a role' rol oynamak demektir." },
    { id: 42, question: "The evidence _____ to suggest that the theory is correct.", options: ["appears", "looks", "seems", "All of the above"], correct: 3, explanation: "Hepsi delillerin işaret ettiğini ifade edebilir." },
    { id: 43, question: "_____ had the announcement been made than protests erupted.", options: ["Not", "No", "Hardly", "Barely"], correct: 1, explanation: "No sooner + had + V3 + than yapısı." },
    { id: 44, question: "The author draws a _____ between ancient and modern societies.", options: ["line", "parallel", "connection", "link"], correct: 1, explanation: "'Draw a parallel' benzerlik kurmak demektir." },
    { id: 45, question: "The committee _____ the view that further research is needed.", options: ["makes", "does", "holds", "takes"], correct: 2, explanation: "'Hold the view' bir görüşü benimsemek demektir." },
    { id: 46, question: "She has _____ a reputation for being extremely reliable.", options: ["earned", "gained", "built", "All of the above"], correct: 3, explanation: "Hepsi itibar kazanmak anlamında kullanılabilir." },
    { id: 47, question: "The research _____ valuable insights into consumer behaviour.", options: ["provides", "gives", "offers", "All of the above"], correct: 3, explanation: "Hepsi değerli görüşler sunmak için kullanılabilir." },
    { id: 48, question: "The report _____ several key factors that contributed to the decline.", options: ["finds", "locates", "spots", "identifies"], correct: 3, explanation: "'Identify factors' faktörleri belirlemek demektir." },
    { id: 49, question: "It is _____ that the results should be interpreted with caution.", options: ["noteworthy", "noticeable", "notable", "notorious"], correct: 0, explanation: "'Noteworthy' dikkat çekici/kayda değer anlamındadır." },
    { id: 50, question: "She _____ great deal of attention to her students' needs.", options: ["gives", "pays", "puts", "takes"], correct: 1, explanation: "'Pay attention' dikkat etmek demektir." },
    { id: 51, question: "The theory _____ on the assumption that all individuals are rational.", options: ["lies", "sits", "rests", "stands"], correct: 2, explanation: "'Rests on the assumption' varsayıma dayanmak." },
    { id: 52, question: "They _____ into account all the relevant factors before making a decision.", options: ["made", "did", "got", "took"], correct: 3, explanation: "'Take into account' dikkate almak demektir." },
    { id: 53, question: "The findings _____ the need for a new approach.", options: ["highlight", "lighten", "brighten", "darken"], correct: 0, explanation: "'Highlight the need' ihtiyacı vurgulamak demektir." },
    { id: 54, question: "It is widely _____ that education is the key to social mobility.", options: ["ignored", "acknowledged", "denied", "rejected"], correct: 1, explanation: "'Widely acknowledged' genel olarak kabul edilen." },
    { id: 55, question: "The discovery has far-_____ implications for the field.", options: ["going", "coming", "reaching", "running"], correct: 2, explanation: "'Far-reaching' geniş kapsamlı anlamındadır." },
    { id: 56, question: "She was _____ critical of the government's handling of the crisis.", options: ["outspokenly", "openly", "vocally", "All of the above"], correct: 3, explanation: "Hepsi açıkça eleştirmek için kullanılabilir." },
    { id: 57, question: "The policy has _____ under intense scrutiny from the public.", options: ["gone", "fallen", "been", "come"], correct: 3, explanation: "'Come under scrutiny' inceleme altına girmek." },
    { id: 58, question: "He _____ the opportunity to express his concerns.", options: ["seized", "took", "grabbed", "All of the above"], correct: 3, explanation: "Hepsi fırsatı değerlendirmek anlamında kullanılabilir." },
    { id: 59, question: "The minister _____ an assurance that taxes would not increase.", options: ["made", "gave", "provided", "offered"], correct: 1, explanation: "'Give an assurance' güvence vermek demektir." },
    { id: 60, question: "_____ to popular belief, the study found no link between the two.", options: ["Opposite", "Against", "Contrary", "Despite"], correct: 2, explanation: "'Contrary to popular belief' yaygın kanının aksine." },
    { id: 61, question: "The research _____ a number of important questions.", options: ["lifts", "picks", "grows", "raises"], correct: 3, explanation: "'Raise questions' soru/sorun ortaya koymak." },
    { id: 62, question: "She made a _____ argument in favour of the new policy.", options: ["compelling", "compulsive", "compulsory", "comprehensive"], correct: 0, explanation: "'Compelling argument' ikna edici argüman demektir." },
    { id: 63, question: "The two theories are _____ odds with each other.", options: ["in", "at", "on", "by"], correct: 1, explanation: "'At odds with' birbiriyle çelişen demektir." },
    { id: 64, question: "The _____ majority of respondents supported the proposal.", options: ["wide", "large", "vast", "big"], correct: 2, explanation: "'Vast majority' büyük çoğunluk demektir." },
    { id: 65, question: "The crisis _____ about a fundamental change in policy.", options: ["took", "made", "came", "brought"], correct: 3, explanation: "'Brought about' bir değişikliğe neden olmak." },
    { id: 66, question: "The results were _____ with previous research in the field.", options: ["in line", "in place", "in charge", "in touch"], correct: 0, explanation: "'In line with' ile uyumlu/tutarlı demektir." },
    { id: 67, question: "He _____ a vivid account of his travels in Africa.", options: ["made", "gave", "told", "said"], correct: 1, explanation: "'Give an account' bir anlatım sunmak demektir." },
    { id: 68, question: "The situation calls _____ immediate action from the authorities.", options: ["on", "up", "for", "in"], correct: 2, explanation: "'Call for' gerektirmek/talep etmek demektir." },
    { id: 69, question: "She spoke at _____ about the importance of sustainability.", options: ["long", "last", "least", "length"], correct: 3, explanation: "'At length' uzun uzadıya anlamında kullanılır." },
    { id: 70, question: "The proposal was _____ met with resistance from various groups.", options: ["initially", "firstly", "originally", "primarily"], correct: 0, explanation: "'Initially met with' başlangıçta karşılanmak." },
    { id: 71, question: "The government has _____ to address the growing concerns.", options: ["pledged", "promised", "vowed", "All of the above"], correct: 3, explanation: "Hepsi söz vermek/taahhüt etmek anlamında." },
    { id: 72, question: "The data _____ an increase in unemployment over the past decade.", options: ["reveals", "shows", "indicates", "All of the above"], correct: 3, explanation: "Hepsi verilerin gösterdiğini ifade eder." },
    { id: 73, question: "She _____ to the challenges of modern life with remarkable grace.", options: ["adapted", "adopted", "adjusted", "Both A and C"], correct: 3, explanation: "'Adapted to' ve 'adjusted to' uyum sağlamak." },
    { id: 74, question: "The project has been _____ to further delays due to budget cuts.", options: ["prone", "subject", "liable", "susceptible"], correct: 1, explanation: "'Subject to' bir şeye tabi/maruz demektir." },
    { id: 75, question: "He managed to _____ a compromise between the two parties.", options: ["reach", "achieve", "strike", "All of the above"], correct: 3, explanation: "Hepsi uzlaşmaya varmak anlamında kullanılabilir." },
    { id: 76, question: "The reforms failed to _____ the desired outcome.", options: ["produce", "achieve", "yield", "All of the above"], correct: 3, explanation: "Hepsi istenen sonucu üretmek/elde etmek için kullanılabilir." },
    { id: 77, question: "The report _____ a grim picture of the economic situation.", options: ["draws", "sketches", "paints", "pictures"], correct: 2, explanation: "'Paint a picture' bir tabloyu ortaya koymak demektir." },
    { id: 78, question: "She was _____ instrumental in the success of the campaign.", options: ["greatly", "highly", "deeply", "largely"], correct: 3, explanation: "'Largely instrumental' büyük ölçüde etkili." },
    { id: 79, question: "The law _____ into force at the beginning of the year.", options: ["came", "went", "got", "fell"], correct: 0, explanation: "'Came into force' yürürlüğe girmek demektir." },
    { id: 80, question: "The study _____ the importance of early childhood education.", options: ["underscores", "underlines", "emphasizes", "All of the above"], correct: 3, explanation: "Hepsi önemini vurgulamak için kullanılabilir." },
  ],
  yokdil: [
    { id: 1, question: "The patient's condition _____ significantly after the new treatment was administered.", options: ["improved", "declined", "maintained", "preserved"], correct: 0, explanation: "Yeni tedavi sonrasi hastanin durumunun iyileşmesi beklenir." },
    { id: 2, question: "The research paper _____ the relationship between stress and heart disease.", options: ["examines", "ignores", "avoids", "neglects"], correct: 0, explanation: "Akademik makaleler konulari 'inceler' (examine)." },
    { id: 3, question: "According to recent studies, sleep deprivation can _____ affect cognitive functions.", options: ["positively", "adversely", "barely", "slightly"], correct: 1, explanation: "Uyku yoksunlugu bilişsel işlevleri olumsuz etkiler." },
    { id: 4, question: "The symptoms _____ with those of a common cold, making diagnosis difficult.", options: ["contrast", "differ", "overlap", "conflict"], correct: 2, explanation: "'Overlap' örtüşmek anlamına gelir." },
    { id: 5, question: "The drug was _____ from the market due to severe side effects.", options: ["launched", "withdrawn", "introduced", "promoted"], correct: 1, explanation: "'Withdrawn from the market' piyasadan çekilmek demektir." },
    { id: 6, question: "The vaccine has been proven to be highly _____ against the virus.", options: ["efficient", "effective", "sufficient", "deficient"], correct: 1, explanation: "'Effective against' bir şeye karşı etkili anlamında kullanılır." },
    { id: 7, question: "Patients with chronic diseases require _____ monitoring.", options: ["regular", "rare", "occasional", "sparse"], correct: 0, explanation: "Kronik hastalar düzenli (regular) takip gerektirir." },
    { id: 8, question: "The _____ of the disease depends on early diagnosis.", options: ["prognosis", "diagnosis", "synopsis", "hypothesis"], correct: 0, explanation: "'Prognosis' hastaligin seyri/öngörüsü anlamına gelir." },
    { id: 9, question: "The study _____ that exercise can reduce the risk of heart disease.", options: ["concludes", "excludes", "includes", "precludes"], correct: 0, explanation: "'Concludes that' sonucuna varmak anlamında kullanılır." },
    { id: 10, question: "The medication should be _____ with food to avoid stomach irritation.", options: ["taken", "made", "done", "given"], correct: 0, explanation: "'Take medication' ilac almak anlamında sabit kalıptır." },
    { id: 11, question: "The experiment was _____ under controlled conditions.", options: ["conducted", "made", "done", "performed"], correct: 0, explanation: "'Conduct an experiment' deney yapmak demektir." },
    { id: 12, question: "The findings _____ the theory proposed by earlier researchers.", options: ["support", "reject", "ignore", "deny"], correct: 0, explanation: "'Support a theory' bir teoriyi desteklemek demektir." },
    { id: 13, question: "The data _____ that there is a strong correlation between the two variables.", options: ["suggests", "rejects", "denies", "ignores"], correct: 0, explanation: "'Data suggests' veriler gösteriyor demektir." },
    { id: 14, question: "Exposure to radiation can _____ serious health problems.", options: ["cause", "make", "do", "create"], correct: 0, explanation: "'Cause problems' sorunlara yol açmak demektir." },
    { id: 15, question: "The researchers _____ a new method for analyzing the data.", options: ["developed", "made", "did", "created"], correct: 0, explanation: "'Develop a method' yontem geliştirmek demektir." },
    { id: 16, question: "The study _____ several limitations that should be considered.", options: ["has", "makes", "does", "takes"], correct: 0, explanation: "'Has limitations' sınırlamaları olmak demektir." },
    { id: 17, question: "The results were _____ with previous research findings.", options: ["consistent", "persistent", "resistant", "insistent"], correct: 0, explanation: "'Consistent with' ile tutarlı demektir." },
    { id: 18, question: "Further research is _____ to confirm these findings.", options: ["needed", "made", "done", "taken"], correct: 0, explanation: "'Research is needed' araştırma gerekli demektir." },
    { id: 19, question: "The cells were _____ under a microscope.", options: ["examined", "looked", "seen", "watched"], correct: 0, explanation: "'Examine under a microscope' mikroskop altinda incelemek." },
    { id: 20, question: "The treatment _____ positive results in most patients.", options: ["yielded", "gave", "made", "did"], correct: 0, explanation: "'Yield results' sonuc vermek demektir." },
    { id: 21, question: "The _____ rate of the disease has decreased significantly.", options: ["mortality", "morbidity", "mobility", "modality"], correct: 0, explanation: "'Mortality rate' ölüm oranı demektir." },
    { id: 22, question: "The patient was _____ to a specialist for further evaluation.", options: ["referred", "transferred", "directed", "sent"], correct: 0, explanation: "'Refer to a specialist' uzman doktora sevk etmek." },
    { id: 23, question: "The clinical trial _____ promising results for the new drug.", options: ["demonstrated", "showed", "revealed", "All of the above"], correct: 3, explanation: "Hepsi klinik çalışma sonuçları için kullanilabilir." },
    { id: 24, question: "The _____ of antibiotics has led to drug-resistant bacteria.", options: ["overuse", "misuse", "abuse", "All of the above"], correct: 3, explanation: "Hepsi antibiyotiklerin aşırı/yanlış kullanımını ifade eder." },
    { id: 25, question: "The patient's condition is _____ stable.", options: ["relatively", "absolutely", "extremely", "totally"], correct: 0, explanation: "'Relatively stable' nispeten stabil anlamında." },
    { id: 26, question: "The sample size was not _____ enough to draw definitive conclusions.", options: ["large", "big", "wide", "broad"], correct: 0, explanation: "'Large sample size' akademik terminolojide doğru kullanım." },
    { id: 27, question: "Genetic factors play a _____ role in the development of the disease.", options: ["crucial", "critical", "vital", "All of the above"], correct: 3, explanation: "Hepsi önemli/kritik anlamında kullanilabilir." },
    { id: 28, question: "The researchers _____ a survey among 500 participants.", options: ["conducted", "made", "did", "performed"], correct: 0, explanation: "'Conduct a survey' anket yapmak demektir." },
    { id: 29, question: "The _____ between the control group and the test group was significant.", options: ["difference", "contrast", "distinction", "discrepancy"], correct: 3, explanation: "'Discrepancy' tutarsızlık/fark için akademik terimdir." },
    { id: 30, question: "The drug was found to be _____ in treating the condition.", options: ["efficacious", "efficient", "effective", "Both A and C"], correct: 3, explanation: "'Efficacious' ve 'effective' ilaç etkinliği için kullanılır." },
    { id: 31, question: "The enzyme plays a _____ role in the digestion of proteins.", options: ["vital", "minor", "negligible", "passive"], correct: 0, explanation: "'Vital role' hayati bir rol anlamındadır." },
    { id: 32, question: "Stem cell research has the _____ to revolutionize medicine.", options: ["potential", "purpose", "problem", "priority"], correct: 0, explanation: "'Has the potential to' potansiyeline sahip olmak." },
    { id: 33, question: "The outbreak was _____ to contaminated water supplies.", options: ["attributed", "contributed", "distributed", "substituted"], correct: 0, explanation: "'Attributed to' bir şeye bağlamak/atfetmek." },
    { id: 34, question: "The species is on the _____ of extinction.", options: ["brink", "edge", "verge", "All of the above"], correct: 3, explanation: "Hepsi yok olmanın eşiğinde anlamında kullanılabilir." },
    { id: 35, question: "Prolonged exposure to UV radiation can _____ skin damage.", options: ["cause", "prevent", "reduce", "eliminate"], correct: 0, explanation: "'Cause damage' hasara yol açmak demektir." },
    { id: 36, question: "The hypothesis was _____ by subsequent experiments.", options: ["confirmed", "denied", "rejected", "ignored"], correct: 0, explanation: "'Confirmed by' sonraki deneylerle doğrulanmak." },
    { id: 37, question: "The bacteria _____ resistance to the antibiotic over time.", options: ["developed", "made", "did", "grew"], correct: 0, explanation: "'Develop resistance' direnç geliştirmek." },
    { id: 38, question: "The patient's recovery was _____ than expected.", options: ["more rapid", "most rapid", "rapid", "rapidly"], correct: 0, explanation: "'More rapid than' karşılaştırma yapısı." },
    { id: 39, question: "The researchers _____ to replicate the results in a larger sample.", options: ["sought", "wanted", "hoped", "wished"], correct: 0, explanation: "'Sought to' resmi/akademik dilde amaçlamak." },
    { id: 40, question: "The compound _____ promising results in preclinical trials.", options: ["showed", "gave", "produced", "All of the above"], correct: 3, explanation: "Hepsi klinik öncesi deney sonuçları için kullanılabilir." },
    { id: 41, question: "The _____ of the infection can vary from mild to severe.", options: ["severity", "intensity", "gravity", "All of the above"], correct: 3, explanation: "Hepsi enfeksiyonun şiddetini ifade edebilir." },
    { id: 42, question: "The clinical trial _____ strict ethical guidelines.", options: ["adhered to", "stuck to", "followed", "All of the above"], correct: 3, explanation: "Hepsi kurallara uymak anlamında kullanılabilir." },
    { id: 43, question: "The drug showed _____ efficacy in reducing cholesterol levels.", options: ["remarkable", "noticeable", "significant", "All of the above"], correct: 3, explanation: "Hepsi dikkate değer etkinlik için kullanılabilir." },
    { id: 44, question: "The study _____ a causal relationship between smoking and lung cancer.", options: ["established", "proved", "demonstrated", "All of the above"], correct: 3, explanation: "Hepsi neden-sonuç ilişkisi kurmak için kullanılabilir." },
    { id: 45, question: "The gene responsible for the disorder has been _____.", options: ["identified", "found", "discovered", "All of the above"], correct: 3, explanation: "Hepsi gen tespit etmek için kullanılabilir." },
    { id: 46, question: "The immune system _____ a vital role in defending the body against disease.", options: ["plays", "takes", "has", "performs"], correct: 0, explanation: "'Plays a vital role' hayati bir rol oynamak." },
    { id: 47, question: "The prevalence of obesity has _____ dramatically in recent decades.", options: ["increased", "risen", "grown", "All of the above"], correct: 3, explanation: "Hepsi artışı ifade eder." },
    { id: 48, question: "The pathogen _____ through direct contact with infected individuals.", options: ["spreads", "transmits", "transfers", "disseminates"], correct: 0, explanation: "'Spreads through' yayılmak anlamında yaygın kullanım." },
    { id: 49, question: "The tissue samples were _____ to histological analysis.", options: ["subjected", "exposed", "submitted", "referred"], correct: 0, explanation: "'Subjected to analysis' analize tabi tutulmak." },
    { id: 50, question: "The patient _____ an allergic reaction to the medication.", options: ["developed", "had", "experienced", "All of the above"], correct: 3, explanation: "Hepsi alerjik reaksiyon göstermek için kullanılabilir." },
    { id: 51, question: "The _____ of the disease varies depending on the patient's age.", options: ["onset", "beginning", "start", "commencement"], correct: 0, explanation: "'Onset' hastalığın başlangıcı için tıbbi terimdir." },
    { id: 52, question: "The researchers _____ a correlation between diet and heart disease.", options: ["found", "identified", "observed", "All of the above"], correct: 3, explanation: "Hepsi korelasyon bulmak için kullanılabilir." },
    { id: 53, question: "The vaccine underwent _____ testing before it was approved.", options: ["rigorous", "strict", "thorough", "All of the above"], correct: 3, explanation: "Hepsi kapsamlı test etmeyi ifade eder." },
    { id: 54, question: "Chronic stress can _____ the immune system.", options: ["suppress", "weaken", "compromise", "All of the above"], correct: 3, explanation: "Hepsi bağışıklık sistemini zayıflatmak için kullanılabilir." },
    { id: 55, question: "The study was _____ on a sample of 1,000 participants.", options: ["conducted", "carried out", "performed", "All of the above"], correct: 3, explanation: "Hepsi çalışma yapmak anlamında kullanılabilir." },
    { id: 56, question: "The patient's blood pressure _____ within the normal range.", options: ["remained", "stayed", "fell", "Both A and B"], correct: 3, explanation: "'Remained' ve 'stayed' normal aralıkta kalmak." },
    { id: 57, question: "The _____ of the treatment depends on the stage of the disease.", options: ["outcome", "result", "effect", "All of the above"], correct: 3, explanation: "Hepsi tedavi sonucunu ifade edebilir." },
    { id: 58, question: "The organism has the ability to _____ to changing environmental conditions.", options: ["adapt", "adjust", "acclimatize", "All of the above"], correct: 3, explanation: "Hepsi uyum sağlamak anlamında kullanılabilir." },
    { id: 59, question: "The protein _____ an essential function in cell division.", options: ["performs", "carries out", "serves", "fulfills"], correct: 0, explanation: "'Performs a function' bir işlev yerine getirmek." },
    { id: 60, question: "The side effects of the medication _____ within a few hours.", options: ["wore off", "faded", "subsided", "All of the above"], correct: 3, explanation: "Hepsi yan etkilerin geçmesini ifade eder." },
    { id: 61, question: "The research was _____ by a team of international scientists.", options: ["carried out", "conducted", "undertaken", "All of the above"], correct: 3, explanation: "Hepsi araştırma yapmak için kullanılabilir." },
    { id: 62, question: "The _____ between the two groups was statistically significant.", options: ["difference", "disparity", "discrepancy", "All of the above"], correct: 3, explanation: "Hepsi gruplar arası farkı ifade edebilir." },
    { id: 63, question: "The cells were observed to _____ rapidly under certain conditions.", options: ["multiply", "proliferate", "divide", "All of the above"], correct: 3, explanation: "Hepsi hücrelerin hızla çoğalmasını ifade eder." },
    { id: 64, question: "The new treatment _____ fewer side effects than the conventional one.", options: ["produces", "causes", "generates", "All of the above"], correct: 3, explanation: "Hepsi yan etki üretmek/oluşturmak için kullanılabilir." },
    { id: 65, question: "The epidemic was _____ brought under control through vaccination.", options: ["eventually", "finally", "ultimately", "All of the above"], correct: 3, explanation: "Hepsi sonunda/nihayet anlamında kullanılabilir." },
    { id: 66, question: "A balanced diet is _____ for maintaining good health.", options: ["essential", "crucial", "vital", "All of the above"], correct: 3, explanation: "Hepsi sağlık için gerekli olduğunu ifade eder." },
    { id: 67, question: "The mutation _____ a change in the structure of the protein.", options: ["caused", "led to", "resulted in", "All of the above"], correct: 3, explanation: "Hepsi protein yapısında değişikliğe yol açmak." },
    { id: 68, question: "The patient was placed on a _____ of medication.", options: ["course", "regime", "regimen", "Both A and C"], correct: 3, explanation: "'Course' ve 'regimen' ilaç tedavi programı." },
    { id: 69, question: "The study _____ the hypothesis that stress contributes to illness.", options: ["supports", "confirms", "validates", "All of the above"], correct: 3, explanation: "Hepsi hipotezi desteklemek için kullanılabilir." },
    { id: 70, question: "The organ was successfully _____ to the recipient.", options: ["transplanted", "transferred", "grafted", "implanted"], correct: 0, explanation: "'Transplanted' organ nakli için standart terimdir." },
    { id: 71, question: "The bacteria _____ an enzyme that breaks down the antibiotic.", options: ["produce", "secrete", "release", "All of the above"], correct: 3, explanation: "Hepsi enzim üretmek/salgılamak için kullanılabilir." },
    { id: 72, question: "The _____ system is responsible for regulating body temperature.", options: ["endocrine", "nervous", "thermoregulatory", "circulatory"], correct: 2, explanation: "'Thermoregulatory' vücut ısısını düzenleyen sistem." },
    { id: 73, question: "The recovery period was longer than _____.", options: ["anticipated", "expected", "predicted", "All of the above"], correct: 3, explanation: "Hepsi beklenen/öngörülenden daha uzun." },
    { id: 74, question: "The study _____ light on the mechanisms underlying the disease.", options: ["shed", "threw", "cast", "All of the above"], correct: 3, explanation: "Hepsi bir konuyu aydınlatmak için kullanılabilir." },
    { id: 75, question: "The findings have important _____ for public health policy.", options: ["implications", "consequences", "ramifications", "All of the above"], correct: 3, explanation: "Hepsi önemli sonuçlar/etkiler için kullanılabilir." },
    { id: 76, question: "The virus _____ to mutate rapidly.", options: ["tends", "appears", "seems", "All of the above"], correct: 3, explanation: "Hepsi virüsün hızlı mutasyon eğilimini ifade eder." },
    { id: 77, question: "The researchers _____ a comprehensive review of the literature.", options: ["conducted", "carried out", "performed", "All of the above"], correct: 3, explanation: "Hepsi literatür taraması yapmak için kullanılabilir." },
    { id: 78, question: "The infection can be _____ through proper hygiene practices.", options: ["prevented", "avoided", "halted", "Both A and B"], correct: 3, explanation: "'Prevented' ve 'avoided' enfeksiyon önleme." },
    { id: 79, question: "The study _____ that diet plays a significant role in disease prevention.", options: ["suggests", "indicates", "demonstrates", "All of the above"], correct: 3, explanation: "Hepsi çalışmanın bulgularını aktarmak için kullanılabilir." },
    { id: 80, question: "The patient's condition _____ after the administration of the new drug.", options: ["stabilized", "improved", "recovered", "Both A and B"], correct: 3, explanation: "'Stabilized' ve 'improved' durumun iyileşmesi." },
  ],
  ydt: [
    { id: 1, question: "Global warming _____ to be one of the most pressing issues of our time.", options: ["considers", "is considered", "considering", "has considered"], correct: 1, explanation: "Passive voice: 'is considered' kabul edilir anlamında." },
    { id: 2, question: "_____ I known about the traffic jam, I would have left earlier.", options: ["If", "Had", "Should", "Were"], correct: 1, explanation: "Third conditional inversion: Had I known = If I had known." },
    { id: 3, question: "The new policy aims to _____ the gap between rich and poor.", options: ["widen", "bridge", "increase", "expand"], correct: 1, explanation: "'Bridge the gap' uçurumu kapatmak anlamında deyimdir." },
    { id: 4, question: "She spoke so quietly that I could _____ hear what she said.", options: ["nearly", "hardly", "almost", "mostly"], correct: 1, explanation: "'Hardly' neredeyse hic anlamına gelir." },
    { id: 5, question: "The professor _____ his students to think critically about the subject.", options: ["discouraged", "prevented", "encouraged", "prohibited"], correct: 2, explanation: "'Encouraged' teşvik etti anlamına gelir." },
    { id: 6, question: "Not only _____ the exam, but she also got the highest score.", options: ["she passed", "did she pass", "she did pass", "passed she"], correct: 1, explanation: "Not only ile cümle başlarsa devrik yapı kullanılır." },
    { id: 7, question: "The book, _____ was published last year, became a bestseller.", options: ["that", "which", "who", "whom"], correct: 1, explanation: "Non-defining relative clause'da 'which' kullanılır." },
    { id: 8, question: "I wish I _____ more time to prepare for the presentation.", options: ["have", "had", "would have", "have had"], correct: 1, explanation: "'I wish' ile şimdiki zaman için past simple kullanılır." },
    { id: 9, question: "By next year, they _____ the construction of the new hospital.", options: ["will complete", "will have completed", "complete", "completed"], correct: 1, explanation: "Future Perfect: gelecekte tamamlanmis olacak eylem." },
    { id: 10, question: "The more you practice, _____ you will become.", options: ["better", "the better", "best", "the best"], correct: 1, explanation: "The more... the more yapısı karşılaştırma için kullanılır." },
    { id: 11, question: "If I _____ you, I would accept the offer.", options: ["am", "was", "were", "be"], correct: 2, explanation: "Second conditional'da 'were' tüm şahıslar için kullanılır." },
    { id: 12, question: "She _____ be at home. Her car is in the garage.", options: ["must", "can't", "might", "should"], correct: 0, explanation: "'Must' kesin çıkarım için kullanılır." },
    { id: 13, question: "The children were excited _____ going to the zoo.", options: ["about", "for", "with", "to"], correct: 0, explanation: "'Excited about' bir sey hakkinda heyecanli demektir." },
    { id: 14, question: "He apologized _____ being late to the meeting.", options: ["for", "about", "to", "with"], correct: 0, explanation: "'Apologize for' bir sey için ozur dilemek demektir." },
    { id: 15, question: "Rarely _____ such a beautiful sunset.", options: ["I have seen", "have I seen", "I saw", "did I see"], correct: 1, explanation: "Negative inversion: Rarely + have + subject + V3." },
    { id: 16, question: "She suggested _____ a break.", options: ["to take", "taking", "take", "taken"], correct: 1, explanation: "'Suggest' + gerund yapısı kullanılır." },
    { id: 17, question: "I remember _____ the door before I left.", options: ["lock", "to lock", "locking", "locked"], correct: 2, explanation: "'Remember' + gerund geçmişteki eylemi hatirlamak icin." },
    { id: 18, question: "The movie was _____ boring that I fell asleep.", options: ["so", "such", "too", "very"], correct: 0, explanation: "'So + adjective + that' yapısı kullanılır." },
    { id: 19, question: "He denied _____ the window.", options: ["break", "to break", "breaking", "broken"], correct: 2, explanation: "'Deny' + gerund yapısı kullanılır." },
    { id: 20, question: "_____ she rich, she would travel the world.", options: ["If", "Were", "Had", "Should"], correct: 1, explanation: "Second conditional inversion: Were + subject + adj." },
    { id: 21, question: "He _____ to have left the country before the investigation started.", options: ["is believed", "believes", "was believing", "has believed"], correct: 0, explanation: "Passive reporting: is believed + to have + V3." },
    { id: 22, question: "_____ it not for her help, I would have failed the exam.", options: ["Were", "Had", "Should", "If"], correct: 1, explanation: "Third conditional inversion: Had it not been for." },
    { id: 23, question: "Little _____ she know that her life was about to change.", options: ["does", "did", "was", "had"], correct: 1, explanation: "Negative adverb inversion: Little did she know." },
    { id: 24, question: "The report _____ to in the meeting was published last year.", options: ["referred", "referring", "refer", "refers"], correct: 0, explanation: "Reduced relative clause: The report (that was) referred to." },
    { id: 25, question: "He acted as if nothing _____.", options: ["happened", "had happened", "has happened", "happens"], correct: 1, explanation: "'As if' ile past perfect: sanki olmamis gibi." },
    { id: 26, question: "She had her car _____.", options: ["repair", "repaired", "repairing", "to repair"], correct: 1, explanation: "Causative: have + object + past participle." },
    { id: 27, question: "It's high time we _____ something about pollution.", options: ["do", "did", "have done", "will do"], correct: 1, explanation: "'It's high time' + past simple yapısı kullanılır." },
    { id: 28, question: "I'd rather you _____ smoke in the house.", options: ["don't", "didn't", "won't", "haven't"], correct: 1, explanation: "'I'd rather you' + past simple yapısı." },
    { id: 29, question: "Only when I got home _____ I realize I had left my keys.", options: ["did", "do", "was", "had"], correct: 0, explanation: "Only when + inversion: Only when... did I realize." },
    { id: 30, question: "The film is worth _____.", options: ["watch", "watching", "to watch", "watched"], correct: 1, explanation: "'Worth' + gerund yapısı kullanılır." },
    { id: 31, question: "She _____ living abroad for years before returning home.", options: ["has been", "had been", "was", "is"], correct: 1, explanation: "Past Perfect Continuous: geri dönmeden önce yıllarca yaşamış." },
    { id: 32, question: "He speaks _____ if he were an expert on the subject.", options: ["like", "as", "as if", "such as"], correct: 2, explanation: "'As if' sanki anlamında kullanılır." },
    { id: 33, question: "_____ to his laziness, he failed the course.", options: ["Because", "Due", "Owing", "Both B and C"], correct: 3, explanation: "'Due to' ve 'Owing to' -den dolayı anlamında." },
    { id: 34, question: "She has _____ interest in politics since childhood.", options: ["taken", "shown", "had", "All of the above"], correct: 3, explanation: "Hepsi ilgi göstermek/duymak anlamında kullanılabilir." },
    { id: 35, question: "The building _____ which the meeting was held was very old.", options: ["at", "in", "on", "by"], correct: 1, explanation: "'In which' bir bina/yer için relative clause." },
    { id: 36, question: "He regrets _____ harder when he was young.", options: ["not study", "not studying", "not to study", "to not study"], correct: 1, explanation: "'Regret' + gerund: geçmişe dönük pişmanlık." },
    { id: 37, question: "_____ she arrived, the atmosphere of the party changed.", options: ["The moment", "By the time", "Until", "Unless"], correct: 0, explanation: "'The moment' tam o anda/gelir gelmez anlamında." },
    { id: 38, question: "He could not help _____ when he heard the joke.", options: ["laugh", "laughing", "to laugh", "laughed"], correct: 1, explanation: "'Can't help + gerund' kendini tutamamak." },
    { id: 39, question: "I _____ him yesterday, but he was not at the office.", options: ["was to meet", "was to have met", "would meet", "should meet"], correct: 1, explanation: "'Was to have met' planlanmış ama gerçekleşmemiş." },
    { id: 40, question: "She acted as though she _____ nothing about it.", options: ["knows", "knew", "has known", "is knowing"], correct: 1, explanation: "'As though' + past simple: sanki bilmiyormuş gibi." },
    { id: 41, question: "Hardly _____ the lesson started when the fire alarm went off.", options: ["has", "had", "was", "did"], correct: 1, explanation: "Hardly + had + V3 + when yapısı." },
    { id: 42, question: "She was the last person _____ the building.", options: ["left", "to leave", "leaving", "who leaving"], correct: 1, explanation: "The last/first + person + to infinitive yapısı." },
    { id: 43, question: "He _____ studying abroad before he decided to go.", options: ["considered", "had considered", "was considering", "All of the above"], correct: 3, explanation: "Hepsi karar vermeden önce düşünmek için kullanılabilir." },
    { id: 44, question: "It was such _____ weather that we stayed indoors.", options: ["a bad", "bad", "badly", "worse"], correct: 1, explanation: "'Such + uncountable noun + that': such bad weather." },
    { id: 45, question: "No sooner _____ home than the storm began.", options: ["I got", "had I got", "I had got", "did I get"], correct: 1, explanation: "No sooner + had + subject + V3 + than." },
    { id: 46, question: "She _____ to have been promoted recently.", options: ["is believed", "believes", "was believing", "has believing"], correct: 0, explanation: "Passive reporting: is believed + to have been + V3." },
    { id: 47, question: "_____ as it may seem, the story is entirely true.", options: ["Strange", "Strangely", "Stranger", "Strangest"], correct: 0, explanation: "'Adjective + as it may seem' ne kadar garip görünse de." },
    { id: 48, question: "By the end of the month, she _____ here for five years.", options: ["will work", "will be working", "will have been working", "works"], correct: 2, explanation: "Future Perfect Continuous: will have been + V-ing." },
    { id: 49, question: "The teacher demanded that the students _____ quiet.", options: ["are", "be", "were", "being"], correct: 1, explanation: "Subjunctive mood: demand that + subject + base verb." },
    { id: 50, question: "_____ he to apologize, I would forgive him.", options: ["Should", "Were", "Had", "If"], correct: 1, explanation: "Second conditional inversion: Were he to = If he were to." },
    { id: 51, question: "She couldn't make herself _____ in the noisy room.", options: ["hear", "heard", "hearing", "to hear"], correct: 1, explanation: "'Make oneself heard' kendini duyurmak: passive infinitive." },
    { id: 52, question: "I would sooner _____ than ask him for help.", options: ["die", "dying", "to die", "died"], correct: 0, explanation: "'Would sooner + base verb' tercih etmek yapısı." },
    { id: 53, question: "_____ but for her assistance, I couldn't have finished.", options: ["Were it not", "Had it not been", "Should it not be", "If it were"], correct: 1, explanation: "Third conditional: Had it not been but for = Without." },
    { id: 54, question: "The more carefully you plan, _____ problems you will face.", options: ["fewer", "the fewer", "less", "the less"], correct: 1, explanation: "The more... the fewer: karşılaştırma yapısı." },
    { id: 55, question: "She speaks French _____ she were a native speaker.", options: ["as", "as if", "like", "such as"], correct: 1, explanation: "'As if' sanki anlamında kullanılır." },
    { id: 56, question: "He _____ to meeting us at the restaurant.", options: ["agreed", "accepted", "admitted", "allowed"], correct: 0, explanation: "'Agree to' bir şeyi kabul etmek/razı olmak." },
    { id: 57, question: "The exam was far _____ difficult than we had expected.", options: ["more", "much", "very", "too"], correct: 0, explanation: "'Far more difficult' çok daha zor anlamında." },
    { id: 58, question: "She _____ her children to be polite to others.", options: ["brought up", "grew up", "raised up", "picked up"], correct: 0, explanation: "'Bring up' yetiştirmek anlamında phrasal verb." },
    { id: 59, question: "I object _____ being treated unfairly.", options: ["for", "to", "about", "with"], correct: 1, explanation: "'Object to' itiraz etmek: to + gerund." },
    { id: 60, question: "There is no point _____ about things you cannot change.", options: ["worry", "to worry", "worrying", "worried"], correct: 2, explanation: "'No point + gerund' anlamı yok yapısı." },
    { id: 61, question: "_____ interesting the book is, I can't finish it in one day.", options: ["However", "Whatever", "Whichever", "Wherever"], correct: 0, explanation: "'However + adjective' ne kadar... olursa olsun." },
    { id: 62, question: "She is accustomed _____ late hours.", options: ["to work", "to working", "for working", "with working"], correct: 1, explanation: "'Accustomed to + gerund' alışkın olmak." },
    { id: 63, question: "He insisted _____ paying for the dinner.", options: ["in", "on", "at", "for"], correct: 1, explanation: "'Insist on + gerund' ısrar etmek." },
    { id: 64, question: "The contract, _____ was signed yesterday, is legally binding.", options: ["that", "which", "who", "whom"], correct: 1, explanation: "Non-defining relative clause: virgül + which." },
    { id: 65, question: "He _____ his exam results to be announced next week.", options: ["expects", "waits", "hopes", "wishes"], correct: 0, explanation: "'Expect something to be done' bir şeyin olmasını beklemek." },
    { id: 66, question: "She had difficulty _____ the instructions.", options: ["understand", "to understand", "understanding", "understood"], correct: 2, explanation: "'Have difficulty + gerund' zorluk çekmek." },
    { id: 67, question: "_____ the danger, they continued their journey.", options: ["Although", "Despite", "However", "In spite"], correct: 1, explanation: "'Despite + noun' rağmen yapısı." },
    { id: 68, question: "He is the man _____ I was telling you about.", options: ["who", "whom", "which", "whose"], correct: 1, explanation: "'Whom' nesne konumunda kişi için kullanılır." },
    { id: 69, question: "She prefers reading _____ watching television.", options: ["than", "to", "over", "from"], correct: 1, explanation: "'Prefer doing to doing' yapısı." },
    { id: 70, question: "I can't help but _____ sorry for him.", options: ["feel", "feeling", "to feel", "felt"], correct: 0, explanation: "'Can't help but + base verb' yapısı." },
    { id: 71, question: "_____ you have any questions, please don't hesitate to ask.", options: ["If", "Should", "Were", "Both A and B"], correct: 3, explanation: "'If' ve 'Should' soru sormak için ikisi de kullanılabilir." },
    { id: 72, question: "He's nowhere near as _____ as his brother.", options: ["tall", "taller", "tallest", "the tallest"], correct: 0, explanation: "'Nowhere near as + adjective + as' yakınından bile geçemez." },
    { id: 73, question: "The teacher _____ the students hand in their essays by Friday.", options: ["made", "let", "had", "got"], correct: 2, explanation: "'Had someone do something' yaptırmak." },
    { id: 74, question: "She would rather we _____ earlier.", options: ["leave", "left", "leaving", "to leave"], correct: 1, explanation: "'Would rather someone + past simple' yapısı." },
    { id: 75, question: "_____ as he is, he still makes mistakes.", options: ["Clever", "However clever", "Being clever", "Despite clever"], correct: 0, explanation: "'Adjective + as + subject + is' concession yapısı." },
    { id: 76, question: "Not a single word _____ during the meeting.", options: ["she said", "did she say", "she has said", "has she said"], correct: 1, explanation: "Negative inversion: Not a single + did + subject + V1." },
    { id: 77, question: "It is imperative that he _____ the rules.", options: ["follows", "follow", "followed", "following"], correct: 1, explanation: "Subjunctive: It is imperative that + base verb." },
    { id: 78, question: "She _____ up early, so morning shifts don't bother her.", options: ["used to get", "is used to getting", "gets used to get", "used to getting"], correct: 1, explanation: "'Is used to + gerund' alışkın olmak." },
    { id: 79, question: "The _____ I think about it, the less I understand.", options: ["most", "more", "much", "many"], correct: 1, explanation: "The more... the less: karşılaştırma yapısı." },
    { id: 80, question: "He suggested that we _____ a taxi to the airport.", options: ["take", "took", "taking", "to take"], correct: 0, explanation: "Subjunctive: suggest that + subject + base verb." },
  ],
  oet: [
    { id: 1, question: "The patient was _____ to the intensive care unit following the surgery.", options: ["transferred", "transported", "transmitted", "transplanted"], correct: 0, explanation: "'Transferred' hastanın üniteler arası nakli için kullanılır." },
    { id: 2, question: "The doctor _____ the patient to take the medication twice daily.", options: ["said", "told", "advised", "suggested"], correct: 2, explanation: "'Advised someone to do something' tibbi talimatlarda yaygınder." },
    { id: 3, question: "The nurse noticed that the patient's blood pressure had _____ significantly.", options: ["raised", "risen", "arose", "arisen"], correct: 1, explanation: "'Rise' kendiliginden yukselmek için kullanılır." },
    { id: 4, question: "Please ensure that the wound is kept clean to prevent _____.", options: ["infection", "injection", "inspection", "inflection"], correct: 0, explanation: "'Prevent infection' enfeksiyon onlemek demektir." },
    { id: 5, question: "The patient _____ from chest pain for the past three days.", options: ["has been suffering", "is suffering", "was suffering", "suffers"], correct: 0, explanation: "'For the past three days' Present Perfect Continuous gerektirir." },
    { id: 6, question: "The doctor _____ a thorough examination of the patient.", options: ["conducted", "made", "did", "performed"], correct: 0, explanation: "'Conduct an examination' muayene yapmak anlamında kullanılır." },
    { id: 7, question: "The patient should _____ from strenuous activities for two weeks.", options: ["abstain", "restrain", "constrain", "detain"], correct: 0, explanation: "'Abstain from' bir seyden kacinmak/uzak durmak demektir." },
    { id: 8, question: "The medication may cause _____ such as dizziness and nausea.", options: ["side effects", "after effects", "special effects", "sound effects"], correct: 0, explanation: "'Side effects' ilac yan etkileri için kullanılır." },
    { id: 9, question: "It is important to _____ the patient's consent before the procedure.", options: ["obtain", "contain", "maintain", "retain"], correct: 0, explanation: "'Obtain consent' onay/izin almak anlamında tibbi terimdir." },
    { id: 10, question: "The patient was _____ with type 2 diabetes last month.", options: ["diagnosed", "examined", "treated", "cured"], correct: 0, explanation: "'Diagnosed with' bir hastalik teshisi konmak demektir." },
    { id: 11, question: "The nurse _____ the patient's vital signs every hour.", options: ["monitored", "watched", "looked", "saw"], correct: 0, explanation: "'Monitor vital signs' yasamsal belirtileri izlemek demektir." },
    { id: 12, question: "The patient was _____ to rest for the remainder of the day.", options: ["advised", "said", "told", "suggested"], correct: 0, explanation: "'Advised to' tavsiye edilmek demektir." },
    { id: 13, question: "The doctor _____ a prescription for antibiotics.", options: ["wrote", "made", "did", "gave"], correct: 0, explanation: "'Write a prescription' recete yazmak demektir." },
    { id: 14, question: "The patient's symptoms _____ after starting the treatment.", options: ["subsided", "increased", "rose", "grew"], correct: 0, explanation: "'Symptoms subsided' belirtiler azaldi demektir." },
    { id: 15, question: "The wound requires daily _____ to prevent infection.", options: ["dressing", "covering", "wrapping", "clothing"], correct: 0, explanation: "'Wound dressing' yara pansumani demektir." },
    { id: 16, question: "The patient _____ well to the treatment.", options: ["responded", "answered", "replied", "reacted"], correct: 0, explanation: "'Respond to treatment' tedaviye yanit vermek demektir." },
    { id: 17, question: "Blood samples were _____ for laboratory analysis.", options: ["collected", "gathered", "picked", "taken"], correct: 0, explanation: "'Collect blood samples' kan ornekleri almak demektir." },
    { id: 18, question: "The patient is _____ a full recovery.", options: ["expected to make", "hoped to do", "wished to have", "wanted to get"], correct: 0, explanation: "'Expected to make a full recovery' tam iyileşmesi bekleniyor." },
    { id: 19, question: "The dosage should be _____ according to the patient's weight.", options: ["adjusted", "changed", "moved", "shifted"], correct: 0, explanation: "'Adjust the dosage' dozu ayarlamak demektir." },
    { id: 20, question: "The patient was _____ to the ward after surgery.", options: ["admitted", "accepted", "received", "welcomed"], correct: 0, explanation: "'Admitted to the ward' servise yatirildi demektir." },
    { id: 21, question: "The patient's condition has _____ since the last check-up.", options: ["deteriorated", "decreased", "diminished", "declined"], correct: 0, explanation: "'Deteriorated' hastanin durumunun kotuye gitmesi." },
    { id: 22, question: "The nurse _____ the patient about the potential risks of the procedure.", options: ["informed", "said", "spoke", "told"], correct: 0, explanation: "'Inform someone about' bilgilendirmek demektir." },
    { id: 23, question: "Please _____ the patient's temperature every four hours.", options: ["check", "control", "examine", "test"], correct: 0, explanation: "'Check temperature' ates olcmek demektir." },
    { id: 24, question: "The patient has a history of _____ to penicillin.", options: ["allergy", "reaction", "sensitivity", "resistance"], correct: 0, explanation: "'Allergy to' bir maddeye karsi alerji." },
    { id: 25, question: "The wound should be _____ clean and dry at all times.", options: ["kept", "held", "maintained", "stayed"], correct: 0, explanation: "'Keep clean' temiz tutmak en dogal kullanim." },
    { id: 26, question: "The patient _____ complaining of severe headaches.", options: ["presented", "arrived", "came", "appeared"], correct: 0, explanation: "'Present with/complaining of' tibbi basvuru terimi." },
    { id: 27, question: "Discharge is _____ for tomorrow morning.", options: ["planned", "scheduled", "arranged", "All of the above"], correct: 3, explanation: "Hepsi taburculuk planlaması için kullanilabilir." },
    { id: 28, question: "The patient needs to _____ a follow-up appointment.", options: ["attend", "go", "make", "do"], correct: 0, explanation: "'Attend a follow-up' kontrol randevusuna gitmek." },
    { id: 29, question: "The lab results are _____ within normal limits.", options: ["within", "inside", "between", "among"], correct: 0, explanation: "'Within normal limits' normal sinirlar icinde." },
    { id: 30, question: "The patient _____ consent to the proposed treatment plan.", options: ["gave", "provided", "offered", "granted"], correct: 0, explanation: "'Gave consent' onay/riza vermek demektir." },
    { id: 31, question: "The patient is currently _____ a course of physiotherapy.", options: ["undergoing", "taking", "doing", "having"], correct: 0, explanation: "'Undergo treatment/physiotherapy' tedavi görmek." },
    { id: 32, question: "The _____ of the fracture was confirmed by X-ray.", options: ["diagnosis", "prognosis", "treatment", "medication"], correct: 0, explanation: "'Diagnosis' röntgen ile doğrulanan tıbbi teşhis." },
    { id: 33, question: "It is crucial to _____ a thorough medical history from the patient.", options: ["obtain", "take", "get", "All of the above"], correct: 3, explanation: "Hepsi tıbbi öykü almak için kullanılabilir." },
    { id: 34, question: "The patient was _____ on bed rest for two weeks.", options: ["placed", "put", "kept", "All of the above"], correct: 3, explanation: "Hepsi yatak istirahatine almak için kullanılabilir." },
    { id: 35, question: "The medication should be _____ at room temperature.", options: ["stored", "kept", "maintained", "Both A and B"], correct: 3, explanation: "'Stored' ve 'kept' ilaç saklama için kullanılır." },
    { id: 36, question: "The wound shows signs of _____.", options: ["healing", "curing", "recovering", "mending"], correct: 0, explanation: "'Signs of healing' iyileşme belirtileri demektir." },
    { id: 37, question: "The patient's mobility has been _____ impaired since the accident.", options: ["severely", "deeply", "highly", "strongly"], correct: 0, explanation: "'Severely impaired' ciddi şekilde bozulmuş." },
    { id: 38, question: "Please _____ the patient to the waiting area.", options: ["escort", "bring", "take", "All of the above"], correct: 3, explanation: "Hepsi hastayı bir alana yönlendirmek için kullanılabilir." },
    { id: 39, question: "The patient _____ from shortness of breath and chest tightness.", options: ["suffers", "has", "experiences", "Both A and C"], correct: 3, explanation: "'Suffers from' ve 'experiences' semptomlar için kullanılır." },
    { id: 40, question: "The nurse _____ the patient's blood glucose levels regularly.", options: ["monitors", "checks", "measures", "All of the above"], correct: 3, explanation: "Hepsi kan şekeri takibi için kullanılabilir." },
    { id: 41, question: "The patient was _____ intravenous antibiotics for the infection.", options: ["given", "administered", "prescribed", "Both A and B"], correct: 3, explanation: "'Given' ve 'administered' IV ilaç vermek." },
    { id: 42, question: "The surgical wound needs to be _____ for signs of infection.", options: ["observed", "monitored", "examined", "All of the above"], correct: 3, explanation: "Hepsi yara takibi için kullanılabilir." },
    { id: 43, question: "The patient _____ a significant weight loss over the past month.", options: ["experienced", "underwent", "had", "suffered"], correct: 0, explanation: "'Experienced weight loss' kilo kaybı yaşamak." },
    { id: 44, question: "A _____ assessment of the patient's needs should be carried out.", options: ["comprehensive", "thorough", "complete", "All of the above"], correct: 3, explanation: "Hepsi kapsamlı değerlendirme için kullanılabilir." },
    { id: 45, question: "The patient is being _____ for hypertension.", options: ["treated", "managed", "medicated", "All of the above"], correct: 3, explanation: "Hepsi hipertansiyon tedavisi için kullanılabilir." },
    { id: 46, question: "The doctor _____ that the patient avoid strenuous activity.", options: ["recommended", "suggested", "advised", "All of the above"], correct: 3, explanation: "Hepsi tıbbi tavsiye vermek için kullanılabilir." },
    { id: 47, question: "The patient's _____ to the medication was closely monitored.", options: ["response", "reaction", "reply", "Both A and B"], correct: 3, explanation: "'Response' ve 'reaction' ilaç tepkisi." },
    { id: 48, question: "The nurse should _____ that the patient understands the discharge instructions.", options: ["ensure", "make sure", "confirm", "All of the above"], correct: 3, explanation: "Hepsi hastanın anladığından emin olmak için kullanılabilir." },
    { id: 49, question: "The patient reported _____ of appetite over the past week.", options: ["loss", "lack", "absence", "Both A and B"], correct: 3, explanation: "'Loss of appetite' ve 'lack of appetite' iştahsızlık." },
    { id: 50, question: "The wound is _____ well with no signs of complication.", options: ["healing", "recovering", "mending", "progressing"], correct: 0, explanation: "'Healing well' iyi iyileşmek demektir." },
    { id: 51, question: "The patient was _____ to keep the affected limb elevated.", options: ["instructed", "told", "advised", "All of the above"], correct: 3, explanation: "Hepsi hastaya talimat vermek için kullanılabilir." },
    { id: 52, question: "Blood pressure readings should be _____ at regular intervals.", options: ["taken", "recorded", "measured", "All of the above"], correct: 3, explanation: "Hepsi tansiyon ölçümü için kullanılabilir." },
    { id: 53, question: "The patient _____ well to the physiotherapy sessions.", options: ["responded", "reacted", "adapted", "adjusted"], correct: 0, explanation: "'Responded well to' tedaviye iyi yanıt vermek." },
    { id: 54, question: "The doctor _____ the patient's medication due to side effects.", options: ["changed", "altered", "modified", "All of the above"], correct: 3, explanation: "Hepsi ilaç değişikliği için kullanılabilir." },
    { id: 55, question: "The patient needs to be _____ of the risks involved in the procedure.", options: ["informed", "aware", "told", "Both A and C"], correct: 3, explanation: "'Informed' ve 'told' bilgilendirmek için kullanılır." },
    { id: 56, question: "Post-operative care _____ regular monitoring of the patient's condition.", options: ["involves", "includes", "requires", "All of the above"], correct: 3, explanation: "Hepsi ameliyat sonrası bakımı ifade eder." },
    { id: 57, question: "The patient _____ from nausea and vomiting following the procedure.", options: ["suffered", "experienced", "complained of", "All of the above"], correct: 3, explanation: "Hepsi bulantı ve kusma yaşamak için kullanılabilir." },
    { id: 58, question: "The patient's fluid _____ should be carefully monitored.", options: ["intake", "consumption", "input", "absorption"], correct: 0, explanation: "'Fluid intake' sıvı alımı tıbbi terimdir." },
    { id: 59, question: "The nurse _____ the patient how to self-administer the insulin injections.", options: ["taught", "showed", "instructed", "All of the above"], correct: 3, explanation: "Hepsi hastaya öğretmek için kullanılabilir." },
    { id: 60, question: "The patient's _____ levels were found to be dangerously low.", options: ["haemoglobin", "iron", "blood sugar", "All of the above"], correct: 3, explanation: "Hepsi tehlikeli düşük seviye için olabilir." },
    { id: 61, question: "The patient was _____ nil by mouth prior to surgery.", options: ["kept", "maintained", "ordered", "instructed"], correct: 0, explanation: "'Kept nil by mouth' ameliyat öncesi aç bırakılmak." },
    { id: 62, question: "A full _____ count was ordered to investigate the anaemia.", options: ["blood", "cell", "platelet", "white"], correct: 0, explanation: "'Full blood count' tam kan sayımı tıbbi terimdir." },
    { id: 63, question: "The patient should _____ plenty of fluids to stay hydrated.", options: ["drink", "consume", "take in", "All of the above"], correct: 3, explanation: "Hepsi sıvı tüketmek için kullanılabilir." },
    { id: 64, question: "The incision site should be _____ clean and dry.", options: ["kept", "maintained", "held", "left"], correct: 0, explanation: "'Kept clean and dry' temiz ve kuru tutulmak." },
    { id: 65, question: "The patient _____ to comply with the prescribed treatment regimen.", options: ["refused", "declined", "failed", "Both A and C"], correct: 3, explanation: "'Refused' ve 'failed to comply' tedaviye uymamak." },
    { id: 66, question: "The nurse _____ the patient's family about the prognosis.", options: ["briefed", "informed", "updated", "All of the above"], correct: 3, explanation: "Hepsi aileyi bilgilendirmek için kullanılabilir." },
    { id: 67, question: "The patient _____ signs of improvement after the medication change.", options: ["showed", "displayed", "exhibited", "All of the above"], correct: 3, explanation: "Hepsi iyileşme belirtileri göstermek için kullanılabilir." },
    { id: 68, question: "A _____ referral was made to the respiratory specialist.", options: ["urgent", "prompt", "timely", "immediate"], correct: 0, explanation: "'Urgent referral' acil sevk demektir." },
    { id: 69, question: "The patient's pain was _____ using a visual analogue scale.", options: ["assessed", "measured", "evaluated", "All of the above"], correct: 3, explanation: "Hepsi ağrı değerlendirmek için kullanılabilir." },
    { id: 70, question: "The medication should be _____ as prescribed by the doctor.", options: ["taken", "administered", "used", "All of the above"], correct: 3, explanation: "Hepsi ilacı doktor reçetesine göre kullanmak." },
    { id: 71, question: "The patient was _____ on a drip to maintain hydration.", options: ["placed", "put", "started", "All of the above"], correct: 3, explanation: "Hepsi serum takmak için kullanılabilir." },
    { id: 72, question: "The patient's _____ to the anaesthetic was normal.", options: ["response", "reaction", "tolerance", "All of the above"], correct: 3, explanation: "Hepsi anesteziğe tepki için kullanılabilir." },
    { id: 73, question: "The nurse must _____ accurate records of the patient's progress.", options: ["keep", "maintain", "document", "All of the above"], correct: 3, explanation: "Hepsi kayıt tutmak için kullanılabilir." },
    { id: 74, question: "The patient was _____ from the hospital after a five-day stay.", options: ["discharged", "released", "sent home", "All of the above"], correct: 3, explanation: "Hepsi taburcu etmek için kullanılabilir." },
    { id: 75, question: "The patient is _____ risk of developing pressure sores.", options: ["at", "in", "under", "on"], correct: 0, explanation: "'At risk of' risk altında demektir." },
    { id: 76, question: "Post-operative _____ management is a priority for patient comfort.", options: ["pain", "wound", "care", "recovery"], correct: 0, explanation: "'Pain management' ağrı yönetimi tıbbi terimdir." },
    { id: 77, question: "The patient's _____ of motion has been restricted since the surgery.", options: ["range", "scope", "extent", "degree"], correct: 0, explanation: "'Range of motion' hareket aralığı tıbbi terimdir." },
    { id: 78, question: "The doctor _____ the patient for further tests.", options: ["referred", "sent", "directed", "transferred"], correct: 0, explanation: "'Referred for tests' tetkik için sevk etmek." },
    { id: 79, question: "The patient should be _____ to report any adverse reactions immediately.", options: ["encouraged", "advised", "instructed", "All of the above"], correct: 3, explanation: "Hepsi yan etki bildirmesini istemek için kullanılabilir." },
    { id: 80, question: "The nurse _____ a sterile dressing to the wound.", options: ["applied", "placed", "put", "All of the above"], correct: 3, explanation: "Hepsi pansuman yapmak için kullanılabilir." },
  ],
}

const examInfo: Record<ExamType, { name: string; description: string; questionCount: number; color: string; bgColor: string }> = {
  yds: { name: "YDS", description: "Akademik & Genel", questionCount: 10, color: "text-blue-600", bgColor: "bg-blue-50 border-blue-200" },
  yokdil: { name: "YOKDİL", description: "Sağlık & Fen", questionCount: 10, color: "text-emerald-600", bgColor: "bg-emerald-50 border-emerald-200" },
  ydt: { name: "YDT", description: "YKS Yabancı Dil", questionCount: 10, color: "text-violet-600", bgColor: "bg-violet-50 border-violet-200" },
  oet: { name: "OET", description: "Mesleki İngilizce", questionCount: 10, color: "text-amber-600", bgColor: "bg-amber-50 border-amber-200" },
}

export function ExamPractice() {
  const [selectedExam, setSelectedExam] = useState<ExamType | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [copied, setCopied] = useState(false)
  const [currentSet, setCurrentSet] = useState(1)
  const [totalScore, setTotalScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [usedIds, setUsedIds] = useState<Set<number>>(new Set())
  const [answers, setAnswers] = useState<(number | null)[]>([])
  // Timer
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setElapsed(prev => prev + 1)
    }, 1000)
  }, [])

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => stopTimer()
  }, [stopTimer])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  const startExam = (exam: ExamType) => {
    const allQuestions = examQuestions[exam]
    const available = allQuestions.filter(q => !usedIds.has(q.id))
    const count = examInfo[exam].questionCount

    let selected: Question[]
    if (available.length < count) {
      setUsedIds(new Set())
      selected = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, count)
    } else {
      selected = [...available].sort(() => Math.random() - 0.5).slice(0, count)
    }

    setQuestions(selected)
    setAnswers(new Array(count).fill(null))
    setSelectedExam(exam)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setQuizCompleted(false)
    setCopied(false)
    setElapsed(0)
    startTimer()
  }

  const continueExam = () => {
    if (!selectedExam) return

    const newUsedIds = new Set(usedIds)
    for (const q of questions) {
      newUsedIds.add(q.id)
    }
    setUsedIds(newUsedIds)

    setTotalScore(prev => prev + score)
    setTotalQuestions(prev => prev + questions.length)
    setCurrentSet(prev => prev + 1)

    const allQuestions = examQuestions[selectedExam]
    const available = allQuestions.filter(q => !newUsedIds.has(q.id))
    const count = examInfo[selectedExam].questionCount

    let selected: Question[]
    if (available.length < count) {
      setUsedIds(new Set())
      selected = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, count)
    } else {
      selected = [...available].sort(() => Math.random() - 0.5).slice(0, count)
    }

    setQuestions(selected)
    setAnswers(new Array(count).fill(null))
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setQuizCompleted(false)
    setElapsed(0)
    startTimer()
  }

  const shareResult = async () => {
    if (!selectedExam) return

    const finalScore = totalScore + score
    const finalQuestions = totalQuestions + questions.length
    const percentage = Math.round((finalScore / finalQuestions) * 100)
    const text = `${examInfo[selectedExam].name} sınavında ${currentSet} sette ${finalQuestions} sorudan ${finalScore} doğru yaptım (%${percentage})! Sen de dene:`
    const url = typeof window !== "undefined" ? `${window.location.origin}/#pratik` : ""

    if (navigator.share) {
      try {
        await navigator.share({ title: "Sınav Sonucum", text, url })
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

  const handleAnswer = (index: number) => {
  if (showResult) return
  setSelectedAnswer(index)
  setShowResult(true)
  const isCorrect = index === questions[currentQuestion].correct
  playSoundEffect(isCorrect ? "correct" : "wrong")
  const newAnswers = [...answers]
  newAnswers[currentQuestion] = index
    setAnswers(newAnswers)
    if (index === questions[currentQuestion].correct) {
      setScore((s) => s + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((c) => c + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      stopTimer()
      setQuizCompleted(true)
    }
  }

  const goToQuestion = (index: number) => {
    if (answers[index] !== null || index === currentQuestion) {
      setCurrentQuestion(index)
      if (answers[index] !== null) {
        setSelectedAnswer(answers[index])
        setShowResult(true)
      } else {
        setSelectedAnswer(null)
        setShowResult(false)
      }
    }
  }

  const resetQuiz = () => {
    stopTimer()
    setSelectedExam(null)
    setQuestions([])
    setAnswers([])
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setQuizCompleted(false)
    setCurrentSet(1)
    setTotalScore(0)
    setTotalQuestions(0)
    setUsedIds(new Set())
    setElapsed(0)
  }

  // Exam selection screen
  if (!selectedExam) {
    return (
      <div className="py-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-secondary/10 mb-3">
            <GraduationCap className="w-7 h-7 text-secondary" />
          </div>
          <h3 className="font-serif text-xl mb-1">Sinav Pratigi</h3>
          <p className="text-sm text-muted-foreground">Sınav türünü seçin ve pratik yapmaya başlayın</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(examInfo) as ExamType[]).map((exam) => {
            const info = examInfo[exam]
            return (
              <button
                key={exam}
                onClick={() => startExam(exam)}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all text-left group hover:scale-[1.02] active:scale-[0.98]",
                  info.bgColor
                )}
                aria-label={`${info.name} sinav pratigi basla`}
              >
                <span className={cn("block font-bold text-lg", info.color)}>
                  {info.name}
                </span>
                <span className="block text-xs text-muted-foreground mt-0.5">
                  {info.description}
                </span>
                <span className="block text-[10px] text-muted-foreground/70 mt-2">
                  {examQuestions[exam].length} soru havuzu
                </span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // Quiz completed screen
  if (quizCompleted) {
    const remainingQuestions = examQuestions[selectedExam].length - usedIds.size - questions.length
    const percentage = Math.round((score / questions.length) * 100)
    const totalP = totalQuestions > 0
      ? Math.round(((totalScore + score) / (totalQuestions + questions.length)) * 100)
      : percentage

    return (
      <div className="py-6">
        <Card className="border border-border/50 overflow-hidden rounded-lg">
          {/* Result header band */}
          <div className={cn(
            "py-4 px-6 text-center",
            percentage >= 80 ? "bg-emerald-50" : percentage >= 50 ? "bg-amber-50" : "bg-red-50"
          )}>
            <div className={cn(
              "inline-flex items-center justify-center w-16 h-16 rounded-full mb-2",
              percentage >= 80 ? "bg-emerald-100 text-emerald-600" :
              percentage >= 50 ? "bg-amber-100 text-amber-600" :
              "bg-red-100 text-red-600"
            )}>
              {percentage >= 80 ? <Trophy className="w-8 h-8" /> : <Target className="w-8 h-8" />}
            </div>
            <h3 className="font-serif text-2xl mb-1">
              {percentage >= 80 ? "Harika!" : percentage >= 50 ? "İyi Gidiyor!" : "Çalışmayı Sürdür!"}
            </h3>
          </div>

          <CardContent className="p-6">
            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <div className="text-2xl font-bold text-foreground">{score}/{questions.length}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Doğru</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <div className="text-2xl font-bold text-foreground">%{percentage}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Başarı</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <div className="text-2xl font-bold text-foreground">{formatTime(elapsed)}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Süre</div>
              </div>
            </div>

            {/* Question mini map */}
            <div className="flex flex-wrap justify-center gap-1.5 mb-5">
              {questions.map((q, i) => {
                const userAnswer = answers[i]
                const isCorrect = userAnswer === q.correct
                return (
                  <div
                    key={i}
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-medium",
                      isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    )}
                  >
                    {i + 1}
                  </div>
                )
              })}
            </div>

            {/* Cumulative stats */}
            {currentSet > 1 && (
              <div className="text-center text-sm text-muted-foreground mb-4 py-2 border-t border-b border-dashed">
                Toplam {currentSet} set: {totalScore + score}/{totalQuestions + questions.length} (%{totalP})
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Button onClick={continueExam} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <ArrowRight className="w-4 h-4 mr-2" />
                Devam Et ({remainingQuestions > 0 ? `${remainingQuestions} soru kaldı` : "Baştan"})
              </Button>
                <div className="mt-2 pt-3 border-t border-border/50">
                  <ShareChallenge
                    title={`${selectedExam.toUpperCase()} Sınav Sonucum`}
                    scoreText={`${selectedExam.toUpperCase()} sınavında %${percentage} başarı! ${score}/${questions.length} doğru.`}
                    challengeText={`${selectedExam.toUpperCase()} sınav pratiği ile İngilizce seviyeni test et:`}
                    toolSlug="exam"
                    challengeScore={score}
                    challengeTotal={questions.length}
                  />
                </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={resetQuiz} className="flex-1 bg-transparent">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Baska Sinav
                </Button>
                <Button onClick={() => startExam(selectedExam)} variant="outline" className="flex-1 bg-transparent">
                  Tekrar Dene
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Question screen
  const q = questions[currentQuestion]
  const examColor = examInfo[selectedExam]

  return (
    <div className="py-6">
      {/* Patika Snow Path */}
      <div className="mb-3 flex items-center gap-2">
        <SnowflakeIdentity progress={Math.round(((currentQuestion + 1) / questions.length) * 100)} />
        <span className="text-sm font-semibold text-foreground">{examColor.name}</span>
      </div>
      <PatikaProgress current={currentQuestion + 1} total={questions.length} />

      <Card className="border border-border/50 rounded-lg">
        <CardContent className="p-5">
          {/* Top bar: badge + timer + progress */}
          <div className="flex items-center justify-between mb-3">
            <span className={cn(
              "px-2.5 py-1 rounded-lg text-xs font-bold",
              examColor.bgColor, examColor.color
            )}>
              {examColor.name}
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {formatTime(elapsed)}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {currentQuestion + 1}/{questions.length}
              </span>
            </div>
          </div>

          {/* Question number dots - clickable navigation */}
          <div className="flex justify-center gap-1.5 mb-4" role="navigation" aria-label="Soru navigasyonu">
            {questions.map((_, i) => {
              const answered = answers[i] !== null
              const isCurrent = i === currentQuestion
              const wasCorrect = answered && answers[i] === questions[i].correct
              return (
                <button
                  key={i}
                  onClick={() => goToQuestion(i)}
                  disabled={!answered && i !== currentQuestion}
                  aria-label={`Soru ${i + 1}`}
                  aria-current={isCurrent ? "step" : undefined}
                  className={cn(
                    "w-6 h-1.5 rounded-full transition-all duration-200",
                    isCurrent && !answered && "bg-secondary scale-y-150",
                    !isCurrent && !answered && "bg-muted",
                    answered && wasCorrect && "bg-emerald-400",
                    answered && !wasCorrect && "bg-red-400",
                  )}
                />
              )
            })}
          </div>

          {/* Question */}
          <p className="text-base font-medium mb-5 leading-relaxed">{q.question}</p>

          {/* Options */}
          <div className="space-y-2.5 mb-4" role="radiogroup" aria-label="Secenekler">
            {q.options.map((option, i) => {
              const isSelected = selectedAnswer === i
              const isCorrect = i === q.correct
              const showCorrect = showResult && isCorrect
              const showWrong = showResult && isSelected && !isCorrect

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={showResult}
                  role="radio"
                  aria-checked={isSelected}
                  className={cn(
                    "w-full p-3.5 rounded-xl border-2 text-left transition-all flex items-center gap-3",
                    !showResult && !isSelected && "hover:border-secondary/40 hover:bg-secondary/5 border-border",
                    !showResult && isSelected && "border-secondary bg-secondary/10",
                    showCorrect && "border-emerald-500 bg-emerald-50",
                    showWrong && "border-red-500 bg-red-50",
                    showResult && !showCorrect && !showWrong && "opacity-50 border-border"
                  )}
                >
                  <span className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 transition-all",
                    showCorrect && "border-emerald-500 bg-emerald-500 text-white",
                    showWrong && "border-red-500 bg-red-500 text-white",
                    !showResult && isSelected && "border-secondary bg-secondary text-white",
                    !showResult && !isSelected && "border-muted-foreground/20 text-muted-foreground"
                  )}>
                    {showCorrect ? <CheckCircle2 className="w-4 h-4" /> :
                     showWrong ? <XCircle className="w-4 h-4" /> :
                     String.fromCharCode(65 + i)}
                  </span>
                  <span className={cn(
                    "flex-1 text-sm",
                    showCorrect && "font-medium text-emerald-700",
                    showWrong && "text-red-700 line-through"
                  )}>{option}</span>
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {showResult && (
            <div className={cn(
              "rounded-xl p-4 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300 border",
              selectedAnswer === q.correct
                ? "bg-emerald-50/50 border-emerald-200 text-emerald-800"
                : "bg-amber-50/50 border-amber-200 text-amber-800"
            )}>
              <p className="text-sm leading-relaxed">{q.explanation}</p>
            </div>
          )}

          {/* Next button */}
          {showResult && (
            <Button
              onClick={nextQuestion}
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground animate-in fade-in slide-in-from-bottom-2 duration-200"
            >
              {currentQuestion < questions.length - 1 ? "Sonraki Soru" : "Sonuçları Gör"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
