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
        name: /achetez local.*vendez ce qui ne vous sert plus/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /vendre mes objets/i }),
    ).toHaveAttribute("href", "/sell/room");
    expect(screen.getByRole("link", { name: /voir les bonnes affaires/i })).toHaveAttribute(
      "href",
      "/browse",
    );
    expect(screen.getByText("Prenez vos photos")).toBeInTheDocument();
    expect(screen.getByText("Vérifiez le prix")).toBeInTheDocument();
    expect(screen.getByText("Partagez sur WhatsApp")).toBeInTheDocument();
    expect(screen.queryByText(/\bIA\b/i)).not.toBeInTheDocument();
  });

  it("feels rooted in everyday Senegal", () => {
    render(<HomePage />);

    expect(screen.getByText("Dakar · Thiès · Saint-Louis · Tout le Sénégal")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /électronique/i })).toHaveAttribute(
      "href",
      "/browse?category=electronique",
    );
    expect(screen.getByText("Acheter local, c’est garder l’argent près de chez nous.")).toBeInTheDocument();
  });

  it("shows recent listings with prices in FCFA", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: "Canapé 3 places" })).toBeInTheDocument();
    expect(screen.getByText("125 000 FCFA")).toBeInTheDocument();
    expect(screen.getByText("Les bonnes affaires du moment")).toBeInTheDocument();
  });

  it("gives buyers a clear way to find nearby deals", () => {
    render(<HomePage />);

    expect(screen.getByPlaceholderText("Que cherchez-vous ?")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Maison" })).toHaveAttribute(
      "href",
      "/browse?category=maison",
    );
    expect(screen.getByRole("link", { name: /voir les bonnes affaires/i })).toHaveAttribute(
      "href",
      "/browse",
    );
  });
});
