/**
 * Mathematical utility functions for vector operations
 */

/**
 * Calculates the cosine similarity between two vectors
 * Returns a value between -1 and 1, where 1 means identical direction
 * @param {number[]} vectorA - first vector array
 * @param {number[]} vectorB - second vector array
 * @returns {number} cosine similarity score
 */
export function calculateCosineSimilarity(vectorA, vectorB) {
  let dotProduct = 0; // dot product of the two vectors
  let magnitudeA = 0; // magnitude of vector A
  let magnitudeB = 0; // magnitude of vector B

  // loop through each dimension to compute dot product and magnitudes
  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i]; // sum of products
    magnitudeA += vectorA[i] * vectorA[i]; // sum of squares for vector A
    magnitudeB += vectorB[i] * vectorB[i]; // sum of squares for vector B
  }

  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB)); // cosine similarity formula
}

/**
 * Parses embedding from string or returns as-is if already an array
 * @param {string|number[]} embedding - embedding data
 * @returns {number[]} parsed embedding vector
 */
export function parseEmbedding(embedding) {
  return typeof embedding === 'string' ? JSON.parse(embedding) : embedding; // parse if string else return as it is
}
