import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SessionProvider, useSession } from "./session";

const { authenticatedFetch, observeAuthState, signOutFirebase } = vi.hoisted(() => ({
  authenticatedFetch: vi.fn(),
  observeAuthState: vi.fn(),
  signOutFirebase: vi.fn(),
}));

vi.mock("./api", () => ({ authenticatedFetch }));
vi.mock("./firebase", () => ({ observeAuthState, signOutFirebase }));

const user = { uid: "google-awa", getIdToken: vi.fn().mockResolvedValue("token") };
const profile = {
  id: "user-id",
  firebaseUid: "google-awa",
  email: "awa@gmail.com",
  displayName: "Awa Ndiaye",
  avatarUrl: null,
  googleAvatarUrl: null,
  whatsappNumber: null,
  city: null,
  avatarPublicId: null,
  profileComplete: false,
};

function wrapper({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

afterEach(() => {
  vi.clearAllMocks();
});

describe("session provider", () => {
  it("stays loading until Firebase resolves, then loads the Spring profile", async () => {
    let listener: (currentUser: typeof user | null) => void = () => undefined;
    observeAuthState.mockImplementation((callback) => {
      listener = callback;
      return () => undefined;
    });
    authenticatedFetch.mockResolvedValue({ ok: true, json: async () => profile });

    const { result } = renderHook(() => useSession(), { wrapper });
    expect(result.current.status).toBe("loading");

    await act(async () => listener(user));

    await waitFor(() => expect(result.current.status).toBe("authenticated"));
    expect(result.current.profile).toEqual(profile);
  });

  it("becomes unauthenticated when Firebase has no user", async () => {
    let listener: (currentUser: null) => void = () => undefined;
    observeAuthState.mockImplementation((callback) => {
      listener = callback;
      return () => undefined;
    });

    const { result } = renderHook(() => useSession(), { wrapper });
    await act(async () => listener(null));

    expect(result.current.status).toBe("unauthenticated");
    expect(result.current.profile).toBeNull();
  });
});
