import { create } from "zustand";
import { Conversation, Message } from "../features/messages/type";

interface MessageState {
  conversations: Conversation[];
  activeConversationId: string | null;

  setActiveConversation: (id: string) => void;
  addMessage: (convId: string, message: Message) => void;
  addConversation: (conversation: Conversation) => void;
}
export const useMessageStore = create<MessageState>((set) => ({
  conversations: [],
  activeConversationId: null,

  setActiveConversation: (id) => set({ activeConversationId: id }),

  addMessage: (convId, message) =>
    set((state) => {
      return {
        conversations: state.conversations.map((conv) => {
          if (conv.id !== convId) return conv;

          // PREVENT DUPLICATE: If message ID already exists, don't add it
          const alreadyExists = conv.messages.some((m) => m.id === message.id);
          if (alreadyExists) return conv;

          return {
            ...conv,
            messages: [...conv.messages, message],
            lastMessage: message,
          };
        }),
      };
    }),

  // ADD THIS: New helper to update a message (e.g., from pending to confirmed)
  updateMessage: (convId: string, oldId: string, updatedData: any) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === convId
          ? {
              ...conv,
              messages: conv.messages.map((m) =>
                m.id === oldId ? { ...m, ...updatedData } : m,
              ),
            }
          : conv,
      ),
    })),

  addConversation: (conversation) =>
    set((state) => ({
      conversations: [conversation, ...state.conversations],
    })),
}));