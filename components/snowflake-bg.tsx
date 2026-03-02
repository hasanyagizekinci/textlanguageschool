"use client"

import { useEffect, useState, useMemo } from "react"

/**
 * Doodly, hand-drawn snowflake field.
 * Thin monochrome line-art, varied sizes, gentle wobble drift.
 * Low visual dominance -- never distracts from reading.
 * Slight blur/fade as flakes approach bottom (melt hint).
 */

interface Flake {
  id: number
  x: number
  delay: number
  dur: number
  size: number
  opacity: number
  swayDur: number
  swayAmt: number
  spinDur: number
  variant: number
  wobble: number
}

/* Hand-drawn style SVG snowflakes -- thin, monochrome, slightly imperfect */
function DoodleFlake({ size, variant }: { size: number; variant: number }) {
  const r = size / 2
  const arm = r * 0.82

  // variant 0: classic 6-arm with short barbs, slight asymmetry
  if (variant === 0) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`translate(${r},${r})`} stroke="currentColor" strokeWidth={0.55} strokeLinecap="round" fill="none">
          {[0, 60, 120, 180, 240, 300].map((a, i) => (
            <g key={a} transform={`rotate(${a + (i % 2 === 0 ? 1 : -1)})`}>
              <line x1={0} y1={0} x2={0} y2={-arm} />
              <line x1={0} y1={-arm * 0.45} x2={-arm * 0.22} y2={-arm * 0.62} />
              <line x1={0} y1={-arm * 0.45} x2={arm * 0.20} y2={-arm * 0.60} />
              <line x1={0} y1={-arm * 0.72} x2={-arm * 0.14} y2={-arm * 0.82} />
              <line x1={0} y1={-arm * 0.72} x2={arm * 0.13} y2={-arm * 0.84} />
            </g>
          ))}
        </g>
      </svg>
    )
  }

  // variant 1: delicate 6-arm with tiny circles at tips
  if (variant === 1) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`translate(${r},${r})`} stroke="currentColor" strokeWidth={0.5} strokeLinecap="round" fill="none">
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <g key={a} transform={`rotate(${a})`}>
              <line x1={0} y1={0} x2={0} y2={-arm * 0.88} />
              <circle cx={0} cy={-arm * 0.88} r={0.7} fill="currentColor" opacity={0.4} />
              <line x1={0} y1={-arm * 0.38} x2={-arm * 0.18} y2={-arm * 0.52} />
              <line x1={0} y1={-arm * 0.38} x2={arm * 0.18} y2={-arm * 0.52} />
            </g>
          ))}
          <circle cx={0} cy={0} r={1} fill="currentColor" opacity={0.3} />
        </g>
      </svg>
    )
  }

  // variant 2: sparse 4-arm cross with tapered feel
  if (variant === 2) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`translate(${r},${r})`} stroke="currentColor" strokeWidth={0.5} strokeLinecap="round" fill="none">
          {[0, 90, 180, 270].map((a) => (
            <g key={a} transform={`rotate(${a + 12})`}>
              <line x1={0} y1={0} x2={0} y2={-arm * 0.8} />
              <line x1={0} y1={-arm * 0.35} x2={-arm * 0.16} y2={-arm * 0.48} />
              <line x1={0} y1={-arm * 0.35} x2={arm * 0.16} y2={-arm * 0.48} />
            </g>
          ))}
        </g>
      </svg>
    )
  }

  // variant 3: asterisk-like 8-arm, very thin
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`translate(${r},${r})`} stroke="currentColor" strokeWidth={0.4} strokeLinecap="round" fill="none">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <line key={a} x1={0} y1={0} x2={0} y2={-arm * 0.65} transform={`rotate(${a})`} />
        ))}
      </g>
    </svg>
  )
}

export function SnowflakeBg() {
  const [mounted, setMounted] = useState(false)

  const flakes = useMemo<Flake[]>(() =>
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      x: 3 + (i / 14) * 94 + (Math.random() - 0.5) * 6,
      delay: i * 1.5 + Math.random() * 3,
      dur: 30 + Math.random() * 20,
      size: 14 + Math.random() * 18,
      opacity: 0.12 + Math.random() * 0.1,
      swayDur: 6 + Math.random() * 6,
      swayAmt: 10 + Math.random() * 14,
      spinDur: 20 + Math.random() * 30,
      variant: Math.floor(Math.random() * 4),
      wobble: 0.3 + Math.random() * 0.7,
    })),
  [])

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none select-none z-0" aria-hidden="true">
      {/* Bottom melt gradient -- flakes dissolve as they approach the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent z-[1]" />

      {flakes.map(f => (
        <span
          key={f.id}
          className="absolute text-foreground/50"
          style={{
            left: `${f.x}%`,
            top: -30,
            opacity: f.opacity,
            animation: `snowfall ${f.dur}s ease-in-out ${f.delay}s infinite`,
            filter: f.size > 22 ? "blur(0.4px)" : undefined,
          }}
        >
          <span
            className="block"
            style={{ animation: `snowsway ${f.swayDur}s ease-in-out ${f.delay * 0.3}s infinite alternate` }}
          >
            <span
              className="block"
              style={{ animation: `snowspin ${f.spinDur}s linear ${f.delay * 0.5}s infinite` }}
            >
              <DoodleFlake size={f.size} variant={f.variant} />
            </span>
          </span>
        </span>
      ))}
    </div>
  )
}
