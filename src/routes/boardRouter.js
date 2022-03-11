import express from 'express';
import { getBoard } from '../controllers/boardController';
import { postCreateBoard } from '../controllers/globalController';

const boardRouter = express.Router();

boardRouter.route('/:id([0-9a-f]{24})').get(getBoard);

export default boardRouter;
