import { parseAIResponse } from './parseJSON';

const API_URL = 'https://api.anthropic.com/v1/messages';

export async function callAnthropicJSON<T>(systemPrompt: string, userPrompt: string): Promise<T> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('missing_api_key');
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    throw new Error('api_error');
  }

  const data = await response.json();
  const text = data?.content?.find((item: { type: string }) => item.type === 'text')?.text ?? '';
  const parsed = parseAIResponse(text);

  if (!parsed) {
    throw new Error('parse_error');
  }

  return parsed as T;
}
