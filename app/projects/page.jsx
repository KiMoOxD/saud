"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, animate } from "framer-motion"
import { Search, MapPin, DollarSign, TrendingUp, ArrowLeft, Inbox, Globe, Package, BarChart2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import projectsData from "@/data/projectsData.json"

const rawProjects = projectsData.projects;

const formatCurrency = (amount) => {
    if (typeof amount !== "number") return "N/A"
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact" }).format(amount)
}

function AnimatedStat({ finalValue, label, formatter = (v) => v, icon: Icon }) {
    const [displayValue, setDisplayValue] = useState(formatter(0));

    useEffect(() => {
        const controls = animate(0, finalValue, {
            duration: 2.5,
            ease: [0.22, 1, 0.36, 1],
            onUpdate: (value) => {
                setDisplayValue(formatter(Math.round(value)));
            }
        });
        return () => controls.stop();
    }, [finalValue]);

    return (
        <div className="bg-white/60 backdrop-blur-md p-4 rounded-xl shadow-lg shadow-green-900/5 text-center border border-white/70">
            <Icon className="mx-auto h-7 w-7 mb-2 text-green-600" />
            <div className="text-3xl font-bold text-slate-900 tracking-tighter">{displayValue}</div>
            <div className="text-sm text-slate-500">{label}</div>
        </div>
    );
}

export default function ProjectsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCountry, setSelectedCountry] = useState("all")
    const [selectedSector, setSelectedSector] = useState("all")
    const [sortBy, setSortBy] = useState("investment")


    const { allProjects, countryNames, sectorNames, uniqueSectors, uniqueCountries, totalInvestment } = useMemo(() => {
        // Correctly handles strings and prevents errors if name is undefined
        const createKey = (name) => name?.toLowerCase().replace(/\s+/g, '_') || 'unknown';

        const tempCountryNames = {};
        const tempSectorNames = {};

        const processedProjects = rawProjects.map(p => {
            // FIX: Pass the English name string from the country object to createKey
            const countryKey = createKey(p.country?.en);
            if (p.country?.ar && !tempCountryNames[countryKey]) {
                // Store the Arabic name for the dropdown filter
                tempCountryNames[countryKey] = p.country.ar;
            }

            const sectorKey = p.sector?.en || 'N/A';
            if (sectorKey !== 'N/A' && !tempSectorNames[sectorKey]) {
                tempSectorNames[sectorKey] = p.sector.ar;
            }

            return {
                ...p,
                countryKey: countryKey,
                sector: { en: sectorKey, ar: p.sector?.ar || 'غير محدد' }
            };
        });

        const investment = processedProjects.reduce((sum, p) => sum + (p.financial_indicators?.total_investment || 0), 0);

        return {
            allProjects: processedProjects,
            countryNames: tempCountryNames,
            sectorNames: tempSectorNames,
            uniqueSectors: Object.keys(tempSectorNames),
            uniqueCountries: Object.keys(tempCountryNames),
            totalInvestment: investment
        };
    }, []);


    const filteredAndSortedProjects = useMemo(() => {
        return allProjects
            .filter((project) => {
                const matchesSearch =
                    project.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    project.location.toLowerCase().includes(searchQuery.toLowerCase())
                const matchesCountry = selectedCountry === "all" || project.countryKey === selectedCountry
                const matchesSector = selectedSector === "all" || project.sector.en === selectedSector
                return matchesSearch && matchesCountry && matchesSector
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case "investment": return (b.financial_indicators.total_investment || 0) - (a.financial_indicators.total_investment || 0)
                    case "roi": return (parseFloat(b.financial_indicators.internal_rate_of_return) || 0) - (parseFloat(a.financial_indicators.internal_rate_of_return) || 0)
                    case "name": return a.project_name.localeCompare(b.project_name, "ar")
                    default: return 0
                }
            })
    }, [allProjects, searchQuery, selectedCountry, selectedSector, sortBy])

    const getSectorStyle = (sectorKey) => {
        // FIX: Removed spaces from keys to match data (e.g., "Real estate" -> "RealEstate")
        const styles = {
            Agriculture: { border: "border-emerald-500", badge: "bg-emerald-100 text-emerald-800" },
            Manufacturing: { border: "border-yellow-500", badge: "bg-yellow-100 text-yellow-800" },
            Healthcare: { border: "border-cyan-500", badge: "bg-cyan-100 text-cyan-800" },
            RealEstate: { border: "border-stone-500", badge: "bg-stone-100 text-stone-800" },
            HumanResources: { border: "border-sky-500", badge: "bg-sky-100 text-sky-800" },
            InteriorDesign: { border: "border-rose-500", badge: "bg-rose-100 text-rose-800" },
            MiningandQuarrying: { border: "border-slate-500", badge: "bg-slate-100 text-slate-800" },
            Tourism: { border: "border-orange-500", badge: "bg-orange-100 text-orange-800" },
        };
        // Remove spaces from the incoming key to match the style keys
        return styles[sectorKey.replace(/\s/g, '')] || { border: "border-gray-400", badge: "bg-gray-100 text-gray-800" };
    }

    const containerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.07 } },
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 12 } },
    }

    return (
        <main className="min-h-screen bg-emerald-50/40" dir="rtl">
            <Navbar />

            <section className="relative py-24 md:py-32 overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-green-100/60 via-emerald-50/60 to-emerald-50/0"></div>
                <div className="container mx-auto px-4 relative">
                    <motion.div
                        className="max-w-3xl mx-auto text-center"
                        initial="hidden"
                        animate="visible"
                        variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
                    >
                        <motion.h1
                            className="text-4xl md:text-6xl font-extrabold bg-gradient-to-l from-emerald-800 via-green-600 to-lime-500 bg-clip-text text-transparent mb-6"
                            variants={itemVariants}
                        >
                            محفظة مشاريعنا الاستثمارية
                        </motion.h1>
                        <motion.p
                            className="text-lg md:text-xl text-slate-600 mb-12 leading-relaxed"
                            variants={itemVariants}
                        >
                            اكتشف محفظتنا المتنوعة من المشاريع المبتكرة التي تدفع عجلة النمو عبر المنطقة.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
                        initial="hidden"
                        animate="visible"
                        variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } } }}
                    >
                        {allProjects.length > 0 && (
                            <motion.div variants={itemVariants}>
                                <AnimatedStat finalValue={allProjects.length} label="مشروع" icon={Package} />
                            </motion.div>
                        )}
                        {uniqueCountries.length > 0 && (
                            <motion.div variants={itemVariants}>
                                <AnimatedStat finalValue={uniqueCountries.length} label="دولة" icon={Globe} />
                            </motion.div>
                        )}
                        {uniqueSectors.length > 0 && (
                            <motion.div variants={itemVariants}>
                                <AnimatedStat finalValue={uniqueSectors.length} label="قطاع" icon={BarChart2} />
                            </motion.div>
                        )}
                        {totalInvestment > 0 && (
                            <motion.div variants={itemVariants}>
                                <AnimatedStat finalValue={totalInvestment} label="إجمالي الاستثمارات" icon={DollarSign} formatter={formatCurrency} />
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </section>

            <section className="sticky top-0 z-30 py-4 bg-white/70 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full lg:max-w-xs">
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                            <Input placeholder="ابحث..." onChange={(e) => setSearchQuery(e.target.value)} className="w-full pr-12 bg-white rounded-full border-slate-300/70 focus:ring-green-500 focus:border-green-500" />
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Select value={selectedCountry} onValueChange={setSelectedCountry}><SelectTrigger className="w-36 bg-white rounded-full border-slate-300/70"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">جميع الدول</SelectItem>{Object.entries(countryNames).map(([key, name]) => <SelectItem key={key} value={key}>{name}</SelectItem>)}</SelectContent></Select>
                            <Select value={selectedSector} onValueChange={setSelectedSector}><SelectTrigger className="w-36 bg-white rounded-full border-slate-300/70"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">جميع القطاعات</SelectItem>{uniqueSectors.map(s => <SelectItem key={s} value={s}>{sectorNames[s] || s}</SelectItem>)}</SelectContent></Select>
                            <Select value={sortBy} onValueChange={setSortBy}><SelectTrigger className="w-36 bg-white rounded-full border-slate-300/70"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="investment">الأعلى استثماراً</SelectItem><SelectItem value="roi">الأعلى عائد</SelectItem><SelectItem value="name">الترتيب الأبجدي</SelectItem></SelectContent></Select>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-transparent">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {filteredAndSortedProjects.map((project) => (
                            <motion.div key={project.id} variants={itemVariants} className="h-full">
                                <Link href={`/projects/${project.id}`} className="block h-full">
                                    <motion.div
                                        whileHover={{ scale: 1.03, y: -5 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                        className={`h-full bg-white rounded-2xl shadow-lg shadow-emerald-900/10 overflow-hidden flex flex-col group border-t-4 ${getSectorStyle(project.sector.en).border}`}
                                    >
                                        <div className="p-6 flex flex-col h-full">
                                            <div className="flex items-center justify-between mb-3">
                                                <Badge className={`${getSectorStyle(project.sector.en).badge} border-none`}>{project.sector.ar}</Badge>
                                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                                    <Globe className="h-4 w-4" />
                                                    {/* FIX: Display the Arabic country name */}
                                                    <span>{project.country.ar}</span>
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-800 group-hover:text-green-700 transition-colors duration-300 line-clamp-2 leading-snug">
                                                {project.project_name}
                                            </h3>
                                            <div className="mt-auto pt-6">
                                                <div className="space-y-3 text-sm text-slate-600 border-t border-slate-200/80 pt-4">
                                                    <div className="flex items-center gap-2"><MapPin size={16} className="text-slate-400" /> {project.location}</div>
                                                    {typeof project.financial_indicators.total_investment === "number" && (
                                                        <div className="flex items-center gap-2"><DollarSign size={16} className="text-slate-400" /> {formatCurrency(project.financial_indicators.total_investment)}</div>
                                                    )}
                                                    {project.financial_indicators.internal_rate_of_return && (
                                                        <div className="flex items-center gap-2"><TrendingUp size={16} className="text-slate-400" /> IRR: {project.financial_indicators.internal_rate_of_return}</div>
                                                    )}
                                                </div>
                                                <div className="mt-4 text-green-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                                                    عرض التفاصيل <ArrowLeft size={16} className="transition-transform group-hover:translate-x-[-4px]"/>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>

                    {filteredAndSortedProjects.length === 0 && (
                        <motion.div
                            className="text-center py-20"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="inline-block p-5 bg-green-100 rounded-full mb-6">
                                <Inbox size={48} className="text-green-500"/>
                            </div>
                            <h3 className="text-2xl font-semibold text-slate-800">لا توجد نتائج</h3>
                            <p className="text-slate-500 mt-2 max-w-md mx-auto">لم نعثر على أي مشاريع تطابق بحثك. حاول تعديل الفلاتر.</p>
                            <Button
                                onClick={() => {
                                    setSearchQuery("")
                                    setSelectedCountry("all")
                                    setSelectedSector("all")
                                }}
                                className="mt-6 bg-green-600 hover:bg-green-700 text-white rounded-full px-5"
                            >
                                إعادة تعيين الفلاتر
                            </Button>
                        </motion.div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    )
}