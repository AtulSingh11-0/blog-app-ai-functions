/**
 * Appwrite client configuration and initialization
 */

import { Client, TablesDB } from 'node-appwrite';

/**
 * Initializes and configures the Appwrite client with environment credentials
 * @returns {Client} configured Appwrite client instance
 */
export function initializeAppwriteClient() {
  return new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);
}

// initialize client and tablesDB
const client = initializeAppwriteClient();
export const tablesDB = new TablesDB(client);
