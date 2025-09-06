"use client"

import { motion, AnimatePresence, useInView, animate } from "framer-motion"
import { ArrowLeft, TrendingUp, Target } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"

// --- MOCK DATA to prevent build errors ---
const projectsData = {
  projects: [
    { id: 1, project_name: "مشروع نيوم السكني", sector: { en: "Real Estate", ar: "عقارات" }, description: "تطوير مجمع سكني فاخر ومتكامل الخدمات في قلب مدينة نيوم المستقبلية.", financial_indicators: { total_investment: 150000000 } },
    { id: 2, project_name: "منصة التجارة الإلكترونية", sector: { en: "Technology", ar: "تقنية" }, description: "إنشاء منصة تجارة إلكترونية متطورة تدعم الشركات الصغيرة والمتوسطة.", financial_indicators: { total_investment: 5000000 } },
    { id: 3, project_name: "مصنع الصناعات الغذائية", sector: { en: "Industrial", ar: "صناعي" }, description: "تأسيس مصنع لإنتاج وتعبئة المواد الغذائية بأحدث التقنيات.", financial_indicators: { total_investment: 25000000 } },
    { id: 4, project_name: "منتجع سياحي بيئي", sector: { en: "Tourism", ar: "سياحة" }, description: "بناء منتجع سياحي صديق للبيئة يعتمد على الطاقة المتجددة.", financial_indicators: { total_investment: 75000000 } },
    { id: 5, project_name: "تطبيق التوصيل الذكي", sector: { en: "Technology", ar: "تقنية" }, description: "تطبيق مبتكر لخدمات التوصيل يعتمد على الذكاء الاصطناعي لتحسين المسارات.", financial_indicators: { total_investment: 8000000 } },
    { id: 6, project_name: "مركز بيانات سحابي", sector: { en: "Technology", ar: "تقنية" }, description: "مركز بيانات عالي الأداء لتقديم خدمات الحوسبة السحابية.", financial_indicators: { total_investment: 120000000 } },
    { id: 7, project_name: "مجمع بتروكيماويات", sector: { en: "Industrial", ar: "صناعي" }, description: "تطوير مجمع صناعي لإنتاج البتروكيماويات المتخصصة.", financial_indicators: { total_investment: 300000000 } }
  ]
};


// --- Helper Components ---
const Button = ({ children, className, size, ...props }) => {
  const sizeClasses = size === 'lg' ? 'px-6 py-3 sm:px-6 sm:py-3 text-base sm:text-lg' : 'px-4 py-2 text-sm';
  return (
    <button className={`${sizeClasses} ${className}`} {...props}>
      {children}
    </button>
  );
};

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
  }, [activeSector, allProjects]);

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
    <section className="relative w-full bg-white text-slate-800 py-24 sm:py-28 md:py-36 overflow-hidden">
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
                    {/* --- NEW: Futuristic Card Design --- */}
                    <a href={`/projects/${project.id}`} className="block h-full group">
                      <div className="relative h-full p-6 rounded-2xl border transition-all duration-300 overflow-hidden bg-slate-50/50 backdrop-blur-lg border-slate-200/50 hover:border-emerald-400/60 hover:shadow-2xl hover:shadow-emerald-500/20">
                        {/* Animated light orb on hover */}
                        <div className="absolute top-0 -left-full w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl opacity-50 group-hover:left-10 transition-all duration-700 ease-in-out"></div>
                        {/* Subtle dot pattern */}
                        <div className="absolute inset-0 z-0 opacity-[0.04]" style={{
                          backgroundImage: `radial-gradient(circle at center, #059669 1px, transparent 1px)`,
                          backgroundSize: '25px 25px'
                        }}></div>
                        
                        {/* The content must be on a relative div to be on top */}
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="flex-grow">
                                <div className="flex items-start justify-between mb-3">
                                    <h4 className="font-bold text-lg text-slate-800 group-hover:text-green-700 transition-colors">{project.project_name}</h4>
                                    <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-800 flex-shrink-0">{project.sector.ar}</div>
                                </div>
                                <p className="text-slate-600 text-sm mb-4 leading-relaxed line-clamp-2">{project.description}</p>
                            </div>
                            <div className="border-t border-slate-200/80 pt-4 flex items-center justify-between mt-auto">
                                <div>
                                    <div className="text-xs text-slate-500">إجمالي الاستثمار</div>
                                    <div className="font-bold text-lg text-green-700">{formatCurrency(project.financial_indicators.total_investment)}</div>
                                </div>
                                <div className="flex items-center gap-1 text-sm font-semibold text-green-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                    <span>التفاصيل</span>
                                    <ArrowLeft className="h-4 w-4" />
                                </div>
                            </div>
                        </div>
                      </div>
                    </a>
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
          <a href="/projects">
            <Button
              size="lg"
              className="mx-auto flex items-center rounded-full bg-gradient-to-r from-[#38ae71] to-emerald-500 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transform hover:-translate-y-1 transition-all duration-300 group"
            >
              استكشف كافة الإنجازات
              <ArrowLeft className="mr-3 h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

