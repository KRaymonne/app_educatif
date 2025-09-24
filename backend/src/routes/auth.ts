import { Router } from 'express';
import { 
  register, 
  login, 
  refreshToken, 
  getProfile, 
  updateProfile, 
  logout 
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting pour les routes d'authentification
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives par IP
  message: {
    success: false,
    message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 3, // 3 inscriptions par IP par heure
  message: {
    success: false,
    message: 'Trop d\'inscriptions. Réessayez dans 1 heure.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Routes publiques
router.post('/register', registerLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh-token', refreshToken);

// Routes protégées
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.post('/logout', authenticate, logout);

export default router;
