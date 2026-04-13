"use client";

import { useRef, useState } from "react";
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
    <div className="relative flex flex-1 flex-col">
      {error && <div className="mb-4 text-red-500">{error.message}</div>}

      <div className="mb-28 flex flex-col gap-4 overflow-y-auto pb-4">
        {messages.map((message) => (
          <div key={message.id} className="rounded border border-zinc-200 p-3 dark:border-zinc-800">
            <div className="mb-1 text-sm font-semibold">
              {message.role === "assistant"
                ? "AI"
                : messageSenderNames[message.id] ?? "You"}
            </div>
            {message.parts.map((part, index) => {
              switch (part.type) {
                case "text":
                  return (
                    <div key={`${message.id}-${index}`} className="whitespace-pre-wrap text-sm">
                      {part.text}
                    </div>
                  );
                case "file":
                  if (part.mediaType?.startsWith("image/")) {
                    return (
                      <Image
                        key={`${message.id}-${index}`}
                        src={part.url}
                        alt={part.filename ?? `attachment-${index}`}
                        width={480}
                        height={480}
                        className="rounded"
                      />
                    );
                  }

                  if (part.mediaType?.startsWith("application/pdf")) {
                    return (
                      <iframe
                        key={`${message.id}-${index}`}
                        src={part.url}
                        width="100%"
                        height="400"
                        title={part.filename ?? `attachment-${index}`}
                      />
                    );
                  }

                  return null;
                default:
                  return null;
              }
            })}
          </div>
        ))}
      </div>

      {(status === "submitted" || status === "streaming") && (
        <div className="mb-2 text-sm text-zinc-500">Generating response...</div>
      )}

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 left-0 right-0 border-t border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950 md:static md:mt-auto md:rounded md:border"
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              {files?.length
                ? `${files.length} file${files.length > 1 ? "s" : ""} attached`
                : "Attach files"}
            </label>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={(event) => {
                if (event.target.files) {
                  setFiles(event.target.files);
                }
              }}
              multiple
              ref={fileInputRef}
            />
          </div>

          <div className="flex gap-2">
            <input
              className="flex-1 rounded border border-zinc-300 p-2 dark:border-zinc-700 dark:bg-zinc-900"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="How can I help you?"
            />
            {status === "submitted" || status === "streaming" ? (
              <button
                onClick={stop}
                className="rounded bg-red-500 px-4 py-2 text-white"
                type="button"
              >
                Stop
              </button>
            ) : (
              <button
                type="submit"
                className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
                disabled={status !== "ready"}
              >
                Send
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}