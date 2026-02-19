/* eslint-disable no-unused-vars */
import { Heart, MessageCircle, Gift } from "lucide-react";
import { useState } from "react";
import GiftModal from "./GiftModal";
import { useWallet } from "@provablehq/aleo-wallet-adaptor-react";
import { usePostStore } from "../../../store/usePostStore";

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
  const handleLike = async () => {
    if (liked || loading) return;

    try {
      setLoading(true);

      const formattedInput = `${postId}u32`;

      console.log("Submitting like TX:", formattedInput);

      const result = await executeTransaction({
        program: "shadowsphere_social9.aleo",
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

          setLiked(true);
          incrementLikes(postId); 
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
    <div className="flex items-center gap-6 text-[var(--color-text-secondary)] text-sm pt-3">
      <button
        onClick={handleLike}
        className={`flex items-center gap-2 transition transform ${
          liked ? "text-[var(--color-primary)] scale-110" : ""
        }`}>
        <Heart size={16} fill={liked ? "currentColor" : "none"} />
        {count}
      </button>

      <button className="flex items-center gap-2 hover:text-[var(--color-primary)] transition">
        <MessageCircle size={16} />
        {comments}
      </button>
      <button
        onClick={() => setGiftOpen(true)}
        className="flex items-center gap-2 hover:text-[var(--color-primary)] transition">
        <Gift size={16} />
        Gift
      </button>

      <GiftModal
        open={giftOpen}
        onClose={() => setGiftOpen(false)}
        recipientAlias={recipientAlias}
      />
    </div>
  );
}
