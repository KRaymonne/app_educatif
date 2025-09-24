import mongoose from 'mongoose';
import { config } from '../config';
import { connectDatabase, clearDatabase } from '../config/database';
import { User } from '../models/User';
import { Poem } from '../models/Poem';
import { Reading } from '../models/Reading';
import { Favorite } from '../models/Favorite';
import { Progress } from '../models/Progress';

/**
 * Script pour peupler la base de données avec des données de test
 */
const seedDatabase = async (): Promise<void> => {
  try {
    console.log('🌱 Début du peuplement de la base de données...');

    // Connexion à la base de données
    await connectDatabase();

    // Nettoyer la base de données existante
    if (config.NODE_ENV === 'development') {
      console.log('🧹 Nettoyage de la base de données...');
      await clearDatabase();
    }

    // Créer des utilisateurs de test
    console.log('👥 Création des utilisateurs...');
    const users = await User.insertMany([
      {
        email: 'admin@app-educatif.com',
        password: 'admin123',
        name: 'Administrateur',
        role: 'admin',
        level: 'Avancé',
        isActive: true
      },
      {
        email: 'teacher@app-educatif.com',
        password: 'teacher123',
        name: 'Marie Dubois',
        role: 'teacher',
        level: 'Avancé',
        classId: 'CM2-A',
        isActive: true
      },
      {
        email: 'emma.martin@student.com',
        password: 'student123',
        name: 'Emma Martin',
        role: 'student',
        level: 'Débutant',
        classId: 'CM2-A',
        isActive: true
      },
      {
        email: 'lucas.bernard@student.com',
        password: 'student123',
        name: 'Lucas Bernard',
        role: 'student',
        level: 'Intermédiaire',
        classId: 'CM2-A',
        isActive: true
      },
      {
        email: 'sophie.martin@student.com',
        password: 'student123',
        name: 'Sophie Martin',
        role: 'student',
        level: 'Avancé',
        classId: 'CM2-B',
        isActive: true
      }
    ]);

    console.log(`✅ ${users.length} utilisateurs créés`);

    // Créer des poèmes de test
    console.log('📚 Création des poèmes...');
    const poems = await Poem.insertMany([
      {
        title: "Le Jardin Enchanté",
        author: "Henri Dubois",
        content: `Dans un jardin secret, caché du monde,
Poussent des fleurs aux couleurs profondes.
Les roses parlent aux papillons,
Les arbres chantent de douces chansons.

Ici le temps s'arrête et sourit,
Les rêves prennent vie, tout s'épanouit.
C'est un lieu magique où l'âme se pose,
Un jardin enchanté aux mille roses.`,
        theme: "Nature",
        level: "debutant",
        difficulty: "facile",
        durationMinutes: 2,
        description: "Un poème magique sur un jardin où poussent des âmes...",
        tags: ["nature", "magie", "jardin", "fleurs"],
        createdBy: users[1]._id, // Teacher
        readCount: 15,
        averageScore: 85
      },
      {
        title: "L'Oiseau Voyageur",
        author: "Pierre Martin",
        content: `Haut dans le ciel bleu azur,
Un oiseau vole, libre et sûr.
Il traverse monts et vallées,
Découvre des terres cachées.

Ses ailes portent tous ses rêves,
Son chant résonne, jamais ne s'achève.
Voyageur des quatre saisons,
Il nous enseigne ses leçons.

La liberté n'a pas de frontières,
Comme cet oiseau dans les airs.
Suivons son exemple chaque jour,
Et volons vers notre amour.`,
        theme: "Aventure",
        level: "intermediaire",
        difficulty: "moyen",
        durationMinutes: 4,
        description: "Suivez le voyage d'un oiseau curieux à travers les nuages...",
        tags: ["aventure", "liberté", "voyage", "oiseau"],
        createdBy: users[1]._id,
        readCount: 8,
        averageScore: 78
      },
      {
        title: "Mon Meilleur Ami",
        author: "Sophie Laurent",
        content: `J'ai un ami, le plus fidèle,
Qui ne me quitte jamais, c'est merveilleux.
Quand je suis triste, il me console,
Quand je ris, il rit avec moi.

Nous partageons tous nos secrets,
Nos jeux, nos rires, nos projets.
Ensemble nous sommes plus forts,
L'amitié est notre trésor.

Peu importe les années qui passent,
Notre lien jamais ne se casse.
Car un vrai ami, c'est précieux,
C'est le plus beau des cadeaux.`,
        theme: "Amitié",
        level: "debutant",
        difficulty: "facile",
        durationMinutes: 3,
        description: "Une belle histoire d'amitié entre deux enfants inséparables...",
        tags: ["amitié", "fidélité", "partage", "enfance"],
        createdBy: users[1]._id,
        readCount: 22,
        averageScore: 92
      },
      {
        title: "Le Château de Nuages",
        author: "Antoine Rousseau",
        content: `Au-dessus des montagnes hautes,
Flotte un château fait de nuages.
Ses tours touchent les étoiles,
Ses murs brillent comme des voiles.

Dans ce palais aérien,
Vivent des princes magiciens.
Ils tissent des rêves dorés,
Pour tous les enfants endormés.

Quand la nuit tombe doucement,
Le château danse dans le vent.
Et si tu regardes bien le ciel,
Tu verras ce monde irréel.

Ferme les yeux et tu pourras,
Visiter ce château-là.
Car dans nos rêves les plus fous,
Tout devient possible pour nous.`,
        theme: "Imagination",
        level: "avance",
        difficulty: "difficile",
        durationMinutes: 6,
        description: "Un château mystérieux flotte dans les nuages...",
        tags: ["imagination", "rêve", "magie", "château"],
        createdBy: users[1]._id,
        readCount: 5,
        averageScore: 88
      },
      {
        title: "La Danse des Saisons",
        author: "Claire Moreau",
        content: `Le printemps arrive en dansant,
Avec ses fleurs et son chant.
L'été suit avec sa chaleur,
Apportant joie et bonheur.

L'automne peint les feuilles d'or,
Offre ses fruits comme un trésor.
L'hiver endort la nature,
Sous son manteau blanc et pur.

Chaque saison a sa beauté,
Sa propre personnalité.
Ensemble elles forment l'année,
Dans une ronde enchantée.`,
        theme: "Nature",
        level: "intermediaire",
        difficulty: "moyen",
        durationMinutes: 3,
        description: "Un voyage poétique à travers les quatre saisons...",
        tags: ["saisons", "nature", "cycle", "beauté"],
        createdBy: users[1]._id,
        readCount: 12,
        averageScore: 81
      }
    ]);

    console.log(`✅ ${poems.length} poèmes créés`);

    // Créer des lectures de test
    console.log('📖 Création des lectures...');
    const readings = [];
    
    // Emma lit plusieurs poèmes
    readings.push(
      {
        userId: users[2]._id, // Emma
        poemId: poems[0]._id, // Le Jardin Enchanté
        score: 89,
        durationSeconds: 125,
        completed: true,
        feedback: "Excellente lecture ! Bonne prononciation.",
        mistakes: [
          { word: "profondes", position: 15, type: "pronunciation", severity: "low" }
        ],
        sessionData: {
          startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Il y a 7 jours
          endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 125000),
          pauseCount: 1,
          totalPauseTime: 5
        }
      },
      {
        userId: users[2]._id, // Emma
        poemId: poems[2]._id, // Mon Meilleur Ami
        score: 92,
        durationSeconds: 180,
        completed: true,
        feedback: "Très belle expression ! Continue comme ça.",
        mistakes: [],
        sessionData: {
          startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Il y a 5 jours
          endTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 180000),
          pauseCount: 0,
          totalPauseTime: 0
        }
      }
    );

    // Lucas lit d'autres poèmes
    readings.push(
      {
        userId: users[3]._id, // Lucas
        poemId: poems[1]._id, // L'Oiseau Voyageur
        score: 78,
        durationSeconds: 245,
        completed: true,
        feedback: "Bon travail ! Attention à la fluidité.",
        mistakes: [
          { word: "azur", position: 8, type: "pronunciation", severity: "medium" },
          { word: "frontières", position: 45, type: "fluency", severity: "low" }
        ],
        sessionData: {
          startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Il y a 3 jours
          endTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 245000),
          pauseCount: 2,
          totalPauseTime: 15
        }
      },
      {
        userId: users[3]._id, // Lucas
        poemId: poems[4]._id, // La Danse des Saisons
        score: 85,
        durationSeconds: 195,
        completed: true,
        feedback: "Amélioration notable ! Bonne intonation.",
        mistakes: [
          { word: "personnalité", position: 32, type: "pronunciation", severity: "low" }
        ],
        sessionData: {
          startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Il y a 1 jour
          endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 195000),
          pauseCount: 1,
          totalPauseTime: 8
        }
      }
    );

    await Reading.insertMany(readings);
    console.log(`✅ ${readings.length} lectures créées`);

    // Créer des favoris
    console.log('⭐ Création des favoris...');
    const favorites = await Favorite.insertMany([
      {
        userId: users[2]._id, // Emma
        poemId: poems[2]._id  // Mon Meilleur Ami
      },
      {
        userId: users[2]._id, // Emma
        poemId: poems[3]._id  // Le Château de Nuages
      },
      {
        userId: users[3]._id, // Lucas
        poemId: poems[1]._id  // L'Oiseau Voyageur
      }
    ]);

    console.log(`✅ ${favorites.length} favoris créés`);

    // Créer des données de progrès
    console.log('📊 Création des données de progrès...');
    
    // Calculer le début de la semaine courante
    const now = new Date();
    const currentWeekStart = new Date(now);
    currentWeekStart.setDate(now.getDate() - now.getDay());
    currentWeekStart.setHours(0, 0, 0, 0);

    // Semaine précédente
    const previousWeekStart = new Date(currentWeekStart);
    previousWeekStart.setDate(currentWeekStart.getDate() - 7);

    const progressData = await Progress.insertMany([
      {
        userId: users[2]._id, // Emma
        weekStart: previousWeekStart,
        readingsCompleted: 2,
        totalTimeMinutes: 5.08,
        averageScore: 90.5,
        improvementPercentage: 0,
        weeklyGoal: 3,
        goalAchieved: false,
        streakDays: 2,
        bestScore: 92,
        worstScore: 89,
        totalMistakes: 1
      },
      {
        userId: users[3]._id, // Lucas
        weekStart: previousWeekStart,
        readingsCompleted: 2,
        totalTimeMinutes: 7.33,
        averageScore: 81.5,
        improvementPercentage: 0,
        weeklyGoal: 2,
        goalAchieved: true,
        streakDays: 2,
        bestScore: 85,
        worstScore: 78,
        totalMistakes: 3
      }
    ]);

    console.log(`✅ ${progressData.length} entrées de progrès créées`);

    console.log('🎉 Peuplement de la base de données terminé avec succès !');
    console.log('\n📋 Résumé des données créées :');
    console.log(`   - ${users.length} utilisateurs`);
    console.log(`   - ${poems.length} poèmes`);
    console.log(`   - ${readings.length} lectures`);
    console.log(`   - ${favorites.length} favoris`);
    console.log(`   - ${progressData.length} entrées de progrès`);
    
    console.log('\n🔑 Comptes de test :');
    console.log('   Admin: admin@app-educatif.com / admin123');
    console.log('   Enseignant: teacher@app-educatif.com / teacher123');
    console.log('   Étudiant: emma.martin@student.com / student123');
    console.log('   Étudiant: lucas.bernard@student.com / student123');

  } catch (error) {
    console.error('❌ Erreur lors du peuplement:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('🔒 Connexion fermée');
  }
};

// Exécuter le script si appelé directement
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Script terminé avec succès');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erreur du script:', error);
      process.exit(1);
    });
}

export default seedDatabase;
