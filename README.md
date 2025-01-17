# Bepoz Chef AI - Menu Modifier Extractor

An AI-powered tool that extracts and categorizes menu modifiers from restaurant menu images. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- Upload menu images and extract menu items and modifiers
- AI-powered text recognition and categorization
- Interactive modifier selection interface
- Export selected modifiers to CSV
- Real-time processing status with animated progress indicators

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your environment variables:
```
OPENAI_API_KEY=your_openai_api_key
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Deployment

This project is configured for easy deployment on Vercel:

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add your environment variables in the Vercel project settings
4. Deploy!

## Built With

- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn UI
- OpenAI API
- Vercel AI SDK

## License

This project is licensed under the MIT License - see the LICENSE file for details.