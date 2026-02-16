export function stringToField(input: string) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(input);

  let value = 0n;
  for (let i = 0; i < bytes.length; i++) {
    value = (value << 8n) + BigInt(bytes[i]);
  }

  return `${value.toString()}field`;
}
