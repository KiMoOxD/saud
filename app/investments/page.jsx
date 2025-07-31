"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, animate } from "framer-motion"
import { Search, MapPin, DollarSign, TrendingUp, ArrowLeft, Globe } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import investmentsData from "@/data/investments.json"

const rawInvestments = investmentsData.investments;

const formatCurrency = (amount) => {
    if (typeof amount !== "number") return "N/A"
    return new Intl.NumberFormat("ar-SA", { style: "currency", currency: "SAR", notation: "compact" }).format(amount)
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

export default function InvestmentsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCountry, setSelectedCountry] = useState("all")
    const [selectedLocation, setSelectedLocation] = useState("all")
    const [sortBy, setSortBy] = useState("investment")

    const countries = useMemo(() => {
        return [...new Set(rawInvestments.map(inv => inv.country.ar))]
    }, [])

    const locations = useMemo(() => {
        return [...new Set(rawInvestments.map(inv => inv.location))]
    }, [])

    const filteredInvestments = useMemo(() => {
        return rawInvestments.filter(investment => {
            const matchesSearch = investment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                investment.description.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCountry = selectedCountry === "all" || investment.country.ar === selectedCountry
            const matchesLocation = selectedLocation === "all" || investment.location === selectedLocation
            return matchesSearch && matchesCountry && matchesLocation
        }).sort((a, b) => {
            if (sortBy === "investment") {
                return b.financial_indicators.total_investment_cost - a.financial_indicators.total_investment_cost
            }
            return b.financial_indicators.expected_net_profit - a.financial_indicators.expected_net_profit
        })
    }, [searchQuery, selectedCountry, selectedLocation, sortBy])

    const stats = useMemo(() => {
        const totalInvestment = filteredInvestments.reduce((sum, inv) => sum + inv.financial_indicators.total_investment_cost, 0)
        const totalProfit = filteredInvestments.reduce((sum, inv) => sum + inv.financial_indicators.expected_net_profit, 0)
        const avgROI = filteredInvestments.reduce((sum, inv) => sum + parseFloat(inv.financial_indicators.roi), 0) / filteredInvestments.length

        return [
            { label: "إجمالي الاستثمارات", value: totalInvestment, icon: DollarSign, formatter: formatCurrency },
            { label: "صافي الربح المتوقع", value: totalProfit, icon: TrendingUp, formatter: formatCurrency },
            { label: "متوسط العائد", value: avgROI, icon: TrendingUp, formatter: (v) => `${v.toFixed(2)}%` }
        ]
    }, [filteredInvestments])

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4 text-right">الاستثمارات المتاحة</h1>
                    <p className="text-slate-600 text-right">اكتشف فرص الاستثمار المتنوعة في مختلف المناطق</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {stats.map((stat, i) => (
                        <AnimatedStat key={i} {...stat} />
                    ))}
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg shadow-green-900/5 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <Input
                                placeholder="ابحث عن استثمار..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="pl-10 text-right"
                            />
                        </div>
                        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                            <SelectTrigger>
                                <SelectValue placeholder="اختر الدولة" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">جميع الدول</SelectItem>
                                {countries.map(country => (
                                    <SelectItem key={country} value={country}>{country}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                            <SelectTrigger>
                                <SelectValue placeholder="اختر المنطقة" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">جميع المناطق</SelectItem>
                                {locations.map(location => (
                                    <SelectItem key={location} value={location}>{location}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger>
                                <SelectValue placeholder="ترتيب حسب" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="investment">حجم الاستثمار</SelectItem>
                                <SelectItem value="profit">الربح المتوقع</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredInvestments.map(investment => (
                        <motion.div
                            key={investment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg shadow-green-900/5 border border-slate-100 hover:border-green-500/50 transition-colors"
                        >
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-slate-900 mb-2 text-right">{investment.name}</h3>
                                <p className="text-slate-600 mb-4 text-right line-clamp-2">{investment.description}</p>
                                
                                <div className="flex items-center gap-2 mb-2 justify-end">
                                    <span className="text-slate-600">{investment.country.ar}</span>
                                    <Globe className="h-4 w-4 text-slate-400" />
                                </div>
                                <div className="flex items-center gap-2 mb-4 justify-end">
                                    <span className="text-slate-600">{investment.location}</span>
                                    <MapPin className="h-4 w-4 text-slate-400" />
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-slate-900">
                                            {formatCurrency(investment.financial_indicators.total_investment_cost)}
                                        </span>
                                        <span className="text-slate-500">حجم الاستثمار</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-green-600 font-semibold">{investment.financial_indicators.roi}</span>
                                        <span className="text-slate-500">العائد المتوقع</span>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <Badge variant="outline" className="w-full justify-center">
                                        فترة الاسترداد: {investment.financial_indicators.payback_period}
                                    </Badge>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    )
}
