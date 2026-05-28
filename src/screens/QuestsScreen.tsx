import { useState } from 'react'
import { Trash2, Plus } from 'lucide-react'
import { useGameStore, isDoneToday, DAYS, type Category, type Difficulty } from '../store/useGameStore'
import StreakBadge from '../components/StreakBadge'

export default function QuestsScreen() {
  const { quests, addQuest, deleteQuest } = useGameStore()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [cat, setCat] = useState<Category>('custom')
  const [diff, setDiff] = useState<Difficulty>('Medium')
  const [days, setDays] = useState<string[]>([])

  function create() {
    if (!title.trim()) return
    addQuest({ title, category: cat, difficulty: diff, days })
    setTitle(''); setDays([]); setOpen(false)
  }

  return (
    <div className="pb-24">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-system-blue tracking-widest text-sm">⟪ ALL QUESTS ⟫</h2>
        <button onClick={() => setOpen(!open)}
          className="flex items-center gap-1 text-sm px-2 py-1 rounded bg-system-blue/20 border border-system-blue/50 text-system-glow">
          <Plus size={15} /> New
        </button>
      </div>

      {open && (
        <div className="sys-panel p-3 mb-4 space-y-2">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Quest title"
            className="w-full bg-system-bg border border-system-edge rounded px-2 py-1.5 text-sm outline-none focus:border-system-blue" />
          <div className="flex gap-2">
            <select value={cat} onChange={e => setCat(e.target.value as Category)}
              className="flex-1 bg-system-bg border border-system-edge rounded px-2 py-1.5 text-sm">
              {['gym','looksmaxing','study','cardio','mind','custom'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={diff} onChange={e => setDiff(e.target.value as Difficulty)}
              className="flex-1 bg-system-bg border border-system-edge rounded px-2 py-1.5 text-sm">
              {['Easy','Medium','Hard','Boss'].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="flex flex-wrap gap-1">
            {DAYS.map(d => (
              <button key={d} onClick={() => setDays(s => s.includes(d) ? s.filter(x => x !== d) : [...s, d])}
                className={`text-xs px-2 py-1 rounded border ${days.includes(d) ? 'bg-system-blue/30 border-system-blue text-white' : 'border-system-edge text-system-blue/60'}`}>
                {d}
              </button>
            ))}
            <span className="text-[11px] text-system-blue/40 self-center ml-1">none = daily</span>
          </div>
          <button onClick={create} className="w-full py-2 rounded bg-system-blue/25 border border-system-blue/60 text-system-glow font-semibold">
            Create Quest
          </button>
        </div>
      )}

      {quests.map(q => (
        <div key={q.id} className="sys-panel p-3 mb-2 flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-white text-sm font-semibold truncate">{q.title}</div>
            <div className="text-xs text-system-blue/60 flex items-center gap-2">
              <span>{q.category} · {q.difficulty}</span>
              <span>{q.days.length ? q.days.join(',') : 'daily'}</span>
              <StreakBadge streak={q.streak} />
              {isDoneToday(q) && <span className="text-green-400">✓ today</span>}
            </div>
          </div>
          <button onClick={() => deleteQuest(q.id)} className="text-red-400/70 p-2"><Trash2 size={16} /></button>
        </div>
      ))}
    </div>
  )
}
