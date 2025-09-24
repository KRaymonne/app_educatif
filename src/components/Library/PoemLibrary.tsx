import React, { useState, useEffect } from 'react'
import { Search, Heart, Play, Filter } from 'lucide-react'
import { apiClient } from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'
import { Poem, Favorite } from '../../types'

export default function PoemLibrary() {
  const { user } = useAuth()
  const [poems, setPoems] = useState<Poem[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [levelFilter, setLevelFilter] = useState('all')
  const [themeFilter, setThemeFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPoems()
    fetchFavorites()
  }, [user])

  const fetchPoems = async () => {
    try {
      const data = await apiClient.getPoems()
      setPoems(data || [])
    } catch (error) {
      console.error('Error fetching poems:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFavorites = async () => {
    if (!user) return

    try {
      const data = await apiClient.getFavorites()
      setFavorites(data?.map(f => f.poemId) || [])
    } catch (error) {
      console.error('Error fetching favorites:', error)
    }
  }

  const toggleFavorite = async (poemId: string) => {
    if (!user) return

    try {
      if (favorites.includes(poemId)) {
        await apiClient.removeFromFavorites(poemId)
        
        setFavorites(favorites.filter(id => id !== poemId))
      } else {
        await apiClient.addToFavorites(poemId)
        
        setFavorites([...favorites, poemId])
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
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
      console.log('Reading started:', data)
    } catch (error) {
      console.error('Error starting reading:', error)
    }
  }

  const filteredPoems = poems.filter(poem => {
    const matchesSearch = poem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         poem.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = levelFilter === 'all' || poem.level === levelFilter
    const matchesTheme = themeFilter === 'all' || poem.theme === themeFilter
    
    return matchesSearch && matchesLevel && matchesTheme
  })

  const uniqueThemes = Array.from(new Set(poems.map(p => p.theme)))

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
          📚 Bibliothèque de Poèmes
        </h1>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Taper le titre, l'auteur ou un mot-clé..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">Tous les niveaux</option>
          <option value="debutant">Débutant</option>
          <option value="intermediaire">Intermédiaire</option>
          <option value="avance">Avancé</option>
        </select>

        <select
          value={themeFilter}
          onChange={(e) => setThemeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">Tous les thèmes</option>
          {uniqueThemes.map(theme => (
            <option key={theme} value={theme}>{theme}</option>
          ))}
        </select>
      </div>

      {/* All Poems Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          📖 Tous les Poèmes
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPoems.map((poem) => (
            <div key={poem.id} className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-800 mb-2">{poem.title}</h3>
              <p className="text-sm text-gray-600 mb-3">par {poem.author}</p>
              
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  🌿 Thème: {poem.theme}
                </span>
                <span>📊 Niveau: {poem.level}</span>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                <span>⏱️ Durée: {poem.durationMinutes} minutes</span>
                <span>📈 Difficulté: {poem.difficulty}</span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {poem.content.substring(0, 100)}...
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => startReading(poem.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Lire
                </button>
                <button
                  onClick={() => toggleFavorite(poem.id)}
                  className={`px-4 py-2 rounded-lg border-2 transition-colors flex items-center justify-center ${
                    favorites.includes(poem.id)
                      ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                      : 'bg-white border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${favorites.includes(poem.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Favorites Section */}
      {favorites.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            ❤️ Mes Favoris
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {poems.filter(poem => favorites.includes(poem.id)).map((poem) => (
              <div key={poem.id} className="bg-pink-50 border border-pink-200 rounded-xl p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    ⭐ {poem.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">par {poem.author} • Thème: {poem.theme}</p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span>Lu 3 fois • Dernière lecture: hier</span>
                </div>
                
                <p className="text-sm font-medium text-pink-600 mb-4">Score moyen: 92%</p>

                <div className="flex gap-2">
                  <button className="flex-1 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    📚 Relire
                  </button>
                  <button
                    onClick={() => toggleFavorite(poem.id)}
                    className="px-4 py-2 rounded-lg bg-white border-2 border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500 transition-colors"
                  >
                    🗑️ Retirer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}