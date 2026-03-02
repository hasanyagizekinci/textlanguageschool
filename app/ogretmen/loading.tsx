export default function Loading() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">{"Y\u00fckleniyor..."}</p>
      </div>
    </div>
  )
}
