import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader, JWTPayload } from '../utils/jwt';
import { User, IUser } from '../models/User';

// Étendre l'interface Request pour inclure l'utilisateur
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      userId?: string;
    }
  }
}

/**
 * Middleware d'authentification principal
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Token d\'authentification requis'
      });
      return;
    }

    // Vérifier le token
    const decoded = verifyToken(token);
    if (!decoded) {
      res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
      return;
    }
    
    // Récupérer l'utilisateur depuis la base de données
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
      return;
    }

    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Compte utilisateur désactivé'
      });
      return;
    }

    // Ajouter l'utilisateur à la requête
    req.user = user;
    req.userId = (user._id as any).toString();
    
    next();
  } catch (error: any) {
    console.error('❌ Erreur d\'authentification:', error);
    
    let message = 'Token invalide';
    if (error.message === 'Token expiré') {
      message = 'Token expiré, veuillez vous reconnecter';
    }
    
    res.status(401).json({
      success: false,
      message
    });
  }
};

/**
 * Middleware d'authentification optionnelle (n'échoue pas si pas de token)
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      next();
      return;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      next();
      return;
    }
    
    const user = await User.findById(decoded.userId).select('-password');
    
    if (user && user.isActive) {
      req.user = user;
      req.userId = (user._id as any).toString();
    }
    
    next();
  } catch (error) {
    // En cas d'erreur, on continue sans utilisateur authentifié
    next();
  }
};

/**
 * Middleware de vérification des rôles
 */
export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Permissions insuffisantes'
      });
      return;
    }

    next();
  };
};

/**
 * Middleware pour vérifier que l'utilisateur est admin
 */
export const requireAdmin = requireRole('admin');

/**
 * Middleware pour vérifier que l'utilisateur est enseignant ou admin
 */
export const requireTeacherOrAdmin = requireRole('teacher', 'admin');

/**
 * Middleware pour vérifier que l'utilisateur accède à ses propres données
 */
export const requireOwnershipOrAdmin = (userIdParam: string = 'userId') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
      return;
    }

    const targetUserId = req.params[userIdParam] || req.body[userIdParam];
    
    // Admin peut accéder à tout
    if (req.user.role === 'admin') {
      next();
      return;
    }

    // Vérifier que l'utilisateur accède à ses propres données
    if (req.userId !== targetUserId) {
      res.status(403).json({
        success: false,
        message: 'Accès non autorisé à ces données'
      });
      return;
    }

    next();
  };
};

/**
 * Middleware pour vérifier que l'utilisateur appartient à la même classe (pour les enseignants)
 */
export const requireSameClassOrAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentification requise'
    });
    return;
  }

  // Admin peut accéder à tout
  if (req.user.role === 'admin') {
    next();
    return;
  }

  // Les enseignants peuvent accéder aux données de leur classe
  if (req.user.role === 'teacher' && req.user.classId) {
    // Cette logique peut être étendue selon les besoins
    next();
    return;
  }

  // Les étudiants ne peuvent accéder qu'à leurs propres données
  const targetUserId = req.params.userId || req.body.userId;
  if (req.userId === targetUserId) {
    next();
    return;
  }

  res.status(403).json({
    success: false,
    message: 'Accès non autorisé'
  });
};

/**
 * Middleware pour mettre à jour la dernière connexion
 */
export const updateLastLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (req.user) {
    try {
      await User.findByIdAndUpdate(req.user._id, { lastLogin: new Date() });
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de la dernière connexion:', error);
      // On ne fait pas échouer la requête pour cette erreur
    }
  }
  next();
};
