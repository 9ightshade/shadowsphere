// ─── FriendsPage.jsx ──────────────────────────────────────────────────────────
import { useMemo } from "react";
import { useFriendsStore } from "../../store/useFriendsStore";
import FriendTabs from "./components/FriendTabs";
import FriendCard from "./components/FriendCard";
import RequestCard from "./components/RequestCard";
import { Users, Shield, UserPlus } from "lucide-react";

export default function FriendsPage() {
  const store = useFriendsStore();
  const tab = store?.tab ?? "friends";

  const mockFriends = useMemo(
    () => [
      {
        id: "1",
        name: "Alex Johnson",
        from: { alias: "Alex Johnson" },
        username: "alexj",
        avatar: "https://i.pravatar.cc/150?img=1",
        isOnline: true,
      },
      {
        id: "2",
        name: "Sarah Kim",
        from: { alias: "Sarah Kim" },
        username: "sarahk",
        avatar: "https://i.pravatar.cc/150?img=2",
        isOnline: false,
      },
    ],
    [],
  );

  const mockIncoming = useMemo(
    () => [
      {
        id: "3",
        from: { alias: "Daniel Reed" },
        username: "danielr",
        avatar: "https://i.pravatar.cc/150?img=3",
      },
    ],
    [],
  );

  const mockOutgoing = useMemo(
    () => [
      {
        id: "4",
        from: { alias: "Emily Stone" },
        username: "emilys",
        avatar: "https://i.pravatar.cc/150?img=4",
      },
    ],
    [],
  );

  const friends = store?.friends?.length ? store.friends : mockFriends;
  const incoming = store?.incoming?.length ? store.incoming : mockIncoming;
  const outgoing = store?.outgoing?.length ? store.outgoing : mockOutgoing;

  const counts = {
    friends: friends.length,
    incoming: incoming.length,
    outgoing: outgoing.length,
  };

  const currentList =
    tab === "friends" ? friends : tab === "incoming" ? incoming : outgoing;

  return (
    <div className="relative flex flex-col gap-7 max-w-2xl friends-root">
      {/* Ambient glows */}
      <div className="absolute -top-16 -right-12 w-72 h-72 bg-indigo-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 -left-12 w-64 h-64 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* ── Header ──────────────────────────────── */}
      <div className="flex items-center justify-between friends-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Users size={19} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight leading-tight">
              Friends
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1 mt-0.5">
              <Shield size={10} className="text-indigo-400" />
              Private social graph
            </p>
          </div>
        </div>

        {/* Invite button */}
        <button
          className="group flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white
          bg-gradient-to-r from-indigo-600 to-purple-600
          hover:from-indigo-500 hover:to-purple-500
          shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40
          active:scale-95 transition-all duration-300 relative overflow-hidden">
          <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
          <UserPlus
            size={15}
            className="relative z-10 group-hover:scale-110 transition-transform duration-300"
          />
          <span className="relative z-10">Invite</span>
        </button>
      </div>

      {/* ── Tabs ────────────────────────────────── */}
      <div className="friends-tabs">
        <FriendTabs counts={counts} />
      </div>

      {/* ── List ────────────────────────────────── */}
      <div className="flex flex-col gap-3 friends-list">
        {currentList.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 friends-empty">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 flex items-center justify-center">
              <Users size={24} className="text-indigo-400/50" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                {tab === "friends"
                  ? "No friends yet"
                  : tab === "incoming"
                    ? "No incoming requests"
                    : "No outgoing requests"}
              </p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                {tab === "friends"
                  ? "Invite someone to connect."
                  : "Check back later."}
              </p>
            </div>
          </div>
        ) : (
          currentList.map((item, i) => (
            <div
              key={item.id}
              className="friend-item"
              style={{ animationDelay: `${i * 60}ms` }}>
              {tab === "friends" ? (
                <FriendCard user={item} />
              ) : (
                <RequestCard request={item} type={tab} />
              )}
            </div>
          ))
        )}
      </div>

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
        @keyframes fadeSlideRight {
          from {
            opacity: 0;
            transform: translateX(-12px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .friends-header {
          animation: fadeSlideUp 0.4s ease-out 0.05s both;
        }
        .friends-tabs {
          animation: fadeSlideUp 0.4s ease-out 0.1s both;
        }
        .friends-list {
          animation: fadeSlideUp 0.4s ease-out 0.15s both;
        }
        .friends-empty {
          animation: fadeIn 0.4s ease-out both;
        }
        .friend-item {
          animation: fadeSlideRight 0.35s ease-out both;
        }
      `}</style>
    </div>
  );
}
