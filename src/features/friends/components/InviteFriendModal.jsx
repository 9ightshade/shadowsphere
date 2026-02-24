// ─── InviteFriendModal.jsx ────────────────────────────────────────────────────
import {
  X,
  UserPlus,
  Shield,
  Clipboard,
  Check,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useWallet } from "@provablehq/aleo-wallet-adaptor-react";
import { ALEO_PROGRAM_NAME, ALEO_FEE } from "../../../config/config";

export default function InviteFriendModal({ open, onClose }) {
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);
  const [pasted, setPasted] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const { executeTransaction, transactionStatus } = useWallet();

  // Auto-focus input when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      setAddress("");
      setDone(false);
      setPasted(false);
    }
  }, [open]);

  if (!open) return null;

  const isValidAddress = address.startsWith("aleo1") && address.length === 63;
  const hasInput = address.trim().length > 0;
  const canSubmit =
    hasInput && isValidAddress && !submitting && !confirming && !done;
  // Determine input border/ring state
  const inputState = !hasInput
    ? focused
      ? "focused"
      : "idle"
    : isValidAddress
      ? "valid"
      : "invalid";

  const inputClasses = {
    idle: "border-[var(--color-border)]",
    focused: "border-indigo-500/50 ring-2 ring-indigo-500/10",
    valid: "border-green-500/40 ring-2 ring-green-500/10",
    invalid: "border-rose-500/40 ring-2 ring-rose-500/10",
  }[inputState];
  const handleSubmit = async () => {
    if (!canSubmit) return;

    setError(null);
    setSubmitting(true);

    try {
      const result = await executeTransaction({
        program: ALEO_PROGRAM_NAME,
        function: "add_friend",
        inputs: [address],
        fee: ALEO_FEE,
        privateFee: false,
      });

      const txId = result?.transactionId;
      if (!txId) throw new Error("Transaction ID not returned");

      // Wallet broadcast complete
      setSubmitting(false);
      setConfirming(true);

      const start = Date.now();
      const timeout = 90_000;
      const intervalMs = 3000;

      const poll = async () => {
        try {
          const res = await transactionStatus(txId);
          const status = res?.status || res;

          if (status === "Accepted" || status === "Completed") {
            setConfirming(false);
            setDone(true);

            setTimeout(() => {
              setDone(false);
              setAddress("");
              onClose();
            }, 1500);

            return;
          }

          if (status === "Rejected" || status === "Failed") {
            setConfirming(false);
            setError("Transaction failed");
            return;
          }

          if (Date.now() - start < timeout) {
            setTimeout(poll, intervalMs);
          } else {
            setConfirming(false);
            setError("Confirmation timeout");
          }
        } catch {
          if (Date.now() - start < timeout) {
            setTimeout(poll, intervalMs);
          } else {
            setConfirming(false);
            setError("Network error");
          }
        }
      };

      poll();
    } catch (err) {
      setSubmitting(false);
      setConfirming(false);
      setError("Transaction rejected by wallet");
      console.error(err);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setAddress(text.trim());
      setPasted(true);
      inputRef.current?.focus();
      setTimeout(() => setPasted(false), 2000);
    } catch (err) {
      console.warn("Paste failed:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && canSubmit) handleSubmit();
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      className="modal-backdrop fixed inset-0 z-[9999] flex items-center justify-center px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />

      {/* Panel */}
      <div className="modal-panel relative w-full max-w-[420px] rounded-2xl overflow-hidden border border-gray-800/70 shadow-2xl shadow-black/70">
        {/* Ambient top glow */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent pointer-events-none" />
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-36 bg-indigo-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 bg-[var(--color-surface)]">
          {/* ── Header ────────────────────────────────────────── */}
          <div className="flex items-start justify-between px-6 pt-6 pb-5">
            <div className="flex items-center gap-3.5">
              {/* Icon badge */}
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                  <UserPlus size={18} className="text-white" />
                </div>
                {/* Small dot accent */}
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-indigo-400 border-2 border-[var(--color-surface)]" />
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-[var(--color-text-primary)] leading-tight tracking-tight">
                  Invite a Friend
                </h2>
                <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5 leading-relaxed">
                  Send via Aleo wallet address
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close"
              className="group mt-0.5 p-1.5 rounded-lg border border-transparent
                hover:border-gray-700/50 hover:bg-gray-800/50
                active:scale-95 transition-all duration-200">
              <X
                size={14}
                className="text-[var(--color-text-secondary)] group-hover:text-white transition-colors duration-200"
              />
            </button>
          </div>

          {/* ── Divider ───────────────────────────────────────── */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-700/60 to-transparent mx-6" />

          {/* ── Body ──────────────────────────────────────────── */}
          <div className="px-6 pt-5 pb-6 space-y-4">
            {/* Address field */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
                <Shield size={9} className="text-indigo-400" />
                Recipient Address
              </label>

              <div
                className={`relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[var(--color-surface-2)] border transition-all duration-250 ${inputClasses}`}>
                {/* Mono prefix hint */}
                {!hasInput && (
                  <span className="font-mono text-xs text-[var(--color-text-secondary)]/30 select-none flex-shrink-0">
                    aleo1
                  </span>
                )}

                <input
                  ref={inputRef}
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onKeyDown={handleKeyDown}
                  placeholder={hasInput ? "" : "..."}
                  spellCheck={false}
                  autoComplete="off"
                  className="flex-1 min-w-0 bg-transparent font-mono text-[11px] leading-relaxed text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/30 focus:outline-none"
                />

                {/* Character counter — visible while typing */}
                {hasInput && (
                  <span
                    className={`flex-shrink-0 tabular-nums text-[9px] font-mono transition-colors duration-200 ${
                      isValidAddress
                        ? "text-green-400/70"
                        : address.length > 63
                          ? "text-rose-400/70"
                          : "text-[var(--color-text-secondary)]/40"
                    }`}>
                    {address.length}/63
                  </span>
                )}

                {/* Paste button */}
                <button
                  type="button"
                  onClick={handlePaste}
                  aria-label="Paste from clipboard"
                  className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all duration-200 active:scale-90 ${
                    pasted
                      ? "bg-green-500/15 text-green-400 border border-green-500/25"
                      : "bg-[var(--color-muted)]/60 text-[var(--color-text-secondary)] hover:text-indigo-300 hover:bg-indigo-500/15 border border-transparent hover:border-indigo-500/20"
                  }`}>
                  {pasted ? <Check size={10} /> : <Clipboard size={10} />}
                  {pasted ? "Pasted!" : "Paste"}
                </button>
              </div>

              {/* Validation message */}
              <div
                className={`flex items-center gap-1.5 pl-0.5 h-4 transition-all duration-200 ${hasInput ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                {isValidAddress ? (
                  <span className="inline-flex items-center gap-1 text-[10px] text-green-400 font-medium animate-fadeIn">
                    <Check size={9} />
                    Valid Aleo address
                  </span>
                ) : hasInput ? (
                  <span className="inline-flex items-center gap-1 text-[10px] text-rose-400 font-medium animate-fadeIn">
                    <AlertCircle size={9} />
                    {!address.startsWith("aleo1")
                      ? "Must start with 'aleo1'"
                      : `${63 - address.length > 0 ? 63 - address.length + " chars short" : Math.abs(63 - address.length) + " chars too long"}`}
                  </span>
                ) : null}
              </div>
            </div>

            {/* Privacy banner */}
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-indigo-500/6 border border-indigo-500/12">
              <Shield size={12} className="text-indigo-400/80 flex-shrink-0" />
              <p className="text-[10px] text-indigo-400/75 leading-relaxed">
                Requests are{" "}
                <span className="text-indigo-300/90 font-medium">
                  zero-knowledge verified
                </span>{" "}
                and fully encrypted on-chain
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <AlertCircle size={12} className="text-rose-400" />
                <span className="text-[11px] text-rose-400 font-medium">
                  {error}
                </span>
              </div>
            )}

            {/* ── Actions ───────────────────────────────────── */}
            <div className="flex gap-2.5 pt-0.5">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold
                  border border-[var(--color-border)] text-[var(--color-text-secondary)]
                  hover:border-gray-600/70 hover:text-[var(--color-text-primary)] hover:bg-gray-800/35
                  active:scale-[0.98] transition-all duration-200">
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`group relative flex-[1.4] flex items-center justify-center gap-2
                  py-2.5 rounded-xl text-[13px] font-semibold text-white overflow-hidden
                  transition-all duration-300 active:scale-[0.98]
                  ${
                    done
                      ? "bg-gradient-to-r from-green-600 to-emerald-500 shadow-md shadow-green-500/25"
                      : canSubmit
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-500/30 hover:shadow-indigo-500/40"
                        : "bg-gray-800/80 text-gray-500 cursor-not-allowed"
                  }`}>
                {/* Shimmer on hover */}
                {canSubmit && !done && (
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/8 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                )}

                {submitting || confirming ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>
                      {submitting ? "Broadcasting…" : "Confirming on-chain…"}
                    </span>
                  </>
                ) : done ? (
                  <>
                    <Check size={14} strokeWidth={2.5} />
                    <span>Confirmed!</span>
                  </>
                ) : (
                  <>
                    <span>Send Invite</span>
                    <ArrowRight
                      size={13}
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </button>
            </div>
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
            transform: scale(0.96) translateY(12px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-3px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .modal-backdrop {
          animation: backdropIn 0.18s ease-out both;
        }
        .modal-panel {
          animation: panelIn 0.28s cubic-bezier(0.34, 1.2, 0.64, 1) both;
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out both;
        }
      `}</style>
    </div>
  );
}
