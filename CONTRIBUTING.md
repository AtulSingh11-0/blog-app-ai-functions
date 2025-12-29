# Contributing Guidelines

Thank you for your interest in contributing to **Blog App AI Functions**! 🎉

This project is open source and welcomes contributions of all kinds - bug fixes, improvements, documentation, new features, or optimizations.

Please read these guidelines carefully to ensure a smooth and effective contribution process.

---

## 📜 License & Legal Notice

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

### Important

- By contributing to this repository, you agree that your contributions will be licensed under **AGPL-3.0**
- Any modifications or derivative works **must remain open source**
- If your changes are deployed as a network service, the complete source code must be made available to users

---

## 🛠️ How to Contribute

### 1. Fork the Repository

Create your own fork from GitHub and clone it to your local machine.

### 2. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Make Your Changes

- Follow existing code style
- Keep changes focused and minimal
- Add comments where logic is complex

### 4. Test Your Changes Locally

**Before submitting a PR, test your function locally using the Appwrite CLI:**

```bash
# Navigate to function directory
cd functions/generate-post-summary-function

# Install dependencies
npm install

# Run function locally (requires Docker)
appwrite run functions --function-id <your-function-id>

# Test the function
curl -X POST http://localhost:3000/generate-post-summary \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"<p>Test content</p>"}'
```

**Testing Checklist:**

- ✅ Functions run without errors locally
- ✅ All edge cases are handled (empty input, invalid data, API failures)
- ✅ Environment variables are documented in function README
- ✅ No secrets, API keys, or credentials are committed
- ✅ Code is formatted with `npm run format`
- ✅ Dependencies in `package.json` are necessary and up-to-date
- ✅ Function response format is consistent with existing functions

**Environment Variables:**

Never commit `.env` files. Document all required environment variables in:

1. Function's README.md
2. Root README.md (if new variables are added)

### 5. Commit Messages

Use clear, descriptive commit messages:

```text
feat: add retry logic for Gemini embedding failures
fix: handle empty search query gracefully
docs: update README with deployment notes
```

### 6. Update Documentation

If your changes affect functionality, **update the relevant documentation:**

- Function README: Update API endpoints, parameters, examples
- Root README: Update if adding new features or changing setup
- CONTRIBUTING.md: Update if changing development workflow
- Add JSDoc comments for complex functions

### 7. Submit a Pull Request

**PR Title Format:**

```md
[function-name] Brief description of change
```

Examples:

- `[summary] Add retry logic for rate limit errors`
- `[search] Improve cosine similarity performance`
- `[docs] Update CLI command examples`

**PR Description Should Include:**

1. **What:** Clear description of the changes
2. **Why:** Rationale behind the changes
3. **How:** Implementation approach (if complex)
4. **Testing:** How you tested the changes
5. **Breaking Changes:** If any, clearly documented
6. **Related Issues:** Reference any related issues (#123)

**Example PR Description:**

```markdown
## What
Added exponential backoff retry logic for Gemini API rate limits

## Why
Users were experiencing function failures during high traffic periods

## How
- Implemented retry decorator with exponential backoff
- Max 3 retries with 10s base delay
- Added proper error logging

## Testing
- Tested locally with rate limit simulation
- Verified retry logic with forced failures
- Confirmed graceful fallback after max retries

## Breaking Changes
None
```

**After Submitting:**

- Be responsive to code review feedback
- Make requested changes promptly
- Ask questions if requirements are unclear
- Be open to suggestions and alternative approaches

---

## 📁 Project Structure

Understanding the project structure is crucial for effective contributions. This project follows a **modular, layered architecture**:

```text
blog-app-ai-functions/
├── README.md
├── CONTRIBUTING.md
├── appwrite.config.json                   # Appwrite configuration (not in repo)
└── functions/
    ├── generate-post-summary-function/
    │   ├── src/
    │   │   ├── main.js                   # Main entrypoint
    │   │   ├── config/
    │   │   │   └── constants.js          # Configuration constants
    │   │   ├── validators/
    │   │   │   └── request.js            # Request validation
    │   │   ├── handlers/
    │   │   │   └── summary.js            # Summary generation logic
    │   │   ├── services/
    │   │   │   └── gemini.js             # Gemini AI service
    │   │   └── utils/
    │   │       ├── response.js           # Response utilities
    │   │       └── text.js               # Text processing
    │   ├── package.json
    │   └── README.md
    └── semantic-search-function/
        ├── src/
        │   ├── main.js                   # Main entrypoint
        │   ├── config/
        │   │   ├── appwrite.js           # Appwrite client setup
        │   │   └── constants.js          # Configuration constants
        │   ├── validators/
        │   │   └── search.js             # Search validation
        │   ├── handlers/
        │   │   └── search.js             # Search orchestration
        │   ├── services/
        │   │   ├── database.js           # Database service
        │   │   └── gemini.js             # Embedding service
        │   └── utils/
        │       ├── math.js               # Vector operations
        │       └── response.js           # Response utilities
        ├── package.json
        └── README.md
```

### Key Structure Principles

1. **Self-Contained Functions:** Each function is independent and self-contained
2. **No Hardcoded Secrets:** Never commit API keys, tokens, or credentials
3. **Environment-Driven Config:** All sensitive configuration uses environment variables
4. **Minimal Dependencies:** Only necessary packages to reduce bundle size
5. **Modular Architecture:** Code is organized into logical layers and modules
6. **Single Responsibility:** Each file has one clear purpose

### Modular Architecture

**This project uses a modular, multi-file structure** for better organization and maintainability:

```javascript
// src/utils/text.js
export function stripHtmlTags(content) {
  return content.replace(/<[^>]+>/g, ' ');
}

// src/services/gemini.js
import { stripHtmlTags } from '../utils/text.js';

export async function generateSummary(post, log) {
  const cleaned = stripHtmlTags(post.content);
  // ... generate summary
}

// src/main.js
import { generateSummary } from './services/gemini.js';

export default async ({ req, res, log }) => {
  const summary = await generateSummary(req.body, log);
  return res.json({ success: true, data: { summary } });
};
```

**Why We Use This Structure:**

1. **Separation of Concerns:** Each module handles one specific responsibility
2. **Better Maintainability:** Easy to find and modify specific functionality
3. **Enhanced Testability:** Each module can be unit tested independently
4. **Improved Readability:** Small, focused files are easier to understand
5. **Code Reusability:** Utilities can be imported across modules
6. **Scalability:** Simple to add new features without cluttering existing files

**Appwrite fully supports ES6 imports** across multiple files, including:

- ✅ Relative imports (`./utils/text.js`, `../config/constants.js`)
- ✅ Nested directory structures
- ✅ Named exports and imports
- ✅ Default exports

### Module Organization Guidelines

When working on this project, follow these module organization rules:

#### **Directory Structure**

- **`config/`** – Configuration constants, client initialization
  - Keep all constants in one place
  - Initialize external clients (Appwrite, Gemini)
  
- **`validators/`** – Input validation logic
  - Validate request parameters
  - Throw errors with appropriate status codes
  - Keep validation logic separate from business logic

- **`handlers/`** – Core business logic and orchestration
  - Coordinate between services
  - Handle complex workflows (retry logic, fallbacks)
  - Keep handlers focused on orchestration, not implementation details

- **`services/`** – External API integrations
  - One service per external API (Gemini, Appwrite)
  - Handle API-specific logic and error handling
  - Return processed data, not raw API responses

- **`utils/`** – Reusable utility functions
  - Pure functions when possible
  - No side effects
  - Can be used across multiple modules

#### **Code Standards**

- Each function must have its own `package.json` with dependencies
- Function README must document API endpoints, environment variables, and usage
- Use ES6 module syntax (`import/export`) not CommonJS (`require/module.exports`)
- Always use relative imports with `.js` extension (e.g., `'./utils/text.js'`)
- One export per file when possible (makes imports cleaner)
- Group related functionality in the same directory

---

## 🧹 Code Style

### Formatting

- **Always run** `npm run format` before committing
- We use **Prettier** for consistent code formatting
- Line length: max 80 characters (configurable in `.prettierrc` if added)
- Indentation: 2 spaces
- Semicolons: Yes (JavaScript standard)

### JavaScript Best Practices

```javascript
// ✅ GOOD: Use destructuring for context object
export default async ({ req, res, log, error }) => {
  log('Function invoked');
};

// ❌ BAD: Don't use full context object
export default async (context) => {
  context.log('Function invoked');
};

// ✅ GOOD: Use constants for configuration
const MAX_RETRIES = 3;
const TIMEOUT = 15000;

// ❌ BAD: Magic numbers
for (let i = 0; i < 3; i++) { ... }

// ✅ GOOD: Proper error handling with context
try {
  const result = await apiCall();
  return res.json({ success: true, data: result });
} catch (err) {
  error('API call failed:', err.message);
  return res.json({ success: false, message: err.message }, 500);
}

// ❌ BAD: Throwing errors without handling
const result = await riskyOperation(); // May crash function
```

### Appwrite Function Patterns

1. **Always validate input:**

   ```javascript
   if (!req.body?.title || !req.body?.content) {
     return res.json({ success: false, message: 'Missing required fields' }, 400);
   }
   ```

2. **Use consistent response format:**

   ```javascript
   return res.json({
     success: boolean,
     statusCode: number,
     message: string,
     data?: object
   });
   ```

3. **Log liberally for debugging:**

   ```javascript
   log('Processing request:', { method: req.method, path: req.path });
   error('Database connection failed:', err.message);
   ```

4. **Handle rate limits and retries:**

   ```javascript
   async function withRetry(fn, retries = 3) {
     for (let i = 0; i < retries; i++) {
       try {
         return await fn();
       } catch (err) {
         if (err.status === 429 && i < retries - 1) {
           await delay(Math.pow(2, i) * 1000);
           continue;
         }
         throw err;
       }
     }
   }
   ```

### Code Quality

- Prefer **readable, maintainable code** over clever one-liners
- Add **comments** for complex logic, but write self-documenting code when possible
- Use **descriptive variable names** (`queryEmbedding` not `qe`)
- Handle **edge cases** (empty input, null values, API failures)
- Write **defensive code** that fails gracefully

---

## 🐞 Reporting Issues

When reporting an issue, please include:

- **Clear description** of the problem
- **Steps to reproduce** (be specific)
- **Expected vs actual behavior**
- **Environment details** (Node version, Appwrite version, OS)
- **Relevant logs or error messages** (redact secrets!)
- **Screenshots or screen recordings** (if applicable)

**Use this template:**

```markdown
## Description
[Clear description of the issue]

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Environment
- Node.js version:
- Appwrite version:
- Function: [generate-summary / semantic-search]
- OS: [Windows / macOS / Linux]

## Logs
[Paste relevant logs here, redact secrets]
```

---

## 💡 Development Tips

### Working with Appwrite Functions

1. **Use the Appwrite CLI for local testing** — it replicates the production environment
2. **Check function logs in Appwrite Console** — under Functions > Your Function > Executions
3. **Enable verbose logging** — use `log()` liberally during development
4. **Test with real data** — use actual blog posts to test edge cases
5. **Monitor execution time** — functions have a 15-second timeout

### Common Pitfalls to Avoid

❌ **Don't:** Use `console.log()` (won't show in Appwrite logs)  
✅ **Do:** Use `log()` from context object

❌ **Don't:** Forget to handle async errors  
✅ **Do:** Wrap async calls in try-catch blocks

❌ **Don't:** Use outdated CLI commands (check docs)  
✅ **Do:** Refer to [latest Appwrite CLI docs](https://appwrite.io/docs/tooling/command-line/commands)

❌ **Don't:** Hardcode configuration values  
✅ **Do:** Use environment variables via `process.env`

❌ **Don't:** Include `node_modules` in your commits  
✅ **Do:** Let Appwrite build dependencies during deployment

### Debugging Tips

```javascript
// Add detailed logging
log('Request received:', {
  method: req.method,
  path: req.path,
  bodyLength: req.bodyText?.length || 0
});

// Log before external API calls
log('Calling Gemini API with', { model, contentLength });

// Log errors with context
error('Failed to generate embedding:', {
  error: err.message,
  stack: err.stack,
  input: query.substring(0, 100) // Log partial input for debugging
});
```

### Performance Optimization

- **Minimize dependencies** — each package increases cold start time
- **Cache when possible** — consider memoization for repeated calls
- **Stream large responses** — use `res.text()` for large content
- **Limit API calls** — batch requests when possible
- **Set appropriate timeouts** — don't wait indefinitely for external APIs

---

## 🤝 Code of Conduct

Be respectful, constructive, and inclusive.
Harassment, discrimination, or unprofessional behavior will not be tolerated.

---

## 💡 Suggestions & Discussions

Feature requests and architectural discussions are welcome via GitHub Issues.

Thank you for helping improve this project 🚀

✔ Legally safe  
✔ Clear expectations  
✔ OSS-standard  
✔ Protects you as the maintainer  
