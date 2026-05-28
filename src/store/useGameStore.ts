import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
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
  _userId: string           // tracks which user this store belongs to
  // actions
  setName: (n: string) => void
  addQuest: (q: Partial<Quest>) => Quest
  editQuest: (id: string, patch: Partial<Quest>) => void
  deleteQuest: (id: string) => void
  completeQuest: (id: string) => number   // returns levelUps
  touchLogin: () => void
  loadUser: (username: string) => void
}

const todayStr = () => new Date().toISOString().slice(0, 10)
const dayName = () => DAYS[new Date().getDay()]
function isYesterday(iso?: string) {
  if (!iso) return false
  const d = new Date(iso); const y = new Date(); y.setDate(y.getDate() - 1)
  return d.toISOString().slice(0, 10) === y.toISOString().slice(0, 10)
}

// Per-user save/load helpers
function saveUserData(username: string, data: Partial<GameState>) {
  const key = `solorise-save-${username}`
  const existing = JSON.parse(localStorage.getItem(key) || '{}')
  localStorage.setItem(key, JSON.stringify({ ...existing, ...data }))
}

function loadUserData(username: string): Partial<GameState> | null {
  const key = `solorise-save-${username}`
  const raw = localStorage.getItem(key)
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

const defaultState = {
  name: 'Player',
  level: 1,
  xp: 0,
  quests: [] as Quest[],     // Start empty — user sets quests via chatbot
  loginStreak: 1,
  freezesLeft: 2,
  _userId: '',
}

export const useGameStore = create<GameState>()(
  (set, get) => ({
    ...defaultState,

    setName: (n) => {
      set({ name: n })
      const uid = get()._userId
      if (uid) saveUserData(uid, { name: n })
    },

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
      const newQuests = [...get().quests, quest]
      set({ quests: newQuests })
      const uid = get()._userId
      if (uid) saveUserData(uid, { quests: newQuests })
      return quest
    },

    editQuest: (id, patch) => {
      const newQuests = get().quests.map(q => q.id === id ? { ...q, ...patch } : q)
      set({ quests: newQuests })
      const uid = get()._userId
      if (uid) saveUserData(uid, { quests: newQuests })
    },

    deleteQuest: (id) => {
      const newQuests = get().quests.filter(q => q.id !== id)
      set({ quests: newQuests })
      const uid = get()._userId
      if (uid) saveUserData(uid, { quests: newQuests })
    },

    completeQuest: (id) => {
      const q = get().quests.find(x => x.id === id)
      if (!q || q.lastCompleted === todayStr()) return 0
      const newStreak = isYesterday(q.lastCompleted) ? q.streak + 1 : 1
      const { level, xp, levelUps } = applyXp(get().level, get().xp, q.xpReward)
      const newQuests = get().quests.map(x => x.id === id
        ? { ...x, lastCompleted: todayStr(), streak: newStreak, longest: Math.max(x.longest, newStreak) }
        : x)
      set({ level, xp, quests: newQuests })
      const uid = get()._userId
      if (uid) saveUserData(uid, { level, xp, quests: newQuests })
      return levelUps
    },

    touchLogin: () => {
      const last = get().lastLogin
      if (last === todayStr()) return
      const streak = isYesterday(last) ? get().loginStreak + 1 : 1
      set({ lastLogin: todayStr(), loginStreak: streak })
      const uid = get()._userId
      if (uid) saveUserData(uid, { lastLogin: todayStr(), loginStreak: streak })
    },

    loadUser: (username) => {
      const saved = loadUserData(username)
      if (saved) {
        set({
          name: saved.name || username,
          level: saved.level ?? 1,
          xp: saved.xp ?? 0,
          quests: saved.quests ?? [],
          loginStreak: saved.loginStreak ?? 1,
          lastLogin: saved.lastLogin,
          freezesLeft: saved.freezesLeft ?? 2,
          _userId: username,
        })
      } else {
        // Brand new user — start fresh
        set({
          ...defaultState,
          name: username,
          _userId: username,
        })
        saveUserData(username, { ...defaultState, name: username, _userId: username })
      }
    }
  })
)

// selectors / helpers used by UI
export const activeToday = (q: Quest) => q.days.length === 0 || q.days.includes(dayName())
export const isDoneToday = (q: Quest) => q.lastCompleted === todayStr()
export { rankForLevel, xpToNext, dayName, todayStr }
