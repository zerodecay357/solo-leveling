export type Rank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S'

export function rankForLevel(level: number): Rank {
  if (level >= 55) return 'S'
  if (level >= 35) return 'A'
  if (level >= 20) return 'B'
  if (level >= 10) return 'C'
  if (level >= 5) return 'D'
  return 'E'
}

export const rankColor: Record<Rank, string> = {
  E: '#7d8590', D: '#3fb950', C: '#39c6ff',
  B: '#a371f7', A: '#f0883e', S: '#ff4d6d'
}

export function xpToNext(level: number): number {
  return Math.round(100 * level * 1.25)
}

export const DIFFICULTY_XP: Record<string, number> = {
  Easy: 15, Medium: 30, Hard: 60, Boss: 120
}

export function applyXp(level: number, xp: number, gained: number) {
  let lv = level, cur = xp + gained, ups = 0
  while (cur >= xpToNext(lv)) { cur -= xpToNext(lv); lv += 1; ups += 1 }
  return { level: lv, xp: cur, levelUps: ups }
}
