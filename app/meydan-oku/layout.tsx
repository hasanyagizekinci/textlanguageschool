import type { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Meydan Oku | Text Language School",
  description: "Arkadaşlarına meydan oku! İngilizce quiz sonuçlarını paylaş ve skorlarını karşılaştır.",
}

export default function MeydanOkuLayout({ children }: { children: React.ReactNode }) {
  return children
}
