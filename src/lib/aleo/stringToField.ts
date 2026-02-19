/**
 * Converts a UTF-8 string into an Aleo field element.
 * Output example: "448378203247field"
 */
export function stringToField(str: string) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);

  let num = 0n;

  for (let i = 0; i < bytes.length; i++) {
    num = (num << 8n) + BigInt(bytes[i]);
  }

  return `${num}field`;
}
