import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import LoginPage from "./page";

vi.mock("../../lib/firebase", () => ({
  signInWithGoogle: vi.fn(),
  completeGoogleSignIn: vi.fn().mockResolvedValue(false),
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: vi.fn() }) }));

afterEach(cleanup);

describe("login page", () => {
  it("offers one clear Google sign-in action", () => {
    render(<LoginPage />);

    expect(screen.getByRole("heading", { name: "Connectez-vous simplement" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continuer avec Google" })).toBeInTheDocument();
    expect(screen.getByText("Aucun mot de passe à retenir.")).toBeInTheDocument();
  });
});
