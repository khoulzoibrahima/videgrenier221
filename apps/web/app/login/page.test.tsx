import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import LoginPage from "./page";

const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));

vi.mock("../../lib/firebase", () => ({
  signInWithGoogle: vi.fn().mockResolvedValue(true),
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));

afterEach(() => {
  cleanup();
  replace.mockClear();
});

describe("login page", () => {
  it("offers one clear Google sign-in action", () => {
    render(<LoginPage />);

    expect(screen.getByRole("heading", { name: "Connectez-vous simplement" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continuer avec Google" })).toBeInTheDocument();
    expect(screen.getByText("Aucun mot de passe à retenir.")).toBeInTheDocument();
  });

  it("opens the selling journey after Google sign-in", async () => {
    render(<LoginPage />);

    fireEvent.click(screen.getByRole("button", { name: "Continuer avec Google" }));

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/sell/room"));
  });
});
