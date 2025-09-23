import { Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";

interface ChatInputProps {
    onSendMessage: (message: string) => Promise<void> | void;
    isLoading?: boolean;
    placeholder?: string;
}

export const ChatInput = ({
                              onSendMessage,
                              isLoading = false,
                              placeholder = "Message RAG...",
                          }: ChatInputProps) => {
    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [message]);

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!message.trim() || isLoading) return;

        await onSendMessage(message.trim());
        setMessage("");
    };

    const handleKeyDown = async (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            await handleSubmit();
        }
    };

    const canSend = message.trim().length > 0 && !isLoading;

    return (
        <div className="sticky bottom-0 left-0 right-0 border-t bg-background p-4 z-10">
            <form onSubmit={handleSubmit} className="max-w-full mx-auto">
                <div className="relative">
                    {/* Input Container */}
                    <div className="flex items-center gap-3 border bg-muted/50 border-input-border rounded-4xl p-3 shadow-sm focus-within:ring-2 focus-within:ring-input-focus focus-within:border-input-focus transition-all">
                        {/* Attachment Button */}
                        <Button
                            type="button"
                            disabled={true}
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground flex-shrink-0"
                        >
                            <Paperclip className="h-4 w-4" />
                        </Button>

                        {/* Textarea */}
                        <textarea
                            ref={textareaRef}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            rows={1}
                            className="flex-1 bg-transparent border-0 outline-none resize-none text-input-text placeholder:text-muted-foreground max-h-40 min-h-[24px]"
                            disabled={isLoading}
                        />

                        {/* Send Button */}
                        <Button
                            type="submit"
                            size="sm"
                            disabled={!canSend}
                            className={`
                h-8 w-8 p-0 flex-shrink-0 rounded-full transition-all
                ${
                                canSend
                                    ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                                    : "bg-muted text-muted-foreground cursor-not-allowed"
                            }
              `}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Character Count & Info */}
                    <div className="flex items-center justify-between mt-2 px-1">
                        <p className="text-xs text-muted-foreground">
                            Press Enter to send, Shift+Enter for new line
                        </p>
                        {message.length > 0 && (
                            <p className="text-xs text-muted-foreground">
                                {message.length} characters
                            </p>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};
