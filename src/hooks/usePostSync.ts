// src/hooks/usePostSync.js
import { useCallback } from "react";
import usePostStore from "../store/usePostStore2";
import { ALEO_PROGRAM_NAME } from "../config/config";
import { parseAleoPost } from "../lib/aleo";

export const usePostSync = () => {
  const { posts, isSyncing, addPosts, setSyncing } = usePostStore();

  const syncPosts = useCallback(async () => {
    if (isSyncing) return;

    setSyncing(true);
    let currentId = posts.length; // Start from where we left off
    let batch = [];
    let stopFetching = false;

    console.log(`🔄 Syncing posts starting from ID: ${currentId}`);

    while (!stopFetching) {
      const endpoint = `https://testnet.aleoscan.io/testnet/program/${ALEO_PROGRAM_NAME}/mapping/posts/${currentId}u32`;

      try {
        const res = await fetch(endpoint);

        // If we hit a 404, we've reached the end of the mapping
        if (!res.ok) {
          stopFetching = true;
          break;
        }

        const data = await res.json();
        const formatted = parseAleoPost(data, currentId);

        if (formatted) {
          batch.push(formatted);
        }

        // Periodically update store so UI doesn't hang for huge datasets
        if (batch.length >= 5) {
          addPosts(batch);
          batch = [];
        }

        currentId++;
      } catch (err) {
        console.warn("🏁 End of posts reached or Network error.");
        stopFetching = true;
      }
    }

    // Add remaining posts in the last batch
    if (batch.length > 0) addPosts(batch);

    setSyncing(false);
    console.log("✅ Sync Complete.");
  }, [posts.length, isSyncing, addPosts, setSyncing]);

  return {
    posts,
    isSyncing,
    refetch: syncPosts,
  };
};
