// ─── ProfileHeader.jsx ────────────────────────────────────────────────────────
import { useAuthStore } from "../../../store/useAuthStore";
import { useFriendsStore } from "../../../store/useFriendsStore";
import { UserPlus, UserMinus, Shield, Edit3, BadgeCheck } from "lucide-react";
import { useState } from "react";

export default function ProfileHeader({ user }) {
  const { user: currentUser } = useAuthStore();
  const { friends, addFriend, removeFriend } = useFriendsStore();
  const [loading, setLoading] = useState(false);

  const isOwner = currentUser?.id === user.id;
  const isFriend = friends.some((f) => f.id === user.id);

  const alias = user.alias ?? user.name ?? "Anonymous";
  const initials = alias
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleToggle = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    isFriend ? removeFriend(user.id) : addFriend({ id: user.id, alias });
    setLoading(false);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden bg-[var(--color-surface-2)] border border-[var(--color-border)] hover:border-indigo-500/20 transition-all duration-300">
      {/* Banner gradient */}
      <div className="h-24 bg-gradient-to-br from-indigo-600/30 via-purple-600/20 to-[var(--color-surface-2)] relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent pointer-events-none" />
        {/* Decorative orb */}
        <div className="absolute top-2 right-6 w-16 h-16 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      <div className="px-6 pb-6">
        {/* Avatar row — overlaps banner */}
        <div className="flex items-end justify-between -mt-10 mb-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl border-4 border-[var(--color-surface-2)] overflow-hidden shadow-xl shadow-black/40">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={alias}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-xl font-bold text-white">
                  {initials}
                </div>
              )}
            </div>
            {/* Online dot */}
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[var(--color-surface-2)] shadow-md shadow-green-500/40" />
          </div>

          {/* Action buttons */}
          <div className="mb-1">
            {isOwner ? (
              <button
                className="group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                border border-[var(--color-border)] text-[var(--color-text-secondary)]
                hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-300
                active:scale-95 transition-all duration-300">
                <Edit3
                  size={14}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleToggle}
                disabled={loading}
                className={`
                  group relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                  active:scale-95 transition-all duration-300 overflow-hidden
                  ${
                    isFriend
                      ? "border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/50"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-500/30 hover:shadow-indigo-500/50"
                  }
                  ${loading ? "opacity-60 pointer-events-none" : ""}
                `}>
                {!isFriend && (
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                )}
                {loading ? (
                  <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                ) : isFriend ? (
                  <UserMinus
                    size={14}
                    className="group-hover:scale-110 transition-transform"
                  />
                ) : (
                  <UserPlus
                    size={14}
                    className="relative z-10 group-hover:scale-110 transition-transform"
                  />
                )}
                <span className="relative z-10">
                  {loading ? "..." : isFriend ? "Remove" : "Add Friend"}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Name + bio */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)] leading-tight">
              {alias}
            </h2>
            {user.verified && (
              <BadgeCheck
                size={17}
                className="text-indigo-400 drop-shadow-[0_0_6px_rgba(99,102,241,0.5)]"
              />
            )}
          </div>

          {user.username && (
            <p className="text-xs text-[var(--color-text-secondary)]">
              @{user.username}
            </p>
          )}

          {user.bio && (
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mt-2 max-w-md">
              {user.bio}
            </p>
          )}

          {/* Privacy badge */}
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-[var(--color-border)]">
            <Shield size={11} className="text-green-400" />
            <span className="text-[10px] text-green-400/80 font-medium">
              Anonymous identity · ZK-verified
            </span>
            <div className="ml-1 w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
