import { create } from "zustand";
import { FriendUser, FriendRequest } from "../features/friends/types";
import { useWallet } from "@provablehq/aleo-wallet-adaptor-react";
import { ALEO_FEE, ALEO_PROGRAM_NAME } from "../config/config";
import { parseAleoStruct } from "../lib/aleo/index";
interface FriendsState {
  friends: FriendUser[];
  incoming: FriendRequest[];
  outgoing: FriendRequest[];
  tab: "friends" | "incoming" | "outgoing";

  setTab: (tab: FriendsState["tab"]) => void;

  setFriends: (friends: FriendUser[]) => void;
  setIncoming: (requests: FriendRequest[]) => void;
  setOutgoing: (requests: FriendRequest[]) => void;

  syncFriendRecords: () => Promise<void>;
}

export const useFriendsStore = create<FriendsState>((set, get) => ({
  friends: [],
  incoming: [],
  outgoing: [],
  tab: "friends",

  setTab: (tab) => set({ tab }),

  setFriends: (friends) => set({ friends }),
  setIncoming: (incoming) => set({ incoming }),
  setOutgoing: (outgoing) => set({ outgoing }),

  // 🔥 Sync from Aleo on-chain records
  syncFriendRecords: async () => {
    try {
      // Access wallet
      const wallet = useWallet();
      const { connected, address, requestRecords, decrypt } = wallet;

      if (!connected || !address) return;

      const PROGRAM_ID = ALEO_PROGRAM_NAME;

      const records = await requestRecords(PROGRAM_ID, false);

      console.log("friends records", records);

      if (!records?.length) return;

      const incomingList: FriendRequest[] = [];
      const outgoingList: FriendRequest[] = [];
      const friendsList: FriendUser[] = [];

      for (const record of records) {
        if (record.functionName !== "add_friend") continue;
        if (record.spent) continue;

        const decrypted = parseAleoStruct(
          await decrypt(record.recordCiphertext),
        );
        if (!decrypted) continue;

        const owner = decrypted.owner;
        const friend = decrypted.to;
        const status = Number(decrypted.status ?? 0);

        if (!owner || !friend) continue;

        const baseObject = {
          id: record.commitment,
          from: {
            alias:
              owner === address
                ? `aleo...${friend.slice(-6)}`
                : `aleo...${owner.slice(-6)}`,
          },
          username:
            owner === address ? friend.slice(0, 10) : owner.slice(0, 10),
          address: owner === address ? friend : owner,
          blockHeight: record.blockHeight,
          timestamp: record.blockTimestamp,
          transactionId: record.transactionId?.trim(),
        };

        if (status === 1) {
          // Accepted friend
          friendsList.push({ ...baseObject, isOnline: false });
        } else {
          // Pending
          if (owner === address) {
            // You sent request
            outgoingList.push(baseObject);
          } else {
            // Someone sent you request
            incomingList.push(baseObject);
          }
        }
      }

      // Deduplicate
      const dedupe = (arr) =>
        Array.from(new Map(arr.map((r) => [r.id, r])).values());

      set({
        friends: dedupe(friendsList),
        incoming: dedupe(incomingList),
        outgoing: dedupe(outgoingList),
      });
    } catch (err) {
      console.error("Failed to sync friend records:", err);
    }
  },
}));
