-- Migration: Scale existing player XP down by 0.2x for new progression system
-- Old system: rewards 15-100 per activity (generous)
-- New system: rewards 3-35 per activity (long-term grind)
-- Scale factor: 0.2x (divide by 5) to match new earning rate
-- ALREADY EXECUTED on 2026-03-02 via supabase_execute_sql

UPDATE public.players
SET total_xp = GREATEST(1, ROUND(total_xp * 0.2))
WHERE total_xp > 0;
