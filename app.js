import express from 'express';
import path from 'path';
const __dirname = path.resolve();
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();

import userRouter from './routes/userRoutes.js';
import tourRouter from './routes/tourRoutes.js';

const app = express();

app.use(express.json()); //parsing incoming JSON data from HTTP request.

app.use(express.static(`${__dirname}/public`)); //middleware for static files

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //3rd party middleware
}

// app.use((req, res, next) => {
//   req.requestTime = new Date.now();
//   next();
// });

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

export default app;
