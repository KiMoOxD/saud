"use client"

import { motion, AnimatePresence, useInView, animate, LayoutGroup } from "framer-motion"
import { ArrowLeft, TrendingUp, Briefcase, Layers, Filter, Check } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"
import projectsData from "@/data/projectsData.json"

// --- Utility Components ---

const AnimatedCounter = ({ value, formatter = (v) => v.toLocaleString() }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-50px" })

  useEffect(() => {
    if (inView && ref.current) {
      const node = ref.current
      const controls = animate(0, value, {
        duration: 2,
        ease: "circOut",
        onUpdate(latest) {
          node.textContent = formatter(latest.toFixed(0))
        },
      })
      return () => controls.stop()
    }
  }, [inView, value, formatter])

  return <span ref={ref}>0</span>
}

const formatCurrency = (amount) => {
  const value = Math.round(amount);
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
  return `$${value}`
}

export default function Achievements() {
  const allProjects = projectsData.projects
  const [activeSector, setActiveSector] = useState("All")
  const [filteredProjects, setFilteredProjects] = useState([])

  // --- Data Processing ---
  const totalInvestment = allProjects.reduce((sum, p) => sum + (p.financial_indicators.total_investment || 0), 0)
  const successfulProjects = 1200 // Hardcoded or derived

  const sectorStats = allProjects.reduce((acc, project) => {
    const key = project.sector?.en
    const label = project.sector?.ar
    if (key && label) {
      if (!acc[key]) acc[key] = { label, count: 0 }
      acc[key].count += 1
    }
    return acc
  }, {})

  const menuItems = [
    { id: "All", label: "الكل", desktopLabel: "جميع المشاريع", count: allProjects.length, icon: Layers },
    ...Object.entries(sectorStats)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 5)
      .map(([key, val]) => ({ id: key, label: val.label, desktopLabel: val.label, count: val.count, icon: Briefcase }))
  ]

  useEffect(() => {
    const featuredProjects = allProjects
      .filter((p) => typeof p.financial_indicators.total_investment === "number")
      .sort((a, b) => (b.financial_indicators.total_investment || 0) - (a.financial_indicators.total_investment || 0))
      .slice(0, 6)

    if (activeSector === "All") {
      setFilteredProjects(featuredProjects);
    } else {
      const sectorProjects = allProjects
        .filter(p => p.sector && p.sector.en === activeSector)
        .sort((a, b) => (b.financial_indicators.total_investment || 0) - (a.financial_indicators.total_investment || 0))
      setFilteredProjects(sectorProjects);
    }
  }, [activeSector, allProjects]);

  return (
    <section className="relative w-full bg-white text-slate-800 py-16 md:py-24 overflow-hidden font-sans" dir="rtl">
      
      {/* Mobile-Friendly Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" 
           style={{ 
             backgroundImage: 'linear-gradient(#059669 1px, transparent 1px), linear-gradient(to right, #059669 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }}>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-10 lg:mb-16 gap-8">
          
          {/* Titles */}
          <div className="max-w-2xl relative">
            <div className="absolute -right-4 top-2 w-1 h-12 bg-gradient-to-b from-green-600 to-emerald-400 rounded-full lg:hidden"></div>
            <h2 className="text-3xl md:text-5xl text-center md:text-right font-extrabold text-slate-900 mb-3 leading-tight">
              سجل <span className="text-green-700">الإنجازات</span>
            </h2>
            <p className="text-base text-center md:text-right md:text-lg text-slate-500 leading-relaxed pl-4">
              بصماتنا في سوق العمل. تصفح مشاريعنا التي حققت عوائد استثنائية لعملائنا.
            </p>
          </div>

          {/* Stats Cards - Responsive Grid */}
          <div className="w-full lg:w-auto grid grid-cols-2 gap-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
            <div className="text-center lg:text-right px-2">
              <p className="text-slate-400 text-xs md:text-sm font-medium mb-1">قيمة الاستثمارات</p>
              <p className="text-2xl md:text-3xl font-bold  tracking-tight text-green-700">
                <AnimatedCounter value={totalInvestment} formatter={formatCurrency} />
              </p>
            </div>
            {/* <div className="w-px bg-slate-200 hidden lg:block"></div> */}
            <div className="text-center lg:text-right px-2 border-r border-slate-200 lg:border-0">
              <p className="text-slate-400 text-xs md:text-sm font-medium mb-1">مشروع ناجح</p>
              <p className="text-2xl md:text-3xl font-bold text-green-700 tracking-tight">
                <AnimatedCounter value={successfulProjects} formatter={(v) => `+${v}`} />
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* --- Navigation / Filtering --- */}
          <div className="w-full lg:w-1/4 flex-shrink-0">
            
            {/* MOBILE: Tag Cloud Layout (No Scrolling) */}
            <div className="lg:hidden mb-6">
              {/* <div className="flex items-center gap-2 mb-3 text-slate-400 text-sm font-medium">
                <Filter className="w-4 h-4" />
                <span>تصفية المشاريع:</span>
              </div> */}
              <div className="flex flex-wrap justify-center gap-2">
                {menuItems.map((item) => {
                  const isActive = activeSector === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSector(item.id)}
                      className={`relative px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 border
                        ${isActive 
                          ? 'bg-green-600 text-white border-green-600 shadow-lg shadow-green-600/20' 
                          : 'bg-white text-slate-600 border-slate-200 hover:border-green-300 hover:bg-green-50'
                        }`}
                    >
                      {isActive && <Check className="w-3.5 h-3.5" />}
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* DESKTOP: Sticky Sidebar List */}
            <div className="hidden lg:block sticky top-24">
              <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-4">التصنيفات</h3>
              <div className="flex flex-col gap-2">
                {menuItems.map((item) => {
                  const isActive = activeSector === item.id
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSector(item.id)}
                      className={`group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 w-full text-right
                        ${isActive 
                          ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10 translate-x-2' 
                          : 'bg-transparent hover:bg-white hover:shadow-md text-slate-600'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${isActive ? 'text-green-400' : 'text-slate-400 group-hover:text-green-600'}`} />
                        <span className="font-bold text-sm">{item.desktopLabel}</span>
                      </div>
                      <span className={`text-xs font-bold py-0.5 px-2 rounded-md ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {item.count}
                      </span>
                    </button>
                  )
                })}
              </div>
              
              {/* Decorative CTA Box */}
              <div className="mt-8 p-5 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl">
                 <p className="text-green-800 font-bold text-sm mb-1">مشروعك القادم؟</p>
                 <p className="text-green-600/80 text-xs mb-3 leading-relaxed">دعنا نضيف قصة نجاحك إلى هذه القائمة.</p>
                 <a href="/contact" className="inline-flex items-center text-xs font-bold text-green-700 hover:text-green-900 border-b border-green-300 pb-0.5">
                    ابدأ الآن <ArrowLeft className="w-3 h-3 mr-1" />
                 </a>
              </div>
            </div>
          </div>

          {/* --- Grid Content --- */}
          <div className="w-full lg:w-3/4 min-h-[400px]">
            <LayoutGroup>
              <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filteredProjects.map((project, index) => (
                    <motion.div
                      layout
                      key={project.id}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <ProjectCard project={project} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </LayoutGroup>

            {/* Footer Link */}
            <motion.div 
              layout
              className="mt-10 text-center lg:text-right"
            >
               <a href="/projects" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-slate-100 text-slate-700 font-bold text-sm hover:bg-green-600 hover:text-white transition-all duration-300 group">
                  <span>عرض كافة المشاريع</span>
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
               </a>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}

// --- Responsive Project Card ---
function ProjectCard({ project }) {
  return (
    <a href={`/projects/${project.id}`} className="block group h-full">
      <article className="bg-white h-full rounded-2xl p-5 md:p-6 shadow-sm border border-slate-100 hover:border-green-500/30 hover:shadow-xl hover:shadow-green-900/5 transition-all duration-300 flex flex-col relative overflow-hidden">
        
        {/* Hover Accent Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right"></div>

        {/* Header */}
        <div className="flex justify-between items-start mb-3 md:mb-4">
          <span className="inline-block px-3 py-1 rounded-lg bg-slate-50 text-slate-600 text-[10px] md:text-xs font-bold group-hover:bg-green-50 group-hover:text-green-700 transition-colors">
            {project.sector.ar}
          </span>
          <div className="flex items-center gap-1.5 text-green-600 bg-green-50/50 px-2.5 py-1 rounded-lg">
             <TrendingUp className="w-3.5 h-3.5" />
             <span className="text-[11px] md:text-xs font-bold font-mono">
               {formatCurrency(project.financial_indicators.total_investment)}
             </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow">
          <h4 className="text-base md:text-lg font-bold text-slate-800 mb-2 group-hover:text-green-700 transition-colors">
            {project.project_name}
          </h4>
          <p className="text-slate-500 text-xs md:text-sm leading-relaxed line-clamp-3">
            {project.description}
          </p>
        </div>

        {/* Simple Footer */}
        <div className="mt-4 pt-4 border-t border-slate-50 flex justify-end">
            <span className="text-xs font-bold text-slate-300 group-hover:text-green-600 flex items-center gap-1 transition-colors">
               التفاصيل <ArrowLeft className="w-3 h-3" />
            </span>
        </div>
      </article>
    </a>
  )
}