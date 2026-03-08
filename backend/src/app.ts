import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import { errorHandler } from './middlewares/errorHandler.js';
import { responseSerializer } from './middlewares/responseSerializer.js';
import authRoutes from './routes/authRoutes.js';
import { clientRoutes } from './routes/clientRoutes.js';
import { serviceRoutes } from './routes/serviceRoutes.js';

const app = express();
app.use(helmet());

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`Origin '${origin}' não permitida pelo CORS`));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(responseSerializer);

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/services', serviceRoutes);

app.use(errorHandler);

export default app;
