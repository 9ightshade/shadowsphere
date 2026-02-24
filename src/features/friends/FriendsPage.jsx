/* eslint-disable no-unused-vars */
// ─── FriendsPage.jsx ──────────────────────────────────────────────────────────
import { useMemo, useState, useEffect } from "react";
import { useFriendsStore } from "../../store/useFriendsStore";
import FriendTabs from "./components/FriendTabs";
import FriendCard from "./components/FriendCard";
import RequestCard from "./components/RequestCard";
import InviteFriendModal from "./components/InviteFriendModal";
import { Users, Shield, UserPlus } from "lucide-react";
import {  ALEO_PROGRAM_NAME } from "../../config/config";
import { useWallet } from "@provablehq/aleo-wallet-adaptor-react";
import { fieldToString, parseAleoStruct } from "../../lib/aleo/index";

export default function FriendsPage() {
  const {
    friends,
    incoming,
    outgoing,
    setFriends,
    setIncoming,
    setOutgoing,
    syncFriendRecords,
    setTab,
    tab,
  } = useFriendsStore();
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const { connected, address, requestRecords, decrypt } = useWallet();
  const PROGRAM_ID = ALEO_PROGRAM_NAME;

  useEffect(() => {
    if (!connected || !address) return;

    const fetchFriendRequests = async () => {
      try {
        const records = await requestRecords(PROGRAM_ID, false);

        // console.log("all records:", records);

        if (!records || records.length === 0) return;

        const incomingList = [];
        const outgoingList = [];
        const friendsList = [];

        const normalize = (a) => a?.replace(".private", "");
        for (const record of records) {
          if (record.functionName !== "add_friend") continue;
          if (record.spent === true) continue;

          // console.log("owner", fieldToString(record.owner));

          const decrypted = await decrypt(record.recordCiphertext);
          if (!decrypted) continue;

          const decryptedStruct = parseAleoStruct(decrypted);

          // console.log("decrypted struct:", decryptedStruct);

          const owner = decryptedStruct.owner;
          const friend = decryptedStruct.to;

          if (!owner || !friend) continue;

          const baseObject = {
            id: record.commitment,
            from: owner,
            to: friend,
            username:
              normalize(owner) === normalize(address)
                ? friend.slice(0, 10)
                : owner.slice(0, 10),
            address: normalize(owner) === normalize(address) ? friend : owner,
            blockHeight: record.blockHeight,
            timestamp: record.blockTimestamp,
            transactionId: record.transactionId?.trim(),
          };

          // console.log("base", baseObject);

          // 🔥 CLASSIFICATION
          if (normalize(owner) === normalize(address)) {
            outgoingList.push(baseObject);
          } else if (normalize(friend) === normalize(address)) {
            incomingList.push(baseObject);
          }
        }

        // 🔒 Deduplicate by commitment
        const dedupe = (arr) =>
          Array.from(new Map(arr.map((r) => [r.id, r])).values());

        setIncoming(dedupe(incomingList));
        setOutgoing(dedupe(outgoingList));
      } catch (err) {
        console.error("Friend record sync failed:", err);
      }
    };

    fetchFriendRequests();
  }, [connected, address]);

  const counts = {
    friends: friends?.length,
    incoming: incoming?.length,
    outgoing: outgoing?.length,
  };

  const currentList =
    tab === "friends" ? friends : tab === "incoming" ? incoming : outgoing;

  return (
    <>
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
            onClick={() => setInviteModalOpen(true)}
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
          {currentList?.length === 0 ? (
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
            currentList?.map((item, i) => (
              <div
                key={item?.id}
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

      <InviteFriendModal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
      />
    </>
  );
}
