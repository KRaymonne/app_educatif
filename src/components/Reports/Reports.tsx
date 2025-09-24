import React, { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Award,
  Calendar
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

export default function Reports() {
  const { user } = useAuth()
  const [performanceData, setPerformanceData] = useState<any[]>([])
  const [classStats, setClassStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchReportsData()
    }
  }, [user])

  const fetchReportsData = async () => {
    try {
      // Mock data for demonstration
      setPerformanceData([
        { week: 'Semaine 1', score: 65, difficulty: 70 },
        { week: 'Semaine 2', score: 72, difficulty: 68 },
        { week: 'Semaine 3', score: 78, difficulty: 75 },
        { week: 'Semaine 4', score: 85, difficulty: 82 }
      ])

      setClassStats({
        averageImprovement: 82,
        studentsAtRisk: 3,
        totalAssignments: 94
      })
    } catch (error) {
      console.error('Error fetching reports data:', error)
    } finally {
      setLoading(false)
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
          📊 Rapports et Analyses
        </h1>
      </div>

      {/* Individual Progress */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          👤 Progrès Individuels
        </h2>

        {/* Performance Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-700 mb-1">Métriques de Performance - Emma Martin</h3>
            <p className="text-2xl font-bold text-green-600 mb-1">89%</p>
            <p className="text-sm text-gray-500">+2.5% cette semaine</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-700 mb-1">Temps Passé</h3>
            <p className="text-2xl font-bold text-blue-600 mb-1">120 minutes</p>
            <p className="text-sm text-gray-500">+15 minutes</p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-3">
              <Award className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-medium text-gray-700 mb-1">Niveau Atteint</h3>
            <p className="text-2xl font-bold text-orange-600 mb-1">7% le 35 min</p>
            <p className="text-sm text-gray-500">24.5 au min</p>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Évolution des Performances - Emma Martin
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#3B82F6" 
                strokeWidth={3}
                name="Score de Précision (%)"
              />
              <Line 
                type="monotone" 
                dataKey="difficulty" 
                stroke="#10B981" 
                strokeWidth={3}
                name="Niveau atteint (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Class Statistics (for teachers) */}
      {user?.role === 'teacher' && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            📈 Statistiques de Classe
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-700 mb-1">Moyenne Classe</h3>
              <p className="text-2xl font-bold text-blue-600 mb-1">82%</p>
              <p className="text-sm text-gray-500">25 élèves actifs</p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-3">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-medium text-gray-700 mb-1">Élèves en Difficulté</h3>
              <p className="text-2xl font-bold text-red-600 mb-1">3</p>
              <p className="text-sm text-gray-500">Nécessitent attention</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-700 mb-1">Devoirs Terminés</h3>
              <p className="text-2xl font-bold text-green-600 mb-1">94%</p>
              <p className="text-sm text-gray-500">Cette semaine</p>
            </div>
          </div>
        </div>
      )}

      {/* Custom Reports */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          📋 Rapports Personnalisés
        </h2>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Générer un Rapport
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de rapport
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Sélectionner le type</option>
                <option>Rapport de progression</option>
                <option>Analyse des difficultés</option>
                <option>Comparaison de classe</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Période
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Cette semaine</option>
                <option>Ce mois</option>
                <option>Ce trimestre</option>
                <option>Personnalisé</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              📊 Générer Rapport
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              📄 Exporter Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}