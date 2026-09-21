import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RequireCompleteProfile } from "./require-complete-profile";

const { replace, useSession } = vi.hoisted(() => ({ replace: vi.fn(), useSession: vi.fn() }));
vi.mock("../lib/session", () => ({ useSession }));
vi.mock("next/navigation", () => ({
  usePathname: () => "/sell/room",
  useRouter: () => ({ replace }),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("complete profile guard", () => {
  it("redirects an incomplete user to profile setup", async () => {
    useSession.mockReturnValue({ status: "authenticated", profile: { profileComplete: false } });
    render(<RequireCompleteProfile><p>Vente</p></RequireCompleteProfile>);
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/profile/setup?next=%2Fsell%2Froom"));
    expect(screen.queryByText("Vente")).not.toBeInTheDocument();
  });

  it("renders the seller page for a complete profile", () => {
    useSession.mockReturnValue({ status: "authenticated", profile: { profileComplete: true } });
    render(<RequireCompleteProfile><p>Vente</p></RequireCompleteProfile>);
    expect(screen.getByText("Vente")).toBeInTheDocument();
  });
});
