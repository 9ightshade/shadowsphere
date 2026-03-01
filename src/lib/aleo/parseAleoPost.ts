import type { Post } from "../../store/usePostStore";
import { fieldToString } from "../../lib/aleo/index";

type AleoRaw = Record<string, any> | string | null;

const cleanAleoValue = (value: any): string =>
  String(value)
    .replace(/\.private|\.public/g, "")
    .replace(/u\d+$/, "")
    .replace(/field$/, "")
    .trim();

const parseStructString = (raw: string): Record<string, string> => {
  return Object.fromEntries(
    raw
      .replace(/^[{\s]+|[}\s]+$/g, "")
      .split(",")
      .map((pair) => {
        const [key, value] = pair.split(":").map((s) => s.trim());
        return [key, value];
      }),
  );
};

export function parseAleoPost(
  data: AleoRaw,
  fallbackId?: number | string,
): Post | null {
  if (!data) return null;

  const parsed: Record<string, any> =
    typeof data === "string" ? parseStructString(data) : data;

  const rawPostId = parsed.post_id ? cleanAleoValue(parsed.post_id) : null;

  const id = rawPostId ?? String(fallbackId ?? "0");

  const author = parsed.author ? String(parsed.author) : "anon";

  const contentHash = parsed.content_hash
    ? cleanAleoValue(parsed.content_hash)
    : null;

  const categoryMap: Record<number, string> = {
    1: "Finance",
    2: "Sports",
    3: "Tech",
    4: "Science",
    5: "Art",
  };

const categoryRaw = parsed.category
  ? Number(String(parsed.category).match(/\d+/)?.[0] ?? 0)
  : 0;

  console.log("category raw", categoryRaw);

  console.log("raw:", parsed.category);
  console.log("cleaned:", cleanAleoValue(parsed.category));
  console.log("number:", Number(cleanAleoValue(parsed.category)));

  return {
    id,

    alias: "aleo..." + author.slice(-6),
    reputation: Math.floor(Math.random() * 200),
    verified: true,

    category: categoryMap[categoryRaw] ?? "All",

    // 🔒 FORCE STRING
    content: contentHash ? String(fieldToString(contentHash)) : "No content",

    encrypted: parsed.encrypted === true || parsed.encrypted === "true",

    likes: parsed.likes ? Number(cleanAleoValue(parsed.likes)) : 0,

    comments: parsed.comments ? Number(cleanAleoValue(parsed.comments)) : 0,

    // 🔒 MATCH STORE TYPE (string)
    timestamp: parsed.timestamp
      ? String(cleanAleoValue(parsed.timestamp))
      : "0",
  };
}
