import React, { useState, useEffect } from 'react'
import { 
  Users, 
  UserPlus, 
  Download, 
  Search,
  TrendingUp,
  BookOpen,
  Target
} from 'lucide-react'
import { apiClient } from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'
import { User } from '../../types'

export default function ClassManagement() {
  const { user } = useAuth()
  const [students, setStudents] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [levelFilter, setLevelFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && user.role === 'teacher') {
      fetchStudents()
    }
  }, [user])

  const fetchStudents = async () => {
    try {

      const data = await apiClient.getStudents()
      setStudents(data || [])
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = levelFilter === 'all' || student.level === levelFilter
    
    return matchesSearch && matchesLevel
  })

  const classStats = {
    activeStudents: students.length,
    averageProgress: 7, // Mock data
    totalReadings: 0 // Mock data
  }

  if (user?.role !== 'teacher') {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Cette section est réservée aux enseignants.</p>
      </div>
    )
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
          👥 Suivi de Classe
        </h1>
      </div>

      {/* Class Overview */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          📊 Vue d'Ensemble de la Classe
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-700 mb-1">Élèves Actifs</h3>
            <p className="text-2xl font-bold text-blue-600 mb-1">{classStats.activeStudents}</p>
            <p className="text-sm text-gray-500">Cette semaine</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-700 mb-1">Progression Moyenne</h3>
            <p className="text-2xl font-bold text-green-600 mb-1">{classStats.averageProgress}%</p>
            <p className="text-sm text-gray-500">Amélioration</p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-medium text-gray-700 mb-1">Lectures Totales</h3>
            <p className="text-2xl font-bold text-orange-600 mb-1">{classStats.totalReadings}</p>
            <p className="text-sm text-gray-500">Cette semaine</p>
          </div>
        </div>
      </div>

      {/* Student Management */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            🎓 Gestion des Élèves
          </h2>
          
          <div className="flex gap-4">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Ajouter un Élève
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exporter les Progrès
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Nom, prénom ou classe..."
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

          <div></div>
        </div>

        {/* Students Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Photo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mobile Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interest
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Users className="w-12 h-12 mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No data</p>
                        <p className="text-sm">Aucun élève trouvé avec ces critères</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, index) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {student.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(student.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        -
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.level || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filteredStudents.length > 0 && (
            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-500">
                {filteredStudents.length} Records
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">1 of 1</span>
                <div className="flex gap-1">
                  <button className="p-1 rounded border border-gray-300 hover:bg-gray-100">
                    <span className="sr-only">Previous</span>
                    ‹
                  </button>
                  <button className="p-1 rounded border border-gray-300 hover:bg-gray-100">
                    <span className="sr-only">Next</span>
                    ›
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}