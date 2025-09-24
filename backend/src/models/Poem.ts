import mongoose, { Document, Schema } from 'mongoose';

export interface IPoem extends Document {
  title: string;
  author: string;
  content: string;
  theme: string;
  level: 'debutant' | 'intermediaire' | 'avance';
  difficulty: 'facile' | 'moyen' | 'difficile';
  durationMinutes: number;
  description?: string;
  tags: string[];
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  readCount: number;
  averageScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

const poemSchema = new Schema<IPoem>({
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
    maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères']
  },
  author: {
    type: String,
    required: [true, 'L\'auteur est requis'],
    trim: true,
    maxlength: [100, 'Le nom de l\'auteur ne peut pas dépasser 100 caractères']
  },
  content: {
    type: String,
    required: [true, 'Le contenu est requis'],
    trim: true,
    maxlength: [10000, 'Le contenu ne peut pas dépasser 10000 caractères']
  },
  theme: {
    type: String,
    required: [true, 'Le thème est requis'],
    trim: true,
    maxlength: [50, 'Le thème ne peut pas dépasser 50 caractères']
  },
  level: {
    type: String,
    enum: ['debutant', 'intermediaire', 'avance'],
    required: [true, 'Le niveau est requis']
  },
  difficulty: {
    type: String,
    enum: ['facile', 'moyen', 'difficile'],
    required: [true, 'La difficulté est requise']
  },
  durationMinutes: {
    type: Number,
    required: [true, 'La durée est requise'],
    min: [1, 'La durée doit être d\'au moins 1 minute'],
    max: [60, 'La durée ne peut pas dépasser 60 minutes']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Un tag ne peut pas dépasser 30 caractères']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  readCount: {
    type: Number,
    default: 0,
    min: 0
  },
  averageScore: {
    type: Number,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances
poemSchema.index({ title: 'text', content: 'text', author: 'text' });
poemSchema.index({ level: 1, difficulty: 1 });
poemSchema.index({ theme: 1 });
poemSchema.index({ isActive: 1 });
poemSchema.index({ createdAt: -1 });
poemSchema.index({ readCount: -1 });
poemSchema.index({ averageScore: -1 });

// Middleware pour incrémenter le compteur de lectures
poemSchema.methods.incrementReadCount = function() {
  this.readCount += 1;
  return this.save();
};

// Méthode pour calculer le score moyen
poemSchema.methods.updateAverageScore = async function() {
  const Reading = mongoose.model('Reading');
  const result = await Reading.aggregate([
    { $match: { poemId: this._id, completed: true } },
    { $group: { _id: null, averageScore: { $avg: '$score' } } }
  ]);
  
  if (result.length > 0) {
    this.averageScore = Math.round(result[0].averageScore * 100) / 100;
    await this.save();
  }
};

export const Poem = mongoose.model<IPoem>('Poem', poemSchema);
