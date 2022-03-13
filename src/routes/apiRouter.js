import express from 'express';
import {
  getBoardData,
  postUpdateBoard,
} from '../controllers/boardController';
import {
  postCheckIn,
  postIsCheckIn,
  postIsClean,
  postIsUsed,
  postUpdateRoomName,
} from '../controllers/roomController';

const apiRouter = express.Router();

apiRouter
  .route('/:id([0-9a-f]{24})/board')
  .get(getBoardData)
  .post(postUpdateBoard);

apiRouter
  .route('/room/:id([0-9a-f]{24})/name')
  .post(postUpdateRoomName);

apiRouter
  .route('/room/:id([0-9a-f]{24})/isUsed')
  .post(postIsUsed);

apiRouter
  .route('/room/:id([0-9a-f]{24})/isClean')
  .post(postIsClean);

apiRouter.route('/room/:id/checkIn').post(postCheckIn);

apiRouter
  .route('/room/:id([0-9a-f]{24})/checkOut')
  .post(postIsCheckIn);

export default apiRouter;
