/* eslint-disable no-unused-vars */
// ─── ProfileStats.jsx ─────────────────────────────────────────────────────────
import { useFriendsStore } from "../../../store/useFriendsStore";
import { useWalletStore } from "../../../store/useWalletStore";
import { Users, Gift, FileText } from "lucide-react";

const STAT_META = [
  {
    key: "friends",
    label: "Friends",
    icon: Users,
    color: "text-indigo-400",
    bg: "from-indigo-500/10 to-indigo-600/5",
    border: "border-indigo-500/15 hover:border-indigo-500/30",
  },
  {
    key: "giftsSent",
    label: "Gifts Sent",
    icon: Gift,
    color: "text-purple-400",
    bg: "from-purple-500/10 to-purple-600/5",
    border: "border-purple-500/15 hover:border-purple-500/30",
  },
  {
    key: "posts",
    label: "Posts",
    icon: FileText,
    color: "text-pink-400",
    bg: "from-pink-500/10 to-pink-600/5",
    border: "border-pink-500/15 hover:border-pink-500/30",
  },
];

export default function ProfileStats() {
  const { friends } = useFriendsStore();
  const { transactions } = useWalletStore();
  const giftsSent = transactions.filter(
    (t) => t.type === "gift_sent" || t.type === "gift",
  ).length;

  const values = { friends: friends.length, giftsSent, posts: 12 };

  return (
    <div className="grid grid-cols-3 gap-3">
      {STAT_META.map(({ key, label, icon: Icon, color, bg, border }, i) => (
        <div
          key={key}
          className={`relative group p-4 rounded-2xl bg-gradient-to-br ${bg} border ${border}
            hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 text-center overflow-hidden stat-card`}
          style={{ animationDelay: `${i * 60}ms` }}>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-10 pointer-events-none" />
          <div
            className={`flex justify-center mb-2 ${color} group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={16} />
          </div>
          <p className="text-xl font-bold text-[var(--color-text-primary)] tabular-nums">
            {values[key]}
          </p>
          <p className="text-[10px] text-[var(--color-text-secondary)] font-medium uppercase tracking-widest mt-0.5">
            {label}
          </p>
          <style jsx>{`
            @keyframes fadeSlideUp {
              from {
                opacity: 0;
                transform: translateY(10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .stat-card {
              animation: fadeSlideUp 0.4s ease-out both;
            }
          `}</style>
        </div>
      ))}
    </div>
  );
}
