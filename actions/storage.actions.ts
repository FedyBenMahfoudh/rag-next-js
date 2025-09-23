import { createClient } from "@/lib/client";
import {getCleanFileName} from "@/lib/utils";

export async function uploadFile(
    file: File,
    userId: string,
    conversationId: string
) {

    const supabase = createClient();
    const fileName =  getCleanFileName(file.name);
    const { data, error } = await supabase.storage
        .from("files")
        .upload(
            `users/${userId}/${conversationId}/${fileName}`,
            file
        );

    if (error || !data) {
        throw new Error("Could not upload file");
    }

    return {
        name: file.name,
        url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/files/${data.path}`,
        type: file.type,
        size: file.size,
    }
}

