import OpenAI from 'openai';

const openaiApiKey = process.env.OPENAI_API_KEY;

const client = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;

export async function generateSummarySuggestion(summary) {
  if (!summary?.trim()) {
    return 'Provide your professional summary to receive an enhanced version.';
  }

  if (!client) {
    return `AI_KEY_MISSING: ${summary}`;
  }

  const completion = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: `Improve this resume summary in 2 concise sentences: ${summary}`
  });

  return completion.output_text?.trim() || summary;
}
