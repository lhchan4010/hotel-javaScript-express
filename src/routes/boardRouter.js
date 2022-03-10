import express from 'express';
import { getBoard } from '../controllers/boardController';
import { postCreateBoard } from '../controllers/globalController';

const boardRouter = express.Router();

boardRouter.route('/').get(getBoard);

export default boardRouter;
