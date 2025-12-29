import { GoogleGenAI } from '@google/genai';

/* -------------------- CONSTANTS -------------------- */

const MAX_CONTENT_LENGTH_DB = 100_000; // max content length allowed in DB
const MAX_CONTENT_LENGTH = 3_000; // max content length to send to Gemini API
const SUMMARY_MAX_WORDS = 70; // max words in the summary
const MAX_RETRIES = 3; // max retries for rate limit errors
const RETRY_BASE_DELAY = 10_000; // base delay for retries in ms

// gemini setup
const gemini = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

/* -------------------- MAIN HANDLER -------------------- */

export default async ({ req, res, log, error }) => {
  try {
    if (req.method !== 'POST') {
      return reply(res, 405, 'Method not allowed');
    }

    if (req.path !== '/generate-post-summary') {
      return reply(res, 404, 'Endpoint not found');
    }

    // validate request body
    validateRequestBody(req.body);

    const summary = await generateBlogSummary(req.body, log, error);
    return res.json({
      success: true,
      statusCode: 200,
      message: 'Post summary generated successfully',
      data: { summary },
    });
  } catch (err) {
    error('Error in main handler:', err || err?.message);
    return res.json({
      success: false,
      statusCode: err?.status || 500,
      message: err?.message || 'Internal server error',
    });
  }
};

/* -------------------- HELPERS -------------------- */

// validates the request body, checks if title and content are present and is content length within limits
function validateRequestBody(body) {
  if (!body?.title || !body?.content) {
    throw Object.assign(new Error('Missing title or content'), { status: 400 });
  }

  if (body.content.length > MAX_CONTENT_LENGTH_DB) {
    throw Object.assign(
      new Error(`Content exceeds ${MAX_CONTENT_LENGTH_DB} characters`),
      {
        status: 400,
      }
    );
  }
}

// generates the blog summary using Gemini API
async function generateBlogSummary(post, log, error, retries = MAX_RETRIES) {
  try {
    const plainTextContent = stripHtmlTags(post?.content);
    const truncatedContent = truncateContent(
      plainTextContent,
      MAX_CONTENT_LENGTH
    );

    if (truncateContent.length / 4 > SUMMARY_MAX_WORDS) {
      truncateContent.substring(0, SUMMARY_MAX_WORDS * 4);
    }

    const prompt = `
      Generate a concise and engaging summary for the following blog post titled "${post?.title}".
      Requirements:
        - Capture the main points and key takeaways
        - Make it compelling to entice readers
        - Length: ${SUMMARY_MAX_WORDS} words
        - Write in an engaging, professional tone
        - the summary should be in plain text without any markdown or special formatting
      Content:
        "${truncatedContent}"`;

    const response = await gemini.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      config: {
        temperature: 1.0,
        maxOutputTokens: 150,
        topP: 0.95,
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    });

    const summary =
      response?.text ||
      response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      '';

    if (!summary || summary.trim().length === 0) {
      error('Empty summary generated from Gemini API');
      throw new Error('Empty summary generated');
    }

    return summary.trim();
  } catch (err) {
    return handleSummaryErrors(err, post, log, error, retries);
  }
}

/* -------------------- HANDLERS -------------------- */

// handles errors during summary generation with retries for rate limit errors
function handleSummaryErrors(err, post, log, error, retries) {
  // handle rate limit errors with retry
  if (err.status === 429 && retries > 0) {
    const delay =
      2 ** (MAX_RETRIES - retries) * RETRY_BASE_DELAY +
      Math.floor(Math.random() * 1_000);

    log(
      `Rate limited. Retrying in ${(delay / 1000).toFixed(2)}s... (${retries} retries left)`
    );
    return new Promise((resolve) => setTimeout(resolve, delay)).then(() =>
      generateBlogSummary(post, log, error, retries - 1)
    );
  }

  // fallback for other errors
  error('Generate blog summary error:', err.message || err);

  // return a simple fallback summary instead of throwing an error
  return createFallbackSummary(post);
}

/* -------------------- UTILITIES -------------------- */

// strips HTML tags from content to get plain text
function stripHtmlTags(content) {
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// truncates content to a maximum length
function truncateContent(content, maxLength) {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + '...';
}

// sends a standardized error response
function reply(res, code, msg) {
  return res.json({ success: false, statusCode: code, message: msg });
}

/* -------------------- FALLBACK -------------------- */

// creates a simple fallback summary by extracting the first N words from the content if Gemini API fails
function createFallbackSummary(post) {
  const plainTextContent = stripHtmlTags(post?.content);
  const words = plainTextContent
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .splice(0, SUMMARY_MAX_WORDS);
  return words.join(' ') + (words.length >= SUMMARY_MAX_WORDS ? '...' : '');
}
