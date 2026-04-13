import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function NewConversationPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const conversationId = crypto.randomUUID();

  const { error: conversationError } = await supabase.from("conversations").insert({
    id: conversationId,
    title: "New chat",
    is_group: false,
    created_by: user.id,
  });

  if (conversationError) {
    redirect("/chat");
  }

  const { error: memberError } = await supabase.from("conversation_members").insert({
    conversation_id: conversationId,
    user_id: user.id,
    role: "owner",
  });

  if (memberError) {
    redirect("/chat");
  }

  redirect(`/chat/${conversationId}`);
}