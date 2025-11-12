import { Router } from 'express';
import * as taskController from '@/api/v1/internal/task/controller';
import * as taskDetailController from '@/api/v1/internal/task/detail/controller';

const router = Router();

// Task routes
router.get('/task', taskController.getHandler);
router.post('/task', taskController.postHandler);
router.get('/task/:id', taskDetailController.getHandler);
router.put('/task/:id', taskDetailController.putHandler);
router.delete('/task/:id', taskDetailController.deleteHandler);

export default router;
