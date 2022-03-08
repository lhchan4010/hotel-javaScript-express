require('dotenv').config();
import express from 'express';
import morgan from 'morgan';
import globalRouter from './routes/globalRouter';

const app = express();

app.set('view engine', 'pug');
app.set('views', `${process.cwd()}/src/views`);

app.use(morgan('dev'));

app.use('/', globalRouter);

export default app;
