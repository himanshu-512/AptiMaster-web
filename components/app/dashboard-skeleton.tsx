'use client'

export function DashboardSkeleton() {
  return (
    <div className="p-4 lg:p-6 space-y-6 animate-pulse">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-3">
          <div className="h-8 w-64 rounded-xl bg-muted" />
          <div className="h-4 w-80 max-w-full rounded-lg bg-muted" />
        </div>
        <div className="h-20 w-full lg:w-80 rounded-2xl bg-muted" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-36 rounded-2xl bg-muted" />
        <div className="h-36 rounded-2xl bg-muted" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="h-32 rounded-2xl bg-muted" />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-80 rounded-2xl bg-muted" />
        <div className="h-80 rounded-2xl bg-muted" />
      </div>
    </div>
  )
}
