# Next.js Full-Stack Template

A modern full-stack application template built with Next.js 14, featuring AI capabilities and real-time features.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS
- **Database & Auth**: Firebase (Auth, Storage, and Database)
- **AI Integration**: 
  - OpenAI (via Vercel AI SDK)
  - Anthropic
  - Replicate (Stable Diffusion)
  - Deepgram (Audio transcription)

## Getting Started

1. Clone the repository:
```bash
git clone [your-repo-url]
cd [your-repo-name]
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your API keys:
```
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# AI Services (Optional - only add what you need)
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
REPLICATE_API_KEY=
DEEPGRAM_API_KEY=
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add your environment variables in the Vercel project settings
4. Deploy!

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint