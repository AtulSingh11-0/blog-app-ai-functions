/**
 * Search handler for semantic post search
 */

import { generateEmbedding } from '../services/gemini.js';
import { fetchPosts } from '../services/database.js';
import { calculateCosineSimilarity, parseEmbedding } from '../utils/math.js';
import { validateSearchParams } from '../validators/search.js';
import {
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
  DEFAULT_THRESHOLD,
} from '../config/constants.js';

/**
 * Performs semantic search on blog posts based on query text
 * @param {object} queryParams - search parameters (query, limit, offset, threshold)
 * @param {function} log - logging function
 * @param {function} error - error logging function
 * @returns {Promise<object>} search results with relevant posts
 */
export async function performSemanticSearch(queryParams, log, error) {
  // extract and set default values for parameters
  const {
    query,
    limit = DEFAULT_LIMIT,
    offset = DEFAULT_OFFSET,
    threshold = DEFAULT_THRESHOLD,
  } = queryParams;

  log(`Starting semantic search for query: "${query}"`);

  // validate search parameters
  validateSearchParams(queryParams);

  // generate embedding for the search query
  const queryEmbedding = await generateEmbedding(query, log);

  // fetch all posts from the database
  const allPosts = (await fetchPosts([], limit, offset, log)).rows;

  log(`Processing ${allPosts.length} posts for similarity calculation...`);

  // calculate similarity scores and filter posts based on threshold
  const relevantPosts = allPosts
    .map((post) => {
      const postEmbedding = parseEmbedding(post.embedding);

      return {
        ...post,
        similarity: calculateCosineSimilarity(queryEmbedding, postEmbedding),
      };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .filter((post) => post.similarity >= threshold);

  log(
    `Found ${relevantPosts.length} relevant posts above threshold ${threshold}`
  );

  return {
    length: relevantPosts.length,
    rows: relevantPosts,
    query,
    threshold,
    limit,
    offset,
  };
}
