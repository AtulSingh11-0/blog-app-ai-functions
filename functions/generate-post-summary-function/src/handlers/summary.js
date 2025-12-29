/**
 * Summary generation handler with retry logic and fallback
 */

import { generateSummary } from '../services/gemini.js';
import { stripHtmlTags, extractFirstWords } from '../utils/text.js';
import {
  MAX_RETRIES,
  RETRY_BASE_DELAY,
  SUMMARY_MAX_WORDS,
} from '../config/constants.js';

/**
 * Generates blog summary with retry logic for rate limits
 * @param {object} post - Post object with title and content
 * @param {function} log - Logging function
 * @param {function} error - Error logging function
 * @param {number} retries - Number of retries remaining
 * @returns {Promise<string>} Generated or fallback summary
 */
export async function generateBlogSummary(
  post,
  log,
  error,
  retries = MAX_RETRIES
) {
  try {
    return await generateSummary(post, log, error); // attempt to generate summary using Gemini API
  } catch (err) {
    return handleSummaryErrors(err, post, log, error, retries); // handle errors with retry logic or fallback internally in case of failure
  }
}

/**
 * Handles errors during summary generation with retry logic
 * @param {Error} err - Error object
 * @param {object} post - Post object
 * @param {function} log - Logging function
 * @param {function} error - Error logging function
 * @param {number} retries - Number of retries remaining
 * @returns {Promise<string>} Generated or fallback summary
 */
function handleSummaryErrors(err, post, log, error, retries) {
  // handle rate limit errors with exponential backoff
  if (err.status === 429 && retries > 0) {
    const delay = calculateRetryDelay(retries);

    log(
      `Rate limited. Retrying in ${(delay / 1000).toFixed(2)}s... (${retries} retries left)`
    );

    return new Promise((resolve) => setTimeout(resolve, delay)).then(() =>
      generateBlogSummary(post, log, error, retries - 1)
    ); // retry after delay
  }

  // fallback for all other errors
  error('Generate blog summary error:', err.message || err);
  log('Using fallback summary generation...');

  return createFallbackSummary(post); // return simple fallback summary
}

/**
 * Calculates retry delay with exponential backoff and jitter
 * @param {number} retries - Number of retries remaining
 * @returns {number} Delay in milliseconds
 */
function calculateRetryDelay(retries) {
  const exponentialDelay = 2 ** (MAX_RETRIES - retries) * RETRY_BASE_DELAY; // calculate the exponential backoff delay
  const jitter = Math.floor(Math.random() * 1_000); // add random jitter up to 1 second
  return exponentialDelay + jitter; // return the total delay
}

/**
 * Creates a simple fallback summary by extracting first N words
 * @param {object} post - Post object with content
 * @returns {string} Fallback summary
 */
function createFallbackSummary(post) {
  const plainTextContent = stripHtmlTags(post?.content); // remove HTML tags from content
  return extractFirstWords(plainTextContent, SUMMARY_MAX_WORDS); // extract first N words as fallback summary
}
