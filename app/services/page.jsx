"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import servicesData from "@/data/services.json"

const { services, company_description } = servicesData;

export default function ServicesPage() {
    const [searchQuery, setSearchQuery] = useState("")

    const filteredServices = useMemo(() => {
        return services.filter(service => 
            service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [searchQuery])

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4 text-right">خدماتنا</h1>
                    <p className="text-slate-600 text-right leading-relaxed">{company_description}</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg shadow-green-900/5 mb-8">
                    <div className="relative w-full md:w-1/3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="ابحث عن خدمة..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-10 text-right"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.map(service => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg shadow-green-900/5 border border-slate-100 hover:border-green-500/50 transition-colors group"
                        >
                            <div className="p-6">
                                <Badge 
                                    variant="outline" 
                                    className="mb-4 border-green-500/20 text-green-700 bg-green-50"
                                >
                                    {service.slogan}
                                </Badge>
                                
                                <h3 className="text-xl font-semibold text-slate-900 mb-3 text-right">{service.name}</h3>
                                
                                <p className="text-slate-600 mb-4 text-right line-clamp-4">{service.description}</p>
                                
                                <div className="mt-4 flex justify-end">
                                    <Link 
                                        href={`/services/${service.id}`}
                                        className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors gap-1 group-hover:gap-2"
                                    >
                                        <span>المزيد من التفاصيل</span>
                                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                                    </Link>
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
