const OpenAI = require('openai');

const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
const REQUEST_TIMEOUT_MS = Number(process.env.OPENAI_TIMEOUT_MS || 15000);

let client;

function getClient() {
  if (client) return client;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  client = new OpenAI({ apiKey });
  return client;
}

function withTimeout(promise, timeoutMs = REQUEST_TIMEOUT_MS) {
  let timeoutHandle;

  const timeoutPromise = new Promise((_, reject) => {
    timeoutHandle = setTimeout(() => {
      const timeoutError = new Error(`OpenAI request timed out after ${timeoutMs}ms`);
      timeoutError.code = 'OPENAI_TIMEOUT';
      reject(timeoutError);
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutHandle));
}

function normalizeTextOutput(response) {
  if (!response) return '';

  if (response.output_text && typeof response.output_text === 'string') {
    return response.output_text.trim();
  }

  if (Array.isArray(response.output)) {
    const chunks = response.output
      .flatMap((part) => (Array.isArray(part.content) ? part.content : []))
      .map((content) => content?.text)
      .filter(Boolean);

    return chunks.join('\n').trim();
  }

  return '';
}

function toBullets(rawText) {
  return rawText
    .split(/\n+/)
    .map((line) => line.replace(/^[-*•\d.)\s]+/, '').trim())
    .filter(Boolean);
}

async function askOpenAI(prompt, { maxOutputTokens = 350 } = {}) {
  const response = await withTimeout(
    getClient().responses.create({
      model: DEFAULT_MODEL,
      input: prompt,
      max_output_tokens: maxOutputTokens,
      temperature: 0.4,
    })
  );

  return normalizeTextOutput(response);
}

async function generateSummary(profile, experienceLevel) {
  const prompt = [
    `Generate a professional summary for a ${profile} with ${experienceLevel} years of experience.`,
    'Constraints:',
    '- Write 3-4 concise sentences.',
    '- Keep tone professional and ATS-friendly.',
    '- Highlight measurable impact where possible.',
    '- Return plain text only.',
  ].join('\n');

  const summary = await askOpenAI(prompt, { maxOutputTokens: 220 });

  return {
    profile,
    experienceLevel,
    summary,
  };
}

async function suggestSkills(profile, experienceLevel) {
  const prompt = [
    `List relevant skills for ${profile} at ${experienceLevel} experience level.`,
    'Constraints:',
    '- Include hard + soft skills.',
    '- Return 10-15 items.',
    '- One skill per line.',
    '- No category headers.',
  ].join('\n');

  const raw = await askOpenAI(prompt, { maxOutputTokens: 240 });

  return {
    profile,
    experienceLevel,
    skills: toBullets(raw),
  };
}

async function generateExperienceBullets(profile, experienceLevel, context = '') {
  const prompt = [
    `Write 3-5 resume bullet points for a ${profile} with ${experienceLevel} years of experience.`,
    context ? `Role context: ${context}` : '',
    'Constraints:',
    '- Start each bullet with a strong action verb.',
    '- Emphasize outcomes and metrics when available.',
    '- Return one bullet per line.',
    '- No introduction or conclusion.',
  ]
    .filter(Boolean)
    .join('\n');

  const raw = await askOpenAI(prompt);

  return {
    profile,
    experienceLevel,
    context,
    bullets: toBullets(raw).slice(0, 5),
  };
}

async function generateProjectBullets(profile, experienceLevel, projectContext = '') {
  const prompt = [
    `Write 3-5 bullet points for projects in ${profile} role at ${experienceLevel} experience level.`,
    projectContext ? `Project context: ${projectContext}` : '',
    'Constraints:',
    '- Focus on technical choices, ownership, and measurable impact.',
    '- Return one bullet per line.',
    '- No headings or extra commentary.',
  ]
    .filter(Boolean)
    .join('\n');

  const raw = await askOpenAI(prompt);

  return {
    profile,
    experienceLevel,
    projectContext,
    bullets: toBullets(raw).slice(0, 5),
  };
}

function normalizeError(error) {
  if (!error) {
    return { code: 'OPENAI_UNKNOWN', message: 'Unknown OpenAI service error', status: 500 };
  }

  if (error.code === 'OPENAI_TIMEOUT') {
    return { code: error.code, message: error.message, status: 504 };
  }

  const status = error.status || error.statusCode || 500;
  return {
    code: error.code || 'OPENAI_REQUEST_FAILED',
    message: error.message || 'OpenAI request failed',
    status,
  };
}

module.exports = {
  generateSummary,
  suggestSkills,
  generateExperienceBullets,
  generateProjectBullets,
  normalizeError,
};
