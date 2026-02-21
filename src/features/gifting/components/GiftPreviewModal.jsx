// /* eslint-disable no-unused-vars */
// // ─── GiftPreviewModal.jsx ─────────────────────────────────────────────────────
// import { useState } from "react";
// import {  } from "../../../store/useWalletStore";
// import { v4 as uuid } from "uuid";
// import { X, Send, AlertTriangle, Lock, Sparkles } from "lucide-react";
// import { useWallet } from "@provablehq/aleo-wallet-adaptor-react";
// import {ALEO_PROGRAM_NAME} from "../../../config/config"

// export default function GiftPreviewModal({ gift, recipient, onClose }) {
//   const [sending, setSending] = useState(false);
//   const [done, setDone] = useState(false);
//   const { executeTransaction, transactionStatus } = useWallet();
//   const [recipientAddress, setRecipientAddress] = useState("");

//   if (!gift) return null;

//   // const insufficient = balance < gift.price;
//   const noRecipient = !recipientAddress.trim();
//   const canSend = !noRecipient;
//   const handleConfirm = async () => {
//     if (!canSend || sending) return;

//     try {
//       setSending(true);
//       console.log("🛠 Preparing Aleo Transaction...");

//       const DECIMALS = 1_000_000;
//       const rawAmount = Math.floor(gift.price * DECIMALS);
//       const amountInput = `${rawAmount}u128`;


//       const unixTimestamp = Math.floor(Date.now() / 1000);
//       const giftIdInput = `${unixTimestamp}u32`;

//       // 2. Construct the Payload
//       const txPayload = {
//         program: ALEO_PROGRAM_NAME,
//         function: "send_gift",
//         inputs: [
//           recipientAddress, 
//           amountInput, 
//           "0field", 
//           giftIdInput, 
//         ],
//         fee: 100_000,
//         privateFee: false,
//       };

//       // 3. LOG THE PAYLOAD
//       console.log("📦 EXECUTE TRANSACTION PAYLOAD:");
//       console.table({
//         "r0 (Recipient)": txPayload.inputs[0],
//         "r1 (Amount)": txPayload.inputs[1],
//         "r2 (Field)": txPayload.inputs[2],
//         "r3 (Timestamp ID)": txPayload.inputs[3],
//         Program: txPayload.program,
//         Fee: txPayload.fee,
//       });
//       // console.log(`💎 Gift: ${gift.price} USDCx -> Raw: ${amountInput}`);

//       const result = await executeTransaction({
//         program: ALEO_PROGRAM_NAME,
//         function: "send_gift",
//         inputs: [recipientAddress, amountInput, "0field", giftIdInput],
//         fee: 100_000,
//         privateFee: false,
//       });

//       const actualId = result.transactionId;
//       console.log("🚀 Transaction broadcasted! ID:", actualId);

//       // ───── Polling Logic with Progress Logs ─────
//       const start = Date.now();
//       const timeout = 120_000; // 2 minutes (Aleo can be slow on testnet)
//       const intervalMs = 3000;
//       let attempts = 0;

//       const poll = async () => {
//         attempts++;
//         const elapsed = Math.floor((Date.now() - start) / 1000);

//         try {
//           console.log(
//             `🔍 [Attempt ${attempts}] Checking status for: ${actualId} (${elapsed}s elapsed)`,
//           );

//           const status = await transactionStatus(actualId);
//           console.log(
//             `📡 Current On-Chain Status: %c${status.status}`,
//             "color: #818cf8; font-weight: bold;",
//           );

//           if (status.status === "Accepted") {
//             console.log("✅ Transaction SUCCESSFUL");
       
//             setDone(true);
//             setTimeout(() => {
//               setDone(false);
//               onClose();
//             }, 1400);
//             return;
//           }

//           if (status.status === "Rejected") {
//             console.error("❌ Transaction REJECTED by network");
        
//             return;
//           }

//           // Continue polling if not timed out
//           if (Date.now() - start < timeout) {
//             setTimeout(poll, intervalMs);
//           } else {
//             console.warn(
//               "⚠️ Polling TIMEOUT: Transaction is taking longer than 2 minutes.",
//             );
//           }
//         } catch (err) {
//           // Log the error but keep polling (it might just be the RPC warming up)
//           console.log("⏳ Waiting for transaction to be indexed...");
//           if (Date.now() - start < timeout) {
//             setTimeout(poll, intervalMs);
//           }
//         }
//       };

//       poll();
//     } catch (err) {
//       console.error("❌ Gift Execution Failed:", err);
//     } finally {
//       setSending(false);
//     }
//   };

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center px-4 modal-backdrop"
//       onClick={(e) => e.target === e.currentTarget && onClose()}>
//       {/* Backdrop */}
//       <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

//       {/* Panel */}
//       <div className="modal-panel relative w-full max-w-md rounded-3xl overflow-hidden border border-gray-800/60 shadow-2xl shadow-black/60">
//         {/* Top glow */}
//         <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent pointer-events-none" />
//         <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 bg-purple-500/15 blur-3xl pointer-events-none" />

//         <div className="relative z-10 bg-[var(--color-surface)] p-6 space-y-5">
//           {/* ── Header ─────────────────────────────── */}
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
//                 <Sparkles size={16} className="text-white" />
//               </div>
//               <div>
//                 <h2 className="text-base font-bold text-[var(--color-text-primary)] leading-tight">
//                   Confirm Gift
//                 </h2>
//                 <p className="text-[10px] text-[var(--color-text-secondary)] mt-0.5">
//                   Anonymous · ZK-verified
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={onClose}
//               className="group p-2 rounded-xl border border-transparent hover:border-gray-700/60 hover:bg-gray-800/50 active:scale-95 transition-all duration-300">
//               <X
//                 size={15}
//                 className="text-[var(--color-text-secondary)] group-hover:text-white transition-colors duration-300"
//               />
//             </button>
//           </div>

//           {/* ── Gift preview ───────────────────────── */}
//           <div className="relative flex flex-col items-center gap-2 py-6 rounded-2xl bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/15 overflow-hidden">
//             <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent pointer-events-none" />
//             <span className="text-6xl gift-emoji">{gift.emoji}</span>
//             <p className="text-base font-bold text-[var(--color-text-primary)]">
//               {gift.name}
//             </p>
//             <div className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/20">
//               <span className="text-sm font-bold text-indigo-300">
//                 {gift.price.toLocaleString()}
//               </span>
//             </div>
//           </div>

  
//           <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)]">
//             <Lock size={13} className="text-indigo-400 flex-shrink-0 mt-1" />

//             <div className="flex-1 min-w-0 space-y-1.5">
//               <p className="text-[10px] text-[var(--color-text-secondary)] font-medium uppercase tracking-widest">
//                 Recipient Address
//               </p>

//               <input
//                 type="text"
//                 value={recipientAddress}
//                 onChange={(e) => setRecipientAddress(e.target.value)}
//                 placeholder="aleo1..."
//                 className="w-full bg-transparent outline-none text-sm font-semibold text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]"
//               />
//             </div>
//           </div>
      
//           {noRecipient && (
//             <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 animate-fadeIn">
//               <AlertTriangle
//                 size={14}
//                 className="text-amber-400 flex-shrink-0"
//               />
//               <p className="text-xs font-semibold text-amber-400">
//                 Please enter a recipient ID first.
//               </p>
//             </div>
//           )}

//           {/* ── Actions ────────────────────────────── */}
//           <div className="flex gap-3 pt-1">
//             <button
//               onClick={onClose}
//               className="flex-1 py-3 rounded-2xl text-sm font-semibold
//                 border border-[var(--color-border)] text-[var(--color-text-secondary)]
//                 hover:border-gray-600 hover:text-[var(--color-text-primary)] hover:bg-gray-800/40
//                 active:scale-[0.98] transition-all duration-300">
//               Cancel
//             </button>

//             <button
//               onClick={handleConfirm}
//               disabled={!canSend || sending}
//               className={`
//                 group relative flex-1 flex items-center justify-center gap-2
//                 py-3 rounded-2xl text-sm font-semibold text-white overflow-hidden
//                 transition-all duration-300 active:scale-[0.98]
//                 ${
//                   !canSend
//                     ? "bg-gray-800 text-gray-500 cursor-not-allowed"
//                     : done
//                       ? "bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg shadow-green-500/30"
//                       : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50"
//                 }
//               `}>
//               {/* Shimmer */}
//               {canSend && !done && (
//                 <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
//               )}

//               {sending ? (
//                 <>
//                   <svg
//                     className="animate-spin h-4 w-4"
//                     fill="none"
//                     viewBox="0 0 24 24">
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     />
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                     />
//                   </svg>
//                   Sending…
//                 </>
//               ) : done ? (
//                 <>
//                   <svg
//                     className="w-4 h-4"
//                     fill="currentColor"
//                     viewBox="0 0 20 20">
//                     <path
//                       fillRule="evenodd"
//                       d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                   Gift Sent!
//                 </>
//               ) : (
//                 <>
//                   <Send
//                     size={15}
//                     className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
//                   />
//                   Send Gift
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes backdropIn {
//           from {
//             opacity: 0;
//           }
//           to {
//             opacity: 1;
//           }
//         }
//         @keyframes panelIn {
//           from {
//             opacity: 0;
//             transform: scale(0.93) translateY(18px);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1) translateY(0);
//           }
//         }
//         @keyframes emojiPop {
//           0% {
//             transform: scale(0.6) rotate(-10deg);
//           }
//           60% {
//             transform: scale(1.15) rotate(4deg);
//           }
//           100% {
//             transform: scale(1) rotate(0deg);
//           }
//         }
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(-4px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .modal-backdrop {
//           animation: backdropIn 0.2s ease-out both;
//         }
//         .modal-panel {
//           animation: panelIn 0.32s cubic-bezier(0.34, 1.26, 0.64, 1) both;
//         }
//         .gift-emoji {
//           animation: emojiPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both;
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.25s ease-out both;
//         }
//       `}</style>
//     </div>
//   );
// }

/* eslint-disable no-unused-vars */
// ─── GiftPreviewModal.jsx ─────────────────────────────────────────────────────
import { useState, useEffect, useRef, useCallback } from "react";
import { v4 as uuid } from "uuid";
import { X, Send, AlertTriangle, Lock, Sparkles, CheckCircle2, ClipboardPaste, XCircle } from "lucide-react";
import { useWallet } from "@provablehq/aleo-wallet-adaptor-react";
import { ALEO_PROGRAM_NAME } from "../../../config/config";

// ── Transaction state machine ────────────────────────────────────────────────
// idle → sending → polling → done | error
const TX_STATE = {
  IDLE: "idle",
  SENDING: "sending",      // wallet signing / broadcasting
  POLLING: "polling",      // waiting for on-chain acceptance
  DONE: "done",
  ERROR: "error",
};

const ALEO_ADDRESS_RE = /^aleo1[a-z0-9]{58}$/;

export default function GiftPreviewModal({ gift, recipient, onClose }) {
  const [txState, setTxState] = useState(TX_STATE.IDLE);
  const [errorMsg, setErrorMsg] = useState("");
  const [pollSeconds, setPollSeconds] = useState(0);
  const [recipientAddress, setRecipientAddress] = useState(recipient ?? "");
  const [touched, setTouched] = useState(false);   // only show validation after first interaction
  const { executeTransaction, transactionStatus } = useWallet();
  const pollTimerRef = useRef(null);
  const elapsedRef = useRef(null);
  const inputRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Cleanup polling timers on unmount
  useEffect(() => () => {
    clearTimeout(pollTimerRef.current);
    clearInterval(elapsedRef.current);
  }, []);

  if (!gift) return null;

  const addressValid = ALEO_ADDRESS_RE.test(recipientAddress.trim());
  const showAddressError = touched && !addressValid;
  const canSend = addressValid && txState === TX_STATE.IDLE;

  // ── Paste from clipboard ────────────────────────────────────────────────────
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setRecipientAddress(text.trim());
      setTouched(true);
    } catch {
      inputRef.current?.focus();
    }
  };

  // ── Main send handler ───────────────────────────────────────────────────────
  const handleConfirm = async () => {
    if (!canSend) return;
    setErrorMsg("");
    setTxState(TX_STATE.SENDING);

    try {
      const DECIMALS = 1_000_000;
      const rawAmount = Math.floor(gift.price * DECIMALS);
      const amountInput = `${rawAmount}u128`;
      const unixTimestamp = Math.floor(Date.now() / 1000);
      const giftIdInput = `${unixTimestamp}u32`;

      const result = await executeTransaction({
        program: ALEO_PROGRAM_NAME,
        function: "send_gift",
        inputs: [recipientAddress.trim(), amountInput, "0field", giftIdInput],
        fee: 100_000,
        privateFee: false,
      });

      const actualId = result.transactionId;
      console.log("🚀 Transaction broadcasted! ID:", actualId);

      // Switch to polling state and start elapsed timer
      setTxState(TX_STATE.POLLING);
      setPollSeconds(0);
      elapsedRef.current = setInterval(() => setPollSeconds((s) => s + 1), 1000);

      // ── Polling ─────────────────────────────────────────────────────────────
      const start = Date.now();
      const TIMEOUT = 120_000;
      const INTERVAL = 3_000;

      const poll = async () => {
        try {
          const status = await transactionStatus(actualId);

          if (status.status === "Accepted") {
            clearInterval(elapsedRef.current);
            setTxState(TX_STATE.DONE);
            setTimeout(() => { setTxState(TX_STATE.IDLE); onClose(); }, 2000);
            return;
          }

          if (status.status === "Rejected") {
            clearInterval(elapsedRef.current);
            setTxState(TX_STATE.ERROR);
            setErrorMsg("Transaction was rejected by the network. Please try again.");
            return;
          }
        } catch {
          // RPC may not have indexed yet — keep polling silently
        }

        if (Date.now() - start < TIMEOUT) {
          pollTimerRef.current = setTimeout(poll, INTERVAL);
        } else {
          clearInterval(elapsedRef.current);
          setTxState(TX_STATE.ERROR);
          setErrorMsg("Timed out waiting for confirmation. Check your wallet for the transaction status.");
        }
      };

      poll();
    } catch (err) {
      clearInterval(elapsedRef.current);
      const msg = err?.message ?? "Something went wrong. Please try again.";
      setErrorMsg(msg.length > 120 ? msg.slice(0, 117) + "…" : msg);
      setTxState(TX_STATE.ERROR);
    }
  };

  // ── Derived button label / state ────────────────────────────────────────────
  const isBusy = txState === TX_STATE.SENDING || txState === TX_STATE.POLLING;

  const buttonLabel = () => {
    switch (txState) {
      case TX_STATE.SENDING:  return <><Spinner /> Awaiting wallet…</>;
      case TX_STATE.POLLING:  return <><Spinner /> Confirming… {pollSeconds}s</>;
      case TX_STATE.DONE:     return <><CheckCircle2 size={15} /> Gift Sent!</>;
      case TX_STATE.ERROR:    return <>Retry</>;
      default:                return <><Send size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /> Send Gift</>;
    }
  };

  const buttonClass = () => {
    if (!canSend && txState === TX_STATE.IDLE)
      return "bg-gray-800 text-gray-500 cursor-not-allowed";
    if (txState === TX_STATE.DONE)
      return "bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg shadow-green-500/30";
    if (txState === TX_STATE.ERROR)
      return "bg-gradient-to-r from-red-600 to-rose-600 shadow-lg shadow-red-500/30 hover:from-red-500 hover:to-rose-500";
    if (isBusy)
      return "bg-gradient-to-r from-indigo-700 to-purple-700 cursor-wait opacity-80";
    return "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50";
  };

  // If error state, retry clears it back to idle
  const handleButtonClick = () => {
    if (txState === TX_STATE.ERROR) {
      setTxState(TX_STATE.IDLE);
      setErrorMsg("");
    } else {
      handleConfirm();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center px-4 modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && !isBusy && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      {/* Panel */}
      <div className="modal-panel relative w-full max-w-md rounded-3xl overflow-hidden border border-gray-800/60 shadow-2xl shadow-black/60">
        {/* Top glow line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent pointer-events-none" />
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 bg-purple-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 bg-[var(--color-surface)] p-6 space-y-5">
          {/* ── Header ───────────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <h2 id="modal-title" className="text-base font-bold text-[var(--color-text-primary)] leading-tight">
                  Confirm Gift
                </h2>
                <p className="text-[10px] text-[var(--color-text-secondary)] mt-0.5">
                  Anonymous · ZK-verified
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isBusy}
              aria-label="Close"
              className="group p-2 rounded-xl border border-transparent hover:border-gray-700/60 hover:bg-gray-800/50 active:scale-95 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <X size={15} className="text-[var(--color-text-secondary)] group-hover:text-white transition-colors duration-300" />
            </button>
          </div>

          {/* ── Gift preview ──────────────────────────────────────────────────── */}
          <div className="relative flex flex-col items-center gap-2 py-6 rounded-2xl bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/15 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent pointer-events-none" />
            <span className="text-6xl gift-emoji">{gift.emoji}</span>
            <p className="text-base font-bold text-[var(--color-text-primary)]">{gift.name}</p>
            <div className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/20">
              <span className="text-sm font-bold text-indigo-300">
                {gift.price.toLocaleString()} USDCx
              </span>
            </div>
          </div>

          {/* ── Recipient input ───────────────────────────────────────────────── */}
          <div className={`
            flex items-start gap-3 px-4 py-3 rounded-xl
            bg-[var(--color-surface-2)] border transition-colors duration-200
            ${showAddressError
              ? "border-red-500/50 bg-red-500/5"
              : addressValid
                ? "border-green-500/40"
                : "border-[var(--color-border)] focus-within:border-indigo-500/50"
            }
          `}>
            <Lock size={13} className={`flex-shrink-0 mt-1 ${showAddressError ? "text-red-400" : addressValid ? "text-green-400" : "text-indigo-400"}`} />
            <div className="flex-1 min-w-0 space-y-1.5">
              <p className="text-[10px] text-[var(--color-text-secondary)] font-medium uppercase tracking-widest">
                Recipient Address
              </p>
              <input
                ref={inputRef}
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="aleo1…"
                disabled={isBusy}
                aria-invalid={showAddressError}
                aria-describedby={showAddressError ? "addr-error" : undefined}
                className="w-full bg-transparent outline-none text-sm font-mono text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]/50 disabled:opacity-50"
              />
            </div>
            {/* Paste button */}
            {!recipientAddress && (
              <button
                onClick={handlePaste}
                disabled={isBusy}
                title="Paste from clipboard"
                className="flex-shrink-0 p-1 rounded-lg text-[var(--color-text-secondary)] hover:text-indigo-400 hover:bg-indigo-500/10 transition-all duration-200 disabled:opacity-40"
              >
                <ClipboardPaste size={13} />
              </button>
            )}
            {/* Clear button */}
            {recipientAddress && !isBusy && (
              <button
                onClick={() => { setRecipientAddress(""); setTouched(false); inputRef.current?.focus(); }}
                title="Clear"
                className="flex-shrink-0 p-1 rounded-lg text-[var(--color-text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
              >
                <XCircle size={13} />
              </button>
            )}
          </div>

          {/* Address validation error */}
          {showAddressError && (
            <p id="addr-error" className="flex items-center gap-2 text-xs text-red-400 animate-fadeIn -mt-2 px-1">
              <AlertTriangle size={12} className="flex-shrink-0" />
              Enter a valid Aleo address (aleo1… followed by 58 characters).
            </p>
          )}

          {/* Transaction error */}
          {txState === TX_STATE.ERROR && errorMsg && (
            <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 animate-fadeIn">
              <AlertTriangle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-red-400">{errorMsg}</p>
            </div>
          )}

          {/* Polling status strip */}
          {txState === TX_STATE.POLLING && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 animate-fadeIn">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse flex-shrink-0" />
              <p className="text-xs font-medium text-indigo-300 flex-1">
                Waiting for on-chain confirmation…
              </p>
              <span className="text-[10px] text-indigo-400/70 tabular-nums">{pollSeconds}s</span>
            </div>
          )}

          {/* ── Actions ───────────────────────────────────────────────────────── */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              disabled={isBusy}
              className="flex-1 py-3 rounded-2xl text-sm font-semibold
                border border-[var(--color-border)] text-[var(--color-text-secondary)]
                hover:border-gray-600 hover:text-[var(--color-text-primary)] hover:bg-gray-800/40
                active:scale-[0.98] transition-all duration-300
                disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            <button
              onClick={handleButtonClick}
              disabled={(!canSend && txState === TX_STATE.IDLE) || isBusy || txState === TX_STATE.DONE}
              className={`
                group relative flex-1 flex items-center justify-center gap-2
                py-3 rounded-2xl text-sm font-semibold text-white overflow-hidden
                transition-all duration-300 active:scale-[0.98]
                ${buttonClass()}
              `}
            >
              {/* Shimmer — only when idle+valid */}
              {canSend && txState === TX_STATE.IDLE && (
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
              )}
              {buttonLabel()}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes backdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes panelIn {
          from { opacity: 0; transform: scale(0.93) translateY(18px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
        @keyframes emojiPop {
          0%   { transform: scale(0.6)  rotate(-10deg); }
          60%  { transform: scale(1.15) rotate(4deg);   }
          100% { transform: scale(1)    rotate(0deg);   }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .modal-backdrop { animation: backdropIn 0.2s ease-out both; }
        .modal-panel    { animation: panelIn 0.32s cubic-bezier(0.34, 1.26, 0.64, 1) both; }
        .gift-emoji     { animation: emojiPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both; }
        .animate-fadeIn { animation: fadeIn 0.25s ease-out both; }
      `}</style>
    </div>
  );
}

// ── Inline spinner ────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path  className="opacity-75"  fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}