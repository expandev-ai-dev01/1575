import { Router } from 'express';
import * as taskController from '@/api/v1/internal/task/controller';
import * as taskDetailController from '@/api/v1/internal/task/detail/controller';
import * as taskCategoryController from '@/api/v1/internal/task/detail/category/controller';
import * as categoryController from '@/api/v1/internal/category/controller';
import * as categoryDetailController from '@/api/v1/internal/category/detail/controller';

const router = Router();

// Task routes
router.get('/task', taskController.getHandler);
router.post('/task', taskController.postHandler);
router.get('/task/:id', taskDetailController.getHandler);
router.put('/task/:id', taskDetailController.putHandler);
router.delete('/task/:id', taskDetailController.deleteHandler);

// Task category association routes
router.post('/task/:id/category', taskCategoryController.postHandler);
router.delete('/task/:id/category/:idCategory', taskCategoryController.deleteHandler);

// Category routes
router.get('/category', categoryController.getHandler);
router.post('/category', categoryController.postHandler);
router.get('/category/:id', categoryDetailController.getHandler);
router.put('/category/:id', categoryDetailController.putHandler);
router.delete('/category/:id', categoryDetailController.deleteHandler);

export default router;
