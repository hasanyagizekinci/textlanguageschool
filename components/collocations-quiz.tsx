"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, RotateCcw, CheckCircle2, XCircle, Layers } from "lucide-react"
import { cn } from "@/lib/utils"
import { addXp, checkAndUnlockAchievements, XP_REWARDS } from "@/lib/xp-system"
import { showXpToast, showAchievementToast, playSoundEffect } from "@/components/xp-toast"
import { ShareChallenge } from "@/components/share-challenge"
import { QuizHeader } from "@/components/quiz-header"

interface CollocationQ {
  id: number
  sentence: string
  blank: string
  options: string[]
  correct: number
  tip: string
}

const questions: CollocationQ[] = [
  { id: 1, sentence: "Can you _____ a decision by tomorrow?", blank: "make", options: ["make", "do", "take", "get"], correct: 0, tip: "'Make a decision' sabit kalıptır. 'Do' kullanılmaz." },
  { id: 2, sentence: "She _____ a mistake on the exam.", blank: "made", options: ["did", "made", "took", "had"], correct: 1, tip: "'Make a mistake' hata yapmak için doğru collocation'dır." },
  { id: 3, sentence: "I need to _____ my homework before dinner.", blank: "do", options: ["make", "do", "take", "give"], correct: 1, tip: "'Do homework' ev ödevi yapmak için kullanılır." },
  { id: 4, sentence: "He _____ a deep breath before speaking.", blank: "took", options: ["made", "did", "took", "had"], correct: 2, tip: "'Take a breath' nefes almak için doğru kalıptır." },
  { id: 5, sentence: "The company _____ a profit last year.", blank: "made", options: ["did", "made", "took", "got"], correct: 1, tip: "'Make a profit' kâr etmek demektir." },
  { id: 6, sentence: "She _____ an effort to arrive on time.", blank: "made", options: ["did", "made", "took", "put"], correct: 1, tip: "'Make an effort' çaba göstermek demektir." },
  { id: 7, sentence: "Can I _____ a suggestion?", blank: "make", options: ["do", "make", "give", "take"], correct: 1, tip: "'Make a suggestion' öneri yapmak için kullanılır." },
  { id: 8, sentence: "They _____ business together for years.", blank: "did", options: ["did", "made", "took", "had"], correct: 0, tip: "'Do business' iş yapmak için doğru collocation'dır." },
  { id: 9, sentence: "Please _____ a seat.", blank: "take", options: ["make", "do", "take", "have"], correct: 2, tip: "'Take a seat' oturmak/yer almak demektir." },
  { id: 10, sentence: "I'd like to _____ a reservation for two.", blank: "make", options: ["do", "make", "take", "set"], correct: 1, tip: "'Make a reservation' rezervasyon yapmak demektir." },
  { id: 11, sentence: "She _____ her best in the competition.", blank: "did", options: ["did", "made", "took", "gave"], correct: 0, tip: "'Do one's best' elinden gelenin en iyisini yapmak." },
  { id: 12, sentence: "He _____ a look at the document.", blank: "took", options: ["made", "gave", "took", "had"], correct: 2, tip: "'Take a look' göz atmak demektir." },
  { id: 13, sentence: "The teacher _____ us a favor.", blank: "did", options: ["did", "made", "gave", "took"], correct: 0, tip: "'Do a favor' iyilik yapmak demektir." },
  { id: 14, sentence: "We need to _____ progress on this project.", blank: "make", options: ["do", "make", "take", "get"], correct: 1, tip: "'Make progress' ilerleme kaydetmek demektir." },
  { id: 15, sentence: "Let's _____ a break for lunch.", blank: "take", options: ["make", "do", "take", "have"], correct: 2, tip: "'Take a break' mola vermek demektir." },
  { id: 16, sentence: "She _____ an appointment with the doctor.", blank: "made", options: ["did", "made", "took", "set"], correct: 1, tip: "'Make an appointment' randevu almak demektir." },
  { id: 17, sentence: "He _____ attention to every detail.", blank: "paid", options: ["gave", "paid", "took", "made"], correct: 1, tip: "'Pay attention' dikkat etmek için doğru kalıptır." },
  { id: 18, sentence: "They _____ advantage of the opportunity.", blank: "took", options: ["made", "did", "took", "got"], correct: 2, tip: "'Take advantage of' fırsattan yararlanmak demektir." },
  { id: 19, sentence: "I _____ a complaint about the service.", blank: "made", options: ["did", "made", "gave", "took"], correct: 1, tip: "'Make a complaint' şikâyet etmek demektir." },
  { id: 20, sentence: "She _____ harm to no one.", blank: "did", options: ["did", "made", "took", "caused"], correct: 0, tip: "'Do harm' zarar vermek için kullanılır." },
  { id: 21, sentence: "The rain _____ heavily all night.", blank: "fell", options: ["dropped", "fell", "ran", "poured"], correct: 1, tip: "'Rain falls' yağmur yağar anlamında kullanılır." },
  { id: 22, sentence: "He _____ a speech at the conference.", blank: "gave", options: ["made", "gave", "did", "told"], correct: 1, tip: "'Give a speech' konuşma yapmak demektir." },
  { id: 23, sentence: "We _____ an agreement last week.", blank: "reached", options: ["made", "reached", "did", "took"], correct: 1, tip: "'Reach an agreement' anlaşma yapmak demektir." },
  { id: 24, sentence: "The doctor _____ an examination.", blank: "conducted", options: ["conducted", "made", "did", "took"], correct: 0, tip: "'Conduct an examination' muayene yapmak demektir." },
  { id: 25, sentence: "She _____ a good impression on everyone.", blank: "made", options: ["did", "made", "gave", "took"], correct: 1, tip: "'Make an impression' izlenim bırakmak demektir." },
  { id: 26, sentence: "Can you _____ an exception this time?", blank: "make", options: ["do", "make", "take", "give"], correct: 1, tip: "'Make an exception' istisna yapmak demektir." },
  { id: 27, sentence: "He _____ a comment about her new hairstyle.", blank: "made", options: ["did", "made", "said", "told"], correct: 1, tip: "'Make a comment' yorum yapmak demektir." },
  { id: 28, sentence: "She _____ an apology for being late.", blank: "made", options: ["did", "made", "gave", "took"], correct: 1, tip: "'Make an apology' özür dilemek demektir." },
  { id: 29, sentence: "The police _____ an investigation into the matter.", blank: "conducted", options: ["made", "did", "conducted", "took"], correct: 2, tip: "'Conduct an investigation' soruşturma yürütmek demektir." },
  { id: 30, sentence: "She _____ a fortune in the stock market.", blank: "made", options: ["did", "made", "took", "earned"], correct: 1, tip: "'Make a fortune' servet kazanmak demektir." },
  { id: 31, sentence: "The new policy _____ effect immediately.", blank: "took", options: ["made", "did", "took", "had"], correct: 2, tip: "'Take effect' yürürlüğe girmek demektir." },
  { id: 32, sentence: "He always _____ his promises.", blank: "keeps", options: ["makes", "does", "keeps", "takes"], correct: 2, tip: "'Keep a promise' sözünü tutmak demektir." },
  { id: 33, sentence: "The teacher _____ a question about the assignment.", blank: "raised", options: ["made", "raised", "did", "took"], correct: 1, tip: "'Raise a question' soru sormak/gündeme getirmek demektir." },
  { id: 34, sentence: "They _____ a risk by investing in the startup.", blank: "took", options: ["made", "did", "took", "gave"], correct: 2, tip: "'Take a risk' risk almak demektir." },
  { id: 35, sentence: "The students _____ notes during the lecture.", blank: "took", options: ["made", "did", "took", "gave"], correct: 2, tip: "'Take notes' not tutmak demektir." },
  { id: 36, sentence: "We need to _____ the necessary arrangements.", blank: "make", options: ["do", "make", "take", "get"], correct: 1, tip: "'Make arrangements' düzenlemeler yapmak demektir." },
  { id: 37, sentence: "She _____ a living as a freelance writer.", blank: "earns", options: ["does", "makes", "earns", "takes"], correct: 2, tip: "'Earn a living' geçimini sağlamak demektir." },
  { id: 38, sentence: "The jury _____ a verdict after hours of deliberation.", blank: "reached", options: ["made", "reached", "took", "gave"], correct: 1, tip: "'Reach a verdict' karara varmak demektir." },
  { id: 39, sentence: "He _____ a glance at his watch.", blank: "took", options: ["made", "gave", "took", "had"], correct: 2, tip: "'Take a glance' bir bakış atmak demektir." },
  { id: 40, sentence: "The athlete _____ a new world record.", blank: "set", options: ["made", "set", "did", "broke"], correct: 1, tip: "'Set a record' rekor kırmak demektir." },
  { id: 41, sentence: "The news _____ widespread panic among the residents.", blank: "caused", options: ["made", "did", "caused", "brought"], correct: 2, tip: "'Cause panic' panik yaratmak demektir." },
  { id: 42, sentence: "She _____ a career change at the age of forty.", blank: "made", options: ["did", "made", "took", "had"], correct: 1, tip: "'Make a career change' kariyer degisikligi yapmak demektir." },
  { id: 43, sentence: "The children _____ fun of their younger brother.", blank: "made", options: ["did", "made", "had", "took"], correct: 1, tip: "'Make fun of' alay etmek demektir." },
  { id: 44, sentence: "He _____ the blame for the team's failure.", blank: "took", options: ["made", "did", "took", "gave"], correct: 2, tip: "'Take the blame' suclamayi kabul etmek demektir." },
  { id: 45, sentence: "The manager _____ an announcement to the staff.", blank: "made", options: ["did", "made", "gave", "told"], correct: 1, tip: "'Make an announcement' duyuru yapmak demektir." },
  { id: 46, sentence: "Please _____ your time; there is no rush.", blank: "take", options: ["make", "do", "take", "have"], correct: 2, tip: "'Take your time' aceleniz yok, yavaş olun demektir." },
  { id: 47, sentence: "The storm _____ havoc across the entire region.", blank: "wreaked", options: ["made", "wreaked", "did", "caused"], correct: 1, tip: "'Wreak havoc' yıkım yaratmak demektir." },
  { id: 48, sentence: "She _____ sight of her friend in the crowd.", blank: "caught", options: ["made", "took", "caught", "had"], correct: 2, tip: "'Catch sight of' gozune ilismek demektir." },
  { id: 49, sentence: "The company _____ bankruptcy last month.", blank: "filed", options: ["made", "did", "filed", "took"], correct: 2, tip: "'File for bankruptcy' iflas basvurusu yapmak demektir." },
  { id: 50, sentence: "He _____ a habit of reading before bed.", blank: "made", options: ["did", "made", "took", "kept"], correct: 1, tip: "'Make a habit' aliskanlik edinmek demektir." },
  { id: 51, sentence: "The government _____ measures to reduce pollution.", blank: "took", options: ["did", "made", "took", "gave"], correct: 2, tip: "'Take measures' onlem almak demektir." },
  { id: 52, sentence: "We need to _____ the deadline or face penalties.", blank: "meet", options: ["reach", "make", "meet", "take"], correct: 2, tip: "'Meet the deadline' son teslim tarihine yetismek." },
  { id: 53, sentence: "She _____ emphasis on the importance of teamwork.", blank: "placed", options: ["placed", "made", "did", "got"], correct: 0, tip: "'Place emphasis on' vurgulamak demektir." },
  { id: 54, sentence: "He _____ a living by selling paintings.", blank: "earned", options: ["did", "made", "earned", "took"], correct: 2, tip: "'Earn a living' gecimini saglamak demektir." },
  { id: 55, sentence: "The doctor _____ a thorough examination of the patient.", blank: "conducted", options: ["conducted", "did", "made", "took"], correct: 0, tip: "'Conduct an examination' muayene yapmak demektir." },
  { id: 56, sentence: "The study _____ light on the causes of the disease.", blank: "shed", options: ["shed", "threw", "made", "gave"], correct: 0, tip: "'Shed light on' bir konuyu aydinlatmak demektir." },
  { id: 57, sentence: "They _____ a deal after weeks of negotiation.", blank: "struck", options: ["made", "struck", "did", "took"], correct: 1, tip: "'Strike a deal' anlasma yapmak demektir." },
  { id: 58, sentence: "He _____ the consequences of his actions.", blank: "faced", options: ["met", "faced", "took", "did"], correct: 1, tip: "'Face the consequences' sonuclariyla yuzlesmek demektir." },
  { id: 59, sentence: "She _____ an exam to become a certified teacher.", blank: "took", options: ["did", "made", "took", "gave"], correct: 2, tip: "'Take an exam' sinava girmek demektir." },
  { id: 60, sentence: "The committee _____ a vote on the new proposal.", blank: "took", options: ["made", "did", "took", "gave"], correct: 2, tip: "'Take a vote' oylama yapmak demektir." },
  { id: 61, sentence: "He _____ a deep interest in ancient history.", blank: "took", options: ["made", "did", "took", "gave"], correct: 2, tip: "'Take an interest in' ilgi duymak demektir." },
  { id: 62, sentence: "The company _____ an inquiry into the incident.", blank: "launched", options: ["made", "launched", "took", "did"], correct: 1, tip: "'Launch an inquiry' sorusturma baslatmak demektir." },
  { id: 63, sentence: "She _____ a point of arriving early to every meeting.", blank: "made", options: ["did", "made", "took", "gave"], correct: 1, tip: "'Make a point of' ozen gostermek demektir." },
  { id: 64, sentence: "The court _____ a sentence of five years.", blank: "passed", options: ["made", "gave", "passed", "took"], correct: 2, tip: "'Pass a sentence' ceza vermek demektir." },
  { id: 65, sentence: "He _____ sight of an old friend across the street.", blank: "caught", options: ["made", "got", "caught", "took"], correct: 2, tip: "'Catch sight of' gozune ilismek demektir." },
  { id: 66, sentence: "The manager _____ a complaint about the noise.", blank: "made", options: ["did", "made", "took", "gave"], correct: 1, tip: "'Make a complaint' sikayet etmek demektir." },
  { id: 67, sentence: "He _____ a fortune in the stock market.", blank: "made", options: ["earned", "made", "got", "won"], correct: 1, tip: "'Make a fortune' servet kazanmak demektir." },
  { id: 68, sentence: "The students _____ notes during the lecture.", blank: "took", options: ["made", "did", "took", "wrote"], correct: 2, tip: "'Take notes' not almak demektir." },
  { id: 69, sentence: "The company _____ a loss of 2 million pounds.", blank: "made", options: ["did", "made", "had", "took"], correct: 1, tip: "'Make a loss' zarar etmek demektir." },
  { id: 70, sentence: "She _____ a great deal of attention to detail.", blank: "paid", options: ["gave", "paid", "made", "put"], correct: 1, tip: "'Pay attention' dikkat etmek demektir." },
  { id: 71, sentence: "The fire brigade _____ the blaze under control.", blank: "brought", options: ["put", "brought", "got", "kept"], correct: 1, tip: "'Bring under control' kontrol altina almak demektir." },
  { id: 72, sentence: "She _____ the blame for the project failure.", blank: "took", options: ["made", "did", "took", "gave"], correct: 2, tip: "'Take the blame' suclamayi kabul etmek demektir." },
  { id: 73, sentence: "The doctor _____ a diagnosis after running several tests.", blank: "made", options: ["did", "made", "took", "gave"], correct: 1, tip: "'Make a diagnosis' teshis koymak demektir." },
  { id: 74, sentence: "They _____ a compromise after a lengthy discussion.", blank: "reached", options: ["made", "reached", "took", "did"], correct: 1, tip: "'Reach a compromise' uzlasmaya varmak demektir." },
  { id: 75, sentence: "The charity _____ awareness about climate change.", blank: "raised", options: ["made", "raised", "grew", "did"], correct: 1, tip: "'Raise awareness' farkindalik yaratmak demektir." },
  { id: 76, sentence: "He _____ a promise to his mother that he would return safely.", blank: "made", options: ["did", "made", "gave", "told"], correct: 1, tip: "'Make a promise' soz vermek demektir." },
  { id: 77, sentence: "The teacher _____ the students permission to leave early.", blank: "gave", options: ["did", "made", "gave", "took"], correct: 2, tip: "'Give permission' izin vermek demektir." },
  { id: 78, sentence: "She _____ a leading role in the new play.", blank: "played", options: ["did", "made", "took", "played"], correct: 3, tip: "'Play a role' rol oynamak demektir." },
  { id: 79, sentence: "The athlete _____ a new world record in the 100m sprint.", blank: "set", options: ["made", "set", "broke", "did"], correct: 1, tip: "'Set a record' rekor kirmak demektir." },
  { id: 80, sentence: "They _____ an alliance with the neighbouring country.", blank: "formed", options: ["made", "formed", "did", "took"], correct: 1, tip: "'Form an alliance' ittifak kurmak demektir." },
  { id: 81, sentence: "The lecturer _____ a reference to the previous study.", blank: "made", options: ["did", "made", "gave", "took"], correct: 1, tip: "'Make a reference' referans/atif yapmak demektir." },
  { id: 82, sentence: "The jury _____ a verdict of not guilty.", blank: "reached", options: ["made", "gave", "reached", "took"], correct: 2, tip: "'Reach a verdict' karara varmak demektir." },
  { id: 83, sentence: "He _____ a risk by investing all his savings.", blank: "took", options: ["did", "made", "took", "had"], correct: 2, tip: "'Take a risk' risk almak demektir." },
  { id: 84, sentence: "The new evidence _____ doubt on the original theory.", blank: "cast", options: ["put", "made", "cast", "threw"], correct: 2, tip: "'Cast doubt on' suphe uyandirmak demektir." },
  { id: 85, sentence: "She _____ progress in learning to play the piano.", blank: "made", options: ["did", "made", "took", "had"], correct: 1, tip: "'Make progress' ilerleme kaydetmek demektir." },
  { id: 86, sentence: "The government _____ an effort to reduce unemployment.", blank: "made", options: ["did", "made", "took", "gave"], correct: 1, tip: "'Make an effort' caba gostermek demektir." },
  { id: 87, sentence: "The athlete _____ his best in the final race.", blank: "did", options: ["did", "made", "took", "gave"], correct: 0, tip: "'Do one's best' elinden gelenin en iyisini yapmak." },
  { id: 88, sentence: "She _____ access to all confidential documents.", blank: "gained", options: ["made", "gained", "took", "did"], correct: 1, tip: "'Gain access' erisim elde etmek demektir." },
  { id: 89, sentence: "The committee _____ a recommendation for further study.", blank: "made", options: ["did", "made", "gave", "took"], correct: 1, tip: "'Make a recommendation' onerge sunmak demektir." },
  { id: 90, sentence: "He _____ an apology to the entire team.", blank: "offered", options: ["did", "made", "offered", "gave"], correct: 2, tip: "'Offer an apology' ozur dilemek demektir." },
  { id: 91, sentence: "The manager _____ responsibility for the team's poor performance.", blank: "took", options: ["did", "made", "took", "had"], correct: 2, tip: "'Take responsibility' sorumluluk almak demektir." },
  { id: 92, sentence: "The negotiators _____ an agreement after three days.", blank: "reached", options: ["made", "reached", "did", "got"], correct: 1, tip: "'Reach an agreement' anlasmaya varmak demektir." },
  { id: 93, sentence: "The accident _____ place at around midnight.", blank: "took", options: ["made", "did", "took", "had"], correct: 2, tip: "'Take place' gerceklesmek demektir." },
  { id: 94, sentence: "She _____ advantage of the sale to buy new clothes.", blank: "took", options: ["made", "did", "took", "had"], correct: 2, tip: "'Take advantage of' yararlanmak demektir." },
  { id: 95, sentence: "The soldiers _____ duty at the border crossing.", blank: "stood", options: ["made", "did", "stood", "held"], correct: 2, tip: "'Stand duty' nobet tutmak demektir." },
  { id: 96, sentence: "They _____ a donation to the children's hospital.", blank: "made", options: ["did", "made", "gave", "took"], correct: 1, tip: "'Make a donation' bagis yapmak demektir." },
  { id: 97, sentence: "The politician _____ a pledge to cut taxes.", blank: "made", options: ["did", "made", "took", "gave"], correct: 1, tip: "'Make a pledge' taahhut vermek demektir." },
  { id: 98, sentence: "The journalist _____ an interview with the president.", blank: "conducted", options: ["did", "made", "conducted", "took"], correct: 2, tip: "'Conduct an interview' roportaj yapmak demektir." },
  { id: 99, sentence: "The company _____ a profit for the first time in years.", blank: "turned", options: ["made", "turned", "did", "got"], correct: 1, tip: "'Turn a profit' kar elde etmek demektir." },
  { id: 100, sentence: "He _____ tribute to his late mentor during the ceremony.", blank: "paid", options: ["made", "gave", "paid", "did"], correct: 2, tip: "'Pay tribute' saygilarini sunmak demektir." },
  { id: 101, sentence: "The researchers _____ a breakthrough in cancer treatment.", blank: "made", options: ["did", "made", "took", "had"], correct: 1, tip: "'Make a breakthrough' cigiracici bir kesfyapmak demektir." },
  { id: 102, sentence: "She _____ a reservation at the restaurant for eight o'clock.", blank: "made", options: ["did", "made", "took", "booked"], correct: 1, tip: "'Make a reservation' rezervasyon yapmak demektir." },
  { id: 103, sentence: "He _____ a confession after hours of questioning.", blank: "made", options: ["did", "made", "gave", "told"], correct: 1, tip: "'Make a confession' itiraf etmek demektir." },
  { id: 104, sentence: "The CEO _____ a statement about the company's future.", blank: "issued", options: ["made", "issued", "gave", "All of the above"], correct: 3, tip: "Hepsi aciklama yapmak icin kullanilabilir." },
  { id: 105, sentence: "The witness _____ evidence in court.", blank: "gave", options: ["did", "made", "gave", "told"], correct: 2, tip: "'Give evidence' ifade vermek demektir." },
  { id: 106, sentence: "They _____ a survey among local residents.", blank: "conducted", options: ["did", "made", "conducted", "took"], correct: 2, tip: "'Conduct a survey' anket yapmak demektir." },
  { id: 107, sentence: "The earthquake _____ extensive damage to the infrastructure.", blank: "caused", options: ["did", "made", "caused", "brought"], correct: 2, tip: "'Cause damage' hasara yol acmak demektir." },
  { id: 108, sentence: "She _____ full use of her time at the library.", blank: "made", options: ["did", "made", "took", "had"], correct: 1, tip: "'Make use of' yararlanmak demektir." },
  { id: 109, sentence: "He _____ a living as a freelance photographer.", blank: "made", options: ["did", "made", "took", "earned"], correct: 1, tip: "'Make a living' gecimini saglamak demektir." },
  { id: 110, sentence: "The team _____ a thorough analysis of the market trends.", blank: "carried out", options: ["did", "made", "carried out", "took"], correct: 2, tip: "'Carry out an analysis' analiz yapmak demektir." },
  { id: 111, sentence: "She _____ into tears when she heard the news.", blank: "burst", options: ["broke", "burst", "fell", "went"], correct: 1, tip: "'Burst into tears' aglamaya baslamak demektir." },
  { id: 112, sentence: "The committee _____ a decision to postpone the event.", blank: "made", options: ["did", "made", "took", "reached"], correct: 1, tip: "'Make a decision' karar vermek demektir." },
  { id: 113, sentence: "He _____ a deep breath before entering the stage.", blank: "took", options: ["did", "made", "took", "had"], correct: 2, tip: "'Take a breath' nefes almak demektir." },
  { id: 114, sentence: "The invention _____ a significant impact on modern life.", blank: "had", options: ["did", "made", "took", "had"], correct: 3, tip: "'Have an impact' etki yaratmak demektir." },
  { id: 115, sentence: "She _____ amends for her earlier rudeness.", blank: "made", options: ["did", "made", "took", "gave"], correct: 1, tip: "'Make amends' telafi etmek demektir." },
  { id: 116, sentence: "They _____ the conclusion that further research was needed.", blank: "drew", options: ["made", "drew", "reached", "Both B and C"], correct: 3, tip: "'Draw a conclusion' ve 'reach a conclusion' ikisi de kullanilir." },
  { id: 117, sentence: "The company _____ a bid for the government contract.", blank: "submitted", options: ["made", "submitted", "gave", "Both A and B"], correct: 3, tip: "'Make a bid' ve 'submit a bid' teklif vermek demektir." },
  { id: 118, sentence: "He _____ sight of the ship on the horizon.", blank: "caught", options: ["made", "caught", "took", "got"], correct: 1, tip: "'Catch sight of' gormek/fark etmek demektir." },
  { id: 119, sentence: "She _____ a comment about the quality of the food.", blank: "made", options: ["did", "made", "gave", "told"], correct: 1, tip: "'Make a comment' yorum yapmak demektir." },
  { id: 120, sentence: "The factory _____ employment to over 500 people.", blank: "provides", options: ["does", "makes", "provides", "gives"], correct: 2, tip: "'Provide employment' istihdam saglamak demektir." },
  { id: 121, sentence: "He _____ his temper during the argument.", blank: "lost", options: ["broke", "lost", "missed", "dropped"], correct: 1, tip: "'Lose one's temper' sinirini kaybetmek demektir." },
  { id: 122, sentence: "The minister _____ an assurance that taxes would not rise.", blank: "gave", options: ["did", "made", "gave", "told"], correct: 2, tip: "'Give an assurance' guvence vermek demektir." },
  { id: 123, sentence: "She _____ no attempt to hide her disappointment.", blank: "made", options: ["did", "made", "took", "gave"], correct: 1, tip: "'Make an attempt' girisimde bulunmak demektir." },
  { id: 124, sentence: "The school _____ strict rules regarding attendance.", blank: "enforces", options: ["does", "makes", "enforces", "keeps"], correct: 2, tip: "'Enforce rules' kurallari uygulamak demektir." },
  { id: 125, sentence: "He _____ a turn for the worse after the operation.", blank: "took", options: ["did", "made", "took", "had"], correct: 2, tip: "'Take a turn for the worse' kotuye gitmek demektir." },
  { id: 126, sentence: "She _____ an objection to the proposed changes.", blank: "raised", options: ["did", "made", "raised", "gave"], correct: 2, tip: "'Raise an objection' itiraz etmek demektir." },
  { id: 127, sentence: "The witness _____ a statement to the police.", blank: "gave", options: ["did", "made", "gave", "told"], correct: 2, tip: "'Give a statement' ifade vermek demektir." },
  { id: 128, sentence: "He _____ his homework before going out to play.", blank: "did", options: ["did", "made", "took", "got"], correct: 0, tip: "'Do homework' odev yapmak demektir." },
  { id: 129, sentence: "The team _____ a defeat in the semi-final.", blank: "suffered", options: ["took", "made", "suffered", "had"], correct: 2, tip: "'Suffer a defeat' yenilgiye ugramak demektir." },
  { id: 130, sentence: "She _____ a glance at the clock on the wall.", blank: "took", options: ["made", "did", "took", "cast"], correct: 2, tip: "'Take a glance' goz atmak demektir." },
]

const QUESTIONS_PER_SET = 8

export function CollocationsQuiz() {
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [activeQuestions, setActiveQuestions] = useState<CollocationQ[]>([])
  const [answers, setAnswers] = useState<boolean[]>([])
  const [currentSet, setCurrentSet] = useState(1)
  const [totalScore, setTotalScore] = useState(0)
  const [totalQs, setTotalQs] = useState(0)

  useEffect(() => {
    loadNewSet()
  }, [])

  const loadNewSet = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, QUESTIONS_PER_SET)
    setActiveQuestions(shuffled)
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
  const isCorrect = idx === activeQuestions[currentQ].correct
  playSoundEffect(isCorrect ? "correct" : "wrong")
  if (isCorrect) {
      setScore(s => s + 1)
      const progress = addXp(XP_REWARDS.collocation_correct, "collocation")
      showXpToast(XP_REWARDS.collocation_correct, "Collocation doğru!")
      const newAchievements = checkAndUnlockAchievements(progress)
      for (const a of newAchievements) showAchievementToast(a)
    }
    setAnswers(prev => [...prev, isCorrect])
  }

  const handleNext = () => {
    if (currentQ < activeQuestions.length - 1) {
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
    setTotalQs(prev => prev + activeQuestions.length)
    setCurrentSet(s => s + 1)
    loadNewSet()
  }

  const resetAll = () => {
    setCurrentSet(1)
    setTotalScore(0)
    setTotalQs(0)
    loadNewSet()
  }

  if (activeQuestions.length === 0) return null

  const q = activeQuestions[currentQ]
  const progress = ((currentQ + (finished ? 1 : 0)) / activeQuestions.length) * 100

  if (finished) {
    const percentage = Math.round((score / activeQuestions.length) * 100)
    return (
      <Card className="border border-border/50 overflow-hidden rounded-lg">
        <div className="h-1.5 bg-muted">
          <div className="h-full bg-gradient-to-r from-cyan-400 to-teal-500 w-full" />
        </div>
        <CardContent className="p-6 text-center">
          {currentSet > 1 && (
            <p className="text-sm text-muted-foreground mb-2">
              Set {currentSet} | Toplam: {totalScore + score}/{totalQs + activeQuestions.length}
            </p>
          )}
          <div className={cn(
            "w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center",
            percentage >= 80 ? "bg-emerald-100" : percentage >= 50 ? "bg-amber-100" : "bg-red-100"
          )}>
            <span className={cn(
              "text-2xl font-bold",
              percentage >= 80 ? "text-emerald-600" : percentage >= 50 ? "text-amber-600" : "text-red-600"
            )}>%{percentage}</span>
          </div>
          <h4 className="font-serif text-xl mb-2">
            {percentage >= 80 ? "Harika!" : percentage >= 50 ? "İyi gidiyorsun!" : "Pratik gerekli!"}
          </h4>
          <p className="text-muted-foreground text-sm mb-3">
            {QUESTIONS_PER_SET} sorudan {score} doğru
          </p>
          <div className="flex justify-center gap-1 mb-4">
            {answers.map((correct, i) => (
              <div key={i} className={cn("w-6 h-2 rounded-full", correct ? "bg-emerald-400" : "bg-red-300")} />
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={continueSet} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              <ArrowRight className="w-4 h-4 mr-2" />Sonraki Set
            </Button>
            <Button onClick={resetAll} variant="outline" className="w-full bg-transparent">
              <RotateCcw className="w-4 h-4 mr-2" />Sıfırla
            </Button>
          </div>
          <div className="mt-4 pt-4 border-t border-border/50">
                  <ShareChallenge
                    title="Collocation Quiz Sonucum"
                    scoreText={`Collocation Quiz'de %${percentage} başarı yakaladım! ${score}/${QUESTIONS_PER_SET} doğru.`}
                    challengeText="Sen de İngilizce collocation bilgini test et:"
                    toolSlug="collocations"
                    challengeScore={score}
                    challengeTotal={QUESTIONS_PER_SET}
                  />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="py-4">
      <QuizHeader title={`Collocations${currentSet > 1 ? ` - Set ${currentSet}` : ''}`} current={currentQ + 1} total={activeQuestions.length} lastAnswerCorrect={showResult ? selected === activeQuestions[currentQ]?.correct : null} />

      <Card className="border border-border/50 mb-3 rounded-lg">
        <CardContent className="p-5">
          <p className="text-base leading-relaxed mb-4 font-medium">
            {q.sentence.split("_____").map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className="inline-block mx-1 px-3 py-0.5 rounded bg-cyan-100 text-cyan-700 font-bold border-b-2 border-cyan-300">
                    {showResult ? q.blank : "?"}
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
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={showResult}
                  className={cn(
                    "p-3 rounded-lg text-sm font-medium transition-all border-2 text-left",
                    showResult && isCorrect && "bg-emerald-50 border-emerald-400 text-emerald-700",
                    showResult && isSelected && !isCorrect && "bg-red-50 border-red-400 text-red-700",
                    showResult && !isSelected && !isCorrect && "opacity-50 border-transparent",
                    !showResult && "border-border hover:border-cyan-300 hover:bg-cyan-50/50 active:scale-[0.97]"
                  )}
                >
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
              <span className="font-medium text-foreground">İpucu: </span>{q.tip}
            </div>
          )}
        </CardContent>
      </Card>

      {showResult && (
        <Button onClick={handleNext} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
          {currentQ < activeQuestions.length - 1 ? "Sonraki Soru" : "Sonuçları Gör"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      )}
    </div>
  )
}
