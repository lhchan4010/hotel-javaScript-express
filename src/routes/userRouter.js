import express from 'express';
import {
  getAccounting,
  getMonth,
  getRevenue,
} from '../controllers/userController';

const userRouter = express.Router();

userRouter.route('/accounting').get(getAccounting);
userRouter.route('/accounting/revenue').get(getRevenue);

userRouter.route('/accounting/revenue/month').get(getMonth);

export default userRouter;
