// filepath: src/models/friend.ts
export interface FriendUser {
  id: string;
  alias?: string;
  username: string;
  from?: {
    alias?: string;
  };
  address: string;
  blockHeight: number;
  isOnline: boolean;
  timestamp: number;
  transactionId: string;
}
