import { fileTypeFromBuffer } from 'file-type';
import { AppError } from '../lib/appError.js';

const allowedExt = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp']);
const mapMimeToExt = (mime) => {
  switch (mime) {
  case 'image/jpeg':
    return 'jpg';
  case 'image/png':
    return 'png';
  case 'image/gif':
    return 'gif';
  case 'image/webp':
    return 'webp';
  default:
    return null;
  }
};

export const ensureImage = async (req, res, next) => {
  try {
    if (!req.file) throw AppError.badRequest('No image provided');

    const type = await fileTypeFromBuffer(req.file.buffer);
    if (!type || !allowedExt.has(type.ext)) {
      throw AppError.unsupported('Unsupported or corrupted image', {
        detected: type,
      });
    }

    const safeExt = mapMimeToExt(type.mime);
    if (!safeExt) {
      throw AppError.unsupported('Unsupported image type', {
        mime: type?.mime,
      });
    }

    const originalBase = (req.file.originalname || 'upload').replace(/\.[^/.]+$/, '');
    req.file.detectedMime = type.mime;
    req.file.safeFilename = `${originalBase}.${safeExt}`;
    return next();
  } catch (e) {
    next(e);
  }
};
