"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, RotateCcw, CheckCircle2, XCircle, Repeat } from "lucide-react"
import { cn } from "@/lib/utils"
import { addXp, checkAndUnlockAchievements, XP_REWARDS } from "@/lib/xp-system"
import { showXpToast, showAchievementToast, playSoundEffect } from "@/components/xp-toast"
import { ShareChallenge } from "@/components/share-challenge"
import { QuizHeader } from "@/components/quiz-header"

interface TransformQ {
  id: number
  type: string
  typeColor: string
  original: string
  instruction: string
  options: string[]
  correct: number
  explanation: string
}

const questions: TransformQ[] = [
  { id: 1, type: "Active -> Passive", typeColor: "bg-blue-100 text-blue-700", original: "The teacher explained the lesson.", instruction: "Passive voice'a cevirin:", options: ["The lesson was explained by the teacher.", "The lesson explained the teacher.", "The teacher was explained the lesson.", "The lesson is explained by the teacher."], correct: 0, explanation: "Simple Past Passive: was/were + V3. 'The lesson was explained by the teacher.'" },
  { id: 2, type: "Active -> Passive", typeColor: "bg-blue-100 text-blue-700", original: "Someone has stolen my bicycle.", instruction: "Passive voice'a cevirin:", options: ["My bicycle was stolen.", "My bicycle has been stolen.", "My bicycle is stolen.", "My bicycle had been stolen."], correct: 1, explanation: "Present Perfect Passive: has/have + been + V3." },
  { id: 3, type: "Direct -> Reported", typeColor: "bg-emerald-100 text-emerald-700", original: "\"I am studying English,\" she said.", instruction: "Reported speech'e cevirin:", options: ["She said she is studying English.", "She said she was studying English.", "She said she has studied English.", "She said she studies English."], correct: 1, explanation: "Direct speech Present Continuous -> Reported speech Past Continuous." },
  { id: 4, type: "Direct -> Reported", typeColor: "bg-emerald-100 text-emerald-700", original: "\"I will call you tomorrow,\" he said.", instruction: "Reported speech'e cevirin:", options: ["He said he will call me tomorrow.", "He said he would call me the next day.", "He said he calls me tomorrow.", "He said he had called me the next day."], correct: 1, explanation: "'Will' -> 'would', 'tomorrow' -> 'the next day' olur." },
  { id: 5, type: "If Clause", typeColor: "bg-purple-100 text-purple-700", original: "I don't have money. I can't buy a car.", instruction: "2nd Conditional ile birlestirin:", options: ["If I have money, I can buy a car.", "If I had money, I could buy a car.", "If I will have money, I would buy a car.", "If I had money, I can buy a car."], correct: 1, explanation: "2nd Conditional: If + Past Simple, would/could + V1." },
  { id: 6, type: "If Clause", typeColor: "bg-purple-100 text-purple-700", original: "She didn't study. She failed the exam.", instruction: "3rd Conditional ile birlestirin:", options: ["If she studied, she wouldn't fail.", "If she had studied, she wouldn't have failed.", "If she studies, she won't fail.", "If she would study, she didn't fail."], correct: 1, explanation: "3rd Conditional: If + Past Perfect, would + have + V3." },
  { id: 7, type: "Relative Clause", typeColor: "bg-amber-100 text-amber-700", original: "The man is my uncle. He lives next door.", instruction: "Relative clause ile birlestirin:", options: ["The man who lives next door is my uncle.", "The man which lives next door is my uncle.", "The man where lives next door is my uncle.", "The man whose lives next door is my uncle."], correct: 0, explanation: "Insanlar icin 'who' relative pronoun kullanilir." },
  { id: 8, type: "Relative Clause", typeColor: "bg-amber-100 text-amber-700", original: "The book was interesting. I read it last week.", instruction: "Relative clause ile birlestirin:", options: ["The book who I read last week was interesting.", "The book which I read last week was interesting.", "The book where I read last week was interesting.", "The book whose I read last week was interesting."], correct: 1, explanation: "Nesneler icin 'which' veya 'that' kullanilir." },
  { id: 9, type: "Wish Clause", typeColor: "bg-rose-100 text-rose-700", original: "I can't speak French.", instruction: "Wish clause'a cevirin:", options: ["I wish I can speak French.", "I wish I could speak French.", "I wish I will speak French.", "I wish I spoke French."], correct: 1, explanation: "Simdi yapamadigi sey icin: I wish + could + V1." },
  { id: 10, type: "Causative", typeColor: "bg-orange-100 text-orange-700", original: "A mechanic repaired my car.", instruction: "Causative yapiyla yeniden yazin:", options: ["I repaired my car.", "I had my car repaired.", "I got repaired my car.", "My car was repaired me."], correct: 1, explanation: "Causative: have + object + V3 (past participle)." },
  { id: 11, type: "Inversion", typeColor: "bg-indigo-100 text-indigo-700", original: "She had never seen such a beautiful sunset.", instruction: "Inversion yapiyla yeniden yazin:", options: ["Never she had seen such a beautiful sunset.", "Never had she seen such a beautiful sunset.", "Had never she seen such a beautiful sunset.", "She never had seen such a beautiful sunset."], correct: 1, explanation: "Negative inversion: Never + had + subject + V3." },
  { id: 12, type: "Active -> Passive", typeColor: "bg-blue-100 text-blue-700", original: "They are building a new hospital.", instruction: "Passive voice'a cevirin:", options: ["A new hospital is being built.", "A new hospital is built.", "A new hospital was being built.", "A new hospital has been built."], correct: 0, explanation: "Present Continuous Passive: is/are + being + V3." },
  { id: 13, type: "Wish Clause", typeColor: "bg-rose-100 text-rose-700", original: "I didn't bring my umbrella. Now I'm wet.", instruction: "Wish clause'a cevirin:", options: ["I wish I bring my umbrella.", "I wish I brought my umbrella.", "I wish I had brought my umbrella.", "I wish I would bring my umbrella."], correct: 2, explanation: "Gecmiste yapmadigina pismanlik: I wish + Past Perfect." },
  { id: 14, type: "Causative", typeColor: "bg-orange-100 text-orange-700", original: "A photographer took our family photo.", instruction: "Causative yapiyla yeniden yazin:", options: ["We took our family photo.", "We had our family photo taken.", "We got taken our family photo.", "Our family photo took us."], correct: 1, explanation: "Causative: have + object + V3." },
  { id: 15, type: "Inversion", typeColor: "bg-indigo-100 text-indigo-700", original: "I have rarely seen such talent.", instruction: "Inversion yapiyla yeniden yazin:", options: ["Rarely I have seen such talent.", "Rarely have I seen such talent.", "Have rarely I seen such talent.", "I rarely have seen such talent."], correct: 1, explanation: "Negative inversion: Rarely + have + subject + V3." },
  { id: 16, type: "Active -> Passive", typeColor: "bg-blue-100 text-blue-700", original: "People believe that he is innocent.", instruction: "Passive voice'a cevirin:", options: ["He is believed to be innocent.", "He is believed being innocent.", "He believes to be innocent.", "It believes he is innocent."], correct: 0, explanation: "Impersonal passive: Subject + is believed + to be." },
  { id: 17, type: "Direct -> Reported", typeColor: "bg-emerald-100 text-emerald-700", original: "\"Can you help me?\" she asked.", instruction: "Reported speech'e cevirin:", options: ["She asked can I help her.", "She asked if I could help her.", "She asked me to can help her.", "She asked that I help her."], correct: 1, explanation: "'Can' -> 'could', soru reported speech'te 'if/whether' ile yapılır." },
  { id: 18, type: "If Clause", typeColor: "bg-purple-100 text-purple-700", original: "I regret not studying harder.", instruction: "3rd Conditional ile yeniden yazin:", options: ["If I study harder, I won't regret.", "If I studied harder, I wouldn't regret.", "If I had studied harder, I wouldn't have regretted.", "If I would study harder, I regret."], correct: 2, explanation: "3rd Conditional: If + Past Perfect, would have + V3." },
  { id: 19, type: "Relative Clause", typeColor: "bg-amber-100 text-amber-700", original: "The hotel was expensive. We stayed there.", instruction: "Relative clause ile birlestirin:", options: ["The hotel which we stayed was expensive.", "The hotel where we stayed was expensive.", "The hotel who we stayed was expensive.", "The hotel that we stayed was expensive."], correct: 1, explanation: "Yer belirtmek icin 'where' relative adverb kullanılır." },
  { id: 20, type: "Wish Clause", typeColor: "bg-rose-100 text-rose-700", original: "He keeps interrupting me.", instruction: "Wish clause'a cevirin:", options: ["I wish he stops interrupting me.", "I wish he would stop interrupting me.", "I wish he stopped interrupting me.", "I wish he will stop interrupting me."], correct: 1, explanation: "'Would stop' baskasinin davranisini degistirmesini dilemek icin kullanilir." },
  { id: 21, type: "Causative", typeColor: "bg-orange-100 text-orange-700", original: "Someone cleaned the windows yesterday.", instruction: "Causative yapiyla yeniden yazin:", options: ["I cleaned the windows.", "I had the windows cleaned.", "I got the windows clean.", "The windows had cleaned."], correct: 1, explanation: "Causative: had + object + V3 (past participle)." },
  { id: 22, type: "Inversion", typeColor: "bg-indigo-100 text-indigo-700", original: "He not only passed the exam but also got the highest mark.", instruction: "Inversion yapiyla yeniden yazin:", options: ["Not only he passed the exam.", "Not only did he pass the exam, but he also got the highest mark.", "He not only did pass the exam.", "Only not did he pass the exam."], correct: 1, explanation: "Not only + did + subject + V1, but also..." },
  { id: 23, type: "Active -> Passive", typeColor: "bg-blue-100 text-blue-700", original: "They will announce the results tomorrow.", instruction: "Passive voice'a cevirin:", options: ["The results will announced tomorrow.", "The results will be announced tomorrow.", "The results are announced tomorrow.", "The results were announced tomorrow."], correct: 1, explanation: "Future Passive: will + be + V3." },
  { id: 24, type: "Direct -> Reported", typeColor: "bg-emerald-100 text-emerald-700", original: "\"Don't touch that!\" the guard shouted.", instruction: "Reported speech'e cevirin:", options: ["The guard shouted not to touch that.", "The guard told them don't touch that.", "The guard ordered them not to touch that.", "The guard said them to not touch."], correct: 2, explanation: "Emir reported speech: ordered + object + not to + V1." },
  { id: 25, type: "Active -> Passive", typeColor: "bg-blue-100 text-blue-700", original: "People speak English all over the world.", instruction: "Passive voice'a cevirin:", options: ["English is spoken all over the world.", "English spoken all over the world.", "English was spoken all over the world.", "English has been spoken all over the world."], correct: 0, explanation: "Simple Present Passive: is/are + V3." },
  { id: 26, type: "If Clause", typeColor: "bg-purple-100 text-purple-700", original: "He is not careful. He makes mistakes.", instruction: "1st Conditional ile birlestirin:", options: ["If he is not careful, he will make mistakes.", "If he was not careful, he would make mistakes.", "If he had been careful, he wouldn't have made mistakes.", "If he is careful, he made mistakes."], correct: 0, explanation: "1st Conditional: If + Present Simple, will + V1." },
  { id: 27, type: "Relative Clause", typeColor: "bg-amber-100 text-amber-700", original: "The woman is a doctor. Her husband works at the bank.", instruction: "Relative clause ile birlestirin:", options: ["The woman who husband works at the bank is a doctor.", "The woman whose husband works at the bank is a doctor.", "The woman which husband works at the bank is a doctor.", "The woman that husband works at the bank is a doctor."], correct: 1, explanation: "Sahiplik bildirmek icin 'whose' kullanilir." },
  { id: 28, type: "Causative", typeColor: "bg-orange-100 text-orange-700", original: "A painter is painting our house.", instruction: "Causative yapiyla yeniden yazin:", options: ["We are painting our house.", "We are having our house painted.", "Our house is being painted us.", "We got our house paint."], correct: 1, explanation: "Present Continuous Causative: am/is/are + having + object + V3." },
  { id: 29, type: "Wish Clause", typeColor: "bg-rose-100 text-rose-700", original: "It is raining and I hate it.", instruction: "Wish clause'a cevirin:", options: ["I wish it doesn't rain.", "I wish it wouldn't rain.", "I wish it didn't rain.", "I wish it hasn't rained."], correct: 1, explanation: "'Would stop/wouldn't' surekli olan ve rahatsiz eden durumlar icin kullanilir." },
  { id: 30, type: "Inversion", typeColor: "bg-indigo-100 text-indigo-700", original: "He only realized his mistake after the meeting.", instruction: "Inversion yapiyla yeniden yazin:", options: ["Only after the meeting he realized his mistake.", "Only after the meeting did he realize his mistake.", "After only the meeting he did realize his mistake.", "He did realize only after the meeting his mistake."], correct: 1, explanation: "Only after + noun + did + subject + verb." },
  { id: 31, type: "Direct -> Reported", typeColor: "bg-emerald-100 text-emerald-700", original: "\"Where do you live?\" she asked me.", instruction: "Reported speech'e cevirin:", options: ["She asked me where do I live.", "She asked me where I lived.", "She asked me where did I live.", "She told me where I live."], correct: 1, explanation: "Soru reported speech'te duz cumle sirasina doner: asked + where + S + V(past)." },
  { id: 32, type: "Active -> Passive", typeColor: "bg-blue-100 text-blue-700", original: "They had completed the project before the deadline.", instruction: "Passive voice'a cevirin:", options: ["The project had been completed before the deadline.", "The project was completed before the deadline.", "The project has been completed before the deadline.", "The project completed before the deadline."], correct: 0, explanation: "Past Perfect Passive: had + been + V3." },
  { id: 33, type: "If Clause", typeColor: "bg-purple-100 text-purple-700", original: "She went to bed late. She overslept.", instruction: "3rd Conditional ile birlestirin:", options: ["If she didn't go to bed late, she wouldn't oversleep.", "If she hadn't gone to bed late, she wouldn't have overslept.", "If she doesn't go to bed late, she won't oversleep.", "If she wouldn't go late, she hasn't overslept."], correct: 1, explanation: "3rd Conditional: If + Past Perfect, would have + V3." },
  { id: 34, type: "Relative Clause", typeColor: "bg-amber-100 text-amber-700", original: "I remember the day. We first met on that day.", instruction: "Relative clause ile birlestirin:", options: ["I remember the day which we first met.", "I remember the day when we first met.", "I remember the day who we first met.", "I remember the day where we first met."], correct: 1, explanation: "Zaman belirtmek icin 'when' relative adverb kullanilir." },
  { id: 35, type: "Causative", typeColor: "bg-orange-100 text-orange-700", original: "A dentist checked my teeth last week.", instruction: "Causative yapiyla yeniden yazin:", options: ["I checked my teeth last week.", "I had my teeth checked last week.", "My teeth had checked last week.", "I got checked my teeth last week."], correct: 1, explanation: "Past Simple Causative: had + object + V3." },
  { id: 36, type: "Inversion", typeColor: "bg-indigo-100 text-indigo-700", original: "She was so tired that she fell asleep immediately.", instruction: "Inversion yapiyla yeniden yazin:", options: ["So tired she was that she fell asleep.", "So tired was she that she fell asleep immediately.", "Tired so was she that she fell asleep.", "She was so tired she immediately fell."], correct: 1, explanation: "So + adjective + was/were + subject + that..." },
  { id: 37, type: "Active -> Passive", typeColor: "bg-blue-100 text-blue-700", original: "The company must pay all employees by Friday.", instruction: "Passive voice'a cevirin:", options: ["All employees must be paid by Friday.", "All employees must paid by Friday.", "All employees must be paying by Friday.", "All employees are paid must by Friday."], correct: 0, explanation: "Modal Passive: must + be + V3." },
  { id: 38, type: "Direct -> Reported", typeColor: "bg-emerald-100 text-emerald-700", original: "\"I have never seen such a thing,\" he said.", instruction: "Reported speech'e cevirin:", options: ["He said he has never seen such a thing.", "He said he had never seen such a thing.", "He said he never saw such a thing.", "He said he would never see such a thing."], correct: 1, explanation: "Present Perfect -> Past Perfect: have seen -> had seen." },
  { id: 39, type: "If Clause", typeColor: "bg-purple-100 text-purple-700", original: "I don't have an umbrella. I will get wet.", instruction: "2nd Conditional ile birlestirin:", options: ["If I have an umbrella, I won't get wet.", "If I had an umbrella, I wouldn't get wet.", "If I had had an umbrella, I wouldn't have got wet.", "If I will have an umbrella, I won't get wet."], correct: 1, explanation: "2nd Conditional: If + Past Simple, would + V1." },
  { id: 40, type: "Wish Clause", typeColor: "bg-rose-100 text-rose-700", original: "I lost my phone yesterday.", instruction: "Wish clause'a cevirin:", options: ["I wish I don't lose my phone.", "I wish I didn't lose my phone.", "I wish I hadn't lost my phone.", "I wish I won't lose my phone."], correct: 2, explanation: "Gecmiste olan pisman oldugumuz eylem: I wish + Past Perfect." },
  { id: 41, type: "Causative", typeColor: "bg-orange-100 text-orange-700", original: "A tailor is making a suit for me.", instruction: "Causative yapiyla yeniden yazin:", options: ["I am making a suit.", "I am having a suit made.", "A suit is being made me.", "I am getting a suit make."], correct: 1, explanation: "Present Continuous Causative: am having + object + V3." },
  { id: 42, type: "Inversion", typeColor: "bg-indigo-100 text-indigo-700", original: "I had hardly finished eating when the doorbell rang.", instruction: "Inversion yapiyla yeniden yazin:", options: ["Hardly I had finished eating when the doorbell rang.", "Hardly had I finished eating when the doorbell rang.", "Had hardly I finished eating when the doorbell rang.", "Finished hardly had I eating when the doorbell rang."], correct: 1, explanation: "Negative inversion: Hardly + had + subject + V3 + when." },
  { id: 43, type: "Relative Clause", typeColor: "bg-amber-100 text-amber-700", original: "The girl won the prize. I told you about her.", instruction: "Relative clause ile birlestirin:", options: ["The girl who I told you won the prize.", "The girl about whom I told you won the prize.", "The girl which I told you about won the prize.", "The girl whose I told you about won the prize."], correct: 1, explanation: "Preposition + whom: about whom I told you." },
  { id: 44, type: "Active -> Passive", typeColor: "bg-blue-100 text-blue-700", original: "Nobody has watered the plants for weeks.", instruction: "Passive voice'a cevirin:", options: ["The plants haven't been watered for weeks.", "The plants wasn't watered for weeks.", "The plants aren't watered for weeks.", "The plants didn't water for weeks."], correct: 0, explanation: "Present Perfect Passive Negative: haven't been + V3." },
  { id: 45, type: "Direct -> Reported", typeColor: "bg-emerald-100 text-emerald-700", original: "\"I was working all day,\" she told me.", instruction: "Reported speech'e cevirin:", options: ["She told me she was working all day.", "She told me she had been working all day.", "She told me she has been working all day.", "She told me she works all day."], correct: 1, explanation: "Past Continuous -> Past Perfect Continuous: was working -> had been working." },
  { id: 46, type: "If Clause", typeColor: "bg-purple-100 text-purple-700", original: "He missed the bus. He arrived late to work.", instruction: "3rd Conditional ile birlestirin:", options: ["If he didn't miss the bus, he wouldn't arrive late.", "If he hadn't missed the bus, he wouldn't have arrived late.", "If he doesn't miss the bus, he won't arrive late.", "If he won't miss the bus, he didn't arrive late."], correct: 1, explanation: "3rd Conditional: If + Past Perfect, would have + V3." },
  { id: 47, type: "Causative", typeColor: "bg-orange-100 text-orange-700", original: "A plumber will fix the leak tomorrow.", instruction: "Causative yapiyla yeniden yazin:", options: ["We will fix the leak.", "We will have the leak fixed tomorrow.", "The leak will get fix tomorrow.", "We will be fixing the leak."], correct: 1, explanation: "Future Causative: will have + object + V3." },
  { id: 48, type: "Wish Clause", typeColor: "bg-rose-100 text-rose-700", original: "I can't play the guitar.", instruction: "Wish clause'a cevirin:", options: ["I wish I can play the guitar.", "I wish I could play the guitar.", "I wish I will play the guitar.", "I wish I played the guitar."], correct: 1, explanation: "Simdiki zamanda yapamadigi sey: I wish + could + V1." },
  { id: 49, type: "Active -> Passive", typeColor: "bg-blue-100 text-blue-700", original: "They are building a new hospital in the city.", instruction: "Passive voice'a cevirin:", options: ["A new hospital is being built in the city.", "A new hospital is built in the city.", "A new hospital was being built in the city.", "A new hospital has been built in the city."], correct: 0, explanation: "Present Continuous Passive: is being + V3." },
  { id: 50, type: "Direct -> Reported", typeColor: "bg-emerald-100 text-emerald-700", original: "\"Don't touch that wire,\" she warned me.", instruction: "Reported speech'e cevirin:", options: ["She warned me not to touch that wire.", "She warned me to not touch that wire.", "She warned me I don't touch that wire.", "She warned me that I shouldn't touch wire."], correct: 0, explanation: "Warn + object + not to: She warned me not to touch." },
  { id: 51, type: "If Clause", typeColor: "bg-purple-100 text-purple-700", original: "Study hard. You will pass the exam.", instruction: "1st Conditional ile birlestirin:", options: ["If you study hard, you will pass the exam.", "If you studied hard, you would pass the exam.", "If you had studied hard, you would have passed.", "Study hard so you passed the exam."], correct: 0, explanation: "1st Conditional: If + Present Simple, will + V1." },
  { id: 52, type: "Causative", typeColor: "bg-orange-100 text-orange-700", original: "Someone cleaned our carpets yesterday.", instruction: "Causative yapiyla yeniden yazin:", options: ["We cleaned our carpets.", "We had our carpets cleaned yesterday.", "Our carpets got clean yesterday.", "We were cleaning our carpets."], correct: 1, explanation: "Past Causative: had + object + V3." },
  { id: 53, type: "Inversion", typeColor: "bg-indigo-100 text-indigo-700", original: "I have never seen such a beautiful sunset.", instruction: "Inversion yapiyla yeniden yazin:", options: ["Never I have seen such a beautiful sunset.", "Never have I seen such a beautiful sunset.", "I have seen never such a beautiful sunset.", "Such a beautiful sunset I have never seen."], correct: 1, explanation: "Negative inversion: Never + have + subject + V3." },
  { id: 54, type: "Relative Clause", typeColor: "bg-amber-100 text-amber-700", original: "The man helped us. His wife is a doctor.", instruction: "Relative clause ile birlestirin:", options: ["The man who his wife is a doctor helped us.", "The man whose wife is a doctor helped us.", "The man whom wife is a doctor helped us.", "The man which wife is a doctor helped us."], correct: 1, explanation: "'Whose' sahiplik bildiren relative pronoun." },
  { id: 55, type: "Active -> Passive", typeColor: "bg-blue-100 text-blue-700", original: "Someone had already opened the letter when I arrived.", instruction: "Passive voice'a cevirin:", options: ["The letter has been already opened.", "The letter had already been opened when I arrived.", "The letter was already opened.", "The letter already opened."], correct: 1, explanation: "Past Perfect Passive: had been + V3." },
  { id: 56, type: "Direct -> Reported", typeColor: "bg-emerald-100 text-emerald-700", original: "\"Where did you buy this dress?\" she asked me.", instruction: "Reported speech'e cevirin:", options: ["She asked me where did I buy that dress.", "She asked me where I had bought that dress.", "She asked me where I buy that dress.", "She asked where had I bought that dress."], correct: 1, explanation: "Reported question: asked where + normal sıra + tense shift." },
  { id: 57, type: "If Clause", typeColor: "bg-purple-100 text-purple-700", original: "She didn't apply for the scholarship. She didn't get it.", instruction: "3rd Conditional ile birlestirin:", options: ["If she applied, she would get the scholarship.", "If she had applied, she would have got the scholarship.", "If she applies, she will get the scholarship.", "If she would apply, she would get the scholarship."], correct: 1, explanation: "3rd Conditional: If + Past Perfect, would have + V3." },
  { id: 58, type: "Wish Clause", typeColor: "bg-rose-100 text-rose-700", original: "He smokes too much.", instruction: "Wish clause'a cevirin:", options: ["I wish he doesn't smoke.", "I wish he didn't smoke so much.", "I wish he won't smoke.", "I wish he hadn't smoked."], correct: 1, explanation: "Simdiki zamanda istek: I wish + Past Simple." },
  { id: 59, type: "Causative", typeColor: "bg-orange-100 text-orange-700", original: "A professional is designing our website.", instruction: "Causative yapiyla yeniden yazin:", options: ["We are designing our website.", "We are having our website designed.", "Our website is being designing.", "We get our website design."], correct: 1, explanation: "Present Continuous Causative: are having + object + V3." },
  { id: 60, type: "Inversion", typeColor: "bg-indigo-100 text-indigo-700", original: "She not only sings well but also dances beautifully.", instruction: "Inversion yapiyla yeniden yazin:", options: ["Not only she sings well but also dances beautifully.", "Not only does she sing well, but she also dances beautifully.", "She does not only sing well but also dance.", "Only not does she sing well."], correct: 1, explanation: "Not only + auxiliary + subject + verb." },
  { id: 61, type: "Relative Clause", typeColor: "bg-amber-100 text-amber-700", original: "I met a woman. She works at NASA.", instruction: "Relative clause ile birlestirin:", options: ["I met a woman which works at NASA.", "I met a woman whose works at NASA.", "I met a woman who works at NASA.", "I met a woman whom works at NASA."], correct: 2, explanation: "'Who' özne konumundaki insanlar için relative pronoun." },
  { id: 62, type: "Active -> Passive", typeColor: "bg-blue-100 text-blue-700", original: "They will have completed the bridge by next summer.", instruction: "Passive voice'a cevirin:", options: ["The bridge will have completed by next summer.", "The bridge will have been completed by next summer.", "The bridge will be completing by next summer.", "The bridge is being completed by next summer."], correct: 1, explanation: "Future Perfect Passive: will have been + V3." },
  { id: 63, type: "Direct -> Reported", typeColor: "bg-emerald-100 text-emerald-700", original: "\"Can you help me with my homework?\" he asked.", instruction: "Reported speech'e cevirin:", options: ["He asked can I help him with homework.", "He asked if I could help him with his homework.", "He asked that I can help with homework.", "He asked me to help his homework."], correct: 1, explanation: "Reported request: asked if + could (tense shift)." },
  { id: 64, type: "If Clause", typeColor: "bg-purple-100 text-purple-700", original: "You might get lost. Take a map.", instruction: "1st Conditional ile birlestirin:", options: ["If you don't take a map, you might get lost.", "If you didn't take a map, you might get lost.", "Unless you take a map, you got lost.", "If you hadn't taken a map, you would be lost."], correct: 0, explanation: "1st Conditional: If + don't, might + V1." },
  { id: 65, type: "Wish Clause", typeColor: "bg-rose-100 text-rose-700", original: "They sold the house last year. Now they regret it.", instruction: "Wish clause'a cevirin:", options: ["They wish they don't sell the house.", "They wish they didn't sell the house.", "They wish they hadn't sold the house.", "They wish they won't sell the house."], correct: 2, explanation: "Gecmiste pisman olunan eylem: wish + Past Perfect." },
  { id: 66, type: "Causative", typeColor: "bg-orange-100 text-orange-700", original: "A mechanic serviced my car last week.", instruction: "Causative yapiyla yeniden yazin:", options: ["I serviced my car.", "I had my car serviced last week.", "My car got service last week.", "I was servicing my car."], correct: 1, explanation: "Past Causative: had + object + V3." },
  { id: 67, type: "Inversion", typeColor: "bg-indigo-100 text-indigo-700", original: "She only realized her mistake when she got home.", instruction: "Inversion yapiyla yeniden yazin:", options: ["Only she realized her mistake at home.", "Only when she got home did she realize her mistake.", "When only she got home she realized.", "Only realized she her mistake at home."], correct: 1, explanation: "Only when + past simple + did + subject + V1." },
  { id: 68, type: "Active -> Passive", typeColor: "bg-blue-100 text-blue-700", original: "People believe that he is innocent.", instruction: "Passive voice'a cevirin:", options: ["He is believed that he is innocent.", "He is believed to be innocent.", "It was believed he is innocent.", "He believed to be innocent."], correct: 1, explanation: "Subject + is believed + to be: impersonal passive." },
  { id: 69, type: "Direct -> Reported", typeColor: "bg-emerald-100 text-emerald-700", original: "\"I will call you tomorrow,\" he promised.", instruction: "Reported speech'e cevirin:", options: ["He promised he will call me tomorrow.", "He promised to call me the next day.", "He promised he called me the next day.", "He promised calling me the next day."], correct: 1, explanation: "Promise + to infinitive, tense shift: tomorrow -> the next day." },
  { id: 70, type: "Relative Clause", typeColor: "bg-amber-100 text-amber-700", original: "The book was very interesting. I read it last week.", instruction: "Relative clause ile birlestirin:", options: ["The book which I read it last week was very interesting.", "The book that I read last week was very interesting.", "The book who I read last week was very interesting.", "The book what I read last week was very interesting."], correct: 1, explanation: "'That/which' nesne konumundaki nesneler icin kullanilir." },
  { id: 71, type: "Inversion", typeColor: "bg-indigo-100 text-indigo-700", original: "He little knew what was waiting for him.", instruction: "Inversion yapiyla yeniden yazin:", options: ["Little he knew what was waiting.", "Little did he know what was waiting for him.", "Did little he know what was waiting.", "He did little know what was waiting."], correct: 1, explanation: "Little + did + subject + V1." },
  { id: 72, type: "If Clause", typeColor: "bg-purple-100 text-purple-700", original: "I don't have a car. I can't drive to work.", instruction: "2nd Conditional ile birlestirin:", options: ["If I have a car, I can drive to work.", "If I had a car, I could drive to work.", "If I had had a car, I could have driven.", "If I will have a car, I can drive."], correct: 1, explanation: "2nd Conditional: If + Past Simple, could + V1." },
  { id: 73, type: "Causative", typeColor: "bg-orange-100 text-orange-700", original: "An electrician is going to repair the wiring.", instruction: "Causative yapiyla yeniden yazin:", options: ["We are going to repair the wiring.", "We are going to have the wiring repaired.", "The wiring is going to get repair.", "We will repair the wiring."], correct: 1, explanation: "Going to Causative: going to have + object + V3." },
  { id: 74, type: "Wish Clause", typeColor: "bg-rose-100 text-rose-700", original: "My neighbours play loud music every night.", instruction: "Wish clause'a cevirin:", options: ["I wish my neighbours don't play loud music.", "I wish my neighbours didn't play loud music every night.", "I wish my neighbours won't play music.", "I wish my neighbours hadn't played."], correct: 1, explanation: "Simdiki zaman sikayeti: wish + Past Simple." },
  { id: 75, type: "Active -> Passive", typeColor: "bg-blue-100 text-blue-700", original: "They say that learning a language takes time.", instruction: "Passive voice'a cevirin:", options: ["It is said that learning a language takes time.", "Learning a language is said takes time.", "A language says to take time.", "They are said learning takes time."], correct: 0, explanation: "It is said that + clause: impersonal passive." },
  { id: 76, type: "Direct -> Reported", typeColor: "bg-emerald-100 text-emerald-700", original: "\"Have you ever been to London?\" she asked him.", instruction: "Reported speech'e cevirin:", options: ["She asked him have you ever been to London.", "She asked him if he had ever been to London.", "She asked him whether he has ever been to London.", "She asked him that he had been to London."], correct: 1, explanation: "Yes/No reported question: asked if + Past Perfect." },
  { id: 77, type: "Relative Clause", typeColor: "bg-amber-100 text-amber-700", original: "The year was very important. I graduated that year.", instruction: "Relative clause ile birlestirin:", options: ["The year which I graduated was very important.", "The year when I graduated was very important.", "The year where I graduated was very important.", "The year who I graduated was very important."], correct: 1, explanation: "'When' zaman ifade eden relative adverb." },
  { id: 78, type: "Inversion", typeColor: "bg-indigo-100 text-indigo-700", original: "He had no sooner arrived than the meeting started.", instruction: "Inversion yapiyla yeniden yazin:", options: ["No sooner he had arrived than the meeting started.", "No sooner had he arrived than the meeting started.", "Had no sooner he arrived than the meeting.", "Sooner no had he arrived than the meeting."], correct: 1, explanation: "No sooner + had + subject + V3 + than." },
  { id: 79, type: "If Clause", typeColor: "bg-purple-100 text-purple-700", original: "He was rude. That's why she got upset.", instruction: "Mixed Conditional ile birlestirin:", options: ["If he weren't rude, she wouldn't have got upset.", "If he isn't rude, she won't get upset.", "If he hadn't been rude, she wouldn't have got upset.", "If he wouldn't be rude, she didn't get upset."], correct: 2, explanation: "3rd Conditional: If + Past Perfect, would have + V3." },
  { id: 80, type: "Causative", typeColor: "bg-orange-100 text-orange-700", original: "Someone delivers fresh flowers to the office every Monday.", instruction: "Causative yapiyla yeniden yazin:", options: ["We deliver fresh flowers.", "We have fresh flowers delivered every Monday.", "Fresh flowers get deliver every Monday.", "We are delivered fresh flowers."], correct: 1, explanation: "Present Simple Causative: have + object + V3." },
  { id: 81, type: "Active -> Passive", typeColor: "bg-blue-100 text-blue-700", original: "Someone broke into our house while we were on holiday.", instruction: "Passive voice'a cevirin:", options: ["Our house was broken into while we were on holiday.", "Our house broke into while we were on holiday.", "Our house was breaking into while on holiday.", "Our house had broken into on holiday."], correct: 0, explanation: "Past Simple Passive: was + V3 (broken into)." },
  { id: 82, type: "Wish Clause", typeColor: "bg-rose-100 text-rose-700", original: "She won't stop talking in class.", instruction: "Wish clause'a cevirin:", options: ["I wish she stops talking in class.", "I wish she would stop talking in class.", "I wish she will stop talking.", "I wish she had stopped talking."], correct: 1, explanation: "Baskasinin davranisi hakkinda sikayet: wish + would." },
  { id: 83, type: "Direct -> Reported", typeColor: "bg-emerald-100 text-emerald-700", original: "\"Please sit down,\" the teacher said to the students.", instruction: "Reported speech'e cevirin:", options: ["The teacher told the students to sit down.", "The teacher said the students to sit down.", "The teacher asked the students sit down.", "The teacher told to students sitting down."], correct: 0, explanation: "Reported request/order: told + object + to infinitive." },
  { id: 84, type: "Relative Clause", typeColor: "bg-amber-100 text-amber-700", original: "She lives in Paris. It is the capital of France.", instruction: "Relative clause ile birlestirin:", options: ["She lives in Paris which is the capital of France.", "She lives in Paris, which is the capital of France.", "She lives in Paris that is the capital of France.", "She lives in Paris where is the capital."], correct: 1, explanation: "Non-defining relative clause: virgul + which." },
  { id: 85, type: "Inversion", typeColor: "bg-indigo-100 text-indigo-700", original: "He realized the importance of health only after he fell ill.", instruction: "Inversion yapiyla yeniden yazin:", options: ["Only he realized after falling ill.", "Only after he fell ill did he realize the importance of health.", "After only he fell ill he realized.", "Did he realize only after falling ill."], correct: 1, explanation: "Only after + clause + did + subject + V1." },
  { id: 86, type: "If Clause", typeColor: "bg-purple-100 text-purple-700", original: "She is not tall enough. She can't be a model.", instruction: "2nd Conditional ile birlestirin:", options: ["If she is tall, she can be a model.", "If she were tall enough, she could be a model.", "If she had been tall, she could have been a model.", "Unless she is tall, she can be a model."], correct: 1, explanation: "2nd Conditional: If + were, could + V1." },
  { id: 87, type: "Active -> Passive", typeColor: "bg-blue-100 text-blue-700", original: "They expect the project to be completed soon.", instruction: "Passive voice'a cevirin:", options: ["The project is expected to be completed soon.", "The project expects to be completed soon.", "It expects the project completed soon.", "The project was expected completing soon."], correct: 0, explanation: "Subject + is expected + to be: impersonal passive." },
  { id: 88, type: "Causative", typeColor: "bg-orange-100 text-orange-700", original: "Someone painted the fence for us last summer.", instruction: "Causative yapiyla yeniden yazin:", options: ["We painted the fence.", "We had the fence painted last summer.", "The fence got paint last summer.", "We were painting the fence."], correct: 1, explanation: "Past Causative: had + object + V3." },
  { id: 89, type: "Direct -> Reported", typeColor: "bg-emerald-100 text-emerald-700", original: "\"I am meeting the director tomorrow,\" she said.", instruction: "Reported speech'e cevirin:", options: ["She said she is meeting the director tomorrow.", "She said she was meeting the director the next day.", "She said she met the director tomorrow.", "She said she will meet the director."], correct: 1, explanation: "Present Continuous -> Past Continuous, tomorrow -> the next day." },
  { id: 90, type: "Wish Clause", typeColor: "bg-rose-100 text-rose-700", original: "I didn't bring my umbrella. Now it's raining.", instruction: "Wish clause'a cevirin:", options: ["I wish I bring my umbrella.", "I wish I brought my umbrella.", "I wish I had brought my umbrella.", "I wish I will bring my umbrella."], correct: 2, explanation: "Gecmiste pisman olunan eylem: wish + Past Perfect." },
  { id: 91, type: "Relative Clause", typeColor: "bg-amber-100 text-amber-700", original: "I work in a building. It was built in 1920.", instruction: "Relative clause ile birlestirin:", options: ["I work in a building who was built in 1920.", "I work in a building which was built in 1920.", "I work in a building where was built in 1920.", "I work in a building whose was built in 1920."], correct: 1, explanation: "'Which' nesne konumundaki nesneler icin kullanilir." },
  { id: 92, type: "Inversion", typeColor: "bg-indigo-100 text-indigo-700", original: "I will not under any circumstances accept this offer.", instruction: "Inversion yapiyla yeniden yazin:", options: ["Under no circumstances I will accept this offer.", "Under no circumstances will I accept this offer.", "Will under no circumstances I accept this offer.", "No circumstances under will I accept."], correct: 1, explanation: "Under no circumstances + will + subject + V1." },
  { id: 93, type: "Active -> Passive", typeColor: "bg-blue-100 text-blue-700", original: "They should have informed us about the delay.", instruction: "Passive voice'a cevirin:", options: ["We should be informed about the delay.", "We should have been informed about the delay.", "We should have informed about the delay.", "We were should informed about the delay."], correct: 1, explanation: "Modal Perfect Passive: should have been + V3." },
  { id: 94, type: "If Clause", typeColor: "bg-purple-100 text-purple-700", original: "She didn't study medicine. She is not a doctor now.", instruction: "Mixed Conditional ile birlestirin:", options: ["If she studied medicine, she would be a doctor.", "If she had studied medicine, she would be a doctor now.", "If she studies medicine, she will be a doctor.", "If she has studied, she would be a doctor."], correct: 1, explanation: "Mixed Conditional: If + Past Perfect, would + V1 (now)." },
  { id: 95, type: "Direct -> Reported", typeColor: "bg-emerald-100 text-emerald-700", original: "\"I had already eaten when they arrived,\" she said.", instruction: "Reported speech'e cevirin:", options: ["She said she has already eaten when they arrived.", "She said she had already eaten when they had arrived.", "She said she already eaten when they arrived.", "She said she would eat when they arrive."], correct: 1, explanation: "Past Perfect remains Past Perfect in reported speech." },
  { id: 96, type: "Causative", typeColor: "bg-orange-100 text-orange-700", original: "Someone stole her bag on the bus.", instruction: "Causative/experience yapiyla yeniden yazin:", options: ["She stole a bag.", "She had her bag stolen on the bus.", "Her bag got steal on the bus.", "She was stealing her bag."], correct: 1, explanation: "Had + object + V3: olumsuz deneyim causative." },
]

const QS_PER_SET = 6

export function SentenceTransform() {
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [activeQs, setActiveQs] = useState<TransformQ[]>([])
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
      const progress = addXp(XP_REWARDS.transform_correct, "sentence_transform")
      showXpToast(XP_REWARDS.transform_correct, "Dönüşüm doğru!")
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
        <div className="h-1.5 bg-muted"><div className="h-full bg-gradient-to-r from-violet-400 to-purple-500 w-full" /></div>
        <CardContent className="p-6 text-center">
          {currentSet > 1 && <p className="text-sm text-muted-foreground mb-2">Set {currentSet} | Toplam: {totalScore + score}/{totalQs + activeQs.length}</p>}
          <div className={cn("w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center", pct >= 80 ? "bg-emerald-100" : pct >= 50 ? "bg-amber-100" : "bg-red-100")}>
            <span className={cn("text-2xl font-bold", pct >= 80 ? "text-emerald-600" : pct >= 50 ? "text-amber-600" : "text-red-600")}>%{pct}</span>
          </div>
          <h4 className="font-serif text-xl mb-2">{pct >= 80 ? "Harika!" : pct >= 50 ? "İyi gidiyorsun!" : "Tekrar dene!"}</h4>
          <div className="flex justify-center gap-1 mb-4">
            {answers.map((c, i) => <div key={i} className={cn("w-6 h-2 rounded-full", c ? "bg-emerald-400" : "bg-red-300")} />)}
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={continueSet} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"><ArrowRight className="w-4 h-4 mr-2" />Sonraki Set</Button>
            <Button onClick={() => { setCurrentSet(1); setTotalScore(0); setTotalQs(0); loadNewSet() }} variant="outline" className="w-full bg-transparent"><RotateCcw className="w-4 h-4 mr-2" />Sıfırla</Button>
          </div>
          <div className="mt-4 pt-4 border-t border-border/50">
            <ShareChallenge
              title="Cümle Dönüştürme Sonucum"
              scoreText={`Cümle Dönüştürme'de %${pct} başarı! ${score}/${activeQs.length} doğru.`}
              challengeText="İngilizce cümle yapılarını ne kadar iyi biliyorsun?"
              toolSlug="sentence-transform"
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
      <QuizHeader title="Cümle Dönüşümü" current={currentQ + 1} total={activeQs.length} lastAnswerCorrect={showResult ? selected === activeQs[currentQ]?.correct : null} />

      <Card className="border border-border/50 mb-3 rounded-lg">
        <CardContent className="p-5">
          <span className={cn("inline-block px-2.5 py-0.5 rounded-full text-xs font-bold mb-3", q.typeColor)}>{q.type}</span>
          
          {/* Original sentence */}
          <div className="p-3 rounded-lg bg-muted/50 mb-3">
            <p className="text-sm text-muted-foreground mb-1">Orijinal cümle:</p>
            <p className="font-medium italic">{q.original}</p>
          </div>
          
          <p className="text-sm font-medium mb-3 text-foreground">{q.instruction}</p>

          <div className="space-y-2">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correct
              const isSelected = selected === i
              return (
                <button key={i} onClick={() => handleSelect(i)} disabled={showResult}
                  className={cn(
                    "w-full p-3 rounded-lg text-sm transition-all border-2 text-left",
                    showResult && isCorrect && "bg-emerald-50 border-emerald-400 text-emerald-700 font-medium",
                    showResult && isSelected && !isCorrect && "bg-red-50 border-red-400 text-red-700",
                    showResult && !isSelected && !isCorrect && "opacity-50 border-transparent",
                    !showResult && "border-border hover:border-violet-300 hover:bg-violet-50/50 active:scale-[0.98]"
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
              <span className="font-medium text-foreground">Kural: </span>{q.explanation}
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
