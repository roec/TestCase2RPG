import {
  buildNormalizePrompt,
  buildParsePrompt,
  buildRpgPrompt,
  type ChatMessage,
} from './promptBuilder';
import type { ParsedIntent, StructuredTestCase } from '../types/testCase';

const API_URL = 'https://api.deepseek.com/chat/completions';
const MODEL = 'deepseek-chat';
const TIMEOUT_MS = 35000;
const MAX_RETRIES = 2;

interface DeepSeekResponse {
  choices?: Array<{ message?: { content?: string } }>;
  error?: { message?: string };
}

const callWithTimeout = async (messages: ChatMessage[]): Promise<string> => {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('Missing VITE_DEEPSEEK_API_KEY environment variable.');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0,
        messages,
      }),
      signal: controller.signal,
    });

    const payload = (await response.json()) as DeepSeekResponse;

    if (!response.ok) {
      throw new Error(payload.error?.message ?? 'DeepSeek request failed.');
    }

    const content = payload.choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw new Error('DeepSeek returned an empty response.');
    }

    return content;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('DeepSeek request timed out. Please retry.');
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
};

export const callDeepSeek = async (messages: ChatMessage[]): Promise<string> => {
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      return await callWithTimeout(messages);
    } catch (error) {
      lastError = error;
      if (attempt < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, (attempt + 1) * 500));
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Unknown DeepSeek failure.');
};

const safeParseJson = <T>(raw: string, label: string): T => {
  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error(`${label} returned invalid JSON.`);
  }
};

export const parseDescriptionToTestCase = async (text: string): Promise<ParsedIntent> => {
  const response = await callDeepSeek(buildParsePrompt(text));
  return safeParseJson<ParsedIntent>(response, 'Parse Description');
};

export const normalizeStructuredTestCase = async (
  parsed: ParsedIntent,
): Promise<StructuredTestCase> => {
  const response = await callDeepSeek(buildNormalizePrompt(parsed));
  return safeParseJson<StructuredTestCase>(response, 'Generate Structured Test Case');
};

export const generateRpgFromTestCase = async (testCaseJson: StructuredTestCase): Promise<string> =>
  callDeepSeek(buildRpgPrompt(testCaseJson));
