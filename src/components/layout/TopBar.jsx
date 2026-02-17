import { Bell, ShieldCheck } from "lucide-react";
import Badge from "../ui/Badge";

export default function Topbar() {
  return (
    <header className="relative h-16 border-b border-[var(--color-border)] bg-[var(--color-surface-2)] flex items-center justify-between px-6 overflow-hidden topbar-root">
      {/* Gradient bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent pointer-events-none" />

      {/* Subtle ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-16 bg-indigo-500/5 blur-2xl pointer-events-none" />

      {/* ── Left: Welcome ────────────────────────────── */}
      <div className="relative z-10 topbar-left">
        <p className="text-[11px] uppercase tracking-widest text-[var(--color-text-secondary)] opacity-60 font-medium leading-tight">
          Welcome back
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <p className="text-sm font-semibold text-[var(--color-text-primary)] tracking-tight">
            You're online
          </p>
        </div>
      </div>

      {/* ── Right: Actions ───────────────────────────── */}
      <div className="relative z-10 flex items-center gap-3 topbar-right">
        {/* Notification bell */}
        <button className="group relative p-2.5 rounded-xl border border-transparent hover:border-indigo-500/30 hover:bg-indigo-500/10 active:scale-95 transition-all duration-300">
          <Bell
            size={18}
            className="text-[var(--color-text-secondary)] group-hover:text-indigo-400 transition-colors duration-300"
          />

          {/* Notification dot */}
          <span className="absolute top-1.5 right-1.5 flex">
            <span className="relative flex w-2 h-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full w-2 h-2 bg-gradient-to-br from-indigo-500 to-purple-500 shadow-sm shadow-indigo-500/50" />
            </span>
          </span>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-gradient-to-b from-transparent via-[var(--color-border)] to-transparent" />

        {/* Verified badge */}
        <div className="group flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600/15 to-purple-600/15 border border-indigo-500/20 hover:border-indigo-500/40 hover:from-indigo-600/25 hover:to-purple-600/25 active:scale-95 transition-all duration-300 cursor-default">
          <ShieldCheck
            size={14}
            className="text-indigo-400 drop-shadow-[0_0_6px_rgba(99,102,241,0.6)] group-hover:scale-110 transition-transform duration-300"
          />
          <span className="text-xs font-semibold text-indigo-300 tracking-wide">
            Verified
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeSlideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .topbar-left {
          animation: fadeSlideUp 0.45s ease-out both;
        }
        .topbar-right {
          animation: fadeSlideDown 0.45s ease-out both;
        }
      `}</style>
    </header>
  );
}
