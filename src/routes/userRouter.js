import express from 'express';
import {
  getAccounting,
  getMonth,
  getRevenue,
} from '../controllers/userController';

const userRouter = express.Router();

userRouter.route('/accounting').get(getAccounting);
userRouter
  .route('/accounting/revenue/:range')
  .get(getRevenue);

export default userRouter;
