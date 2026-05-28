const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787'

export interface ChatTurn { role: 'user' | 'assistant'; content: string }
export interface ToolCall { name: string; input: any }

export interface ChatResult {
  reply: string
  toolCalls: ToolCall[]
}

// Sends conversation + current quest config to the backend, which talks to Claude.
export async function sendToSystem(
  history: ChatTurn[],
  questConfig: unknown
): Promise<ChatResult> {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ history, questConfig })
  })
  if (!res.ok) throw new Error(`System offline (${res.status})`)
  return res.json()
}
