import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Tapez votre message en français ou en portugais... 🌴"
        disabled={disabled}
        className="min-h-[60px] max-h-[120px] resize-none rounded-2xl border-2 focus:border-primary transition-[var(--transition-smooth)] bg-card"
      />
      <Button 
        type="submit" 
        disabled={!message.trim() || disabled}
        size="icon"
        className="h-[60px] w-[60px] rounded-2xl bg-gradient-to-br from-primary to-accent hover:shadow-[var(--shadow-medium)] transition-[var(--transition-smooth)]"
      >
        <Send className="h-5 w-5" />
      </Button>
    </form>
  );
};

export default ChatInput;
