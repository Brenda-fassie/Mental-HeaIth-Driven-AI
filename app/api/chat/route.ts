import { streamText, UIMessage, convertToModelMessages } from "ai";
import { google } from "@ai-sdk/google";
import { createClient } from "@/utils/supabase/server";
import { isGenericConversationTitle, summarizeConversationTitle } from "@/utils/conversations";

function extractLatestUserText(messages: UIMessage[]): string | null {
  const latestUserMessage = [...messages].reverse().find((message) => message.role === "user");

  if (!latestUserMessage) {
    return null;
  }

  const text = latestUserMessage.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n")
    .trim();

  return text.length > 0 ? text : null;
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const {
      messages,
      conversationId,
    }: {
      messages: UIMessage[];
      conversationId?: string;
    } = await req.json();

    if (!conversationId) {
      return new Response("conversationId is required", { status: 400 });
    }

    const { data: membership } = await supabase
      .from("conversation_members")
      .select("conversation_id")
      .eq("conversation_id", conversationId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!membership) {
      return new Response("Forbidden", { status: 403 });
    }

    const latestUserText = extractLatestUserText(messages);

    const { data: conversationRow } = await supabase
      .from("conversations")
      .select("id,title")
      .eq("id", conversationId)
      .maybeSingle();

    if (latestUserText) {
      await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: user.id,
        role: "user",
        content: latestUserText,
      });

      await supabase
        .from("conversations")
        .update({
          updated_at: new Date().toISOString(),
        })
        .eq("id", conversationId);
    }

    const result = streamText({
      model: google("gemini-2.5-flash"),
      messages: await convertToModelMessages(messages),
      onFinish: async ({ text }) => {
        const assistantText = text.trim();
        if (!assistantText) {
          return;
        }

        await supabase.from("messages").insert({
          conversation_id: conversationId,
          sender_id: user.id,
          role: "assistant",
          content: assistantText,
        });

        await supabase
          .from("conversations")
          .update({
            updated_at: new Date().toISOString(),
          })
          .eq("id", conversationId);

        if (isGenericConversationTitle(conversationRow?.title)) {
          await summarizeConversationTitle({
            supabase,
            conversationId,
            existingTitle: conversationRow?.title ?? null,
            messages: [
              ...(latestUserText ? [{ role: "user" as const, content: latestUserText }] : []),
              { role: "assistant" as const, content: assistantText },
            ],
          });
        }
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming chat completion:", error);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}