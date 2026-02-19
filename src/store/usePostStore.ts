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

  // Adds a new post or updates existing one
  addOrUpdatePost: (post: Post) => void;

  // Increment likes for a specific post
  incrementLikes: (postId: string) => void;

  // Increment comments count for a specific post
  incrementComments: (postId: string) => void;

  // Replace all posts (useful for batch fetches)
  setPosts: (posts: Post[]) => void;

  // Clear all posts from store
  clearPosts: () => void;
}

export const usePostStore = create<PostState>()(
  persist(
    (set, get) => ({
      posts: [],

      addOrUpdatePost: (post) => {
        set((state) => {
          const index = state.posts.findIndex((p) => p.id === post.id);

          if (index > -1) {
            // Merge updates with existing post
            const updatedPosts = [...state.posts];
            updatedPosts[index] = { ...updatedPosts[index], ...post };
            return { posts: updatedPosts };
          }

          // Add new post if it doesn't exist
          return { posts: [...state.posts, post] };
        });
      },

      incrementLikes: (postId) => {
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId ? { ...post, likes: post.likes + 1 } : post,
          ),
        }));
      },

      incrementComments: (postId) => {
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId
              ? { ...post, comments: post.comments + 1 }
              : post,
          ),
        }));
      },

      setPosts: (posts) => set({ posts }),

      clearPosts: () => set({ posts: [] }),
    }),
    {
      name: "shadowsphere-post-storage",
      // getStorage: () => localStorage, // persist to localStorage
    },
  ),
);
