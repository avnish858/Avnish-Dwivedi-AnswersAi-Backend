// src/index.ts
import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes';
import { authenticateToken } from './middlewares/authMiddleware';
import questionRoutes from './routes/appRoutes';

const app = express();
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api', questionRoutes);

app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: (req as any).user });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

export { app };
