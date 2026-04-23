import { supabase } from "@/lib/supabase";

export interface Chat {
    id: string;
    user_id: string;
    title: string;
    created_at: string;
    updated_at: string;
}

export interface Message {
    id: string;
    chat_id: string;
    role: "user" | "assistant";
    content: string;
    created_at: string;
}

// =============================================
// CHAT OPERATIONS
// =============================================

/**
 * Create a new chat session
 */
export async function createChat(title: string = "New Chat"): Promise<Chat | null> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        console.error("User not authenticated");
        return null;
    }

    const { data, error } = await supabase
        .from("chats")
        .insert([{ user_id: user.id, title }])
        .select()
        .single();

    if (error) {
        console.error("Error creating chat:", error);
        return null;
    }

    return data;
}

/**
 * Get all chats for the current user
 */
export async function getUserChats(): Promise<Chat[]> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        console.error("User not authenticated");
        return [];
    }

    const { data, error } = await supabase
        .from("chats")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

    if (error) {
        console.error("Error fetching chats:", error);
        return [];
    }

    return data || [];
}

/**
 * Update chat title
 */
export async function updateChatTitle(chatId: string, title: string): Promise<boolean> {
    const { error } = await supabase
        .from("chats")
        .update({ title })
        .eq("id", chatId);

    if (error) {
        console.error("Error updating chat title:", error);
        return false;
    }

    return true;
}

/**
 * Delete a chat (and all its messages due to CASCADE)
 */
export async function deleteChat(chatId: string): Promise<boolean> {
    const { error } = await supabase
        .from("chats")
        .delete()
        .eq("id", chatId);

    if (error) {
        console.error("Error deleting chat:", error);
        return false;
    }

    return true;
}

// =============================================
// MESSAGE OPERATIONS
// =============================================

/**
 * Add a message to a chat
 */
export async function addMessage(
    chatId: string,
    role: "user" | "assistant",
    content: string
): Promise<Message | null> {
    const { data, error } = await supabase
        .from("messages")
        .insert([{ chat_id: chatId, role, content }])
        .select()
        .single();

    if (error) {
        console.error("Error adding message:", error);
        return null;
    }

    return data;
}

/**
 * Get all messages for a specific chat
 */
export async function getChatMessages(chatId: string): Promise<Message[]> {
    const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching messages:", error);
        return [];
    }

    return data || [];
}

/**
 * Delete all messages in a chat
 */
export async function deleteChatMessages(chatId: string): Promise<boolean> {
    const { error } = await supabase
        .from("messages")
        .delete()
        .eq("chat_id", chatId);

    if (error) {
        console.error("Error deleting messages:", error);
        return false;
    }

    return true;
}

// =============================================
// DOCUMENT SUMMARY OPERATIONS
// =============================================

export interface DocumentSummary {
    id: string;
    user_id: string;
    original_filename: string;
    file_size: number;
    summary_content: string;
    created_at: string;
}

/**
 * Save a document summary
 */
export async function saveDocumentSummary(
    filename: string,
    fileSize: number,
    summaryContent: string
): Promise<DocumentSummary | null> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        console.error("User not authenticated");
        return null;
    }

    const { data, error } = await supabase
        .from("document_summaries")
        .insert([{
            user_id: user.id,
            original_filename: filename,
            file_size: fileSize,
            summary_content: summaryContent,
        }])
        .select()
        .single();

    if (error) {
        console.error("Error saving document summary:", error);
        return null;
    }

    return data;
}

/**
 * Get all document summaries for the current user
 */
export async function getUserDocumentSummaries(): Promise<DocumentSummary[]> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        console.error("User not authenticated");
        return [];
    }

    const { data, error } = await supabase
        .from("document_summaries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching document summaries:", error);
        return [];
    }

    return data || [];
}

/**
 * Delete a document summary
 */
export async function deleteDocumentSummary(summaryId: string): Promise<boolean> {
    const { error } = await supabase
        .from("document_summaries")
        .delete()
        .eq("id", summaryId);

    if (error) {
        console.error("Error deleting document summary:", error);
        return false;
    }

    return true;
}
