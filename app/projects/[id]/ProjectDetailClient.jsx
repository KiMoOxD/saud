"use client"

import { motion } from "framer-motion"
import { MapPin, DollarSign, Target, Award, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import BookingSystem from "@/components/booking-system"
import { sectorNames, countryNames } from "@/data/projects"

export default function ProjectDetailClient({ project }) {
  const formatCurrency = (amount) => {
    if (typeof amount !== "number") return "غير محدد"
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getSectorColor = (sector) => {
    const colors = {
      Healthcare: "from-blue-500 to-blue-400",
      Agriculture: "from-green-500 to-green-400",
      Manufacturing: "from-orange-500 to-orange-400",
      Technology: "from-purple-500 to-purple-400",
      Real_Estate_Commercial: "from-rose-500 to-rose-400",
      Tourism: "from-teal-500 to-teal-400",
      Labor_HR_Services: "from-indigo-500 to-indigo-400",
      Design_Interior_Decoration: "from-amber-500 to-amber-400",
      Mining_Raw_Materials: "from-stone-500 to-stone-400",
      Construction_Safety: "from-red-500 to-red-400",
    }
    return colors[sector] || "from-gray-500 to-gray-400"
  }

  return (
    <main className="min-h-screen bg-white" dir="rtl">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-50 via-emerald-50 to-white">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23065f46' fillOpacity='0.4'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40zm0-40h2l-2 2V0zm0 4l4-4h2l-6 6V4zm0 4l8-8h2L40 10V8zm0 4L52 0h2L40 14v-2zm0 4L56 0h2L40 18v-2zm0 4L60 0h2L40 22v-2zm0 4L64 0h2L40 26v-2zm0 4L68 0h2L40 30v-2zm0 4L72 0h2L40 34v-2zm0 4L76 0h2L40 38v-2zm0 4L80 0v2L42 40h-2zm4 0L80 4v2L46 40h-2zm4 0L80 8v2L50 40h-2zm4 0l28-28v2L54 40h-2zm4 0l24-24v2L58 40h-2zm4 0l20-20v2L62 40h-2zm4 0l16-16v2L66 40h-2zm4 0l12-12v2L70 40h-2zm4 0l8-8v2l-6 6h-2zm4 0l4-4v2l-2 2h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative">
          {/* Breadcrumb */}
          <div className="flex items-center mb-8">
            <Link href="/" className="text-teal-700 hover:text-amber-600 transition-colors">
              الرئيسية
            </Link>
            <span className="mx-2 text-gray-500">/</span>
            <Link href="/projects" className="text-teal-700 hover:text-amber-600 transition-colors">
              المشاريع
            </Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-amber-600">{project.project_name}</span>
          </div>

          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-wrap gap-3 mb-6">
              <Badge className={`bg-gradient-to-r ${getSectorColor(project.sector)} text-white`}>
                {sectorNames[project.sector]}
              </Badge>
              <Badge variant="outline">{countryNames[project.country] || project.country}</Badge>
            </div>

            <h1
              className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${getSectorColor(
                project.sector,
              )} bg-clip-text text-transparent mb-6`}
            >
              {project.project_name}
            </h1>

            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">{project.description}</p>

            <div className="flex flex-col sm:flex-row gap-4">
              <BookingSystem />
              <Button variant="outline" className="border-teal-700 text-teal-700 hover:bg-teal-50">
                تحميل دراسة الجدوى
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Project Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-teal-600" />
                      نظرة عامة على المشروع
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">الموقع والمساحة</h4>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{project.location}</span>
                        {project.area !== "غير محدد" && <span>• {project.area}</span>}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">التوافق مع رؤية الدولة</h4>
                      <p className="text-gray-600 leading-relaxed">{project.vision_alignment}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">حجم السوق</h4>
                      <p className="text-gray-600 leading-relaxed">{project.market_size}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Competitive Advantage */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-amber-600" />
                      الميزة التنافسية
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">{project.competitive_advantage}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Financial Indicators */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-emerald-600" />
                      المؤشرات المالية
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {typeof project.financial_indicators.total_investment === "number" && (
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-600">إجمالي الاستثمار</span>
                        <span className="font-bold text-emerald-600">
                          {formatCurrency(project.financial_indicators.total_investment)}
                        </span>
                      </div>
                    )}

                    {project.financial_indicators.internal_rate_of_return !== "غير محدد" && (
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-600">معدل العائد الداخلي</span>
                        <span className="font-bold text-teal-600">
                          {project.financial_indicators.internal_rate_of_return}
                        </span>
                      </div>
                    )}

                    {project.financial_indicators.payback_period !== "غير محدد" && (
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-600">فترة الاسترداد</span>
                        <span className="font-bold text-purple-600">{project.financial_indicators.payback_period}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-amber-500" />
                      إجراءات سريعة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <BookingSystem />
                    <Button variant="outline" className="w-full">
                      طلب دراسة مفصلة
                    </Button>
                    <Button variant="outline" className="w-full">
                      تحميل الملف التعريفي
                    </Button>
                  </CardContent>
                </Card>

                {/* Project Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>إحصائيات المشروع</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">القطاع</span>
                      <span className="text-sm font-medium">{sectorNames[project.sector]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">الدولة</span>
                      <span className="text-sm font-medium">{countryNames[project.country] || project.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">الموقع</span>
                      <span className="text-sm font-medium">{project.location}</span>
                    </div>
                    {project.area !== "غير محدد" && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">المساحة</span>
                        <span className="text-sm font-medium">{project.area}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-b from-white to-teal-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8 border-0 relative overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div
              className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getSectorColor(project.sector)}`}
            ></div>

            <h3 className="text-2xl font-bold text-teal-800 mb-4 text-center">هل أنت مهتم بمشروع مماثل؟</h3>
            <p className="text-gray-700 mb-8 text-center">
              فريقنا من الخبراء جاهز لمساعدتك في تطوير مشروع مماثل أو تخصيص دراسة جدوى لاحتياجاتك الخاصة.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <BookingSystem />
              <Button variant="outline" className="border-teal-700 text-teal-700 hover:bg-teal-50">
                تصفح المزيد من المشاريع
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
