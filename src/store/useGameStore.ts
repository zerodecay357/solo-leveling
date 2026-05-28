import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { rankForLevel, xpToNext, applyXp, DIFFICULTY_XP } from '../lib/ranks'

export type Category = 'gym' | 'looksmaxing' | 'study' | 'cardio' | 'mind' | 'custom'
export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Boss'
export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export interface Quest {
  id: string
  title: string
  category: Category
  difficulty: Difficulty
  xpReward: number
  days: string[]            // e.g. ['Mon','Wed'] ; empty = every day
  timeStart?: string        // '17:00'
  timeEnd?: string          // '18:00'
  lastCompleted?: string    // ISO date 'YYYY-MM-DD'
  streak: number
  longest: number
}

interface GameState {
  name: string
  level: number
  xp: number
  quests: Quest[]
  loginStreak: number
  lastLogin?: string
  freezesLeft: number
  // actions
  setName: (n: string) => void
  addQuest: (q: Partial<Quest>) => Quest
  editQuest: (id: string, patch: Partial<Quest>) => void
  deleteQuest: (id: string) => void
  completeQuest: (id: string) => number   // returns levelUps
  touchLogin: () => void
}

const todayStr = () => new Date().toISOString().slice(0, 10)
const dayName = () => DAYS[new Date().getDay()]
function isYesterday(iso?: string) {
  if (!iso) return false
  const d = new Date(iso); const y = new Date(); y.setDate(y.getDate() - 1)
  return d.toISOString().slice(0, 10) === y.toISOString().slice(0, 10)
}

const seedQuests: Quest[] = [
  { id: 'q_gym', title: 'Gym Session', category: 'gym', difficulty: 'Hard', xpReward: 60, days: ['Mon','Wed','Fri','Sat'], streak: 0, longest: 0 },
  { id: 'q_swim', title: 'Swimming', category: 'cardio', difficulty: 'Medium', xpReward: 30, days: ['Tue','Thu','Fri'], timeStart: '17:00', timeEnd: '18:00', streak: 0, longest: 0 },
  { id: 'q_skin', title: 'Looksmaxing Routine (skincare + grooming)', category: 'looksmaxing', difficulty: 'Easy', xpReward: 15, days: [], streak: 0, longest: 0 },
  { id: 'q_posture', title: 'Posture / Mewing Check', category: 'looksmaxing', difficulty: 'Easy', xpReward: 15, days: [], streak: 0, longest: 0 },
  { id: 'q_study', title: 'Deep Study Block', category: 'study', difficulty: 'Hard', xpReward: 60, days: [], streak: 0, longest: 0 }
]

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      name: 'Player',
      level: 1,
      xp: 0,
      quests: seedQuests,
      loginStreak: 1,
      freezesLeft: 2,

      setName: (n) => set({ name: n }),

      addQuest: (q) => {
        const diff = (q.difficulty || 'Easy') as Difficulty
        const quest: Quest = {
          id: 'q_' + Math.random().toString(36).slice(2, 9),
          title: q.title || 'New Quest',
          category: (q.category || 'custom') as Category,
          difficulty: diff,
          xpReward: q.xpReward ?? DIFFICULTY_XP[diff],
          days: q.days || [],
          timeStart: q.timeStart,
          timeEnd: q.timeEnd,
          streak: 0, longest: 0
        }
        set({ quests: [...get().quests, quest] })
        return quest
      },

      editQuest: (id, patch) =>
        set({ quests: get().quests.map(q => q.id === id ? { ...q, ...patch } : q) }),

      deleteQuest: (id) =>
        set({ quests: get().quests.filter(q => q.id !== id) }),

      completeQuest: (id) => {
        const q = get().quests.find(x => x.id === id)
        if (!q || q.lastCompleted === todayStr()) return 0
        const newStreak = isYesterday(q.lastCompleted) ? q.streak + 1 : 1
        const { level, xp, levelUps } = applyXp(get().level, get().xp, q.xpReward)
        set({
          level, xp,
          quests: get().quests.map(x => x.id === id
            ? { ...x, lastCompleted: todayStr(), streak: newStreak, longest: Math.max(x.longest, newStreak) }
            : x)
        })
        return levelUps
      },

      touchLogin: () => {
        const last = get().lastLogin
        if (last === todayStr()) return
        const streak = isYesterday(last) ? get().loginStreak + 1 : 1
        set({ lastLogin: todayStr(), loginStreak: streak })
      }
    }),
    { name: 'solorise-save' }
  )
)

// selectors / helpers used by UI
export const activeToday = (q: Quest) => q.days.length === 0 || q.days.includes(dayName())
export const isDoneToday = (q: Quest) => q.lastCompleted === todayStr()
export { rankForLevel, xpToNext, dayName, todayStr }
