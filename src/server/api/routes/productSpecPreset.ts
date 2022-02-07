import express, { Request, Response, NextFunction } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  // rejectOnNotFound: true,
  errorFormat: 'pretty',
  log: ['query', 'info', 'warn', 'error'],
});

export const productSpecPresetRouter = express.Router();

productSpecPresetRouter
  .route('/productSpecPresets')
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const specPreset = await prisma.specPreset.findMany({
        orderBy: { name: 'asc' },
      });
      res.send(specPreset);
      return;
    } catch (error) {
      next(error);
    }
  })
  .post(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body as Prisma.SpecPresetCreateInput;
      const specPreset = await prisma.specPreset.create({
        data,
      });
      res.json(specPreset);
      return;
    } catch (error) {
      next(error);
    }
  });

productSpecPresetRouter
  .param('id', (req, res, next, id) => {
    if (Number.isNaN(Number(id)) || Number(id) < 1) {
      res.status(400).send('id must be int');
      return;
    }
    next();
  })
  .route('/productSpecPresets/:id')
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const specPreset = await prisma.specPreset.findUnique({
        where: {
          id,
        },
      });

      if (!specPreset) {
        res.status(404).send('Spec not found');
        return;
      }

      res.json(specPreset);
      return;
    } catch (error) {
      next(error);
    }
  })
  .put(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;
      const specPreset = await prisma.specPreset.update({
        where: { id: Number(req.params.id) },
        data: {
          name,
        },
      });
      res.send(specPreset);
      return;
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const specPreset = await prisma.specPreset.delete({
        where: { id: Number(req.params.id) },
      });
      res.send(specPreset);
      return;
    } catch (error) {
      next(error);
    }
  });
