export interface Conversation {
  id: string;
  title: string;
  created_at: Date;
  updated_at: Date;
  user_id: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  role: "user" | "assistant";
  created_at: Date;
  updated_at: Date;
}

export interface sidebarNavItem {
  title: string;
  url?: string;
  icon: LucideIcon;
}

export type FileUpload = {
    name: string
    type: string
    size: number
    url: string
}

export interface ConversationFile {
    id: string;
    conversation_id: string;
    file_type: string;
    file_name: string;
    file_size: number;
    file_config : any;
    pushed_at: Date;
    file_url: string;
}

export interface Chunk {
    id?: string;
    chunk_text: string;
    embedding : Array<double>;
    chunk_metadata: any;
    chunk_order: number;
    conversation_id: string;
    file_id: string;
}

export interface messageHistory {
    role : "user" | "assistant" | "system";
    content: string;
}

export interface Message {
    id: string;
    conversation_id: string;
    content: string;
    role: "user" | "assistant" | "system";
    created_at: Date;
    updated_at: Date;
}

export interface addMessageParams {
    content: string;
    role: "user" | "assistant" | "system";
}