export default function Loading() {
  return (
    <main className="min-h-screen grid place-items-center bg-background">
      <div className="space-y-4 text-center">
        <div className="mx-auto h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Loading AptiMaster...</p>
      </div>
    </main>
  )
}
