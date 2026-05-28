import { useState, useRef, useEffect } from 'react'
import { Send, Bot } from 'lucide-react'
import { sendToSystem, type ChatTurn } from '../lib/api'
import { useGameStore } from '../store/useGameStore'

export default function SystemChat() {
  const store = useGameStore()
  const [msgs, setMsgs] = useState<ChatTurn[]>([
    { role: 'assistant', content: '⟪ The System online. ⟫ Speak, Hunter. I can motivate you or reshape your quests — try "add a 10-minute meditation quest every morning".' }
  ])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  async function applyTools(calls: { name: string; input: any }[]) {
    const notes: string[] = []
    for (const c of calls) {
      if (c.name === 'add_quest') {
        const q = store.addQuest(c.input)
        notes.push(`⟪ Quest added: ${q.title} ⟫`)
      } else if (c.name === 'edit_quest') {
        store.editQuest(c.input.id, c.input.patch)
        notes.push(`⟪ Quest updated ⟫`)
      } else if (c.name === 'delete_quest') {
        store.deleteQuest(c.input.id)
        notes.push(`⟪ Quest removed ⟫`)
      }
    }
    return notes
  }

  async function send() {
    if (!input.trim() || busy) return
    const next = [...msgs, { role: 'user' as const, content: input.trim() }]
    setMsgs(next); setInput(''); setBusy(true)
    try {
      const config = useGameStore.getState().quests
      const { reply, toolCalls } = await sendToSystem(next, config)
      const notes = await applyTools(toolCalls)
      const text = [reply, ...notes].filter(Boolean).join('\n')
      setMsgs(m => [...m, { role: 'assistant', content: text || '⟪ Done. ⟫' }])
    } catch (e: any) {
      setMsgs(m => [...m, { role: 'assistant', content: `⟪ ${e.message} ⟫` }])
    } finally { setBusy(false) }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto no-sb pr-1">
        {msgs.map((m, i) => (
          <div key={i} className={`mb-3 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[82%] px-3 py-2 text-sm whitespace-pre-wrap rounded-lg ${
                m.role === 'user'
                  ? 'bg-system-blue/20 border border-system-blue/40 text-white'
                  : 'sys-panel text-system-glow'
              }`}
            >
              {m.role === 'assistant' && <Bot size={14} className="inline mr-1 mb-0.5 text-system-blue" />}
              {m.content}
            </div>
          </div>
        ))}
        {busy && <div className="text-system-blue/50 text-sm">⟪ The System is thinking… ⟫</div>}
        <div ref={endRef} />
      </div>

      <div className="flex gap-2 mt-2 safe-bottom">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Message the System…"
          className="flex-1 bg-system-panel border border-system-edge rounded-lg px-3 py-2 text-sm outline-none focus:border-system-blue"
        />
        <button onClick={send} disabled={busy}
          className="w-11 grid place-items-center rounded-lg bg-system-blue/20 border border-system-blue/50">
          <Send size={18} className="text-system-glow" />
        </button>
      </div>
    </div>
  )
}
