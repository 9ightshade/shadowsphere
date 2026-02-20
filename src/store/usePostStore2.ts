import { create } from "zustand";

// 1. Define what a Post looks like
interface Post {
  id: string;
  author: string;
  alias: string;
  content: string;
  category: string;
  likes: number;
  comments: number;
  timestamp: string;
  [key: string]: any; // Allows for random random fields like 'reputation'
}

// 2. Define the Store's shape
interface PostState {
  posts: Post[];
  isSyncing: boolean;
  error: string | null;
  maxPostId: number;
  addPosts: (newPosts: Post[]) => void;
  setSyncing: (status: boolean) => void;
  resetPosts: () => void;
}

// 3. Apply the interface to the create function
const usePostStore = create<PostState>()((set) => ({
  posts: [],
  isSyncing: false,
  error: null,
  maxPostId: 0,

  addPosts: (newPosts) =>
    set((state) => {
      const existingIds = new Set(state.posts.map((p) => p.id));
      const uniqueNewPosts = newPosts.filter((p) => !existingIds.has(p.id));
      return {
        posts: [...state.posts, ...uniqueNewPosts],
        // Update maxPostId based on the highest ID currently in the store
        maxPostId: Math.max(
          state.maxPostId,
          ...uniqueNewPosts.map((p) => Number(p.id) || 0),
        ),
      };
    }),

  setSyncing: (status) => set({ isSyncing: status }),

  resetPosts: () => set({ posts: [], maxPostId: 0 }),
}));

export default usePostStore;
