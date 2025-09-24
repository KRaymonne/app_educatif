import mongoose, { Document, Schema } from 'mongoose';

export interface IReading extends Document {
  userId: mongoose.Types.ObjectId;
  poemId: mongoose.Types.ObjectId;
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
  createdAt: Date;
  updatedAt: Date;
}

const readingSchema = new Schema<IReading>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'utilisateur est requis']
  },
  poemId: {
    type: Schema.Types.ObjectId,
    ref: 'Poem',
    required: [true, 'Le poème est requis']
  },
  score: {
    type: Number,
    required: [true, 'Le score est requis'],
    min: [0, 'Le score ne peut pas être négatif'],
    max: [100, 'Le score ne peut pas dépasser 100']
  },
  durationSeconds: {
    type: Number,
    required: [true, 'La durée est requise'],
    min: [1, 'La durée doit être d\'au moins 1 seconde']
  },
  completed: {
    type: Boolean,
    required: true,
    default: false
  },
  recordingUrl: {
    type: String,
    trim: true
  },
  feedback: {
    type: String,
    trim: true,
    maxlength: [1000, 'Le feedback ne peut pas dépasser 1000 caractères']
  },
  mistakes: [{
    word: {
      type: String,
      required: true,
      trim: true
    },
    position: {
      type: Number,
      required: true,
      min: 0
    },
    type: {
      type: String,
      enum: ['pronunciation', 'fluency', 'accuracy'],
      required: true
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true
    }
  }],
  sessionData: {
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date
    },
    pauseCount: {
      type: Number,
      default: 0,
      min: 0
    },
    totalPauseTime: {
      type: Number,
      default: 0,
      min: 0
    }
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances
readingSchema.index({ userId: 1, createdAt: -1 });
readingSchema.index({ poemId: 1, createdAt: -1 });
readingSchema.index({ userId: 1, poemId: 1 });
readingSchema.index({ completed: 1 });
readingSchema.index({ score: -1 });
readingSchema.index({ createdAt: -1 });

// Index composé pour les statistiques
readingSchema.index({ userId: 1, completed: 1, createdAt: -1 });

// Middleware pour mettre à jour les statistiques du poème
readingSchema.post('save', async function(doc) {
  if (doc.completed) {
    const Poem = mongoose.model('Poem');
    const poem = await Poem.findById(doc.poemId);
    if (poem) {
      await poem.updateAverageScore();
    }
  }
});

// Méthode pour calculer le pourcentage d'amélioration
readingSchema.methods.getImprovementPercentage = async function() {
  const previousReading = await mongoose.model('Reading').findOne({
    userId: this.userId,
    poemId: this.poemId,
    completed: true,
    createdAt: { $lt: this.createdAt }
  }).sort({ createdAt: -1 });

  if (!previousReading) return 0;

  const improvement = ((this.score - previousReading.score) / previousReading.score) * 100;
  return Math.round(improvement * 100) / 100;
};

// Méthode pour obtenir les statistiques de lecture
readingSchema.statics.getUserStats = async function(userId: string, startDate?: Date, endDate?: Date) {
  const matchConditions: any = { 
    userId: new mongoose.Types.ObjectId(userId),
    completed: true 
  };

  if (startDate || endDate) {
    matchConditions.createdAt = {};
    if (startDate) matchConditions.createdAt.$gte = startDate;
    if (endDate) matchConditions.createdAt.$lte = endDate;
  }

  const stats = await this.aggregate([
    { $match: matchConditions },
    {
      $group: {
        _id: null,
        totalReadings: { $sum: 1 },
        averageScore: { $avg: '$score' },
        totalTimeMinutes: { $sum: { $divide: ['$durationSeconds', 60] } },
        bestScore: { $max: '$score' },
        worstScore: { $min: '$score' }
      }
    }
  ]);

  return stats[0] || {
    totalReadings: 0,
    averageScore: 0,
    totalTimeMinutes: 0,
    bestScore: 0,
    worstScore: 0
  };
};

export const Reading = mongoose.model<IReading>('Reading', readingSchema);
