/* eslint-disable no-unused-vars */
// ─── ProfilePage.jsx ──────────────────────────────────────────────────────────
import { useAuthStore } from "../../store/useAuthStore";
import ProfileHeader from "./components/ProfileHeader";
import ProfileStats from "./components/ProfileStats";
import ProfileTabs from "./components/ProfileTabs";
import { useState } from "react";
import { FileText, Gift, Shield } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("posts");

  if (!user) return null;

  return (
    <div className="relative flex flex-col gap-6 max-w-2xl profile-root">

      {/* Ambient glows */}
      <div className="absolute -top-16 -right-12 w-72 h-72 bg-indigo-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-48 -left-12 w-64 h-64 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* ── Header card ─────────────────────────── */}
      <div className="profile-section" style={{ animationDelay: "0.05s" }}>
        {/* <ProfileHeader user={user} /> */}
      </div>

      {/* ── Stats ───────────────────────────────── */}
      <div className="profile-section" style={{ animationDelay: "0.10s" }}>
        {/* <ProfileStats /> */}
      </div>

      {/* ── Tabs + content ──────────────────────── */}
      <div className="profile-section" style={{ animationDelay: "0.15s" }}>
        {/* <ProfileTabs active={activeTab} setActive={setActiveTab} /> */}
      </div>

      {/* ── Tab panels ──────────────────────────── */}
      {activeTab === "posts" && (
        <div className="relative p-6 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] hover:border-indigo-500/15 transition-all duration-300 profile-panel">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/25 to-transparent rounded-t-2xl pointer-events-none" />
          <div className="flex flex-col items-center gap-4 py-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 flex items-center justify-center">
              <FileText size={24} className="text-indigo-400/60" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">No posts yet</p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">Posts will appear here once published.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "gifts" && (
        <div className="relative p-6 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] hover:border-purple-500/15 transition-all duration-300 profile-panel">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/25 to-transparent rounded-t-2xl pointer-events-none" />
          <div className="flex flex-col items-center gap-4 py-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/20 flex items-center justify-center">
              <Gift size={24} className="text-purple-400/60" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">No gifts yet</p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">Gift history will appear here.</p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .profile-section {
          animation: fadeSlideUp 0.4s ease-out both;
        }
        .profile-panel {
          animation: fadeIn 0.3s ease-out both;
        }
      `}</style>
    </div>
  );
}
