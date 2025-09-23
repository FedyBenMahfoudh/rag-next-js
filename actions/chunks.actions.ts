import {Chunk} from "@/types";
import {createClient} from "@/lib/client";

const db = createClient();

export const insertChunks =  async (rows : Chunk[])=> {

    // bulk insert in one command 🚀
    const {data, error } = await db
        .from("chunks")
        .insert(rows)
        .select();

    if (error || !data) {
        throw new Error(error.message);
    }

    return data;
}

export async function getRelevantChunks(
    queryEmbedding: number[],
    threshold = 0.75,
    conversationId : string,
    limit = 5
) {
    if (queryEmbedding.length !== 768) {
        throw new Error("Query embedding must be length 768 for Nomic Embed Text");
    }

    const { data, error } = await db
        .rpc("get_relevant_chunks", {
            query_vector: queryEmbedding,
            conversation:conversationId,
            match_threshold: threshold,
            match_count: limit,
        });

    if (error) {
        console.error("Error fetching relevant chunks:", error);
        return [];
    }


    return data as Array<{
        id: string;
        chunk_text: string;
        chunk_metadata: any;
        chunk_order: number;
        conversation_id: string;
        file_id: string;
        similarity: number;
    }>;
}