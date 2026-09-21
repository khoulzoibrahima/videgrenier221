import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ProfileSetupPage from "./page";

const { authenticatedFetch, refreshProfile, replace } = vi.hoisted(() => ({
  authenticatedFetch: vi.fn(),
  refreshProfile: vi.fn(),
  replace: vi.fn(),
}));

vi.mock("../../../lib/api", () => ({ authenticatedFetch }));
vi.mock("../../../lib/session", () => ({
  useSession: () => ({
    status: "authenticated",
    firebaseUser: { uid: "google-awa" },
    profile: {
      displayName: "Awa Ndiaye",
      whatsappNumber: null,
      city: null,
      avatarUrl: "https://google.test/awa.jpg",
    },
    refreshProfile,
  }),
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
  useSearchParams: () => new URLSearchParams(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("profile setup page", () => {
  it("shows only the essential profile fields", () => {
    render(<ProfileSetupPage />);

    expect(screen.getByRole("heading", { name: "Complétez votre profil" })).toBeInTheDocument();
    expect(screen.getByLabelText("Prénom et nom")).toHaveValue("Awa Ndiaye");
    expect(screen.getByLabelText("Numéro WhatsApp")).toBeInTheDocument();
    expect(screen.getByLabelText("Ville ou commune")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enregistrer et continuer" })).toBeInTheDocument();
  });

  it("keeps the user on the form when required fields are empty", async () => {
    render(<ProfileSetupPage />);
    fireEvent.change(screen.getByLabelText("Prénom et nom"), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer et continuer" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Remplissez le nom, WhatsApp et la ville.");
    expect(authenticatedFetch).not.toHaveBeenCalled();
  });

  it("saves the profile and returns to the home page", async () => {
    authenticatedFetch.mockResolvedValue({ ok: true, json: async () => ({ profileComplete: true }) });
    refreshProfile.mockResolvedValue({ profileComplete: true });
    render(<ProfileSetupPage />);

    fireEvent.change(screen.getByLabelText("Numéro WhatsApp"), { target: { value: "77 123 45 67" } });
    fireEvent.change(screen.getByLabelText("Ville ou commune"), { target: { value: "Dakar" } });
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer et continuer" }));

    await waitFor(() => expect(authenticatedFetch).toHaveBeenCalledWith(
      expect.anything(),
      "/api/v1/me/profile",
      expect.objectContaining({ method: "PUT" }),
    ));
    expect(replace).toHaveBeenCalledWith("/");
  });
});
