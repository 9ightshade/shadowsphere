// ─── GiftingPage.jsx ──────────────────────────────────────────────────────────
import { useState } from "react";
import { giftCatalog } from "./gifts";
import GiftGrid from "./components/GiftGrid";
import GiftRecipientSelector from "./components/GiftRecipientSelector";
import GiftPreviewModal from "./components/GiftPreviewModal";
import { Gift, Sparkles } from "lucide-react";

export default function GiftingPage() {
  const [recipient, setRecipient] = useState("");
  const [selectedGift, setSelectedGift] = useState(null);

  return (
    <div className="relative flex flex-col gap-7 gifting-root">
      {/* Ambient glows */}
      <div className="absolute -top-16 -right-16 w-72 h-72 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-48 -left-12 w-64 h-64 bg-indigo-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* ── Page header ───────────────────────────── */}
      <div className="flex items-center gap-3 gifting-header">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Gift size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight leading-tight">
            Send a Gift
          </h1>
          <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1 mt-0.5">
            <Sparkles size={10} className="text-indigo-400" />
            Anonymous · Zero-knowledge delivery
          </p>
        </div>
      </div>

      {/* ── Recipient ─────────────────────────────── */}
      <div className="gifting-recipient">
        <GiftRecipientSelector
          recipient={recipient}
          setRecipient={setRecipient}
        />
      </div>

      {/* ── Gift grid ─────────────────────────────── */}
      <div className="gifting-grid">
        <GiftGrid
          gifts={giftCatalog}
          onSelect={setSelectedGift}
          selectedGift={selectedGift}
        />
      </div>

      {/* ── Modal ─────────────────────────────────── */}
      <GiftPreviewModal
        gift={selectedGift}
        recipient={recipient}
        onClose={() => setSelectedGift(null)}
      />

      <style jsx>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .gifting-header {
          animation: fadeSlideUp 0.4s ease-out 0.05s both;
        }
        .gifting-recipient {
          animation: fadeSlideUp 0.4s ease-out 0.1s both;
        }
        .gifting-grid {
          animation: fadeSlideUp 0.4s ease-out 0.15s both;
        }
      `}</style>
    </div>
  );
}
