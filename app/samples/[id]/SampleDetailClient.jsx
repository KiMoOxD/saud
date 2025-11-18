"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Download, Maximize2, Minimize2, ChevronLeft, ChevronRight, Loader } from "lucide-react"
import Link from "next/link"
import samplesData from "@/data/samples.json"

const { samples } = samplesData

export default function SampleDetailClient({ id }) {
  const sample = samples.find(s => s.id === id)
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [numPages, setNumPages] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const iframeKey = `/data/${sample.file}`

  if (!sample) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-slate-600">العينة غير موجودة</p>
      </div>
    )
  }

  const getIconColor = (color) => {
    const colors = {
      blue: "bg-green-50 text-green-600",
      amber: "bg-green-50 text-green-600",
      purple: "bg-green-50 text-green-600",
      green: "bg-green-50 text-green-600",
    }
    return colors[color] || colors.blue
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1)
  }

  return (
    <>
      {/* Header */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-emerald-50 to-white px-6 pt-16 pb-12">
        <div className="absolute inset-0 -z-10 opacity-20">
          <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-emerald-300 blur-3xl" />
          <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-green-300 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl">
          <Link
            href="/samples"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">العودة للنماذج</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          >
            <div className="flex-1">
              <div className={`mb-4 inline-flex rounded-2xl ${getIconColor(sample.color)} p-3`}>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 text-right mb-2">
                {sample.title}
              </h1>
              <p className="text-lg text-slate-600 text-right">
                {sample.description}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PDF Viewer Section */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className={`relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-200 ${
            isFullscreen ? "fixed inset-0 z-50 m-0 rounded-none" : ""
          }`}
        >
          {/* Controls Bar */}
          <div className="flex items-center justify-between gap-4 bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 flex-wrap">



          </div>

          {/* PDF Viewer */}
          <div className={`relative bg-slate-50 ${isFullscreen ? "h-[calc(100vh-80px)]" : "h-96 md:h-screen"}`}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
                <div className="flex flex-col items-center gap-3">
                  <Loader className="h-8 w-8 animate-spin text-emerald-600" />
                  <p className="text-slate-600 text-sm">جاري تحميل المستند...</p>
                </div>
              </div>
            )}
            <iframe
              key={iframeKey}
              src={`${iframeKey}#page=${currentPage}`}
              className="w-full h-full"
              onLoad={() => setIsLoading(false)}
              title={sample.title}
              style={{ border: "none" }}
            />
          </div>
        </motion.div>
      </main>

      {/* Info Section */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl bg-gradient-to-r from-emerald-50 to-green-50 p-8 ring-1 ring-emerald-200"
        >
          <h2 className="text-right text-2xl font-bold text-slate-900 mb-4">
            حول هذا النموذج
          </h2>
          <p className="text-right text-slate-700 leading-relaxed">
            هذا النموذج يعكس معايير دراسات الجدوى والخطط الاستراتيجية التي تطبقها شركتنا. يتضمن المستند تحليلات شاملة للسوق والجدوى المالية والتقنية والتنظيمية، بالإضافة إلى التوصيات والخطط التنفيذية الفعلية.
          </p>
        </motion.div>
      </section>

      {/* Related Samples */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-right text-3xl font-bold text-slate-900 mb-10">
          نماذج أخرى
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {samples
            .filter(s => s.id !== id)
            .slice(0, 2)
            .map(relatedSample => (
              <Link
                key={relatedSample.id}
                href={`/samples/${relatedSample.id}`}
                className="group rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-100 hover:shadow-xl hover:ring-emerald-500/20 transition-all"
              >
                <div className={`mb-4 inline-flex rounded-xl ${getIconColor(relatedSample.color)} p-3`}>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                  </svg>
                </div>
                <h3 className="text-right font-semibold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                  {relatedSample.title}
                </h3>
                <p className="text-right text-sm text-slate-600 line-clamp-2">
                  {relatedSample.description}
                </p>
              </Link>
            ))}
        </div>
      </section>
    </>
  )
}
