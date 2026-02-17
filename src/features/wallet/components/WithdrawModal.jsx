// ─── WithdrawModal.jsx ────────────────────────────────────────────────────────
import {
  X,
  ArrowUpRight,
  Shield,
  Wallet,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const NETWORKS = ["Aleo Mainnet", "Aleo Testnet"];

export default function WithdrawModal({ open, onClose, balance }) {
  const [network, setNetwork] = useState(NETWORKS[0]);
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);

  if (!open) return null;

  const parsedAmount = parseFloat(amount) || 0;
  const insufficient = parsedAmount > balance;
  const noAddress = !address.trim();
  const canSubmit = parsedAmount > 0 && !insufficient && !noAddress;
  const fee = parsedAmount > 0 ? (parsedAmount * 0.001).toFixed(4) : "0.0000";
  const youReceive =
    parsedAmount > 0 ? (parsedAmount - parseFloat(fee)).toFixed(2) : "0.00";
  const quickPcts = [25, 50, 75, 100];

  const handleConfirm = async () => {
    if (!canSubmit || confirming) return;
    setConfirming(true);
    await new Promise((r) => setTimeout(r, 1200));
    setConfirming(false);
    setDone(true);
    setTimeout(() => {
      setDone(false);
      setAmount("");
      setAddress("");
      onClose();
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      <div className="modal-panel relative w-full max-w-md rounded-3xl overflow-hidden border border-gray-800/60 shadow-2xl shadow-black/60">
        {/* Top glow — indigo for withdraw */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent pointer-events-none" />
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 bg-[var(--color-surface)] p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <ArrowUpRight size={17} className="text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[var(--color-text-primary)] leading-tight">
                  Withdraw Funds
                </h2>
                <p className="text-[10px] text-[var(--color-text-secondary)] mt-0.5">
                  Send USDCx to an external address
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

          {/* Balance pill */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)]">
            <Wallet size={13} className="text-indigo-400" />
            <span className="text-xs text-[var(--color-text-secondary)]">
              Available:
            </span>
            <span className="text-xs font-bold text-[var(--color-text-primary)] ml-auto">
              {balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}{" "}
              USDCx
            </span>
          </div>

          {/* Network */}
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
                        ? "bg-gradient-to-r from-indigo-600/25 to-purple-600/20 border border-indigo-500/40 text-indigo-300"
                        : "bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-indigo-500/20 hover:text-[var(--color-text-primary)]"
                    }`}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest">
              Amount
            </label>
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--color-surface-2)] border transition-all duration-300
              ${
                insufficient
                  ? "border-rose-500/50 ring-2 ring-rose-500/10"
                  : parsedAmount > 0
                    ? "border-indigo-500/40 ring-2 ring-indigo-500/10"
                    : "border-[var(--color-border)] focus-within:border-indigo-500/40 focus-within:ring-2 focus-within:ring-indigo-500/10"
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
              <span className="text-xs font-bold text-indigo-400">USDCx</span>
            </div>

            {/* % quick-select */}
            <div className="flex gap-2 mt-1">
              {quickPcts.map((pct) => {
                const val = ((balance * pct) / 100).toFixed(2);
                return (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setAmount(val)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95
                      ${
                        amount === val
                          ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                          : "bg-[var(--color-muted)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-transparent"
                      }`}>
                    {pct === 100 ? "MAX" : `${pct}%`}
                  </button>
                );
              })}
            </div>

            {insufficient && (
              <p className="flex items-center gap-1.5 text-xs text-rose-400 pl-1 animate-fadeIn">
                <AlertTriangle size={11} />
                Exceeds available balance
              </p>
            )}
          </div>

          {/* Destination address */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest flex items-center gap-1.5">
              <Shield size={10} className="text-indigo-400" />
              Destination Address
            </label>
            <div
              className={`flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--color-surface-2)] border transition-all duration-300
              ${
                address.trim()
                  ? "border-indigo-500/40 ring-2 ring-indigo-500/10"
                  : "border-[var(--color-border)] focus-within:border-indigo-500/40 focus-within:ring-2 focus-within:ring-indigo-500/10"
              }`}>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="aleo1..."
                className="flex-1 bg-transparent font-mono text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/40 focus:outline-none"
              />
            </div>
          </div>

          {/* Fee summary */}
          {parsedAmount > 0 && (
            <div className="p-4 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] space-y-2.5 animate-fadeIn">
              <p className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest">
                Summary
              </p>
              {[
                {
                  label: "You send",
                  value: `${parsedAmount.toFixed(2)} USDCx`,
                  color: "",
                },
                {
                  label: "Network fee",
                  value: `${fee} USDCx`,
                  color: "text-amber-400",
                },
                {
                  label: "You receive",
                  value: `${youReceive} USDCx`,
                  color: "text-green-400",
                },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    {label}
                  </span>
                  <span
                    className={`text-xs font-semibold tabular-nums ${color || "text-[var(--color-text-primary)]"}`}>
                    {value}
                  </span>
                </div>
              ))}
              <div className="h-px bg-[var(--color-border)]" />
              <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-text-secondary)]">
                <Shield size={9} className="text-indigo-400" />
                ZK-verified transaction · Non-reversible
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl text-sm font-semibold border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-gray-600 hover:text-[var(--color-text-primary)] hover:bg-gray-800/40 active:scale-[0.98] transition-all duration-300">
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!canSubmit || confirming}
              className={`group relative flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold text-white overflow-hidden transition-all duration-300 active:scale-[0.98]
                ${
                  !canSubmit
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                    : done
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg shadow-green-500/30"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50"
                }`}>
              {canSubmit && !done && (
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
                  Withdrawal Sent!
                </>
              ) : (
                <>
                  <ArrowUpRight size={15} className="relative z-10" />
                  <span className="relative z-10">Confirm Withdrawal</span>
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
