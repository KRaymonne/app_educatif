import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

/**
 * Middleware de gestion centralisée des erreurs
 */
export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Erreur interne du serveur';

  // Log de l'erreur
  console.error('❌ Erreur capturée:', {
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Gestion des erreurs spécifiques de MongoDB
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Données de validation invalides';
    
    // Extraire les messages d'erreur de validation
    const validationErrors = Object.values((error as any).errors).map(
      (err: any) => err.message
    );
    
    res.status(statusCode).json({
      success: false,
      message,
      errors: validationErrors
    });
    return;
  }

  if (error.name === 'CastError') {
    statusCode = 400;
    message = 'ID invalide';
  }

  if ((error as any).code === 11000) {
    statusCode = 409;
    message = 'Données en doublon détectées';
    
    // Extraire le champ en doublon
    const field = Object.keys((error as any).keyValue)[0];
    message = `${field} déjà existant`;
  }

  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token JWT invalide';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token JWT expiré';
  }

  // Erreurs de multer (upload de fichiers)
  if (error.name === 'MulterError') {
    statusCode = 400;
    switch ((error as any).code) {
      case 'LIMIT_FILE_SIZE':
        message = 'Fichier trop volumineux';
        break;
      case 'LIMIT_FILE_COUNT':
        message = 'Trop de fichiers';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Champ de fichier inattendu';
        break;
      default:
        message = 'Erreur lors de l\'upload du fichier';
    }
  }

  // En production, ne pas exposer les détails des erreurs internes
  if (config.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Une erreur interne s\'est produite';
  }

  // Réponse d'erreur standardisée
  const errorResponse: any = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };

  // Ajouter la stack trace en développement
  if (config.NODE_ENV === 'development') {
    errorResponse.stack = error.stack;
    errorResponse.error = error;
  }

  res.status(statusCode).json(errorResponse);
};

/**
 * Middleware pour capturer les erreurs asynchrones
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Créer une erreur personnalisée
 */
export const createError = (message: string, statusCode: number = 500): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

/**
 * Middleware pour gérer les routes non trouvées
 */
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = createError(`Route ${req.originalUrl} non trouvée`, 404);
  next(error);
};

/**
 * Gestionnaire d'erreurs non capturées
 */
export const handleUncaughtExceptions = (): void => {
  process.on('uncaughtException', (error: Error) => {
    console.error('💥 Exception non capturée:', error);
    console.error('🔄 Arrêt du serveur...');
    process.exit(1);
  });

  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    console.error('💥 Promesse rejetée non gérée:', reason);
    console.error('🔄 Arrêt du serveur...');
    process.exit(1);
  });
};
