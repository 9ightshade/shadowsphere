/**
 * Converts Aleo field (BigInt string) to readable UTF-8 string.
 */
export function fieldToString(fieldStr: string | number | bigint | boolean) {
  try {
    if (!fieldStr) {
      return "";
    }
    const cleaned = fieldStr.toString().replace("field", "");
    let num = BigInt(cleaned);

    if (num === 0n) return "";

    const bytes = [];

    while (num > 0n) {
      bytes.unshift(Number(num & 0xffn));
      num >>= 8n;
    }

    return new TextDecoder().decode(new Uint8Array(bytes)).replace(/\0/g, "");
  } catch (e) {
    console.warn("Field decode failed:", e);
    return fieldStr;
  }
}
