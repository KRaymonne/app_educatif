import { Request, Response } from 'express';
import { User, IUser } from '../models/User';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import Joi from 'joi';

// Schémas de validation
const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Format d\'email invalide',
    'any.required': 'L\'email est requis'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
    'any.required': 'Le mot de passe est requis'
  }),
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Le nom doit contenir au moins 2 caractères',
    'string.max': 'Le nom ne peut pas dépasser 100 caractères',
    'any.required': 'Le nom est requis'
  }),
  role: Joi.string().valid('student', 'teacher', 'admin').default('student'),
  level: Joi.string().valid('Débutant', 'Intermédiaire', 'Avancé').default('Débutant'),
  classId: Joi.string().optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Format d\'email invalide',
    'any.required': 'L\'email est requis'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Le mot de passe est requis'
  })
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': 'Le refresh token est requis'
  })
});

/**
 * Inscription d'un nouvel utilisateur
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validation des données
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
      return;
    }

    const { email, password, name, role, level, classId } = value;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà'
      });
      return;
    }

    // Créer le nouvel utilisateur
    const userData: Partial<IUser> = {
      email: email.toLowerCase(),
      password,
      name,
      role: role || 'student',
      level: level || 'Débutant',
      isActive: true
    };

    if (classId && role === 'student') {
      userData.classId = classId;
    }

    const user = new User(userData);
    await user.save();

    // Générer les tokens
    const tokenPayload = {
      userId: (user._id as any).toString(),
      email: user.email,
      role: user.role
    };

    const accessToken = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Réponse sans le mot de passe
    const userResponse = user.toJSON();

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: {
        user: userResponse,
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

/**
 * Connexion d'un utilisateur
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validation des données
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
      return;
    }

    const { email, password } = value;

    // Trouver l'utilisateur
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      isActive: true 
    }).select('+password');

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
      return;
    }

    // Vérifier le mot de passe
    const isPasswordValid = await (user as any).comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
      return;
    }

    // Mettre à jour la dernière connexion
    user.lastLogin = new Date();
    await user.save();

    // Générer les tokens
    const tokenPayload = {
      userId: (user._id as any).toString(),
      email: user.email,
      role: user.role
    };

    const accessToken = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Réponse sans le mot de passe
    const userResponse = user.toJSON();

    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      data: {
        user: userResponse,
        accessToken,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

/**
 * Rafraîchissement du token d'accès
 */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validation des données
    const { error, value } = refreshTokenSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: 'Refresh token requis'
      });
      return;
    }

    const { refreshToken: token } = value;

    // Vérifier le refresh token
    const decoded = verifyRefreshToken(token);
    if (!decoded) {
      res.status(401).json({
        success: false,
        message: 'Refresh token invalide ou expiré'
      });
      return;
    }

    // Vérifier que l'utilisateur existe toujours
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé ou désactivé'
      });
      return;
    }

    // Générer un nouveau token d'accès
    const tokenPayload = {
      userId: (user._id as any).toString(),
      email: user.email,
      role: user.role
    };

    const newAccessToken = generateToken(tokenPayload);

    res.status(200).json({
      success: true,
      message: 'Token rafraîchi avec succès',
      data: {
        accessToken: newAccessToken
      }
    });

  } catch (error) {
    console.error('Erreur lors du rafraîchissement du token:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

/**
 * Déconnexion (côté client principalement)
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // Dans une implémentation complète, on pourrait blacklister le token
    // ou le stocker dans une base de données pour l'invalider
    
    res.status(200).json({
      success: true,
      message: 'Déconnexion réussie'
    });

  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

/**
 * Obtenir le profil de l'utilisateur connecté
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    
    const user = await User.findById(userId).populate('classId', 'name level');
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        user: user.toJSON()
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

/**
 * Mettre à jour le profil de l'utilisateur connecté
 */
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { name, level } = req.body;

    // Validation basique
    if (name && (typeof name !== 'string' || name.trim().length < 2)) {
      res.status(400).json({
        success: false,
        message: 'Le nom doit contenir au moins 2 caractères'
      });
      return;
    }

    if (level && !['Débutant', 'Intermédiaire', 'Avancé'].includes(level)) {
      res.status(400).json({
        success: false,
        message: 'Niveau invalide'
      });
      return;
    }

    const updateData: any = {};
    if (name) updateData.name = name.trim();
    if (level) updateData.level = level;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).populate('classId', 'name level');

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: {
        user: user.toJSON()
      }
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

