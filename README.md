# TheCodeHood

TheCodeHood is a directory for discovering local tech communities and meetups. Its goal is to help people find developer groups, tech events, and opportunities to connect with others in the tech community.

**Live Demo:** https://thecodehood.onrender.com
<img width="1896" height="902" alt="Screenshot 2026-10-11 033626" src="https://github.com/user-attachments/assets/80f9084e-58e2-4a56-8eff-7171d10a9b67" />

## Features

- Search for tech communities by location.
- Browse community cards and their details.
- Explore community information and joining links.
- Submit a community for consideration, if submission is implemented.

## Technology Stack

- React
- JavaScript
- Vite
- Tailwind CSS
- Material UI
- Supabase
- Render Static Sites for frontend hosting

## Run Locally

Requirements: Node.js and npm.

1. Clone the repository:

   ```bash
   git clone https://github.com/amelia2802/thecodehood.git
   cd thecodehood
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the project root if environment variables are required.

4. Add the required variables using the names expected by the application:

   ```dotenv
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   ```

   Only include these variables if the application uses them. Never add a Supabase secret or service-role key to frontend environment variables.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL shown in the terminal.

## Build and Test

```bash
npm run build
npm run lint
```

The production build is generated in the `dist` directory.

## Deployment

The frontend is deployed as a Render Static Site.

## Contributing

Issues and suggestions are welcome. Please describe bugs clearly and include steps to reproduce them.
