"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, animate, AnimatePresence } from "framer-motion"
import { Search, MapPin, DollarSign, TrendingUp, ArrowLeft, Inbox, Globe, Package, BarChart2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import projectsData from "@/data/projectsData.json"
import Image from "next/image"

const rawProjects = projectsData.projects;

// --- Helper Functions ---
const formatCurrency = (amount) => {
    if (typeof amount !== "number") return "N/A"
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact" }).format(amount)
}

// --- Child Components ---
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
        <div className="bg-white p-4 rounded-2xl shadow-lg shadow-green-900/10 text-center border border-slate-100">
            <Icon className="mx-auto h-7 w-7 mb-2 text-green-600" />
            <div className="text-3xl font-bold text-slate-900 tracking-tighter">{displayValue}</div>
            <div className="text-sm text-slate-500">{label}</div>
        </div>
    );
}

// --- Main Page Component ---
export default function ProjectsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCountry, setSelectedCountry] = useState("all")
    const [selectedSector, setSelectedSector] = useState("all")
    const [sortBy, setSortBy] = useState("investment")

    const { allProjects, countryNames, sectorNames, uniqueSectors, uniqueCountries, totalInvestment } = useMemo(() => {
        const createKey = (name) => name?.toLowerCase().replace(/\s+/g, '_') || 'unknown';
        const tempCountryNames = {};
        const tempSectorNames = {};

        const processedProjects = rawProjects.map(p => {
            const countryKey = createKey(p.country?.en);
            if (p.country?.ar && !tempCountryNames[countryKey]) {
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
        const styles = {
            Agriculture: { badge: "bg-emerald-100 text-emerald-800" },
            Manufacturing: { badge: "bg-yellow-100 text-yellow-800" },
            Healthcare: { badge: "bg-cyan-100 text-cyan-800" },
            RealEstate: { badge: "bg-stone-100 text-stone-800" },
            HumanResources: { badge: "bg-sky-100 text-sky-800" },
            InteriorDesign: { badge: "bg-rose-100 text-rose-800" },
            MiningandQuarrying: { badge: "bg-slate-100 text-slate-800" },
            Tourism: { badge: "bg-orange-100 text-orange-800" },
        };
        return styles[sectorKey.replace(/\s/g, '')] || { badge: "bg-gray-100 text-gray-800" };
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
        <main className="min-h-screen bg-slate-50" dir="rtl">
            <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-green-50 to-slate-50">
                <div className="container mx-auto px-4 relative">
                    <motion.div
                        className="max-w-3xl mx-auto text-center"
                        initial="hidden"
                        animate="visible"
                        variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
                    >
                        <motion.h1
                            className="text-4xl md:text-6xl font-extrabold bg-gradient-to-l from-slate-800 via-green-700 to-green-500 bg-clip-text text-transparent mb-6"
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
                        <motion.div variants={itemVariants}><AnimatedStat finalValue={allProjects.length} label="مشروع" icon={Package} /></motion.div>
                        <motion.div variants={itemVariants}><AnimatedStat finalValue={uniqueCountries.length} label="دولة" icon={Globe} /></motion.div>
                        <motion.div variants={itemVariants}><AnimatedStat finalValue={uniqueSectors.length} label="قطاع" icon={BarChart2} /></motion.div>
                        <motion.div variants={itemVariants}><AnimatedStat finalValue={totalInvestment} label="إجمالي الاستثمارات" icon={DollarSign} formatter={formatCurrency} /></motion.div>
                    </motion.div>
                </div>
            </section>

            <section className="py-10">
                <div className="container mx-auto px-4">
                    {/* --- ✅ START: Redesigned, Non-Sticky Filter Section --- */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md mb-12"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
                            <div className="relative lg:col-span-2">
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <Input
                                    placeholder="ابحث بالاسم، الوصف، أو الموقع..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full h-12 pr-12"
                                />
                            </div>
                            <Select value={selectedCountry} onValueChange={setSelectedCountry}><SelectTrigger className="w-full h-12"><SelectValue placeholder="اختر دولة" /></SelectTrigger><SelectContent><SelectItem value="all">جميع الدول</SelectItem>{Object.entries(countryNames).map(([key, name]) => <SelectItem key={key} value={key}>{name}</SelectItem>)}</SelectContent></Select>
                            <Select value={selectedSector} onValueChange={setSelectedSector}><SelectTrigger className="w-full h-12"><SelectValue placeholder="اختر قطاع" /></SelectTrigger><SelectContent><SelectItem value="all">جميع القطاعات</SelectItem>{uniqueSectors.map(s => <SelectItem key={s} value={s}>{sectorNames[s] || s}</SelectItem>)}</SelectContent></Select>
                            <Select value={sortBy} onValueChange={setSortBy}><SelectTrigger className="w-full h-12"><SelectValue placeholder="ترتيب حسب" /></SelectTrigger><SelectContent><SelectItem value="investment">الأعلى استثماراً</SelectItem><SelectItem value="roi">الأعلى عائد</SelectItem><SelectItem value="name">الترتيب الأبجدي</SelectItem></SelectContent></Select>
                        </div>
                    </motion.div>
                    {/* --- ✅ END: Redesigned Filter Section --- */}

                    <AnimatePresence>
                    {filteredAndSortedProjects.length > 0 ? (
                        <motion.div
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            key="projects-grid"
                        >
                            {filteredAndSortedProjects.map((project) => (
                                <motion.div key={project.id} variants={itemVariants} className="h-full">
                                    <Link href={`/projects/${project.id}`} className="block h-full">
                                        <motion.div
                                            whileHover={{ y: -5 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                            className="h-full bg-white rounded-2xl shadow-lg shadow-green-900/5 overflow-hidden flex flex-col group"
                                        >
                                            <div className="relative h-52 w-full overflow-hidden">
                                                <Image
                                                    src={project.image || "/placeholder.jpg"}
                                                    alt={project.project_name}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                                <div className="absolute top-4 right-4">
                                                    <Badge className={`${getSectorStyle(project.sector.en).badge} border-none shadow-md`}>{project.sector.ar}</Badge>
                                                </div>
                                            </div>
                                            <div className="p-5 flex flex-col flex-grow">
                                                <h3 className="text-lg font-bold text-slate-800 group-hover:text-green-600 transition-colors duration-300 line-clamp-2 mb-2">
                                                    {project.project_name}
                                                </h3>
                                                <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                                                    <Globe className="h-4 w-4" />
                                                    <span>{project.country?.ar || ''} - {project.location}</span>
                                                </div>
                                                <div className="mt-auto space-y-2 text-sm">
                                                    {typeof project.financial_indicators.total_investment === "number" && (
                                                        <div className="flex items-center gap-2 text-slate-600"><DollarSign size={16} className="text-green-500" /> <span className="font-semibold">{formatCurrency(project.financial_indicators.total_investment)}</span></div>
                                                    )}
                                                    {project.financial_indicators.internal_rate_of_return && (
                                                        <div className="flex items-center gap-2 text-slate-600"><TrendingUp size={16} className="text-green-500" /> IRR: <span className="font-semibold">{project.financial_indicators.internal_rate_of_return}</span></div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="p-4 bg-slate-50 border-t border-slate-200/60 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <span className="text-green-600 font-semibold flex items-center justify-center gap-1">
                                                    عرض التفاصيل <ArrowLeft size={16} />
                                                </span>
                                            </div>
                                        </motion.div>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="no-results"
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
                    </AnimatePresence>
                </div>
            </section>
        </main>
    )
}