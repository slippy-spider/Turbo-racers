export interface Car {
  id: string
  name: string
  color: string
  speed: number
  acceleration: number
  handling: number
  unlocked: boolean
  unlockMission: number
  emoji: string
}

export interface Mission {
  id: number
  name: string
  description: string
  target: number
  type: 'score' | 'distance' | 'time'
  reward: number
  completed: boolean
}

export const CARS: Car[] = [
  {
    id: 'starter',
    name: 'Street Runner',
    color: '#ef4444',
    speed: 5,
    acceleration: 6,
    handling: 7,
    unlocked: true,
    unlockMission: 0,
    emoji: '🚗'
  },
  {
    id: 'racer',
    name: 'Turbo Racer',
    color: '#3b82f6',
    speed: 7,
    acceleration: 7,
    handling: 6,
    unlocked: false,
    unlockMission: 1,
    emoji: '🏎️'
  },
  {
    id: 'muscle',
    name: 'Muscle Beast',
    color: '#f59e0b',
    speed: 8,
    acceleration: 5,
    handling: 5,
    unlocked: false,
    unlockMission: 2,
    emoji: '🚙'
  },
  {
    id: 'sport',
    name: 'Sport GT',
    color: '#10b981',
    speed: 6,
    acceleration: 8,
    handling: 8,
    unlocked: false,
    unlockMission: 3,
    emoji: '🚕'
  },
  {
    id: 'super',
    name: 'Supercar X',
    color: '#8b5cf6',
    speed: 9,
    acceleration: 8,
    handling: 7,
    unlocked: false,
    unlockMission: 4,
    emoji: '🏁'
  },
  {
    id: 'hyper',
    name: 'Hyper Velocity',
    color: '#ec4899',
    speed: 10,
    acceleration: 9,
    handling: 6,
    unlocked: false,
    unlockMission: 5,
    emoji: '⚡'
  },
  {
    id: 'legend',
    name: 'Legend One',
    color: '#06b6d4',
    speed: 9,
    acceleration: 9,
    handling: 9,
    unlocked: false,
    unlockMission: 6,
    emoji: '🔥'
  },
  {
    id: 'ultimate',
    name: 'Ultimate Fury',
    color: '#f97316',
    speed: 10,
    acceleration: 10,
    handling: 10,
    unlocked: false,
    unlockMission: 7,
    emoji: '👑'
  }
]

export const MISSIONS: Mission[] = [
  {
    id: 1,
    name: 'First Blood',
    description: 'Score 500 points in a single race',
    target: 500,
    type: 'score',
    reward: 100,
    completed: false
  },
  {
    id: 2,
    name: 'Road Warrior',
    description: 'Score 1,500 points in a single race',
    target: 1500,
    type: 'score',
    reward: 250,
    completed: false
  },
  {
    id: 3,
    name: 'Speed Demon',
    description: 'Score 3,000 points in a single race',
    target: 3000,
    type: 'score',
    reward: 500,
    completed: false
  },
  {
    id: 4,
    name: 'Track Master',
    description: 'Score 5,000 points in a single race',
    target: 5000,
    type: 'score',
    reward: 750,
    completed: false
  },
  {
    id: 5,
    name: 'Elite Racer',
    description: 'Score 8,000 points in a single race',
    target: 8000,
    type: 'score',
    reward: 1000,
    completed: false
  },
  {
    id: 6,
    name: 'Champion',
    description: 'Score 12,000 points in a single race',
    target: 12000,
    type: 'score',
    reward: 1500,
    completed: false
  },
  {
    id: 7,
    name: 'Legend',
    description: 'Score 18,000 points in a single race',
    target: 18000,
    type: 'score',
    reward: 2000,
    completed: false
  }
]
