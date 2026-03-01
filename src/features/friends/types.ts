// filepath: src/models/friend.ts
export interface FriendUser {
  id: string;
  alias: string;
  username: string;
  address: string;
  blockHeight: number;
  isOnline: boolean;
  timestamp: number;
  transactionId: string;
}
