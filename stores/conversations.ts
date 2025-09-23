import { create } from 'zustand'
import {Message} from "ai";
import {addMessage, getConversationMessages} from "@/actions/messages.actions";
import toast from "react-hot-toast";
import {getConversationById} from "@/actions/conversations.actions";
import {addMessageParams, Conversation} from "@/types";

type ConversationStore = {
    conversation : Conversation | null;
    count: number,
    messages: Message[],
    isLoading : boolean,
    error: boolean,
    getConversation : (id:string) => Promise<void>,
    getMessages: (id : string) => Promise<void>,
/*    setMessages: (messages: Message[]) => Promise<void>,*/
/*    updateMessage : (id : string,conversation_id : string) => Promise<void>,*/
/*    deleteMessage : (id : string,conversation_id : string) => Promise<void>,*/
    addMessage : (id : string,values : addMessageParams) => Promise<void>,
}

export const useConversationStore = create<ConversationStore>()((set) => ({
    conversation: null,
    count: 0,
    messages: [],
    isLoading: false,
    error: false,
    getConversation : async (id:string) => {
        set({isLoading: true});
        try {
            const data = await getConversationById(id);
            set({conversation : data});
        }catch (e) {
            set({ error: true });
            toast.error("Failed to load currentConversation");
            console.error(e);
        }finally {
            set({isLoading: false});
        }
    },
    getMessages: async (id : string) => {
        set({isLoading: true});
        try {
            const data = await getConversationMessages(id);
            set({messages : data,count : data.length});
        }catch (e) {
            set({ error: true });
            toast.error("Failed to load currentConversation messages");
            console.error(e);
        }finally {
            set({isLoading: false});
        }
    },
/*    setMessages : async (messages: Message[]) => {
        set({isLoading: true});
        try {
            set({messages : messages,count : messages.length});
        }catch (e) {
            set({ error: true });
            toast.error("Failed to set currentConversation");
            console.error(e);
        }finally {
            set({isLoading: false});
        }
    },*/
    addMessage : async (id : string,values : addMessageParams) => {
        try {
            const data = await addMessage(id, values);
            set((state) => ({
                messages : [...state.messages,data],
                count: state.count + 1,
            }));
        }catch (e) {
            set({ error: true });
            toast.error("Failed to load currentConversation");
            console.error(e);
        }
    },
}))

