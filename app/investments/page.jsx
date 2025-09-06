"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence, animate } from "framer-motion"
import { Search, MapPin, DollarSign, TrendingUp, ArrowLeft, Globe, Clock, BarChart2, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

import investmentsData from "@/data/investments.json"

const rawInvestments = investmentsData.investments;

// --- Helper Functions ---
const formatCurrency = (amount) => {
    if (typeof amount !== "number" || isNaN(amount)) return "N/A"
    return new Intl.NumberFormat("ar-SA", { 
        style: "currency", 
        currency: "SAR", 
        notation: "compact",
        minimumFractionDigits: 0,
        maximumFractionDigits: 1
    }).format(amount)
}

// Safe number extraction function
const extractNumber = (value) => {
    if (typeof value === 'number' && !isNaN(value)) return value;
    if (typeof value === 'string') {
        const parsed = parseFloat(value.replace(/[^\d.-]/g, ''));
        return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
}

// --- Child Components ---

function AnimatedStat({ finalValue, label, formatter = (v) => v, icon: Icon }) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const numericValue = extractNumber(finalValue);
        
        const controls = animate(0, numericValue, {
            duration: 2.5,
            ease: [0.22, 1, 0.36, 1], // EaseOutQuint
            onUpdate: (value) => {
                setDisplayValue(Math.round(value));
            }
        });
        return () => controls.stop();
    }, [finalValue]);

    return (
        <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-lg shadow-green-900/5 text-center border border-white/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <Icon className="mx-auto h-8 w-8 mb-3 text-green-600" />
            <div className="text-4xl font-bold text-slate-900 tracking-tighter">{formatter(displayValue)}</div>
            <div className="text-sm font-medium text-slate-500 mt-1">{label}</div>
        </div>
    );
}

function InvestmentCard({ investment }) {
    const {
        name,
        description,
        country,
        location,
        image,
        financial_indicators = {} // Provide default empty object
    } = investment;

    // Safely extract financial data
    const totalInvestmentCost = extractNumber(financial_indicators.total_investment_cost);
    const roi = financial_indicators.roi;
    const paybackPeriod = financial_indicators.payback_period;

    // A check to see if there are any financial details to show
    const hasFinancials = totalInvestmentCost > 0 || roi || paybackPeriod;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            dir="rtl"
            className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-green-900/5 flex flex-col group border border-slate-100 hover:ring-2 hover:ring-green-500 transition-all duration-300"
        >
            {/* Image Section */}
            {image && (
                <div className="overflow-hidden">
                    <img
                        src={image}
                        alt={name || 'Investment Image'}
                        className="w-full h-48 object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                    />
                </div>
            )}

            <div className="p-6 flex-grow flex flex-col">
                {/* Header Section */}
                <div className="mb-4">
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 text-right">{name}</h3>
                    
                    {((country && country.ar) || location) && (
                        <div className="flex items-center gap-4 justify-start text-sm text-slate-500">
                            {country && country.ar && (
                                <div className="flex items-center gap-1.5">
                                    <Globe className="h-4 w-4" />
                                    <span>{country.ar}</span>
                                </div>
                            )}
                            {location && (
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="h-4 w-4" />
                                    <span>{location}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {description && <p className="text-sm md:text-base text-slate-600 mb-6 text-right line-clamp-3 flex-grow">{description}</p>}
                
                {/* Financials Section */}
                {hasFinancials && (
                    <div className="space-y-3 py-4 border-y border-slate-100">
                        {totalInvestmentCost > 0 && (
                            <div className="flex justify-between items-center text-right">
                                <span className="text-slate-500">حجم الاستثمار</span>
                                <span className="font-semibold text-slate-800 text-base md:text-lg flex items-center gap-2">
                                    {formatCurrency(totalInvestmentCost)}
                                    <DollarSign className="h-4 w-4 text-green-500" />
                                </span>
                            </div>
                        )}
                        {roi && (
                            <div className="flex justify-between items-center text-right">
                                <span className="text-slate-500">العائد على الاستثمار</span>
                                <span className="font-semibold text-green-600 text-base md:text-lg flex items-center gap-2">
                                    {roi}
                                    <TrendingUp className="h-4 w-4" />
                                </span>
                            </div>
                        )}
                        {paybackPeriod && (
                            <div className="flex justify-between items-center text-right">
                                <span className="text-slate-500">فترة الاسترداد</span>
                                <span className="font-semibold text-slate-800 text-base md:text-lg flex items-center gap-2">
                                    {paybackPeriod}
                                    <Clock className="h-4 w-4 text-green-500" />
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer Link */}
                <div className="mt-auto pt-5">
                    <Link href={`/investments/${investment.id}`} className="inline-flex items-center justify-end gap-2 w-full text-green-600 font-semibold group-hover:text-green-700 transition-colors">
                        <span>تفاصيل المشروع</span>
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}

// --- Main Page Component ---
export default function InvestmentsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCountry, setSelectedCountry] = useState("all")
    const [selectedLocation, setSelectedLocation] = useState("all")
    const [sortBy, setSortBy] = useState("investment")

    const { countries, locations } = useMemo(() => {
        const uniqueCountries = [...new Set(
            rawInvestments
                .map(inv => inv.country && inv.country.ar)
                .filter(Boolean)
        )];
        const uniqueLocations = [...new Set(
            rawInvestments
                .map(inv => inv.location)
                .filter(Boolean)
        )];
        return { countries: uniqueCountries, locations: uniqueLocations };
    }, []);

    const filteredInvestments = useMemo(() => {
        if (!rawInvestments || !Array.isArray(rawInvestments)) {
            console.warn('rawInvestments is not an array or is undefined');
            return [];
        }

        return rawInvestments
            .filter(investment => {
                if (!investment) return false;
                
                const matchesSearch = (investment.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                                      (investment.description || '').toLowerCase().includes(searchQuery.toLowerCase());
                const matchesCountry = selectedCountry === "all" || (investment.country && investment.country.ar === selectedCountry);
                const matchesLocation = selectedLocation === "all" || investment.location === selectedLocation;
                return matchesSearch && matchesCountry && matchesLocation;
            })
            .sort((a, b) => {
                const aFinancials = a.financial_indicators || {};
                const bFinancials = b.financial_indicators || {};
                
                if (sortBy === "profit") {
                    const aProfit = extractNumber(aFinancials.expected_net_profit);
                    const bProfit = extractNumber(bFinancials.expected_net_profit);
                    return bProfit - aProfit;
                }
                const aInvestment = extractNumber(aFinancials.total_investment_cost);
                const bInvestment = extractNumber(bFinancials.total_investment_cost);
                return bInvestment - aInvestment;
            });
    }, [searchQuery, selectedCountry, selectedLocation, sortBy]);

    // Enhanced dynamic stats calculation
    const stats = useMemo(() => {
        console.log('Calculating stats for:', filteredInvestments.length, 'investments');
        
        if (!filteredInvestments || filteredInvestments.length === 0) {
            return [
                { label: "إجمالي الاستثمارات", value: 0, icon: DollarSign, formatter: formatCurrency },
                { label: "صافي الربح المتوقع", value: 0, icon: TrendingUp, formatter: formatCurrency },
                { label: "متوسط العائد", value: 0, icon: BarChart2, formatter: (v) => `${v.toFixed(1)}%` }
            ];
        }

        const totalInvestment = filteredInvestments.reduce((sum, inv) => {
            const amount = extractNumber(inv.financial_indicators?.total_investment_cost);
            return sum + amount;
        }, 0);

        const totalProfit = filteredInvestments.reduce((sum, inv) => {
            const profit = extractNumber(inv.financial_indicators?.expected_net_profit);
            return sum + profit;
        }, 0);

        // Calculate average ROI more safely
        const validROIs = filteredInvestments
            .map(inv => extractNumber(inv.financial_indicators?.roi))
            .filter(roi => roi > 0);
            
        const avgROI = validROIs.length > 0 
            ? validROIs.reduce((sum, roi) => sum + roi, 0) / validROIs.length
            : 0;

        console.log('Stats calculated:', { totalInvestment, totalProfit, avgROI });
        
        return [
            { label: "إجمالي الاستثمارات", value: totalInvestment, icon: DollarSign, formatter: formatCurrency },
            { label: "صافي الربح المتوقع", value: totalProfit, icon: TrendingUp, formatter: formatCurrency },
            { label: "متوسط العائد", value: avgROI, icon: BarChart2, formatter: (v) => `${v.toFixed(1)}%` }
        ];
    }, [filteredInvestments]);
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    // Debug logging
    useEffect(() => {
        console.log('Raw investments data:', rawInvestments?.slice(0, 2));
        console.log('Filtered investments:', filteredInvestments?.length);
    }, [filteredInvestments]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <section className="relative isolate overflow-hidden bg-gradient-to-b from-green-50 to-slate-50 px-4 pt-24 pb-20 text-center">
                 <div className="absolute inset-0 -z-10 opacity-20">
                    <div className="absolute left-[10%] top-0 h-96 w-96 rounded-full bg-green-300 blur-3xl" />
                    <div className="absolute right-[10%] bottom-0 h-96 w-96 rounded-full bg-emerald-300 blur-3xl" />
                </div>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-4">فرص استثمارية واعدة</h1>
                    <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                        اكتشف و قارن بين مجموعة واسعة من الفرص الاستثمارية المصممة خصيصًا لتحقيق أهدافك المالية في مختلف القطاعات والمناطق.
                    </p>
                </motion.div>
            </section>
            
            <main className="container mx-auto px-4 pb-16 -mt-12">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
                >
                    {stats.map((stat, i) => (
                        <motion.div key={i} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                            <AnimatedStat {...stat} />
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md mb-10"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
                        <div className="relative lg:col-span-2">
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <Input
                                placeholder="ابحث بالاسم أو الوصف عن فرصتك المثالية..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="pl-4 pr-12 text-right w-full h-12 rounded-lg bg-slate-50 border-slate-200 focus:bg-white focus:border-green-500 transition"
                            />
                        </div>
                        <Select value={selectedCountry} onValueChange={setSelectedCountry} dir="rtl">
                            <SelectTrigger className="w-full h-12 rounded-lg bg-slate-50 border-slate-200 focus:bg-white focus:border-green-500 transition">
                                <SelectValue placeholder="اختر الدولة" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">جميع الدول</SelectItem>
                                {countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select value={selectedLocation} onValueChange={setSelectedLocation} dir="rtl">
                            <SelectTrigger className="w-full h-12 rounded-lg bg-slate-50 border-slate-200 focus:bg-white focus:border-green-500 transition">
                                <SelectValue placeholder="اختر المنطقة" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">جميع المناطق</SelectItem>
                                {locations.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </motion.div>

                <AnimatePresence>
                    {filteredInvestments.length > 0 ? (
                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {filteredInvestments.map(investment => (
                                <InvestmentCard key={investment.id} investment={investment} />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <h3 className="text-2xl font-semibold text-slate-700">لا توجد نتائج مطابقة</h3>
                            <p className="text-slate-500 mt-2">حاول تغيير معايير البحث أو الفلترة.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    )
}