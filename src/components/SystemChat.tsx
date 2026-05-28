import { useState, useRef, useEffect } from 'react'
import { Send, Bot, Clock } from 'lucide-react'
import { sendToSystem, type ChatTurn } from '../lib/api'
import { useGameStore } from '../store/useGameStore'

const COOLDOWN_SECONDS = 10

export default function SystemChat() {
  const store = useGameStore()
  const hasQuests = store.quests.length > 0

  const [msgs, setMsgs] = useState<ChatTurn[]>([
    {
      role: 'assistant',
      content: hasQuests
        ? '⟪ The System online. ⟫ Speak, Hunter. I can motivate you or reshape your quests — try "add a 10-minute meditation quest every morning".'
        : '⟪ The System online. ⟫ Welcome, new Hunter. You have no quests yet.\n\nTell me about your goals — fitness, study, self-care — and I\'ll create your quest board.\n\nTry: "I want to go to the gym 4x a week, study daily, and do skincare every morning"'
    }
  ])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const endRef = useRef<HTMLDivElement>(null)
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) {
      if (cooldownRef.current) clearInterval(cooldownRef.current)
      return
    }
    cooldownRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => { if (cooldownRef.current) clearInterval(cooldownRef.current) }
  }, [cooldown > 0])

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
    if (!input.trim() || busy || cooldown > 0) return
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
    } finally {
      setBusy(false)
      setCooldown(COOLDOWN_SECONDS)
    }
  }

  const isDisabled = busy || cooldown > 0

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

      <div className="mt-2 safe-bottom">
        {/* Cooldown indicator */}
        {cooldown > 0 && !busy && (
          <div className="flex items-center justify-center gap-1.5 mb-2 text-system-blue/50 text-xs font-display tracking-wider">
            <Clock size={12} className="animate-spin" style={{ animationDuration: '2s' }} />
            <span>COOLDOWN: {cooldown}s</span>
            <div className="w-16 h-1 bg-system-blue/10 rounded-full overflow-hidden ml-1">
              <div
                className="h-full bg-system-blue/40 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${(cooldown / COOLDOWN_SECONDS) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder={isDisabled ? (busy ? 'System is thinking...' : `Wait ${cooldown}s...`) : 'Message the System…'}
            disabled={isDisabled}
            className={`flex-1 bg-system-panel border border-system-edge rounded-lg px-3 py-2 text-sm outline-none transition-all duration-300
              ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'focus:border-system-blue'}`}
          />
          <button onClick={send} disabled={isDisabled}
            className={`w-11 grid place-items-center rounded-lg bg-system-blue/20 border border-system-blue/50 transition-all duration-300
              ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-system-blue/30'}`}>
            <Send size={18} className="text-system-glow" />
          </button>
        </div>
      </div>
    </div>
  )
}
