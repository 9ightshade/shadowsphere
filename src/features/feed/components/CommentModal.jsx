// ─── CommentModal.jsx ─────────────────────────────────────────────────────────
import { useWallet } from "@provablehq/aleo-wallet-adaptor-react";
import { X, MessageCircle, Send, Shield, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { stringToField } from "../../../lib/aleo/stringToField";
import { usePostStore } from "../../../store/usePostStore";
const MAX_COMMENT_LENGTH = 30;

export default function CommentModal({
  open,
  onClose,
  postId,
  recipientAlias,
}) {
  const [comment, setComment] = useState("");
  const [encrypted, setEncrypted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const { executeTransaction, transactionStatus } = useWallet();
  const incrementComments = usePostStore((state) => {
    state.incrementComments;
  });
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open) return null;

  const charCount = comment.length;
  const charLeft = MAX_COMMENT_LENGTH - charCount;
  const overLimit = charLeft < 0;
  const nearLimit = charLeft <= 60 && !overLimit;
  const fillPct = Math.min((charCount / MAX_COMMENT_LENGTH) * 100, 100);
  const canSubmit = comment.trim().length > 0 && !overLimit;

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;

    try {
      setSubmitting(true);

      const formattedPostId = `${postId}u32`;
      const commentField = stringToField(comment);

      console.log("Submitting comment TX:", {
        formattedPostId,
        commentField,
      });

      const result = await executeTransaction({
        program: "shadowsphere_social9.aleo",
        function: "add_comment",
        inputs: [formattedPostId, commentField],
        fee: 100000,
        privateFee: false,
      });

      const txId = result.transactionId;
      console.log("TX Submitted:", txId);

      // Poll status
      let attempts = 0;
      const maxAttempts = 20;

      while (attempts < maxAttempts) {
        await new Promise((r) => setTimeout(r, 3000));

        const status = await transactionStatus(txId);
        console.log("Polling:", status.status);

        if (status.status === "Accepted") {
          console.log("Comment confirmed on-chain ✅");
          setDone(true);
          incrementComments(postId);
          setTimeout(() => {
            setComment("");
            setEncrypted(false);
            setDone(false);
            onClose();
          }, 1200);
          return;
        }

        if (status.status === "Rejected") {
          throw new Error("Transaction rejected");
        }

        attempts++;
      }

      if (!done) throw new Error("Transaction confirmation timeout");
    } catch (err) {
      console.error("Comment failed:", err.message);
    } finally {
      setSubmitting(false);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4 modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      {/* Panel */}
      <div className="modal-panel relative w-full max-w-md rounded-3xl overflow-hidden border border-gray-800/60 shadow-2xl shadow-black/60">
        {/* Top glow — indigo for comments */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent pointer-events-none" />
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 bg-indigo-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 bg-[var(--color-surface)] p-6 space-y-5">
          {/* ── Header ─────────────────────────────── */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <MessageCircle size={16} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[var(--color-text-primary)] leading-tight">
                  Add Comment
                </h2>
                <p className="text-[10px] text-[var(--color-text-secondary)] mt-0.5">
                  Replying to @{recipientAlias}
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

          {/* ── Comment textarea ───────────────────── */}
          <div className="relative">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={5}
              placeholder="Share your thoughts anonymously..."
              className={`
                w-full bg-[var(--color-surface-2)] border rounded-2xl p-4 text-sm
                resize-none focus:outline-none transition-all duration-300
                text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/40
                ${
                  overLimit
                    ? "border-rose-500/60 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                    : "border-[var(--color-border)] focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/15"
                }
              `}
            />

            {/* Character count + progress bar */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2">
              <div className="flex-1 h-0.5 rounded-full bg-gray-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    overLimit
                      ? "bg-rose-500"
                      : nearLimit
                        ? "bg-amber-400"
                        : "bg-indigo-500"
                  }`}
                  style={{ width: `${fillPct}%` }}
                />
              </div>
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

          {/* ── Encryption toggle ──────────────────── */}
          <button
            type="button"
            onClick={() => setEncrypted(!encrypted)}
            className={`
              group flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl border
              transition-all duration-300 active:scale-[0.98] text-left
              ${
                encrypted
                  ? "bg-gradient-to-r from-indigo-600/15 to-purple-600/15 border-indigo-500/30 hover:border-indigo-500/50"
                  : "bg-[var(--color-surface-2)] border-[var(--color-border)] hover:border-indigo-500/20 hover:bg-indigo-500/5"
              }
            `}>
            {/* Toggle pill */}
            <div
              className={`relative w-10 h-5.5 rounded-full flex-shrink-0 transition-all duration-300 ${
                encrypted
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md shadow-indigo-500/30"
                  : "bg-gray-700"
              }`}
              style={{ height: "22px", minWidth: "40px" }}>
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${
                  encrypted ? "left-[22px]" : "left-0.5"
                }`}
              />
            </div>

            {/* Icon */}
            {encrypted ? (
              <Lock
                size={15}
                className="text-indigo-400 drop-shadow-[0_0_6px_rgba(99,102,241,0.6)] flex-shrink-0"
              />
            ) : (
              <Shield
                size={15}
                className="text-[var(--color-text-secondary)] group-hover:text-indigo-400 flex-shrink-0 transition-colors duration-300"
              />
            )}

            <div className="flex-1">
              <p
                className={`text-sm font-semibold leading-tight transition-colors duration-300 ${
                  encrypted
                    ? "text-indigo-300"
                    : "text-[var(--color-text-primary)]"
                }`}>
                {encrypted ? "Encryption enabled" : "Encrypt this comment"}
              </p>
              <p className="text-[10px] text-[var(--color-text-secondary)] mt-0.5 leading-tight">
                {encrypted
                  ? "Only verified users can decrypt"
                  : "Make content private"}
              </p>
            </div>
          </button>

          {/* ── Submit ─────────────────────────────── */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className={`
              group relative w-full py-3.5 rounded-2xl font-semibold text-sm text-white
              overflow-hidden flex items-center justify-center gap-2
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
            {!done && canSubmit && (
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
                Posting...
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
                Comment Posted!
              </>
            ) : (
              <>
                <Send
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
                Post Comment
                <span className="text-[10px] opacity-60 ml-1">
                  (Ctrl+Enter)
                </span>
              </>
            )}
          </button>

          {/* Privacy note */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500/8 border border-indigo-500/15">
            <Shield size={11} className="text-indigo-400 flex-shrink-0" />
            <p className="text-[10px] text-indigo-400/80 leading-relaxed">
              All comments are zero-knowledge verified and posted anonymously
            </p>
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
        .modal-backdrop {
          animation: backdropIn 0.2s ease-out both;
        }
        .modal-panel {
          animation: panelIn 0.3s cubic-bezier(0.34, 1.26, 0.64, 1) both;
        }
      `}</style>
    </div>,
    document.body,
  );
}
