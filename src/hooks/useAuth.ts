import { useState, useEffect } from 'react'
import { apiClient } from '../lib/api'
import { User } from '../types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const userData = await apiClient.getCurrentUser()
      setUser({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        level: userData.level,
        classId: userData.classId,
        createdAt: userData.createdAt
      })
    } catch (error) {
      console.error('Error checking auth status:', error)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password)
      setUser({
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role,
        level: response.user.level,
        classId: response.user.classId,
        createdAt: response.user.createdAt
      })
    } catch (error) {
      throw error
    }
  }

  const signOut = async () => {
    apiClient.logout()
    setUser(null)
  }

  return { user, loading, signIn, signOut }
}