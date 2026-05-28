import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Swords, UserPlus, LogIn, Eye, EyeOff, Shield } from 'lucide-react'
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
      {/* Atmospheric background */}
      <div className="login-particles" />

      {/* Shadow energy ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(57,198,255,.1) 0%, rgba(124,58,237,.05) 40%, transparent 70%)',
          boxShadow: '0 0 80px rgba(57,198,255,.05)'
        }}
      />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="text-center mb-8 relative z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}
          className="mx-auto mb-4 w-16 h-16 rounded-full grid place-items-center"
          style={{
            background: 'radial-gradient(circle, rgba(57,198,255,.15), rgba(124,58,237,.08))',
            border: '2px solid rgba(90,216,255,.3)',
            boxShadow: '0 0 30px rgba(90,216,255,.15), inset 0 0 20px rgba(90,216,255,.05)'
          }}
        >
          <Shield size={28} className="text-system-blue" style={{ filter: 'drop-shadow(0 0 8px #5ad8ff)' }} />
        </motion.div>

        <h1 className="font-display text-4xl font-black tracking-[.25em] text-white glow-text">
          SOLO<span className="text-system-blue">RISE</span>
        </h1>
        <p className="text-system-blue/40 text-xs font-display tracking-[.3em] mt-2">
          ⟪ LEVEL UP YOUR REAL LIFE ⟫
        </p>
      </motion.div>

      {/* Mode tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex gap-1 mb-5 p-1 rounded-lg relative z-10"
        style={{
          background: 'rgba(8,15,30,.6)',
          border: '1px solid rgba(57,198,255,.15)'
        }}
      >
        {(['login', 'register'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setError('') }}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-md text-xs font-display tracking-[.15em] transition-all duration-300 ${
              mode === m
                ? 'text-system-glow border border-system-blue/30'
                : 'text-system-blue/40 border border-transparent hover:text-system-blue/60'
            }`}
            style={mode === m ? {
              background: 'rgba(57,198,255,.1)',
              boxShadow: '0 0 12px rgba(90,216,255,.1)'
            } : {}}
          >
            {m === 'login' ? <><LogIn size={13} /> LOGIN</> : <><UserPlus size={13} /> REGISTER</>}
          </button>
        ))}
      </motion.div>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          x: shake ? [0, -8, 8, -6, 6, -3, 3, 0] : 0
        }}
        transition={{ duration: shake ? 0.5 : 0.6, delay: shake ? 0 : 0.6 }}
        className="sys-panel p-6 w-full max-w-sm space-y-4 relative z-10"
      >
        <div className="sys-notice text-center mb-2">
          {mode === 'login' ? '⟪ WELCOME BACK, HUNTER ⟫' : '⟪ AWAKEN YOUR POTENTIAL ⟫'}
        </div>

        <div className="sys-divider" />

        {/* Username */}
        <div>
          <label className="block text-[10px] text-system-blue/50 font-display tracking-[.2em] mb-1.5">HUNTER NAME</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Enter your name..."
            autoFocus
            className="w-full rounded-md px-3 py-2.5 text-sm text-white outline-none transition-all duration-300
                       placeholder:text-system-blue/25"
            style={{
              background: 'rgba(6,12,26,.8)',
              border: '1px solid rgba(57,198,255,.2)',
              boxShadow: 'inset 0 0 10px rgba(0,0,0,.3)',
            }}
            onFocus={e => {
              e.target.style.borderColor = 'rgba(90,216,255,.5)'
              e.target.style.boxShadow = 'inset 0 0 10px rgba(0,0,0,.3), 0 0 12px rgba(90,216,255,.1)'
            }}
            onBlur={e => {
              e.target.style.borderColor = 'rgba(57,198,255,.2)'
              e.target.style.boxShadow = 'inset 0 0 10px rgba(0,0,0,.3)'
            }}
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-[10px] text-system-blue/50 font-display tracking-[.2em] mb-1.5">PASSWORD</label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-md px-3 py-2.5 text-sm text-white outline-none transition-all duration-300
                         placeholder:text-system-blue/25 pr-10"
              style={{
                background: 'rgba(6,12,26,.8)',
                border: '1px solid rgba(57,198,255,.2)',
                boxShadow: 'inset 0 0 10px rgba(0,0,0,.3)',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'rgba(90,216,255,.5)'
                e.target.style.boxShadow = 'inset 0 0 10px rgba(0,0,0,.3), 0 0 12px rgba(90,216,255,.1)'
              }}
              onBlur={e => {
                e.target.style.borderColor = 'rgba(57,198,255,.2)'
                e.target.style.boxShadow = 'inset 0 0 10px rgba(0,0,0,.3)'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-system-blue/30 hover:text-system-blue/60 transition-colors"
            >
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
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
              className="text-red-400 text-xs text-center py-1"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                letterSpacing: '0.1em',
                textShadow: '0 0 8px rgba(255,77,109,.3)'
              }}
            >
              ⟪ {error} ⟫
            </motion.div>
          )}
        </AnimatePresence>

        <div className="sys-divider" />

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 rounded-md font-display tracking-[.15em] text-sm transition-all duration-300
                     text-system-glow active:scale-[0.97]"
          style={{
            background: 'linear-gradient(135deg, rgba(57,198,255,.15), rgba(124,58,237,.1))',
            border: '1px solid rgba(90,216,255,.35)',
            boxShadow: '0 0 20px rgba(90,216,255,.1), inset 0 1px 0 rgba(90,216,255,.15)',
          }}
          onMouseEnter={e => {
            (e.target as HTMLElement).style.boxShadow = '0 0 30px rgba(90,216,255,.2), inset 0 1px 0 rgba(90,216,255,.2)'
            ;(e.target as HTMLElement).style.borderColor = 'rgba(90,216,255,.5)'
          }}
          onMouseLeave={e => {
            (e.target as HTMLElement).style.boxShadow = '0 0 20px rgba(90,216,255,.1), inset 0 1px 0 rgba(90,216,255,.15)'
            ;(e.target as HTMLElement).style.borderColor = 'rgba(90,216,255,.35)'
          }}
        >
          {mode === 'login' ? '⚔️ ENTER THE GATE' : '🌟 AWAKEN'}
        </button>

        <p className="text-center text-[10px] text-system-blue/30 font-display tracking-wider">
          {mode === 'login'
            ? 'NEW HUNTER? SWITCH TO REGISTER'
            : 'ALREADY AWAKENED? SWITCH TO LOGIN'
          }
        </p>
      </motion.form>

      {/* Version */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-8 text-[9px] text-system-blue/20 font-display tracking-[.3em] relative z-10"
      >
        THE SYSTEM AWAITS
      </motion.p>
    </div>
  )
}
