/**
 * Request validation functions
 */

import { MAX_CONTENT_LENGTH_DB } from '../config/constants.js';

/**
 * Validates the request body for required fields and content length
 * @param {object} body - request body
 * @param {function} log - logging function
 * @throws {Error} if validation fails
 */
export function validateRequestBody(body, log) {
  log('Validating request body...');

  if (!body || typeof body !== 'object') {
    // if body is not an object
    throw Object.assign(new Error('Invalid request body'), { status: 400 });
  }

  if (!body?.title || !body?.content) {
    // if title or content is missing
    log('Validation failed: Missing title or content');
    throw Object.assign(new Error('Missing title or content'), { status: 400 }); // bad request
  }

  if (typeof body.title !== 'string' || typeof body.content !== 'string') {
    // if title or content is not a string
    log('Validation failed: Title and content must be strings');
    throw Object.assign(new Error('Title and content must be strings'), {
      status: 400,
    });
  }

  if (body.content.length > MAX_CONTENT_LENGTH_DB) {
    // if content exceeds max length
    log(
      `Validation failed: Content exceeds ${MAX_CONTENT_LENGTH_DB} characters`
    );
    throw Object.assign(
      new Error(`Content exceeds ${MAX_CONTENT_LENGTH_DB} characters`),
      {
        status: 400,
      }
    ); // bad request
  }

  log('Request body validated successfully');
}
