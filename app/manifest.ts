import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Text Language School",
    short_name: "TextLang",
    description:
      "Kisisellestirilmis online Ingilizce ozel ders. YDS, YOKDIL, IELTS hazirlik ve is Ingilizcesi.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f0eb",
    theme_color: "#c25a3c",
    orientation: "portrait-primary",
    categories: ["education", "language"],
    lang: "tr",
    icons: [
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
