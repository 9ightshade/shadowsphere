// ─── DepositModal.jsx ─────────────────────────────────────────────────────────
import {
  X,
  ArrowDownLeft,
  Copy,
  Check,
  Shield,
  Wallet,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

const NETWORKS = ["Aleo Mainnet", "Aleo Testnet"];
const MOCK_ADDRESS =
  "aleo1qnr4dkkvkgfqph0vzc3y6z4cspymuqkw9g3k5j8j7kzr9v0g3yqsn4dfed";

export default function DepositModal({ open, onClose, balance }) {
  const [network, setNetwork] = useState(NETWORKS[0]);
  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);

  if (!open) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(MOCK_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) return;
    setConfirming(true);
    await new Promise((r) => setTimeout(r, 1200));
    setConfirming(false);
    setDone(true);
    setTimeout(() => {
      setDone(false);
      setAmount("");
      onClose();
    }, 1500);
  };

  const quickAmounts = [50, 100, 250, 500];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      <div className="modal-panel relative w-full max-w-md rounded-3xl overflow-hidden border border-gray-800/60 shadow-2xl shadow-black/60">
        {/* Top glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/60 to-transparent pointer-events-none" />
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 bg-green-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 bg-[var(--color-surface)] p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                <ArrowDownLeft size={17} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[var(--color-text-primary)] leading-tight">
                  Deposit Funds
                </h2>
                <p className="text-[10px] text-[var(--color-text-secondary)] mt-0.5">
                  Add USDCx to your wallet
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

          {/* Current balance pill */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)]">
            <Wallet size={13} className="text-indigo-400" />
            <span className="text-xs text-[var(--color-text-secondary)]">
              Current balance:
            </span>
            <span className="text-xs font-bold text-[var(--color-text-primary)] ml-auto">
              {balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}{" "}
              USDCx
            </span>
          </div>

          {/* Network selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest">
              Network
            </label>
            <div className="flex gap-2">
              {NETWORKS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNetwork(n)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 active:scale-[0.98]
                    ${
                      network === n
                        ? "bg-gradient-to-r from-green-600/25 to-emerald-600/20 border border-green-500/40 text-green-300"
                        : "bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-green-500/20 hover:text-[var(--color-text-primary)]"
                    }`}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Deposit address */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest flex items-center gap-1.5">
              <Shield size={10} className="text-green-400" />
              Your Deposit Address
            </label>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] hover:border-green-500/20 transition-all duration-300">
              <p className="flex-1 font-mono text-[11px] text-[var(--color-text-secondary)] break-all leading-relaxed">
                {MOCK_ADDRESS}
              </p>
              <button
                onClick={handleCopy}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 active:scale-90
                  ${
                    copied
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-[var(--color-muted)] text-[var(--color-text-secondary)] hover:text-white hover:bg-indigo-500/20 border border-transparent hover:border-indigo-500/20"
                  }`}>
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="text-[10px] text-[var(--color-text-secondary)] flex items-center gap-1 pl-1">
              <AlertCircle size={9} className="text-amber-400 flex-shrink-0" />
              Only send USDCx on {network}. Other assets will be lost.
            </p>
          </div>

          {/* Amount input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest">
              Amount
            </label>
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--color-surface-2)] border transition-all duration-300
              ${
                amount && !isNaN(amount) && parseFloat(amount) > 0
                  ? "border-green-500/40 ring-2 ring-green-500/10"
                  : "border-[var(--color-border)] focus-within:border-green-500/40 focus-within:ring-2 focus-within:ring-green-500/10"
              }`}>
              <span className="text-sm font-bold text-[var(--color-text-secondary)]">
                ₦
              </span>
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1 bg-transparent text-sm font-semibold text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/30 focus:outline-none tabular-nums"
              />
              <span className="text-xs font-bold text-green-400">USDCx</span>
            </div>

            {/* Quick amounts */}
            <div className="flex gap-2 mt-1">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmount(String(q))}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95
                    ${
                      String(q) === amount
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-[var(--color-muted)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)] border border-transparent"
                    }`}>
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl text-sm font-semibold border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-gray-600 hover:text-[var(--color-text-primary)] hover:bg-gray-800/40 active:scale-[0.98] transition-all duration-300">
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={
                !amount ||
                isNaN(amount) ||
                parseFloat(amount) <= 0 ||
                confirming
              }
              className={`group relative flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-white overflow-hidden transition-all duration-300 active:scale-[0.98]
                ${
                  !amount || isNaN(amount) || parseFloat(amount) <= 0
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                    : done
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg shadow-green-500/30"
                      : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
                }`}>
              {!done && amount && parseFloat(amount) > 0 && (
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
              )}
              {confirming ? (
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
                  Processing…
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
                  Deposit Initiated!
                </>
              ) : (
                <>
                  <ArrowDownLeft size={15} />
                  Confirm Deposit
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
        .modal-backdrop {
          animation: backdropIn 0.2s ease-out both;
        }
        .modal-panel {
          animation: panelIn 0.3s cubic-bezier(0.34, 1.26, 0.64, 1) both;
        }
      `}</style>
    </div>
  );
}
