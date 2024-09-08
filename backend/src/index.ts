import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectToDatabase from './config/db';
import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.route';
import authenticate from './middleware/authenticate';
import errorHandler from './middleware/errorHandler';
import { APP_ORIGIN, PORT } from './constants/env';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/user', authenticate, userRoutes);

app.use(errorHandler);

const startServer = async () => {
  await connectToDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
