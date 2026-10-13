# TheCodeHood 🏡

A community directory for developers and technologists to discover local meetups, build connections, and step away from the screen.

Repository: [https://github.com/amelia2802/thecodehood](https://github.com/amelia2802/thecodehood)

---

## 🤖 Built with Entire

TheCodeHood was developed using [Entire](https://entire.dev) as the AI agent runtime — a context-recording layer that tracks every agent session, links them to Git commits, and produces a full audit trail of how the codebase evolved.

### How Entire is configured in this project

| Setting | Value | Purpose |
|---|---|---|
| `enabled` | `true` | Entire is active for all agent sessions |
| `telemetry` | `true` | Anonymous session telemetry enabled |
| `checkpoints.primary.type` | `git-refs` | Every Git ref (commit/tag) is a checkpoint |
| `commit_linking` | `always` | Every commit is linked to the agent session that produced it |

### What this means in practice

- **Session recordings** live in `.entire/metadata/<session-id>/full.jsonl` — a complete, structured log of every prompt, tool call, and model response from each agent coding session.
- **Commit linking** (`"always"`) means you can trace any line of code back to the exact agent session and user prompt that created it.
- **Git-refs checkpoints** let Entire restore or diff project state at any tagged commit — useful for reviewing what changed between labs.
- **The `.entire/` directory is Git-tracked** (excluding `.entire/logs/` and `.entire/tmp/` via `.entire/.gitignore`) so session history travels with the repo.

### Files

```
.entire/
├── settings.json          # Main Entire config (enabled, telemetry, checkpoints)
├── settings.local.json    # Local override: commit_linking = "always"
├── metadata/              # Agent session recordings (JSONL transcripts)
│   ├── <session-id>/
│   │   ├── full.jsonl     # Complete session transcript
│   │   └── prompt.txt     # Initial prompt for the session (if stored)
├── logs/
│   └── entire.log         # Runtime agent logs (gitignored)
└── tmp/                   # Temporary working files (gitignored)
```

---

## 🌿 Hacktoberfest Challenge: Week 1 — Touch Grass

### TheCodeHood Community Matchmaker

As part of the **Hacktoberfest Open-Source AI Challenge (Week 1: Touch Grass)**, TheCodeHood introduces the **Community Matchmaker**—an AI-guided feature designed to help developers find practical, comfortable pathways to connect with tech communities in the real world.

### ✨ What It Does
- **Low-Pressure Discovery**: Tailored specifically for introverts, beginners, and seasoned builders alike. Never shames anyone for preferring virtual or self-paced participation.
- **Micro-Goals**: Provides a small, achievable offline challenge (e.g. visiting a local tech meetup, checking out a co-working space, or talking with one developer).
- **Practical Preparation**: Generates concrete steps, preparation checklists (with interactive completion checkboxes), and safety verification reminders.
- **Grounded Source of Truth**: Evaluates verified community listings in the directory as ground truth to prevent hallucinated organizations, fictitious dates, or fake URLs.

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────┐
│  Vite + React Frontend (Render Static Site)  │
│  - CommunityMatchmaker Form & Card Component │
│  - Calls backend via VITE_API_URL            │
│  - ZERO AI keys or tokens in bundle          │
└──────────────────────┬───────────────────────┘
                       │ HTTP POST /api/matchmaker
┌──────────────────────▼───────────────────────┐
│   Node.js + Express Backend (Render Service) │
│   - server/index.js (Port: process.env.PORT) │
│   - CORS restricted to FRONTEND_ORIGIN       │
│   - Input sanitization & bounds checking     │
│   - Grounding against verified communities   │
│   - Server-side OpenAI key handling          │
└──────────────────────┬───────────────────────┘
                       │ OpenAI-Compatible Chat Completions
┌──────────────────────▼───────────────────────┐
│   OpenAI API                                 │
│   https://api.openai.com/v1                 │
│   Model: gpt-4o-mini (configurable)          │
└──────────────────────────────────────────────┘
```

---

## 🤖 AI Model & Provider Attribution

- **Endpoint**: OpenAI Chat Completions API:  
  `https://api.openai.com/v1/chat/completions`
- **Default Model**: `gpt-4o-mini`. Set `OPENAI_MODEL` to another model ID available to your OpenAI API account.
- **Attribution**: Powered by OpenAI. AI outputs are advisory planning guidance, not verified live event tickets.

---

## 🔒 Security & Privacy

1. **Server-Side Token Storage**: `OPENAI_API_KEY` is loaded strictly in the backend via server environment variables. It is **never** prefixed with `VITE_`, never exposed in React code, never bundled into static build artifacts, and never leaked in API responses.
2. **Input Validation**: All client fields (`interest`, `location`, `preferredMeetup`, `socialComfort`) are sanitized, strictly length-limited, and validated before dispatch.
3. **Graceful Degradation**: Handles missing credentials, rate limits (HTTP 429), cold starts (HTTP 503), timeouts, and network disconnects gracefully with clear user guidance.
4. **Minimal Data Surface**: Only generic interest, city/region, and comfort preferences are passed to the model—no names, emails, IP addresses, or tracking identifiers.

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js `v20.x` or higher
- npm `v10.x` or higher

### 2. Installation
```bash
git clone https://github.com/amelia2802/thecodehood.git
cd thecodehood
npm install
```

### 3. Server Configuration
Create an API key in your OpenAI dashboard, then add it to a `.env` file in the root directory (or to your server environment):
```env
# Server-side only (Do NOT prefix with VITE_)
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
PORT=3001
FRONTEND_ORIGIN=http://localhost:5173
```
See [OpenAI's GPT-4o mini documentation](https://developers.openai.com/api/docs/models/gpt-4o-mini) for model details and pricing. API usage is billed by token; check current pricing and configure usage limits in your OpenAI account.

### 4. Running Locally
Run the backend server:
```bash
npm run server
# Starts backend at http://localhost:3001
```

In a separate terminal, run the Vite frontend:
```bash
npm run dev
# Starts frontend at http://localhost:5173
```
*Note: During local development, Vite proxies `/api` calls directly to `http://localhost:3001`, so no extra frontend configuration is needed.*

### 5. Running Tests & Linting
```bash
# Run Community Matchmaker API automated test suite
npm run test:matchmaker

# Run ESLint
npm run lint

# Verify production build
npm run build
```

---

## 🌐 Deployment on Render

### A. Deploy Backend (Render Web Service)
1. In the **Render Dashboard**, click **New +** > **Web Service**.
2. Connect your GitHub repository: `amelia2802/thecodehood`.
3. Configure the service settings:
   - **Name**: `thecodehood-api`
   - **Environment**: `Node`
   - **Region**: Select closest to your users (e.g., `Oregon (US West)` or `Frankfurt (EU)`)
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run server`
4. Add the following **Environment Variables**:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `FRONTEND_ORIGIN`: Your deployed frontend URL (e.g. `https://thecodehood.onrender.com`)
   - `OPENAI_MODEL`: `gpt-4o-mini` or another model ID available to your account (optional)
   - *Note: Render automatically injects the `PORT` variable.*
5. Click **Create Web Service** and note your deployed service URL (e.g. `https://thecodehood-api.onrender.com`).

### B. Deploy Frontend (Render Static Site)
1. In the **Render Dashboard**, click **New +** > **Static Site**.
2. Connect your GitHub repository: `amelia2802/thecodehood`.
3. Configure the static site settings:
   - **Name**: `thecodehood`
   - **Branch**: `main`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. Add the following **Environment Variable**:
   - `VITE_API_URL`: Your backend URL from Step A (e.g. `https://thecodehood-api.onrender.com`)
5. Click **Create Static Site**.

---

## ⚠️ Remaining Limitations

1. **API Availability and Cost**: OpenAI API usage is subject to account billing, usage limits, model availability, and rate limits. The API is separate from a ChatGPT subscription.
2. **Directory Listings**: Verified listings currently map to verified seed records in `src/data.js`. Future iterations will add automated ingestion of community feeds via RSS/ICS and webhooks.
3. **Safety Verification**: AI guidance provides planning steps and icebreaker suggestions; participants must always verify physical event details, venue safety policies, and codes of conduct directly with organizers before traveling.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
