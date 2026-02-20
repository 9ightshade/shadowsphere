/* eslint-disable no-unused-vars */
// ─── GiftPreviewModal.jsx ─────────────────────────────────────────────────────
import { useState } from "react";
import {  } from "../../../store/useWalletStore";
import { v4 as uuid } from "uuid";
import { X, Send, AlertTriangle, Lock, Sparkles } from "lucide-react";
import { useWallet } from "@provablehq/aleo-wallet-adaptor-react";
import {ALEO_PROGRAM_NAME} from "../../../config/config"

export default function GiftPreviewModal({ gift, recipient, onClose }) {
  // const { balance, addTransaction } = useWalletStore();
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const { executeTransaction, transactionStatus } = useWallet();
  const [recipientAddress, setRecipientAddress] = useState("");

  if (!gift) return null;

  // const insufficient = balance < gift.price;
  const noRecipient = !recipientAddress.trim();
  const canSend = !noRecipient;
  const handleConfirm = async () => {
    if (!canSend || sending) return;

    try {
      setSending(true);
      console.log("🛠 Preparing Aleo Transaction...");

      const DECIMALS = 1_000_000;
      const rawAmount = Math.floor(gift.price * DECIMALS);
      const amountInput = `${rawAmount}u128`;


      const unixTimestamp = Math.floor(Date.now() / 1000);
      const giftIdInput = `${unixTimestamp}u32`;

      // 2. Construct the Payload
      const txPayload = {
        program: ALEO_PROGRAM_NAME,
        function: "send_gift",
        inputs: [
          recipientAddress, 
          amountInput, 
          "0field", 
          giftIdInput, 
        ],
        fee: 100_000,
        privateFee: false,
      };

      // 3. LOG THE PAYLOAD
      console.log("📦 EXECUTE TRANSACTION PAYLOAD:");
      console.table({
        "r0 (Recipient)": txPayload.inputs[0],
        "r1 (Amount)": txPayload.inputs[1],
        "r2 (Field)": txPayload.inputs[2],
        "r3 (Timestamp ID)": txPayload.inputs[3],
        Program: txPayload.program,
        Fee: txPayload.fee,
      });
      // console.log(`💎 Gift: ${gift.price} USDCx -> Raw: ${amountInput}`);

      const result = await executeTransaction({
        program: ALEO_PROGRAM_NAME,
        function: "send_gift",
        inputs: [recipientAddress, amountInput, "0field", giftIdInput],
        fee: 100_000,
        privateFee: false,
      });

      const actualId = result.transactionId;
      console.log("🚀 Transaction broadcasted! ID:", actualId);

      // addTransaction({
      //   id: actualId,
      //   type: "gift_sent",
      //   amount: gift.price,
      //   status: "pending",
      //   createdAt: new Date().toISOString(),
      // });

      // ───── Polling Logic with Progress Logs ─────
      const start = Date.now();
      const timeout = 120_000; // 2 minutes (Aleo can be slow on testnet)
      const intervalMs = 3000;
      let attempts = 0;

      const poll = async () => {
        attempts++;
        const elapsed = Math.floor((Date.now() - start) / 1000);

        try {
          console.log(
            `🔍 [Attempt ${attempts}] Checking status for: ${actualId} (${elapsed}s elapsed)`,
          );

          const status = await transactionStatus(actualId);
          console.log(
            `📡 Current On-Chain Status: %c${status.status}`,
            "color: #818cf8; font-weight: bold;",
          );

          if (status.status === "Accepted") {
            console.log("✅ Transaction SUCCESSFUL");
            // addTransaction({
            //   id: actualId,
            //   type: "gift_sent",
            //   amount: gift.price,
            //   status: "completed",
            //   createdAt: new Date().toISOString(),
            // });
            setDone(true);
            setTimeout(() => {
              setDone(false);
              onClose();
            }, 1400);
            return;
          }

          if (status.status === "Rejected") {
            console.error("❌ Transaction REJECTED by network");
            // addTransaction({
            //   id: actualId,
            //   type: "gift_sent",
            //   amount: gift.price,
            //   status: "failed",
            //   createdAt: new Date().toISOString(),
            // });
            return;
          }

          // Continue polling if not timed out
          if (Date.now() - start < timeout) {
            setTimeout(poll, intervalMs);
          } else {
            console.warn(
              "⚠️ Polling TIMEOUT: Transaction is taking longer than 2 minutes.",
            );
          }
        } catch (err) {
          // Log the error but keep polling (it might just be the RPC warming up)
          console.log("⏳ Waiting for transaction to be indexed...");
          if (Date.now() - start < timeout) {
            setTimeout(poll, intervalMs);
          }
        }
      };

      poll();
    } catch (err) {
      console.error("❌ Gift Execution Failed:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      {/* Panel */}
      <div className="modal-panel relative w-full max-w-md rounded-3xl overflow-hidden border border-gray-800/60 shadow-2xl shadow-black/60">
        {/* Top glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent pointer-events-none" />
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 bg-purple-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 bg-[var(--color-surface)] p-6 space-y-5">
          {/* ── Header ─────────────────────────────── */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[var(--color-text-primary)] leading-tight">
                  Confirm Gift
                </h2>
                <p className="text-[10px] text-[var(--color-text-secondary)] mt-0.5">
                  Anonymous · ZK-verified
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

          {/* ── Gift preview ───────────────────────── */}
          <div className="relative flex flex-col items-center gap-2 py-6 rounded-2xl bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/15 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent pointer-events-none" />
            <span className="text-6xl gift-emoji">{gift.emoji}</span>
            <p className="text-base font-bold text-[var(--color-text-primary)]">
              {gift.name}
            </p>
            <div className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/20">
              <span className="text-sm font-bold text-indigo-300">
                {gift.price.toLocaleString()}
              </span>
            </div>
          </div>

          {/* ── Recipient info ─────────────────────── */}
          {/* <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)]">
            <Lock size={13} className="text-indigo-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-[var(--color-text-secondary)] font-medium uppercase tracking-widest">
                To
              </p>
              <p className="text-sm text-[var(--color-text-primary)] font-semibold truncate">
                {recipient || (
                  <span className="text-[var(--color-text-secondary)] font-normal italic">
                    No recipient set
                  </span>
                )}
              </p>
            </div>
          </div> */}
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)]">
            <Lock size={13} className="text-indigo-400 flex-shrink-0 mt-1" />

            <div className="flex-1 min-w-0 space-y-1.5">
              <p className="text-[10px] text-[var(--color-text-secondary)] font-medium uppercase tracking-widest">
                Recipient Address
              </p>

              <input
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="aleo1..."
                className="w-full bg-transparent outline-none text-sm font-semibold text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]"
              />
            </div>
          </div>
          {/* ── Warnings ───────────────────────────── */}
          {/* {insufficient && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 animate-fadeIn">
              <AlertTriangle
                size={14}
                className="text-rose-400 flex-shrink-0"
              />
              <div>
                <p className="text-xs font-semibold text-rose-400">
                  Insufficient balance
                </p>
                <p className="text-[10px] text-rose-400/70 mt-0.5">
                  Your balance is too low to send this gift.
                </p>
              </div>
            </div>
          )} */}

          {noRecipient && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 animate-fadeIn">
              <AlertTriangle
                size={14}
                className="text-amber-400 flex-shrink-0"
              />
              <p className="text-xs font-semibold text-amber-400">
                Please enter a recipient ID first.
              </p>
            </div>
          )}

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
              onClick={handleConfirm}
              disabled={!canSend || sending}
              className={`
                group relative flex-1 flex items-center justify-center gap-2
                py-3 rounded-2xl text-sm font-semibold text-white overflow-hidden
                transition-all duration-300 active:scale-[0.98]
                ${
                  !canSend
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                    : done
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg shadow-green-500/30"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50"
                }
              `}>
              {/* Shimmer */}
              {canSend && !done && (
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
              )}

              {sending ? (
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
                  Sending…
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
                  Gift Sent!
                </>
              ) : (
                <>
                  <Send
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                  Send Gift
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
            transform: scale(0.93) translateY(18px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes emojiPop {
          0% {
            transform: scale(0.6) rotate(-10deg);
          }
          60% {
            transform: scale(1.15) rotate(4deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
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
          animation: panelIn 0.32s cubic-bezier(0.34, 1.26, 0.64, 1) both;
        }
        .gift-emoji {
          animation: emojiPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both;
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out both;
        }
      `}</style>
    </div>
  );
}
