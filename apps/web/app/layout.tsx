import type { Metadata, Viewport } from "next";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/libre-baskerville/400.css";
import "@fontsource/libre-baskerville/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "VideGrenier221 — Vendez autrement au Sénégal",
  description: "Transformez les photos de vos objets en boutique partageable en quelques minutes.",
  applicationName: "VideGrenier221",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = { themeColor: "#064d3b", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}

