// ─── GiftGrid.jsx ─────────────────────────────────────────────────────────────
import GiftCard from "./GiftCard";
import { Sparkles } from "lucide-react";

export default function GiftGrid({ gifts, onSelect, selectedGift }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest">
          <Sparkles size={11} className="text-purple-400" />
          Choose a Gift
        </label>
        <span className="text-[10px] text-[var(--color-text-secondary)]">
          {gifts.length} items
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {gifts.map((gift, i) => (
          <div
            key={gift.id}
            className="gift-card-wrapper"
            style={{ animationDelay: `${i * 45}ms` }}>
            <GiftCard
              gift={gift}
              onSelect={onSelect}
              isSelected={selectedGift?.id === gift.id}
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .gift-card-wrapper {
          animation: fadeSlideUp 0.35s ease-out both;
        }
      `}</style>
    </div>
  );
}
