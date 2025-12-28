import { PrismaPg } from '@prisma/adapter-pg';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import { PrismaClient } from '../generated/prisma/client.js';

const app = express();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default app;
