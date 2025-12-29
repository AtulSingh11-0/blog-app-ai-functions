/**
 * Generate Post Summary Function
 * Main entrypoint for Appwrite function that generates AI-powered summaries for blog posts
 */

import { validateRequestBody } from './validators/request.js';
import { generateBlogSummary } from './handlers/summary.js';
import { reply, success } from './utils/response.js';

/**
 * Main function handler
 * @param {object} context - Appwrite function context
 * @param {object} context.req - Request object
 * @param {object} context.res - Response object
 * @param {function} context.log - Logging function
 * @param {function} context.error - Error logging function
 * @returns {Promise<object>} Response object
 */
export default async ({ req, res, log, error }) => {
  try {
    // validate the HTTP method, only allow POST requests for summary generation
    if (req.method !== 'POST') {
      return reply(res, 405, 'Method not allowed');
    }

    // validate endpoint path
    if (req.path !== '/generate-post-summary') {
      return reply(res, 404, 'Endpoint not found');
    }

    log('Processing summary generation request...');

    // validate request body, must contain title and content fields and content length should be within limits
    validateRequestBody(req.body);

    // generate summary using Gemini API with retry logic
    const summary = await generateBlogSummary(req.body, log, error);

    log('Summary generated and returned successfully');

    // return success response
    return success(res, 'Post summary generated successfully', { summary });
  } catch (err) {
    error('Error in main handler:', err?.message || err);

    // return error response
    return res.json({
      success: false,
      statusCode: err?.status || 500,
      message: err?.message || 'Internal server error',
    });
  }
};
