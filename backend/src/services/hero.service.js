import mongoose from 'mongoose';
import { getGridFSBucket } from '../config/gridfs.js';
import Superhero from '../models/Superhero.js';
import { AppError } from '../lib/appError.js';
import { isValidId } from './utils/validation.js';

export const getAllHeroes = async (page = 1, limit = 5) => {
  const skip = (page - 1) * limit;
  const total = await Superhero.countDocuments();
  const superheroes = await Superhero.find().skip(skip).limit(limit).sort({ created_at: -1 });

  return {
    superheroes: superheroes.map((h) => h.toJSON()),
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit),
  };
};

export const getHeroById = async (id) => {
  if (!isValidId(id)) return null;
  const hero = await Superhero.findById(id);
  return hero ? hero.toJSON() : null;
};

export const createHero = async (data) => {
  try {
    const hero = new Superhero(data);
    const saved = await hero.save();
    return saved.toJSON();
  } catch (e) {
    if (e.name === 'ValidationError') {
      const errors = Object.values(e.errors).map((x) => x.message);
      throw AppError.badRequest('Validation failed', errors);
    }
    throw AppError.internal('Error creating superhero', { cause: e.message });
  }
};

export const updateHero = async (id, updateData) => {
  if (!isValidId(id)) return null;
  try {
    const hero = await Superhero.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    return hero ? hero.toJSON() : null;
  } catch (e) {
    if (e.name === 'ValidationError') {
      const errors = Object.values(e.errors).map((x) => x.message);
      throw AppError.badRequest('Validation failed', errors);
    }
    if (e.name === 'CastError') return null;
    throw AppError.internal('Error updating superhero', { cause: e.message });
  }
};

export const deleteHero = async (id) => {
  if (!isValidId(id)) return null;

  const bucket = getGridFSBucket();
  let session;
  try {
    session = await mongoose.startSession();

    await session.withTransaction(async () => {
      const hero = await Superhero.findById(id).session(session);
      if (!hero) throw AppError.notFound('Superhero not found');

      await Superhero.deleteOne({ _id: id }, { session });

      await Promise.all(
        hero.images.map(async (img) => {
          try {
            await bucket.delete(img.fileId);
          } catch (error) {
            console.warn(`Failed to delete image ${img.fileId}:`, error.message);
          }
        }),
      );
    });

    return { message: 'Superhero deleted successfully' };
  } catch (e) {
    if (e instanceof AppError) throw e;
    throw AppError.internal('Error deleting superhero', { cause: e.message });
  } finally {
    session?.endSession();
  }
};
