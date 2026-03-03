export default function normalize(value: { toString: () => string; }) {
    if (!value) return value;

    return value
      .toString()
      .replace(".private", "")
      .replace(".public", "")
      .replace("field", "")
      .replace("u32", "")
      .replace("u8", "")
      .trim();
  }