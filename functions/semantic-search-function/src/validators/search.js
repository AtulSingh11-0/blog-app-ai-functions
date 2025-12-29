/**
 * Request validation functions
 */

/**
 * Validates search query parameters
 * @param {object} queryParams - query parameters from request
 * @throws {Error} if validation fails
 */
export function validateSearchParams(queryParams) {
  // validate non-empty query
  if (!queryParams.query || queryParams.query.trim().length === 0) {
    const error = new Error('Query parameter is required and cannot be empty');
    error.status = 400;
    throw error;
  }

  // validate positive limit
  if (queryParams.limit && queryParams.limit < 1) {
    const error = new Error('Limit must be a positive number');
    error.status = 400;
    throw error;
  }

  // validate non-negative offset
  if (queryParams.offset && queryParams.offset < 0) {
    const error = new Error('Offset must be a non-negative number');
    error.status = 400;
    throw error;
  }

  // validate threshold between 0 and 1
  if (
    queryParams.threshold &&
    (queryParams.threshold < 0 || queryParams.threshold > 1)
  ) {
    const error = new Error('Threshold must be between 0 and 1');
    error.status = 400;
    throw error;
  }
}
