const express = require('express');
const {
  generateSummary,
  suggestSkills,
  generateExperienceBullets,
  generateProjectBullets,
  normalizeError,
} = require('../services/openaiService');

const router = express.Router();

function validateCommonFields(req, res) {
  const { profile, experienceLevel } = req.body || {};

  if (!profile || !experienceLevel) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'profile and experienceLevel are required',
      },
    });
    return null;
  }

  return { profile, experienceLevel };
}

async function handleRequest(res, operation) {
  try {
    const data = await operation();
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    const normalizedError = normalizeError(error);
    return res.status(normalizedError.status).json({
      success: false,
      error: {
        code: normalizedError.code,
        message: normalizedError.message,
      },
    });
  }
}

router.post('/ai/skills', async (req, res) => {
  const payload = validateCommonFields(req, res);
  if (!payload) return;

  return handleRequest(res, () => suggestSkills(payload.profile, payload.experienceLevel));
});

router.post('/ai/summary', async (req, res) => {
  const payload = validateCommonFields(req, res);
  if (!payload) return;

  return handleRequest(res, () => generateSummary(payload.profile, payload.experienceLevel));
});

router.post('/ai/experience', async (req, res) => {
  const payload = validateCommonFields(req, res);
  if (!payload) return;

  const context = req.body?.context || '';
  return handleRequest(res, () =>
    generateExperienceBullets(payload.profile, payload.experienceLevel, context)
  );
});

router.post('/ai/projects', async (req, res) => {
  const payload = validateCommonFields(req, res);
  if (!payload) return;

  const projectContext = req.body?.projectContext || '';
  return handleRequest(res, () =>
    generateProjectBullets(payload.profile, payload.experienceLevel, projectContext)
  );
});

module.exports = router;
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
