import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import aiRoutes from './routes/ai.js';
import resumeRoutes from './routes/resume.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/ai', aiRoutes);
app.use('/api/resume', resumeRoutes);

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
