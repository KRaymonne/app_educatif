import mongoose from 'mongoose';
import { config } from './index';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = config.NODE_ENV === 'test' ? config.MONGODB_TEST_URI : config.MONGODB_URI;
    
    await mongoose.connect(mongoUri, {
      // Options de connexion recommandées
      maxPoolSize: 10, // Maintenir jusqu'à 10 connexions socket
      serverSelectionTimeoutMS: 5000, // Garder en essayant d'envoyer des opérations pendant 5 secondes
      socketTimeoutMS: 45000, // Fermer les sockets après 45 secondes d'inactivité
    });

    console.log(`✅ MongoDB connecté avec succès à: ${mongoUri.replace(/\/\/.*@/, '//***:***@')}`);

    // Gestion des événements de connexion
    mongoose.connection.on('error', (error) => {
      console.error('❌ Erreur de connexion MongoDB:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB déconnecté');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnecté');
    });

    // Gestion de la fermeture propre
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('🔒 Connexion MongoDB fermée suite à l\'arrêt de l\'application');
        process.exit(0);
      } catch (error) {
        console.error('❌ Erreur lors de la fermeture de la connexion MongoDB:', error);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('❌ Erreur de connexion à MongoDB:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('🔒 Connexion MongoDB fermée');
  } catch (error) {
    console.error('❌ Erreur lors de la fermeture de la connexion MongoDB:', error);
  }
};

// Fonction pour nettoyer la base de données (utile pour les tests)
export const clearDatabase = async (): Promise<void> => {
  if (config.NODE_ENV !== 'test') {
    throw new Error('La suppression de la base de données n\'est autorisée qu\'en mode test');
  }

  try {
    const collections = mongoose.connection.collections;
    
    for (const key in collections) {
      const collection = collections[key];
      if (collection) {
        await collection.deleteMany({});
      }
    }
    
    console.log('🧹 Base de données nettoyée');
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage de la base de données:', error);
    throw error;
  }
};

// Fonction pour vérifier l'état de la connexion
export const isDatabaseConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

// Fonction pour obtenir les statistiques de la base de données
export const getDatabaseStats = async () => {
  try {
    const stats = await mongoose.connection.db?.stats();
    if (!stats) {
      throw new Error('Impossible d\'obtenir les statistiques de la base de données');
    }
    return {
      collections: stats.collections,
      dataSize: stats.dataSize,
      storageSize: stats.storageSize,
      indexes: stats.indexes,
      indexSize: stats.indexSize,
      objects: stats.objects
    };
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des statistiques:', error);
    throw error;
  }
};
