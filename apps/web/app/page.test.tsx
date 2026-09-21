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

  it("explains buying and selling in everyday language", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        name: /le vide-grenier en ligneprès de chez vous/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /vendre mes objets/i }),
    ).toHaveAttribute("href", "/sell/room");
    expect(screen.getByRole("link", { name: /explorer les bonnes affaires/i })).toHaveAttribute(
      "href",
      "/browse",
    );
    expect(screen.getByText("Objets de", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("Des particuliers", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("Une consommation", { exact: false })).toBeInTheDocument();
    expect(screen.queryByText(/\bIA\b/i)).not.toBeInTheDocument();
  });

  it("feels rooted in everyday Senegal", () => {
    render(<HomePage />);

    expect(screen.getByText("Dakar · Thiès · Saint-Louis · Tout le Sénégal")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /électronique/i })).toHaveAttribute(
      "href",
      "/browse?category=electronique",
    );
    expect(screen.getByText("Achetez et vendez facilement les objets qui dorment dans vos maisons.")).toBeInTheDocument();
  });

  it("shows recent listings with prices in FCFA", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: "iPhone 11 – 64 Go" })).toBeInTheDocument();
    expect(screen.getByText("75 000 FCFA")).toBeInTheDocument();
    expect(screen.getByText("Les bonnes affaires du moment")).toBeInTheDocument();
  });

  it("gives buyers a clear way to find nearby deals", () => {
    render(<HomePage />);

    expect(screen.getByPlaceholderText("Que cherchez-vous ?")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Maison" })).toHaveAttribute(
      "href",
      "/browse?category=maison",
    );
    expect(screen.getByRole("link", { name: /explorer les bonnes affaires/i })).toHaveAttribute(
      "href",
      "/browse",
    );
  });

  it("matches the marketplace-first landing structure", () => {
    render(<HomePage />);

    expect(screen.getByRole("link", { name: "Vide-greniers" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /le vide-grenier en ligneprès de chez vous/i })).toBeInTheDocument();
    expect(screen.getAllByTestId("market-category")).toHaveLength(7);
    expect(screen.getByText("Videz une pièce, vendez plusieurs objets")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Photographier ma pièce" })).toHaveAttribute("href", "/sell/room");
    expect(screen.getAllByTestId("listing-card")).toHaveLength(6);
  });
});
