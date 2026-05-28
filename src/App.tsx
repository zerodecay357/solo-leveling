import { useEffect, useState } from 'react'
import { Home, Sparkles, ListChecks, MessageSquare, LogOut } from 'lucide-react'
import { useAuthStore } from './store/useAuthStore'
import { useGameStore } from './store/useGameStore'
import LoginScreen from './screens/LoginScreen'
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
  const currentUser = useAuthStore(s => s.currentUser)
  const logout = useAuthStore(s => s.logout)
  const loadUser = useGameStore(s => s.loadUser)
  const touchLogin = useGameStore(s => s.touchLogin)
  const [tab, setTab] = useState<Tab>('home')
  const [ready, setReady] = useState(false)

  // When user logs in, load their per-user store
  useEffect(() => {
    if (currentUser) {
      loadUser(currentUser)
      touchLogin()
      setReady(true)
    } else {
      setReady(false)
      setTab('home')
    }
  }, [currentUser])

  // Not logged in → show login screen
  if (!currentUser) return <LoginScreen />

  // Waiting for store to initialize
  if (!ready) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="font-display text-system-blue animate-pulse tracking-widest">LOADING...</p>
    </div>
  )

  return (
    <div className="max-w-md mx-auto min-h-screen px-4 safe-top">
      <header className="py-4 flex items-center justify-between">
        <h1 className="font-display text-2xl font-black tracking-[.25em] text-white glow-text">
          SOLO<span className="text-system-blue">RISE</span>
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-xs text-system-blue/60 font-display tracking-wider">
            {currentUser}
          </span>
          <button
            onClick={() => { logout(); setReady(false) }}
            className="text-system-blue/40 hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <main>
        {tab === 'home' && <HomeScreen />}
        {tab === 'looks' && <LooksmaxScreen />}
        {tab === 'quests' && <QuestsScreen />}
        {tab === 'chat' && <ChatScreen />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto safe-bottom">
        <div className="m-3 nav-panel flex justify-around py-2.5">
          {tabs.map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setTab(id)}
              className="flex flex-col items-center gap-0.5 px-3 py-1 transition-all duration-300"
              style={{
                color: tab === id ? '#5ad8ff' : 'rgba(57,198,255,.35)',
              }}>
              <Icon size={20} style={{
                filter: tab === id ? 'drop-shadow(0 0 8px #5ad8ff) drop-shadow(0 0 16px rgba(90,216,255,.3))' : 'none',
                transition: 'filter 0.3s ease'
              }} />
              <span className="text-[10px] font-display tracking-wider">{label}</span>
              {tab === id && (
                <div className="w-4 h-0.5 rounded-full mt-0.5"
                  style={{ background: '#5ad8ff', boxShadow: '0 0 6px #5ad8ff' }} />
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
