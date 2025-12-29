/**
 * Gemini AI service for generating summaries
 */

import { GoogleGenAI } from '@google/genai';
import {
  GEMINI_CONFIG,
  SUMMARY_MAX_WORDS,
  MAX_CONTENT_LENGTH,
} from '../config/constants.js';
import { stripHtmlTags, truncateContent } from '../utils/text.js';

// initialize Gemini client
const gemini = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

/**
 * Generates a blog summary using Gemini API
 * @param {object} post - Post object with title and content
 * @param {function} log - Logging function
 * @param {function} error - Error logging function
 * @returns {Promise<string>} Generated summary
 */
export async function generateSummary(post, log, error) {
  try {
    const plainTextContent = stripHtmlTags(post?.content); // remove HTML tags from post content
    let truncatedContent = truncateContent(
      plainTextContent,
      MAX_CONTENT_LENGTH
    ); // truncate content to make sure it fits within limits

    // additional check to ensure content isn't too long
    if (truncatedContent.length / 4 > SUMMARY_MAX_WORDS) {
      truncatedContent = truncatedContent.substring(0, SUMMARY_MAX_WORDS * 4);
    }

    const prompt = buildPrompt(post?.title, truncatedContent); // build prompt for gemini using our helper method

    log('Generating summary with Gemini API...');

    // call Gemini API to generate summary
    const response = await gemini.models.generateContent({
      model: GEMINI_CONFIG.model,
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      config: {
        temperature: GEMINI_CONFIG.temperature,
        maxOutputTokens: GEMINI_CONFIG.maxOutputTokens,
        topP: GEMINI_CONFIG.topP,
        thinkingConfig: {
          thinkingBudget: GEMINI_CONFIG.thinkingBudget,
        },
      },
    });

    const summary = extractSummaryFromResponse(response); // extract summary text from response

    // validate summary is not empty or null
    if (!summary || summary.trim().length === 0) {
      error('Empty summary generated from Gemini API');
      throw new Error('Empty summary generated');
    }

    log('Summary generated successfully');
    return summary.trim(); // return trimmed summary
  } catch (err) {
    error('Gemini API error:', err.message || err);
    throw err;
  }
}

/**
 * Builds the prompt for Gemini API
 * @param {string} title - Blog post title
 * @param {string} content - Blog post content
 * @returns {string} Formatted prompt
 */
function buildPrompt(title, content) {
  return `
Generate a concise and engaging summary for the following blog post titled "${title}".
Requirements:
  - Capture the main points and key takeaways
  - Make it compelling to entice readers
  - Length: ${SUMMARY_MAX_WORDS} words
  - Write in an engaging, professional tone
  - the summary should be in plain text without any markdown or special formatting
Content:
  "${content}"`;
}

/**
 * Extracts summary text from Gemini API response
 * @param {object} response - Gemini API response
 * @returns {string} Extracted summary
 */
function extractSummaryFromResponse(response) {
  return (
    response?.text || response?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  ); // extract text from response structure by checking possible fields
}
