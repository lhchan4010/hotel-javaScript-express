import express from 'express';
import { getHome } from '../controllers/globalController';

const globalRouter = express.Router();

globalRouter.route('/').get(getHome);

export default globalRouter;
