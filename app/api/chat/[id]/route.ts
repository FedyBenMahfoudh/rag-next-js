import {NextResponse} from "next/server";
import {createClient} from "@/lib/client";
import {embedText} from "@/actions/file.actions";
import {responsePrompt, SYSTEM_PROMPT} from "@/lib/prompts";
import { GroqCloud, GroqRoles} from "@/lib/modelProviders/groq";
import {chatSchema} from "@/lib/validations";
import {getConversationById} from "@/actions/conversations.actions";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const db = createClient();
/*        const user = await getUser();
        if (!user) {
            throw new Error("User does not exist");
        }*/


        const Existed = await getConversationById(id);

        if(!Existed) {
            throw new Error("Conversation not found");
        }

        const body = await req.json();
        const data = chatSchema.parse(body);
        const { user_query, chat_history,stream } = data;

        // 1️⃣ Embed the user query
        const queryEmbedding = await embedText(user_query);


        // 2️⃣ Get relevant chunks from Supabase
        const { data: chunks, error } = await db.rpc("get_relevant_chunks_by_conversation", {
            query_vector: queryEmbedding,
            conversation: id,
/*            match_threshold: 0.70,*/
            match_count: 5,
        });

        if (error ) {
            throw new Error(`Supabase error: ${error.message} chunks: ${chunks}`);
        }

        if(!chunks.length) {
            throw new Error("No chunks found");
        }

        const prompt = responsePrompt(chunks,user_query);

        chat_history.push(GroqCloud.structureMsg(SYSTEM_PROMPT.en,GroqRoles.SYSTEM));

        chat_history.push(GroqCloud.structureMsg(prompt,GroqRoles.USER));

        const response : any = await GroqCloud.instance.chat.completions.create({
            temperature: 0.2,
            messages: chat_history,
            model: GroqCloud.model,
            stream: stream,
        });

        if (stream) {
            const encoder = new TextEncoder();

            const stream = new ReadableStream({
                async start(controller) {
                    try {
                        for await (const chunk of response) {
                            // Extract only the delta.content if it exists
                            if (chunk.choices?.[0]?.delta?.content) {
                                const content = chunk.choices[0].delta.content;
                                // Forward only the content as raw text
                                controller.enqueue(encoder.encode(content));
                            }
                        }
                    } catch (err) {
                        console.error("Streaming error:", err);
                        controller.error(err);
                    } finally {
                        controller.close();
                    }
                },
            });

            return new NextResponse(stream, {
                headers: {
                    "Content-Type": "text/plain; charset=utf-8",
                    "Transfer-Encoding": "chunked",
                },
            });
        }else{
            const llmResponse = response.choices[0].message.content;
            return NextResponse.json({answer : llmResponse,chunks,prompt,chat_history});
        }
    } catch (err: any) {
        console.error("Error in /api/chat/:id:", err);
        return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
    }
}