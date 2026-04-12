import { google } from '@ai-sdk/google';
import { streamText, createUIMessageStreamResponse } from 'ai';
import { createClient } from '@/lib/supabase/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub ?? null;

  const { messages } = await req.json();

  // Save the incoming user message (the last message in the array)
  const lastMessage = messages[messages.length - 1];
  if (userId && lastMessage?.role === 'user') {
    const content: string = Array.isArray(lastMessage.parts)
      ? lastMessage.parts
          .filter((p: { type: string }) => p.type === 'text')
          .map((p: { type: string; text: string }) => p.text)
          .join('')
      : (lastMessage.content ?? '');

    await supabase.from('messages').insert({ user_id: userId, role: 'user', content });
  }

  const result = streamText({
    model: google('gemini-flash-latest'),
    messages,
    system: `You are a supportive and empathetic mental health wellness coach on the 'Rooftop' app. 
    Your goal is to provide a safe space for reflection and emotional support. 
    Guidelines:
    - Be warm, non-judgmental, and validating.
    - Use open-ended questions to encourage reflection.
    - If a user expresses thoughts of self-harm or immediate crisis, gently remind them that you are an AI and provide them with resources (like crisis hotlines).
    - Keep responses concise but meaningful.
    - Do not provide medical diagnoses or clinical advice.`,
    onFinish: async ({ text }) => {
      if (userId && text) {
        await supabase.from('messages').insert({ user_id: userId, role: 'assistant', content: text });
      }
    },
  });

  return createUIMessageStreamResponse({
    stream: result.toUIMessageStream(),
  });
}
