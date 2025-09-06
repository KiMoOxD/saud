"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ArrowLeft, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Navbar from "@/components/navbar" // Assuming you might have these
import Footer from "@/components/footer"   // Assuming you might have these
import BookingModal from "@/components/booking-modal"
import servicesData from "@/data/services.json"

const { services, company_description } = servicesData

/* ------------------------------------------------------------------ */
/*  Helper Components (Defined outside the main component)            */
/* ------------------------------------------------------------------ */

const Sparkle = () => (
  <Sparkles className="h-3 w-3 text-green-400/60" aria-hidden="true" />
)

const HeaderSection = ({ searchQuery, setSearchQuery, onBookingOpen }) => {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-green-50 to-white px-6 pt-20 pb-28">
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-green-300 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-emerald-300 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-5xl font-extrabold text-slate-900 md:text-6xl">
            خدماتنا
          </h1>
          <p className="mt-4 mx-auto max-w-2xl text-lg leading-relaxed text-slate-600">
            {company_description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-10 flex flex-col-reverse items-center justify-between gap-6"
        >
          <div className="flex-shrink-0">
            <button
              onClick={onBookingOpen}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl shadow-md transition-colors"
            >
              طلب استشارة
              <Sparkles className="h-4 w-4" />
            </button>
          </div>

          <div className="relative w-full max-w-md rounded-2xl bg-white/70 p-1 shadow-lg shadow-green-900/5 ring-1 ring-slate-200 backdrop-blur">
            <Search className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="ابحث عن خدمة..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="h-12 rounded-xl border-none bg-transparent pr-12 text-right focus:ring-0"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

const ServiceCard = ({ s }) => (
  <motion.article
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    whileHover={{ y: -6 }}
    className="group relative flex flex-col rounded-3xl bg-white p-6 shadow-lg shadow-green-900/5 ring-1 ring-slate-100 transition-all duration-300 hover:shadow-xl hover:ring-green-500/20"
  >
    <div className="mb-4 flex items-center justify-between">
      <Badge
        variant="outline"
        className="border-green-500/20 bg-green-50 text-green-700"
      >
        {s.slogan}
      </Badge>
      <Sparkle />
    </div>

    <h3 className="text-right text-xl font-semibold text-slate-900">
      {s.name}
    </h3>

    <p className="mt-3 flex-1 text-right text-slate-600 line-clamp-4">
      {s.description}
    </p>

    <Link
      href={`/services/${s.id}`}
      className="mt-6 inline-flex items-center justify-end gap-2 text-green-600 transition-colors group-hover:text-green-700"
    >
      <span className="text-sm font-medium">المزيد من التفاصيل</span>
      <ArrowLeft className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </Link>
  </motion.article>
)


/* ------------------------------------------------------------------ */
/*  Main Page Component                                              */
/* ------------------------------------------------------------------ */
export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery)
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  // Debouncing Effect: waits 300ms after user stops typing to update filter
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)

    return () => {
      clearTimeout(handler)
    }
  }, [searchQuery])

  // Memoized Filtering: only recalculates when the debounced query changes
  const filteredServices = useMemo(
    () =>
      services.filter(
        s =>
          s.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          s.description.toLowerCase().includes(debouncedQuery.toLowerCase())
      ),
    [debouncedQuery]
  )

  // Memoized Handler: creates the function once and reuses it
  const handleBookingOpen = useCallback(() => {
    setIsBookingOpen(true)
  }, [])

  return (
    <>
      <HeaderSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onBookingOpen={handleBookingOpen}
      />

      <main className="mx-auto max-w-7xl px-6 py-16">
        <AnimatePresence mode="popLayout">
          {filteredServices.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredServices.map(s => (
                <ServiceCard key={s.id} s={s} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-24 text-center"
            >
              <p className="text-lg text-slate-500">
                لا توجد نتائج مطابقة لبحثك.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </>
  )
}