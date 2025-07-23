"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, DollarSign, Target, Award, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import BookingModal from "@/components/booking-modal"
// REMOVED: sectorNames and countryNames are no longer needed as the project object contains this info.
// import { sectorNames, countryNames } from "@/data/projects"

// Animation Variants for staggered effect
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
}

export default function ProjectDetailClient({ project }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const formatCurrency = (amount) => {
    if (typeof amount !== "number") return "غير محدد"
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getSectorColor = (sectorKey) => {
    const colors = {
      Healthcare: { gradient: "from-blue-500 to-blue-400", text: "text-blue-500" },
      Agriculture: { gradient: "from-green-500 to-green-400", text: "text-green-500" },
      Manufacturing: { gradient: "from-orange-500 to-orange-400", text: "text-orange-500" },
      Technology: { gradient: "from-purple-500 to-purple-400", text: "text-purple-500" },
      "Real estate": { gradient: "from-rose-500 to-rose-400", text: "text-rose-500" },
      Tourism: { gradient: "from-teal-500 to-teal-400", text: "text-teal-500" },
      "Human Resources": { gradient: "from-indigo-500 to-indigo-400", text: "text-indigo-500" },
      "Interior Design": { gradient: "from-amber-500 to-amber-400", text: "text-amber-500" },
      "Mining and Quarrying": { gradient: "from-slate-500 to-slate-400", text: "text-slate-500" },
       // Added other sectors from your data
      "Food and Beverage": { gradient: "from-pink-500 to-pink-400", text: "text-pink-500" },
      "Recycling and Waste Management": { gradient: "from-lime-500 to-lime-400", text: "text-lime-500" },
      "Education": { gradient: "from-cyan-500 to-cyan-400", text: "text-cyan-500" },
      "Food Processing": { gradient: "from-yellow-500 to-yellow-400", text: "text-yellow-500" },
    }
    return colors[sectorKey] || { gradient: "from-gray-500 to-gray-400", text: "text-gray-500" }
  }

  const PrimaryButton = ({ children, className = "", ...props }) => (
    <Button
      onClick={() => setIsModalOpen(true)}
      className={`bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-500 text-white hover:saturate-150 transition-all duration-300 shadow-lg hover:shadow-emerald-500/30 ${className}`}
      {...props}
    >
      {children}
    </Button>
  )
  
  const headlineWords = project.project_name.split(" ");

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800" dir="rtl">
      <Navbar />

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-50 via-emerald-50 to-gray-50"></div>
        <motion.div
            className="absolute -inset-40 opacity-20"
            animate={{
              transform: ["translateX(0%) translateY(0%) rotate(0deg)", "translateX(10%) translateY(-10%) rotate(20deg)", "translateX(0%) translateY(0%) rotate(0deg)"],
            }}
            transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
            style={{ backgroundImage: 'radial-gradient(circle, #6ee7b7 0%, transparent 60%)' }}
        />
        <div className="container mx-auto px-4 relative">
          <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            <motion.div variants={itemVariants} className="flex items-center mb-8 text-sm">
              <Link href="/" className="text-teal-700 hover:text-amber-600 transition-colors"> الرئيسية </Link>
              <span className="mx-2 text-gray-400">/</span>
              <Link href="/projects" className="text-teal-700 hover:text-amber-600 transition-colors"> المشاريع </Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-amber-600 font-medium">{project.project_name}</span>
            </motion.div>

            <div className="max-w-4xl mx-auto text-center">
              <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3 mb-6">
                {/* UPDATED: Use project.sector.en for color and project.sector.ar for display */}
                <Badge className={`bg-gradient-to-r ${getSectorColor(project.sector.en).gradient} text-white border-none px-4 py-1`}>
                  {project.sector.ar}
                </Badge>
                {/* UPDATED: Use project.country directly */}
                <Badge variant="outline" className="bg-white/50 border-gray-300 px-4 py-1">{project.country}</Badge>
              </motion.div>

              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-6">
                {headlineWords.map((word, index) => (
                    // UPDATED: Use project.sector.en for color logic
                    <motion.span key={index} variants={itemVariants} className={`inline-block mr-3 ${index === headlineWords.length - 1 ? `bg-gradient-to-r ${getSectorColor(project.sector.en).gradient} bg-clip-text text-transparent`: ''}`}>
                        {word}
                    </motion.span>
                ))}
              </h1>

              <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">{project.description}</motion.p>
              
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
                <PrimaryButton>طلب استشارة</PrimaryButton>
                <Button variant="outline" className="border-gray-300 hover:bg-teal-50 hover:text-teal-700">
                  تحميل دراسة الجدوى
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="grid lg:grid-cols-3 gap-8 items-start"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={containerVariants}
            >
              <div className="lg:col-span-2 space-y-8">
                <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300 } }}>
                  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      {/* UPDATED: Use project.sector.en for color logic */}
                      <CardTitle className="flex items-center gap-3"><Target className={`h-6 w-6 ${getSectorColor(project.sector.en).text}`} />نظرة عامة على المشروع</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 text-gray-600">
                        <p className="leading-relaxed">{project.vision_alignment}</p>
                        <p className="leading-relaxed">{project.market_size}</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300 } }}>
                  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3"><Award className="h-6 w-6 text-amber-500" />الميزة التنافسية</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed">{project.competitive_advantage}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              <div className="lg:sticky top-24 space-y-6">
                <motion.div variants={itemVariants}>
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3"><DollarSign className="h-6 w-6 text-emerald-500" />المؤشرات المالية</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                       <div className="flex justify-between items-baseline border-b border-gray-200/80 py-4">
                          <span className="text-gray-600">إجمالي الاستثمار</span>
                          <span className="font-bold text-2xl text-emerald-600">{formatCurrency(project.financial_indicators.total_investment)}</span>
                       </div>
                       <div className="flex justify-between items-baseline border-b border-gray-200/80 py-4">
                          <span className="text-gray-600">معدل العائد الداخلي</span>
                          <span className="font-bold text-2xl text-teal-600">{project.financial_indicators.internal_rate_of_return}</span>
                       </div>
                       <div className="flex justify-between items-baseline py-4">
                          <span className="text-gray-600">فترة الاسترداد</span>
                          <span className="font-bold text-2xl text-purple-600">{project.financial_indicators.payback_period}</span>
                       </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                    <Card className="shadow-lg">
                      <CardHeader><CardTitle className="flex items-center gap-3"><Lightbulb className="h-6 w-6 text-yellow-500"/>إجراءات سريعة</CardTitle></CardHeader>
                      <CardContent className="space-y-3"><PrimaryButton className="w-full">طلب استشارة</PrimaryButton><Button variant="outline" className="w-full">طلب دراسة مفصلة</Button><Button variant="outline" className="w-full">تحميل الملف التعريفي</Button></CardContent>
                    </Card>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  )
}