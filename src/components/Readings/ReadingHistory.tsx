import React, { useState, useEffect } from 'react'
import { Play, Pause, TrendingUp, Calendar } from 'lucide-react'
import { apiClient } from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'
import { Reading } from '../../types'

export default function ReadingHistory() {
  const { user } = useAuth()
  const [readings, setReadings] = useState<Reading[]>([])
  const [recordings, setRecordings] = useState<Reading[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchReadings()
      fetchRecordings()
    }
  }, [user])

  const fetchReadings = async () => {
    try {

      const data = await apiClient.getReadings({ completed: true })
      setReadings(data || [])
    } catch (error) {
      console.error('Error fetching readings:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecordings = async () => {
    try {

      const data = await apiClient.getReadings()
      const recordingsData = data.filter(reading => reading.recordingUrl)
      setRecordings(recordingsData || [])
    } catch (error) {
      console.error('Error fetching recordings:', error)
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          🎤 Mes Lectures
        </h1>
      </div>

      {/* Reading History */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          📊 Historique des Lectures
        </h2>

        <div className="space-y-4">
          {readings.map((reading) => (
            <div key={reading.id} className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    📖 {typeof reading.poemId === 'object' ? reading.poemId.title : 'Poème'}
                  </h3>
                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                    <span>Durée: {formatDuration(reading.durationSeconds)}</span>
                    <span>Score: {reading.score}%</span>
                    <span>Mots difficiles: 3</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Progression: Lecture complétée ✅
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-2">
                    {formatDate(reading.createdAt)}
                  </p>
                  <div className="flex items-center justify-end gap-1">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-lg font-bold text-green-600">
                      {reading.score}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {readings.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune lecture terminée pour le moment</p>
            </div>
          )}
        </div>
      </div>

      {/* Recordings */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          🎙️ Mes Enregistrements
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {recordings.map((recording) => (
            <div key={recording.id} className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                🎵 {typeof recording.poemId === 'object' ? recording.poemId.title : 'Poème'}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <span>Enregistré: {formatDate(recording.createdAt)}</span>
                <span>Durée: {formatDuration(recording.durationSeconds)}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span>Qualité: Très bonne 😊</span>
                <span>Améliorations depuis la première fois: +15%</span>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" />
                  🔊 Écouter mon Enregistrement
                </button>
                <button className="px-4 py-2 rounded-lg bg-white border-2 border-blue-200 text-blue-600 hover:border-blue-400 transition-colors">
                  📈 Comparer avec le Modèle
                </button>
              </div>
            </div>
          ))}

          {recordings.length === 0 && (
            <div className="md:col-span-2 text-center py-12 text-gray-500">
              <Play className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucun enregistrement disponible</p>
              <p className="text-sm">Commencez à lire pour créer vos premiers enregistrements!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}