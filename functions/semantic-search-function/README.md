# Semantic Search Function

An Appwrite Cloud Function that enables semantic search across blog posts using vector embeddings and cosine similarity powered by Google Gemini AI.

## 📋 Overview

This function provides intelligent semantic search capabilities for blog posts by converting text queries into vector embeddings and finding similar posts based on cosine similarity. Unlike traditional keyword-based search, semantic search understands the meaning and context of queries.

## ✨ Features

- **Vector Embeddings:** Generates 768-dimensional embeddings using Google Gemini
- **Cosine Similarity:** Calculates relevance scores between query and posts
- **Configurable Threshold:** Filter results by minimum similarity score
- **Pagination Support:** Handles large datasets with limit and offset parameters
- **Sorted Results:** Returns posts ordered by relevance (highest similarity first)
- **Appwrite Integration:** Seamlessly works with Appwrite TablesDB

## 🧰 Usage

### GET /search

Performs semantic search on blog posts based on a text query.

**Query Parameters:**

| Parameter   | Type   | Required | Default | Description                           |
| ----------- | ------ | -------- | ------- | ------------------------------------- |
| `query`     | string | Yes      | -       | The search query text                 |
| `limit`     | number | No       | 1000    | Maximum number of posts to fetch      |
| `offset`    | number | No       | 0       | Offset for pagination                 |
| `threshold` | number | No       | 0.5     | Minimum similarity score (0.0 to 1.0) |

**Example Request:**

```http
GET /search?query=machine%20learning%20tutorials&limit=10&threshold=0.6
```

**Response:**

Sample `200` Response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Relevant posts fetched successfully",
  "data": {
    "length": 5,
    "rows": [
      {
        "$id": "post-id-1",
        "title": "Introduction to Machine Learning",
        "content": "...",
        "embedding": "[0.123, 0.456, ...]",
        "similarity": 0.89
      },
      {
        "$id": "post-id-2",
        "title": "Deep Learning Basics",
        "content": "...",
        "embedding": "[0.789, 0.012, ...]",
        "similarity": 0.76
      }
    ]
  }
}
```

**Error Response:**

Sample `500` Response:

```json
{
  "success": false,
  "statusCode": 500,
  "message": "Internal Server Error",
  "error": "Error description here"
}
```

## 🔧 Configuration

| Setting           | Value           |
| ----------------- | --------------- |
| Runtime           | Node 22         |
| Entrypoint        | `src/main.js`   |
| Build Commands    | `npm install`   |
| Permissions       | `any`           |
| Timeout (Seconds) | 15              |
| Specification     | s-0.5vcpu-512mb |

### Project Structure

This function follows a **modular architecture** for better maintainability:

```text
src/
├── main.js                   # Main entrypoint and route handling
├── config/
│   ├── appwrite.js           # Appwrite client initialization
│   └── constants.js          # Configuration constants
├── validators/
│   └── search.js             # Search parameter validation
├── handlers/
│   └── search.js             # Semantic search orchestration
├── services/
│   ├── database.js           # Appwrite database service
│   └── gemini.js             # Gemini AI embedding service
└── utils/
    ├── math.js               # Vector math operations
    └── response.js           # Response utility functions
```

**Module Responsibilities:**

- **`main.js`** – Orchestrates request handling and response
- **`config/`** – Centralized configuration and client setup
- **`validators/`** – Input validation with comprehensive error checking
- **`handlers/`** – Core search logic and orchestration
- **`services/`** – External API integrations (Gemini, Appwrite)
- **`utils/`** – Reusable utility functions (math, responses)

**Benefits:**

- ✅ Clean separation of concerns
- ✅ Easy to test individual modules
- ✅ Simple to add new features
- ✅ Better code organization and readability

## 🔒 Environment Variables

| Variable                  | Description                            | Required |
| ------------------------- | -------------------------------------- | -------- |
| `GOOGLE_GENAI_API_KEY`    | Your Google Gemini API key             | Yes      |
| `APPWRITE_ENDPOINT`       | Appwrite API endpoint URL              | Yes      |
| `APPWRITE_PROJECT_ID`     | Your Appwrite project ID               | Yes      |
| `APPWRITE_API_KEY`        | Your Appwrite API key with permissions | Yes      |
| `APPWRITE_DATABASE_ID`    | Database ID containing blog posts      | Yes      |
| `APPWRITE_POSTS_TABLE_ID` | Table ID for blog posts                | Yes      |

## 📦 Dependencies

```json
{
  "@google/genai": "^1.34.0",
  "node-appwrite": "^20.2.1"
}
```

## 🔄 How It Works

The function follows a modular workflow:

1. **Query Reception** ([`main.js`](src/main.js)): Receives search query and parameters from the request
2. **Parameter Validation** ([`validators/search.js`](src/validators/search.js)): Validates query parameters (query, limit, offset, threshold)
3. **Generate Query Embedding** ([`services/gemini.js`](src/services/gemini.js)): Converts the query text into a 768-dimensional vector using Gemini
4. **Fetch Posts** ([`services/database.js`](src/services/database.js)): Retrieves posts from Appwrite TablesDB with pagination support
5. **Calculate Similarity** ([`utils/math.js`](src/utils/math.js)): Computes cosine similarity between query embedding and each post's embedding
6. **Filter & Sort** ([`handlers/search.js`](src/handlers/search.js)): Filters posts by threshold and sorts by similarity (descending)
7. **Return Results** ([`utils/response.js`](src/utils/response.js)): Returns relevant posts with similarity scores in standardized format

## 🔬 Technical Details

### Vector Embeddings

- **Model:** `gemini-embedding-001`
- **Dimensionality:** 768
- **Use Case:** Semantic similarity comparison

### Cosine Similarity

The function uses cosine similarity to measure the angle between two vectors:

$$\text{cosine}(A, B) = \frac{A \cdot B}{||A|| \times ||B||}$$

Where:

- $A \cdot B$ is the dot product of vectors A and B
- $||A||$ and $||B||$ are the magnitudes of vectors A and B
- Result ranges from -1 (opposite) to 1 (identical)

### Similarity Threshold

The default threshold of 0.5 means:

- **0.9 - 1.0:** Highly relevant (almost identical)
- **0.7 - 0.9:** Very relevant
- **0.5 - 0.7:** Moderately relevant
- **< 0.5:** Less relevant (filtered out by default)

## 📊 Database Schema Requirements

Your Appwrite posts table should include:

```javascript
{
  "$id": "string",           // Post ID
  "title": "string",         // Post title
  "content": "string",       // Post content
  "embedding": "string",     // JSON stringified array of 768 numbers
  // ... other fields
}
```

### Generating Embeddings for Existing Posts

To use this search function, your posts must have pre-generated embeddings. You can create a separate function or script to:

1. Fetch all posts
2. Generate embeddings for each post's content
3. Store embeddings in the `embedding` field

## 🚀 Local Development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Format code:

   ```bash
   npm run format
   ```

3. Test locally using Appwrite CLI:

   ```bash
   appwrite functions create-execution \
     --function-id <your-function-id> \
     --xpath "/search?query=machine%20learning&limit=10&threshold=0.6" \
     --method GET
   ```

   Or using POST with body:

   ```bash
   appwrite functions create-execution \
     --function-id <your-function-id> \
     --xpath "/search" \
     --method GET \
     --body '{}'
   ```

> **Note:** Appwrite has transitioned to kebab-case for CLI commands. The command is now `create-execution` (not `createExecution`). For GET requests with query parameters, include them in the `--xpath` parameter. If you encounter any errors, refer to the [official Appwrite CLI documentation](https://appwrite.io/docs/tooling/command-line/functions) for the latest command syntax.

## 📝 Example Use Cases

- **Blog Search:** Allow users to search blog posts by meaning, not just keywords
- **Content Discovery:** Find related articles based on topic similarity
- **Recommendation System:** Suggest similar posts to readers
- **Research Tools:** Help users find relevant technical content
- **Content Organization:** Automatically group similar posts together

## 🎯 Performance Considerations

- **Embedding Storage:** Store embeddings as JSON strings in the database
- **Batch Processing:** Default limit of 1000 posts can be adjusted based on performance
- **Caching:** Consider caching frequently used query embeddings
- **Indexing:** For large datasets, consider pre-filtering before similarity calculation

## 🐛 Troubleshooting

- **No results returned:** Try lowering the threshold value (e.g., 0.3)
- **Slow performance:** Reduce the limit parameter or implement pagination
- **Missing embeddings:** Ensure all posts have embeddings in the correct format
- **Invalid similarity scores:** Verify embeddings are 768-dimensional arrays
- **Connection errors:** Check Appwrite credentials and network connectivity

## 🔗 Related

- [Generate Post Summary Function](../generate-post-summary-function) - Generate summaries for blog posts
- [Google Gemini Embeddings Documentation](https://ai.google.dev/gemini-api/docs/embeddings)
- [Appwrite TablesDB Documentation](https://appwrite.io/docs/products/databases)

## 💡 Tips

- Use more descriptive queries for better results
- Experiment with different threshold values based on your content
- Consider combining semantic search with traditional filtering (tags, dates, etc.)
- Monitor API usage for the Gemini embedding model
