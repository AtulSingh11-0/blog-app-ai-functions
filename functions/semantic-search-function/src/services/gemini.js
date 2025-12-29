/**
 * Gemini AI service for generating embeddings
 */

import { GoogleGenAI } from '@google/genai';
import { GEMINI_CONFIG } from '../config/constants.js';

// initialize Gemini client
const gemini = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

/**
 * Generates vector embeddings for the given text using Gemini API
 * @param {string} text - text to generate embeddings for
 * @param {function} log - logging function
 * @returns {Promise<number[]>} embedding vector array
 * @throws {Error} if embedding generation fails
 */
export async function generateEmbedding(text, log) {
  try {
    log('Generating embeddings using Gemini API...');

    const response = await gemini.models.embedContent({
      model: GEMINI_CONFIG.model,
      contents: [
        {
          parts: [{ text }],
        },
      ],
      config: {
        outputDimensionality: GEMINI_CONFIG.outputDimensionality,
      },
    });

    const embedding = response.embeddings?.[0]?.values;

    if (!embedding || embedding.length === 0) {
      throw new Error('Empty embedding returned from Gemini API');
    }

    log(`Generated embedding with ${embedding.length} dimensions`);
    return embedding;
  } catch (err) {
    throw new Error(`Failed to generate embedding: ${err.message}`);
  }
}
