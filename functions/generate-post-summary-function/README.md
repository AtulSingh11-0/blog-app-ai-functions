# Generate Post Summary Function

An Appwrite Cloud Function that automatically generates concise, engaging summaries for blog posts using Google Gemini Flash Lite AI.

## 📋 Overview

This function processes blog post content and generates compelling summaries that capture the main points and key takeaways. It includes intelligent error handling, HTML stripping, and fallback mechanisms to ensure reliable summary generation.

## ✨ Features

- **AI-Powered Summaries:** Leverages Google Gemini Flash Lite for high-quality summary generation
- **HTML Processing:** Automatically strips HTML tags and normalizes content
- **Smart Truncation:** Handles long content by intelligently truncating to manageable lengths
- **Rate Limit Handling:** Implements exponential backoff retry logic for API rate limits
- **Fallback Mechanism:** Generates simple text-based summaries if AI fails
- **Input Validation:** Validates content length and required fields
- **Configurable Output:** Customizable summary length (default: 70 words)

## 🧰 Usage

### POST /generate-post-summary

Generates a summary for a blog post.

**Request Body:**

```json
{
  "title": "Your Amazing Blog Post Title",
  "content": "<p>Your blog post content with HTML tags and formatting...</p>"
}
```

**Response:**

Sample `200` Response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Post summary generated successfully",
  "data": {
    "summary": "A concise and engaging summary of your blog post that captures the main points and entices readers to continue reading..."
  }
}
```

**Error Response:**

Sample `400` Response (Missing fields):

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Missing title or content"
}
```

Sample `400` Response (Content too long):

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Content exceeds 100000 characters"
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
│   └── constants.js          # Configuration constants
├── validators/
│   └── request.js            # Request validation logic
├── handlers/
│   └── summary.js            # Summary generation with retry logic
├── services/
│   └── gemini.js             # Gemini AI service integration
└── utils/    
    ├── request.js            # Request parsing utilities
    ├── response.js           # Response utility functions
    └── text.js               # Text processing utilities
```

**Module Responsibilities:**

- **`main.js`** – Orchestrates request handling and response
- **`config/`** – Centralized configuration and constants
- **`validators/`** – Input validation with error handling
- **`handlers/`** – Core business logic and retry mechanisms
- **`services/`** – External API integrations (Gemini)
- **`utils/`** – Reusable utility functions (request parsing, responses, text processing)

**Benefits:**

- ✅ Clean separation of concerns
- ✅ Easy to test individual modules
- ✅ Simple to add new features
- ✅ Better code organization and readability

### Configuration Constants

The function uses the following configurable constants (defined in [`src/config/constants.js`](src/config/constants.js)):

- `MAX_CONTENT_LENGTH_DB`: 100,000 characters (maximum content length accepted)
- `MAX_CONTENT_LENGTH`: 3,000 characters (maximum content sent to Gemini API)
- `SUMMARY_MAX_WORDS`: 70 words (target summary length)
- `MAX_RETRIES`: 3 (maximum retry attempts for rate limits)
- `RETRY_BASE_DELAY`: 10,000ms (base delay for exponential backoff)
- `GEMINI_CONFIG`: Gemini model configuration (model, temperature, tokens, etc.)

## 🔒 Environment Variables

| Variable               | Description                | Required |
| ---------------------- | -------------------------- | -------- |
| `GOOGLE_GENAI_API_KEY` | Your Google Gemini API key | Yes      |

## 📦 Dependencies

```json
{
  "@google/genai": "^1.34.0",
  "node-appwrite": "^20.2.1"
}
```

## 🔄 How It Works

The function follows a modular workflow:

1. **Request Parsing** ([`utils/request.js`](src/utils/request.js)): Parses request body from multiple sources (Postman, Appwrite SDK, HTTP) using `bodyJson`, `bodyText`, or `body`
2. **Validation** ([`validators/request.js`](src/validators/request.js)): Validates incoming request for required fields (title, content) and content length limits
3. **HTML Stripping** ([`utils/text.js`](src/utils/text.js)): Removes HTML tags, scripts, and styles to extract plain text
4. **Truncation** ([`utils/text.js`](src/utils/text.js)): Truncates content to 3,000 characters for API efficiency
5. **AI Generation** ([`services/gemini.js`](src/services/gemini.js)): Sends optimized prompt to Gemini Flash Lite for summary generation
6. **Error Handling** ([`handlers/summary.js`](src/handlers/summary.js)): Implements retry logic for rate limits with exponential backoff
7. **Fallback** ([`handlers/summary.js`](src/handlers/summary.js)): If AI fails, generates a simple text-based summary from the first 70 words
8. **Response** ([`utils/response.js`](src/utils/response.js)): Returns the generated summary in a standardized JSON format

## 🛠️ Technical Details

### Gemini AI Configuration

- **Model:** `gemini-flash-lite-latest`
- **Temperature:** 1.0 (creative and varied outputs)
- **Max Output Tokens:** 150
- **Top P:** 0.95
- **Thinking Budget:** 0 (disabled)

### Error Handling

- **Rate Limits (429):** Automatic retry with exponential backoff (up to 3 attempts)
- **API Failures:** Falls back to extracting first N words from content
- **Validation Errors:** Returns appropriate HTTP status codes (400, 405, 404)

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
     --body '{"title":"Test Post","content":"<p>Test content...</p>"}' \
     --xpath /generate-post-summary \
     --method POST
   ```

> **Note:** Appwrite has transitioned to kebab-case for CLI commands. The command is now `create-execution` (not `createExecution`). Additionally, the `--xpath` parameter is required to specify the function endpoint path. If you encounter any errors, refer to the [official Appwrite CLI documentation](https://appwrite.io/docs/tooling/command-line/functions) for the latest command syntax.

## 📝 Example Use Cases

- **Blog Management Systems:** Automatically generate summaries for new blog posts
- **Content Management:** Create preview text for article listings
- **RSS Feeds:** Generate descriptions for feed items
- **Social Media:** Create shareable snippets for social posts
- **Email Newsletters:** Generate compelling email preview text

## 🐛 Troubleshooting

- **Empty summaries:** Check if content is too short or contains only HTML tags
- **Rate limit errors:** Function will automatically retry with delays
- **Timeout errors:** Consider reducing `MAX_CONTENT_LENGTH` for faster processing
- **Invalid API key:** Verify `GOOGLE_GENAI_API_KEY` is set correctly in environment variables

## 📚 Related

- [Semantic Search Function](../semantic-search-function) - Search blog posts semantically
- [Google Gemini AI Documentation](https://ai.google.dev/docs)
- [Appwrite Functions Documentation](https://appwrite.io/docs/products/functions)
