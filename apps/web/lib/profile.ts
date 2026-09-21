import type { User } from "firebase/auth";
import { authenticatedFetch } from "./api";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const ACCEPTED_AVATAR_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export type AvatarSignature = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  publicId: string;
  folder: string;
  overwrite: boolean;
  transformation: string;
};

export function validateAvatar(file: File) {
  if (!ACCEPTED_AVATAR_TYPES.has(file.type)) {
    return "Choisissez une photo JPG, PNG ou WebP.";
  }
  if (file.size > MAX_AVATAR_BYTES) {
    return "Choisissez une photo de moins de 2 Mo.";
  }
  return null;
}

export async function requestAvatarSignature(user: User) {
  const response = await authenticatedFetch(user, "/api/v1/me/avatar-signature", { method: "POST" });
  if (!response.ok) throw new Error("Impossible de préparer la photo. Réessayez.");
  return response.json() as Promise<AvatarSignature>;
}

export async function uploadAvatar(file: File, signature: AvatarSignature) {
  const form = new FormData();
  form.set("file", file);
  form.set("api_key", signature.apiKey);
  form.set("timestamp", String(signature.timestamp));
  form.set("signature", signature.signature);
  form.set("public_id", signature.publicId);
  form.set("folder", signature.folder);
  form.set("overwrite", String(signature.overwrite));
  form.set("transformation", signature.transformation);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
    { method: "POST", body: form },
  );
  if (!response.ok) throw new Error("Impossible d’envoyer la photo. Réessayez.");
  const result = await response.json() as { secure_url: string; public_id: string };
  return { secureUrl: result.secure_url, publicId: result.public_id };
}
