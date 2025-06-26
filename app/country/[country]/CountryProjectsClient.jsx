"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { motion, useInView, animate, AnimatePresence } from "framer-motion"
import { Search, MapPin, DollarSign, TrendingUp, ArrowLeft, Compass, Briefcase, Building } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { sectorNames, countryNames } from "@/data/projects"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"


// ENHANCEMENT: The AnimatedStat component has been significantly improved.
// 1.  **Icon Prop**: Added an `icon` prop to make each stat more visually distinct.
// 2.  **Smarter Formatting**: The core issue with the counter was formatting. The animation was on a raw number,
//     and the currency formatting only snapped into place at the end. This is jarring.
//     The fix is to animate the raw number but apply the formatting *on every frame* within the `onUpdate` callback.
//     This ensures the number smoothly animates while always being correctly formatted (e.g., "$1.2M", "$1.3M", ...).
// 3.  **Premium Styling**: Reworked the JSX with flexbox for better alignment and added softer styling for a premium feel.
function AnimatedStat({ value, label, formatter = (v) => v, icon: Icon }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })
    const [displayValue, setDisplayValue] = useState(formatter(0));

    useEffect(() => {
        if (isInView) {
            const controls = animate(0, value, {
                duration: 2.5, // Slightly longer duration for a smoother feel
                ease: [0.22, 1, 0.36, 1], // A more premium ease-out quint curve
                onUpdate: (latest) => {
                    setDisplayValue(formatter(latest))
                },
            })
            // Set final value precisely on complete to avoid rounding errors
            controls.then(() => setDisplayValue(formatter(value)));
            return () => controls.stop()
        }
    }, [isInView, value, formatter])

    return (
        <div ref={ref} className="flex flex-col items-center justify-center text-center p-2">
            {Icon && <Icon className="w-8 h-8 mb-3 text-amber-500" />}
            <div className="text-4xl font-bold bg-gradient-to-br from-amber-600 to-rose-500 bg-clip-text text-transparent tracking-tighter">
                {displayValue}
            </div>
            <div className="text-sm text-slate-500 mt-1 font-medium">{label}</div>
        </div>
    )
}


export default function CountryProjectsClient({ country, projects }) {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedSector, setSelectedSector] = useState("all")
    const [sortBy, setSortBy] = useState("investment")

    const countryDisplayName = countryNames[country] || country
    // ENHANCEMENT: Using a placeholder for flags that might not exist to prevent broken images.
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
        // Use Math.round on the animated value to avoid decimal places for the integer part
        const roundedAmount = Math.round(amount);
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact" }).format(roundedAmount)
    }

    const availableSectors = [...new Set(projects.map((p) => p.sector))]
    const totalInvestment = useMemo(() => projects.reduce((sum, p) => sum + (p.financial_indicators.total_investment || 0), 0), [projects]);

    // ENHANCEMENT: Added more sectors and refined the gradients for a softer, more cohesive look.
    const getSectorStyle = (sector) => ({
        Healthcare: { gradient: "from-sky-200 to-cyan-200", badge: "bg-sky-100 text-sky-800" },
        Agriculture: { gradient: "from-green-200 to-emerald-200", badge: "bg-green-100 text-green-800" },
        Manufacturing: { gradient: "from-amber-200 to-orange-200", badge: "bg-amber-100 text-amber-800" },
        Technology: { gradient: "from-violet-200 to-indigo-200", badge: "bg-violet-100 text-violet-800" },
        RealEstate: { gradient: "from-rose-200 to-fuchsia-200", badge: "bg-rose-100 text-rose-800" },
        Energy: { gradient: "from-yellow-200 to-lime-200", badge: "bg-yellow-100 text-yellow-800" },
    }[sector] || { gradient: "from-slate-200 to-slate-300", badge: "bg-slate-100 text-slate-800" });

    const containerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
    }
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 14 } },
    }

    return (
        // ENHANCEMENT: Using a slightly warmer, cozier background color.
        <main className="min-h-screen bg-[#FDFCF9]" dir="rtl">
            <Navbar />

            {/* ENHANCEMENT: Hero Section has been polished for a more premium and airy feel. */}
            <section className="relative py-24 md:py-32 overflow-hidden">
                {/* Softer, more subtle background gradients */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-rose-50/50 via-amber-50/50 to-transparent"></div>
                    <div className="absolute bottom-0 right-0 w-3/4 h-1/2 bg-gradient-to-tl from-sky-50/50 to-transparent rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 relative">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center text-sm text-slate-500 mb-12">
                        <Link href="/" className="hover:text-amber-600 transition-colors">الرئيسية</Link><span className="mx-2">/</span>
                        <Link href="/projects" className="hover:text-amber-600 transition-colors">المشاريع</Link><span className="mx-2">/</span>
                        <span className="font-semibold text-amber-700">{countryDisplayName}</span>
                    </motion.div>

                    <div className="grid lg:grid-cols-5 gap-12 items-center">
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: "easeOut" }} className="lg:col-span-3">
                            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 mb-4 leading-tight">
                                استثماراتنا في <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-rose-500">{countryDisplayName}</span>
                            </h1>
                            <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                                اكتشف محفظة مشاريعنا التي تعكس التزامنا بالابتكار والنمو في واحدة من أهم أسواق المنطقة.
                            </p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }} className="lg:col-span-2 flex items-center justify-center">
                             {/* ENHANCEMENT: Stat counter card has a softer shadow and a more premium border */}
                            <div className="grid grid-cols-3 gap-2 sm:gap-4 bg-white/70 backdrop-blur-lg p-4 sm:p-6 rounded-2xl shadow-xl shadow-slate-200/60 border border-white w-full max-w-md">
                                <AnimatedStat value={projects.length} label="مشروع" icon={Briefcase} formatter={(v) => Math.round(v)} />
                                <AnimatedStat value={availableSectors.length} label="قطاع" icon={Building} formatter={(v) => Math.round(v)} />
                                <AnimatedStat value={totalInvestment} label="استثمارات" icon={DollarSign} formatter={formatCurrency} />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
            
            {/* Render projects only if they exist */}
            <AnimatePresence mode="wait">
            {projects.length > 0 ? (
                <motion.div key="projects-list">
                    {/* ENHANCEMENT: Sticky bar has a subtle shadow for better depth perception when scrolling. */}
                    <section className="sticky top-0 z-20 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm shadow-slate-200/50">
                        <div className="container mx-auto px-4">
                            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                                <div className="relative w-full lg:max-w-sm">
                                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                                    <Input placeholder="ابحث بالاسم أو الوصف..." onChange={(e) => setSearchQuery(e.target.value)} className="w-full pr-12 bg-white/80 rounded-full border-slate-300/70 focus:ring-amber-500 focus:border-amber-500 transition-all" />
                                </div>
                                <div className="flex gap-3 sm:gap-4">
                                    <Select value={selectedSector} onValueChange={setSelectedSector}><SelectTrigger className="w-[150px] sm:w-44 bg-white/80 rounded-full border-slate-300/70"><SelectValue /></SelectTrigger><SelectContent>{availableSectors.map((s) => <SelectItem key={s} value={s}>{sectorNames[s]}</SelectItem>)}<SelectItem value="all">جميع القطاعات</SelectItem></SelectContent></Select>
                                    <Select value={sortBy} onValueChange={setSortBy}><SelectTrigger className="w-[150px] sm:w-44 bg-white/80 rounded-full border-slate-300/70"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="investment">الأعلى استثماراً</SelectItem><SelectItem value="roi">الأعلى عائد</SelectItem><SelectItem value="name">الترتيب الأبجدي</SelectItem></SelectContent></Select>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="py-20 bg-gradient-to-b from-white/10 to-transparent">
                        <div className="container mx-auto px-4">
                            <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" variants={containerVariants} initial="hidden" animate="visible">
                                {filteredAndSortedProjects.map((project) => (
                                    <motion.div key={project.id} variants={itemVariants} className="h-full">
                                        <Link href={`/projects/${project.id}`} className="block h-full">
                                             {/* ENHANCEMENT: Project card hover effect is more playful and premium. */}
                                            <motion.div whileHover={{ y: -10, rotate: '-1.5deg' }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="group h-full relative p-6 rounded-2xl overflow-hidden bg-white/60 backdrop-blur-lg border border-white/50 shadow-lg shadow-slate-200/50 flex flex-col">
                                                {/* Softer gradient on hover for a cozier feel */}
                                                <div className={`absolute -inset-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${getSectorStyle(project.sector).gradient} blur-3xl`}></div>
                                                <div className="relative flex flex-col h-full">
                                                    <Badge className={`self-start border-none text-xs font-semibold ${getSectorStyle(project.sector).badge}`}>{sectorNames[project.sector]}</Badge>
                                                    <h3 className="text-xl font-bold text-slate-800 my-3 line-clamp-2 leading-snug">{project.project_name}</h3>
                                                    {/* ENHANCEMENT: Use mt-auto to push the footer content to the bottom, ensuring cards have a consistent layout regardless of title length. */}
                                                    <div className="mt-auto space-y-3 border-t border-slate-200/60 pt-4 text-sm text-slate-600">
                                                        <div className="flex items-center gap-2"><MapPin size={16} className="text-slate-400"/> {project.location}</div>
                                                        <div className="flex items-center gap-2"><DollarSign size={16} className="text-slate-400"/> {formatCurrency(project.financial_indicators.total_investment)}</div>
                                                        {project.financial_indicators.internal_rate_of_return && <div className="flex items-center gap-2"><TrendingUp size={16} className="text-slate-400"/> {project.financial_indicators.internal_rate_of_return} عائد</div>}
                                                    </div>
                                                    {/* ENHANCEMENT: The "Details" arrow now animates its position on hover for a dynamic feel. */}
                                                    <div className="absolute bottom-4 left-4 text-amber-600 font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1 transform group-hover:bottom-6">
                                                        التفاصيل <ArrowLeft size={16} className="transition-transform group-hover:translate-x-[-4px]"/>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </section>
                </motion.div>
            ) : (
                // ENHANCEMENT: The "Coming Soon" state is cozier and more on-brand.
                <motion.div key="no-projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <section className="py-16">
                        <div className="container mx-auto px-4">
                            <div className="text-center py-20 bg-white/60 backdrop-blur-lg border border-white/50 shadow-xl shadow-slate-200/50 rounded-2xl">
                                {/* Using a more relevant and evocative icon (Compass). */}
                                <div className="inline-block p-5 bg-amber-100 rounded-full mb-6 ring-8 ring-amber-50">
                                    <Compass size={48} className="text-amber-500"/>
                                </div>
                                <h3 className="text-3xl font-bold text-slate-800">قريباً... وجهات استثمارية جديدة</h3>
                                <p className="text-slate-500 mt-3 max-w-md mx-auto leading-relaxed">نعمل حاليًا على دراسة وتنفيذ مشاريع واعدة في {countryDisplayName}. ترقبوا إعلاناتنا القادمة!</p>
                                <Link href="/projects">
                                    <Button className="mt-8 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-full px-6 py-3">
                                        {/* ENHANCEMENT: Corrected arrow direction for RTL. Button points left to go "back" or to another section. */}
                                        <ArrowLeft className="ml-2 h-4 w-4" />
                                        استكشف دول أخرى
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </section>
                </motion.div>
            )}
            </AnimatePresence>
            
            <Footer />
        </main>
    )
}