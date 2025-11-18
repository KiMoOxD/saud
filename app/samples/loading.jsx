import { Skeleton } from "@/components/ui/skeleton"

export default function SamplesLoading() {
  return (
    <>
      {/* Header Skeleton */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-emerald-50 to-white px-6 pt-20 pb-28">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <Skeleton className="h-16 w-64 mx-auto mb-4" />
            <Skeleton className="h-8 w-96 mx-auto" />
          </div>
        </div>
      </section>

      {/* Cards Skeleton */}
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex flex-col rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-100">
              <Skeleton className="h-10 w-10 rounded-lg mb-6" />
              <Skeleton className="h-8 w-full mb-3" />
              <Skeleton className="h-20 w-full mb-6" />
              <div className="flex items-center justify-end gap-3">
                <Skeleton className="h-10 w-20 rounded-lg" />
                <Skeleton className="h-10 w-20 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
