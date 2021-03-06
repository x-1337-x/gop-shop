import express, { Request, Response, NextFunction } from 'express';
import { categoriesListToTree } from '../../utils/treeBuilder';
import { prisma } from '../../client';

export const categoryRouter = express.Router();

categoryRouter
  .route('/categories/root')
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await prisma.category.findMany({
        where: { parentId: null },
        orderBy: { sortOrder: 'asc' },
      });
      res.send(categories);
      return;
    } catch (error) {
      next(error);
    }
  });

categoryRouter
  .route('/categories/tree')
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await prisma.category.findMany({
        orderBy: { sortOrder: 'asc' },
      });
      const catTree = categoriesListToTree(categories);
      res.send(catTree);
      return;
    } catch (error) {
      next(error);
    }
  });

categoryRouter
  .route('/categories')
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await prisma.category.findMany();
      res.send(categories);
      return;
    } catch (error) {
      next(error);
    }
  })
  .post(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, parentId = null, isActive } = req.body;
      if (!name) {
        res.sendStatus(400);
        return;
      }
      const category = await prisma.category.create({
        data: {
          name,
          parentId,
          isActive,
        },
      });
      res.send(category);
      return;
    } catch (error) {
      next(error);
    }
  });

categoryRouter
  .param('id', (req, res, next, id) => {
    if (Number.isNaN(Number(id)) || Number(id) < 1) {
      res.status(400).send('id must be int');
      return;
    }
    next();
  })
  .route('/categories/:id')
  .get(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await prisma.category.findUnique({
        where: { id: Number(req.params.id) },
      });
      if (!category) {
        res.status(404).send('Category not found');
        return;
      }
      res.send(category);
      return;
    } catch (error) {
      next(error);
    }
  })
  .put(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, parentId = null, sortOrder, isActive = true } = req.body;
      const category = await prisma.category.update({
        where: { id: Number(req.params.id) },
        data: {
          name,
          parentId,
          sortOrder,
          isActive,
        },
      });
      res.send(category);
      return;
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.type === 'all') {
        const category = await prisma.category.delete({
          where: { id: Number(req.params.id) },
        });
        res.send(category);
        return;
      }

      if (req.body.type === 'move') {
        const { newParentId } = req.body;

        const [updatedCategory, deletedCategoty] = await prisma.$transaction([
          prisma.category.updateMany({
            where: { parentId: Number(req.params.id) },
            data: {
              parentId: newParentId,
            },
          }),
          prisma.category.delete({
            where: { id: Number(req.params.id) },
          }),
        ]);
        console.log('Updated: ', updatedCategory);
        console.log('Deleted: ', deletedCategoty);
        res.json({
          msg: `category has been assigned as a child to a category with id ${newParentId}`,
        });
        return;
      }
    } catch (error) {
      next(error);
    }
  });
