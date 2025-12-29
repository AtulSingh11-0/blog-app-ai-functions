# Blog App AI Functions

![License: AGPL-3.0](https://img.shields.io/badge/license-AGPLv3-blue.svg)

A collection of Appwrite Cloud Functions powered by Google Gemini AI for blog post management and semantic search capabilities.

---

## 📋 Overview

This project contains two serverless functions designed to enhance a blog application with AI-powered features:

1. **Generate Post Summary Function** – Automatically generates concise, engaging summaries for blog posts  
2. **Semantic Search Function** – Enables semantic search across blog posts using vector embeddings  

---

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

---

### 2. Semantic Search Function

Performs semantic search on blog posts using vector embeddings and cosine similarity.

**Features:**

- Generates embeddings using Gemini Embedding Model (768 dimensions)
- Cosine similarity calculation for relevance matching
- Configurable similarity threshold
- Pagination support with limit and offset
- Integrates with Appwrite TablesDB

**Location:** [`functions/semantic-search-function`](functions/semantic-search-function)

---

## 🛠️ Technology Stack

- **Runtime:** Node.js 22
- **AI Provider:** Google Gemini AI  
  - `gemini-flash-lite-latest` for summary generation  
  - `gemini-embedding-001` for semantic search  
- **Backend:** Appwrite Cloud Functions
- **Database:** Appwrite TablesDB
- **Dependencies:**
  - `@google/genai` – Google Generative AI SDK
  - `node-appwrite` – Appwrite Node.js SDK

---

## 📦 Project Structure

This project follows a **modular architecture** with each function organized into separate, well-defined modules:

```text
blog-app-ai-functions/
├── README.md
├── CONTRIBUTING.md
├── appwrite.config.json          # Appwrite configuration (not in repo)
└── functions/
    ├── generate-post-summary-function/
    │   ├── src/
    │   │   ├── main.js           # Main entrypoint
    │   │   ├── config/
    │   │   │   └── constants.js  # Configuration constants
    │   │   ├── validators/
    │   │   │   └── request.js    # Request validation
    │   │   ├── handlers/
    │   │   │   └── summary.js    # Summary generation handler
    │   │   ├── services/
    │   │   │   └── gemini.js     # Gemini AI service
    │   │   └── utils/
    │   │       ├── response.js   # Response utilities
    │   │       └── text.js       # Text processing utilities
    │   ├── package.json
    │   └── README.md
    └── semantic-search-function/
        ├── src/
        │   ├── main.js           # Main entrypoint
        │   ├── config/
        │   │   ├── appwrite.js   # Appwrite client setup
        │   │   └── constants.js  # Configuration constants
        │   ├── validators/
        │   │   └── search.js     # Search parameter validation
        │   ├── handlers/
        │   │   └── search.js     # Semantic search handler
        │   ├── services/
        │   │   ├── database.js   # Database service
        │   │   └── gemini.js     # Gemini AI embedding service
        │   └── utils/
        │       ├── math.js       # Vector math utilities
        │       └── response.js   # Response utilities
        ├── package.json
        └── README.md
````

### Architecture Principles

Both functions follow a **modular, layered architecture**:

- **`main.js`** – Entrypoint with route handling and orchestration
- **`config/`** – Configuration constants and client initialization
- **`validators/`** – Input validation with meaningful error messages
- **`handlers/`** – Core business logic and orchestration
- **`services/`** – External API integrations (Gemini, Appwrite)
- **`utils/`** – Reusable utility functions

**Benefits:**

- ✅ **Separation of Concerns** – Each module has a single responsibility
- ✅ **Maintainability** – Easy to locate and modify specific functionality
- ✅ **Testability** – Each module can be unit tested independently
- ✅ **Reusability** – Utilities can be imported across modules
- ✅ **Scalability** – Simple to add new features without cluttering files
- ✅ **Documentation** – JSDoc comments on all functions

---

## 🔧 Setup & Configuration

### Prerequisites

- [Appwrite Cloud](https://cloud.appwrite.io) account
- Google Gemini API key
- [Appwrite CLI](https://appwrite.io/docs/tooling/command-line/installation)

---

### Environment Variables

Both functions require the following environment variables.

#### Generate Post Summary Function

- `GOOGLE_GENAI_API_KEY` – Your Google Gemini API key

#### Semantic Search Function

- `GOOGLE_GENAI_API_KEY` – Your Google Gemini API key
- `APPWRITE_ENDPOINT` – Your Appwrite endpoint URL
- `APPWRITE_PROJECT_ID` – Your Appwrite project ID
- `APPWRITE_API_KEY` – Your Appwrite API key
- `APPWRITE_DATABASE_ID` – Database ID containing blog posts
- `APPWRITE_POSTS_TABLE_ID` – Table ID for blog posts

---

## 🚀 Deployment

> **Important:** The `appwrite.config.json` file is not included in the repository because it contains project-specific configuration and secrets. You must generate your own configuration.

### Initial Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/AtulSingh11-0/blog-app-ai-functions.git
   cd blog-app-ai-functions
   ```

2. **Install Appwrite CLI**

   ```bash
   npm install -g appwrite-cli
   ```

3. **Login to Appwrite**

   ```bash
   appwrite login
   ```

4. **Initialize Appwrite project**

   ```bash
   appwrite init project
   ```

5. **Pull or initialize functions**

   ```bash
   appwrite pull functions
   # or
   appwrite init functions
   ```

6. **Configure environment variables** via Appwrite Console or CLI

7. **Deploy functions**

   ```bash
   appwrite push functions
   ```

> Appwrite CLI commands may change over time. Refer to the official documentation if needed.

---

## 📖 API Documentation

### Generate Post Summary

**Endpoint:** `POST /generate-post-summary`

**Request Body:**

```json
{
  "title": "Your Blog Post Title",
  "content": "<p>Your blog post content...</p>"
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

---

### Semantic Search

**Endpoint:** `GET /search`

**Query Parameters:**

- `query` (required)
- `limit` (default: 1000)
- `offset` (default: 0)
- `threshold` (default: 0.5)

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

---

## 🔒 Security

- API keys and secrets are managed via Appwrite environment variables
- Proper authentication is required for Appwrite access
- Input validation is applied where applicable

> This project is provided **“as is”**, without warranty of any kind.
> You are responsible for securing your deployment, API keys, and cloud resources.

---

## 📝 Development

### Local Development

```bash
cd functions/generate-post-summary-function
# or
cd functions/semantic-search-function

npm install
npm run format
```

---

## 📄 License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.
It is part of a blog application powered by Appwrite and Google Gemini AI.

- You are free to use, study, and modify this project
- Any modifications or derivative works **must remain open source** under AGPL-3.0
- If you run a modified version as a network service, you must provide the source code

---

## ©️ Copyright

© 2025 **Atul Singh**
All original code in this repository is authored by Atul Singh and licensed under AGPL-3.0.

---

## 🤝 Contributing

We welcome contributions! Whether it's bug fixes, new features, documentation improvements, or performance optimizations.

**Before contributing, please read our [Contributing Guidelines](CONTRIBUTING.md)** which includes:

- Project structure and code organization
- Code style and best practices
- Testing requirements
- How to submit pull requests
- Development tips and common pitfalls

Quick start for contributors:

```bash
# Fork and clone the repository
git clone https://github.com/your-username/blog-app-ai-functions.git

# Create a feature branch
git checkout -b feature/your-feature-name

# Install dependencies
cd functions/your-function-name
npm install

# Make your changes and test locally
appwrite run functions

# Format your code
npm run format

# Commit and push
git commit -m "feat: your feature description"
git push origin feature/your-feature-name
```

Then open a pull request with a clear description of your changes.

**By contributing to this repository, you agree that your contributions will be licensed under the AGPL-3.0.**

For detailed guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 📞 Support

- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite Discord](https://appwrite.io/discord)
- [Google Gemini AI Documentation](https://ai.google.dev/docs)

---

Built with ❤️ using [Appwrite](https://appwrite.io) and [Google Gemini AI](https://ai.google.dev)
