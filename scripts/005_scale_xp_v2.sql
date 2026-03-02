-- Migration: Scale all existing player XP by 30x for new progression system
-- Old system: badges at 50-600 XP, rewards 15-100 per activity
-- New system: badges at 200-18000 XP, rewards 3-35 per activity
-- Scale factor: 30x to preserve relative player positions

-- Only scale players who have XP and haven't been migrated yet
-- (Players with XP < 18000 under old system max of 600 * 30 = 18000)
UPDATE public.players
SET total_xp = total_xp * 30
WHERE total_xp > 0
  AND total_xp < 18001;
