import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export function isGenericConversationTitle(title: string | null | undefined) {
  if (!title) {
    return true;
  }

  const normalized = title.trim().toLowerCase();
  return normalized === "new chat" || normalized === "untitled conversation";
}

function normalizeTitle(title: string) {
  return title
    .replace(/^['"`]+/, "")
    .replace(/['"`]+$/, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 64);
}

export async function summarizeConversationTitle({
  supabase,
  conversationId,
  existingTitle,
  messages,
}: {
  supabase: any;
  conversationId: string;
  existingTitle: string | null;
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
}) {
  if (!isGenericConversationTitle(existingTitle)) {
    return existingTitle;
  }

  const sourceText = messages
    .slice(-6)
    .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
    .join("\n")
    .trim();

  if (!sourceText) {
    return existingTitle;
  }

  try {
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: [
        "Create a concise title for this chat.",
        "Rules:",
        "- Use 2 to 6 words.",
        "- No quotes.",
        "- No trailing punctuation.",
        "- Be specific and natural.",
        "Conversation:",
        sourceText,
      ].join("\n"),
    });

    const nextTitle = normalizeTitle(text);

    if (!nextTitle) {
      return existingTitle;
    }

    await supabase.from("conversations").update({ title: nextTitle }).eq("id", conversationId);

    return nextTitle;
  } catch (error) {
    console.error("Failed to summarize conversation title:", error);
    return existingTitle;
  }
}