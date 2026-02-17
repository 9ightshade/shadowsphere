// ─── GiftCard.jsx ─────────────────────────────────────────────────────────────
import { Check } from "lucide-react";

export default function GiftCard({ gift, onSelect, isSelected }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(gift)}
      className={`
        group relative w-full flex flex-col items-center gap-2.5 p-5 rounded-2xl
        transition-all duration-300 active:scale-95 text-center overflow-hidden
        ${isSelected
          ? "bg-gradient-to-br from-indigo-600/25 to-purple-600/20 border-indigo-500/50 shadow-lg shadow-indigo-500/20 scale-[1.02]"
          : "bg-[var(--color-surface-2)] border-[var(--color-border)] hover:border-indigo-500/30 hover:bg-indigo-500/8 hover:scale-[1.03] hover:shadow-lg hover:shadow-indigo-500/10"
        }
        border
      `}
    >
      {/* Top shimmer on selected */}
      {isSelected && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent pointer-events-none" />
      )}

      {/* Selected checkmark */}
      {isSelected && (
        <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md shadow-indigo-500/30">
          <Check size={11} className="text-white" strokeWidth={3} />
        </div>
      )}

      {/* Emoji */}
      <span className={`text-4xl transition-transform duration-300 ${
        isSelected ? "scale-110" : "group-hover:scale-110"
      }`}>
        {gift.emoji}
      </span>

      {/* Name */}
      <p className={`text-sm font-semibold leading-tight transition-colors duration-200 ${
        isSelected ? "text-indigo-300" : "text-[var(--color-text-primary)]"
      }`}>
        {gift.name}
      </p>

      {/* Price */}
      <div className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
        isSelected
          ? "bg-indigo-500/20 text-indigo-300"
          : "bg-[var(--color-muted)] text-[var(--color-text-secondary)] group-hover:bg-indigo-500/15 group-hover:text-indigo-400"
      }`}>
        ₦{gift.price.toLocaleString()}
      </div>
    </button>
  );
}
