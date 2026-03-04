"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft, Flame, BookOpen, Clock, PenLine, X,
  Pin, Trash2, Trophy, FileText, Download
} from "lucide-react"

const TEACHER_EMAIL = "info@textlanguageschool.net"

interface Note {
  id: string
  title: string | null
  content: string
  color: string
  pinned: boolean
  created_at: string
}

interface Assignment {
  id: string
  status: string
  teacher_feedback: string | null
  grade: number | null
  homework: { title: string; due_date: string | null } | null
}

interface SharedFile {
  id: string
  file_name: string
  file_path: string
  bucket: string
  created_at: string
}

export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: studentId } = use(params)
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [student, setStudent] = useState<{
    nickname: string; total_xp: number; current_streak: number;
    best_streak: number; created_at: string
  } | null>(null)
  const [quizStats, setQuizStats] = useState<{ quiz_type: string; count: number; total_xp: number }[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [submissions, setSubmissions] = useState<SharedFile[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [teacherPlayerId, setTeacherPlayerId] = useState<string | null>(null)

  // Note form
  const [showNote, setShowNote] = useState(false)
  const [noteContent, setNoteContent] = useState("")
  const [noteTitle, setNoteTitle] = useState("")

  useEffect(() => {
    async function init() {
      if (!supabase) { router.push("/"); return }
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.email !== TEACHER_EMAIL) { router.push("/"); return }

      const { data: teacher } = await supabase.from("players").select("id").eq("auth_id", user.id).single()
      if (teacher) setTeacherPlayerId(teacher.id)

      const { data: s } = await supabase.from("players")
        .select("nickname, total_xp, current_streak, best_streak, created_at")
        .eq("id", studentId).single()
      if (s) setStudent(s)

      // Quiz stats grouped by type
      const { data: results } = await supabase.from("quiz_results")
        .select("quiz_type, xp_earned").eq("player_id", studentId)
      if (results) {
        const map: Record<string, { count: number; total_xp: number }> = {}
        for (const r of results) {
          if (!map[r.quiz_type]) map[r.quiz_type] = { count: 0, total_xp: 0 }
          map[r.quiz_type].count++
          map[r.quiz_type].total_xp += r.xp_earned
        }
        setQuizStats(Object.entries(map).map(([quiz_type, v]) => ({ quiz_type, ...v })).sort((a, b) => b.total_xp - a.total_xp))
      }

      // Assignments
      const { data: hw } = await supabase.from("homework_assignments")
        .select("id, status, teacher_feedback, grade, homework:homework_id(title, due_date)")
        .eq("student_id", studentId).order("created_at", { ascending: false })
      if (hw) setAssignments(hw as unknown as Assignment[])

      // Submissions
      const { data: files } = await supabase.from("shared_files")
        .select("id, file_name, file_path, bucket, created_at")
        .eq("uploader_id", studentId).eq("bucket", "submissions")
        .order("created_at", { ascending: false })
      if (files) setSubmissions(files)

      setLoading(false)
    }
    init()
  }, [studentId, router, supabase])

  useEffect(() => {
    if (teacherPlayerId) fetchNotes()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teacherPlayerId])

  async function fetchNotes() {
    if (!teacherPlayerId) return
    const { data } = await supabase.from("teacher_notes")
      .select("id, title, content, color, pinned, created_at")
      .eq("teacher_id", teacherPlayerId).eq("student_id", studentId)
      .order("pinned", { ascending: false }).order("created_at", { ascending: false })
    if (data) setNotes(data)
  }

  async function addNote() {
    if (!teacherPlayerId || !noteContent.trim()) return
    await supabase.from("teacher_notes").insert({
      teacher_id: teacherPlayerId, student_id: studentId,
      title: noteTitle.trim() || null, content: noteContent.trim(), color: "default",
    })
    setNoteContent(""); setNoteTitle(""); setShowNote(false); fetchNotes()
  }

  async function deleteNote(id: string) {
    await supabase.from("teacher_notes").delete().eq("id", id); fetchNotes()
  }

  async function togglePin(id: string, pinned: boolean) {
    await supabase.from("teacher_notes").update({ pinned: !pinned }).eq("id", id); fetchNotes()
  }

  async function downloadFile(path: string, bucket: string, name: string) {
    const { data } = await supabase.storage.from(bucket).download(path)
    if (data) {
      const url = URL.createObjectURL(data)
      const a = document.createElement("a")
      a.href = url; a.download = name; a.click()
      URL.revokeObjectURL(url)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!student) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-sm text-muted-foreground">{"Bu \u00f6\u011frenci bulunamad\u0131."}</p>
    </div>
  )

  const quizLabels: Record<string, string> = {
    "blitz-challenge": "Blitz", "cloze-test": "Cloze", "collocations": "Collocations",
    "context-clues": "Context Clues", "daily-challenge": "G\u00fcnl\u00fck", "error-spotting": "Hata Bul",
    "flashcard": "Flashcard", "interactive": "Etkile\u015fimli", "minimal-pairs": "Minimal Pairs",
    "sentence-transform": "C\u00fcmle D\u00f6n\u00fc\u015ft\u00fcrme", "snowflake": "Snowflake",
    "timed-reading": "Zamanl\u0131 Okuma", "word-formation": "Kelime T\u00fcretme",
    "word-match": "Kelime E\u015fle\u015ftirme",
  }

  const totalQuizzes = quizStats.reduce((s, q) => s + q.count, 0)

  return (
    <main className="min-h-screen bg-muted/30 pt-20 pb-16">
      <div className="max-w-lg mx-auto px-4">
        {/* Back */}
        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> {"Geri D\u00f6n"}
        </button>

        {/* Student header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
            {student.nickname.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="font-serif text-lg font-bold text-foreground">{student.nickname}</h1>
            <p className="text-xs text-muted-foreground">
              {"Kay\u0131t: "}{new Date(student.created_at).toLocaleDateString("tr-TR")}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <Card><CardContent className="py-3 text-center">
            <p className="text-base font-bold text-foreground">{student.total_xp}</p>
            <p className="text-[10px] text-muted-foreground">XP</p>
          </CardContent></Card>
          <Card><CardContent className="py-3 text-center">
            <p className="text-base font-bold text-foreground flex items-center justify-center gap-0.5">
              {student.current_streak > 0 && <Flame className="w-3.5 h-3.5 text-orange-500" />}
              {student.current_streak}
            </p>
            <p className="text-[10px] text-muted-foreground">Seri</p>
          </CardContent></Card>
          <Card><CardContent className="py-3 text-center">
            <p className="text-base font-bold text-foreground">{student.best_streak}</p>
            <p className="text-[10px] text-muted-foreground">{"En \u0130yi"}</p>
          </CardContent></Card>
          <Card><CardContent className="py-3 text-center">
            <p className="text-base font-bold text-foreground">{totalQuizzes}</p>
            <p className="text-[10px] text-muted-foreground">Quiz</p>
          </CardContent></Card>
        </div>

        {/* Quiz breakdown */}
        {quizStats.length > 0 && (
          <div className="mb-6">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" /> {"Quiz Performans\u0131"}
            </p>
            <Card><CardContent className="py-1">
              {quizStats.map(q => {
                const maxXp = Math.max(...quizStats.map(s => s.total_xp), 1)
                return (
                  <div key={q.quiz_type} className="py-2.5 border-b border-border/30 last:border-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{quizLabels[q.quiz_type] || q.quiz_type}</span>
                      <span className="text-xs text-muted-foreground">{q.count}{"x \u00b7 "}{q.total_xp} XP</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(q.total_xp / maxXp) * 100}%` }} />
                    </div>
                  </div>
                )
              })}
            </CardContent></Card>
          </div>
        )}

        {/* Assignments */}
        {assignments.length > 0 && (
          <div className="mb-6">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> {"\u00d6devler"}
            </p>
            <div className="space-y-1.5">
              {assignments.map(a => (
                <Card key={a.id}>
                  <CardContent className="py-2.5 px-4 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{a.homework?.title || "\u00d6dev"}</p>
                      {a.teacher_feedback && <p className="text-[11px] text-muted-foreground truncate mt-0.5">{a.teacher_feedback}</p>}
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${
                      a.status === "reviewed" ? "bg-emerald-100 text-emerald-700" :
                      a.status === "submitted" ? "bg-sky-100 text-sky-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {a.status === "reviewed" ? "Tamam" : a.status === "submitted" ? "Teslim" : "Bekliyor"}
                    </span>
                    {a.grade !== null && <span className="text-xs font-bold text-emerald-700">{a.grade}</span>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Submissions */}
        {submissions.length > 0 && (
          <div className="mb-6">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> {"Y\u00fcklenen Dosyalar"}
            </p>
            <div className="space-y-1.5">
              {submissions.map(f => (
                <Card key={f.id}>
                  <CardContent className="py-2.5 px-4 flex items-center gap-3">
                    <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-sm flex-1 truncate">{f.file_name}</span>
                    <span className="text-[10px] text-muted-foreground">{new Date(f.created_at).toLocaleDateString("tr-TR")}</span>
                    <button onClick={() => downloadFile(f.file_path, f.bucket, f.file_name)} className="p-1 text-primary hover:text-primary/70 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Teacher notes about this student */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <PenLine className="w-3.5 h-3.5" /> {"Notlar\u0131m"}
            </p>
            <button onClick={() => setShowNote(!showNote)} className="text-xs text-primary hover:underline">
              {showNote ? "Kapat" : "Not Ekle"}
            </button>
          </div>

          {showNote && (
            <Card className="mb-3">
              <CardContent className="py-3 space-y-2">
                <input
                  value={noteTitle} onChange={e => setNoteTitle(e.target.value)}
                  placeholder={"Ba\u015fl\u0131k..."}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <textarea
                  value={noteContent} onChange={e => setNoteContent(e.target.value)}
                  placeholder={"Notunuz..."}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
                <div className="flex gap-2">
                  <Button onClick={addNote} disabled={!noteContent.trim()} size="sm" className="rounded-lg flex-1">Kaydet</Button>
                  <Button onClick={() => setShowNote(false)} variant="outline" size="sm" className="rounded-lg">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {notes.length === 0 && !showNote && (
            <p className="text-sm text-muted-foreground text-center py-4">{"Bu \u00f6\u011frenci hakk\u0131nda hen\u00fcz not yok."}</p>
          )}

          <div className="space-y-2">
            {notes.map(n => (
              <Card key={n.id}>
                <CardContent className="py-3 px-4">
                  <div className="flex items-start gap-1.5">
                    <div className="flex-1 min-w-0">
                      {n.title && <p className="text-sm font-semibold mb-0.5">{n.title}</p>}
                      <p className="text-sm text-foreground/80 whitespace-pre-wrap">{n.content}</p>
                      <p className="text-[10px] text-muted-foreground mt-1.5">
                        {new Date(n.created_at).toLocaleDateString("tr-TR")}
                      </p>
                    </div>
                    <div className="flex flex-col gap-0.5 shrink-0">
                      <button onClick={() => togglePin(n.id, n.pinned)} className={`p-1 rounded-md hover:bg-muted transition-colors ${n.pinned ? "text-primary" : "text-muted-foreground/40"}`}>
                        <Pin className="w-3 h-3" />
                      </button>
                      <button onClick={() => deleteNote(n.id)} className="p-1 rounded-md hover:bg-destructive/10 text-muted-foreground/40 hover:text-destructive transition-colors">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
