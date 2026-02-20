// src/config.js

// --- ALEO PROGRAM SETTINGS ---
export const ALEO_PROGRAM_NAME = "shadowsphere_social12.aleo";

// --- TRANSACTION SETTINGS ---
export const ALEO_FEE = 100_000; // 0.1 Aleo Credits
export const TOKEN_DECIMALS = 6;
export const DECIMAL_MULTIPLIER = 1_000_000; // 10^6

// --- HELPER FUNCTIONS ---
/**
 * Converts human-readable amount (0.5) to on-chain u128 string ("500000u128")
 */
export const toU128 = (amount: Number | BigInt | any) => {
  const raw = Math.floor(amount * DECIMAL_MULTIPLIER);
  return `${raw}u128`;
};

/**
 * Creates a u32 timestamp string for Aleo ("1708415181u32")
 */
export const getTimestampU32 = () => {
  const unix = Math.floor(Date.now() / 1000);
  return `${unix}u32`;
};
