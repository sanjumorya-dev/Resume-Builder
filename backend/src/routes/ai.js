import { Router } from 'express';
import { generateSummarySuggestion } from '../services/openaiService.js';

const router = Router();

router.post('/enhance-summary', async (req, res) => {
  try {
    const { summary = '' } = req.body;
    const enhanced = await generateSummarySuggestion(summary);
    res.json({ enhanced });
  } catch (error) {
    console.error('AI route error', error);
    res.status(500).json({ message: 'Failed to generate AI suggestion.' });
  }
});

export default router;
