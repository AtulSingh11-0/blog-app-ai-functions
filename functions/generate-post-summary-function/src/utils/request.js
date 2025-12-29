/**
 * Request parsing utilities
 */

/**
 * Parses request body from Appwrite function context
 * Handles different body formats from various sources (Postman, SDK, HTTP)
 * @param {object} req - request object from Appwrite context
 * @returns {object} parsed request body
 */
export function parseRequestBody(req) {
  // priority 1: use bodyJson if available (recommended by Appwrite)
  if (req.bodyJson && typeof req.bodyJson === 'object') {
    return req.bodyJson;
  }

  // priority 2: if bodyText is available and not empty
  if (req.bodyText && req.bodyText.trim().length > 0) {
    try {
      return JSON.parse(req.bodyText);
    } catch (err) {
      throw Object.assign(
        new Error(`Invalid JSON in request body: ${err.message}`),
        { status: 400 }
      );
    }
  }

  // priority 3: if body is a string, try to parse it
  if (typeof req.body === 'string' && req.body.trim().length > 0) {
    try {
      return JSON.parse(req.body);
    } catch (err) {
      throw Object.assign(
        new Error(`Invalid JSON in request body: ${err.message}`),
        { status: 400 }
      );
    }
  }

  // priority 4: if body is already an object
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }

  // if nothing works, return empty object (will fail validation)
  return {};
}
