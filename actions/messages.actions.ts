import {createClient} from "@/lib/client";
import {Message} from "ai";
import {addMessageParams} from "@/types";
import {updateConversation} from "@/actions/conversations.actions";


export const getConversationMessages = async (conversationId:string) : Promise<Message[]> => {
    const db = createClient();
    const { data, error } = await db.from("messages").select("*").eq('conversation_id',conversationId);

    if (error) {
        throw new Error("Could not get messages");
    }
    return data;
}

export const addMessage = async (conversationId:string,values : addMessageParams ) : Promise<Message> => {
    const db = createClient();
    const { data, error } = await db.from("messages").insert([{conversation_id : conversationId ,...values}]).select("*").single();
    if (error || !data || data.length === 0) {
        throw new Error("Could not insert message");
    }

    const conversation = await updateConversation(conversationId);
    return data;
}