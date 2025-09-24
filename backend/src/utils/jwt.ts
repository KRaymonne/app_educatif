import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Génère un token JWT pour un utilisateur
 */
export const generateToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  try {
    return jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN,
      issuer: 'app-educatif',
      audience: 'app-educatif-users'
    });
  } catch (error) {
    console.error('❌ Erreur lors de la génération du token:', error);
    throw new Error('Erreur lors de la génération du token');
  }
};

/**
 * Vérifie et décode un token JWT
 */
export const verifyToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET, {
      issuer: 'app-educatif',
      audience: 'app-educatif-users'
    }) as JWTPayload;
    
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expiré');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Token invalide');
    } else if (error instanceof jwt.NotBeforeError) {
      throw new Error('Token pas encore valide');
    } else {
      console.error('❌ Erreur lors de la vérification du token:', error);
      throw new Error('Erreur lors de la vérification du token');
    }
  }
};

/**
 * Décode un token sans le vérifier (utile pour récupérer des infos d'un token expiré)
 */
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch (error) {
    console.error('❌ Erreur lors du décodage du token:', error);
    return null;
  }
};

/**
 * Vérifie si un token est expiré
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

/**
 * Extrait le token du header Authorization
 */
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
};

/**
 * Génère un token de rafraîchissement (plus long)
 */
export const generateRefreshToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  try {
    return jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: '30d', // Token de rafraîchissement valide 30 jours
      issuer: 'app-educatif',
      audience: 'app-educatif-refresh'
    });
  } catch (error) {
    console.error('❌ Erreur lors de la génération du refresh token:', error);
    throw new Error('Erreur lors de la génération du refresh token');
  }
};

/**
 * Vérifie un token de rafraîchissement
 */
export const verifyRefreshToken = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET, {
      issuer: 'app-educatif',
      audience: 'app-educatif-refresh'
    }) as JWTPayload;
    
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Refresh token expiré');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Refresh token invalide');
    } else {
      console.error('❌ Erreur lors de la vérification du refresh token:', error);
      throw new Error('Erreur lors de la vérification du refresh token');
    }
  }
};
