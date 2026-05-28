import { motion } from 'framer-motion'
import { Check, Clock, Dumbbell, Sparkles, BookOpen, Waves, Brain, Target } from 'lucide-react'
import type { Quest, Category } from '../store/useGameStore'
import StreakBadge from './StreakBadge'

const icons: Record<Category, any> = {
  gym: Dumbbell, looksmaxing: Sparkles, study: BookOpen,
  cardio: Waves, mind: Brain, custom: Target
}

const catBg: Record<Category, string> = {
  gym: 'rgba(240,136,62,.12)',
  looksmaxing: 'rgba(163,113,247,.12)',
  study: 'rgba(57,198,255,.12)',
  cardio: 'rgba(63,185,80,.12)',
  mind: 'rgba(251,191,36,.12)',
  custom: 'rgba(90,216,255,.1)',
}

const catBorder: Record<Category, string> = {
  gym: 'rgba(240,136,62,.3)',
  looksmaxing: 'rgba(163,113,247,.3)',
  study: 'rgba(57,198,255,.3)',
  cardio: 'rgba(63,185,80,.3)',
  mind: 'rgba(251,191,36,.3)',
  custom: 'rgba(90,216,255,.25)',
}

const catGlow: Record<Category, string> = {
  gym: '#f0883e',
  looksmaxing: '#a371f7',
  study: '#39c6ff',
  cardio: '#3fb950',
  mind: '#fbbf24',
  custom: '#5ad8ff',
}

const diffClass: Record<string, string> = {
  Easy: 'diff-easy', Medium: 'diff-medium', Hard: 'diff-hard', Boss: 'diff-boss'
}

export default function QuestCard({
  quest, done, onComplete
}: { quest: Quest; done: boolean; onComplete: () => void }) {
  const Icon = icons[quest.category]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: done ? 0.55 : 1, x: 0 }}
      className={`sys-panel p-3 mb-3 flex items-center gap-3 ${done ? 'quest-done' : ''}`}
    >
      {/* Category icon */}
      <div
        className="cat-icon shrink-0"
        style={{
          background: catBg[quest.category],
          border: `1px solid ${catBorder[quest.category]}`,
          boxShadow: done ? 'none' : `0 0 10px ${catBorder[quest.category]}`
        }}
      >
        <Icon
          size={20}
          style={{
            color: catGlow[quest.category],
            filter: done ? 'none' : `drop-shadow(0 0 4px ${catGlow[quest.category]})`
          }}
        />
      </div>

      {/* Quest info */}
      <div className="flex-1 min-w-0">
        <div className={`font-semibold text-[15px] truncate ${done ? 'text-white/60 line-through' : 'text-white'}`}>
          {quest.title}
        </div>
        <div className="flex items-center gap-2 text-xs text-system-blue/50 mt-0.5">
          <span className={`diff-badge ${diffClass[quest.difficulty]}`}>
            {quest.difficulty}
          </span>
          <span className="font-display text-system-glow/70">+{quest.xpReward} XP</span>
          {quest.timeStart && (
            <span className="flex items-center gap-0.5 text-system-blue/40">
              <Clock size={10} />{quest.timeStart}–{quest.timeEnd}
            </span>
          )}
          <StreakBadge streak={quest.streak} />
        </div>
      </div>

      {/* Complete button */}
      <button
        onClick={onComplete}
        disabled={done}
        className="w-11 h-11 shrink-0 grid place-items-center rounded transition-all duration-300"
        style={{
          background: done ? 'rgba(63,185,80,.15)' : 'rgba(57,198,255,.1)',
          border: `1px solid ${done ? 'rgba(63,185,80,.4)' : 'rgba(90,216,255,.4)'}`,
          boxShadow: done ? '0 0 8px rgba(63,185,80,.2)' : '0 0 12px rgba(90,216,255,.15)',
          clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)'
        }}
        aria-label="complete quest"
      >
        {done
          ? <Check size={20} className="text-green-400" style={{ filter: 'drop-shadow(0 0 4px rgba(63,185,80,.5))' }} />
          : <Check size={20} className="text-system-glow" style={{ filter: 'drop-shadow(0 0 4px rgba(90,216,255,.5))' }} />
        }
      </button>
    </motion.div>
  )
}
