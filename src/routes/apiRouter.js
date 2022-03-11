import express from 'express';
import {
  getBoardData,
  postUpdateBoard,
} from '../controllers/boardController';

const apiRouter = express.Router();

apiRouter
  .route('/:id([0-9a-f]{24})/board')
  .get(getBoardData)
  .post(postUpdateBoard);

export default apiRouter;
