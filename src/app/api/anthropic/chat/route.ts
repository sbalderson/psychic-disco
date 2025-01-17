import Anthropic from '@anthropic-ai/sdk';

export const runtime = "edge";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: Request) {
  const { messages } = await req.json();
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const response = await anthropic.messages.create({
    model: 'claude-3-sonnet-20240229',
    max_tokens: 1024,
    messages: messages.map((m: Message) => ({
      role: m.role,
      content: m.content,
    })),
    stream: true,
  });

  // Convert the response to a ReadableStream
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of response) {
          if (chunk.type === 'content_block_delta' && 'text' in chunk.delta) {
            controller.enqueue(chunk.delta.text);
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
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
