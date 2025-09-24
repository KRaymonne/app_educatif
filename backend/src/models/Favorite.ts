import mongoose, { Document, Schema } from 'mongoose';

export interface IFavorite extends Document {
  userId: mongoose.Types.ObjectId;
  poemId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const favoriteSchema = new Schema<IFavorite>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'utilisateur est requis']
  },
  poemId: {
    type: Schema.Types.ObjectId,
    ref: 'Poem',
    required: [true, 'Le poème est requis']
  }
}, {
  timestamps: true
});

// Index unique pour éviter les doublons
favoriteSchema.index({ userId: 1, poemId: 1 }, { unique: true });

// Index pour améliorer les performances
favoriteSchema.index({ userId: 1, createdAt: -1 });
favoriteSchema.index({ poemId: 1 });

// Méthode statique pour vérifier si un poème est en favori
favoriteSchema.statics.isFavorite = async function(userId: string, poemId: string): Promise<boolean> {
  const favorite = await this.findOne({ 
    userId: new mongoose.Types.ObjectId(userId), 
    poemId: new mongoose.Types.ObjectId(poemId) 
  });
  return !!favorite;
};

// Méthode statique pour obtenir les favoris d'un utilisateur avec pagination
favoriteSchema.statics.getUserFavorites = async function(
  userId: string, 
  page: number = 1, 
  limit: number = 10
) {
  const skip = (page - 1) * limit;
  
  const favorites = await this.find({ userId: new mongoose.Types.ObjectId(userId) })
    .populate({
      path: 'poemId',
      select: 'title author theme level difficulty durationMinutes description averageScore readCount'
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await this.countDocuments({ userId: new mongoose.Types.ObjectId(userId) });

  return {
    favorites,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    }
  };
};

// Méthode statique pour basculer le statut favori
favoriteSchema.statics.toggleFavorite = async function(userId: string, poemId: string) {
  const existingFavorite = await this.findOne({ 
    userId: new mongoose.Types.ObjectId(userId), 
    poemId: new mongoose.Types.ObjectId(poemId) 
  });

  if (existingFavorite) {
    await this.deleteOne({ _id: existingFavorite._id });
    return { action: 'removed', favorite: null };
  } else {
    const newFavorite = await this.create({ 
      userId: new mongoose.Types.ObjectId(userId), 
      poemId: new mongoose.Types.ObjectId(poemId) 
    });
    await newFavorite.populate('poemId', 'title author theme level difficulty');
    return { action: 'added', favorite: newFavorite };
  }
};

export const Favorite = mongoose.model<IFavorite>('Favorite', favoriteSchema);
