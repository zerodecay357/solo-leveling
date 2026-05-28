import { motion } from 'framer-motion'
import { useGameStore, rankForLevel, xpToNext } from '../store/useGameStore'
import { rankColor } from '../lib/ranks'
import { Flame } from 'lucide-react'

export default function StatusWindow() {
  const { name, level, xp, loginStreak } = useGameStore()
  const rank = rankForLevel(level)
  const need = xpToNext(level)
  const pct = Math.min(100, (xp / need) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      className="sys-panel p-4 mb-4"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-display text-xs tracking-[.3em] text-system-blue/70">STATUS</span>
        <span className="flex items-center gap-1 text-orange-400 text-sm font-semibold">
          <Flame size={15} className="fill-orange-400" /> {loginStreak}d
        </span>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="font-display text-2xl font-black glow-text text-white">{name}</div>
          <div className="text-system-blue/80 text-sm">Hunter</div>
        </div>
        <div className="text-right">
          <div
            className="font-display text-4xl font-black leading-none"
            style={{ color: rankColor[rank], textShadow: `0 0 16px ${rankColor[rank]}aa` }}
          >
            {rank}
          </div>
          <div className="text-xs text-system-blue/70">RANK</div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <span className="font-display text-lg text-white">LV {level}</span>
        <div className="flex-1">
          <div className="xp-bar h-2 rounded-full overflow-hidden">
            <div className="xp-fill h-full rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <div className="text-[11px] text-system-blue/60 mt-0.5 text-right">{xp} / {need} XP</div>
        </div>
      </div>
    </motion.div>
  )
}
