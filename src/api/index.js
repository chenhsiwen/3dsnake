import { Router } from 'express';


import userRouter from './user';
import rankRouter from './rank';

const router = new Router();

router.use('/users',userRouter);
router.use('/ranks',rankRouter);

export default router;
