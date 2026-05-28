import SystemChat from '../components/SystemChat'

export default function ChatScreen() {
  return (
    <div className="h-[calc(100vh-9rem)] flex flex-col">
      <h2 className="font-display text-system-blue tracking-widest text-sm mb-2">⟪ THE SYSTEM ⟫</h2>
      <div className="flex-1 min-h-0"><SystemChat /></div>
    </div>
  )
}
