import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function KayitBasariliPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
        <h1 className="font-serif text-2xl font-bold mb-2">{"Kay\u0131t Ba\u015far\u0131l\u0131!"}</h1>
        <p className="text-sm text-muted-foreground mb-6">
          {"E-posta adresine bir do\u011frulama ba\u011flant\u0131s\u0131 g\u00f6nderdik. L\u00fctfen e-postan\u0131 kontrol et ve hesab\u0131n\u0131 do\u011frula."}
        </p>
        <Button asChild className="rounded-xl">
          <Link href="/auth/giris">{"Giri\u015f Sayfas\u0131na D\u00f6n"}</Link>
        </Button>
      </div>
    </main>
  )
}
