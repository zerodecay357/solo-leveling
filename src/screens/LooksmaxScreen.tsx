import QuestCard from '../components/QuestCard'
import { useGameStore, isDoneToday } from '../store/useGameStore'

export default function LooksmaxScreen() {
  const { quests, completeQuest } = useGameStore()
  const looks = quests.filter(q => q.category === 'looksmaxing')
  const doneCount = looks.filter(isDoneToday).length
  const pct = looks.length ? Math.round((doneCount / looks.length) * 100) : 0

  return (
    <div className="pb-24">
      <div className="sys-panel p-4 mb-4 flex items-center gap-4">
        <div className="relative w-16 h-16">
          <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
            <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(57,198,255,.15)" strokeWidth="3" />
            <circle cx="18" cy="18" r="15" fill="none" stroke="#5ad8ff" strokeWidth="3"
              strokeDasharray={`${pct * 0.942} 100`} strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 0 4px #5ad8ff)' }} />
          </svg>
          <span className="absolute inset-0 grid place-items-center font-display text-sm text-white">{pct}%</span>
        </div>
        <div>
          <div className="font-display text-lg text-white">Looksmaxing</div>
          <div className="text-sm text-system-blue/70">{doneCount}/{looks.length} done today</div>
        </div>
      </div>
      <h2 className="font-display text-system-blue tracking-widest text-sm mb-2">⟪ APPEARANCE QUESTS ⟫</h2>
      {looks.map(q => (
        <QuestCard key={q.id} quest={q} done={isDoneToday(q)} onComplete={() => completeQuest(q.id)} />
      ))}
    </div>
  )
}
