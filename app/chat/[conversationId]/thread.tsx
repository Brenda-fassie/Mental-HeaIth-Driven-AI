"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";
import Image from "next/image";

type ChatThreadProps = {
  conversationId: string;
  initialMessages: UIMessage[];
  messageSenderNames: Record<string, string>;
};

export default function ChatThread({
  conversationId,
  initialMessages,
  messageSenderNames,
}: ChatThreadProps) {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error, stop } = useChat({
    id: conversationId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        conversationId,
      },
    }),
  });

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() && (!files || files.length === 0)) {
      return;
    }

    sendMessage({ text: input, files });
    setInput("");
    setFiles(undefined);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-white dark:bg-zinc-950">
      {/* Message List */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth"
      >
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-12 w-12 rounded-2xl bg-brand/20 flex items-center justify-center mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-lg font-semibold">Start a conversation</h3>
              <p className="text-sm text-zinc-500 max-w-xs">
                Share what's on your mind. This is a safe space for support and connection.
              </p>
            </div>
          )}

          {messages.map((message) => {
            const isAI = message.role === "assistant";
            const senderName = messageSenderNames[message.id] ?? (isAI ? "AI Assistant" : "You");
            
            return (
              <div 
                key={message.id} 
                className={`flex flex-col ${isAI ? "items-start" : "items-end"}`}
              >
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-xs font-medium text-zinc-500">
                    {senderName}
                  </span>
                </div>

                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                    isAI 
                      ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 rounded-tl-none" 
                      : "bg-brand text-black rounded-tr-none"
                  }`}
                >
                  {message.parts.map((part, index) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <div key={`${message.id}-${index}`} className="whitespace-pre-wrap text-[15px] leading-relaxed">
                            {part.text}
                          </div>
                        );
                      case "file":
                        if (part.mediaType?.startsWith("image/")) {
                          return (
                            <div key={`${message.id}-${index}`} className="mt-2 overflow-hidden rounded-lg">
                              <Image
                                src={part.url}
                                alt={part.filename ?? `attachment-${index}`}
                                width={400}
                                height={400}
                                className="object-cover"
                              />
                            </div>
                          );
                        }
                        return null;
                      default:
                        return null;
                    }
                  })}
                </div>
              </div>
            );
          })}

          {status === "streaming" && (
            <div className="flex items-center gap-2 text-xs text-zinc-400 animate-pulse px-1">
              <div className="flex gap-1">
                <span className="h-1 w-1 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="h-1 w-1 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="h-1 w-1 bg-zinc-400 rounded-full animate-bounce"></span>
              </div>
              AI Assistant is thinking...
            </div>
          )}
          
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-xs text-red-600 dark:bg-red-950/30 dark:text-red-400">
              Error: {error.message}
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-zinc-100 p-4 dark:border-zinc-800">
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-3xl"
        >
          <div className="relative flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-2 transition-all focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/10 dark:border-zinc-800 dark:bg-zinc-900 dark:focus-within:ring-brand/5">
            {files && files.length > 0 && (
              <div className="flex flex-wrap gap-2 px-2 pt-1">
                {Array.from(files).map((file, i) => (
                  <div key={i} className="flex items-center gap-1 rounded-md bg-zinc-200 px-2 py-1 text-[10px] font-medium dark:bg-zinc-800">
                    {file.name}
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={(event) => {
                  if (event.target.files) setFiles(event.target.files);
                }}
                multiple
                ref={fileInputRef}
              />

              <textarea
                className="flex-1 max-h-32 min-h-[40px] resize-none border-none bg-transparent px-2 py-2 text-[15px] focus:ring-0 placeholder:text-zinc-400"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Message AI Assistant..."
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e as any);
                  }
                }}
              />

              {status === "streaming" ? (
                <button
                  onClick={stop}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  type="button"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <rect width="14" height="14" x="5" y="5" rx="2" />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={status !== "ready" || (!input.trim() && !files?.length)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-black transition-opacity hover:opacity-90 disabled:opacity-30"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <p className="mt-2 text-center text-[10px] text-zinc-400">
            AI Assistant is an AI and does not replace professional medical advice.
          </p>
        </form>
      </div>
    </div>
  );
}
