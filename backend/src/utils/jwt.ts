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
    const secret = config.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET non défini');
    }
    
    return jwt.sign(payload, secret, {
      expiresIn: config.JWT_EXPIRES_IN || '7d'
    });
  } catch (error) {
    console.error('❌ Erreur lors de la génération du token:', error);
    throw new Error('Erreur lors de la génération du token');
  }
};

/**
 * Vérifie et décode un token JWT
 */
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const secret = config.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET non défini');
    }
    
    const decoded = jwt.verify(token, secret) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('❌ Token invalide:', error);
    return null;
  }
};

/**
 * Vérifie si un token est expiré
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const secret = config.JWT_SECRET;
    if (!secret) {
      return true;
    }
    
    jwt.verify(token, secret);
    return false;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return true;
    }
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
  
  return parts[1] || null;
};

/**
 * Génère un token de rafraîchissement (plus long)
 */
export const generateRefreshToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  try {
    const secret = config.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET non défini');
    }
    
    return jwt.sign(payload, secret, {
      expiresIn: '30d' // Token de rafraîchissement valide 30 jours
    });
  } catch (error) {
    console.error('❌ Erreur lors de la génération du refresh token:', error);
    throw new Error('Erreur lors de la génération du refresh token');
  }
};

/**
 * Vérifie et décode un refresh token
 */
export const verifyRefreshToken = (token: string): JWTPayload | null => {
  try {
    const secret = config.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET non défini');
    }
    
    const decoded = jwt.verify(token, secret) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('❌ Refresh token invalide:', error);
    return null;
  }
};

/**
 * Décode un token sans vérification (pour debug uniquement)
 */
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('❌ Erreur lors du décodage du token:', error);
    return null;
  }
};

/**
 * Obtient le temps d'expiration d'un token en secondes
 */
export const getTokenExpirationTime = (token: string): number | null => {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    return decoded.exp || null;
  } catch (error) {
    console.error('❌ Erreur lors de la lecture de l\'expiration du token:', error);
    return null;
  }
};

/**
 * Vérifie si un token expire bientôt (dans les 5 minutes)
 */
export const isTokenExpiringSoon = (token: string): boolean => {
  try {
    const expirationTime = getTokenExpirationTime(token);
    if (!expirationTime) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiration = expirationTime - currentTime;
    
    // Retourne true si le token expire dans moins de 5 minutes (300 secondes)
    return timeUntilExpiration < 300;
  } catch (error) {
    console.error('❌ Erreur lors de la vérification de l\'expiration du token:', error);
    return true;
  }
};
