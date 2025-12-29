/**
 * Configuration constants for the post summary function
 */

export const MAX_CONTENT_LENGTH_DB = 100_000; // max content length allowed in DB
export const MAX_CONTENT_LENGTH = 3_000; // max content length to send to Gemini API
export const SUMMARY_MAX_WORDS = 70; // max words in the summary
export const MAX_RETRIES = 3; // max retries for rate limit errors
export const RETRY_BASE_DELAY = 10_000; // base delay for retries in ms

export const GEMINI_CONFIG = {
  model: 'gemini-flash-lite-latest',
  temperature: 1.0,
  maxOutputTokens: 150,
  topP: 0.95,
  thinkingBudget: 0,
};
