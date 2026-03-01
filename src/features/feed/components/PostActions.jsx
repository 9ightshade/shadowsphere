/* eslint-disable no-unused-vars */
import { Heart, MessageCircle, Gift } from "lucide-react";
import { useState, useEffect } from "react";
import GiftModal from "./GiftModal";
import { useWallet } from "@provablehq/aleo-wallet-adaptor-react";
import { usePostStore } from "../../../store/usePostStore";
import CommentModal from "./CommentModal";
import { ALEO_PROGRAM_NAME, ALEO_FEE } from "../../../config/config";
export default function PostActions({
  postId,
  likes,
  comments,
  recipientAlias,
}) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(likes);

  const [loading, setLoading] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const { executeTransaction, transactionStatus } = useWallet();
  const incrementLikes = usePostStore((state) => state.incrementLikes);

  const [commentOpen, setCommentOpen] = useState(false);
  const { refreshPostById } = usePostStore();

  console.log("likes", likes);

  useEffect(() => {
    setCount(likes);
  }, [likes]);

  const handleLike = async () => {
    if (liked || loading) return;

    try {
      setLoading(true);

      const formattedInput = `${postId}u32`;

      console.log("Submitting like TX:", formattedInput);

      const result = await executeTransaction({
        program: ALEO_PROGRAM_NAME,
        function: "like_post",
        inputs: [formattedInput],
        fee: 100000,
        privateFee: false,
      });

      const txId = result.transactionId;
      console.log("TX Submitted:", txId);

      let attempts = 0;
      const maxAttempts = 20;

      while (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const status = await transactionStatus(txId);
        console.log("Polling status:", status.status);

        if (status.status === "Accepted") {
          console.log("Like confirmed on-chain ✅");
          await refreshPostById(postId);
          setLiked(true);
          return;
        }

        if (status.status === "Rejected") {
          throw new Error("Transaction rejected");
        }

        attempts++;
      }

      throw new Error("Transaction confirmation timeout");
    } catch (err) {
      console.error("Like failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-6 text-[var(--color-text-secondary)] text-sm pt-3">
        <button
          onClick={handleLike}
          disabled={loading}
          className={`flex items-center gap-2 transition transform ${
            liked || count > 0
              ? "text-[var(--color-primary)]"
              : "hover:text-[var(--color-primary)]"
          } ${liked ? "scale-110" : ""}`}>
          <Heart size={16} fill={liked ? "currentColor" : "none"} />

          {count > 0 && <span className="tabular-nums">{count}</span>}
        </button>

        <button
          onClick={() => setCommentOpen(true)}
          className="flex items-center gap-2 hover:text-[var(--color-primary)] transition">
          <MessageCircle size={16} />
          {comments}
        </button>
        {/* <button
          onClick={() => setGiftOpen(true)}
          className="flex items-center gap-2 hover:text-[var(--color-primary)] transition">
          <Gift size={16} />
          Gift
        </button> */}
      </div>
      <GiftModal
        open={giftOpen}
        onClose={() => setGiftOpen(false)}
        recipientAlias={recipientAlias}
      />
      <CommentModal
        open={commentOpen}
        onClose={() => setCommentOpen(false)}
        postId={postId}
        recipientAlias={recipientAlias}
      />
    </div>
  );
}
