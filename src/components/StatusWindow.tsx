import { motion } from 'framer-motion'
import { useGameStore, rankForLevel, xpToNext } from '../store/useGameStore'
import { rankColor } from '../lib/ranks'
import { Flame, Shield, Zap } from 'lucide-react'

export default function StatusWindow() {
  const { name, level, xp, loginStreak, quests } = useGameStore()
  const rank = rankForLevel(level)
  const need = xpToNext(level)
  const pct = Math.min(100, (xp / need) * 100)
  const totalCompleted = quests.reduce((sum, q) => sum + q.longest, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      className="sys-panel p-4 mb-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="sys-notice">⟪ PLAYER STATUS ⟫</span>
        <span className="flex items-center gap-1 text-orange-400 text-sm font-semibold">
          <Flame size={15} className="fill-orange-400" style={{ filter: 'drop-shadow(0 0 4px rgba(251,146,60,.5))' }} /> {loginStreak}d
        </span>
      </div>

      <div className="sys-divider" />

      {/* Name + Rank */}
      <div className="flex items-end justify-between mt-3">
        <div>
          <div className="text-system-blue/50 text-[10px] font-display tracking-[.3em] mb-0.5">HUNTER</div>
          <div className="font-display text-2xl font-black glow-text text-white">{name}</div>
        </div>
        <div className="text-right">
          <div className="text-system-blue/50 text-[10px] font-display tracking-[.3em] mb-0.5">RANK</div>
          <div
            className="font-display text-4xl font-black leading-none"
            style={{
              color: rankColor[rank],
              textShadow: `0 0 20px ${rankColor[rank]}88, 0 0 40px ${rankColor[rank]}33`,
              filter: `drop-shadow(0 0 8px ${rankColor[rank]}55)`
            }}
          >
            {rank}
          </div>
        </div>
      </div>

      <div className="sys-divider" />

      {/* Level + XP bar */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <Shield size={16} className="text-system-blue/70" />
          <span className="font-display text-lg text-white">LV {level}</span>
        </div>
        <div className="flex-1">
          <div className="xp-bar h-2.5 rounded-full overflow-hidden">
            <motion.div
              className="xp-fill h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <div className="text-[11px] text-system-blue/50 mt-0.5 text-right font-display tracking-wider">
            {xp} / {need} XP
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex justify-around mt-3 pt-3 border-t border-system-blue/10">
        <div className="text-center">
          <div className="text-system-blue/40 text-[9px] font-display tracking-widest">QUESTS</div>
          <div className="font-display text-white text-sm">{quests.length}</div>
        </div>
        <div className="text-center">
          <div className="text-system-blue/40 text-[9px] font-display tracking-widest">STREAK</div>
          <div className="font-display text-orange-400 text-sm flex items-center justify-center gap-0.5">
            <Flame size={11} className="fill-orange-400" />{loginStreak}
          </div>
        </div>
        <div className="text-center">
          <div className="text-system-blue/40 text-[9px] font-display tracking-widest">POWER</div>
          <div className="font-display text-system-purple text-sm flex items-center justify-center gap-0.5">
            <Zap size={11} />{level * 10 + totalCompleted}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
