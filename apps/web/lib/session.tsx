"use client";

import type { User } from "firebase/auth";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authenticatedFetch } from "./api";
import { observeAuthState, signOutFirebase } from "./firebase";

export type UserProfile = {
  id: string;
  firebaseUid: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  googleAvatarUrl: string | null;
  whatsappNumber: string | null;
  city: string | null;
  avatarPublicId: string | null;
  profileComplete: boolean;
};

type SessionStatus = "loading" | "authenticated" | "unauthenticated";

type SessionValue = {
  status: SessionStatus;
  firebaseUser: User | null;
  profile: UserProfile | null;
  refreshProfile: (user?: User) => Promise<UserProfile>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<SessionStatus>("loading");
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const refreshProfile = useCallback(async (user?: User) => {
    const currentUser = user ?? firebaseUser;
    if (!currentUser) throw new Error("Vous devez être connecté.");
    const response = await authenticatedFetch(currentUser, "/api/v1/me");
    if (!response.ok) throw new Error("Connexion refusée. Veuillez réessayer.");
    const nextProfile = await response.json() as UserProfile;
    setFirebaseUser(currentUser);
    setProfile(nextProfile);
    setStatus("authenticated");
    return nextProfile;
  }, [firebaseUser]);

  useEffect(() => observeAuthState((user) => {
    setFirebaseUser(user);
    if (!user) {
      setProfile(null);
      setStatus("unauthenticated");
      return;
    }
    setStatus("loading");
    void refreshProfile(user).catch(() => {
      setProfile(null);
      setStatus("unauthenticated");
    });
  }), [refreshProfile]);

  const disconnect = useCallback(async () => {
    await signOutFirebase();
    setFirebaseUser(null);
    setProfile(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo(() => ({
    status, firebaseUser, profile, refreshProfile, signOut: disconnect,
  }), [status, firebaseUser, profile, refreshProfile, disconnect]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const session = useContext(SessionContext);
  if (!session) throw new Error("useSession doit être utilisé dans SessionProvider.");
  return session;
}
