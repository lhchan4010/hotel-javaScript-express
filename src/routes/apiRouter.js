import express from 'express';
import { postCreateBoard } from '../controllers/boardController';

const apiRouter = express.Router();

apiRouter.route('/board').post(postCreateBoard);

export default apiRouter;
