import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { ok } from '../middleware/response.js';
import { AppError } from '../lib/appError.js';
import { uploadSingle } from '../middleware/upload.js';
import { ensureImage } from '../middleware/ensureImage.js';
import {
  getAllHeroes,
  getHeroById,
  createHero,
  updateHero,
  deleteHero,
  addHeroImage,
  removeHeroImage,
  getHeroImage,
} from '../services/index.js';
import { heroToDto } from '../utils/heroPresenter.js';
import { logger } from '../lib/logger.js';
import { validateSuperhero } from '../middleware/validateSuperhero.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const result = await getAllHeroes(page, limit);
    ok(
      res,
      {
        superheroes: result.superheroes.map((h) => heroToDto(h, req)),
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
      200,
    );
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw AppError.badRequest('Superhero id is required');

    const hero = await getHeroById(id);
    if (!hero) throw AppError.notFound('Superhero not found');

    ok(res, heroToDto(hero, req));
  }),
);

router.post(
  '/',
  validateSuperhero,
  asyncHandler(async (req, res) => {
    const hero = await createHero(req.body);
    ok(res, heroToDto(hero, req), 201);
  }),
);

router.put(
  '/:id',
  validateSuperhero,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw AppError.badRequest('Superhero id is required');

    const hero = await updateHero(id, req.body);
    if (!hero) throw AppError.notFound('Superhero not found');

    ok(res, heroToDto(hero, req));
  }),
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw AppError.badRequest('Superhero id is required');

    const result = await deleteHero(id);
    if (!result) throw AppError.notFound('Superhero not found');

    ok(res, { message: result.message });
  }),
);

router.post(
  '/:id/images',
  uploadSingle,
  ensureImage,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw AppError.badRequest('Superhero id is required');

    logger.info({
      msg: 'Image upload',
      heroId: id,
      filename: req.file.safeFilename,
      detected: req.file.detectedMime,
      size: req.file.size,
    });

    const hero = await addHeroImage(
      id,
      req.file.buffer,
      req.file.safeFilename,
      req.file.detectedMime,
    );

    if (!hero) throw AppError.notFound('Superhero not found');
    ok(res, heroToDto(hero, req));
  }),
);

router.get(
  '/:id/images/:imageId',
  asyncHandler(async (req, res) => {
    const { imageId } = req.params;
    if (!imageId) throw AppError.badRequest('Image id is required');

    const imageData = await getHeroImage(imageId);
    if (!imageData) throw AppError.notFound('Image not found');

    res.set({
      'Content-Type': imageData.contentType,
      'Content-Length': imageData.length,
      'Content-Disposition': `inline; filename="${imageData.filename}"`,
    });

    imageData.stream.pipe(res);
  }),
);

router.delete(
  '/:id/images/:imageId',
  asyncHandler(async (req, res) => {
    const { id, imageId } = req.params;
    if (!id || !imageId) throw AppError.badRequest('Superhero id and image id are required');

    const hero = await removeHeroImage(id, imageId);
    if (!hero) throw AppError.notFound('Superhero or image not found');

    ok(res, heroToDto(hero, req));
  }),
);

export default router;
