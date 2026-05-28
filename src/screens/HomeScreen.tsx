import { useState } from 'react'
import StatusWindow from '../components/StatusWindow'
import QuestCard from '../components/QuestCard'
import LevelUpOverlay from '../components/LevelUpOverlay'
import { useGameStore, activeToday, isDoneToday } from '../store/useGameStore'

export default function HomeScreen() {
  const { quests, completeQuest, level } = useGameStore()
  const [levelUp, setLevelUp] = useState<number | null>(null)
  const todays = quests.filter(activeToday)
  const remaining = todays.filter(q => !isDoneToday(q)).length

  function handleComplete(id: string) {
    const ups = completeQuest(id)
    if (ups > 0) setLevelUp(useGameStore.getState().level)
  }

  return (
    <div className="pb-24">
      <StatusWindow />
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-display text-system-blue tracking-widest text-sm">⟪ DAILY QUESTS ⟫</h2>
        <span className="text-xs text-system-blue/60">{remaining} remaining</span>
      </div>
      {todays.length === 0 && (
        <div className="sys-panel p-4 text-center">
          <p className="text-system-blue/70 text-sm mb-1">No quests yet, Hunter.</p>
          <p className="text-system-blue/40 text-xs">Go to the <span className="text-system-blue">System</span> tab and tell the AI about your goals to create your quest board.</p>
        </div>
      )}
      {todays.map(q => (
        <QuestCard key={q.id} quest={q} done={isDoneToday(q)} onComplete={() => handleComplete(q.id)} />
      ))}
      <LevelUpOverlay level={levelUp} onDone={() => setLevelUp(null)} />
    </div>
  )
}
