import { streamText, UIMessage, type ModelMessage } from "ai";
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

    const { messages, conversationId }: { messages: UIMessage[]; conversationId?: string } =
      await req.json();

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
      const { data: insertedUserMessage } = await supabase
        .from("messages")
        .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        role: "user",
        content: latestUserText,
        })
        .select("id")
        .single();

      if (insertedUserMessage) {
        await supabase.from("message_features").upsert(
          {
            message_id: insertedUserMessage.id,
            sender_id: user.id,
            conversation_id: conversationId,
            word_count: latestUserText.split(/\s+/).filter(Boolean).length,
            char_count: latestUserText.length,
          },
          { onConflict: "message_id" },
        );
      }

      await supabase
        .from("conversations")
        .update({
          updated_at: new Date().toISOString(),
        })
        .eq("id", conversationId);
    }

    const { data: historyRows } = await supabase
      .from("messages")
      .select("sender_id,role,content,created_at")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(100);

    const history = (historyRows ?? []) as Array<{
      sender_id: string | null;
      role: "user" | "assistant";
      content: string;
      created_at: string;
    }>;

    const historySenderIds = Array.from(
      new Set(
        history
          .map((message) => message.sender_id)
          .filter((senderId): senderId is string => Boolean(senderId)),
      ),
    );

    const { data: historyProfiles } =
      historySenderIds.length > 0
        ? await supabase
            .from("profiles")
            .select("id,display_name,username")
            .in("id", historySenderIds)
        : { data: [] as Array<{ id: string; display_name: string | null; username: string | null }> };

    const historyProfileById = new Map(
      (historyProfiles ?? []).map((profile) => [profile.id, profile]),
    );

    const modelMessages: ModelMessage[] = history.map((message) => {
      if (message.role === "assistant") {
        return {
          role: "assistant",
          content: message.content,
        };
      }

      if (!message.sender_id) {
        return {
          role: "user",
          content: `[Unknown user] ${message.content}`,
        };
      }

      const profile = historyProfileById.get(message.sender_id);
      const speakerName =
        profile?.display_name ?? profile?.username ?? `User ${message.sender_id.slice(0, 6)}`;

      return {
        role: "user",
        content: `[${speakerName}] ${message.content}`,
      };
    });

    const result = streamText({
      model: google("gemini-1.5-flash"),
      messages: modelMessages,
      onFinish: async ({ text }) => {
        const assistantText = text.trim();
        if (!assistantText) {
          return;
        }

        await supabase.from("messages").insert({
          conversation_id: conversationId,
          sender_id: null,
          triggered_by_user_id: user.id,
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