import React from 'react'
import { 
  BarChart3, 
  User, 
  Target, 
  Clock, 
  Award
} from 'lucide-react'

interface RapportsPageProps {
  user: any
}

export default function RapportsPage({ user }: RapportsPageProps) {
  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <BarChart3 className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Rapports et Analyses</h1>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <User className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-900">Progrès Individuels</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-50 rounded-xl p-6 border border-green-100">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">89%</div>
                <div className="text-sm text-gray-600">Score Moyen</div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">120</div>
                <div className="text-sm text-gray-600">minutes</div>
                <div className="text-xs text-gray-500">de lecture</div>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-8 h-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">7</div>
                <div className="text-sm text-gray-600">Lectures</div>
                <div className="text-xs text-gray-500">cette semaine</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des Performances - {user.name}</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-2" />
              <p>Graphique d'évolution des scores</p>
              <p className="text-sm">Progression constante observée</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Statistiques de Classe</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">82%</div>
              <div className="text-sm text-gray-600">Taux de Réussite</div>
              <div className="text-xs text-gray-500">Classe entière</div>
            </div>
          </div>
          
          <div className="bg-red-50 rounded-xl p-6 border border-red-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 mb-2">3</div>
              <div className="text-sm text-gray-600">Élèves en Difficulté</div>
              <div className="text-xs text-gray-500">Besoin d'aide</div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-xl p-6 border border-green-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">94%</div>
              <div className="text-sm text-gray-600">Taux de Progression</div>
              <div className="text-xs text-gray-500">Ce mois</div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">5h</div>
              <div className="text-sm text-gray-600">Temps Moyen</div>
              <div className="text-xs text-gray-500">par semaine</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Rapports Personnalisés</h2>
        
        <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Générer un Rapport</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <select className="px-4 py-3 border border-gray-300 rounded-lg">
              <option>Sélectionner un élève</option>
              <option>{user.name}</option>
              <option>Tous les élèves</option>
            </select>
            <select className="px-4 py-3 border border-gray-300 rounded-lg">
              <option>Période</option>
              <option>Cette semaine</option>
              <option>Ce mois</option>
              <option>Personnalisé</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              📊 Générer Rapport
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              📄 Exporter Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}