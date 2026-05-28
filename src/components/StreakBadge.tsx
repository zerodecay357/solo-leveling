import { Flame } from 'lucide-react'

export default function StreakBadge({ streak }: { streak: number }) {
  if (streak <= 0) return null
  // glow scales with streak length
  const intensity = Math.min(1, streak / 30)
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded"
      style={{
        color: `rgb(255, ${150 - intensity * 60}, ${60 - intensity * 60})`,
        textShadow: `0 0 ${4 + intensity * 10}px rgba(255,120,40,${.4 + intensity * .5})`
      }}
    >
      <Flame size={13} className="fill-current" /> {streak}
    </span>
  )
}
