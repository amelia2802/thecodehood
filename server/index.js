import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { findMatchingDirectoryCommunities } from './verifiedCommunities.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Allowed frontend origin configuration
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;
const allowedOrigins = FRONTEND_ORIGIN
  ? FRONTEND_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://localhost:4173', 'http://localhost:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);
      if (!FRONTEND_ORIGIN || allowedOrigins.includes(origin) || FRONTEND_ORIGIN === '*') {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10kb' }));

// Open-weight model and endpoint details
const HF_ROUTER_URL = 'https://router.huggingface.co/v1/chat/completions';
const DEFAULT_MODEL = 'meta-llama/Llama-3.1-8B-Instruct';
const ACTIVE_MODEL = process.env.HF_MODEL || DEFAULT_MODEL;

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'TheCodeHood Community Matchmaker API',
    model: ACTIVE_MODEL,
    provider: 'Hugging Face Inference Providers (router.huggingface.co)',
    hasHfToken: Boolean(process.env.HF_TOKEN),
  });
});

// Helper to sanitize text strings
function sanitizeString(input, maxLength = 100) {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '').slice(0, maxLength);
}

// Allowed values
const VALID_MEETUP_PREFERENCES = ['in_person', 'online', 'either'];
const VALID_SOCIAL_COMFORT = [
  "I'm new to meetups",
  "I'm a little nervous",
  "I'm ready to network",
];

// Helper to strip markdown JSON fences
function parseModelJson(content) {
  if (!content || typeof content !== 'string') {
    throw new Error('Empty response from model');
  }

  let cleaned = content.trim();
  // Strip ```json or ``` code fences
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }

  // Attempt direct JSON parse
  try {
    return JSON.parse(cleaned);
  } catch {
    // If there is surrounding text, try extracting the first JSON object block
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const extracted = cleaned.slice(firstBrace, lastBrace + 1);
      return JSON.parse(extracted);
    }
    throw new Error('Failed to parse model output as JSON');
  }
}

// Fallback plan generator when running in offline/test mode or if upstream provider is unavailable
function generateStructuredPlanFallback({
  interest,
  location,
  preferredMeetup,
  socialComfort,
  matchedCommunities,
}) {
  const isIntrovert = socialComfort.includes('nervous') || socialComfort.includes('new');
  const formatLabel =
    preferredMeetup === 'in_person'
      ? 'in-person'
      : preferredMeetup === 'online'
      ? 'virtual'
      : 'in-person or virtual';

  const recommendation = isIntrovert
    ? `Stepping away from the keyboard in ${location} doesn't mean jumping straight into a high-pressure networking circle. For your interest in ${interest}, taking gentle, self-paced steps towards ${formatLabel} communities lets you build genuine connections without feeling overwhelmed.`
    : `There is tremendous momentum in ${location}'s developer ecosystem. Your enthusiasm for ${interest} makes this the perfect moment to step out, exchange ideas, and collaborate with local builders face-to-face.`;

  const steps = [
    `Search for established ${interest} groups in ${location} on platforms like Meetup, Eventbrite, and local Discord/Slack channels.`,
    preferredMeetup === 'online'
      ? `Join a live, interactive community stream or voice study-hall to ease into group discussions from home.`
      : `Pick an event with an open Q&A or demo session, and arrive 10 minutes early so you can settle in comfortably.`,
    `Focus on connecting with just one person—asking a simple question like "What projects are you building lately?" is the most reliable icebreaker.`,
  ];

  const offlineChallenge =
    preferredMeetup === 'online'
      ? `Attend one virtual community co-working hour or breakout session and introduce yourself in the chat with your favorite ${interest} project.`
      : `Visit a local tech meetup or open co-working space in ${location}, and share one tech takeaway with another developer over coffee.`;

  const prepChecklist = [
    'Check the event venue, parking, and transit details the morning of the meetup.',
    'Formulate a 1-sentence friendly intro (e.g. "I\'m working on ' + interest + ' projects").',
    'Bring a notebook or charge your phone so you can jot down interesting project names or contacts.',
    'Remember you can leave whenever you feel your battery running low—setting boundaries keeps meetups enjoyable!',
  ];

  const verificationReminder =
    'Always verify event date, venue access, entry requirements, and code of conduct on the official event page before heading out.';

  return {
    recommendation,
    steps,
    offlineChallenge,
    prepChecklist,
    verificationReminder,
    matchedCommunities: matchedCommunities.map((c) => ({
      name: c.name,
      format: c.format,
      location: [c.city, c.state].filter(Boolean).join(', ') || 'Global / Online',
      technologies: c.technologies,
      website_url: c.website_url,
    })),
  };
}

// Main POST /api/matchmaker endpoint
app.post('/api/matchmaker', async (req, res) => {
  try {
    const rawInterest = req.body?.interest;
    const rawLocation = req.body?.location;
    const rawMeetup = req.body?.preferredMeetup;
    const rawComfort = req.body?.socialComfort;
    const isMockRequested = Boolean(req.body?.isMock || req.headers['x-test-mode']);

    // Input Validation
    const interest = sanitizeString(rawInterest, 60);
    const location = sanitizeString(rawLocation, 100);
    const preferredMeetup = sanitizeString(rawMeetup, 20).toLowerCase();
    const socialComfort = sanitizeString(rawComfort, 50);

    const errors = {};
    if (!interest) errors.interest = 'Interest is required (up to 60 characters).';
    if (!location) errors.location = 'Location (city, state, or ZIP) is required.';
    if (!VALID_MEETUP_PREFERENCES.includes(preferredMeetup)) {
      errors.preferredMeetup = 'Preferred meetup must be "in_person", "online", or "either".';
    }
    if (!VALID_SOCIAL_COMFORT.includes(socialComfort)) {
      errors.socialComfort = 'Social comfort selection is required.';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors,
      });
    }

    // Retrieve verified directory listings as source of truth
    const matchedCommunities = findMatchingDirectoryCommunities(interest, location);

    // If test mode or mock requested, return structured plan directly
    if (isMockRequested) {
      const plan = generateStructuredPlanFallback({
        interest,
        location,
        preferredMeetup,
        socialComfort,
        matchedCommunities,
      });
      return res.json({
        success: true,
        model: 'test-mock-validator',
        plan,
      });
    }

    // Check Hugging Face token
    const token = process.env.HF_TOKEN;
    if (!token) {
      return res.status(503).json({
        error:
          'Hugging Face Inference token (HF_TOKEN) is not configured on the server. Please set HF_TOKEN in your environment or .env file.',
        hint: 'You can create a free User Access Token at https://huggingface.co/settings/tokens',
      });
    }

    // Build system and user prompt with strict grounding rules
    const directoryContext =
      matchedCommunities.length > 0
        ? `VERIFIED EXISTING DIRECTORY LISTINGS FOR THIS LOCATION/INTEREST:\n` +
          matchedCommunities
            .map(
              (c) =>
                `- Name: "${c.name}", Location: "${c.city}, ${c.state} ${c.postal_code}", Format: "${c.format}", Tech: [${c.technologies.join(', ')}]`
            )
            .join('\n')
        : 'No exact verified listings found in TheCodeHood directory for this specific city/tech. DO NOT invent fake community names, URLs, or addresses.';

    const systemPrompt = `You are TheCodeHood Community Matchmaker, a warm, welcoming AI guide helping tech enthusiasts connect offline for the Hacktoberfest "Touch Grass" challenge.
Your mission is to encourage stepping away from the screen into real-world or interactive community spaces while being 100% supportive of introverts, beginners, and people with social hesitation. Never shame anyone for preferring online or quiet spaces.

GROUNDING & INTEGRITY RULES:
1. NEVER invent fake organizations, fictitious venues, mock dates, or non-existent URLs.
2. If verified directory listings are provided below, you may mention them by name as verified directory starting points.
3. If no matching directory listings are provided, give practical advice on how to find authentic local tech gatherings (e.g., searching Meetup.com, Eventbrite, local library boards, or open source user groups).
4. Emphasize that your suggestions are AI guidance and planning advice, not verified live event tickets.

You MUST respond strictly with valid JSON without any markdown formatting or commentary outside the JSON.
Schema:
{
  "recommendation": "A warm, encouraging paragraph tailored to their interest and comfort level.",
  "steps": [
    "Step 1: practical action to find or evaluate a meetup",
    "Step 2: practical action to attend or participate",
    "Step 3: practical tip for conversation or engagement"
  ],
  "offlineChallenge": "One small, achievable offline challenge (e.g., attending one meetup, visiting a coworking open day, or introducing themselves to one developer).",
  "prepChecklist": [
    "Check venue, transit, and schedule beforehand",
    "Prepare a 1-sentence casual intro",
    "Plan an easy exit strategy if social energy depletes"
  ],
  "verificationReminder": "Always verify event details, safety, and schedules on official community pages before travelling."
}`;

    const userPrompt = `User Profile:
- Tech Interest: ${interest}
- Location: ${location}
- Preferred Meetup Format: ${preferredMeetup}
- Social Comfort Level: ${socialComfort}

${directoryContext}

Generate the community plan as strictly valid JSON according to the schema.`;

    // Call Hugging Face OpenAI-compatible chat router
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    let hfResponse;
    try {
      hfResponse = await fetch(HF_ROUTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          model: ACTIVE_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.6,
          max_tokens: 900,
        }),
        signal: controller.signal,
      });
    } catch (fetchErr) {
      clearTimeout(timeoutId);
      if (fetchErr.name === 'AbortError') {
        return res.status(504).json({
          error: 'The AI service timed out while generating your plan. Please try again.',
        });
      }
      return res.status(502).json({
        error: 'Network connection to the AI provider failed. Please check your internet connection and try again.',
      });
    }
    clearTimeout(timeoutId);

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text().catch(() => '');
      console.error(`[HF Router Error] HTTP ${hfResponse.status}:`, errorText.slice(0, 300));

      if (hfResponse.status === 401) {
        return res.status(401).json({
          error: 'Hugging Face authentication failed. Please verify that your HF_TOKEN is valid.',
        });
      }
      if (hfResponse.status === 429) {
        return res.status(429).json({
          error: 'Hugging Face API rate limit reached. Please wait a moment and try again.',
        });
      }
      if (hfResponse.status === 503) {
        return res.status(503).json({
          error: 'The AI model is currently loading or warming up. Please try again in 30 seconds.',
        });
      }

      return res.status(502).json({
        error: `AI provider error (HTTP ${hfResponse.status}). Please try again shortly.`,
      });
    }

    const data = await hfResponse.json();
    const modelMessage = data?.choices?.[0]?.message?.content;

    let parsedPlan;
    try {
      parsedPlan = parseModelJson(modelMessage);
    } catch (jsonErr) {
      console.warn('[JSON Parse Warning] Falling back to structured parser:', jsonErr.message);
      parsedPlan = generateStructuredPlanFallback({
        interest,
        location,
        preferredMeetup,
        socialComfort,
        matchedCommunities,
      });
    }

    // Attach verified matching directory communities
    parsedPlan.matchedCommunities = matchedCommunities.map((c) => ({
      name: c.name,
      format: c.format,
      location: [c.city, c.state].filter(Boolean).join(', ') || 'Global / Online',
      technologies: c.technologies,
      website_url: c.website_url,
    }));

    // Ensure verificationReminder is always present
    if (!parsedPlan.verificationReminder) {
      parsedPlan.verificationReminder =
        'Please verify event details, venue safety, and schedules on official community pages before travelling.';
    }

    return res.json({
      success: true,
      model: ACTIVE_MODEL,
      plan: parsedPlan,
    });
  } catch (err) {
    console.error('[Matchmaker Server Error]:', err);
    return res.status(500).json({
      error: 'An unexpected server error occurred while processing your community plan.',
    });
  }
});

// Start server only when run directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[TheCodeHood Matchmaker Server] Running on port ${PORT}`);
    console.log(`[TheCodeHood Matchmaker Server] Configured model: ${ACTIVE_MODEL}`);
  });
}

export default app;
