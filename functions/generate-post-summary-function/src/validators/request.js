/**
 * Request validation functions
 */

import { MAX_CONTENT_LENGTH_DB } from '../config/constants.js';

/**
 * Validates the request body for required fields and content length
 * @param {object} body - Request body
 * @throws {Error} If validation fails
 */
export function validateRequestBody(body) {
  if (!body?.title || !body?.content) {
    // if title or content is missing
    throw Object.assign(new Error('Missing title or content'), { status: 400 }); // bad request
  }

  if (body.content.length > MAX_CONTENT_LENGTH_DB) {
    // if content exceeds max length
    throw Object.assign(
      new Error(`Content exceeds ${MAX_CONTENT_LENGTH_DB} characters`),
      {
        status: 400,
      }
    ); // bad request
  }
}
