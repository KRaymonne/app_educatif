import mongoose, { Document, Schema } from 'mongoose';

export interface IProgress extends Document {
  userId: mongoose.Types.ObjectId;
  weekStart: Date;
  readingsCompleted: number;
  totalTimeMinutes: number;
  averageScore: number;
  improvementPercentage: number;
  weeklyGoal?: number;
  goalAchieved: boolean;
  streakDays: number;
  bestScore: number;
  worstScore: number;
  totalMistakes: number;
  createdAt: Date;
  updatedAt: Date;
}

const progressSchema = new Schema<IProgress>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'utilisateur est requis']
  },
  weekStart: {
    type: Date,
    required: [true, 'La date de début de semaine est requise']
  },
  readingsCompleted: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Le nombre de lectures ne peut pas être négatif']
  },
  totalTimeMinutes: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Le temps total ne peut pas être négatif']
  },
  averageScore: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Le score moyen ne peut pas être négatif'],
    max: [100, 'Le score moyen ne peut pas dépasser 100']
  },
  improvementPercentage: {
    type: Number,
    required: true,
    default: 0
  },
  weeklyGoal: {
    type: Number,
    min: [1, 'L\'objectif hebdomadaire doit être d\'au moins 1'],
    max: [50, 'L\'objectif hebdomadaire ne peut pas dépasser 50']
  },
  goalAchieved: {
    type: Boolean,
    default: false
  },
  streakDays: {
    type: Number,
    default: 0,
    min: [0, 'La série ne peut pas être négative']
  },
  bestScore: {
    type: Number,
    default: 0,
    min: [0, 'Le meilleur score ne peut pas être négatif'],
    max: [100, 'Le meilleur score ne peut pas dépasser 100']
  },
  worstScore: {
    type: Number,
    default: 0,
    min: [0, 'Le pire score ne peut pas être négatif'],
    max: [100, 'Le pire score ne peut pas dépasser 100']
  },
  totalMistakes: {
    type: Number,
    default: 0,
    min: [0, 'Le nombre total d\'erreurs ne peut pas être négatif']
  }
}, {
  timestamps: true
});

// Index unique pour éviter les doublons par utilisateur et semaine
progressSchema.index({ userId: 1, weekStart: 1 }, { unique: true });

// Index pour améliorer les performances
progressSchema.index({ userId: 1, createdAt: -1 });
progressSchema.index({ weekStart: -1 });
progressSchema.index({ averageScore: -1 });

// Méthode statique pour obtenir ou créer le progrès de la semaine courante
progressSchema.statics.getCurrentWeekProgress = async function(userId: string) {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay()); // Début de semaine (dimanche)
  weekStart.setHours(0, 0, 0, 0);

  let progress = await this.findOne({ 
    userId: new mongoose.Types.ObjectId(userId), 
    weekStart 
  });

  if (!progress) {
    progress = await this.create({
      userId: new mongoose.Types.ObjectId(userId),
      weekStart,
      readingsCompleted: 0,
      totalTimeMinutes: 0,
      averageScore: 0,
      improvementPercentage: 0,
      goalAchieved: false,
      streakDays: 0,
      bestScore: 0,
      worstScore: 0,
      totalMistakes: 0
    });
  }

  return progress;
};

// Méthode statique pour mettre à jour le progrès après une lecture
progressSchema.statics.updateAfterReading = async function(userId: string, reading: any) {
  const progress = await this.getCurrentWeekProgress(userId);
  
  // Recalculer les statistiques de la semaine
  const Reading = mongoose.model('Reading');
  const weekEnd = new Date(progress.weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const weeklyStats = await Reading.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        completed: true,
        createdAt: { $gte: progress.weekStart, $lt: weekEnd }
      }
    },
    {
      $group: {
        _id: null,
        readingsCompleted: { $sum: 1 },
        totalTimeMinutes: { $sum: { $divide: ['$durationSeconds', 60] } },
        averageScore: { $avg: '$score' },
        bestScore: { $max: '$score' },
        worstScore: { $min: '$score' },
        totalMistakes: { $sum: { $size: { $ifNull: ['$mistakes', []] } } }
      }
    }
  ]);

  if (weeklyStats.length > 0) {
    const stats = weeklyStats[0];
    
    // Calculer l'amélioration par rapport à la semaine précédente
    const previousWeekStart = new Date(progress.weekStart);
    previousWeekStart.setDate(previousWeekStart.getDate() - 7);
    
    const previousProgress = await this.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      weekStart: previousWeekStart
    });

    let improvementPercentage = 0;
    if (previousProgress && previousProgress.averageScore > 0) {
      improvementPercentage = ((stats.averageScore - previousProgress.averageScore) / previousProgress.averageScore) * 100;
    }

    // Mettre à jour le progrès
    progress.readingsCompleted = stats.readingsCompleted;
    progress.totalTimeMinutes = Math.round(stats.totalTimeMinutes * 100) / 100;
    progress.averageScore = Math.round(stats.averageScore * 100) / 100;
    progress.improvementPercentage = Math.round(improvementPercentage * 100) / 100;
    progress.bestScore = stats.bestScore;
    progress.worstScore = stats.worstScore;
    progress.totalMistakes = stats.totalMistakes;
    
    // Vérifier si l'objectif est atteint
    if (progress.weeklyGoal) {
      progress.goalAchieved = progress.readingsCompleted >= progress.weeklyGoal;
    }

    await progress.save();
  }

  return progress;
};

// Méthode statique pour obtenir les statistiques mensuelles
progressSchema.statics.getMonthlyStats = async function(userId: string, year: number, month: number) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const monthlyProgress = await this.find({
    userId: new mongoose.Types.ObjectId(userId),
    weekStart: { $gte: startDate, $lte: endDate }
  }).sort({ weekStart: 1 });

  const totalStats = monthlyProgress.reduce((acc, week) => ({
    totalReadings: acc.totalReadings + week.readingsCompleted,
    totalTimeMinutes: acc.totalTimeMinutes + week.totalTimeMinutes,
    averageScore: acc.averageScore + week.averageScore,
    goalsAchieved: acc.goalsAchieved + (week.goalAchieved ? 1 : 0),
    totalMistakes: acc.totalMistakes + week.totalMistakes
  }), {
    totalReadings: 0,
    totalTimeMinutes: 0,
    averageScore: 0,
    goalsAchieved: 0,
    totalMistakes: 0
  });

  if (monthlyProgress.length > 0) {
    totalStats.averageScore = Math.round((totalStats.averageScore / monthlyProgress.length) * 100) / 100;
  }

  return {
    monthlyProgress,
    totalStats,
    weeksInMonth: monthlyProgress.length
  };
};

export const Progress = mongoose.model<IProgress>('Progress', progressSchema);
