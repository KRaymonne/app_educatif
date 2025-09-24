import React, { useState } from 'react'
import Sidebar from './components/Layout/Sidebar'
import AccueilPage from './components/Pages/AccueilPage'
import BibliotequePage from './components/Pages/BibliotequePage'
import LecturesPage from './components/Pages/LecturesPage'
import RapportsPage from './components/Pages/RapportsPage'
import SuiviPage from './components/Pages/SuiviPage'
import ParametresPage from './components/Pages/ParametresPage'

function App() {
  const [currentPage, setCurrentPage] = useState('accueil')
  const [user] = useState({
    name: 'Emma Martin',
    level: 'Débutant',
    readingTime: 25,
    accuracy: 89,
    completedBooks: 12
  })

  const [books] = useState([
    {
      id: 1,
      title: "Le Jardin Enchanté",
      author: "Henri Dubois",
      theme: "Nature",
      level: "Débutant",
      duration: "2 minutes",
      difficulty: "Facile",
      description: "Un poème magique sur un jardin où poussent des âmes...",
      progress: 100,
      score: 89
    },
    {
      id: 2,
      title: "L'Oiseau Voyageur", 
      author: "Pierre Martin",
      theme: "Aventure",
      level: "Intermédiaire",
      duration: "4 minutes",
      difficulty: "Moyenne",
      description: "Suivez le voyage d'un oiseau curieux à travers les nuages...",
      progress: 0,
      score: null
    },
    {
      id: 3,
      title: "Mon Meilleur Ami",
      author: "Sophie Laurent", 
      theme: "Amitié",
      level: "Débutant",
      duration: "3 minutes",
      difficulty: "Facile",
      description: "Une belle histoire d'amitié entre deux enfants inséparables...",
      progress: 0,
      score: null
    },
    {
      id: 4,
      title: "Le Château de Nuages",
      author: "Antoine Rousseau",
      theme: "Imagination",
      level: "Avancé", 
      duration: "6 minutes",
      difficulty: "Difficile",
      description: "Un château mystérieux flotte dans les nuages...",
      progress: 92,
      score: null,
      favorite: true
    }
  ])

  const renderPage = () => {
    switch(currentPage) {
      case 'accueil':
        return <AccueilPage user={user} books={books} />
      case 'bibliotheque':
        return <BibliotequePage books={books} />
      case 'lectures':
        return <LecturesPage books={books} />
      case 'rapports':
        return <RapportsPage user={user} />
      case 'suivi':
        return <SuiviPage />
      case 'parametres':
        return <ParametresPage user={user} />
      default:
        return <AccueilPage user={user} books={books} />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
      />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  )
}

export default App