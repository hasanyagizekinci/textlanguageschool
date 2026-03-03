"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"

interface PlayerData {
  id: string
  nickname: string
  avatar_seed: string
  total_xp: number
  current_streak: number
  best_streak: number
  role: string
  auth_id: string | null
}

export function usePlayer() {
  const [player, setPlayer] = useState<PlayerData | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const supabase = createClient()
    if (!supabase) { setLoading(false); return }
    const playerId = typeof window !== "undefined" ? localStorage.getItem("tls_player_id") : null
    if (!playerId) { setLoading(false); return }
    const { data } = await supabase.from("players").select("*").eq("id", playerId).single()
    if (data) setPlayer(data as PlayerData)
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const updateNickname = async (nickname: string) => {
    if (!player) return
    const supabase = createClient()
    if (!supabase) return
    await supabase.from("players").update({ nickname }).eq("id", player.id)
    setPlayer(prev => prev ? { ...prev, nickname } : null)
  }

  return { player, loading, refresh, updateNickname }
}
