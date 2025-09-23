"use client";

import { ChatMessage } from "@/components/chat-message";
import { ChatInput } from "@/components/chat-panel";
import { Icons } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { useConversationStore } from "@/stores/conversations";
import { Skeleton } from "@/components/ui/skeleton";
import { BotIcon, User } from "lucide-react";
import { addMessageParams,Message } from "@/types";
import toast from "react-hot-toast";
import {streamAnswerQuery} from "@/actions/conversations.actions";

export default function ChatPage() {
    const { chatId } = useParams<{ chatId: string }>();
    const {
        isLoading,
        conversation,
        messages,
        getConversation,
        getMessages,
        addMessage,
    } = useConversationStore();
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamingMessage,setStreamingMessage] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const fetchMessages = async () => {
            await getConversation(chatId);
            await getMessages(chatId);
        };
        fetchMessages();
    }, [chatId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (msg: string) => {
        if (!msg.trim() || !conversation) return;
        setIsSubmitting(true);

        try {
            const message: addMessageParams = {
                content: msg,
                role: "user",
            };

            await addMessage(chatId, message);

            // @ts-ignore
            const tunesMessages = messages.map((message : Message) => ({
                    content: message.content,
                    role: message.role,
            }));
            setIsStreaming(true);
            setStreamingMessage("");
            let fullAnswer = "";
            fullAnswer = await streamAnswerQuery(chatId,
                msg,
                tunesMessages,
                (partial) =>
                    setStreamingMessage((prev) => {
                        return prev + partial;
                    }),
            );

            setIsStreaming(false);
            setStreamingMessage(fullAnswer);
            const assistantMessage = {
                content: fullAnswer,
                role: "assistant",
            } as addMessageParams;

            await addMessage(chatId, assistantMessage);
        } catch (e: any) {
            toast.error(e.message || "Failed to send message");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <>
                {Array.from({ length: 4 }).map((_, idx) => (
                    <div
                        key={idx}
                        className={`flex items-start space-x-2 ${
                            idx % 2 === 0 ? "justify-start" : "justify-end"
                        }`}
                    >
                        {idx % 2 === 0 && (
                            <div className="flex-shrink-0 border-2 p-1 rounded-full bg-neutral-700">
                                <BotIcon className="h-6 w-6 rounded-full" />
                            </div>
                        )}
                        <Skeleton className="max-w-[80%] h-8 rounded-lg px-4 py-2 w-2/3" />
                        {idx % 2 !== 0 && (
                            <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center">
                                <User className="h-4 w-4 text-primary-foreground" />
                            </div>
                        )}
                    </div>
                ))}
            </>
        );
    }

    return (
        <div className="flex-1 flex flex-col min-w-0 h-[89vh]">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-full mx-auto space-y-6">
                    {messages.length === 0 ? (
                        <div className="text-center text-gray-500 mt-20 flex flex-col items-center">
                            <Icons.messageCircle size={50} className="text-blue-600" />
                            <h2 className="text-2xl font-medium mb-2">Start a conversation</h2>
                            <p>Type a message below to get started.</p>
                        </div>
                    ) : (
                        <>
                            {messages.map((message, index) => (
                                <div key={index}>
                                    <ChatMessage message={message} />
                                    {index < messages.length - 1 && <Separator className="my-4 md:my-8" />}
                                </div>
                            ))}

                            {isStreaming && isSubmitting && (
                                <ChatMessage message={{ content: streamingMessage, role: "assistant" }} isStreaming={true} />
                            )}
                        </>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isSubmitting}
                placeholder="Message RAG..."
            />
        </div>
    );
}
