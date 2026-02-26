// import { Conversation } from "../types"
import { useMessageStore } from "../../../store/useMessageStore";

export default function ChatItem({ conversation }) {
  const { setActiveConversation, activeConversationId } = useMessageStore();
  const isActive = conversation.id === activeConversationId;

  // console.log("conversations", conversation);

  return (
    <div
      className={`p-3 cursor-pointer hover:bg-[var(--color-surface-3)] ${
        isActive ? "bg-[var(--color-surface-3)]" : ""
      }`}
      onClick={() => setActiveConversation(conversation.id)}>
      <p className="font-medium">
        {conversation.participants.map((p) => p.alias).join(", ")}
      </p>
      <p className="text-xs text-[var(--color-text-secondary)] truncate">
        {conversation.lastMessage?.content}
      </p>
    </div>
  );
}
