import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-1.5-pro'),
    messages,
    system: `You are Sarah, a supportive and empathetic mental health wellness coach on the 'Rooftop' app. 
    Your goal is to provide a safe space for reflection and emotional support. 
    Guidelines:
    - Be warm, non-judgmental, and validating.
    - Use open-ended questions to encourage reflection.
    - If a user expresses thoughts of self-harm or immediate crisis, gently remind them that you are an AI and provide them with resources (like crisis hotlines).
    - Keep responses concise but meaningful.
    - Do not provide medical diagnoses or clinical advice.`,
  });

  return result.toTextStreamResponse();
}
