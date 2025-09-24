export interface User {
  id: string
  email: string
  name: string
  role: 'student' | 'teacher' | 'admin'
  level?: string
  classId?: string
  createdAt: string
}

export interface Poem {
  id: string
  title: string
  author: string
  content: string
  theme: string
  level: 'debutant' | 'intermediaire' | 'avance'
  difficulty: 'facile' | 'moyen' | 'difficile'
  durationMinutes: number
  createdAt: string
}

export interface Reading {
  id: string
  userId: string
  poemId: string | Poem
  score: number
  durationSeconds: number
  completed: boolean
  recordingUrl?: string
  feedback?: string
  createdAt: string
}

export interface Favorite {
  id: string
  userId: string
  poemId: string | Poem
  createdAt: string
}

export interface Progress {
  id: string
  userId: string
  weekStart: string
  readingsCompleted: number
  totalTimeMinutes: number
  averageScore: number
  improvementPercentage: number
  createdAt: string
}