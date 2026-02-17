// ─── FriendCard.jsx ───────────────────────────────────────────────────────────
import { useFriendsStore } from "../../../store/useFriendsStore";
import { MessageSquare, UserMinus } from "lucide-react";
import { useState } from "react";

export default function FriendCard({ user }) {
  const { removeFriend } = useFriendsStore();
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    setRemoving(true);
    await new Promise((r) => setTimeout(r, 300));
    removeFriend(user.id);
  };

  const alias = user.from?.alias ?? user.name ?? user.username ?? "Unknown";
  const initials = alias
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`
      group relative flex items-center gap-4 p-4 rounded-2xl
      bg-[var(--color-surface-2)] border border-[var(--color-border)]
      hover:border-indigo-500/20 hover:bg-indigo-500/5
      transition-all duration-300 overflow-hidden
      ${removing ? "opacity-40 scale-98 pointer-events-none" : ""}
    `}>
      {/* Top glow on hover */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={alias}
            className="w-11 h-11 rounded-xl object-cover border border-[var(--color-border)] group-hover:border-indigo-500/30 transition-all duration-300"
          />
        ) : (
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-indigo-500/20 flex items-center justify-center text-sm font-bold text-indigo-300">
            {initials}
          </div>
        )}
        {/* Online dot */}
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[var(--color-surface-2)] ${
            user.isOnline ? "bg-green-400" : "bg-gray-600"
          }`}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[var(--color-text-primary)] leading-tight truncate">
          {alias}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          {user.isOnline ? (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] text-green-400 font-medium">
                Online
              </span>
            </>
          ) : (
            <span className="text-[10px] text-[var(--color-text-secondary)]">
              Offline
            </span>
          )}
          {user.username && (
            <span className="text-[10px] text-[var(--color-text-secondary)]">
              · @{user.username}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button className="p-2 rounded-xl border border-transparent hover:border-indigo-500/30 hover:bg-indigo-500/10 active:scale-90 transition-all duration-200">
          <MessageSquare
            size={15}
            className="text-[var(--color-text-secondary)] hover:text-indigo-400"
          />
        </button>
        <button
          onClick={handleRemove}
          className="p-2 rounded-xl border border-transparent hover:border-rose-500/30 hover:bg-rose-500/10 active:scale-90 transition-all duration-200">
          <UserMinus
            size={15}
            className="text-[var(--color-text-secondary)] hover:text-rose-400 transition-colors"
          />
        </button>
      </div>
    </div>
  );
}
