import mongoose from 'mongoose';
import { Readable } from 'stream';
import Superhero from '../models/Superhero.js';
import { getGridFSBucket } from '../config/gridfs.js';
import { AppError } from '../lib/appError.js';
import { isValidId } from './utils/validation.js';

export const addHeroImage = async (id, fileBuffer, filename, contentType) => {
  if (!isValidId(id)) return null;
  const bucket = getGridFSBucket();
  let session;

  try {
    session = await mongoose.startSession();
    let fileId;

    await session.withTransaction(async () => {
      const readable = Readable.from(fileBuffer);
      const uploadStream = bucket.openUploadStream(filename, {
        contentType,
        metadata: { heroId: id },
      });
      fileId = uploadStream.id;

      await new Promise((resolve, reject) => {
        uploadStream.on('finish', resolve);
        uploadStream.on('error', reject);
        readable.pipe(uploadStream);
      });

      const hero = await Superhero.findByIdAndUpdate(
        id,
        { $push: { images: { fileId, filename, contentType } } },
        { new: true, session },
      );

      if (!hero) throw AppError.notFound('Superhero not found');
    });

    return (await Superhero.findById(id))?.toJSON() ?? null;
  } catch (e) {
    if (e instanceof AppError) throw e;
    throw AppError.internal('Error adding image', { cause: e.message });
  } finally {
    session?.endSession();
  }
};

export const removeHeroImage = async (id, imageId) => {
  if (!isValidId(id) || !isValidId(imageId)) return null;

  const bucket = getGridFSBucket();
  let session;
  try {
    session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const hero = await Superhero.findById(id).session(session);
      if (!hero) throw AppError.notFound('Superhero not found');

      const idx = hero.images.findIndex((img) => String(img.fileId) === String(imageId));
      if (idx === -1) throw AppError.notFound('Image not found');

      await Superhero.updateOne(
        { _id: id },
        { $pull: { images: { fileId: imageId } } },
        { session },
      );

      await bucket.delete(new mongoose.Types.ObjectId(imageId));
    });

    return (await Superhero.findById(id))?.toJSON() ?? null;
  } catch (e) {
    if (e instanceof AppError) throw e;
    throw AppError.internal('Error removing image', { cause: e.message });
  } finally {
    session?.endSession();
  }
};

export const getHeroImage = async (imageId) => {
  if (!isValidId(imageId)) return null;
  try {
    const bucket = getGridFSBucket();
    const objectId = new mongoose.Types.ObjectId(imageId);
    const files = await bucket.find({ _id: objectId }).toArray();
    if (!files?.length) return null;

    const file = files[0];
    const stream = bucket.openDownloadStream(objectId);
    return {
      stream,
      contentType: file.contentType,
      filename: file.filename,
      length: file.length,
    };
  } catch (e) {
    throw AppError.internal('Error getting image', { cause: e.message });
  }
};
