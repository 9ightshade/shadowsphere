// ─── ProfileTabs.jsx ──────────────────────────────────────────────────────────
import { FileText, Gift } from "lucide-react";

const TAB_META = {
  posts: { label: "Posts", icon: FileText },
  gifts: { label: "Gifts", icon: Gift },
};

export default function ProfileTabs({ active, setActive }) {
  const tabs = ["posts", "gifts"];

  return (
    <div className="flex items-center gap-2 p-1 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)]">
      {tabs.map((tab) => {
        const { label, icon: Icon } = TAB_META[tab];
        const isActive = active === tab;

        return (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`
              group relative flex-1 flex items-center justify-center gap-2
              px-4 py-2.5 rounded-xl text-sm font-semibold
              transition-all duration-300 active:scale-[0.97]
              ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600/25 to-purple-600/20 text-[var(--color-text-primary)] shadow-md shadow-indigo-500/10"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-indigo-500/8"
              }
            `}>
            {isActive && (
              <span className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-indigo-400/70 to-transparent pointer-events-none" />
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
          </button>
        );
      })}
    </div>
  );
}
