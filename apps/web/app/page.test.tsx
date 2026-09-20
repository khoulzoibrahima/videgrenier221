import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import HomePage from "./page";

afterEach(cleanup);

describe("landing page", () => {
  it("presents the Vide Grenier 221 brand", () => {
    render(<HomePage />);

    expect(
      screen.getAllByRole("link", { name: "Vide Grenier 221, accueil" }),
    ).toHaveLength(2);
  });

  it("explains the selling journey in everyday language", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        name: /vendez facilement ce que vous n’utilisez plus/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /créer ma boutique/i }),
    ).toHaveAttribute("href", "/sell/room");
    expect(screen.getByRole("link", { name: /voir les bonnes affaires/i })).toHaveAttribute(
      "href",
      "/browse",
    );
    expect(screen.getByText("Prenez des photos")).toBeInTheDocument();
    expect(screen.getByText("Vérifiez vos annonces")).toBeInTheDocument();
    expect(screen.getByText("Partagez sur WhatsApp")).toBeInTheDocument();
    expect(screen.queryByText(/\bIA\b/i)).not.toBeInTheDocument();
  });

  it("shows recent listings with prices in FCFA", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: "Canapé 3 places" })).toBeInTheDocument();
    expect(screen.getAllByText("125 000 FCFA")).toHaveLength(2);
    expect(screen.getByText("Dernières trouvailles")).toBeInTheDocument();
  });
});
