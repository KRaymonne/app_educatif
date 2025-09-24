import app from './app';
import { config } from './config';
import { connectDatabase } from './config/database';
import { handleUncaughtExceptions } from './middleware/errorHandler';

// Gérer les exceptions non capturées
handleUncaughtExceptions();

/**
 * Démarrer le serveur
 */
const startServer = async (): Promise<void> => {
  try {
    // Connexion à la base de données
    await connectDatabase();
    
    // Démarrer le serveur HTTP
    const server = app.listen(config.PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${config.PORT}`);
      console.log(`🌍 Environnement: ${config.NODE_ENV}`);
      console.log(`📍 URL: http://localhost:${config.PORT}`);
      console.log(`🏥 Health check: http://localhost:${config.PORT}/health`);
      
      if (config.NODE_ENV === 'development') {
        console.log(`📚 API Documentation: http://localhost:${config.PORT}/api`);
      }
    });

    // Gestion de l'arrêt propre du serveur
    const gracefulShutdown = (signal: string) => {
      console.log(`\n🛑 Signal ${signal} reçu. Arrêt en cours...`);
      
      server.close(async (error) => {
        if (error) {
          console.error('❌ Erreur lors de la fermeture du serveur:', error);
          process.exit(1);
        }
        
        console.log('🔒 Serveur HTTP fermé');
        
        try {
          // Fermer la connexion à la base de données
          const { disconnectDatabase } = await import('./config/database');
          await disconnectDatabase();
          console.log('✅ Arrêt propre terminé');
          process.exit(0);
        } catch (dbError) {
          console.error('❌ Erreur lors de la fermeture de la base de données:', dbError);
          process.exit(1);
        }
      });

      // Forcer l'arrêt après 10 secondes
      setTimeout(() => {
        console.error('⏰ Arrêt forcé après timeout');
        process.exit(1);
      }, 10000);
    };

    // Écouter les signaux d'arrêt
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Gestion des erreurs du serveur
    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Le port ${config.PORT} est déjà utilisé`);
        process.exit(1);
      } else if (error.code === 'EACCES') {
        console.error(`❌ Permission refusée pour le port ${config.PORT}`);
        process.exit(1);
      } else {
        console.error('❌ Erreur du serveur:', error);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

// Démarrer le serveur
startServer();
