import { GoogleGenAI } from '@google/genai';
import { Client, Query, TablesDB } from 'node-appwrite';

// appwrite client setup
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);
const tablesDB = new TablesDB(client);

// gemini setup
const gemini = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

// main handler
export default async ({ req, res, log, error }) => {
  try {
    if (req.path === '/search') {
      // if req.path is /search call searchPosts()
      return await searchPosts(req, res, log, error);
    }
  } catch (err) {
    error('Error in main handler:', err);
    res.json({
      success: false,
      statusCode: 500,
      message: 'Internal Server Error',
      error: err.message || err || 'An unexpected error occurred',
    });
  }
};

// function to search posts based on query
async function searchPosts(req, res, log, error) {
  try {
    // 1. extract the parameters from request body
    const { query, limit = 1000, offset = 0, threshold = 0.5 } = req.query;

    // 2. generate embedding for query
    const queryEmbedding = await generateEmbeddings(query);

    // 3. fetch posts from the database
    const allPosts = (await fetchPosts([], limit, offset)).rows;

    // 4. calculate similarity and filter posts
    const relevantPosts = allPosts
      .map((post) => {
        const postVector =
          typeof post.embedding === 'string'
            ? JSON.parse(post.embedding)
            : post.embedding;

        return {
          ...post,
          similarity: cosine(queryEmbedding, postVector),
        };
      })
      .sort((a, b) => b.similarity - a.similarity)
      .filter((post) => post.similarity >= threshold);

    log(`Found ${relevantPosts.length} relevant posts for the query.`);

    // 5. return the relevant posts
    return res.json({
      success: true,
      statusCode: 200,
      message: 'Relevant posts fetched successfully',
      data: {
        length: relevantPosts.length,
        rows: relevantPosts,
      },
    });
  } catch (err) {
    error('Error in searchPosts:', err);
    res.json({
      success: false,
      statusCode: 500,
      message: 'Internal Server Error',
      error: err.message || err || 'An unexpected error occurred',
    });
  }
}

// function to fetch posts
async function fetchPosts(queries = [], limit = 10, offset = 0) {
  try {
    const response = await tablesDB.listRows({
      databaseId: process.env.APPWRITE_DATABASE_ID,
      tableId: process.env.APPWRITE_POSTS_TABLE_ID,
      queries: [Query.limit(limit), Query.offset(offset), ...queries],
    });

    return response;
  } catch (err) {
    console.error('Error fetching posts:', err);
    throw err;
  }
}

// function to calculate cosine similarity
function cosine(a, b) {
  let dot = 0,
    nA = 0,
    nB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    nA += a[i] * a[i];
    nB += b[i] * b[i];
  }
  return dot / (Math.sqrt(nA) * Math.sqrt(nB));
}

// function to generate embeddings using gemini API
async function generateEmbeddings(text) {
  try {
    const response = await gemini.models.embedContent({
      model: 'gemini-embedding-001',
      contents: [
        {
          parts: [{ text: text }],
        },
      ],
      config: {
        outputDimensionality: 768,
      },
    });

    return response.embeddings?.[0]?.values;
  } catch (err) {
    console.error('Error generating embeddings:', err);
    throw err;
  }
}
