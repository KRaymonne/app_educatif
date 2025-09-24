import React from 'react'
import { 
  Home, 
  BookOpen, 
  BarChart3, 
  Play, 
  Clock, 
  Target, 
  Award,
  TrendingUp,
  Library,
  Save
} from 'lucide-react'

interface AccueilPageProps {
  user: any
  books: any[]
}

export default function AccueilPage({ user, books }: AccueilPageProps) {
  const currentBook = books.find(b => b.title === "Les Quatre Saisons") || books[0]

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Home className="w-8 h-8 text-orange-500" />
          <h1 className="text-3xl font-bold text-gray-900">Mon Espace de Lecture</h1>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Mes Activités d'Aujourd'hui</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-yellow-500" />
              <h3 className="font-semibold text-gray-900">Lecture Recommandée</h3>
            </div>
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">{currentBook.title}</h4>
              <p className="text-sm text-gray-600 mb-4">
                Niveau: {currentBook.level} • Durée: {currentBook.duration}
              </p>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                Commencer la Lecture
              </button>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Continuer ma Lecture</h3>
            </div>
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Les Quatre Saisons</h4>
              <p className="text-sm text-gray-600 mb-2">Progression: 75% terminé • Dernière lecture: hier à 16h30</p>
              <div className="w-full bg-blue-200 rounded-full h-2 mb-4">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                Reprendre
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Mes Progrès Cette Semaine</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-700">Lectures Terminées</h3>
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">3</div>
            <p className="text-sm text-gray-500">Semaine dernière</p>
          </div>
          
          <div className="bg-green-50 rounded-xl p-6 border border-green-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-700">Temps de Lecture</h3>
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">25 min</div>
            <p className="text-sm text-gray-500">Moyenne quotidienne</p>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-700">Score de Précision</h3>
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">89%</div>
            <p className="text-sm text-gray-500">Amélioration</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <TrendingUp className="w-6 h-6 text-orange-500" />
          <h2 className="text-xl font-semibold text-gray-900">Actions Rapides</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white border border-blue-200 rounded-xl p-6 hover:border-blue-300 transition-colors text-left">
            <div className="flex items-center gap-3 mb-2">
              <Library className="w-6 h-6 text-blue-600" />
              <span className="font-medium">Bibliothèque</span>
            </div>
          </button>
          
          <button className="bg-white border border-orange-200 rounded-xl p-6 hover:border-orange-300 transition-colors text-left">
            <div className="flex items-center gap-3 mb-2">
              <Save className="w-6 h-6 text-orange-600" />
              <span className="font-medium">Mes Enregistrements</span>
            </div>
          </button>
          
          <button className="bg-white border border-green-200 rounded-xl p-6 hover:border-green-300 transition-colors text-left">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <span className="font-medium">Mes Progrès</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}