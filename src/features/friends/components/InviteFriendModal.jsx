// ─── InviteFriendModal.jsx ────────────────────────────────────────────────────
import { X, UserPlus, Shield, Copy, Check, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useWallet } from "@provablehq/aleo-wallet-adaptor-react";
import { ALEO_PROGRAM_NAME, ALEO_FEE } from "../../../config/config";
export default function InviteFriendModal({ open, onClose }) {
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const { executeTransaction, transactionStatus } = useWallet();

  if (!open) return null;

  // Validate Aleo address format (starts with aleo1, 63 chars total)
  const isValidAddress = address.startsWith("aleo1") && address.length === 63;
  const canSubmit = address.trim().length > 0 && isValidAddress;

  //   const handleSubmit = async () => {
  //     if (!canSubmit || submitting) return;

  //     try {
  //       setSubmitting(true);

  //       // ─── Execute on-chain friend request ───
  //       const txId = await executeTransaction({
  //         program: ALEO_PROGRAM_NAME,
  //         function: "add_friend",
  //         inputs: [address],
  //         fee: 100000,
  //         privateFee: false,
  //       });

  //       // ─── Poll for confirmation ───
  //       const start = Date.now();
  //       const timeout = 60_000; // 60s max
  //       const intervalMs = 2000;

  //       const poll = async () => {
  //         try {
  //           const status = await transactionStatus(txId.transactionId);

  //           if (status === "Accepted") {
  //             setDone(true);

  //             setTimeout(() => {
  //               setDone(false);
  //               setAddress("");
  //               onClose();
  //             }, 1500);

  //             return;
  //           }

  //           if (status === "Rejected") {
  //             console.error("Friend request rejected");
  //             return;
  //           }

  //           if (Date.now() - start < timeout) {
  //             setTimeout(poll, intervalMs);
  //           } else {
  //             console.warn("Friend request polling timed out");
  //           }
  //         } catch (err) {
  //           console.error("Polling error:", err);
  //         }
  //       };

  //       poll();
  //     } catch (err) {
  //       console.error("Invite failed:", err);
  //     } finally {
  //       setSubmitting(false);
  //     }
  //   };

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;

    try {
      setSubmitting(true);
      console.log("📨 Initiating Friend Request on Aleo...");

      // ─── Execute Transaction ───
      const result = await executeTransaction({
        program: ALEO_PROGRAM_NAME,
        function: "add_friend",
        inputs: [address],
        fee: ALEO_FEE,
        privateFee: false,
      });

      // Extract ID string (handles both object and string returns)
      const txId = result.transactionId;

      if (!txId) throw new Error("Transaction ID was not returned by wallet");

      console.log(`🚀 Broadcast Successful! \nID: ${txId}`);

      // ─── Poll for confirmation ───
      const start = Date.now();
      const timeout = 90_000; // Increased to 90s for network indexing
      const intervalMs = 3000;
      let attempts = 0;

      const poll = async () => {
        attempts++;
        const elapsed = Math.floor((Date.now() - start) / 1000);

        try {
          console.log(
            `🔍 [Friend Req] Attempt ${attempts} | ${elapsed}s elapsed...`,
          );

          const statusResponse = await transactionStatus(txId);
          // Normalize status (handles string vs object {status: "..."})
          const status = statusResponse?.status || statusResponse;

          console.log(
            `📡 Current Network Status: %c${status}`,
            "color: #fbbf24; font-weight: bold;",
          );

          if (status === "Accepted" || status === "Completed") {
            console.log("✅ Friend Request ACCEPTED on-chain.");
            setDone(true);
            setTimeout(() => {
              setDone(false);
              setAddress("");
              onClose();
            }, 1500);
            return;
          }

          if (status === "Rejected" || status === "Failed") {
            console.error("❌ Friend Request REJECTED by network.");
            return;
          }

          // Continue polling if within timeout
          if (Date.now() - start < timeout) {
            setTimeout(poll, intervalMs);
          } else {
            console.warn(
              "⚠️ Polling timed out. Check the Aleo explorer manually.",
            );
          }
        } catch (err) {
          // This catch block handles cases where the transaction isn't indexed yet
          console.log("⏳ Indexing transaction... (waiting for network)", err);
          if (Date.now() - start < timeout) {
            setTimeout(poll, intervalMs);
          }
        }
      };

      poll();
    } catch (err) {
      console.error("❌ Invite failed:", err);
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
        {/* Top glow — indigo/purple for friends */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent pointer-events-none" />
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 bg-indigo-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 bg-[var(--color-surface)] p-6 space-y-5">
          {/* ── Header ─────────────────────────────── */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <UserPlus size={17} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[var(--color-text-primary)] leading-tight">
                  Invite Friend
                </h2>
                <p className="text-[10px] text-[var(--color-text-secondary)] mt-0.5">
                  Send a friend request via wallet address
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
              Aleo Wallet Address
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

            {/* Validation feedback */}
            {address.trim().length > 0 && (
              <div className="flex items-center gap-1.5 pl-1 animate-fadeIn">
                {isValidAddress ? (
                  <>
                    <Check size={10} className="text-green-400" />
                    <p className="text-[10px] text-green-400 font-medium">
                      Valid Aleo address
                    </p>
                  </>
                ) : (
                  <>
                    <AlertCircle size={10} className="text-rose-400" />
                    <p className="text-[10px] text-rose-400 font-medium">
                      {address.startsWith("aleo1")
                        ? `Address too ${address.length < 63 ? "short" : "long"} (${address.length}/63)`
                        : "Must start with 'aleo1'"}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Privacy note */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500/8 border border-indigo-500/15">
            <Shield size={11} className="text-indigo-400 flex-shrink-0" />
            <p className="text-[10px] text-indigo-400/80 leading-relaxed">
              Friend requests are zero-knowledge verified and fully encrypted
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
                  Request Sent!
                </>
              ) : (
                <>
                  <UserPlus
                    size={15}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                  <span>Send Invite</span>
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
