import express from 'express';
import {
  getBoardData,
  postCreateBoard,
} from '../controllers/boardController';

const apiRouter = express.Router();

apiRouter
  .route('/:id([0-9a-f]{24})/board')
  .get(getBoardData)
  .post(postCreateBoard);

export default apiRouter;
