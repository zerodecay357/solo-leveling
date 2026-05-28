import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare } from 'lucide-react'
import StatusWindow from '../components/StatusWindow'
import QuestCard from '../components/QuestCard'
import LevelUpOverlay from '../components/LevelUpOverlay'
import { useGameStore, activeToday, isDoneToday } from '../store/useGameStore'

export default function HomeScreen() {
  const { quests, completeQuest, level } = useGameStore()
  const [levelUp, setLevelUp] = useState<number | null>(null)
  const todays = quests.filter(activeToday)
  const remaining = todays.filter(q => !isDoneToday(q)).length
  const doneCount = todays.filter(isDoneToday).length
  const pct = todays.length ? Math.round((doneCount / todays.length) * 100) : 0

  function handleComplete(id: string) {
    const ups = completeQuest(id)
    if (ups > 0) setLevelUp(useGameStore.getState().level)
  }

  return (
    <div className="pb-24">
      <StatusWindow />

      {/* Daily progress header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="sys-notice">⟪ DAILY QUESTS ⟫</h2>
        {todays.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-14 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(57,198,255,.1)', border: '1px solid rgba(57,198,255,.15)' }}>
              <div className="h-full rounded-full transition-all duration-500" style={{
                width: `${pct}%`,
                background: pct === 100 ? 'linear-gradient(90deg, #3fb950, #5ce67a)' : 'linear-gradient(90deg, #1c9bd6, #5ad8ff)',
                boxShadow: pct === 100 ? '0 0 8px rgba(63,185,80,.6)' : '0 0 8px rgba(90,216,255,.5)'
              }} />
            </div>
            <span className="text-[11px] text-system-blue/50 font-display tracking-wider">
              {remaining > 0 ? `${remaining} LEFT` : '✓ ALL DONE'}
            </span>
          </div>
        )}
      </div>

      {/* Empty state — guide to chatbot */}
      {todays.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="sys-panel p-6 text-center"
        >
          <div className="mx-auto mb-3 w-12 h-12 rounded-full grid place-items-center"
            style={{
              background: 'rgba(57,198,255,.08)',
              border: '1px solid rgba(57,198,255,.2)',
              boxShadow: '0 0 20px rgba(90,216,255,.08)'
            }}>
            <MessageSquare size={22} className="text-system-blue/70" />
          </div>
          <p className="text-system-blue/60 text-sm mb-1 font-display tracking-wider">NO QUESTS YET</p>
          <p className="text-system-blue/35 text-xs leading-relaxed">
            Go to the <span className="text-system-blue/60">System</span> tab and tell the AI about your goals.
            <br />It will create your personalized quest board.
          </p>
        </motion.div>
      )}

      {/* Quest list */}
      {todays.map(q => (
        <QuestCard key={q.id} quest={q} done={isDoneToday(q)} onComplete={() => handleComplete(q.id)} />
      ))}

      <LevelUpOverlay level={levelUp} onDone={() => setLevelUp(null)} />
    </div>
  )
}
