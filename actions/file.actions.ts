"use server"
import {ConversationFile, FileUpload} from "@/types";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import {createClient} from "@/lib/client";
import {insertChunks} from "@/actions/chunks.actions";


const EMBED_MODEL = process.env.EMBED_MODEL_URL || "https://ipepe-nomic-embeddings.hf.space/embed";

// 📌 Step 1: Chunk the file
async function chunkFile(file: ConversationFile) {
    const fileCached = await fetch(file.file_url).then((res) => res.blob());
    const loader = new PDFLoader(fileCached);

    if (!loader) throw new Error("Could not find loader for this file");

    const fileContent = await loader.load(); // returns Document[]
    if (fileContent.length === 0) {
        throw new Error("File is empty");
    }
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 600,
        chunkOverlap: 200,
    });

    // ✅ Split directly — no need to extract pageContent/metadata manually
    const chunks = await splitter.splitDocuments(fileContent);

    if (!chunks || chunks.length === 0) {
        throw new Error("Error in chunking file"+ JSON.stringify(chunks) + " loader :" + JSON.stringify(loader) + " File content :" + JSON.stringify(fileContent));
    }

    return chunks;
}

// 📌 Step 2: Embed the chunks (using your Hugging Face endpoint)
async function embedChunks(file: ConversationFile, chunks: any[]) {
    return Promise.all(
        chunks.map(async (chunk, index) => {
            const response = await fetch(
                EMBED_MODEL,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: chunk.pageContent }),
                }
            );

            if (!response.ok) {
                throw new Error(`Embedding API failed: ${response.statusText}`);
            }

            const data = await response.json();

            return {
                conversation_id: file.conversation_id,
                chunk_text: chunk.pageContent,
                chunk_metadata: chunk.metadata,
                file_id: file.id,
                embedding: data.embedding, // 👈 make sure this matches the API’s field name
                chunk_order: index,
            };
        })
    );
}


// 📌 Main: Use the helpers
export async function embedFile(uploadedFiles: ConversationFile[]) {
    let allRows: any[] = [];

    for await (const file of uploadedFiles) {
        const chunks = await chunkFile(file);
        const rows = await embedChunks(file, chunks);
        if(rows.length === 0) {
            throw new Error("Error in embedding file :"+file.id + `rows : ${JSON.stringify(rows)}`);
        }
        allRows = allRows.concat(rows);
        // collect all rows
    }

    if (allRows.length === 0) {
        throw new Error("Error in inserting chunk list");
    }
    // ✅ one bulk insert after all files are processed
    const response = await insertChunks(allRows);

    return response; // single response for all files
}




export const insertFiles = async (
    conversation_id: string,
        files: FileUpload[]
) => {
    const db = createClient();

    const rows = files.map(file => ({
        conversation_id,
        file_name: file.name,
        file_url: file.url,
        file_type: file.type,
        file_size: file.size,
    }));

    const { data, error } = await db.from("files").insert(rows).select();

    if (error) {
        throw error;
    }

    return data;
};

export const embedText = async (text: string) => {
    const response = await fetch(
        EMBED_MODEL,
        {

            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text ,model : "nomic-ai/nomic-embed-text-v1.5"}),
        }
    );

    if (!response.ok) {
        throw new Error(`Embedding API failed: ${response.statusText}`);
    }

    const data = await response.json();

    return data.embedding;
}


