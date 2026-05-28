import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserProfile {
  username: string
  passwordHash: string   // simple hash for localStorage auth
  createdAt: string
}

interface AuthState {
  currentUser: string | null    // username of logged-in user
  users: UserProfile[]          // all registered users
  register: (username: string, password: string) => { ok: boolean; error?: string }
  login:    (username: string, password: string) => { ok: boolean; error?: string }
  logout:   () => void
}

// Simple hash — NOT cryptographically secure, but fine for localStorage-only auth
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + ch
    hash |= 0
  }
  return 'h_' + Math.abs(hash).toString(36)
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],

      register: (username, password) => {
        const trimmed = username.trim()
        if (!trimmed) return { ok: false, error: 'Username cannot be empty.' }
        if (trimmed.length < 3) return { ok: false, error: 'Username must be at least 3 characters.' }
        if (!password || password.length < 4) return { ok: false, error: 'Password must be at least 4 characters.' }

        const existing = get().users.find(u => u.username.toLowerCase() === trimmed.toLowerCase())
        if (existing) return { ok: false, error: 'Hunter name already taken.' }

        const profile: UserProfile = {
          username: trimmed,
          passwordHash: simpleHash(password),
          createdAt: new Date().toISOString()
        }

        set({
          users: [...get().users, profile],
          currentUser: trimmed
        })
        return { ok: true }
      },

      login: (username, password) => {
        const trimmed = username.trim()
        const user = get().users.find(u => u.username.toLowerCase() === trimmed.toLowerCase())
        if (!user) return { ok: false, error: 'Hunter not found. Register first.' }
        if (user.passwordHash !== simpleHash(password)) return { ok: false, error: 'Wrong password.' }

        set({ currentUser: user.username })
        return { ok: true }
      },

      logout: () => {
        set({ currentUser: null })
      }
    }),
    { name: 'solorise-auth' }
  )
)
