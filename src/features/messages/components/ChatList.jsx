// ─── ChatList.jsx ─────────────────────────────────────────────────────────────
import { MessageSquare, Search, Shield } from "lucide-react";
import { useMessageStore } from "../../../store/useMessageStore";
import ChatItem from "./ChatItem";
import { useState, useEffect } from "react";
import { useWallet } from "@provablehq/aleo-wallet-adaptor-react";
import { ALEO_PROGRAM_NAME } from "../../../config/config";
import { fieldToString, parseAleoStruct } from "../../../lib/aleo";
export default function ChatList() {
  const { conversations } = useMessageStore();
  const [query, setQuery] = useState("");
  const { requestRecords, decrypt, address } = useWallet();
  function normalize(value) {
    if (!value) return value;

    return value
      .toString()
      .replace(".private", "")
      .replace(".public", "")
      .replace("field", "")
      .replace("u32", "")
      .replace("u8", "")
      .trim();
  }

  useEffect(() => {
    let interval;

    const fetchRecords = async () => {
      const records = await requestRecords(ALEO_PROGRAM_NAME, false);

      processRecords(records);
    };

    const processRecords = async (records) => {
      for (const record of records) {
        if (record.functionName !== "send_message" || record.spent) {
          continue;
        }

        // console.log("send message", record);

        try {
          // ✅ Decrypt using recordCiphertext
          const decrypted = parseAleoStruct(
            await decrypt(record.recordCiphertext),
          );
          // console.log("decrypted", decrypted);

          const message = {
            id: normalize(decrypted.message_id),
            sender: normalize(decrypted.from),
            recipient: normalize(decrypted.to),
            content: fieldToString(
              decrypted.content_hash.replace(/\.private|\.public/g, ""),
            ),
            timestamp: Number(normalize(decrypted.timestamp)),
            read: normalize(decrypted.read) === "true",
            commitment: record.commitment,
          };

          // console.log("message", message);

          const conversationId =
            normalize(decrypted.from) === address
              ? normalize(decrypted.to)
              : normalize(decrypted.from);

          addOrAppendConversation(conversationId, message);
        } catch (err) {
          console.log(err);

          // Ignore records not decryptable by this wallet
          continue;
        }
      }
    };

    const addOrAppendConversation = (convId, message) => {
      const { conversations, addConversation, addMessage } =
        useMessageStore.getState();
      const existing = conversations.find((c) => c.id === convId);

      if (existing) {
        // 🛡️ ENHANCED DUPLICATE CHECK
        const isDuplicate = existing.messages.some((m) => {
          // 1. Check if ID matches exactly (blockchain vs blockchain)
          if (m.id === message.id) return true;

          // 2. Check if this blockchain message is a match for a "pending" local message
          // We check if content is identical AND if the timestamps are within 2 minutes
          const timeDiff = Math.abs(
            new Date(m.timestamp).getTime() - message.timestamp * 1000,
          );
          const isPendingMatch =
            m.id.toString().startsWith("pending") &&
            m.content === message.content &&
            timeDiff < 120000;

          return isPendingMatch;
        });

        if (isDuplicate) {
          // OPTIONAL: Update the pending message ID to the real one so it's "confirmed"
          // This helps the UI transition from 'sending' to 'delivered'
          const pendingMsg = existing.messages.find(
            (m) =>
              m.id.toString().startsWith("pending") &&
              m.content === message.content,
          );
          if (pendingMsg) {
            useMessageStore.getState().updateMessage(convId, pendingMsg.id, {
              id: message.id,
              status: "delivered",
              timestamp: message.timestamp * 1000, // sync to blockchain time
            });
          }
          return;
        }
      }

      // ... rest of your existing logic (isSender, formattedMessage, etc.)
      const isSender = message.sender === address;
      const otherParty = isSender ? message.recipient : message.sender;
      if (!otherParty) return;

      const formattedMessage = {
        ...message,
        timestamp: message.timestamp * 1000, // Aleo uses seconds, JS needs ms
      };

      if (!existing) {
        addConversation({
          id: convId,
          participants: [{ alias: otherParty.slice(0, 12) }],
          messages: [formattedMessage],
          lastMessage: formattedMessage,
        });
      } else {
        addMessage(convId, formattedMessage);
      }
    };
    fetchRecords();
    interval = setInterval(fetchRecords, 8000);

    return () => clearInterval(interval);
  }, []);
  const filtered = conversations.filter((c) =>
    c.participants
      ?.map((p) => p.alias.toLowerCase())
      .join(" ")
      .includes(query.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-4 pt-5 pb-4 border-b border-[var(--color-border)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/30">
              <MessageSquare size={13} className="text-white" />
            </div>
            <h2 className="text-sm font-bold text-[var(--color-text-primary)] tracking-tight">
              Messages
            </h2>
          </div>
          {conversations.length > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-gradient-to-br from-pink-500 to-rose-500 rounded-full shadow-md shadow-pink-500/30 animate-pulse">
              {conversations.length}
            </span>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations…"
            className="w-full pl-8 pr-4 py-2 text-xs rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/40 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all duration-300"
          />
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto chatlist-scroll">
        {filtered.length > 0 ? (
          <div className="py-2">
            {filtered.map((conv, i) => (
              <div
                key={conv.id}
                className="chatitem-wrapper"
                style={{ animationDelay: `${i * 50}ms` }}>
                <ChatItem conversation={conv} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 px-6 py-12">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 flex items-center justify-center">
              <Shield size={20} className="text-indigo-400/60" />
            </div>
            <p className="text-xs text-center text-[var(--color-text-secondary)] leading-relaxed">
              {query
                ? "No conversations match your search."
                : "No conversations yet.\nStart a private chat."}
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-12px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .chatitem-wrapper {
          animation: slideInLeft 0.35s ease-out both;
        }
        .chatlist-scroll::-webkit-scrollbar {
          width: 3px;
        }
        .chatlist-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .chatlist-scroll::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.25);
          border-radius: 99px;
        }
        .chatlist-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.45);
        }
      `}</style>
    </div>
  );
}
