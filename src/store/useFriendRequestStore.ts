// store/useFriendRequestStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface FriendRequest {
  id: string;
  sender: string;
  blockHeight: number;
  timestamp: number;
  transactionId: string;
}

interface FriendRequestState {
  requests: FriendRequest[];
  setRequests: (r: FriendRequest[]) => void;
  addOrUpdateRequest: (r: FriendRequest) => void;
  clearRequests: () => void;
}

export const useFriendRequestStore = create<FriendRequestState>()(
  persist(
    (set) => ({
      requests: [],

      setRequests: (requests) =>
        set({
          requests: requests.filter((r): r is FriendRequest => r !== null),
        }),

      addOrUpdateRequest: (request) => {
        if (!request) return;

        set((state) => {
          const safe = state.requests.filter(
            (r): r is FriendRequest => r !== null,
          );

          const index = safe.findIndex((r) => r.id === request.id);

          if (index > -1) {
            const updated = [...safe];
            updated[index] = {
              ...updated[index],
              ...request,
            };
            return { requests: updated };
          }

          return { requests: [...safe, request] };
        });
      },

      clearRequests: () => set({ requests: [] }),
    }),
    { name: "friend-request-storage" },
  ),
);
