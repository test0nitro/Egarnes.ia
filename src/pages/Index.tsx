import { useState, useRef, useEffect } from "react";
import ChatHeader from "@/components/ChatHeader";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  translation?: string;
  original?: string;
  audioUrl?: string;
  culturalTip?: string;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Olá! 👋 Bem-vindo ao Egarnes.ia! Je suis là pour t'aider à apprendre le portugais. 🌴",
      culturalTip: "🌅 Dica: No Brasil, usamos muito 'Olá' e 'Oi' para cumprimentar. 'Tudo bem?' é super comum para perguntar como alguém está!",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("chat-with-egarnes", {
        body: {
          message: content,
          conversationHistory: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.rawMessage || data.translation,
        translation: data.translation,
        original: data.original,
        audioUrl: data.audioUrl,
        culturalTip: data.culturalTip,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem. Tente novamente. 🏖️",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background relative overflow-hidden">
      {/* Tropical background decorations */}
      <div className="absolute top-10 left-10 text-6xl opacity-10 animate-pulse">🌴</div>
      <div className="absolute top-40 right-20 text-8xl opacity-10 animate-pulse delay-100">☀️</div>
      <div className="absolute bottom-20 left-1/4 text-7xl opacity-10 animate-pulse delay-200">🌊</div>
      <div className="absolute bottom-40 right-1/3 text-6xl opacity-10 animate-pulse delay-300">🥥</div>
      
      <div className="container max-w-4xl mx-auto px-4 py-6 relative z-10">
        <ChatHeader />
        
        <div className="bg-card/80 backdrop-blur-sm rounded-3xl shadow-[var(--shadow-medium)] border border-border overflow-hidden">
          <ScrollArea className="h-[calc(100vh-400px)] min-h-[400px]" ref={scrollRef}>
            <div className="p-6">
              {messages.map((message) => (
                <ChatMessage key={message.id} {...message} />
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-card rounded-2xl rounded-tl-sm px-4 py-3 shadow-[var(--shadow-soft)]">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-100" />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="p-6 border-t border-border bg-card/50 backdrop-blur-sm">
            <ChatInput onSend={handleSendMessage} disabled={isLoading} />
          </div>
        </div>
        
        <p className="text-center text-xs text-muted-foreground mt-4">
          💡 Envie frases em francês ou português para tradução e dicas culturais
        </p>
      </div>
    </div>
  );
};

export default Index;
