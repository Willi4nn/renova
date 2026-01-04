import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { errorHandler } from './middlewares/errorHandler.js';
import { clientRoutes } from './routes/clientRoutes.js';
import { orderRoutes } from './routes/orderRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/clients', clientRoutes);
app.use('/api/orders', orderRoutes);

app.use(errorHandler);

export default app;
