import OpenAI from 'openai';
import { Message } from 'ai';

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    stream: true,
    messages: messages,
  });

  // Convert the response to a ReadableStream
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        if (chunk.choices[0]?.delta?.content) {
          controller.enqueue(chunk.choices[0].delta.content);
        }
      }
      controller.close();
    },
  });

  // Return the stream with the appropriate headers
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
