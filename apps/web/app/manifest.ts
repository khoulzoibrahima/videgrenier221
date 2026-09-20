import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VideGrenier221", short_name: "VG221",
    description: "Créez et partagez votre vide-grenier au Sénégal.",
    start_url: "/", display: "standalone", background_color: "#fffaf0", theme_color: "#064d3b",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}

