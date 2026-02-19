import { fieldToString } from "./fieldToString";

/**
 * Parses an Aleo struct string into a JS object.
 */
export function parseAleoStruct(str) {
  if (!str || typeof str !== "string") return {};

  str = str.replace(/\n/g, "").trim();

  if (str.startsWith("{") && str.endsWith("}")) {
    str = str.slice(1, -1);
  }

  const obj = {};
  let depth = 0;
  let current = "";
  const pairs = [];

  for (let char of str) {
    if (char === "{") depth++;
    if (char === "}") depth--;

    if (char === "," && depth === 0) {
      pairs.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  if (current) pairs.push(current);

  pairs.forEach((pair) => {
    const separatorIndex = pair.indexOf(":");
    if (separatorIndex === -1) return;

    const key = pair.slice(0, separatorIndex).trim();
    const rawValue = pair.slice(separatorIndex + 1).trim();

    obj[key] = parseAleoValue(rawValue);
  });

  return obj;
}

function parseAleoValue(value) {
  if (!value) return value;

  if (value === "true") return true;
  if (value === "false") return false;

  const numericMatch = value.match(/^(\d+)(u8|u16|u32|u64|u128|field)?$/);

  if (numericMatch) {
    const [, num, type] = numericMatch;

    if (type === "field") {
      return fieldToString(num);
    }

    return BigInt(num);
  }

  return value;
}
