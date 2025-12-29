/**
 * Response utility functions for standardized API responses
 */

/**
 * Sends a standardized success response
 * @param {object} res - response object from context
 * @param {string} message - success message
 * @param {object} data - response data
 * @returns {object} JSON response
 */
export function sendSuccess(res, message, data) {
  return res.json({
    success: true,
    statusCode: 200,
    message,
    data,
  });
}

/**
 * Sends a standardized error response
 * @param {object} res - response object from context
 * @param {number} statusCode - HTTP status code
 * @param {string} message - error message
 * @param {string} [errorDetails] - optional error details
 * @returns {object} JSON response
 */
export function sendError(res, statusCode, message, errorDetails) {
  const response = {
    success: false,
    statusCode,
    message,
  };

  if (errorDetails) {
    response.error = errorDetails;
  }

  return res.json(response);
}
