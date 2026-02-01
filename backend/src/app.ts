import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { errorHandler } from './middlewares/errorHandler.js';
import { responseSerializer } from './middlewares/responseSerializer.js';
import { clientRoutes } from './routes/clientRoutes.js';
import { serviceRoutes } from './routes/serviceRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(responseSerializer);

app.use('/api/clients', clientRoutes);
app.use('/api/services', serviceRoutes);

app.use(errorHandler);

export default app;
