/**
 * Generate Post Summary Function
 * Main entrypoint for Appwrite function that generates AI-powered summaries for blog posts
 */

import { validateRequestBody } from './validators/request.js';
import { generateBlogSummary } from './handlers/summary.js';
import { reply, success } from './utils/response.js';
import { parseRequestBody } from './utils/request.js';

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
    // validate the HTTP method, only allow POST requests for summary generation
    if (req.method !== 'POST') {
      return reply(res, 405, 'Method not allowed');
    }

    // validate endpoint path
    if (req.path !== '/generate-post-summary') {
      return reply(res, 404, 'Endpoint not found');
    }

    log('Processing summary generation request...');

    // parse request body - handles multiple formats (Postman, SDK, HTTP)
    const requestBody = parseRequestBody(req);
    log('Parsed request body successfully');

    // validate request body, must contain title and content fields and content length should be within limits
    validateRequestBody(requestBody, log);

    // generate summary using Gemini API with retry logic
    const summary = await generateBlogSummary(requestBody, log, error);

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
