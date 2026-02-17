import { Search, UserCheck, X } from "lucide-react";

export default function GiftRecipientSelector({ recipient, setRecipient }) {
  const hasValue = recipient.trim().length > 0;

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest">
        <UserCheck size={11} className="text-indigo-400" />
        Recipient ID
      </label>

      <div className={`
        group relative flex items-center gap-3 px-4 py-3 rounded-2xl
        bg-[var(--color-surface-2)] border transition-all duration-300
        ${hasValue
          ? "border-indigo-500/40 ring-2 ring-indigo-500/10 shadow-lg shadow-indigo-500/10"
          : "border-[var(--color-border)] hover:border-indigo-500/25 focus-within:border-indigo-500/40 focus-within:ring-2 focus-within:ring-indigo-500/10"
        }
      `}>
        <Search
          size={15}
          className={`flex-shrink-0 transition-colors duration-300 ${
            hasValue ? "text-indigo-400" : "text-[var(--color-text-secondary)] group-focus-within:text-indigo-400"
          }`}
        />

        <input
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Enter recipient user ID or alias…"
          className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/40 focus:outline-none"
        />

        {hasValue && (
          <button
            onClick={() => setRecipient("")}
            className="flex-shrink-0 p-1 rounded-lg text-[var(--color-text-secondary)] hover:text-white hover:bg-gray-700/50 active:scale-90 transition-all duration-200"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {hasValue && (
        <p className="flex items-center gap-1.5 text-[10px] text-indigo-400 animate-fadeIn pl-1">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block animate-pulse" />
          Recipient found — ready to send
        </p>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out both; }
      `}</style>
    </div>
  );
}
