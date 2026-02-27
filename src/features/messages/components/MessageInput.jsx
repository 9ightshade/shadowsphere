// ─── MessageInput.jsx ─────────────────────────────────────────────────────────
import { useState, useRef } from "react";
import { Send, Lock, Smile } from "lucide-react";
import { useMessageStore } from "../../../store/useMessageStore";
import { useWallet } from "@provablehq/aleo-wallet-adaptor-react";
import {
  ALEO_PROGRAM_NAME,
  ALEO_FEE,
  getTimestampU32,
} from "../../../config/config";
import { stringToField } from "../../../lib/aleo";

export default function MessageInput({ conversationId }) {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const [sending, setSending] = useState(false);
  const inputRef = useRef(null);

  const { addMessage } = useMessageStore.getState();
  const { executeTransaction, transactionStatus, address } = useWallet();

  const canSend = text.trim().length > 0;

const handleSubmit = async () => {
  if (!canSend || sending) return;

  setSending(true);
  const trimmed = text.trim();
  const localId = `pending-${Date.now()}`;

  // 1️⃣ Add pending message
  addMessage(conversationId, {
    id: localId,
    sender: address,
    recipient: conversationId,
    content: trimmed,
    timestamp: new Date().toISOString(),
    status: "sent",
  });

  setText("");
  inputRef.current?.focus();

  try {
    // 2️⃣ Prepare on-chain inputs
    const messageField = stringToField(trimmed);
    const timestampU32 = getTimestampU32();

    const txPayload = {
      program: ALEO_PROGRAM_NAME,
      function: "send_message",
      inputs: [conversationId, messageField, timestampU32],
      fee: ALEO_FEE,
      privateFee: false,
    };

    const result = await executeTransaction(txPayload);
    const txId = result?.transactionId;
    if (!txId) throw new Error("Transaction ID missing");

    // 3️⃣ Poll for transaction acceptance
    const start = Date.now();
    const timeout = 120_000;
    const intervalMs = 3000;

    const poll = async () => {
      try {
        const statusResponse = await transactionStatus(txId);
        const status = statusResponse?.status || statusResponse;

      if (status === "Accepted" || status === "Completed") {
        const { updateMessage } = useMessageStore.getState();

        // ✅ Cleanly update the pending message to the real transaction ID
        updateMessage(conversationId, localId, {
          id: txId,
          commitment: txId,
          status: "delivered",
        });

        setSending(false);
        return;
      }

        if (status === "Rejected" || status === "Failed") {
          console.error("❌ Message failed on blockchain.");
          setSending(false);
          return;
        }

        if (Date.now() - start < timeout) setTimeout(poll, intervalMs);
        else setSending(false);
      } catch (err) {
        console.log("err", err);
        if (Date.now() - start < timeout) setTimeout(poll, intervalMs);
        else setSending(false);
      }
    };

    poll();
  } catch (err) {
    console.error("❌ Send Message Failed:", err);
    setSending(false);
  }
};
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className={`
        relative flex items-center gap-3 px-4 py-3 rounded-2xl
        border transition-all duration-300
        bg-[var(--color-surface-2)]
        ${
          focused
            ? "border-indigo-500/50 ring-2 ring-indigo-500/10 shadow-lg shadow-indigo-500/10"
            : "border-[var(--color-border)] hover:border-indigo-500/20"
        }
      `}>
      {/* Encryption indicator */}
      <div className="flex-shrink-0 flex items-center gap-1 text-green-400/60">
        <Lock size={12} />
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Send an encrypted message…"
        className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/40 focus:outline-none"
      />

      {/* Emoji button */}
      <button
        type="button"
        className="group flex-shrink-0 p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:text-indigo-400 hover:bg-indigo-500/10 active:scale-90 transition-all duration-200">
        <Smile size={16} />
      </button>

      {/* Send button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSend || sending}
        className={`
          group flex-shrink-0 flex items-center justify-center
          w-9 h-9 rounded-xl
          transition-all duration-300 active:scale-90
          ${
            canSend && !sending
              ? "bg-gradient-to-br from-indigo-600 to-purple-600 shadow-md shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105"
              : "bg-[var(--color-muted)] cursor-not-allowed"
          }
        `}
        aria-label="Send message">
        {sending ? (
          <svg
            className="animate-spin h-4 w-4 text-white/60"
            fill="none"
            viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          <Send
            size={15}
            className={`transition-all duration-300 ${
              canSend
                ? "text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                : "text-[var(--color-text-secondary)]"
            }`}
          />
        )}
      </button>
    </div>
  );
}
