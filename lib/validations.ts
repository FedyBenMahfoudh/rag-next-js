import {z} from "zod";

export const chatSchema = z.object({
  user_query: z.string().min(1,"user query is required"),
    chat_history: z
        .array(
            z.object({
                role: z.enum(["system", "assistant", "user"]),
                content: z.string().min(1, "Message content cannot be empty"),
            })
        )
        .default([]), // allow empty history by default
    stream : z.boolean().default(false),
});


