import React from 'react'
import { 
  BookOpen, 
  BarChart3, 
  Save, 
  Award,
  Volume2
} from 'lucide-react'

interface LecturesPageProps {
  books: any[]
}

export default function LecturesPage({ books }: LecturesPageProps) {
  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <BookOpen className="w-8 h-8 text-purple-600" />
        <h1 className="text-3xl font-bold text-gray-900">Mes Lectures</h1>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Historique des Lectures</h2>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Le Jardin Enchanté</h3>
                  <p className="text-sm text-gray-600">Aujourd'hui 14h30</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600 mb-1">Score</div>
                <div className="text-2xl font-bold text-green-600">89%</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-4">
              Durée: 3m 45s • Score: 89% • Mots difficiles: 3<br/>
              Progression: Lecture complétée ✅
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">L'Oiseau Voyageur</h3>
                  <p className="text-sm text-gray-600">Hier 16h15</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600 mb-1">Score</div>
                <div className="text-2xl font-bold text-blue-600">76%</div>
                <div className="text-sm text-blue-600">📈</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-4">
              Durée: 5m 20s • Score: 76% • Mots difficiles: 7<br/>
              Progression: En cours... 75% 📚
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Save className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">Mes Enregistrements</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
            <div className="flex items-center gap-3 mb-4">
              <Volume2 className="w-6 h-6 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Le Jardin Enchanté</h3>
            </div>
            <div className="text-sm text-gray-600 mb-4">
              Enregistré: Aujourd'hui 14h30<br/>
              Durée: 3m 45s<br/>
              Qualité: Très bonne 🎯<br/>
              Améliorations depuis la première fois: +15%
            </div>
            <div className="flex gap-3">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                🔊 Écouter mon Enregistrement
              </button>
              <button className="px-4 py-2 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
                📊 Comparer avec le Modèle
              </button>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
            <div className="flex items-center gap-3 mb-4">
              <Volume2 className="w-6 h-6 text-yellow-600" />
              <h3 className="font-semibold text-gray-900">Mon Meilleur Ami</h3>
            </div>
            <div className="text-sm text-gray-600 mb-4">
              Enregistré: Il y a 3 jours<br/>
              Durée: 2m 55s<br/>
              Qualité: Bonne 📈<br/>
              Première tentative avec ce poème
            </div>
            <div className="flex gap-3">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                🔊 Écouter mon Enregistrement
              </button>
              <button className="px-4 py-2 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                🎙️ Enregistrer à Nouveau
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}