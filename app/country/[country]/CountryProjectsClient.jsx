"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { motion, useInView, animate } from "framer-motion"
import { Search, MapPin, DollarSign, TrendingUp, ArrowLeft, BarChart2, Wind } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { sectorNames, countryNames } from "@/data/projects"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"


// Animated Stat Component for the Hero
function AnimatedStat({ value, label, formatter = (v) => v }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })
    const [animatedValue, setAnimatedValue] = useState(0)

    useEffect(() => {
        if (isInView) {
            const controls = animate(0, value, {
                duration: 2,
                ease: "easeOut",
                onUpdate: (latest) => setAnimatedValue(latest),
            })
            return () => controls.stop()
        }
    }, [isInView, value])

    return (
        <div ref={ref} className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-br from-amber-600 to-rose-500 bg-clip-text text-transparent">
                {formatter(animatedValue)}
            </div>
            <div className="text-sm text-slate-500 mt-1">{label}</div>
        </div>
    )
}

export default function CountryProjectsClient({ country, projects }) {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedSector, setSelectedSector] = useState("all")
    const [sortBy, setSortBy] = useState("investment")

    const countryDisplayName = countryNames[country] || country
    const countryFlag = `/images/flags/${country}.svg`

    const filteredAndSortedProjects = useMemo(() => {
        return projects
            .filter((project) => {
                const matchesSearch =
                    project.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    project.description.toLowerCase().includes(searchQuery.toLowerCase())
                const matchesSector = selectedSector === "all" || project.sector === selectedSector
                return matchesSearch && matchesSector
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case "investment": return (b.financial_indicators.total_investment || 0) - (a.financial_indicators.total_investment || 0)
                    case "roi": return (parseFloat(b.financial_indicators.internal_rate_of_return) || 0) - (parseFloat(a.financial_indicators.internal_rate_of_return) || 0)
                    case "name": return a.project_name.localeCompare(b.project_name, "ar")
                    default: return 0
                }
            })
    }, [projects, searchQuery, selectedSector, sortBy])

    const formatCurrency = (amount) => {
        if (typeof amount !== "number") return "N/A"
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact" }).format(amount)
    }

    const availableSectors = [...new Set(projects.map((p) => p.sector))]
    const totalInvestment = projects.reduce((sum, p) => sum + (p.financial_indicators.total_investment || 0), 0)

    const getSectorStyle = (sector) => ({
        Healthcare: { gradient: "from-sky-300 to-cyan-300", badge: "bg-sky-100 text-sky-800" },
        Agriculture: { gradient: "from-green-300 to-emerald-300", badge: "bg-green-100 text-green-800" },
        Manufacturing: { gradient: "from-amber-300 to-orange-300", badge: "bg-amber-100 text-amber-800" },
        Technology: { gradient: "from-violet-300 to-indigo-300", badge: "bg-violet-100 text-violet-800" },
        // ... add other sectors
    }[sector] || { gradient: "from-slate-300 to-slate-400", badge: "bg-slate-100 text-slate-800" });

    const containerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.07 } },
    }
    const itemVariants = {
        hidden: { y: 20, opacity: 0, scale: 0.95 },
        visible: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 12 } },
    }

    return (
        <main className="min-h-screen bg-[#FBF9F6]" dir="rtl">
            <Navbar />

            {/* Cozy Hero Section */}
            <section className="relative py-20 md:py-28 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-rose-50 via-amber-50 to-transparent"></div>
                    <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-sky-50 to-transparent"></div>
                </div>

                <div className="container mx-auto px-4 relative">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center text-sm text-slate-500 mb-12">
                        <Link href="/" className="hover:text-amber-600">الرئيسية</Link><span className="mx-2">/</span>
                        <Link href="/projects" className="hover:text-amber-600">المشاريع</Link><span className="mx-2">/</span>
                        <span className="font-semibold text-amber-700">{countryDisplayName}</span>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 mb-4">
                                استثماراتنا في <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-rose-500">{countryDisplayName}</span>
                            </h1>
                            <p className="text-lg text-slate-600 max-w-xl">
                                اكتشف محفظة مشاريعنا التي تعكس التزامنا بالابتكار والنمو في واحدة من أهم أسواق المنطقة.
                            </p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }} className="flex items-center justify-center">
                             <div className="grid grid-cols-3 gap-6 bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-white/50 w-full max-w-md">
                                <AnimatedStat value={projects.length} label="مشروع" />
                                <AnimatedStat value={availableSectors.length} label="قطاع" />
                                <AnimatedStat value={totalInvestment} label="استثمارات" formatter={(v) => formatCurrency(v)} />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
            
            {/* Render projects only if they exist */}
            {projects.length > 0 ? (
                <>
                    <section className="sticky top-0 z-20 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
                        <div className="container mx-auto px-4">
                            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                                <div className="relative w-full lg:max-w-xs">
                                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                                    <Input placeholder="ابحث..." onChange={(e) => setSearchQuery(e.target.value)} className="w-full pr-12 bg-white/80 rounded-full border-slate-300/70 focus:ring-amber-500" />
                                </div>
                                <div className="flex gap-4">
                                    <Select value={selectedSector} onValueChange={setSelectedSector}><SelectTrigger className="w-44 bg-white/80 rounded-full border-slate-300/70"><SelectValue /></SelectTrigger><SelectContent>{availableSectors.map((s) => <SelectItem key={s} value={s}>{sectorNames[s]}</SelectItem>)}<SelectItem value="all">جميع القطاعات</SelectItem></SelectContent></Select>
                                    <Select value={sortBy} onValueChange={setSortBy}><SelectTrigger className="w-44 bg-white/80 rounded-full border-slate-300/70"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="investment">الأعلى استثماراً</SelectItem><SelectItem value="roi">الأعلى عائد</SelectItem><SelectItem value="name">الترتيب الأبجدي</SelectItem></SelectContent></Select>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="py-16 bg-gradient-to-b from-white/20 to-transparent">
                        <div className="container mx-auto px-4">
                            <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" variants={containerVariants} initial="hidden" animate="visible">
                                {filteredAndSortedProjects.map((project) => (
                                    <motion.div key={project.id} variants={itemVariants} className="h-full">
                                        <Link href={`/projects/${project.id}`}>
                                            <motion.div whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 300 }} className="group h-full relative p-6 rounded-2xl overflow-hidden bg-white/60 backdrop-blur-lg border border-white/50 shadow-lg shadow-slate-200/50">
                                                <div className={`absolute -inset-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${getSectorStyle(project.sector).gradient} blur-3xl`}></div>
                                                <div className="relative flex flex-col h-full">
                                                    <Badge className={`self-start border-none text-xs font-semibold ${getSectorStyle(project.sector).badge}`}>{sectorNames[project.sector]}</Badge>
                                                    <h3 className="text-lg font-bold text-slate-800 my-2 line-clamp-2">{project.project_name}</h3>
                                                    <div className="mt-auto space-y-2 border-t border-slate-200/60 pt-4 text-sm text-slate-500">
                                                        <div className="flex items-center gap-2"><MapPin size={16}/> {project.location}</div>
                                                        <div className="flex items-center gap-2"><DollarSign size={16}/> {formatCurrency(project.financial_indicators.total_investment)}</div>
                                                        {project.financial_indicators.internal_rate_of_return && <div className="flex items-center gap-2"><TrendingUp size={16}/> {project.financial_indicators.internal_rate_of_return} عائد</div>}
                                                    </div>
                                                    <div className="absolute bottom-4 left-4 text-amber-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                                                        التفاصيل <ArrowLeft size={16}/>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </section>
                </>
            ) : (
                // Cozy "Coming Soon" State
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center py-16 bg-white/60 backdrop-blur-lg border border-white/50 shadow-lg shadow-slate-200/50 rounded-2xl">
                            <div className="inline-block p-5 bg-amber-100 rounded-full mb-6">
                                <Wind size={48} className="text-amber-500"/>
                            </div>
                            <h3 className="text-2xl font-semibold text-slate-800">قريباً... مشاريع جديدة ومبتكرة</h3>
                            <p className="text-slate-500 mt-3 max-w-md mx-auto">نعمل حاليًا على دراسة وتنفيذ مشاريع واعدة في {countryDisplayName}. ترقبوا إعلاناتنا القادمة!</p>
                            <Link href="/projects">
                               <Button className="mt-8 bg-amber-500 hover:bg-amber-600 text-white font-semibold">
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                    استكشف دول أخرى
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </section>
            )}
            
            <Footer />
        </main>
    )
}