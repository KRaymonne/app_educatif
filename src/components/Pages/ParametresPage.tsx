import React from 'react'
import { 
  User, 
  Eye, 
  Save
} from 'lucide-react'

interface ParametresPageProps {
  user: any
}

export default function ParametresPage({ user }: ParametresPageProps) {
  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <User className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Profil Utilisateur</h1>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Informations Personnelles</h2>
        
        <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
              <input
                type="text"
                defaultValue="votre prénom"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
              <input
                type="text"
                defaultValue="votre nom de famille"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Adresse email</label>
              <input
                type="email"
                defaultValue="votre.email@ecole.fr"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Classe/Établissement</label>
              <input
                type="text"
                defaultValue="CE2-A, École primaire..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>Enseignant</option>
              <option>Élève</option>
              <option>Parent</option>
              <option>Administrateur</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              💾 Sauvegarder
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              🔐 Changer le Mot de Passe
            </button>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Eye className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Paramètres d'Accessibilité</h2>
        </div>
        
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Options d'Adaptation</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Taille de police</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Normale</option>
                <option>Grande</option>
                <option>Très grande</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraste</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Standard</option>
                <option>Élevé</option>
                <option>Très élevé</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vitesse de lecture TTS</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Normale</option>
                <option>Lente</option>
                <option>Rapide</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Volume audio</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Moyen</option>
                <option>Faible</option>
                <option>Fort</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
              <span className="text-sm text-gray-700">Aides visuelles (surlignage, guides de lecture)</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
              <span className="text-sm text-gray-700">Descriptions audio des éléments visuels</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
              <span className="text-sm text-gray-700">Interface simplifiée (moins d'éléments à l'écran)</span>
            </label>
          </div>

          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            🔧 Appliquer les Paramètres d'Accessibilité
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuration Système</h2>
        
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Paramètres Administrateur</h3>
          
          <div className="space-y-4 mb-6">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded" />
              <span className="text-sm text-gray-700">Sauvegarde automatique des données d'élèves</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded" />
              <span className="text-sm text-gray-700">Collecte des statistiques d'usage (anonymisées)</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              💾 Sauvegarder
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              📥 Sauvegarder Données
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}