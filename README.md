# TheCodeHood 🏡

A community directory for developers and technologists to discover local meetups, build connections, and step away from the screen.

Repository: [https://github.com/amelia2802/thecodehood](https://github.com/amelia2802/thecodehood)

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
│   - Server-side HF_TOKEN credential handling │
└──────────────────────┬───────────────────────┘
                       │ OpenAI-Compatible Chat Completions
┌──────────────────────▼───────────────────────┐
│   Hugging Face Inference Providers           │
│   https://router.huggingface.co/v1           │
│   Model: meta-llama/Llama-3.1-8B-Instruct    │
└──────────────────────────────────────────────┘
```

---

## 🤖 Open-Source AI Model & Provider Attribution

- **Endpoint**: Official OpenAI-compatible router endpoint:  
  `https://router.huggingface.co/v1/chat/completions`
- **Default Model**: [`meta-llama/Llama-3.1-8B-Instruct`](https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct)
  - **License**: Llama 3.1 Community License Agreement (open weights, commercial & research use permitted).
- **Alternative Supported Model**: [`Qwen/Qwen2.5-72B-Instruct`](https://huggingface.co/Qwen/Qwen2.5-72B-Instruct)
  - **License**: Apache 2.0 (permissive open source).
- **Attribution**: Powered by Hugging Face Inference Providers. AI outputs are framed transparently as advisory guidance and planning advice rather than verified live tickets.

---

## 🔒 Security & Privacy

1. **Server-Side Token Storage**: `HF_TOKEN` is loaded strictly in the backend via server environment variables. It is **never** prefixed with `VITE_`, never exposed in React code, never bundled into static build artifacts, and never leaked in API responses.
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
Create a `.env` file in the root directory (or server environment) with your Hugging Face User Access Token:
```env
# Server-side only (Do NOT prefix with VITE_)
HF_TOKEN=hf_your_hugging_face_user_access_token_here
HF_MODEL=meta-llama/Llama-3.1-8B-Instruct
PORT=3001
FRONTEND_ORIGIN=http://localhost:5173
```
*(Get a free token from [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens).)*

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
   - `HF_TOKEN`: Your Hugging Face user access token (`hf_...`)
   - `FRONTEND_ORIGIN`: Your deployed frontend URL (e.g. `https://thecodehood.onrender.com`)
   - `HF_MODEL`: `meta-llama/Llama-3.1-8B-Instruct` (optional, defaults to this model)
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

1. **Cold Start Latency**: Free inference tiers on Hugging Face router endpoints may experience brief cold start latency on first request.
2. **Directory Listings**: Verified listings currently map to verified seed records in `src/data.js`. Future iterations will add automated ingestion of community feeds via RSS/ICS and webhooks.
3. **Safety Verification**: AI guidance provides planning steps and icebreaker suggestions; participants must always verify physical event details, venue safety policies, and codes of conduct directly with organizers before traveling.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
