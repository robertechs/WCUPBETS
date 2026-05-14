import { Connection } from "@solana/web3.js";

export function getServerConnection(): Connection {
  const endpoint =
    process.env.SOLANA_RPC_URL?.trim() ||
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL?.trim();
  if (!endpoint) {
    throw new Error("Missing SOLANA_RPC_URL or NEXT_PUBLIC_SOLANA_RPC_URL");
  }
  return new Connection(endpoint, "confirmed");
}
