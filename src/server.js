require('dotenv').config();
import MongoStore from 'connect-mongo';
import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import { localsMiddleware } from './middleware';
import globalRouter from './routes/globalRouter';

const app = express();

app.set('view engine', 'pug');
app.set('views', `${process.cwd()}/src/views`);

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
    }),
  })
);
app.use(localsMiddleware);
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

app.use('/', globalRouter);

export default app;
