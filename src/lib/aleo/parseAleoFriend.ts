import { fieldToString } from "./index";

type AleoRaw = Record<string, any> | string | null;

const cleanAleoValue = (value: any): string =>
  String(value)
    .replace(/u\d+$/, "")
    .replace(/field$/, "");

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

export function parseAleoFriend(data: AleoRaw, fallbackId?: number | string) {
  if (!data) return null;

  const parsed = typeof data === "string" ? parseStructString(data) : data;

  const rawId = parsed.friend_id ? cleanAleoValue(parsed.friend_id) : null;

  const id = rawId ?? String(fallbackId ?? "0");

  const owner = parsed.owner ? String(parsed.owner) : null;
  const friend = parsed.friend ? String(parsed.friend) : null;

  const status = parsed.status ? Number(cleanAleoValue(parsed.status)) : 0;

  if (!owner || !friend) return null;

  return {
    id,
    owner,
    friend,
    status,
  };
}
