import React from 'react'
import { 
  Library, 
  Search, 
  BookOpen, 
  Heart
} from 'lucide-react'

interface BibliothequePageProps {
  books: any[]
}

export default function BibliotequePage({ books }: BibliothequeProps) {
  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <Library className="w-8 h-8 text-green-600" />
        <h1 className="text-3xl font-bold text-gray-900">Bibliothèque de Poèmes</h1>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Taper le titre, l'auteur ou un mot-clé..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option>Tous les niveaux</option>
          <option>Débutant</option>
          <option>Intermédiaire</option>
          <option>Avancé</option>
        </select>
        <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option>Tous les thèmes</option>
          <option>Nature</option>
          <option>Aventure</option>
          <option>Amitié</option>
          <option>Imagination</option>
        </select>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Tous les Poèmes</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {books.slice(0, 3).map((book) => (
            <div key={book.id} className="bg-orange-50 rounded-xl p-6 border border-orange-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{book.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">par {book.author}</p>
                </div>
                {book.progress > 0 && <div className="text-right">
                  <div className="text-sm font-medium text-green-600 mb-1">
                    {book.progress === 100 ? 'Terminé' : `${book.progress}%`}
                  </div>
                </div>}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Thème: {book.theme}
                </span>
                <span>Niveau: {book.level}</span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span>Durée: {book.duration}</span>
                <span>Difficulté: {book.difficulty}</span>
              </div>
              
              <p className="text-sm text-gray-700 mb-4">{book.description}</p>
              
              <div className="flex gap-3">
                <button className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  book.progress === 100 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : book.progress > 0 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}>
                  {book.progress === 100 ? 'Relire' : book.progress > 0 ? 'Continuer' : 'Lire'}
                </button>
                <button className="px-4 py-2 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
                  Favoris
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Heart className="w-6 h-6 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900">Mes Favoris</h2>
        </div>
        
        <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Le Château de Nuages</h3>
              <p className="text-sm text-gray-600 mb-3">par Antoine Rousseau • Thème: Imagination</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-blue-600 mb-1">92%</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <span>Lu il y a: Dimanche dernier, hier</span>
          </div>
          
          <p className="text-sm text-gray-700 mb-4">Score moyen: 92%</p>
          
          <div className="w-full bg-pink-200 rounded-full h-3 mb-4">
            <div className="bg-pink-600 h-3 rounded-full" style={{ width: '92%' }}></div>
          </div>
          
          <div className="flex gap-3">
            <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Relire
            </button>
            <button className="px-4 py-2 border border-pink-300 text-pink-700 rounded-lg hover:bg-pink-100 transition-colors">
              Retirer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}