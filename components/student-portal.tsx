"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import {
  BookOpen, FileText, Upload, Download,
  ChevronDown, ChevronUp, Crown, Clock, Check,
  Trophy, Flame, BarChart3
} from "lucide-react"

interface HomeworkItem {
  id: string
  title: string
  description: string | null
  due_date: string | null
  status: string
  teacher_feedback: string | null
  grade: number | null
  attachment_path: string | null
  attachment_name: string | null
  submission_path: string | null
  submission_name: string | null
}

interface SharedFile {
  id: string
  file_name: string
  file_path: string
  file_type: string | null
  bucket: string
  created_at: string
}

interface QuizStat {
  quiz_type: string
  count: number
  total_xp: number
}

export function StudentPortal() {
  const [playerId, setPlayerId] = useState<string | null>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [rank, setRank] = useState<number | null>(null)
  const [homework, setHomework] = useState<HomeworkItem[]>([])
  const [files, setFiles] = useState<SharedFile[]>([])
  const [quizStats, setQuizStats] = useState<QuizStat[]>([])
  const [showHomework, setShowHomework] = useState(true)
  const [showFiles, setShowFiles] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)

  const supabase = createClient()

  const fetchData = useCallback(async (pid: string) => {
    if (!supabase) return
    const { data: rankData } = await supabase
      .from("leaderboard_overall").select("rank").eq("player_id", pid).single()
    if (rankData) setRank(Number(rankData.rank))

    const { data: enrollment } = await supabase
      .from("enrollments").select("id").eq("student_id", pid).eq("status", "approved").limit(1)
    const enrolled = enrollment && enrollment.length > 0
    setIsEnrolled(!!enrolled)

    const { data: results } = await supabase
      .from("quiz_results").select("quiz_type, xp_earned").eq("player_id", pid)
    if (results) {
      const map: Record<string, { count: number; total_xp: number }> = {}
      for (const r of results) {
        if (!map[r.quiz_type]) map[r.quiz_type] = { count: 0, total_xp: 0 }
        map[r.quiz_type].count++
        map[r.quiz_type].total_xp += r.xp_earned
      }
      setQuizStats(Object.entries(map).map(([quiz_type, v]) => ({ quiz_type, ...v })).sort((a, b) => b.total_xp - a.total_xp))
    }

    if (enrolled) {
      const { data: hwData } = await supabase
        .from("homework_assignments")
        .select("id, status, homework:homework_id(id, title, description, due_date, attachment_path, attachment_name), teacher_feedback, grade, submission_path, submission_name")
        .eq("student_id", pid).order("created_at", { ascending: false })
      if (hwData) {
        setHomework(hwData.map((a: Record<string, unknown>) => {
          const hw = a.homework as Record<string, unknown> | null
          return {
            id: a.id as string,
            title: (hw?.title as string) || "",
            description: (hw?.description as string) || null,
            due_date: (hw?.due_date as string) || null,
            status: a.status as string,
            teacher_feedback: a.teacher_feedback as string | null,
            grade: a.grade as number | null,
            attachment_path: (hw?.attachment_path as string) || null,
            attachment_name: (hw?.attachment_name as string) || null,
            submission_path: (a.submission_path as string) || null,
            submission_name: (a.submission_name as string) || null,
          }
        }))
      }

      const { data: fileData } = await supabase
        .from("shared_files")
        .select("id, file_name, file_path, file_type, bucket, created_at")
        .eq("recipient_id", pid).eq("bucket", "materials")
        .order("created_at", { ascending: false })
      if (fileData) setFiles(fileData)
    }
  }, [supabase])

  useEffect(() => {
    async function init() {
      if (!supabase) {
        const pid = localStorage.getItem("tls_player_id")
        if (pid) { setPlayerId(pid); fetchData(pid) }
        return
      }
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: player } = await supabase.from("players").select("id").eq("auth_id", user.id).single()
        if (player) { setPlayerId(player.id); fetchData(player.id); return }
      }
      const pid = localStorage.getItem("tls_player_id")
      if (pid) { setPlayerId(pid); fetchData(pid) }
    }
    init()
  }, [fetchData, supabase])

  async function handleSubmit(assignmentId: string, file: File) {
    if (!playerId || !supabase) return
    setUploading(assignmentId)
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
    const path = `${playerId}/${Date.now()}-${safeName}`
    const { error } = await supabase.storage.from("submissions").upload(path, file, { upsert: true })
    if (error) {
      alert("Dosya yuklenemedi: " + error.message)
    } else {
      await supabase.from("homework_assignments").update({
        status: "submitted",
        submitted_at: new Date().toISOString(),
        submission_path: path,
        submission_name: file.name,
      }).eq("id", assignmentId)
      fetchData(playerId)
    }
    setUploading(null)
  }

  function downloadFile(filePath: string, bucket: string, fileName: string) {
    if (!supabase) return
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath)
    if (publicUrl) {
      const a = document.createElement("a")
      a.href = publicUrl
      a.download = fileName
      a.target = "_blank"
      a.click()
    }
  }

  const quizLabels: Record<string, string> = {
    "blitz-challenge": "Blitz", "cloze-test": "Cloze", "collocations": "Collocations",
    "context-clues": "Context Clues", "daily_challenge": "Günlük", "error-spotting": "Hata Bul",
    "flashcard": "Flashcard", "interactive": "Etkileşimli", "minimal-pairs": "Minimal Pairs",
    "sentence-transform": "Cümle Dön.", "snowflake": "Snowflake",
    "timed-reading": "Zamanlı Okuma", "word-formation": "Kelime Türetme",
    "word-match": "Kelime Eşleştirme", "speaking-quiz": "Konuşma",
  }

  const totalQuizXp = quizStats.reduce((s, q) => s + q.total_xp, 0)
  const totalQuizCount = quizStats.reduce((s, q) => s + q.count, 0)

  return (
    <div className="space-y-4 mt-6">
      {/* Rank */}
      {rank && (
        <Card className="border-amber-200/50 bg-gradient-to-r from-amber-50/40 to-orange-50/30">
          <CardContent className="py-3 px-4 flex items-center gap-3">
            <Crown className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">
                {"Liderlik Siralamasi: "}<span className="text-amber-600">#{rank}</span>
              </p>
            </div>
            <Link href="/liderlik" className="text-xs text-primary font-medium hover:underline">
              {"Tabloyu Gor"}
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Quiz progress */}
      {quizStats.length > 0 && (
        <div>
          <button onClick={() => setShowQuiz(!showQuiz)} className="flex items-center gap-2 w-full text-left mb-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold flex-1">
              {"Quiz Ilerleme"} ({totalQuizCount} quiz - {totalQuizXp} XP)
            </span>
            {showQuiz ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
          {showQuiz && (
            <Card>
              <CardContent className="py-1">
                {quizStats.map(q => {
                  const maxXp = Math.max(...quizStats.map(s => s.total_xp), 1)
                  return (
                    <div key={q.quiz_type} className="py-2.5 border-b border-border/30 last:border-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{quizLabels[q.quiz_type] || q.quiz_type}</span>
                        <span className="text-xs text-muted-foreground">{q.count}{"x - "}{q.total_xp} XP</span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(q.total_xp / maxXp) * 100}%` }} />
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Homework */}
      {isEnrolled && (
        <>
          <div>
            <button onClick={() => setShowHomework(!showHomework)} className="flex items-center gap-2 w-full text-left mb-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold flex-1">{"Odevlerim"} ({homework.length})</span>
              {showHomework ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>
            {showHomework && (
              <div className="space-y-2">
                {homework.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-3 text-center">{"Henuz odev yok."}</p>
                ) : homework.map(hw => (
                  <Card key={hw.id} className={hw.status === "reviewed" ? "border-emerald-200/50" : hw.status === "submitted" ? "border-sky-200/50" : ""}>
                    <CardContent className="py-3 px-4">
                      <div className="flex items-start gap-2 mb-1">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{hw.title}</p>
                          {hw.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{hw.description}</p>}
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${
                          hw.status === "reviewed" ? "bg-emerald-100 text-emerald-700" :
                          hw.status === "submitted" ? "bg-sky-100 text-sky-700" :
                          "bg-amber-100 text-amber-700"
                        }`}>
                          {hw.status === "reviewed" ? "Degerlendirildi" : hw.status === "submitted" ? "Gonderildi" : "Bekliyor"}
                        </span>
                      </div>
                      {hw.due_date && (
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {"Son: "}{new Date(hw.due_date).toLocaleDateString("tr-TR")}
                        </p>
                      )}
                      {hw.attachment_path && hw.attachment_name && (
                        <button
                          onClick={() => downloadFile(hw.attachment_path!, "materials", hw.attachment_name!)}
                          className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors bg-primary/5 px-2.5 py-1.5 rounded-lg"
                        >
                          <Download className="w-3.5 h-3.5" />
                          {hw.attachment_name}
                        </button>
                      )}
                      {hw.teacher_feedback && (
                        <div className="mt-2 p-2 rounded-lg bg-emerald-50/50 border border-emerald-100">
                          <p className="text-xs text-emerald-800">
                            <span className="font-semibold">{"Ogretmen notu:"}</span>{" "}{hw.teacher_feedback}
                          </p>
                          {hw.grade !== null && <p className="text-xs font-bold text-emerald-700 mt-0.5">Not: {hw.grade}/100</p>}
                        </div>
                      )}
                      {hw.status === "pending" && (
                        <div className="mt-2">
                          <label className="cursor-pointer">
                            <input type="file" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleSubmit(hw.id, f) }} disabled={uploading === hw.id} />
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer bg-primary/5 px-2.5 py-1.5 rounded-lg">
                              <Upload className="w-3.5 h-3.5" />
                              {uploading === hw.id ? "Yukleniyor..." : "Odev Yukle"}
                            </span>
                          </label>
                        </div>
                      )}
                      {hw.status === "submitted" && (
                        <p className="text-[11px] text-sky-600 mt-1.5 flex items-center gap-1">
                          <Check className="w-3 h-3" /> {"Gonderildi, degerlendirme bekleniyor"}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Files */}
          {files.length > 0 && (
            <div>
              <button onClick={() => setShowFiles(!showFiles)} className="flex items-center gap-2 w-full text-left mb-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-semibold flex-1">{"Paylasilan Dosyalar"} ({files.length})</span>
                {showFiles ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>
              {showFiles && (
                <div className="space-y-1.5">
                  {files.map(f => (
                    <Card key={f.id}>
                      <CardContent className="py-2.5 px-4 flex items-center gap-3">
                        <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="text-sm flex-1 truncate">{f.file_name}</span>
                        <button onClick={() => downloadFile(f.file_path, f.bucket, f.file_name)} className="text-primary hover:text-primary/80">
                          <Download className="w-4 h-4" />
                        </button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
