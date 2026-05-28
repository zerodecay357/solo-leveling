import { AnimatePresence, motion } from 'framer-motion'
import { Crown } from 'lucide-react'

export default function LevelUpOverlay({ level, onDone }: { level: number | null; onDone: () => void }) {
  return (
    <AnimatePresence>
      {level !== null && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onDone}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'radial-gradient(circle at 50% 40%, rgba(57,198,255,.08), rgba(0,0,0,.85))' }}
        >
          {/* Outer energy ring */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 12 }}
            className="absolute w-72 h-72 rounded-full"
            style={{
              border: '2px solid rgba(90,216,255,.15)',
              boxShadow: '0 0 60px rgba(90,216,255,.1), inset 0 0 60px rgba(124,58,237,.05)'
            }}
          />

          <motion.div
            initial={{ scale: .5, y: 40 }} animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 14 }}
            className="sys-panel px-12 py-10 text-center level-up-glow"
          >
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Crown size={28} className="mx-auto mb-2 text-system-gold" style={{ filter: 'drop-shadow(0 0 8px rgba(251,191,36,.5))' }} />
            </motion.div>

            <div className="sys-notice mb-2">⟪ SYSTEM NOTICE ⟫</div>

            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.8, 1.1, 1] }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="font-display text-4xl font-black text-white glow-text my-3"
            >
              LEVEL UP!
            </motion.div>

            <div className="sys-divider" />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-display text-xl text-system-glow mt-3"
            >
              Level <span className="text-white font-black text-2xl">{level}</span> reached
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-system-blue/40 text-xs mt-5 font-display tracking-widest"
            >
              TAP TO CONTINUE
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
