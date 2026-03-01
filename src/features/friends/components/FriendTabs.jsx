// ─── FriendTabs.jsx ───────────────────────────────────────────────────────────
import { useFriendsStore } from "../../../store/useFriendsStore";
import { Users, Bell, Clock } from "lucide-react";

const TAB_META = {
  friends:  { label: "Friends",  icon: Users },
  blocked: { label: "Blocked",  icon: Clock },
};

export default function FriendTabs({ counts = {} }) {
  const { tab, setTab } = useFriendsStore();
  const tabs = ["friends", "blocked"];

  return (
    <div className="flex items-center gap-2 p-1 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)]">
      {tabs.map((t) => {
        const { label, icon: Icon } = TAB_META[t];
        const isActive = tab === t;
        const count    = counts[t] ?? 0;

        return (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`
              group relative flex-1 flex items-center justify-center gap-2
              px-4 py-2.5 rounded-xl text-sm font-semibold
              transition-all duration-300 active:scale-[0.97]
              ${isActive
                ? "bg-gradient-to-r from-indigo-600/25 to-purple-600/20 text-[var(--color-text-primary)] shadow-md shadow-indigo-500/10"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-indigo-500/8"
              }
            `}
          >
            {/* Active top bar */}
            {isActive && (
              <span className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-indigo-400/70 to-transparent rounded-full pointer-events-none" />
            )}

            <Icon
              size={14}
              className={`transition-all duration-300 ${
                isActive
                  ? "text-indigo-400 drop-shadow-[0_0_6px_rgba(99,102,241,0.5)]"
                  : "group-hover:text-indigo-400"
              }`}
            />

            <span className="capitalize">{label}</span>

            {/* Count badge */}
            {count > 0 && (
              <span className={`inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold rounded-full
                ${isActive
                  ? "bg-indigo-500 text-white shadow-sm shadow-indigo-500/40"
                  : t === "incoming"
                    ? "bg-gradient-to-br from-pink-500 to-rose-500 text-white animate-pulse"
                    : "bg-gray-700 text-gray-300"
                }
              `}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
