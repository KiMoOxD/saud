"use client"

import { useState, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Download, Eye, ArrowLeft } from "lucide-react"
import Link from "next/link"
import samplesData from "@/data/samples.json"

const { samples } = samplesData

const getIconColor = (color) => {
  const colors = {
    blue: "bg-green-50 text-green-600",
    amber: "bg-green-50 text-green-600",
    purple: "bg-green-50 text-green-600",
    green: "bg-green-50 text-green-600",
  }
  return colors[color] || colors.blue
}

const getHoverColor = (color) => {
  const colors = {
    blue: "hover:shadow-blue-900/10 hover:ring-blue-500/20",
    amber: "hover:shadow-amber-900/10 hover:ring-amber-500/20",
    purple: "hover:shadow-purple-900/10 hover:ring-purple-500/20",
    green: "hover:shadow-green-900/10 hover:ring-green-500/20",
  }
  return colors[color] || colors.blue
}

const HeaderSection = () => {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-emerald-50 to-white px-6 pt-20 pb-28">
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-emerald-300 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-green-300 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-5xl font-extrabold text-slate-900 md:text-6xl">
            نماذج ودراسات
          </h1>
          <p className="mt-4 mx-auto max-w-2xl text-lg leading-relaxed text-slate-600">
            استعرض نماذج من دراسات الجدوى والخطط الاستراتيجية لمشاريع متنوعة وحقيقية
          </p>
        </motion.div>
      </div>
    </section>
  )
}

const SampleCard = ({ sample }) => (
  <motion.article
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    whileHover={{ y: -6 }}
    className={`group relative flex flex-col rounded-3xl bg-white p-8 shadow-lg shadow-slate-900/5 ring-1 ring-slate-100 transition-all duration-300 ${getHoverColor(
      sample.color
    )}`}
  >
    {/* Icon */}
    <div className={`mb-6 inline-flex w-fit rounded-2xl ${getIconColor(sample.color)} p-3`}>
      <FileText className="h-6 w-6" />
    </div>

    {/* Title and Description */}
    <h3 className="text-right text-2xl font-semibold text-slate-900 mb-3">
      {sample.title}
    </h3>
    <p className="text-right text-slate-600 mb-6 flex-1">
      {sample.description}
    </p>

    {/* Action Buttons */}
    <div className="flex items-center justify-end gap-3">
      <Link
        href={`/samples/${sample.id}`}
        className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-emerald-700 font-medium hover:bg-emerald-100 transition-colors"
      >
        <Eye className="h-4 w-4" />
        عرض
      </Link>
      <a
        href={`/data/${sample.file}`}
        download
        className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-2 text-slate-700 font-medium hover:bg-slate-100 transition-colors"
      >
        <Download className="h-4 w-4" />
        تحميل
      </a>
    </div>
  </motion.article>
)

export default function SamplesPage() {
  return (
    <>
      <HeaderSection />

      <main className="mx-auto max-w-7xl px-6 py-16">
        <motion.div
          layout
          className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-2"
        >
          {samples.map(sample => (
            <SampleCard key={sample.id} sample={sample} />
          ))}
        </motion.div>
      </main>
    </>
  )
}
