/**
 * Appwrite database service for fetching posts
 */

import { Query } from 'node-appwrite';
import { tablesDB } from '../config/appwrite.js';

/**
 * Fetches posts from Appwrite database with optional queries
 * @param {Array} additionalQueries - additional query filters
 * @param {number} limit - maximum number of posts to fetch
 * @param {number} offset - number of posts to skip
 * @param {function} log - logging function
 * @returns {Promise<object>} response containing rows and metadata
 * @throws {Error} if database fetch fails
 */
export async function fetchPosts(additionalQueries, limit, offset, log) {
  try {
    log(`Fetching posts from database (limit: ${limit}, offset: ${offset})...`);

    const response = await tablesDB.listRows({
      databaseId: process.env.APPWRITE_DATABASE_ID,
      tableId: process.env.APPWRITE_POSTS_TABLE_ID,
      queries: [Query.limit(limit), Query.offset(offset), ...additionalQueries],
    });

    log(`Fetched ${response.rows?.length || 0} posts from database`);
    return response;
  } catch (err) {
    throw new Error(`Failed to fetch posts from database: ${err.message}`);
  }
}
