import {
  Home,
  MessageSquare,
  Wallet,
  Gift,
  Users,
  User,
  Shield,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Feed", icon: Home, path: "/feed" },
  { label: "Messages", icon: MessageSquare, path: "/messages" },
  { label: "Wallet", icon: Wallet, path: "/wallet" },
  { label: "Gifts", icon: Gift, path: "/gifts" },
  { label: "Friends", icon: Users, path: "/friends" },
  { label: "Profile", icon: User, path: "/profile" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 hidden h-full border-r border-[var(--color-border)] bg-[var(--color-surface)] p-5 md:flex flex-col relative overflow-hidden">
      {/* Ambient background gradients */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      {/* Gradient edge line on the right border */}
      <div className="absolute top-0 right-0 w-px h-full bg-linear-to-b from-transparent via-indigo-500/40 to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">
        {/* ── Logo ─────────────────────────────────────── */}
        <div className="mb-10 sidebar-logo">
          <div className="flex items-center gap-3 mb-1.5">
            {/* Icon mark */}
            <div className="w-9 h-9 flex-shrink-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              ShadowSphere
            </h1>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] ml-12">
            Privacy-first social
          </p>
        </div>

        {/* ── Navigation ───────────────────────────────── */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item, index) => (
            <NavLink
              key={item.label}
              to={item.path}
              style={{ animationDelay: `${index * 60}ms` }}
              className="sidebar-nav-item">
              {({ isActive }) => (
                <div
                  className={`
                    group relative flex items-center gap-3 px-4 py-3 rounded-xl
                    cursor-pointer transition-all duration-300
                    ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-600/20 to-purple-600/20 text-[var(--color-text-primary)] font-medium shadow-lg shadow-indigo-500/10"
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-muted)] hover:text-[var(--color-text-primary)] hover:translate-x-1"
                    }
                  `}>
                
                  {/* Top active line */}
                  {isActive && (
                    <span className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent pointer-events-none" />
                  )}

                  {/* Icon */}
                  <item.icon
                    size={19}
                    className={`flex-shrink-0 transition-all duration-300 ${
                      isActive
                        ? "text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]"
                        : "group-hover:text-indigo-400 group-hover:scale-110"
                    } ${isActive ? "scale-110" : ""}`}
                  />

                  {/* Label */}
                  <span className="text-sm">{item.label}</span>

                  {/* Badge */}
                  {item.badge && (
                    <span className="ml-auto inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-gradient-to-br from-pink-500 to-rose-500 rounded-full shadow-md shadow-pink-500/40 animate-pulse">
                      {item.badge}
                    </span>
                  )}

                  {/* Hover glow overlay */}
                  {!isActive && (
                    <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-indigo-600/5 to-purple-600/5 pointer-events-none" />
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ── Footer ───────────────────────────────────── */}
        <div className="mt-auto pt-5 border-t border-[var(--color-border)] space-y-4 sidebar-footer">
          {/* Anonymous Mode badge */}
          <div className="group relative px-4 py-3 rounded-xl bg-linear-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 hover:border-green-500/40 transition-all duration-300 cursor-default">
            <div className="flex items-center gap-2.5">
              {/* Pulsing dot */}
              <div className="relative shrink-0">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-75" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-green-400 leading-tight">
                  Anonymous Mode
                </p>
                <p className="text-[10px] text-green-400/50 leading-tight mt-0.5">
                  Identity protected
                </p>
              </div>

              <Shield className="w-4 h-4 text-green-400/50 group-hover:text-green-400 transition-colors duration-300 flex-shrink-0" />
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 border border-gray-700/50 text-white text-[11px] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              Your identity is end-to-end encrypted
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
            </div>
          </div>

          {/* Version */}
          <p className="text-[10px] text-center text-[var(--color-text-secondary)] opacity-40 tracking-widest uppercase">
            v1.0.0 · beta
          </p>
        </div>
      </div>

      <style jsx>{`
        /* ── Entrance animations ── */
        @keyframes fadeSlideDown {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeSlideRight {
          from {
            opacity: 0;
            transform: translateX(-16px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleBarIn {
          from {
            transform: translateY(-50%) scaleY(0);
          }
          to {
            transform: translateY(-50%) scaleY(1);
          }
        }

        .sidebar-logo {
          animation: fadeSlideDown 0.5s ease-out both;
        }

        .sidebar-nav-item {
          animation: fadeSlideRight 0.45s ease-out both;
        }

        .sidebar-footer {
          animation: fadeSlideUp 0.5s ease-out 0.35s both;
        }

        .active-bar {
          animation: scaleBarIn 0.25s ease-out both;
        }
      `}</style>
    </aside>
  );
}
