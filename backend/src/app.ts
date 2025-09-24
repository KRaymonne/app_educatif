import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config';

// Import des routes
import authRoutes from './routes/auth';

// Import des middleware
import { errorHandler } from './middleware/errorHandler';

const app: Application = express();

// Middleware de sécurité
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Configuration CORS
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Compression des réponses
app.use(compression());

// Parsing du body
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging des requêtes
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting global
const globalLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    message: 'Trop de requêtes. Réessayez plus tard.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use(globalLimiter);

// Servir les fichiers statiques (uploads)
app.use('/uploads', express.static(config.UPLOAD_PATH));

// Route de santé
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Serveur en fonctionnement',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV
  });
});

// Routes API
app.use('/api/auth', authRoutes);

// Route 404
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} non trouvée`
  });
});

// Middleware de gestion d'erreurs (doit être en dernier)
app.use(errorHandler);

export default app;
