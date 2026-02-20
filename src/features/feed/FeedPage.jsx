/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import PostCard from "./components/PostCard";
import CreatePostModal from "./components/CreatePostModal";
import {
  Plus,
  Flame,
  TrendingUp,
  Shield,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useWallet } from "@provablehq/aleo-wallet-adaptor-react";
import { usePostStore } from "../../store/usePostStore";
import { fieldToString, parseAleoPost } from "../../lib/aleo/index";
import {
  ALEO_PROGRAM_NAME,
  ALEO_FEE,
  TOKEN_DECIMALS,
  toU128,
  DECIMAL_MULTIPLIER,
} from "../../config/config";
import { usePostSync } from "../../hooks/usePostSync";

const CATEGORIES = ["All", "Whistleblowing", "Finance", "Private Communities"];
const SORT_OPTIONS = [
  { label: "Latest", icon: TrendingUp },
  { label: "Hot", icon: Flame },
];

export default function FeedPage() {
  const [open, setOpen] = useState(false);
  // const {posts, refetch} = usePostSync();
  const [filter, setFilter] = useState(null);
  const [sort, setSort] = useState("Latest");
  const [mounted, setMounted] = useState(false);
  const [maxPostId, setMaxPostId] = useState(1);

  const { connected, address } = useWallet();
  const { ref, inView } = useInView();

  // ✅ Zustand store
  const posts = usePostStore((state) => state.posts);
  const addOrUpdatePost = usePostStore((state) => state.addOrUpdatePost);
  // const posts = usePostStore((state) => state.posts);

  const PROGRAM_ID = ALEO_PROGRAM_NAME;

  const mapCategory = (cat) => {
    switch (Number(cat)) {
      case 1:
        return "Whistleblowing";
      case 2:
        return "Finance";
      case 3:
        return "Private Communities";
      default:
        return "All";
    }
  };

  // const fetchPostsBatch = async (batchSize = 5) => {
  //   let fetchedCount = 0;

  //   for (let i = 0; i < batchSize; i++) {
  //     const postId = maxPostId + i;

  //     const endpoint = `https://testnet.aleoscan.io/testnet/program/${PROGRAM_ID}/mapping/posts/${postId}u32`;

  //     try {
  //       const res = await fetch(endpoint);
  //       if (!res.ok) throw new Error("Not found");

  //       const data = await res.json();

  //       // console.log("res post", data);

  //       const formattedPost = parseAleoPost(data);

  //       if (formattedPost) {
  //         addOrUpdatePost(formattedPost);
  //         // console.log("Stored post:", formattedPost);
  //         fetchedCount++;
  //       }
  //       addOrUpdatePost(formattedPost);

  //       // console.log("Stored post:", formattedPost);

  //       fetchedCount++;
  //     } catch (err) {
  //       console.warn(`Skipping post ${postId}`);
  //     }
  //   }

  //   // Move pointer forward only by successful fetches
  //   if (fetchedCount > 0) {
  //     setMaxPostId((prev) => prev + fetchedCount);
  //   }
  // };
  const fetchPostsBatch = async (batchSize = 5) => {
    const { posts, setPosts } = usePostStore.getState();

    let newPosts = [];
    let fetchedCount = 0;

    for (let i = 0; i < batchSize; i++) {
      const postId = maxPostId + i;

      const endpoint = `https://testnet.aleoscan.io/testnet/program/${PROGRAM_ID}/mapping/posts/${postId}u32`;

      try {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error("Not found");

        const data = await res.json();
        const formattedPost = parseAleoPost(data);

        if (formattedPost) {
          newPosts.push(formattedPost);
          fetchedCount++;
        }
      } catch {
        console.warn(`Skipping post ${postId}`);
      }
    }

    if (newPosts.length > 0) {
      // Merge + deduplicate by id
      const merged = [...posts];

      newPosts.forEach((incoming) => {
        const index = merged.findIndex((p) => p.id === incoming.id);

        if (index > -1) {
          merged[index] = { ...merged[index], ...incoming };
        } else {
          merged.push(incoming);
        }
      });

      setPosts(merged);
    }

    if (fetchedCount > 0) {
      setMaxPostId((prev) => prev + fetchedCount);
    }

    // ✅ Log FULL Zustand array AFTER commit
    console.log("Full posts array in Zustand:", usePostStore.getState().posts);
  };
  // Initial fetch
  useEffect(() => {
    fetchPostsBatch(5);
  }, []);

  // Infinite scroll trigger
  useEffect(() => {
    if (inView) {
      fetchPostsBatch(7);
    }
  }, [inView]);
  useEffect(() => {
    console.log("Posts ready to map:", posts);
  }, [posts]);

  const filtered = posts.filter((p) => !filter || p.category === filter);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    console.log("Connected:", connected, address);
  }, [connected, address]);
  return (
    <div className="relative flex flex-col gap-6 feed-root">
      {/* ── Toolbar ──────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 flex-wrap feed-toolbar">
        {/* Category filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {CATEGORIES.map((c) => {
            const active = c === "All" ? filter === null : filter === c;
            return (
              <button
                key={c}
                onClick={() => setFilter(c === "All" ? null : c)}
                className={`
                  relative px-4 py-1.5 text-xs font-semibold rounded-full
                  transition-all duration-300 active:scale-95
                  ${
                    active
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30"
                      : "bg-[var(--color-muted)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-indigo-500/30 border border-transparent hover:bg-indigo-500/10"
                  }
                `}>
                {active && (
                  <span className="absolute inset-0 rounded-full bg-white/10 pointer-events-none" />
                )}
                {c}
              </button>
            );
          })}
        </div>

        {/* Sort + filter controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)]">
            {SORT_OPTIONS.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setSort(label)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                  transition-all duration-300 active:scale-95
                  ${
                    sort === label
                      ? "bg-gradient-to-r from-indigo-600/30 to-purple-600/30 text-indigo-300 shadow-sm"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  }
                `}>
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>

          <button className="group p-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)] hover:border-indigo-500/30 hover:bg-indigo-500/10 active:scale-95 transition-all duration-300">
            <SlidersHorizontal
              size={15}
              className="text-[var(--color-text-secondary)] group-hover:text-indigo-400 transition-colors duration-300"
            />
          </button>
        </div>
      </div>

      {/* ── Feed stats strip ─────────────────────────── */}
      <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-500/10 feed-stats">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-[var(--color-text-secondary)]">
            <span className="font-semibold text-[var(--color-text-primary)]">
              {filtered.length}
            </span>{" "}
            posts
          </span>
        </div>
        <div className="w-px h-4 bg-[var(--color-border)]" />
        <div className="flex items-center gap-1.5">
          <Shield size={12} className="text-indigo-400" />
          <span className="text-xs text-[var(--color-text-secondary)]">
            Zero-knowledge verified
          </span>
        </div>
        {filter && (
          <>
            <div className="w-px h-4 bg-[var(--color-border)]" />
            <span className="text-xs text-indigo-400 font-medium">
              #{filter}
            </span>
          </>
        )}
      </div>

      {/* ── Post list ────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        {filtered.length > 0 ? (
          filtered.map((post, i) => (
            <div
              key={post.id}
              className="post-card-wrapper"
              style={{ animationDelay: `${i * 80}ms` }}>
              <PostCard post={post} />
            </div>
          ))
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 gap-4 feed-empty">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 flex items-center justify-center">
              <Shield size={28} className="text-indigo-400 opacity-60" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                No posts found
              </p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                Try a different filter or be the first to post.
              </p>
            </div>
            <button
              onClick={() => setOpen(true)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30 hover:from-indigo-500 hover:to-purple-500 active:scale-95 transition-all duration-300">
              Create a post
            </button>
          </div>
        )}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={ref} className="h-4" />

      {/* ── FAB ──────────────────────────────────────── */}
      <button
        onClick={() => setOpen(true)}
        className="group fixed bottom-8 right-8 z-50
          w-14 h-14 rounded-2xl
          bg-gradient-to-br from-indigo-600 to-purple-600
          hover:from-indigo-500 hover:to-purple-500
          active:scale-95 hover:scale-105
          shadow-xl shadow-indigo-500/40 hover:shadow-indigo-500/60
          transition-all duration-300
          flex items-center justify-center
          fab-btn"
        aria-label="Create post">
        {/* Ping ring */}
        <span className="absolute inset-0 rounded-2xl bg-indigo-500/30 animate-ping opacity-60 pointer-events-none" />
        <Plus
          size={22}
          className="text-white relative z-10 transition-transform duration-300 group-hover:rotate-90"
        />
      </button>

      <CreatePostModal open={open} onClose={() => setOpen(false)} />

      <style jsx>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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
        @keyframes fabIn {
          from {
            opacity: 0;
            transform: scale(0.6) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .feed-toolbar {
          animation: fadeSlideUp 0.4s ease-out both;
        }
        .feed-stats {
          animation: fadeSlideUp 0.4s ease-out 0.08s both;
        }
        .post-card-wrapper {
          animation: fadeSlideUp 0.45s ease-out both;
        }
        .feed-empty {
          animation: fadeIn 0.5s ease-out both;
        }
        .fab-btn {
          animation: fabIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both;
        }
      `}</style>
    </div>
  );
}
