# Backend App Éducatif 📚

Backend complet pour l'application éducative de lecture de poèmes, développé avec Node.js, Express, TypeScript et MongoDB.

## 🚀 Fonctionnalités

- **Authentification JWT** avec refresh tokens
- **Gestion des utilisateurs** (étudiants, enseignants, administrateurs)
- **Bibliothèque de poèmes** avec recherche et filtres
- **Système de lecture** avec enregistrement audio
- **Suivi des progrès** et statistiques détaillées
- **Système de favoris**
- **API RESTful** complète
- **Upload de fichiers** sécurisé
- **Rate limiting** et sécurité
- **Validation des données** avec Joi
- **Gestion d'erreurs** centralisée

## 🛠️ Technologies

- **Node.js** + **Express** + **TypeScript**
- **MongoDB** + **Mongoose**
- **JWT** pour l'authentification
- **Multer** pour l'upload de fichiers
- **Joi** pour la validation
- **Helmet** + **CORS** pour la sécurité
- **Morgan** pour les logs
- **Compression** pour les performances

## 📦 Installation

### Prérequis

- Node.js (v18 ou supérieur)
- MongoDB (v5 ou supérieur)
- npm ou yarn

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd backend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de l'environnement**
```bash
cp .env.example .env
```

Modifier le fichier `.env` avec vos configurations :
```env
# Base de données
MONGODB_URI=mongodb://localhost:27017/app_educatif

# Sécurité
JWT_SECRET=votre_secret_jwt_super_securise_ici

# Serveur
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000
```

4. **Démarrer MongoDB**
```bash
# Avec Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Ou avec MongoDB installé localement
mongod
```

5. **Peupler la base de données (optionnel)**
```bash
npm run seed
```

6. **Démarrer le serveur**
```bash
# Mode développement
npm run dev

# Mode production
npm run build
npm start
```

## 🔧 Scripts disponibles

```bash
npm run dev          # Démarrer en mode développement avec nodemon
npm run build        # Compiler TypeScript vers JavaScript
npm start            # Démarrer le serveur en production
npm run seed         # Peupler la base de données avec des données de test
npm test             # Lancer les tests (à implémenter)
```

## 📁 Structure du projet

```
backend/
├── src/
│   ├── config/           # Configuration (DB, environnement)
│   ├── controllers/      # Contrôleurs des routes
│   ├── middleware/       # Middleware personnalisés
│   ├── models/          # Modèles Mongoose
│   ├── routes/          # Définition des routes
│   ├── services/        # Logique métier
│   ├── utils/           # Utilitaires (JWT, validation, etc.)
│   ├── scripts/         # Scripts utilitaires
│   ├── app.ts           # Configuration Express
│   └── server.ts        # Point d'entrée du serveur
├── uploads/             # Fichiers uploadés
├── dist/               # Code compilé (généré)
├── .env.example        # Exemple de configuration
├── package.json
├── tsconfig.json
└── README.md
```

## 🔐 Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification :

- **Access Token** : Valide 7 jours (configurable)
- **Refresh Token** : Valide 30 jours
- **Rôles** : `student`, `teacher`, `admin`

### Endpoints d'authentification

```
POST /api/auth/register     # Inscription
POST /api/auth/login        # Connexion
POST /api/auth/refresh-token # Rafraîchir le token
GET  /api/auth/profile      # Profil utilisateur
PUT  /api/auth/profile      # Mettre à jour le profil
POST /api/auth/logout       # Déconnexion
```

## 📊 Modèles de données

### User (Utilisateur)
```typescript
{
  email: string;
  password: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  level?: string;
  classId?: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
}
```

### Poem (Poème)
```typescript
{
  title: string;
  author: string;
  content: string;
  theme: string;
  level: 'debutant' | 'intermediaire' | 'avance';
  difficulty: 'facile' | 'moyen' | 'difficile';
  durationMinutes: number;
  description?: string;
  tags: string[];
  createdBy: ObjectId;
  readCount: number;
  averageScore?: number;
}
```

### Reading (Lecture)
```typescript
{
  userId: ObjectId;
  poemId: ObjectId;
  score: number;
  durationSeconds: number;
  completed: boolean;
  recordingUrl?: string;
  feedback?: string;
  mistakes?: Array<{
    word: string;
    position: number;
    type: 'pronunciation' | 'fluency' | 'accuracy';
    severity: 'low' | 'medium' | 'high';
  }>;
  sessionData?: {
    startTime: Date;
    endTime: Date;
    pauseCount: number;
    totalPauseTime: number;
  };
}
```

## 🔒 Sécurité

- **Helmet** : Protection contre les vulnérabilités communes
- **CORS** : Configuration des origines autorisées
- **Rate Limiting** : Limitation du nombre de requêtes
- **Validation** : Validation stricte des données avec Joi
- **Hachage des mots de passe** : bcryptjs avec salt
- **JWT sécurisé** : Tokens signés avec secret fort

## 📈 Monitoring et Logs

- **Morgan** : Logs des requêtes HTTP
- **Gestion d'erreurs** centralisée
- **Health check** : `GET /health`
- **Logs structurés** avec timestamps

## 🧪 Tests

```bash
npm test
```

Les tests couvrent :
- Authentification
- CRUD des entités
- Validation des données
- Gestion d'erreurs

## 🚀 Déploiement

### Variables d'environnement de production

```env
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db
JWT_SECRET=your-super-secure-jwt-secret
PORT=5000
CORS_ORIGIN=https://your-frontend-domain.com
```

### Docker (optionnel)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 5000
CMD ["node", "dist/server.js"]
```

## 🔧 Configuration avancée

### Rate Limiting
```env
RATE_LIMIT_WINDOW_MS=900000    # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100    # 100 requêtes max
```

### Upload de fichiers
```env
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760         # 10MB
ALLOWED_FILE_TYPES=audio/mpeg,audio/wav,audio/mp3
```

## 🐛 Dépannage

### Erreurs communes

1. **Erreur de connexion MongoDB**
   - Vérifier que MongoDB est démarré
   - Vérifier l'URI de connexion dans `.env`

2. **Erreur JWT_SECRET manquant**
   - Copier `.env.example` vers `.env`
   - Définir un JWT_SECRET fort

3. **Port déjà utilisé**
   - Changer le PORT dans `.env`
   - Ou arrêter le processus utilisant le port

### Logs de débogage

```bash
# Activer les logs détaillés
LOG_LEVEL=debug npm run dev
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Créer une issue sur GitHub
- Contacter l'équipe de développement

---

Développé avec ❤️ pour l'éducation
