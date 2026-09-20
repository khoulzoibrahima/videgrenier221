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

  it("explains the assisted selling journey", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        name: /transformez vos objets en boutique en quelques minutes/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /photographier une pièce/i }),
    ).toHaveAttribute("href", "/sell/room");
    expect(screen.getByRole("link", { name: /vendre un objet/i })).toHaveAttribute(
      "href",
      "/sell/item",
    );
    expect(screen.getByText("Prenez une photo")).toBeInTheDocument();
    expect(screen.getByText("L’IA identifie les objets")).toBeInTheDocument();
    expect(screen.getByText("Créez votre boutique")).toBeInTheDocument();
  });

  it("shows recent listings with prices in FCFA", () => {
    render(<HomePage />);

    expect(screen.getByText("Canapé 3 places")).toBeInTheDocument();
    expect(screen.getByText("125 000 FCFA")).toBeInTheDocument();
    expect(screen.getByText("Dernières trouvailles")).toBeInTheDocument();
  });
});
