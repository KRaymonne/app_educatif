import React, { useState, useEffect } from 'react'
import { 
  BookOpen, 
  Clock, 
  Target, 
  TrendingUp,
  Play,
  ArrowRight,
  Star,
  Calendar
} from 'lucide-react'
import { apiClient } from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'
import { Reading, Poem, Progress } from '../../types'

export default function Dashboard() {
  const { user } = useAuth()
  const [recommendedPoem, setRecommendedPoem] = useState<Poem | null>(null)
  const [currentReading, setCurrentReading] = useState<Reading | null>(null)
  const [weekProgress, setWeekProgress] = useState<Progress | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      // Fetch recommended poems
      const poems = await apiClient.getPoems({ 
        level: user?.level || 'debutant' 
      })

      if (poems.length > 0) {
        setRecommendedPoem(poems[0])
      }

      // Fetch current readings
      const readings = await apiClient.getReadings({ completed: false })

      if (readings.length > 0) {
        setCurrentReading(readings[0])
      }

      // Fetch current week progress
      const progress = await apiClient.getCurrentProgress()

      if (progress) {
        setWeekProgress(progress)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const startReading = async (poemId: string) => {
    try {
      const data = await apiClient.createReading({
        poemId,
        completed: false,
        score: 0,
        durationSeconds: 0
      })
      
      // Navigate to reading interface
      console.log('Starting reading:', data)
    } catch (error) {
      console.error('Error starting reading:', error)
    }
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
          <BookOpen className="w-6 h-6 text-blue-600" />
          Mon Espace de Lecture
        </h1>
        <p className="text-gray-600">Bonjour {user?.name}! Continuons votre parcours de lecture.</p>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-green-600" />
          Mes Activités d'Aujourd'hui
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Lecture Recommandée */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-orange-500" />
              <h3 className="font-semibold text-gray-800">Lecture Recommandée</h3>
            </div>
            
            {recommendedPoem ? (
              <div>
                <h4 className="font-medium text-gray-800 mb-2">{recommendedPoem.title}</h4>
                <p className="text-sm text-gray-600 mb-1">
                  {recommendedPoem.author} • Niveau: {recommendedPoem.level} • 
                  Durée: {recommendedPoem.durationMinutes} minutes
                </p>
                <button
                  onClick={() => startReading(recommendedPoem.id)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mt-4"
                >
                  <Play className="w-4 h-4" />
                  Commencer la Lecture
                </button>
              </div>
            ) : (
              <p className="text-gray-500 italic">Aucune recommandation disponible</p>
            )}
          </div>

          {/* Continuer ma Lecture */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-gray-800">Continuer ma Lecture</h3>
            </div>
            
            {currentReading ? (
              <div>
                <h4 className="font-medium text-gray-800 mb-2">
                  {typeof currentReading.poemId === 'object' ? currentReading.poemId.title : 'Poème'}
                </h4>
                <p className="text-sm text-gray-600 mb-1">
                  Progression: 75% terminé • Dernière lecture: hier à 16h30
                </p>
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mt-4">
                  <ArrowRight className="w-4 h-4" />
                  Reprendre
                </button>
              </div>
            ) : (
              <p className="text-gray-500 italic">Aucune lecture en cours</p>
            )}
          </div>
        </div>
      </div>

      {/* Mes Progrès Cette Semaine */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          Mes Progrès Cette Semaine
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-700 mb-1">Lectures Terminées</h3>
            <p className="text-2xl font-bold text-blue-600 mb-1">
              {weekProgress?.readingsCompleted || 0}
            </p>
            <p className="text-sm text-gray-500">Semaine dernière</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-700 mb-1">Temps de Lecture</h3>
            <p className="text-2xl font-bold text-green-600 mb-1">
              {weekProgress?.totalTimeMinutes || 25} min
            </p>
            <p className="text-sm text-gray-500">Moyenne quotidienne</p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-700 mb-1">Score de Précision</h3>
            <p className="text-2xl font-bold text-purple-600 mb-1">
              {weekProgress?.averageScore || 85}%
            </p>
            <p className="text-sm text-gray-500">Score moyen</p>
          </div>
        </div>
      </div>

      {/* Actions Rapides */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-600" />
          Actions Rapides
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          <button className="bg-white border-2 border-blue-200 hover:border-blue-400 rounded-xl p-6 text-center transition-colors group">
            <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-medium text-gray-800">Bibliothèque</h3>
          </button>

          <button className="bg-white border-2 border-orange-200 hover:border-orange-400 rounded-xl p-6 text-center transition-colors group">
            <Mic className="w-8 h-8 text-orange-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-medium text-gray-800">Mes Enregistrements</h3>
          </button>

          <button className="bg-white border-2 border-green-200 hover:border-green-400 rounded-xl p-6 text-center transition-colors group">
            <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-medium text-gray-800">Mes Progrès</h3>
          </button>
        </div>
      </div>
    </div>
  )
}