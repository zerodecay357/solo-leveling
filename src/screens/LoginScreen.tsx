import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Swords, UserPlus, LogIn, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'

type Mode = 'login' | 'register'

export default function LoginScreen() {
  const { login, register } = useAuthStore()
  const [mode, setMode] = useState<Mode>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)

  function triggerShake() {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const result = mode === 'login'
      ? login(username, password)
      : register(username, password)
    if (!result.ok) {
      setError(result.error || 'Unknown error.')
      triggerShake()
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="login-particles" />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <Swords size={28} className="text-system-blue" style={{ filter: 'drop-shadow(0 0 8px #5ad8ff)' }} />
          <h1 className="font-display text-4xl font-black tracking-[.25em] text-white glow-text">
            SOLO<span className="text-system-blue">RISE</span>
          </h1>
          <Swords size={28} className="text-system-blue" style={{ filter: 'drop-shadow(0 0 8px #5ad8ff)', transform: 'scaleX(-1)' }} />
        </div>
        <p className="text-system-blue/50 text-sm font-display tracking-[.2em]">
          LEVEL UP YOUR REAL LIFE
        </p>
      </motion.div>

      {/* Mode tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex gap-1 mb-6 bg-system-panel/50 rounded-lg p-1 border border-system-edge"
      >
        <button
          onClick={() => { setMode('login'); setError('') }}
          className={`flex items-center gap-1.5 px-5 py-2 rounded-md text-sm font-display tracking-wider transition-all duration-300 ${
            mode === 'login'
              ? 'bg-system-blue/20 text-system-glow border border-system-blue/40 shadow-[0_0_12px_rgba(90,216,255,0.15)]'
              : 'text-system-blue/50 border border-transparent hover:text-system-blue/70'
          }`}
        >
          <LogIn size={14} /> LOGIN
        </button>
        <button
          onClick={() => { setMode('register'); setError('') }}
          className={`flex items-center gap-1.5 px-5 py-2 rounded-md text-sm font-display tracking-wider transition-all duration-300 ${
            mode === 'register'
              ? 'bg-system-blue/20 text-system-glow border border-system-blue/40 shadow-[0_0_12px_rgba(90,216,255,0.15)]'
              : 'text-system-blue/50 border border-transparent hover:text-system-blue/70'
          }`}
        >
          <UserPlus size={14} /> REGISTER
        </button>
      </motion.div>

      {/* Form card */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: 1,
          scale: 1,
          x: shake ? [0, -8, 8, -6, 6, -3, 3, 0] : 0
        }}
        transition={{ duration: shake ? 0.5 : 0.5, delay: shake ? 0 : 0.4 }}
        className="sys-panel p-6 w-full max-w-sm space-y-4"
      >
        <h2 className="font-display text-center text-system-blue tracking-[.2em] text-sm mb-1">
          {mode === 'login' ? '⟪ WELCOME BACK, HUNTER ⟫' : '⟪ AWAKEN YOUR POTENTIAL ⟫'}
        </h2>

        {/* Username */}
        <div>
          <label className="block text-xs text-system-blue/60 font-display tracking-wider mb-1">HUNTER NAME</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Enter your name..."
            autoFocus
            className="w-full bg-system-bg border border-system-edge rounded-lg px-3 py-2.5 text-sm text-white outline-none
                       focus:border-system-blue focus:shadow-[0_0_12px_rgba(90,216,255,0.15)] transition-all duration-300
                       placeholder:text-system-blue/30"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs text-system-blue/60 font-display tracking-wider mb-1">PASSWORD</label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-system-bg border border-system-edge rounded-lg px-3 py-2.5 text-sm text-white outline-none
                         focus:border-system-blue focus:shadow-[0_0_12px_rgba(90,216,255,0.15)] transition-all duration-300
                         placeholder:text-system-blue/30 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-system-blue/40 hover:text-system-blue/70 transition-colors"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-red-400 text-xs text-center font-display tracking-wider py-1"
            >
              ⟪ {error} ⟫
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 rounded-lg font-display tracking-[.2em] text-sm transition-all duration-300
                     bg-system-blue/20 border border-system-blue/50 text-system-glow
                     hover:bg-system-blue/30 hover:border-system-blue/70
                     hover:shadow-[0_0_24px_rgba(90,216,255,0.2)]
                     active:scale-[0.98]"
        >
          {mode === 'login' ? '⚔️ ENTER THE GATE' : '🌟 AWAKEN'}
        </button>

        <p className="text-center text-[11px] text-system-blue/40">
          {mode === 'login'
            ? 'New hunter? Switch to Register above.'
            : 'Already awakened? Switch to Login above.'
          }
        </p>
      </motion.form>

      {/* Version */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-[10px] text-system-blue/25 font-display tracking-widest"
      >
        SOLORISE v1.0 — THE SYSTEM AWAITS
      </motion.p>
    </div>
  )
}
