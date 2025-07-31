"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, DollarSign, Target, Award, Lightbulb, Download, FileText, Calendar, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import BookingModal from "@/components/booking-modal"

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
  const [imageError, setImageError] = useState(false)
  
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
      Healthcare: { gradient: "from-blue-600 to-blue-500", text: "text-blue-600", bg: "bg-blue-50" },
      Agriculture: { gradient: "from-green-600 to-green-500", text: "text-green-600", bg: "bg-green-50" },
      Manufacturing: { gradient: "from-orange-600 to-orange-500", text: "text-orange-600", bg: "bg-orange-50" },
      Technology: { gradient: "from-purple-600 to-purple-500", text: "text-purple-600", bg: "bg-purple-50" },
      "Real estate": { gradient: "from-rose-600 to-rose-500", text: "text-rose-600", bg: "bg-rose-50" },
      Tourism: { gradient: "from-teal-600 to-teal-500", text: "text-teal-600", bg: "bg-teal-50" },
      "Human Resources": { gradient: "from-indigo-600 to-indigo-500", text: "text-indigo-600", bg: "bg-indigo-50" },
      "Interior Design": { gradient: "from-amber-600 to-amber-500", text: "text-amber-600", bg: "bg-amber-50" },
      "Mining and Quarrying": { gradient: "from-slate-600 to-slate-500", text: "text-slate-600", bg: "bg-slate-50" },
      "Food and Beverage": { gradient: "from-pink-600 to-pink-500", text: "text-pink-600", bg: "bg-pink-50" },
      "Recycling and Waste Management": { gradient: "from-lime-600 to-lime-500", text: "text-lime-600", bg: "bg-lime-50" },
      "Education": { gradient: "from-cyan-600 to-cyan-500", text: "text-cyan-600", bg: "bg-cyan-50" },
      "Food Processing": { gradient: "from-yellow-600 to-yellow-500", text: "text-yellow-600", bg: "bg-yellow-50" },
    }
    return colors[sectorKey] || { gradient: "from-gray-600 to-gray-500", text: "text-gray-600", bg: "bg-gray-50" }
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
  
  const SecondaryButton = ({ children, icon: Icon, className = "", ...props }) => (
    <Button
      variant="outline"
      className={`border-gray-300 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 transition-all duration-300 flex items-center gap-2 ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </Button>
  )
  
  const headlineWords = project.project_name.split(" ");
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800" dir="rtl">
      <Navbar />
      
      {/* Hero Section with Image */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          {!imageError ? (
            <Image
              src={project.image}
              alt={project.project_name}
              fill
              className="object-cover"
              quality={100}
              priority
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center p-8">
                <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 text-lg">صورة غير متوفرة</p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        </div>
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 py-16">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-4xl leading-tight"
            >
              {project.project_name}
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-wrap gap-3"
            >
              <Badge className={`bg-white/20 backdrop-blur-sm text-white border-white/30 px-4 py-1.5 text-sm`}>
                {project.sector.ar}
              </Badge>
              <Badge className={`bg-white/20 backdrop-blur-sm text-white border-white/30 px-4 py-1.5 text-sm`}>
                {project.governate}، {project.country.ar}
              </Badge>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Breadcrumb and Key Info */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100"></div>
        <div className="container mx-auto px-4 relative">
          <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            <motion.div variants={itemVariants} className="flex items-center mb-10 text-sm">
              <Link href="/" className="text-teal-700 hover:text-amber-600 transition-colors"> الرئيسية </Link>
              <span className="mx-2 text-gray-400">/</span>
              <Link href="/projects" className="text-teal-700 hover:text-amber-600 transition-colors"> المشاريع </Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-amber-600 font-medium">{project.project_name}</span>
            </motion.div>
            
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className={`h-1 w-full bg-gradient-to-r ${getSectorColor(project.sector.en).gradient}`}></div>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MapPin className="w-5 h-5 text-teal-600" />
                      <span>الموقع</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 font-medium">{project.governate}، {project.country.ar}</p>
                    <p className="text-sm text-gray-500 mt-1">{project.location}</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className={`h-1 w-full bg-gradient-to-r ${getSectorColor(project.sector.en).gradient}`}></div>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Target className="w-5 h-5 text-teal-600" />
                      <span>القطاع</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className={`${getSectorColor(project.sector.en).bg} ${getSectorColor(project.sector.en).text} border-none px-4 py-1.5`}>
                      {project.sector.ar}
                    </Badge>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className={`h-1 w-full bg-gradient-to-r ${getSectorColor(project.sector.en).gradient}`}></div>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <DollarSign className="w-5 h-5 text-teal-600" />
                      <span>الاستثمار الكلي</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 font-bold text-xl">{formatCurrency(project.financial_indicators.total_investment)}</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                <div className="lg:col-span-2">
                  <Card className="bg-white border-0 shadow-lg h-full">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-gray-800">وصف المشروع</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed text-lg">{project.description}</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-teal-50 to-emerald-50 border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Award className="w-5 h-5 text-amber-500" />
                        <span>الميزة التنافسية</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{project.competitive_advantage}</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Lightbulb className="w-5 h-5 text-yellow-500" />
                        <span>الرؤية والتوافق</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{project.vision_alignment}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <PrimaryButton className="text-lg px-8 py-4 shadow-xl">طلب استشارة</PrimaryButton>
                <SecondaryButton icon={Download} className="text-lg px-8 py-4">
                  تحميل دراسة الجدوى
                </SecondaryButton>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Detailed Information Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">تفاصيل المشروع</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 mx-auto rounded-full"></div>
            </div>
            
            <motion.div
              className="grid lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={containerVariants}
            >
              <div className="lg:col-span-2 space-y-8">
                <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300 } }}>
                  <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
                    <div className={`h-1 w-full bg-gradient-to-r ${getSectorColor(project.sector.en).gradient}`}></div>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <Target className={`h-6 w-6 ${getSectorColor(project.sector.en).text}`} />
                        نظرة عامة على المشروع
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 text-gray-600">
                      <p className="leading-relaxed text-lg">{project.vision_alignment}</p>
                      <p className="leading-relaxed text-lg">{project.market_size}</p>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300 } }}>
                  <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
                    <div className={`h-1 w-full bg-gradient-to-r from-amber-500 to-orange-500`}></div>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <Award className="h-6 w-6 text-amber-500" />
                        الميزة التنافسية
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed text-lg">{project.competitive_advantage}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
              
              <div className="lg:sticky top-24 space-y-6">
                <motion.div variants={itemVariants}>
                  <Card className="shadow-lg border-0 overflow-hidden">
                    <div className={`h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-500`}></div>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <DollarSign className="h-6 w-6 text-emerald-500" />
                        المؤشرات المالية
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-baseline border-b border-gray-200/80 py-3">
                        <span className="text-gray-600">إجمالي الاستثمار</span>
                        <span className="font-bold text-xl text-emerald-600">{formatCurrency(project.financial_indicators.total_investment)}</span>
                      </div>
                      <div className="flex justify-between items-baseline border-b border-gray-200/80 py-3">
                        <span className="text-gray-600">معدل العائد الداخلي</span>
                        <span className="font-bold text-xl text-teal-600">{project.financial_indicators.internal_rate_of_return}</span>
                      </div>
                      <div className="flex justify-between items-baseline py-3">
                        <span className="text-gray-600">فترة الاسترداد</span>
                        <span className="font-bold text-xl text-purple-600">{project.financial_indicators.payback_period}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card className="shadow-lg border-0 overflow-hidden">
                    <div className={`h-1 w-full bg-gradient-to-r from-amber-500 to-orange-500`}></div>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <Calendar className="h-6 w-6 text-amber-500" />
                        الجدول الزمني
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">بدء المشروع</span>
                        <span className="font-medium">Q2 2023</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">انتهاء المشروع</span>
                        <span className="font-medium">Q4 2025</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card className="shadow-lg border-0 overflow-hidden">
                    <div className={`h-1 w-full bg-gradient-to-r from-teal-500 to-emerald-500`}></div>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <Lightbulb className="h-6 w-6 text-yellow-500" />
                        إجراءات سريعة
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <PrimaryButton className="w-full">طلب استشارة</PrimaryButton>
                      <SecondaryButton icon={FileText} className="w-full">طلب دراسة مفصلة</SecondaryButton>
                      <SecondaryButton icon={Download} className="w-full">تحميل الملف التعريفي</SecondaryButton>
                    </CardContent>
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