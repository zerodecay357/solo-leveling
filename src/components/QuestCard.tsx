import { motion } from 'framer-motion'
import { Check, Clock, Dumbbell, Sparkles, BookOpen, Waves, Brain, Target } from 'lucide-react'
import type { Quest, Category } from '../store/useGameStore'
import StreakBadge from './StreakBadge'

const icons: Record<Category, any> = {
  gym: Dumbbell, looksmaxing: Sparkles, study: BookOpen,
  cardio: Waves, mind: Brain, custom: Target
}
const diffColor: Record<string, string> = {
  Easy: '#3fb950', Medium: '#39c6ff', Hard: '#f0883e', Boss: '#ff4d6d'
}

export default function QuestCard({
  quest, done, onComplete
}: { quest: Quest; done: boolean; onComplete: () => void }) {
  const Icon = icons[quest.category]
  return (
    <motion.div layout className={`sys-panel p-3 mb-3 flex items-center gap-3 ${done ? 'opacity-60' : ''}`}>
      <div
        className="w-10 h-10 grid place-items-center rounded"
        style={{ background: 'rgba(57,198,255,.1)', border: '1px solid rgba(57,198,255,.3)' }}
      >
        <Icon size={20} className="text-system-glow" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-semibold text-[15px] text-white truncate">{quest.title}</div>
        <div className="flex items-center gap-2 text-xs text-system-blue/60">
          <span style={{ color: diffColor[quest.difficulty] }}>{quest.difficulty}</span>
          <span>· +{quest.xpReward} XP</span>
          {quest.timeStart && (
            <span className="flex items-center gap-0.5"><Clock size={11} />{quest.timeStart}–{quest.timeEnd}</span>
          )}
          <StreakBadge streak={quest.streak} />
        </div>
      </div>

      <button
        onClick={onComplete}
        disabled={done}
        className="w-11 h-11 shrink-0 grid place-items-center rounded-full transition"
        style={{
          background: done ? 'rgba(63,185,80,.2)' : 'rgba(57,198,255,.15)',
          border: `1px solid ${done ? '#3fb950' : 'rgba(90,216,255,.6)'}`,
          boxShadow: done ? 'none' : '0 0 10px rgba(90,216,255,.4)'
        }}
        aria-label="complete quest"
      >
        <Check size={20} className={done ? 'text-green-400' : 'text-system-glow'} />
      </button>
    </motion.div>
  )
}
