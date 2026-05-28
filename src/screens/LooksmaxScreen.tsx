import { motion } from 'framer-motion'
import QuestCard from '../components/QuestCard'
import { useGameStore, isDoneToday } from '../store/useGameStore'
import { Sparkles } from 'lucide-react'

export default function LooksmaxScreen() {
  const { quests, completeQuest } = useGameStore()
  const looks = quests.filter(q => q.category === 'looksmaxing')
  const doneCount = looks.filter(isDoneToday).length
  const pct = looks.length ? Math.round((doneCount / looks.length) * 100) : 0

  return (
    <div className="pb-24">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sys-panel-purple p-4 mb-4 flex items-center gap-4"
      >
        <div className="relative w-16 h-16">
          <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
            <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(163,113,247,.12)" strokeWidth="3" />
            <circle cx="18" cy="18" r="15" fill="none" stroke="#a371f7" strokeWidth="3"
              strokeDasharray={`${pct * 0.942} 100`} strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 0 6px #a371f7)', transition: 'stroke-dasharray 0.5s ease' }} />
          </svg>
          <span className="absolute inset-0 grid place-items-center font-display text-sm text-white">{pct}%</span>
        </div>
        <div>
          <div className="font-display text-lg text-white flex items-center gap-2">
            <Sparkles size={16} className="text-system-purple" style={{ filter: 'drop-shadow(0 0 4px #a371f7)' }} />
            Looksmaxing
          </div>
          <div className="text-sm text-system-purple/60">{doneCount}/{looks.length} done today</div>
        </div>
      </motion.div>

      <h2 className="sys-notice mb-3">⟪ APPEARANCE QUESTS ⟫</h2>

      {looks.length === 0 && (
        <div className="sys-panel-purple p-4 text-center">
          <p className="text-system-purple/50 text-xs">No looksmaxing quests yet. Ask the System to add some.</p>
        </div>
      )}

      {looks.map(q => (
        <QuestCard key={q.id} quest={q} done={isDoneToday(q)} onComplete={() => completeQuest(q.id)} />
      ))}
    </div>
  )
}
