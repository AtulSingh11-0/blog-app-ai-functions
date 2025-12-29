/**
 * Semantic Search Function
 * Main entrypoint for Appwrite function that performs semantic search across blog posts
 */

import { performSemanticSearch } from './handlers/search.js';
import { sendSuccess, sendError } from './utils/response.js';

/**
 * Main function handler
 * @param {object} context - Appwrite function context
 * @param {object} context.req - request object
 * @param {object} context.res - response object
 * @param {function} context.log - logging function
 * @param {function} context.error - error logging function
 * @returns {Promise<object>} response object
 */
export default async ({ req, res, log, error }) => {
  try {
    // validate endpoint path
    if (req.path === '/search') {
      log('Processing semantic search request...');

      // perform semantic search
      const searchResults = await performSemanticSearch(req.query, log, error);

      log('Search completed successfully');

      // return success response
      return sendSuccess(
        res,
        'Relevant posts fetched successfully',
        searchResults
      );
    }

    // handle unknown paths
    return sendError(res, 404, 'Endpoint not found');
  } catch (err) {
    error('Error in main handler:', err.message || err);

    // return error response
    return sendError(
      res,
      err.status || 500,
      err.message || 'Internal Server Error',
      err.message || 'An unexpected error occurred'
    );
  }
};
