/**
 * Response utility functions
 */

/**
 * Sends a standardized error response
 * @param {object} res - Response object from context
 * @param {number} code - HTTP status code
 * @param {string} msg - Error message
 * @returns {object} JSON response
 */
export function reply(res, code, msg) {
  return res.json({
    success: false,
    statusCode: code,
    message: msg,
  }); // returns a standardized JSON error response to avoid repetition of code
}

/**
 * Sends a standardized success response
 * @param {object} res - Response object from context
 * @param {string} msg - Success message
 * @param {object} data - Response data
 * @returns {object} JSON response
 */
export function success(res, msg, data) {
  return res.json({
    success: true,
    statusCode: 200,
    message: msg,
    data,
  }); // returns a standardized JSON success response to avoid repetition of code
}
