import { Card } from "@/components/ui/card";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  translation?: string;
  original?: string;
  audioUrl?: string;
  culturalTip?: string;
}

const ChatMessage = ({ 
  role, 
  content, 
  translation, 
  original, 
  audioUrl, 
  culturalTip 
}: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div className={`flex w-full mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-2`}>
        {isUser ? (
          <Card className="px-4 py-3 bg-primary text-primary-foreground rounded-2xl rounded-tr-sm shadow-[var(--shadow-soft)]">
            <p className="text-sm md:text-base">{content}</p>
          </Card>
        ) : (
          <Card className="px-4 py-3 bg-card rounded-2xl rounded-tl-sm shadow-[var(--shadow-soft)] border-l-4 border-l-accent">
            <div className="space-y-3">
              {translation && (
                <div>
                  <span className="text-xs font-semibold text-primary">🗣 Tradução:</span>
                  <p className="text-sm md:text-base mt-1">{translation}</p>
                </div>
              )}
              
              {original && (
                <div>
                  <span className="text-xs font-semibold text-muted-foreground">💬 Original:</span>
                  <p className="text-sm md:text-base mt-1 italic">{original}</p>
                </div>
              )}
              
              {audioUrl && (
                <div>
                  <span className="text-xs font-semibold text-primary">🔈 Pronúncia:</span>
                  <a 
                    href={audioUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-accent hover:underline ml-2 transition-[var(--transition-smooth)]"
                  >
                    Ouvir em português
                  </a>
                </div>
              )}
              
              {culturalTip && (
                <div className="pt-2 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    {culturalTip}
                  </p>
                </div>
              )}
              
              {!translation && !original && !audioUrl && !culturalTip && (
                <p className="text-sm md:text-base">{content}</p>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
