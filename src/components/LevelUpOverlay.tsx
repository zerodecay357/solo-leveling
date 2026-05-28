import { AnimatePresence, motion } from 'framer-motion'

export default function LevelUpOverlay({ level, onDone }: { level: number | null; onDone: () => void }) {
  return (
    <AnimatePresence>
      {level !== null && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onDone}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: .6, y: 30 }} animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 16 }}
            className="sys-panel px-10 py-8 text-center"
          >
            <div className="font-display text-system-blue/70 tracking-[.4em] text-sm">⟪ NOTICE ⟫</div>
            <div className="font-display text-4xl font-black text-white glow-text my-3">LEVEL UP!</div>
            <div className="font-display text-2xl text-system-glow">You reached Level {level}</div>
            <div className="text-system-blue/50 text-xs mt-4">tap to continue</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
