/* eslint-disable no-unused-vars */
// ─── MessageInput.jsx ─────────────────────────────────────────────────────────
import { useState, useRef } from "react";
import { Send, Lock, Smile } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useMessageStore } from "../../../store/useMessageStore";
import { useWallet } from "@provablehq/aleo-wallet-adaptor-react";
import {
  ALEO_PROGRAM_NAME,
  ALEO_FEE,
  getTimestampU32,
} from "../../../config/config";
import { stringToField } from "../../../lib/aleo";

const MAX_LENGTH = 30;

export default function MessageInput({ conversationId }) {
  const [text, setText]       = useState("");
  const [focused, setFocused] = useState(false);
  const [sending, setSending] = useState(false);
  const inputRef              = useRef(null);

  const { addMessage } = useMessageStore.getState();
  const { executeTransaction, transactionStatus, address } = useWallet();

  const remaining = MAX_LENGTH - text.length;
  const nearLimit = remaining <= 10;
  const atLimit   = remaining === 0;
  const canSend   = text.trim().length > 0 && !sending;

  const handleSubmit = async () => {
    if (!canSend) return;

    setSending(true);
    const trimmed = text.trim();
    const localId = `pending-${Date.now()}`;

    addMessage(conversationId, {
      id:        localId,
      sender:    address,
      recipient: conversationId,
      content:   trimmed,
      timestamp: new Date().toISOString(),
      status:    "sent",
    });

    setText("");
    inputRef.current?.focus();

    try {
      const messageField = stringToField(trimmed);
      const timestampU32 = getTimestampU32();

      const result = await executeTransaction({
        program:    ALEO_PROGRAM_NAME,
        function:   "send_message",
        inputs:     [conversationId, messageField, timestampU32],
        fee:        ALEO_FEE,
        privateFee: false,
      });

      const txId = result?.transactionId;
      if (!txId) throw new Error("Transaction ID missing");

      const start      = Date.now();
      const timeout    = 120_000;
      const intervalMs = 3_000;

      const poll = async () => {
        try {
          const statusResponse = await transactionStatus(txId);
          const status = statusResponse?.status || statusResponse;

          if (status === "Accepted" || status === "Completed") {
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
    <div className="flex flex-col gap-1">
      <div
        className={`
          relative flex items-center gap-3 px-4 py-3 rounded-2xl
          border transition-all duration-300
          bg-[var(--color-surface-2)]
          ${focused
            ? "border-indigo-500/50 ring-2 ring-indigo-500/10 shadow-lg shadow-indigo-500/10"
            : "border-[var(--color-border)] hover:border-indigo-500/20"
          }
        `}
      >
        {/* Encryption indicator */}
        <div className="flex-shrink-0 text-green-400/60">
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
          maxLength={MAX_LENGTH}
          placeholder="Send an encrypted message…"
          className="flex-1 min-w-0 bg-transparent text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/40 focus:outline-none"
        />

        {/* Character counter — fades in when near limit */}
        <span
          className={`
            flex-shrink-0 tabular-nums text-[11px] font-mono font-medium
            transition-all duration-200
            ${text.length === 0
              ? "opacity-0 w-0 overflow-hidden"
              : atLimit
                ? "opacity-100 text-rose-400"
                : nearLimit
                  ? "opacity-100 text-amber-400"
                  : "opacity-40 text-[var(--color-text-secondary)]"
            }
          `}
          aria-live="polite"
          aria-label={`${remaining} characters remaining`}
        >
          {remaining}
        </span>

        {/* Emoji button */}
        <button
          type="button"
          className="flex-shrink-0 p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:text-indigo-400 hover:bg-indigo-500/10 active:scale-90 transition-all duration-200"
        >
          <Smile size={16} />
        </button>

        {/* Send button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSend}
          aria-label="Send message"
          className={`
            group flex-shrink-0 flex items-center justify-center
            w-9 h-9 rounded-xl transition-all duration-300 active:scale-90
            ${canSend
              ? "bg-gradient-to-br from-indigo-600 to-purple-600 shadow-md shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105"
              : "bg-[var(--color-muted)] cursor-not-allowed"
            }
          `}
        >
          {sending
            ? <Loader2 size={14} className="animate-spin text-white/60" />
            : <Send
                size={15}
                className={`transition-all duration-300 ${
                  canSend
                    ? "text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    : "text-[var(--color-text-secondary)]"
                }`}
              />
          }
        </button>
      </div>

      {/* At-limit hint */}
      {atLimit && (
        <p className="pl-1 text-[10px] text-rose-400/80 animate-fadeIn">
          Maximum message length reached
        </p>
      )}
    </div>
  );
}