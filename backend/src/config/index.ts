import dotenv from 'dotenv';
import path from 'path';

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface Config {
  // Base de données
  MONGODB_URI: string;
  MONGODB_TEST_URI: string;
  
  // Serveur
  PORT: number;
  NODE_ENV: string;
  
  // Sécurité JWT
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  
  // CORS
  CORS_ORIGIN: string;
  
  // Upload
  UPLOAD_PATH: string;
  MAX_FILE_SIZE: number;
  ALLOWED_FILE_TYPES: string[];
  
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
  
  // Logs
  LOG_LEVEL: string;
}

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET'
];

// Vérifier que les variables d'environnement requises sont présentes
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error(`❌ Variables d'environnement manquantes: ${missingEnvVars.join(', ')}`);
  console.error('💡 Copiez le fichier .env.example vers .env et remplissez les valeurs');
  process.exit(1);
}

export const config: Config = {
  // Base de données
  MONGODB_URI: process.env.MONGODB_URI!,
  MONGODB_TEST_URI: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/app_educatif_test',
  
  // Serveur
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Sécurité JWT
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Upload
  UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB par défaut
  ALLOWED_FILE_TYPES: process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'audio/mpeg',
    'audio/wav', 
    'audio/mp3',
    'audio/ogg'
  ],
  
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  
  // Logs
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};

// Validation des configurations
if (config.PORT < 1 || config.PORT > 65535) {
  console.error('❌ Le port doit être entre 1 et 65535');
  process.exit(1);
}

if (config.MAX_FILE_SIZE < 1024 || config.MAX_FILE_SIZE > 52428800) { // 1KB à 50MB
  console.error('❌ La taille maximale des fichiers doit être entre 1KB et 50MB');
  process.exit(1);
}

if (!['development', 'production', 'test'].includes(config.NODE_ENV)) {
  console.warn(`⚠️ NODE_ENV non reconnu: ${config.NODE_ENV}. Utilisation de 'development' par défaut.`);
}

// Afficher la configuration en mode développement
if (config.NODE_ENV === 'development') {
  console.log('🔧 Configuration chargée:');
  console.log(`   - Environnement: ${config.NODE_ENV}`);
  console.log(`   - Port: ${config.PORT}`);
  console.log(`   - MongoDB: ${config.MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);
  console.log(`   - CORS Origin: ${config.CORS_ORIGIN}`);
  console.log(`   - Upload Path: ${config.UPLOAD_PATH}`);
  console.log(`   - Max File Size: ${(config.MAX_FILE_SIZE / 1024 / 1024).toFixed(1)}MB`);
  console.log(`   - Rate Limit: ${config.RATE_LIMIT_MAX_REQUESTS} req/${config.RATE_LIMIT_WINDOW_MS / 1000}s`);
}

export default config;
