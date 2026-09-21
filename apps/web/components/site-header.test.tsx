import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SiteHeader } from "./site-header";

const { signOut, useSession } = vi.hoisted(() => ({ signOut: vi.fn(), useSession: vi.fn() }));
vi.mock("../lib/session", () => ({ useSession }));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("site header", () => {
  it("shows the connection action to visitors", () => {
    useSession.mockReturnValue({ status: "unauthenticated", profile: null, signOut });
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: "Connexion" })).toHaveAttribute("href", "/login");
  });

  it("shows the connected profile and allows sign out", () => {
    useSession.mockReturnValue({
      status: "authenticated",
      profile: { displayName: "Awa Ndiaye", avatarUrl: "https://images.test/awa.jpg" },
      signOut,
    });
    render(<SiteHeader />);

    expect(screen.getByText("Awa")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Mon profil" })).toHaveAttribute("href", "/profile");
    fireEvent.click(screen.getByRole("button", { name: "Déconnexion" }));
    expect(signOut).toHaveBeenCalled();
  });
});
