// utils/parseAleoPost.ts
import { fieldToString } from "../../lib/aleo/index";

export function parseAleoPost(data: any, fallbackId?: number | string) {
  if (!data) return null;

  // Use the ID from data, if missing use the fallbackId from the loop
  const rawPostId = data.post_id
    ? String(data.post_id).replace("u32", "")
    : null;
  const id = rawPostId ?? String(fallbackId) ?? "0";

  const author = data.author ? String(data.author) : "anon";

  // Clean 'field' suffix before converting
  const contentHash = data.content_hash
    ? String(data.content_hash).replace("field", "")
    : null;

  return {
    id,
    author, // Keeping raw author for logic
    alias: "aleo..." + author.slice(-6),
    reputation: Math.floor(Math.random() * 200), // Fallback/Placeholder
    verified: true,
    category:
      data.category != null
        ? (() => {
            const cat = Number(data.category.toString().replace("u8", ""));
            switch (cat) {
              case 1:
                return "Whistleblowing";
              case 2:
                return "Finance";
              case 3:
                return "Private Communities";
              default:
                return "All";
            }
          })()
        : "All",
    // Convert the field back to a readable string
    content: contentHash ? fieldToString(contentHash) : "No content",
    encrypted: Boolean(data.encrypted),
    likes: data.likes ? Number(String(data.likes).replace("u32", "")) : 0,
    comments: data.comments
      ? Number(String(data.comments).replace("u32", ""))
      : 0,
    timestamp: data.timestamp
      ? `${Number(String(data.timestamp).replace("u32", ""))} blocks ago`
      : "0 blocks ago",
  };
}
