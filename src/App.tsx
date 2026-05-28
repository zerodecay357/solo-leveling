import { useEffect, useState } from 'react'
import { Home, Sparkles, ListChecks, MessageSquare } from 'lucide-react'
import { useGameStore } from './store/useGameStore'
import HomeScreen from './screens/HomeScreen'
import LooksmaxScreen from './screens/LooksmaxScreen'
import QuestsScreen from './screens/QuestsScreen'
import ChatScreen from './screens/ChatScreen'

type Tab = 'home' | 'looks' | 'quests' | 'chat'

const tabs: { id: Tab; icon: any; label: string }[] = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'looks', icon: Sparkles, label: 'Looks' },
  { id: 'quests', icon: ListChecks, label: 'Quests' },
  { id: 'chat', icon: MessageSquare, label: 'System' }
]

export default function App() {
  const [tab, setTab] = useState<Tab>('home')
  const touchLogin = useGameStore(s => s.touchLogin)
  useEffect(() => { touchLogin() }, [touchLogin])

  return (
    <div className="max-w-md mx-auto min-h-screen px-4 safe-top">
      <header className="py-4 text-center">
        <h1 className="font-display text-2xl font-black tracking-[.25em] text-white glow-text">SOLO<span className="text-system-blue">RISE</span></h1>
      </header>

      <main>
        {tab === 'home' && <HomeScreen />}
        {tab === 'looks' && <LooksmaxScreen />}
        {tab === 'quests' && <QuestsScreen />}
        {tab === 'chat' && <ChatScreen />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto safe-bottom">
        <div className="m-3 sys-panel flex justify-around py-2">
          {tabs.map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setTab(id)}
              className="flex flex-col items-center gap-0.5 px-3 py-1"
              style={{ color: tab === id ? '#5ad8ff' : 'rgba(57,198,255,.45)' }}>
              <Icon size={20} style={{ filter: tab === id ? 'drop-shadow(0 0 6px #5ad8ff)' : 'none' }} />
              <span className="text-[10px] font-display tracking-wider">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
