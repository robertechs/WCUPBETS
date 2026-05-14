import {
  Keypair,
  PublicKey,
} from "@solana/web3.js";
import bs58 from "bs58";

export function getVaultPubkey(): PublicKey {
  const raw = process.env.NEXT_PUBLIC_VAULT_PUBKEY;
  if (!raw) throw new Error("Missing NEXT_PUBLIC_VAULT_PUBKEY");
  return new PublicKey(raw);
}

export function getVaultKeypair(): Keypair {
  const raw = process.env.VAULT_SECRET_KEY;
  if (!raw) throw new Error("Missing VAULT_SECRET_KEY");
  const secret = bs58.decode(raw.trim());
  return Keypair.fromSecretKey(secret);
}
