import { create } from "zustand";
import { FriendUser } from "../features/friends/types";
import { useWallet } from "@provablehq/aleo-wallet-adaptor-react";
import { ALEO_FEE, ALEO_PROGRAM_NAME } from "../config/config";
import { parseAleoStruct } from "../lib/aleo/index";
interface FriendsState {
  friends: FriendUser[];
  blocked: FriendUser[];
  tab: "friends" | "blocked";

  setTab: (tab: FriendsState["tab"]) => void;

  setFriends: (friends: FriendUser[]) => void;
  setBlocked: (requests: FriendUser[]) => void;
  blockFriendLocally: (address: string) => void;

  // syncFriendRecords: () => Promise<void>;
  syncFriendRecords: (wallet: {
    connected: boolean;
    address?: string;
    requestRecords: any;
    decrypt: any;
  }) => Promise<void>;
}

export const useFriendsStore = create<FriendsState>((set, get) => ({
  friends: [],
  blocked: [],
  tab: "friends",

  setTab: (tab) => set({ tab }),

  setFriends: (friends) => set({ friends }),
  setBlocked: (blocked) => set({ blocked }),

  blockFriendLocally: (address) =>
    set((state) => {
      const friend = state.friends.find((f) => f.address === address);

      if (!friend) return state;

      return {
        friends: state.friends.filter((f) => f.address !== address),
        blocked: [...state.blocked, friend],
      };
    }),

  // 🔥 Sync from Aleo on-chain records
  syncFriendRecords: async (wallet) => {
    try {
      const { connected, address, requestRecords, decrypt } = wallet;

      if (!connected || !address) return;

      const records = await requestRecords(ALEO_PROGRAM_NAME, false);
      if (!records?.length) return;

      const friendsList: FriendUser[] = [];
      const blockedList: FriendUser[] = [];

      for (const record of records as any[]) {
        if (record.spent) continue;

        const decrypted = parseAleoStruct(
          await decrypt(record.recordCiphertext),
        ) as any;

        if (!decrypted) continue;

        const owner = decrypted.owner;
        const to = decrypted.to;
        const status = Number(decrypted.status ?? 0);

        if (!owner || !to) continue;

        const counterparty = owner === address ? to : owner;

        const baseObject: FriendUser = {
          id: record.commitment,
          alias: `aleo...${counterparty.slice(-6)}`,
          address: counterparty,
          username: counterparty.slice(0, 10),
          from: {
            alias: `aleo...${counterparty.slice(-6)}`,
          },
          blockHeight: record.blockHeight,
          isOnline: false,
          timestamp: record.blockTimestamp,
          transactionId: record.transactionId?.trim(),
        };

        // 🔥 differentiate by function name
        if (record.functionName === "add_friend") {
          if (status === 1) {
            friendsList.push(baseObject);
          }
        }

        if (record.functionName === "block_user") {
          blockedList.push(baseObject);
        }
      }

      const dedupe = (arr: FriendUser[]) =>
        Array.from(new Map(arr.map((r) => [r.address, r])).values());

      set({
        friends: dedupe(friendsList),
        blocked: dedupe(blockedList),
      });
    } catch (err) {
      console.error("Failed to sync friend records:", err);
    }
  },
}));
