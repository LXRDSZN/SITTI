import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import ticketsRoutes from './routes/tickets.routes.js';

const app = express();

// Middlewares
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'SITTI API',
    description: 'Sistema de Gestión de Tickets',
    version: '1.0.0',
    environment: env.nodeEnv,
  });
});

// Routes
app.use('/auth', authRoutes);
app.use('/tickets', ticketsRoutes);

export default app;
