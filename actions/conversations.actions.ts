import { createClient } from "@/lib/client";
import {
  addMessageParams,
  Conversation,
  Message,
  messageHistory,
} from "@/types";

export const createNewConversation = async (
  conversationName: string,
  userId: string
): Promise<Conversation> => {
  const db = createClient();
  const { data, error } = await db
    .from("conversations")
    .insert([{ title: conversationName, user_id: userId }])
    .select();
  if (error || !data || data.length === 0) {
    throw new Error("Could not create conversation");
  }

  return data[0];
};

export const deleteConversation = async (
  conversationId: string
): Promise<Conversation> => {
  const db = createClient();
  const { data, error } = await db
    .from("conversations")
    .delete()
    .eq("id", conversationId)
    .select();
  if (error) throw new Error("Could not delete conversation");
  return data[0];
};

export const getConversations = async (
  user_id: string
): Promise<Conversation[]> => {
  const db = createClient();
  const { data, error } = await db
    .from("conversations")
    .select("*")
    .eq("user_id", user_id)
    .order("updated_at", { ascending: false });
  if (error) {
    throw new Error("Could not get conversations");
  }
  return data;
};

export const getConversationById = async (
  conversationId: string
): Promise<Conversation> => {
  const db = createClient();
  const { data, error } = await db
    .from("conversations")
    .select("*")
    .eq("id", conversationId)
    .limit(1);
  if (error) {
    throw new Error("Could not get conversations");
  }
  // @ts-ignore
  return data;
};

export const updateConversation = async (
  conversationId: string
): Promise<Conversation> => {
  const db = createClient();

  const { data, error } = await db
    .from("conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const streamAnswerQuery = async (
  conversationId: string,
  user_query: string,
  chat_history: addMessageParams[],
  onChunk: (partial: string) => void
): Promise<string> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/chat/${conversationId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_query, chat_history, stream: true }),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  if (!response.body) {
    throw new Error("No response body");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Decode the chunk (each token)
      const token = decoder.decode(value);

      // Append token to accumulated text
      fullText += token;
      onChunk(token);
    }
  } catch (error) {
    console.error("Stream reading error:", error);
    throw error;
  } finally {
    reader.releaseLock();
  }

  return fullText;
};
