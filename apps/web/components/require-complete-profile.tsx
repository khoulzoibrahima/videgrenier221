"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "../lib/session";

export function RequireCompleteProfile({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { status, profile } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    } else if (status === "authenticated" && !profile?.profileComplete) {
      router.replace(`/profile/setup?next=${encodeURIComponent(pathname)}`);
    }
  }, [status, profile, pathname, router]);

  if (status !== "authenticated" || !profile?.profileComplete) {
    return <main className="route-loading" aria-label="Vérification du profil" />;
  }
  return children;
}
