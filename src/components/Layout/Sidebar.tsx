import React from 'react'
import { 
  BookOpen, 
  Home, 
  Library, 
  BarChart3, 
  Users, 
  Settings
} from 'lucide-react'

interface SidebarProps {
  currentPage: string
  setCurrentPage: (page: string) => void
}

export default function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
  const menuItems = [
    { id: 'accueil', label: 'Accueil', icon: Home },
    { id: 'bibliotheque', label: 'Bibliothèque', icon: Library },
    { id: 'lectures', label: 'Mes Lectures', icon: BookOpen },
    { id: 'suivi', label: 'Suivi Classe', icon: Users },
    { id: 'rapports', label: 'Rapports', icon: BarChart3 },
    { id: 'parametres', label: 'Paramètres', icon: Settings }
  ]

  return (
    <div className="w-64 bg-blue-50 border-r border-blue-100 flex flex-col">
      <div className="p-6 border-b border-blue-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900">Lecteur Adaptatif</h1>
            <p className="text-sm text-gray-600">pour Enfants</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    currentPage === item.id 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-700 hover:bg-blue-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}