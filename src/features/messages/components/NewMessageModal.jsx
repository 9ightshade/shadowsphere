/* eslint-disable no-unused-vars */
// ─── NewMessageModal.jsx ──────────────────────────────────────────────────────
import {
  X,
  MessageSquarePlus,
  Send,
  Shield,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import {
  ALEO_PROGRAM_NAME,
  ALEO_FEE,
  getTimestampU32,
} from "../../../config/config";
import { stringToField } from "../../../lib/aleo/index";
import { useWallet } from "@provablehq/aleo-wallet-adaptor-react";

const MAX_MESSAGE_LENGTH = 30;

export default function NewMessageModal({ open, onClose }) {
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const { executeTransaction, transactionStatus } = useWallet();
  if (!open) return null;

  // Validate Aleo address
  const isValidAddress = address.startsWith("aleo1") && address.length === 63;

  // Message validation
  const charCount = message.length;
  const charLeft = MAX_MESSAGE_LENGTH - charCount;
  const overLimit = charLeft < 0;
  const nearLimit = charLeft <= 5 && !overLimit;

  const canSubmit = isValidAddress && message.trim().length > 0 && !overLimit;

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;

    try {
      setSubmitting(true);
      console.log("🛠 Preparing On-Chain Message...");

      // 1. Prepare Inputs
      const messageField = stringToField(message); // Convert "Hello" -> "12345...field"
      const timestampU32 = getTimestampU32(); // Get "1708415181u32"

      const txPayload = {
        program: ALEO_PROGRAM_NAME,
        function: "send_message", // Assuming your function name
        inputs: [
          address, // r0: Recipient Address
          messageField, // r1: Message as a field
          timestampU32, // r2: u32 timestamp
        ],
        fee: ALEO_FEE,
        privateFee: false,
      };

      // 2. Log Payload for transparency
      console.log("📦 MESSAGE PAYLOAD:");
      console.table({
        Recipient: address,
        MessageField: messageField,
        Timestamp: timestampU32,
        Program: ALEO_PROGRAM_NAME,
      });

      // 3. Execute Transaction
      const result = await executeTransaction(txPayload);

      // Extract ID safely
      const txId = result.transactionId;
      if (!txId) throw new Error("Transaction ID missing");

      console.log("🚀 Message Broadcasted! ID:", txId);

      // 4. Polling for Progress
      const start = Date.now();
      const timeout = 120_000; // 2 minutes
      const intervalMs = 3000;
      let attempts = 0;

      const poll = async () => {
        attempts++;
        const elapsed = Math.floor((Date.now() - start) / 1000);

        try {
          console.log(
            `🔍 [Polling] Attempt ${attempts} | ${elapsed}s elapsed...`,
          );

          const statusResponse = await transactionStatus(txId);
          const status = statusResponse?.status || statusResponse;

          console.log(
            `📡 Status: %c${status}`,
            "color: #38bdf8; font-weight: bold;",
          );

          if (status === "Accepted" || status === "Completed") {
            console.log("✅ MESSAGE DELIVERED");
            setDone(true);

            setTimeout(() => {
              setDone(false);
              setAddress("");
              setMessage("");
              onClose();
            }, 1500);
            return;
          }

          if (status === "Rejected" || status === "Failed") {
            console.error("❌ Message failed to send to blockchain.");
            return;
          }

          if (Date.now() - start < timeout) {
            setTimeout(poll, intervalMs);
          } else {
            console.warn("⚠️ Polling timeout.");
          }
        } catch (err) {
          console.log("⏳ Waiting for network indexing...");
          if (Date.now() - start < timeout) {
            setTimeout(poll, intervalMs);
          }
        }
      };

      poll();
    } catch (err) {
      console.error("❌ Send Message Failed:", err);
    } finally {
      setSubmitting(false);
    }
  };
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setAddress(text.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn("Paste failed:", err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4 modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      {/* Panel */}
      <div className="modal-panel relative w-full max-w-md rounded-3xl overflow-hidden border border-gray-800/60 shadow-2xl shadow-black/60">
        {/* Top glow — indigo for messages */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent pointer-events-none" />
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 bg-indigo-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 bg-[var(--color-surface)] p-6 space-y-5">
          {/* ── Header ─────────────────────────────── */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <MessageSquarePlus size={17} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[var(--color-text-primary)] leading-tight">
                  Instant Message
                </h2>
                <p className="text-[10px] text-[var(--color-text-secondary)] mt-0.5">
                  Start an encrypted conversation
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="group p-2 rounded-xl border border-transparent hover:border-gray-700/60 hover:bg-gray-800/50 active:scale-95 transition-all duration-300">
              <X
                size={15}
                className="text-[var(--color-text-secondary)] group-hover:text-white transition-colors duration-300"
              />
            </button>
          </div>

          {/* ── Address input ──────────────────────── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest flex items-center gap-1.5">
              <Shield size={10} className="text-indigo-400" />
              Recipient Address
            </label>

            <div
              className={`
              relative flex items-center gap-2 px-4 py-3 rounded-xl
              bg-[var(--color-surface-2)] border transition-all duration-300
              ${
                !address.trim()
                  ? "border-[var(--color-border)] focus-within:border-indigo-500/40 focus-within:ring-2 focus-within:ring-indigo-500/10"
                  : isValidAddress
                    ? "border-green-500/40 ring-2 ring-green-500/10"
                    : "border-rose-500/40 ring-2 ring-rose-500/10"
              }
            `}>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                maxLength={30}
                placeholder="aleo1..."
                className="flex-1 bg-transparent font-mono text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/40 focus:outline-none"
              />

              <button
                type="button"
                onClick={handlePaste}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 active:scale-90
                  ${
                    copied
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-[var(--color-muted)] text-[var(--color-text-secondary)] hover:text-white hover:bg-indigo-500/20 border border-transparent hover:border-indigo-500/20"
                  }`}>
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Pasted" : "Paste"}
              </button>
            </div>

            {/* Address validation feedback */}
            {address.trim().length > 0 && (
              <div className="flex items-center gap-1.5 pl-1 animate-fadeIn">
                {isValidAddress ? (
                  <>
                    <Check size={10} className="text-green-400" />
                    <p className="text-[10px] text-green-400 font-medium">
                      Valid address
                    </p>
                  </>
                ) : (
                  <>
                    <AlertCircle size={10} className="text-rose-400" />
                    <p className="text-[10px] text-rose-400 font-medium">
                      {address.startsWith("aleo1")
                        ? `Address ${address.length < 63 ? "too short" : "too long"} (${address.length}/63)`
                        : "Must start with 'aleo1'"}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* ── Message input ──────────────────────── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest flex items-center gap-1.5">
              Message
            </label>

            <div className="relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Say hello..."
                maxLength={MAX_MESSAGE_LENGTH + 10} // Allow typing beyond to show error
                className={`
                  w-full px-4 py-3 rounded-xl
                  bg-[var(--color-surface-2)] border
                  text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/40
                  focus:outline-none transition-all duration-300
                  ${
                    overLimit
                      ? "border-rose-500/60 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                      : "border-[var(--color-border)] focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/15"
                  }
                `}
              />

              {/* Character counter */}
              <div className="absolute bottom-3 right-3">
                <span
                  className={`text-[10px] font-mono tabular-nums transition-colors duration-300 ${
                    overLimit
                      ? "text-rose-400"
                      : nearLimit
                        ? "text-amber-400"
                        : "text-[var(--color-text-secondary)]"
                  }`}>
                  {charLeft}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-[var(--color-text-secondary)] pl-1">
              Keep it short — messages are limited to 30 characters
            </p>
          </div>

          {/* Privacy note */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500/8 border border-indigo-500/15">
            <Shield size={11} className="text-indigo-400 flex-shrink-0" />
            <p className="text-[10px] text-indigo-400/80 leading-relaxed">
              All messages are end-to-end encrypted and zero-knowledge verified
            </p>
          </div>

          {/* ── Actions ────────────────────────────── */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl text-sm font-semibold
                border border-[var(--color-border)] text-[var(--color-text-secondary)]
                hover:border-gray-600 hover:text-[var(--color-text-primary)] hover:bg-gray-800/40
                active:scale-[0.98] transition-all duration-300">
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              className={`
                group relative flex-1 flex items-center justify-center gap-2
                py-3 rounded-2xl text-sm font-semibold text-white overflow-hidden
                transition-all duration-300 active:scale-[0.98]
                ${
                  !canSubmit
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                    : done
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg shadow-green-500/30"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50"
                }
              `}>
              {/* Shimmer */}
              {canSubmit && !done && (
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
              )}

              {submitting ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
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
                  Sending...
                </>
              ) : done ? (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Message Sent!
                </>
              ) : (
                <>
                  <Send
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes backdropIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes panelIn {
          from {
            opacity: 0;
            transform: scale(0.94) translateY(16px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .modal-backdrop {
          animation: backdropIn 0.2s ease-out both;
        }
        .modal-panel {
          animation: panelIn 0.3s cubic-bezier(0.34, 1.26, 0.64, 1) both;
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out both;
        }
      `}</style>
    </div>
  );
}
