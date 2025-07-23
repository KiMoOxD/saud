"use client"

import { motion, AnimatePresence, useInView, animate } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, TrendingUp, Target } from "lucide-react"
import projectsData from "@/data/projectsData.json"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

function AnimatedCounter({ value, className, formatter = (v) => v.toLocaleString() }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (inView && ref.current) {
      const node = ref.current
      const controls = animate(0, value, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate(latest) {
          node.textContent = formatter(latest.toFixed(0))
        },
      })
      return () => controls.stop()
    }
  }, [inView, value, formatter])

  return <span ref={ref} className={className}>0</span>
}

export default function Achievements() {
  const allProjects = projectsData.projects
  const [activeSector, setActiveSector] = useState("All")
  const [filteredProjects, setFilteredProjects] = useState([])

  const totalProjects = allProjects.length
  const totalInvestment = allProjects.reduce((sum, p) => sum + (p.financial_indicators.total_investment || 0), 0)

  const sectorNames = allProjects.reduce((map, project) => {
    if (project.sector && project.sector.en && project.sector.ar) {
      map[project.sector.en] = project.sector.ar
    }
    return map
  }, {})

  const topSectors = ["All", ...Object.entries(
    allProjects.reduce((acc, project) => {
      if (project.sector && project.sector.en) { 
        acc[project.sector.en] = (acc[project.sector.en] || 0) + 1
      }
      return acc
    }, {})
  )
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([sector]) => sector)
  ];

  useEffect(() => {
    const featuredProjects = allProjects
      .filter((p) => typeof p.financial_indicators.total_investment === "number")
      .sort((a, b) => (b.financial_indicators.total_investment || 0) - (a.financial_indicators.total_investment || 0))
      .slice(0, 4)

    if (activeSector === "All") {
      setFilteredProjects(featuredProjects);
    } else {
      const sectorProjects = allProjects
        .filter(p => p.sector && p.sector.en === activeSector)
        .sort((a, b) => (b.financial_indicators.total_investment || 0) - (a.financial_indicators.total_investment || 0))
        .slice(0, 4);
      setFilteredProjects(sectorProjects);
    }
  }, [activeSector]);

  const formatCurrency = (amount) => {
    const value = Math.round(amount);
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value}`
  }

  const Stat = ({ icon, value, label, formatter }) => (
    <div className="text-center">
      <div className="flex justify-center items-center mb-2 text-green-600">
        {icon}
      </div>
      <div className="text-4xl lg:text-5xl font-bold text-slate-800">
        <AnimatedCounter value={value} formatter={formatter} />
      </div>
      <p className="text-sm text-slate-500 mt-1">{label}</p>
    </div>
  );

  return (
    <section className="relative w-full bg-slate-50 text-slate-800 py-24 sm:py-28 md:py-36 overflow-hidden">
        {/* Background Animated Shapes */}
        <div className="absolute inset-0 z-0">
            <motion.div 
              className="absolute top-1/4 left-0 w-96 h-96 bg-green-200/50 rounded-full filter blur-3xl"
              animate={{ x: [-100, 100, -100], rotate: [0, 180, 0] }}
              transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
            />
            <motion.div 
              className="absolute bottom-1/4 right-0 w-[30rem] h-[30rem] bg-green-200/40 rounded-full filter blur-3xl"
              animate={{ x: [100, -100, 100], y: [50, -50, 50] }}
              transition={{ duration: 50, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror', delay: 5 }}
            />
              <motion.div 
              className="absolute bottom-1/2 right-1/3 w-80 h-80 bg-emerald-100/40 rounded-full filter blur-3xl"
              animate={{ y: [80, -80, 80] }}
              transition={{ duration: 60, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror', delay: 10 }}
            />
        </div>

      <div className="container mx-auto px-4 relative z-10">

        {/* --- Header & Stats Section --- */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center mb-20 md:mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.2 }}
        >
          <motion.div className="lg:col-span-3 text-center lg:text-right" variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" }} }}>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 mb-5 leading-tight">
              إنجازاتنا
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0">
              كل مشروع هو بصمة نتركها في عالم الأعمال، وشاهد على قدرتنا في تحويل الفرص إلى نجاحات استثنائية.
            </p>
          </motion.div>
          <motion.div className="lg:col-span-2 grid grid-cols-2 gap-8" variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" }} }}>
            <Stat icon={<Target size={36} />} value={totalProjects} label="مشروع ناجح" formatter={(v) => `${v}+`} />
            <Stat icon={<TrendingUp size={36} />} value={totalInvestment} label="قيمة الاستثمارات" formatter={formatCurrency} />
          </motion.div>
        </motion.div>

        {/* --- Main Content Container --- */}
        <div className="relative bg-white/60 backdrop-blur-xl rounded-2xl p-4 sm:p-6 md:p-8 border border-slate-200/80 shadow-md">
          {/* --- Animated Sector Filters --- */}
          <div className="flex justify-center border-b border-slate-200/90 mb-8 overflow-x-auto pb-2">
            <div className="flex flex-nowrap -mx-2">
            {topSectors.map(sector => (
              <button
                key={sector}
                onClick={() => setActiveSector(sector)}
                className={`relative px-3 sm:px-4 py-3 text-sm sm:text-base font-semibold whitespace-nowrap transition-colors duration-300
                  ${activeSector === sector ? 'text-green-600' : 'text-slate-500 hover:text-slate-900'}`
                }
              >
                {/* This logic now uses the dynamically created sectorNames map */}
                {sector === "All" ? "أبرز المشاريع" : sectorNames[sector]}
                {activeSector === sector && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#006C35] to-emerald-500"
                    layoutId="underline"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
            </div>
          </div>

          {/* --- Projects Grid --- */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSector}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
                  >
                    <Link href={`/projects/${project.id}`} className="block h-full">
                      {/* --- NEW: Light Green Gradient Card --- */}
                      <div className={`relative h-full p-6 rounded-xl border transition-all duration-300 group
                                      bg-gradient-to-br from-white to-green-100/70
                                      border-slate-200/70
                                      hover:border-green-300/80 hover:shadow-lg hover:shadow-green-500/20`}>
                        
                        <div className="absolute top-6 bottom-6 -left-px w-1 rounded-r-full bg-gradient-to-b from-green-400 to-emerald-500 opacity-75 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="pl-5 h-full flex flex-col">
                          <div className="flex-grow">
                            <div className="flex items-start justify-between mb-3">
                              {/* Text reverted to dark for light background */}
                              <h4 className="font-bold text-lg text-slate-800 group-hover:text-green-700 transition-colors">{project.project_name}</h4>
                              {/* UPDATED: Directly use the Arabic sector name from the project object. */}
                              <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-800">{project.sector.ar}</div>
                            </div>
                            <p className="text-slate-600 text-sm mb-4 leading-relaxed line-clamp-2">{project.description}</p>
                          </div>
                          {/* Divider reverted to light theme */}
                          <div className="border-t border-slate-200 pt-4 flex items-center justify-between mt-auto">
                            <div>
                              <div className="text-xs text-slate-500">إجمالي الاستثمار</div>
                              {/* Investment value color updated */}
                              <div className="font-bold text-lg text-green-700">{formatCurrency(project.financial_indicators.total_investment)}</div>
                            </div>
                            <div className="flex items-center gap-1 text-sm font-semibold text-green-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                              <span>التفاصيل</span>
                              <ArrowLeft className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* --- Call to Action --- */}
        <motion.div
          className="text-center mt-16 md:mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Link href="/projects">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#006C35] to-emerald-500 text-white px-8 py-6 sm:px-10 sm:py-7 text-base sm:text-lg shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transform hover:-translate-y-1 transition-all duration-300 group"
            >
              استكشف كافة الإنجازات
              <ArrowLeft className="mr-3 h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}