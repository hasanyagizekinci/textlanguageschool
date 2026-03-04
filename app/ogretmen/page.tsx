"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users, BookOpen, FileText, Plus, Upload,
  ChevronRight, Trash2, Calendar, Download,
  GraduationCap, Search, StickyNote, Pin,
  UserPlus, UserMinus, X, PenLine,
  BarChart3, Clock, Flame, CheckCircle2,
  Star, MessageSquare, Sparkles, Sun,
  Moon, CloudSun, ListTodo, Check
} from "lucide-react"

const TEACHER_EMAIL = "info@textlanguageschool.net"
type Tab = "genel" | "kullanicilar" | "ogrenciler" | "odevler" | "notlar" | "dosyalar" | "gorevler"

interface Student {
  id: string
  nickname: string
  avatar_seed: string
  total_xp: number
  current_streak: number
}

interface Homework {
  id: string
  title: string
  description: string | null
  due_date: string | null
  attachment_path: string | null
  attachment_name: string | null
  created_at: string
}

interface TeacherNote {
  id: string
  student_id: string | null
  title: string | null
  content: string
  color: string
  pinned: boolean
  created_at: string
  student_nickname?: string
}

interface SharedFile {
  id: string
  file_name: string
  file_url: string
  description: string | null
  created_at: string
}

interface Task {
  id: string
  text: string
  done: boolean
  priority: "low" | "medium" | "high"
}

// Quick feedback templates
const FEEDBACK_TEMPLATES = [
  "Harika iş! Böyle devam et.",
  "Güzel çalışma, biraz daha dikkat edersen mükemmel olur.",
  "Daha fazla pratik yapman gerekiyor.",
  "Eksiklerin var, tekrar gözden geçir.",
  "Çok başarılı! Tebrikler.",
  "Zamanında teslim ettiğin için teşekkürler.",
]

export default function OgretmenPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [teacherPlayerId, setTeacherPlayerId] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>("genel")

  // Data
  const [allUsers, setAllUsers] = useState<(Student & { is_enrolled: boolean })[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [homework, setHomework] = useState<Homework[]>([])
  const [notes, setNotes] = useState<TeacherNote[]>([])
  const [files, setFiles] = useState<SharedFile[]>([])

  // Forms
  const [showNewHw, setShowNewHw] = useState(false)
  const [hwTitle, setHwTitle] = useState("")
  const [hwDesc, setHwDesc] = useState("")
  const [hwDue, setHwDue] = useState("")
  const [hwFile, setHwFile] = useState<File | null>(null)
  const [hwSelectedStudents, setHwSelectedStudents] = useState<string[]>([])
  const [hwAllSelected, setHwAllSelected] = useState(true)
  const [showNewNote, setShowNewNote] = useState(false)
  const [noteTitle, setNoteTitle] = useState("")
  const [noteContent, setNoteContent] = useState("")
  const [noteColor, setNoteColor] = useState("default")
  const [noteStudentId, setNoteStudentId] = useState<string | null>(null)
  const [noteCategory, setNoteCategory] = useState("genel")
  const [userSearch, setUserSearch] = useState("")

  // Grading
  const [expandedHw, setExpandedHw] = useState<string | null>(null)
  const [hwAssignments, setHwAssignments] = useState<Record<string, any[]>>({})
  const [gradingId, setGradingId] = useState<string | null>(null)
  const [gradeVal, setGradeVal] = useState("")
  const [feedbackVal, setFeedbackVal] = useState("")

  // Tasks (localStorage-based for simplicity)
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">("medium")

  useEffect(() => {
    const saved = localStorage.getItem("tls_teacher_tasks")
    if (saved) setTasks(JSON.parse(saved))
  }, [])

  function saveTasks(t: Task[]) {
    setTasks(t)
    localStorage.setItem("tls_teacher_tasks", JSON.stringify(t))
  }

  // Auth
  useEffect(() => {
    async function init() {
      if (!supabase) { router.push("/"); return }
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.email !== TEACHER_EMAIL) { router.push("/"); return }
      const { data: player } = await supabase
        .from("players").select("id").eq("auth_id", user.id).single()
      if (player) {
        setTeacherPlayerId(player.id)
        await supabase.from("players").update({ role: "teacher" }).eq("id", player.id)
      }
      setLoading(false)
    }
    init()
  }, [router, supabase])

  const fetchStudents = useCallback(async () => {
    if (!teacherPlayerId) return
    const { data: enrollments } = await supabase
      .from("enrollments").select("student_id")
      .eq("teacher_id", teacherPlayerId).eq("status", "approved")
    if (!enrollments?.length) { setStudents([]); return }
    const { data } = await supabase.from("players")
      .select("id, nickname, avatar_seed, total_xp, current_streak")
      .in("id", enrollments.map(e => e.student_id))
      .order("total_xp", { ascending: false })
    if (data) setStudents(data)
  }, [teacherPlayerId, supabase])

  const fetchAllUsers = useCallback(async () => {
    if (!teacherPlayerId) return
    const { data: players } = await supabase.from("players")
      .select("id, nickname, avatar_seed, total_xp, current_streak")
      .neq("id", teacherPlayerId).order("created_at", { ascending: false })
    const { data: enrollments } = await supabase.from("enrollments")
      .select("student_id").eq("teacher_id", teacherPlayerId).eq("status", "approved")
    const enrolledIds = new Set((enrollments || []).map(e => e.student_id))
    if (players) setAllUsers(players.map(p => ({ ...p, is_enrolled: enrolledIds.has(p.id) })))
  }, [teacherPlayerId, supabase])

  const fetchHomework = useCallback(async () => {
    if (!teacherPlayerId) return
    const { data } = await supabase.from("homework")
      .select("id, title, description, due_date, attachment_path, attachment_name, created_at")
      .eq("teacher_id", teacherPlayerId).order("created_at", { ascending: false })
    if (data) setHomework(data)
  }, [teacherPlayerId, supabase])

  const fetchNotes = useCallback(async () => {
    if (!teacherPlayerId) return
    const { data } = await supabase.from("teacher_notes")
      .select("id, student_id, title, content, color, pinned, created_at")
      .eq("teacher_id", teacherPlayerId)
      .order("pinned", { ascending: false }).order("created_at", { ascending: false })
    if (data) {
      const sIds = [...new Set(data.filter(n => n.student_id).map(n => n.student_id!))]
      let nickMap: Record<string, string> = {}
      if (sIds.length) {
        const { data: names } = await supabase.from("players").select("id, nickname").in("id", sIds)
        if (names) nickMap = Object.fromEntries(names.map(n => [n.id, n.nickname]))
      }
      setNotes(data.map(n => ({ ...n, student_nickname: n.student_id ? nickMap[n.student_id] : undefined })))
    }
  }, [teacherPlayerId, supabase])

  const fetchFiles = useCallback(async () => {
    if (!teacherPlayerId) return
    const { data } = await supabase.from("shared_files")
      .select("id, file_name, file_url, description, created_at")
      .eq("uploaded_by", teacherPlayerId).order("created_at", { ascending: false })
    if (data) setFiles(data as SharedFile[])
  }, [teacherPlayerId, supabase])

  useEffect(() => {
    if (teacherPlayerId) {
      fetchStudents(); fetchAllUsers(); fetchHomework(); fetchNotes(); fetchFiles()
    }
  }, [teacherPlayerId, fetchStudents, fetchAllUsers, fetchHomework, fetchNotes, fetchFiles])

  // Actions
  async function toggleEnroll(userId: string, enrolled: boolean) {
    if (!teacherPlayerId) return
    if (enrolled) {
      await supabase.from("enrollments").delete().eq("student_id", userId).eq("teacher_id", teacherPlayerId)
    } else {
      await supabase.from("enrollments").upsert(
        { student_id: userId, teacher_id: teacherPlayerId, status: "approved" },
        { onConflict: "student_id,teacher_id" }
      )
    }
    fetchStudents(); fetchAllUsers()
  }

  async function createHomework() {
    if (!teacherPlayerId || !hwTitle.trim()) return
    let attachPath: string | null = null
    let attachName: string | null = null
    if (hwFile) {
      const safeName = hwFile.name.replace(/[^a-zA-Z0-9._-]/g, "_")
      const path = `homework/${teacherPlayerId}/${Date.now()}_${safeName}`
      const { error } = await supabase.storage.from("materials").upload(path, hwFile, { upsert: true })
      if (error) {
        alert("Dosya yüklenemedi: " + error.message)
      } else {
        attachPath = path
        attachName = hwFile.name
      }
    }
    const { data: hw } = await supabase.from("homework").insert({
      teacher_id: teacherPlayerId, title: hwTitle.trim(),
      description: hwDesc.trim() || null, due_date: hwDue || null,
      attachment_path: attachPath, attachment_name: attachName,
    }).select("id").single()
    if (hw) {
      const targets = hwAllSelected ? students : students.filter(s => hwSelectedStudents.includes(s.id))
      if (targets.length) {
        await supabase.from("homework_assignments").insert(
          targets.map(s => ({ homework_id: hw.id, student_id: s.id, status: "pending" }))
        )
      }
    }
    setHwTitle(""); setHwDesc(""); setHwDue(""); setHwFile(null)
    setHwSelectedStudents([]); setHwAllSelected(true); setShowNewHw(false); fetchHomework()
  }

  async function deleteHomework(id: string) {
    await supabase.from("homework").delete().eq("id", id); fetchHomework()
  }

  async function fetchAssignments(hwId: string) {
    const { data } = await supabase
      .from("homework_assignments")
      .select("id, status, grade, teacher_feedback, submission_path, submission_name, submitted_at, student_id, student:student_id(nickname)")
      .eq("homework_id", hwId)
    setHwAssignments(prev => ({ ...prev, [hwId]: data || [] }))
  }

  async function toggleExpand(hwId: string) {
    if (expandedHw === hwId) { setExpandedHw(null); return }
    setExpandedHw(hwId)
    await fetchAssignments(hwId)
  }

  async function gradeAssignment(assignmentId: string, hwId: string) {
    const grade = parseInt(gradeVal)
    if (isNaN(grade) || grade < 0 || grade > 100) return
    await supabase.from("homework_assignments").update({
      grade, teacher_feedback: feedbackVal || null, status: "reviewed"
    }).eq("id", assignmentId)
    setGradingId(null); setGradeVal(""); setFeedbackVal("")
    await fetchAssignments(hwId)
  }

  async function createNote() {
    if (!teacherPlayerId || !noteContent.trim()) return
    const categoryLabel = noteCategories.find(c => c.key === noteCategory)?.label || ""
    const prefix = noteCategory !== "genel" ? `[${categoryLabel}] ` : ""
    await supabase.from("teacher_notes").insert({
      teacher_id: teacherPlayerId, student_id: noteStudentId,
      title: (prefix + (noteTitle.trim() || "")).trim() || null, content: noteContent.trim(), color: noteCategory === "neysesinde" ? "default" : noteColor,
    })
    setNoteTitle(""); setNoteContent(""); setNoteColor("default"); setNoteStudentId(null)
    setNoteCategory("genel"); setShowNewNote(false); fetchNotes()
  }

  async function togglePin(id: string, pinned: boolean) {
    await supabase.from("teacher_notes").update({ pinned: !pinned }).eq("id", id); fetchNotes()
  }

  async function deleteNote(id: string) {
    await supabase.from("teacher_notes").delete().eq("id", id); fetchNotes()
  }

  async function uploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (!teacherPlayerId || !e.target.files?.length) return
    const file = e.target.files[0]
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
    const path = `teacher/${teacherPlayerId}/${Date.now()}_${safeName}`
    const { error } = await supabase.storage.from("materials").upload(path, file, { upsert: true })
    if (error) { alert("Yüklenemedi: " + error.message); return }
    const { data: { publicUrl } } = supabase.storage.from("materials").getPublicUrl(path)
    await supabase.from("shared_files").insert({
      uploaded_by: teacherPlayerId, file_name: file.name, file_url: publicUrl,
    })
    fetchFiles()
  }

  async function deleteFile(id: string) {
    await supabase.from("shared_files").delete().eq("id", id); fetchFiles()
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const noteColors: Record<string, string> = {
    default: "bg-card border-border",
    yellow: "bg-amber-50 border-amber-200",
    green: "bg-emerald-50 border-emerald-200",
    blue: "bg-sky-50 border-sky-200",
    pink: "bg-pink-50 border-pink-200",
  }

  const noteCategories: { key: string; label: string; style: string }[] = [
    { key: "genel", label: "Genel", style: "bg-muted text-foreground" },
    { key: "onemli", label: "Önemli", style: "bg-red-100 text-red-700" },
    { key: "ders", label: "Ders", style: "bg-sky-100 text-sky-700" },
    { key: "neysesinde", label: "Neysesinde", style: "bg-zinc-100 text-zinc-500 italic" },
  ]

  const filteredUsers = userSearch.trim()
    ? allUsers.filter(u => u.nickname.toLowerCase().includes(userSearch.toLowerCase()))
    : allUsers

  const tabs: { key: Tab; label: string; icon: typeof Users; count?: number }[] = [
    { key: "genel", label: "Genel", icon: Sparkles },
    { key: "kullanicilar", label: "Kullanıcılar", icon: Users, count: allUsers.length },
    { key: "ogrenciler", label: "Öğrencilerim", icon: GraduationCap, count: students.length },
    { key: "odevler", label: "Ödevler", icon: BookOpen, count: homework.length },
    { key: "gorevler", label: "Görevlerim", icon: ListTodo, count: tasks.filter(t => !t.done).length },
    { key: "notlar", label: "Notlar", icon: StickyNote, count: notes.length },
    { key: "dosyalar", label: "Dosyalar", icon: FileText, count: files.length },

  ]

  const greetingEmoji = (() => {
    const h = new Date().getHours()
    if (h < 6) return <Moon className="w-5 h-5 text-indigo-400 inline" />
    if (h < 12) return <Sun className="w-5 h-5 text-amber-400 inline" />
    if (h < 18) return <CloudSun className="w-5 h-5 text-orange-400 inline" />
    return <Moon className="w-5 h-5 text-indigo-400 inline" />
  })()

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return "Günaydınlık"
    if (h < 18) return "İyi öğleden sonralar"
    return "İyi akşamlar"
  })()

  const pendingTasks = tasks.filter(t => !t.done).length
  const motivationalTips = [
    "Küçük adımlar büyük başarılara yol açar.",
    "Bugün bir öğrenciye ilham verebilirsin!",
    "Öğretmenlik dünyanın en güzel mesleği.",
    "Her ders yeni bir fırsattır.",
    "Geleceğe hazırlan, fırsat kaçmaz!",
    "Geleceği planlayan öğretmen, her zaman bir adım öndedir.",
  ]
  const dailyTip = motivationalTips[new Date().getDate() % motivationalTips.length]

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary/[0.03] to-background pt-20 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[11px] font-medium text-muted-foreground tracking-wide">
              {new Date().toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            <h1 className="font-serif text-2xl font-bold text-foreground mt-1 flex items-center gap-2">
              {greeting} {greetingEmoji}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {students.length > 0
                ? students.length + " öğrenci / " + homework.length + " ödev" + (pendingTasks > 0 ? " / " + pendingTasks + " bekleyen görev" : "")
                : "Hazırlanalım - ilk öğrencini ekle!"}
            </p>
          </div>
          <button onClick={() => router.push("/")} className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors" aria-label="Ana sayfa">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-5 -mx-4 px-4" style={{ scrollbarWidth: "none" }}>
          {tabs.map(t => {
            const active = tab === t.key
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                  active ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <t.icon className="w-3.5 h-3.5" />
                {t.label}
                {!active && (t.count ?? 0) > 0 && <span className="text-[9px] bg-muted-foreground/15 px-1.5 py-0.5 rounded-full">{t.count}</span>}
              </button>
            )
          })}
        </div>

        {/* === GENEL === */}
        {tab === "genel" && (
          <div className="space-y-4">
            {/* Daily tip */}
            <Card className="bg-gradient-to-r from-primary/5 to-primary/[0.02] border-primary/10">
              <CardContent className="py-3 px-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <p className="text-xs text-foreground/70 italic">{dailyTip}</p>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-2">
              <Card className="cursor-pointer hover:shadow-sm transition-all border-primary/10" onClick={() => setTab("ogrenciler")}>
                <CardContent className="py-3 text-center">
                  <p className="text-lg font-bold text-primary">{students.length}</p>
                  <p className="text-[10px] text-muted-foreground">{"Öğrenci"}</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-sm transition-all border-emerald-200/50" onClick={() => setTab("kullanicilar")}>
                <CardContent className="py-3 text-center">
                  <p className="text-lg font-bold text-emerald-600">{allUsers.length}</p>
                  <p className="text-[10px] text-muted-foreground">{"Kullanıcı"}</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-sm transition-all border-amber-200/50" onClick={() => setTab("odevler")}>
                <CardContent className="py-3 text-center">
                  <p className="text-lg font-bold text-amber-600">{homework.length}</p>
                  <p className="text-[10px] text-muted-foreground">{"Ödev"}</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-sm transition-all border-sky-200/50" onClick={() => setTab("gorevler")}>
                <CardContent className="py-3 text-center">
                  <p className="text-lg font-bold text-sky-600">{pendingTasks}</p>
                  <p className="text-[10px] text-muted-foreground">{"Görev"}</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-4 gap-2">
              <button onClick={() => setTab("kullanicilar")} className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all">
                <UserPlus className="w-4 h-4 text-primary" /><span className="text-[10px] font-medium text-muted-foreground">{"Öğrenci"}</span>
              </button>
              <button onClick={() => { setTab("odevler"); setShowNewHw(true) }} className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border border-border hover:border-emerald-300 hover:bg-emerald-50/50 transition-all">
                <Plus className="w-4 h-4 text-emerald-600" /><span className="text-[10px] font-medium text-muted-foreground">{"Ödev"}</span>
              </button>
              <button onClick={() => { setTab("notlar"); setShowNewNote(true) }} className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border border-border hover:border-amber-300 hover:bg-amber-50/50 transition-all">
                <PenLine className="w-4 h-4 text-amber-600" /><span className="text-[10px] font-medium text-muted-foreground">Not</span>
              </button>
              <button onClick={() => setTab("dosyalar")} className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border border-border hover:border-sky-300 hover:bg-sky-50/50 transition-all">
                <Upload className="w-4 h-4 text-sky-600" /><span className="text-[10px] font-medium text-muted-foreground">Dosya</span>
              </button>
            </div>

            {/* Pending tasks quick view */}
            {pendingTasks > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{"Bekleyen Görevler"}</p>
                  <button onClick={() => setTab("gorevler")} className="text-[11px] text-primary font-medium hover:underline">{"Tümünü gör"}</button>
                </div>
                <Card><CardContent className="py-1 divide-y divide-border/50">
                  {tasks.filter(t => !t.done).slice(0, 3).map(t => (
                    <div key={t.id} className="flex items-center gap-3 py-2.5 px-1">
                      <button onClick={() => saveTasks(tasks.map(x => x.id === t.id ? { ...x, done: true } : x))} className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 hover:border-primary flex items-center justify-center transition-colors shrink-0">
                      </button>
                      <span className="text-sm flex-1 truncate">{t.text}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                          t.priority === "high" ? "bg-red-100 text-red-600" : t.priority === "medium" ? "bg-amber-100 text-amber-600" : "bg-zinc-100 text-zinc-400 italic"
                        }`}>{t.priority === "high" ? "Acil" : t.priority === "medium" ? "Normal" : "Neysesinde"}</span>
                      </div>
                    ))}
                </CardContent></Card>
              </div>
            )}
          </div>
        )}

        {/* === KULLANICILAR === */}
        {tab === "kullanicilar" && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={userSearch} onChange={e => setUserSearch(e.target.value)}
                placeholder="Kullanıcı ara..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              {filteredUsers.length} {"kullanıcı - Öğrenci atadıklarınız ödev alabilir"}
            </p>
            <div className="space-y-1.5">
              {filteredUsers.map(u => (
                <Card key={u.id}>
                  <CardContent className="py-2.5 px-4 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                      u.is_enrolled ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
                    }`}>{u.nickname.charAt(0).toUpperCase()}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{u.nickname}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {u.total_xp} XP{u.is_enrolled && <span className="text-emerald-600 font-medium">{" - Öğrenciniz"}</span>}
                      </p>
                    </div>
                    <Button
                      size="sm" variant={u.is_enrolled ? "outline" : "default"}
                      className={`h-7 text-xs rounded-lg ${u.is_enrolled ? "text-destructive border-destructive/30 hover:bg-destructive/5" : ""}`}
                      onClick={() => toggleEnroll(u.id, u.is_enrolled)}
                    >
                      {u.is_enrolled ? <><UserMinus className="w-3 h-3 mr-1" />{"Çıkar"}</> : <><UserPlus className="w-3 h-3 mr-1" />{"Öğrenci Yap"}</>}
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {filteredUsers.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">{"Kullanıcı bulunamadı"}</p>
              )}
            </div>
          </div>
        )}

        {/* === OGRENCILERIM === */}
        {tab === "ogrenciler" && (
          <div className="space-y-3">
            {students.length === 0 ? (
              <Card className="border-dashed"><CardContent className="py-10 text-center">
                <GraduationCap className="w-7 h-7 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-3">{"Öğrenciniz yok"}</p>
                <Button variant="outline" size="sm" className="rounded-lg" onClick={() => setTab("kullanicilar")}>
                  <UserPlus className="w-4 h-4 mr-1.5" />{"Öğrenci Ekle"}
                </Button>
              </CardContent></Card>
            ) : (
              students.map(s => (
                <Link key={s.id} href={`/ogretmen/ogrenci/${s.id}`}>
                  <Card className="hover:shadow-sm transition-all cursor-pointer">
                    <CardContent className="py-3 px-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                        {s.nickname.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{s.nickname}</p>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span>{s.total_xp} XP</span>
                          {s.current_streak > 0 && <span className="flex items-center gap-0.5"><Flame className="w-3 h-3 text-orange-500" />{s.current_streak} {" gün"}</span>}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        )}

        {/* === ODEVLER === */}
        {tab === "odevler" && (
          <div className="space-y-4">
            {!showNewHw ? (
              <Button onClick={() => setShowNewHw(true)} className="w-full rounded-xl" variant="outline">
                <Plus className="w-4 h-4 mr-1.5" />{"Yeni Ödev"}
              </Button>
            ) : (
              <Card className="border-primary/20"><CardContent className="py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-primary" /> {"Yeni Ödev"}</p>
                  <button onClick={() => setShowNewHw(false)} className="p-1 hover:bg-muted rounded-lg"><X className="w-4 h-4" /></button>
                </div>
                <input value={hwTitle} onChange={e => setHwTitle(e.target.value)} placeholder="Ödev başlığı..." className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                <textarea value={hwDesc} onChange={e => setHwDesc(e.target.value)} placeholder="Açıklama..." rows={3} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <input type="date" value={hwDue} onChange={e => setHwDue(e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border hover:border-primary/40 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{hwFile ? hwFile.name : "Dosya ekle (PDF, Word, vb.)"}</span>
                    <input type="file" className="hidden" onChange={e => setHwFile(e.target.files?.[0] || null)} accept=".pdf,.doc,.docx,.txt,.xlsx,.pptx,.jpg,.png" />
                  </label>
                  {hwFile && <button onClick={() => setHwFile(null)} className="text-[10px] text-destructive mt-1 hover:underline">{"Dosyayı kaldır"}</button>}
                </div>
                {/* Student picker */}
                {students.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-muted-foreground">{"Kime atans\u0131n?"}</p>
                      <button
                        type="button"
                        onClick={() => { if (hwAllSelected) { setHwAllSelected(false); setHwSelectedStudents([]) } else { setHwAllSelected(true); setHwSelectedStudents([]) } }}
                        className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-colors ${hwAllSelected ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                      >
                        Hepsine
                      </button>
                    </div>
                    {!hwAllSelected && (
                      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                        {students.map(s => {
                          const sel = hwSelectedStudents.includes(s.id)
                          return (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => setHwSelectedStudents(prev => sel ? prev.filter(x => x !== s.id) : [...prev, s.id])}
                              className={`text-[11px] px-2.5 py-1.5 rounded-full font-medium transition-colors border ${sel ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:border-primary/40"}`}
                            >
                              {s.nickname}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
                <Button onClick={createHomework} disabled={!hwTitle.trim() || (!hwAllSelected && hwSelectedStudents.length === 0)} className="w-full rounded-xl">
                  {"Olu\u015ftur"} ({hwAllSelected ? students.length : hwSelectedStudents.length} {"\u00f6\u011frenciye"})
                </Button>
              </CardContent></Card>
            )}
            {homework.length === 0 && !showNewHw && <p className="text-sm text-muted-foreground text-center py-6">{"Hen\u00fcz \u00f6dev yok."}</p>}
            {homework.map(hw => (
              <Card key={hw.id} className={expandedHw === hw.id ? "ring-1 ring-primary/20" : ""}>
                <CardContent className="py-3 px-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{hw.title}</p>
                      {hw.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{hw.description}</p>}
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(hw.created_at).toLocaleDateString("tr-TR")}</span>
                        {hw.due_date && <span className="flex items-center gap-1 text-primary"><Calendar className="w-3 h-3" />{new Date(hw.due_date).toLocaleDateString("tr-TR")}</span>}
                        {hw.attachment_name && (
                          <button onClick={() => {
                            const { data: { publicUrl } } = supabase.storage.from("materials").getPublicUrl(hw.attachment_path!)
                            const a = document.createElement("a"); a.href = publicUrl; a.download = hw.attachment_name!; a.target = "_blank"; a.click()
                          }} className="flex items-center gap-1 text-primary hover:underline">
                            <FileText className="w-3 h-3" />{hw.attachment_name}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => toggleExpand(hw.id)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground transition-colors">
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expandedHw === hw.id ? "rotate-90" : ""}`} />
                      </button>
                      <button onClick={() => deleteHomework(hw.id)} className="p-1.5 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {/* Submissions toggle */}
                  <button onClick={() => toggleExpand(hw.id)} className="mt-2 text-[11px] text-primary font-medium hover:underline flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {expandedHw === hw.id ? "Teslimleri gizle" : "Teslimleri g\u00f6r"}
                  </button>
                  {/* Expanded submissions */}
                  {expandedHw === hw.id && (
                    <div className="mt-3 space-y-2 border-t border-border pt-3">
                      {(hwAssignments[hw.id] || []).length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-2">{"Hen\u00fcz teslim yok"}</p>
                      )}
                      {(hwAssignments[hw.id] || []).map((a: any) => {
                        const stu = Array.isArray(a.student) ? a.student[0] : a.student
                        return (
                          <div key={a.id} className="p-2.5 rounded-lg bg-muted/30 border border-border/50">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] shrink-0">
                                  {(stu?.nickname || "?").charAt(0).toUpperCase()}
                                </div>
                                <span className="text-xs font-medium truncate">{stu?.nickname || "?"}</span>
                              </div>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${
                                a.status === "reviewed" ? "bg-emerald-100 text-emerald-700" :
                                a.status === "submitted" ? "bg-sky-100 text-sky-700" :
                                "bg-amber-100 text-amber-700"
                              }`}>
                                {a.status === "reviewed" ? `${a.grade}/100` : a.status === "submitted" ? "Teslim edildi" : "Bekliyor"}
                              </span>
                            </div>
                            {a.submission_name && (
                              <button onClick={() => {
                                const { data: { publicUrl } } = supabase.storage.from("submissions").getPublicUrl(a.submission_path)
                                const el = document.createElement("a"); el.href = publicUrl; el.download = a.submission_name; el.target = "_blank"; el.click()
                              }} className="mt-1.5 flex items-center gap-1 text-[11px] text-primary hover:underline">
                                <Download className="w-3 h-3" />{a.submission_name}
                              </button>
                            )}
                            {a.status === "reviewed" && a.teacher_feedback && (
                              <p className="mt-1 text-[11px] text-muted-foreground italic">{a.teacher_feedback}</p>
                            )}
                            {a.status === "submitted" && gradingId !== a.id && (
                              <button onClick={() => { setGradingId(a.id); setGradeVal(a.grade?.toString() || ""); setFeedbackVal(a.teacher_feedback || "") }}
                                className="mt-2 text-[11px] font-medium text-primary hover:underline flex items-center gap-1">
                                <Star className="w-3 h-3" /> {"De\u011ferlendir"}
                              </button>
                            )}
                            {gradingId === a.id && (
                              <div className="mt-2 space-y-2 p-2.5 bg-background rounded-lg border border-border">
                                <div className="flex items-center gap-2">
                                  <input type="number" min="0" max="100" value={gradeVal} onChange={e => setGradeVal(e.target.value)} placeholder="Not (0-100)" className="w-24 px-2 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20" />
                                  <span className="text-[11px] text-muted-foreground">/ 100</span>
                                </div>
                                {/* Quick feedback templates */}
                                <div className="flex flex-wrap gap-1">
                                  {FEEDBACK_TEMPLATES.map((tmpl, idx) => (
                                    <button key={idx} onClick={() => setFeedbackVal(tmpl)} className="text-[10px] px-2 py-1 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors">
                                      {tmpl.slice(0, 25)}{tmpl.length > 25 ? "..." : ""}
                                    </button>
                                  ))}
                                </div>
                                <textarea value={feedbackVal} onChange={e => setFeedbackVal(e.target.value)} placeholder="Geri bildirim (isteğe bağlı)..." rows={2} className="w-full px-2 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
                                <div className="flex gap-2">
                                  <Button size="sm" className="rounded-lg text-xs h-7" onClick={() => gradeAssignment(a.id, hw.id)}>
                                    <CheckCircle2 className="w-3 h-3 mr-1" /> Kaydet
                                  </Button>
                                  <Button size="sm" variant="ghost" className="rounded-lg text-xs h-7" onClick={() => setGradingId(null)}>{"\u0130ptal"}</Button>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* === GOREVLER === */}
        {tab === "gorevler" && (
          <div className="space-y-4">
            <Card className="border-primary/20"><CardContent className="py-3 space-y-3">
              <div className="flex gap-2">
                <input
                  value={newTask} onChange={e => setNewTask(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && newTask.trim()) {
                      saveTasks([...tasks, { id: Date.now().toString(), text: newTask.trim(), done: false, priority: newPriority }])
                      setNewTask("")
                    }
                  }}
                  placeholder="Yeni görev ekle..."
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <select value={newPriority} onChange={e => setNewPriority(e.target.value as any)} className="px-2 py-2 rounded-lg border border-border bg-background text-xs">
                <option value="low">Neysesinde</option>
                <option value="medium">Normal</option>
                <option value="high">Acil</option>
                </select>
                <Button
                  size="sm" className="rounded-lg h-9"
                  disabled={!newTask.trim()}
                  onClick={() => {
                    saveTasks([...tasks, { id: Date.now().toString(), text: newTask.trim(), done: false, priority: newPriority }])
                    setNewTask("")
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardContent></Card>

            {/* Pending */}
            {tasks.filter(t => !t.done).length > 0 && (
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Bekleyen ({tasks.filter(t => !t.done).length})</p>
                <div className="space-y-1.5">
                  {tasks.filter(t => !t.done).map(t => (
                    <Card key={t.id} className={`${t.priority === "high" ? "border-red-200/60" : t.priority === "low" ? "border-dashed opacity-75" : ""}`}>
                      <CardContent className="py-2.5 px-4 flex items-center gap-3">
                        <button onClick={() => saveTasks(tasks.map(x => x.id === t.id ? { ...x, done: true } : x))} className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 hover:border-emerald-500 hover:bg-emerald-50 flex items-center justify-center transition-all shrink-0">
                        </button>
                        <span className="text-sm flex-1">{t.text}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                          t.priority === "high" ? "bg-red-100 text-red-600" : t.priority === "medium" ? "bg-amber-100 text-amber-600" : "bg-zinc-100 text-zinc-400 italic"
                        }`}>{t.priority === "high" ? "Acil" : t.priority === "medium" ? "Normal" : "Neysesinde"}</span>
                        <button onClick={() => saveTasks(tasks.filter(x => x.id !== t.id))} className="p-1 hover:bg-destructive/10 rounded text-muted-foreground/40 hover:text-destructive transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Completed */}
            {tasks.filter(t => t.done).length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Tamamlanan ({tasks.filter(t => t.done).length})</p>
                  <button onClick={() => saveTasks(tasks.filter(t => !t.done))} className="text-[10px] text-destructive hover:underline">Temizle</button>
                </div>
                <div className="space-y-1.5">
                  {tasks.filter(t => t.done).map(t => (
                    <Card key={t.id} className="opacity-60">
                      <CardContent className="py-2.5 px-4 flex items-center gap-3">
                        <button onClick={() => saveTasks(tasks.map(x => x.id === t.id ? { ...x, done: false } : x))} className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </button>
                        <span className="text-sm flex-1 line-through text-muted-foreground">{t.text}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {tasks.length === 0 && (
              <div className="text-center py-8">
                <ListTodo className="w-7 h-7 text-muted-foreground/20 mx-auto mb-2" />
<p className="text-sm text-muted-foreground">{"Henüz görev yok"}</p>
  <p className="text-xs text-muted-foreground/60 mt-0.5">{"Yukarıdaki alana yazarak görev ekleyebilirsiniz"}</p>
              </div>
            )}
          </div>
        )}

        {/* === NOTLAR === */}
        {tab === "notlar" && (
          <div className="space-y-4">
            {!showNewNote ? (
              <Button onClick={() => setShowNewNote(true)} className="w-full rounded-xl" variant="outline">
                <PenLine className="w-4 h-4 mr-1.5" />Yeni Not
              </Button>
            ) : (
              <Card className="border-amber-200/50"><CardContent className="py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold flex items-center gap-1.5"><StickyNote className="w-4 h-4 text-amber-500" /> Yeni Not</p>
                  <button onClick={() => setShowNewNote(false)} className="p-1 hover:bg-muted rounded-lg"><X className="w-4 h-4" /></button>
                </div>
                <input value={noteTitle} onChange={e => setNoteTitle(e.target.value)} placeholder="Başlık..." className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                <textarea value={noteContent} onChange={e => setNoteContent(e.target.value)} placeholder="Notunuzu yazın..." rows={4} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Renk:</span>
                  {Object.keys(noteColors).map(c => (
                    <button key={c} onClick={() => setNoteColor(c)} className={`w-6 h-6 rounded-full border-2 transition-all ${
                      c === "default" ? "bg-card" : c === "yellow" ? "bg-amber-100" : c === "green" ? "bg-emerald-100" : c === "blue" ? "bg-sky-100" : "bg-pink-100"
                    } ${noteColor === c ? "border-foreground scale-110" : "border-transparent"}`} />
                  ))}
                </div>
                <div className="space-y-1.5">
                  <span className="text-xs text-muted-foreground">Kategori:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {noteCategories.map(c => (
                      <button key={c.key} type="button" onClick={() => setNoteCategory(c.key)}
                        className={`text-[11px] px-2.5 py-1.5 rounded-full font-medium transition-all border ${
                          noteCategory === c.key ? "ring-2 ring-primary/30 border-primary " + c.style : "border-border " + c.style + " opacity-60 hover:opacity-100"
                        }`}>
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
                <select value={noteStudentId || ""} onChange={e => setNoteStudentId(e.target.value || null)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">Genel not</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.nickname}</option>)}
                </select>
                <Button onClick={createNote} disabled={!noteContent.trim()} className="w-full rounded-xl">Kaydet</Button>
              </CardContent></Card>
            )}
            {notes.length === 0 && !showNewNote && (
              <div className="text-center py-8">
                <StickyNote className="w-7 h-7 text-muted-foreground/20 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">{"M\u00fcfredat, ders planlar\u0131 veya \u00f6\u011frenci notlar\u0131n\u0131z\u0131 buraya ekleyin."}</p>
              </div>
            )}
            <div className="columns-1 sm:columns-2 gap-2 space-y-2">
              {notes.map(n => (
                <Card key={n.id} className={`break-inside-avoid ${n.title?.includes("[Neysesinde]") ? "opacity-70 border-dashed" : ""} ${noteColors[n.color] || noteColors.default}`}>
                  <CardContent className="py-3 px-4">
                    <div className="flex items-start gap-1.5">
                      <div className="flex-1 min-w-0">
                        {n.title && <p className="text-sm font-semibold mb-1">{n.title}</p>}
                        <p className="text-sm text-foreground/80 whitespace-pre-wrap">{n.content}</p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          {n.title?.includes("[Neysesinde]") && <span className="text-[10px] bg-zinc-100 text-zinc-500 italic px-2 py-0.5 rounded-full font-medium">neysesinde</span>}
                          {n.title?.includes("[Onemli]") && <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">onemli</span>}
                          {n.title?.includes("[Ders]") && <span className="text-[10px] bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full font-medium">ders</span>}
                          {n.student_nickname && <span className="text-[11px] bg-secondary/10 text-secondary px-2 py-0.5 rounded-full font-medium">{n.student_nickname}</span>}
                          <span className="text-[10px] text-muted-foreground">{new Date(n.created_at).toLocaleDateString("tr-TR")}</span>
                        </div>
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
        )}

        {/* === DOSYALAR === */}
        {tab === "dosyalar" && (
          <div className="space-y-4">
            <label className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed border-border hover:border-primary/40 cursor-pointer transition-colors bg-muted/20">
              <Upload className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{"Dosya Y\u00fckle"}</span>
              <input type="file" className="hidden" onChange={uploadFile} />
            </label>
            {files.length === 0 && (
              <div className="text-center py-8">
                <FileText className="w-7 h-7 text-muted-foreground/20 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">{"Ders materyallerinizi buradan y\u00fckleyebilirsiniz."}</p>
              </div>
            )}
            {files.map(f => (
              <Card key={f.id}>
                <CardContent className="py-3 px-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{f.file_name}</p>
                    <p className="text-[11px] text-muted-foreground">{new Date(f.created_at).toLocaleDateString("tr-TR")}</p>
                  </div>
                  <a href={f.file_url} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                    <Download className="w-4 h-4" />
                  </a>
                  <button onClick={() => deleteFile(f.id)} className="p-1.5 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
