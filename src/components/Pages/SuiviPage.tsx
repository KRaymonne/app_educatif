import React from 'react'
import { 
  Users, 
  BarChart3, 
  TrendingUp, 
  BookOpen, 
  User, 
  Plus, 
  Download
} from 'lucide-react'

export default function SuiviPage() {
  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Users className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Suivi de Classe</h1>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Vue d'Ensemble de la Classe</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-gray-600">Élèves Actifs</div>
                <div className="text-xs text-gray-500">Cette semaine</div>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-xl p-6 border border-green-100">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">0%</div>
                <div className="text-sm text-gray-600">Progression Moyenne</div>
                <div className="text-xs text-gray-500">Amélioration</div>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-8 h-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-600">0</div>
                <div className="text-sm text-gray-600">Lectures Totales</div>
                <div className="text-xs text-gray-500">Cette semaine</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <User className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-900">Gestion des Élèves</h2>
        </div>
        
        <div className="flex gap-4 mb-6">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Ajouter un Élève
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exporter les Progrès
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Nom, prénom ou classe..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option>Tous les niveaux</option>
            <option>Débutant</option>
            <option>Intermédiaire</option>
            <option>Avancé</option>
          </select>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-7 gap-4 text-sm font-medium text-gray-700">
              <div>ID</div>
              <div>PHOTO</div>
              <div>NAME</div>
              <div>EMAIL</div>
              <div>DATE</div>
              <div>MOBILE_NUMBER</div>
              <div>INTEREST</div>
            </div>
          </div>
          <div className="p-12 text-center text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No data</p>
            <p className="text-sm">Aucun élève n'a été ajouté pour le moment.</p>
          </div>
        </div>
      </div>
    </div>
  )
}