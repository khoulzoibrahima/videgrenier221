import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import LoginPage from "./page";

const { replace, refreshProfile, signInWithGoogle } = vi.hoisted(() => ({
  replace: vi.fn(),
  refreshProfile: vi.fn(),
  signInWithGoogle: vi.fn().mockResolvedValue({ uid: "google-awa" }),
}));

vi.mock("../../lib/firebase", () => ({
  signInWithGoogle,
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));
vi.mock("../../lib/session", () => ({ useSession: () => ({ refreshProfile }) }));

afterEach(() => {
  cleanup();
  replace.mockClear();
  refreshProfile.mockReset();
  signInWithGoogle.mockClear();
});

describe("login page", () => {
  it("offers one clear Google sign-in action", () => {
    render(<LoginPage />);

    expect(screen.getByRole("heading", { name: "Connectez-vous simplement" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continuer avec Google" })).toBeInTheDocument();
    expect(screen.getByText("Aucun mot de passe à retenir.")).toBeInTheDocument();
  });

  it("opens profile setup after first Google sign-in", async () => {
    refreshProfile.mockResolvedValue({ profileComplete: false });
    render(<LoginPage />);

    fireEvent.click(screen.getByRole("button", { name: "Continuer avec Google" }));

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/profile/setup"));
  });

  it("continues to the selling journey when the profile is complete", async () => {
    refreshProfile.mockResolvedValue({ profileComplete: true });
    render(<LoginPage />);

    fireEvent.click(screen.getByRole("button", { name: "Continuer avec Google" }));

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/sell/room"));
  });
});
