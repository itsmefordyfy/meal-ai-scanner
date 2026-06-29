import { parseFoodAnalysisResponse } from '@/lib/api/parse-food-analysis';
import { AnalyzeFoodError, type FoodAnalysisResult } from '@/lib/types/food';

type AnalyzeFoodRequest = {
  imageBase64: string;
  mimeType: string;
};

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
const OPENAI_MODEL = process.env.EXPO_PUBLIC_OPENAI_MODEL ?? 'gpt-4o-mini';

const SYSTEM_PROMPT = `You analyze meal photos and estimate nutrition.
Return JSON only with this exact shape:
{
  "isFood": boolean,
  "foodName": string,
  "calories": number,
  "macros": { "protein": number, "carbs": number, "fat": number },
  "confidence": "high" | "medium" | "low",
  "notes": string
}
Rules:
- Set isFood to false when the image is not food or is too unclear to identify.
- calories and macros are rough estimates for a typical single serving visible in the photo.
- Use grams for macros.
- confidence reflects how sure you are about the identification and portion size.
- notes should briefly explain uncertainty or assumptions when confidence is not high.`;

function normalizeMimeType(mimeType: string): string {
  if (mimeType === 'image/heic' || mimeType === 'image/heif') {
    return 'image/jpeg';
  }
  return mimeType;
}

function getOpenAiErrorMessage(payload: unknown, status: number): string {
  if (payload && typeof payload === 'object') {
    const error = (payload as { error?: { message?: string } }).error;
    if (error?.message) {
      return error.message;
    }
  }

  if (status === 401 || status === 403) {
    return 'Invalid OpenAI API key. Create or verify your key at https://platform.openai.com/api-keys.';
  }

  if (status === 404) {
    return `OpenAI model "${OPENAI_MODEL}" was not found. Check EXPO_PUBLIC_OPENAI_MODEL in .env.local.`;
  }

  return 'Vision model request failed. Please try again.';
}

export async function analyzeFoodPhoto({
  imageBase64,
  mimeType,
}: AnalyzeFoodRequest): Promise<FoodAnalysisResult> {
  if (!OPENAI_API_KEY) {
    throw new AnalyzeFoodError(
      'server',
      'Missing EXPO_PUBLIC_OPENAI_API_KEY. Add your OpenAI API key to .env.local.',
    );
  }

  let response: Response;
  try {
    response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this meal photo and estimate calories and macros.',
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${normalizeMimeType(mimeType)};base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        max_tokens: 400,
      }),
    });
  } catch {
    throw new AnalyzeFoodError(
      'network',
      'Could not reach OpenAI. Check your connection and try again.',
    );
  }

  let completion: unknown;
  try {
    completion = await response.json();
  } catch {
    throw new AnalyzeFoodError(
      'invalid_response',
      'Received an unreadable response from OpenAI.',
    );
  }

  if (!response.ok) {
    throw new AnalyzeFoodError(
      'server',
      getOpenAiErrorMessage(completion, response.status),
    );
  }

  const content = (completion as { choices?: { message?: { content?: string } }[] })?.choices?.[0]
    ?.message?.content;

  if (!content || typeof content !== 'string') {
    throw new AnalyzeFoodError(
      'invalid_response',
      'Vision model returned an empty response.',
    );
  }

  let payload: unknown;
  try {
    payload = JSON.parse(content);
  } catch {
    throw new AnalyzeFoodError(
      'invalid_response',
      'Vision model returned invalid JSON.',
    );
  }

  return parseFoodAnalysisResponse(payload);
}
