import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Post {
  id: string;
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
  addPost: (post: Post) => void;
  setPosts: (posts: Post[]) => void;
  incrementLikes: (postId: string) => void;
  clearPosts: () => void;
}

export const usePostStore = create<PostState>()(
  persist(
    (set, get) => ({
      posts: [],
      incrementLikes: (postId: string) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId ? { ...post, likes: post.likes + 1 } : post,
          ),
        })),

      addPost: (post) =>
        set((state) => {
          // Avoid duplicates by id
          const exists = state.posts.some((p) => p.id === post.id);
          if (exists) return state;

          return { posts: [...state.posts, post] };
        }),

      setPosts: (posts) => set({ posts }),

      clearPosts: () => set({ posts: [] }),
    }),
    {
      name: "shadowsphere-post-storage",
    },
  ),
);
