import { createClient } from "@/lib/supabase/client"
import { useState, useEffect, useCallback } from "react"

const PLAYER_ID_KEY = "tls_player_id"
const PLAYER_NICK_KEY = "tls_username"

export function getCurrentPlayerId(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(PLAYER_ID_KEY)
}

export function getCurrentNickname(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(PLAYER_NICK_KEY)
}

/** React hook for player identity. Returns loading state, whether nickname is needed, and a setter. */
export function usePlayer() {
  const [loading, setLoading] = useState(true)
  const [needsNickname, setNeedsNickname] = useState(false)
  const [playerId, setPlayerId] = useState<string | null>(null)

  useEffect(() => {
    const id = getCurrentPlayerId()
    if (id) {
      setPlayerId(id)
      setNeedsNickname(false)
    } else {
      setNeedsNickname(true)
    }
    setLoading(false)
  }, [])

  const setNickname = useCallback(async (nickname: string) => {
    const id = await getOrCreatePlayer(nickname)
    setPlayerId(id)
    setNeedsNickname(false)
    return id
  }, [])

  return { loading, needsNickname, playerId, setNickname }
}

export async function getOrCreatePlayer(nickname: string): Promise<string> {
  const existing = getCurrentPlayerId()
  if (existing) return existing

  const supabase = createClient()
  const seed = Math.random().toString(36).substring(2, 8)

  const { data, error } = await supabase
    .from("players")
    .insert({ nickname, avatar_seed: seed })
    .select("id")
    .single()

  if (error) throw error

  localStorage.setItem(PLAYER_ID_KEY, data.id)
  localStorage.setItem(PLAYER_NICK_KEY, nickname)

  return data.id
}

export async function linkAuthAccount(playerId: string, authId: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from("players")
    .update({ auth_id: authId })
    .eq("id", playerId)

  if (error) throw error
}

export async function getPlayerByAuthId(authId: string) {
  const supabase = createClient()

  const { data } = await supabase
    .from("players")
    .select("*")
    .eq("auth_id", authId)
    .single()

  return data
}

export async function updatePlayerRole(playerId: string, role: "student" | "teacher") {
  const supabase = createClient()

  const { error } = await supabase
    .from("players")
    .update({ role })
    .eq("id", playerId)

  if (error) throw error
}

// Random Turkish nickname suggestions
const ADJECTIVES = [
  "Cesur", "Hızlı", "Akıllı", "Güçlü", "Parlak",
  "Neşeli", "Azimli", "Kararlı", "Yaratıcı", "Meraklı"
]
const NOUNS = [
  "Kartal", "Tilki", "Aslan", "Kurt", "Şahin",
  "Yunuş", "Pars", "Kaplan", "Baykuş", "Atmaca"
]

export function getRandomNickname(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)]
  return `${adj} ${noun}`
}
