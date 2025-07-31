"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import servicesData from "@/data/services.json"

export default function ServicePage({ params }) {
    const service = servicesData.services.find(s => s.id === parseInt(params.id))

    if (!service) {
        return <div>Service not found</div>
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <Link 
                        href="/services"
                        className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors gap-2 mb-6"
                    >
                        <ArrowRight className="h-4 w-4" />
                        <span>العودة إلى الخدمات</span>
                    </Link>

                    <div className="bg-white rounded-2xl p-8 shadow-lg shadow-green-900/5">
                        <Badge 
                            variant="outline" 
                            className="mb-4 border-green-500/20 text-green-700 bg-green-50 text-lg"
                        >
                            {service.slogan}
                        </Badge>

                        <h1 className="text-4xl font-bold text-slate-900 mb-6 text-right">{service.name}</h1>
                        
                        <div className="prose prose-lg max-w-none text-right">
                            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                {service.description}
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
