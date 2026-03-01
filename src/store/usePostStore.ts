import { create } from "zustand";
import { persist } from "zustand/middleware";
import { parseAleoPost } from "../lib/aleo/index";
import { ALEO_PROGRAM_NAME } from "../config/config";

export interface Post {
  id: number;
  alias: string;
  reputation: number;
  verified: boolean;
  category: string;
  content: string;
  encrypted: boolean;
  likes: number;
  comments: number;
  timestamp: string;
}

interface PostState {
  posts: Post[];
  maxPostId: number;

  addOrUpdatePost: (post: Post) => void;
  incrementLikes: (postId: string) => void;
  incrementComments: (postId: string) => void;

  setPosts: (posts: Post[]) => void;
  clearPosts: () => void;

  // 🔥 New blockchain sync methods
  fetchPostsBatch: (batchSize: number) => Promise<void>;
  refreshPostById: (postId: number) => Promise<void>;
}

export const usePostStore = create<PostState>()(
  persist(
    (set, get) => ({
      posts: [],
      maxPostId: 1,

      addOrUpdatePost: (post) => {
        if (!post) return;
        set((state) => {
          const safePosts = state.posts.filter((p): p is Post => p !== null);

          const index = safePosts.findIndex((p) => p.id === post.id);

          if (index > -1) {
            const updatedPosts = [...state.posts];
            updatedPosts[index] = { ...updatedPosts[index], ...post };
            return { posts: updatedPosts };
          }

          return { posts: [...state.posts, post] };
        });
      },

      incrementLikes: (postId) => {
        set((state) => ({
          posts: state.posts
            .filter((p): p is Post => p !== null)
            .map((post) =>
              post.id === Number(postId) ? { ...post, likes: post.likes + 1 } : post,
            ),
        }));
      },

      incrementComments: (postId) => {
        set((state) => ({
          posts: state.posts
            .filter((p): p is Post => p !== null)
            .map((post) =>
              post.id === Number(postId)
                ? { ...post, comments: post.comments + 1 }
                : post,
            ),
        }));
      },
      setPosts: (posts) => set({ posts }),

      clearPosts: () => set({ posts: [], maxPostId: 1 }),

      // 🔥 Fetch next batch from Aleo mapping
      fetchPostsBatch: async (batchSize: number) => {
        const { maxPostId } = get();
        let fetchedCount = 0;

        for (let i = 0; i < batchSize; i++) {
          const postId = maxPostId + i;

          const endpoint = `https://testnet.aleoscan.io/testnet/program/${ALEO_PROGRAM_NAME}/mapping/posts/${postId}u32`;

          try {
            const res = await fetch(endpoint);
            if (!res.ok) continue;

            const data = await res.json();
            if (!data) continue;

            const formatted = parseAleoPost(data, postId);
            if (!formatted?.id) continue;

            get().addOrUpdatePost(formatted);
            fetchedCount++;
          } catch (err) {
            console.warn(`Skipping post ${postId}`);
          }
        }

        if (fetchedCount > 0) {
          set((state) => ({
            maxPostId: state.maxPostId + fetchedCount,
          }));
        }
      },

      // 🔥 Refresh a single post (use after like/comment/create)
      refreshPostById: async (postId: number) => {
        const endpoint = `https://testnet.aleoscan.io/testnet/program/${ALEO_PROGRAM_NAME}/mapping/posts/${postId}u32`;

        try {
          const res = await fetch(endpoint);
          if (!res.ok) return;

          const data = await res.json();
          if (!data) return;

          const formatted = parseAleoPost(data, postId);
          if (!formatted?.id) return;

          get().addOrUpdatePost(formatted);
        } catch (err) {
          console.error("Failed to refresh post", err);
        }
      },
    }),
    {
      name: "shadowsphere-post-storage",
      partialize: (state) => ({
        posts: state.posts,
        maxPostId: state.maxPostId,
      }),
    },
  ),
);
