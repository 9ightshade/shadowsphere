// ─── ChatWindow.jsx ───────────────────────────────────────────────────────────
import { useEffect, useRef } from "react";
import { Shield, Lock, MoreVertical } from "lucide-react";
import { useMessageStore } from "../../../store/useMessageStore";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";


export default function ChatWindow() {
  const { conversations, activeConversationId } = useMessageStore();
  const conversation = conversations.find((c) => c.id === activeConversationId);
  const bottomRef = useRef(null);
  console.log("conversations", conversations);
  console.log("conversation", conversation);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages?.length]);

  /* ── Empty state ── */
  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 px-8 chatwindow-empty">
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 flex items-center justify-center">
            <Shield size={36} className="text-indigo-400/50" />
          </div>
          {/* Ping ring */}
          <div className="absolute inset-0 rounded-3xl border border-indigo-500/20 animate-ping opacity-40" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">
            Select a conversation
          </p>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed max-w-xs">
            All messages are end-to-end encrypted and zero-knowledge verified.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] font-medium text-green-400">
            E2E Encrypted
          </span>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.96);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .chatwindow-empty {
            animation: fadeIn 0.4s ease-out both;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full chatwindow-active">
      {/* ── Chat header ─────────────────────────────── */}
      <div className="relative flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface-2)]/60 backdrop-blur-sm">
        {/* Gradient bottom line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent pointer-events-none" />

        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-indigo-500/30 flex items-center justify-center text-sm font-bold text-indigo-300">
              {conversation.alias?.[0]?.toUpperCase() ?? "?"}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[var(--color-surface-2)]" />
          </div>

          <div>
            <p className="text-sm font-semibold text-[var(--color-text-primary)] leading-tight">
              {conversation.id ?? "Anonymous"}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <Lock size={9} className="text-green-400" />
              <span className="text-[10px] text-green-400/80">
                End-to-end encrypted
              </span>
            </div>
          </div>
        </div>

        <button className="group p-2 rounded-xl border border-transparent hover:border-gray-700/50 hover:bg-gray-800/50 active:scale-95 transition-all duration-300">
          <MoreVertical
            size={16}
            className="text-[var(--color-text-secondary)] group-hover:text-white transition-colors duration-300"
          />
        </button>
      </div>

      {/* ── Messages ────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 messages-scroll">
        {conversation.messages.map((msg, i) => (
          
          <div
            key={msg.id}
            className="bubble-wrapper"
            style={{ animationDelay: `${i * 40}ms` }}>
            <MessageBubble message={msg} />
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* ── Input ───────────────────────────────────── */}
      <div className="relative flex-shrink-0 px-4 py-4 border-t border-[var(--color-border)]">
        {/* Gradient top line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/25 to-transparent pointer-events-none" />
        <MessageInput conversationId={conversation.id} />
      </div>

      <style jsx>{`
        @keyframes bubbleIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .chatwindow-active {
          animation: slideUp 0.35s ease-out both;
        }
        .bubble-wrapper {
          animation: bubbleIn 0.3s ease-out both;
        }
        .messages-scroll::-webkit-scrollbar {
          width: 3px;
        }
        .messages-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .messages-scroll::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.2);
          border-radius: 99px;
        }
        .messages-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.4);
        }
      `}</style>
    </div>
  );
}
