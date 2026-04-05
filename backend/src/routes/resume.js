import { randomUUID } from 'node:crypto';
import { Router } from 'express';

const router = Router();

const resumes = [];

router.get('/', (_req, res) => {
  res.json({ data: resumes });
});

router.post('/', (req, res) => {
  const resume = {
    id: randomUUID(),
    ...req.body,
    createdAt: new Date().toISOString()
  };

  resumes.push(resume);
  res.status(201).json({ data: resume });
});

export default router;
