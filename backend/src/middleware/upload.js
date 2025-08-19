import multer from 'multer';
import { AppError } from '../lib/appError.js';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const allowed = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

const storage = multer.memoryStorage();

const filterByMime = (req, file, cb) => {
  if (!allowed.has(file.mimetype)) {
    return cb(new AppError('Unsupported media type', 415, { mimetype: file.mimetype }));
  }
  cb(null, true);
};

export const uploadSingle = multer({
  storage,
  fileFilter: filterByMime,
  limits: { fileSize: MAX_FILE_SIZE },
}).single('image');
