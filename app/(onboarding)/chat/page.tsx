"use client";

import { useChat } from '@ai-sdk/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ThemeToggle } from '@/components/shared/theme-toggle';

function SendIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

export default function ChatPage() {
  const [input, setInput] = useState('');
  const chatHelpers = useChat() as any;
  const { messages, status } = chatHelpers;
  const isLoading = status === 'streaming' || status === 'submitted';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    if (chatHelpers.append) {
      chatHelpers.append({ role: 'user', content: input });
    } else if (chatHelpers.sendMessage) {
      chatHelpers.sendMessage(input);
    }
    setInput('');
  };

  return (
    <main className="relative min-h-screen bg-background flex flex-col items-center p-4 md:p-6 overflow-hidden">
      {/* Background blurs */}
      <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[400px] h-[400px] bg-[#B2F7EF] rounded-full blur-[100px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[400px] h-[400px] bg-[#F2B5D4] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl flex-1 flex flex-col gap-4">
        {/* Header */}
        <header className="flex items-center justify-between bg-card/90 backdrop-blur-md p-4 rounded-3xl border border-border shadow-sm">
          <div className="flex items-center gap-4">
            <Link href="/menu" className="p-2 hover:bg-muted rounded-xl transition-colors">
              <ArrowLeftIcon className="w-5 h-5 text-muted-foreground" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#B2F7EF] flex items-center justify-center border border-[#7BDFF2]/40">
                <span className="text-teal-700 font-bold text-sm">S</span>
              </div>
              <div>
                <h1 className="font-semibold text-card-foreground leading-none">Sarah</h1>
                <p className="text-xs text-emerald-500 font-medium mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Always here to listen
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Image src="/Logo.svg" alt="Rooftop" width={80} height={30} className="opacity-50 dark:invert" />
          </div>
        </header>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col bg-card/80 backdrop-blur-md border-border shadow-xl rounded-[32px] overflow-hidden">
          <CardContent className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                  <Image src="/Logo.svg" alt="Rooftop" width={40} height={40} className="opacity-20 dark:invert" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-medium text-foreground">Start a conversation</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto">
                    How are you feeling today? You can share anything that&apos;s on your mind.
                  </p>
                </div>
              </div>
            )}

            {messages.map((m: any) => (
              <div
                key={m.id}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[75%] p-4 rounded-[24px] ${
                    m.role === 'user'
                      ? 'bg-foreground text-background rounded-br-none'
                      : 'bg-card border border-border text-card-foreground rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="text-lg leading-relaxed whitespace-pre-wrap">
                    {m.content || (Array.isArray(m.parts) ? m.parts.map((p: any) => p.text || '').join('') : '')}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-card border border-border p-4 rounded-[24px] rounded-bl-none shadow-sm">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          {/* Input Area */}
          <div className="p-4 md:p-6 bg-muted/50 border-t border-border">
            <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 h-14 rounded-2xl bg-card border-none shadow-sm text-lg px-6 focus-visible:ring-[#7BDFF2] transition-all"
              />
              <Button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="h-14 w-14 rounded-2xl bg-foreground hover:opacity-90 flex items-center justify-center shrink-0 transition-all active:scale-95 disabled:opacity-50"
              >
                <SendIcon className="w-6 h-6 text-background" />
              </Button>
            </form>
            <p className="text-[10px] text-center text-muted-foreground mt-4 uppercase tracking-widest font-medium">
              Confidential & Anonymous
            </p>
          </div>
        </Card>
      </div>
    </main>
  );
}
