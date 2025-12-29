# Blog App AI Functions

A collection of Appwrite Cloud Functions powered by Google Gemini AI for blog post management and semantic search capabilities.

## 📋 Overview

This project contains two serverless functions designed to enhance a blog application with AI-powered features:

1. **Generate Post Summary Function** - Automatically generates concise, engaging summaries for blog posts
2. **Semantic Search Function** - Enables semantic search across blog posts using vector embeddings

## 🚀 Functions

### 1. Generate Post Summary Function

Leverages Google Gemini Flash Lite to generate compelling summaries for blog posts.

**Features:**

- Generates concise summaries (up to 70 words)
- Strips HTML tags for clean text processing
- Rate limit handling with exponential backoff
- Fallback summary generation if API fails
- Supports posts up to 100,000 characters

**Location:** [`functions/generate-post-summary-function`](functions/generate-post-summary-function)

### 2. Semantic Search Function

Performs semantic search on blog posts using vector embeddings and cosine similarity.

**Features:**

- Generates embeddings using Gemini Embedding Model (768 dimensions)
- Cosine similarity calculation for relevance matching
- Configurable similarity threshold
- Pagination support with limit and offset
- Integrates with Appwrite TablesDB

**Location:** [`functions/semantic-search-function`](functions/semantic-search-function)

## 🛠️ Technology Stack

- **Runtime:** Node.js 22
- **AI Provider:** Google Gemini AI
  - `gemini-flash-lite-latest` for summary generation
  - `gemini-embedding-001` for semantic search
- **Backend:** Appwrite Cloud Functions
- **Database:** Appwrite TablesDB
- **Dependencies:**
  - `@google/genai` - Google Generative AI SDK
  - `node-appwrite` - Appwrite Node.js SDK

## 📦 Project Structure

```text
blog-app-ai-functions/
├── appwrite.config.json          # Appwrite project configuration
├── functions/
│   ├── generate-post-summary-function/
│   │   ├── src/
│   │   │   └── main.js          # Summary generation logic
│   │   ├── package.json
│   │   └── README.md
│   └── semantic-search-function/
│       ├── src/
│       │   └── main.js          # Semantic search logic
│       ├── package.json
│       └── README.md
└── README.md
```

## 🔧 Setup & Configuration

### Prerequisites

- [Appwrite Cloud](https://cloud.appwrite.io) account
- Google Gemini API key
- [Appwrite CLI](https://appwrite.io/docs/tooling/command-line/installation)

### Environment Variables

Both functions require the following environment variables:

#### Generate Post Summary Function

- `GOOGLE_GENAI_API_KEY` - Your Google Gemini API key

#### Semantic Search Function

- `GOOGLE_GENAI_API_KEY` - Your Google Gemini API key
- `APPWRITE_ENDPOINT` - Your Appwrite endpoint URL
- `APPWRITE_PROJECT_ID` - Your Appwrite project ID
- `APPWRITE_API_KEY` - Your Appwrite API key
- `APPWRITE_DATABASE_ID` - Database ID containing blog posts
- `APPWRITE_POSTS_TABLE_ID` - Table ID for blog posts

### Deployment

**Important Note:** The `appwrite.config.json` file is not included in the repository as it contains project-specific configuration and secrets. You'll need to set up your own configuration.

#### Initial Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/AtulSingh11-0/blog-app-ai-functions.git
   cd blog-app-ai-functions
   ```

2. **Install Appwrite CLI** (if not already installed):

   ```bash
   npm install -g appwrite-cli
   ```

3. **Login to your Appwrite account:**

   ```bash
   appwrite login
   ```

4. **Initialize your Appwrite project:**

   ```bash
   appwrite init project
   ```

   This creates your `appwrite.config.json` file with your project configuration.

5. **Pull your existing functions** (if you have them on Appwrite Console):

   ```bash
   appwrite pull functions
   ```

   Or **initialize new functions** from scratch:

   ```bash
   appwrite init functions
   ```

6. **Configure environment variables** for each function in the Appwrite Console or via CLI.

7. **Deploy your functions:**

   ```bash
   appwrite push functions
   ```

> **Note:** Appwrite CLI commands may be updated over time. If you encounter any errors, please refer to the [official Appwrite CLI documentation](https://appwrite.io/docs/tooling/command-line/installation) for the latest command syntax.

## 📖 API Documentation

### Generate Post Summary

**Endpoint:** `POST /generate-post-summary`

**Request Body:**

```json
{
  "title": "Your Blog Post Title",
  "content": "<p>Your blog post content with HTML tags...</p>"
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Post summary generated successfully",
  "data": {
    "summary": "Generated summary text..."
  }
}
```

### Semantic Search

**Endpoint:** `GET /search`

**Query Parameters:**

- `query` (required) - Search query text
- `limit` (optional) - Maximum number of posts to fetch (default: 1000)
- `offset` (optional) - Offset for pagination (default: 0)
- `threshold` (optional) - Minimum similarity score (default: 0.5)

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Relevant posts fetched successfully",
  "data": {
    "length": 5,
    "rows": [
      {
        "id": "post-id",
        "title": "Post Title",
        "content": "Post content...",
        "similarity": 0.87
      }
    ]
  }
}
```

## 🔒 Security

- All functions require API keys and proper authentication
- Execute permissions set to "any" (configure based on your needs)
- Environment variables are securely stored in Appwrite
- Input validation to prevent malicious content

## 📝 Development

### Local Development

1. Navigate to a function directory:

   ```bash
   cd functions/generate-post-summary-function
   # or
   cd functions/semantic-search-function
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Format code:

   ```bash
   npm run format
   ```

## 📄 License

This project is part of a blog application powered by Appwrite and Google Gemini AI.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📞 Support

For issues and questions:

- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite Discord](https://appwrite.io/discord)
- [Google Gemini AI Documentation](https://ai.google.dev/docs)

---

Built with ❤️ using [Appwrite](https://appwrite.io) and [Google Gemini AI](https://ai.google.dev)
