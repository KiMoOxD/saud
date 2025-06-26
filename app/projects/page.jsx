"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, MapPin, DollarSign, TrendingUp, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { getAllProjects, sectorNames, countryNames } from "@/data/projects"

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("all")
  const [selectedSector, setSelectedSector] = useState("all")
  const [sortBy, setSortBy] = useState("investment")

  const allProjects = getAllProjects()

  const filteredAndSortedProjects = useMemo(() => {
    const filtered = allProjects.filter((project) => {
      const matchesSearch =
        project.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.location.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCountry = selectedCountry === "all" || project.country === selectedCountry
      const matchesSector = selectedSector === "all" || project.sector === selectedSector

      return matchesSearch && matchesCountry && matchesSector
    })

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "investment":
          const aInvestment =
            typeof a.financial_indicators.total_investment === "number" ? a.financial_indicators.total_investment : 0
          const bInvestment =
            typeof b.financial_indicators.total_investment === "number" ? b.financial_indicators.total_investment : 0
          return bInvestment - aInvestment
        case "roi":
          const aROI = Number.parseFloat(a.financial_indicators.internal_rate_of_return) || 0
          const bROI = Number.parseFloat(b.financial_indicators.internal_rate_of_return) || 0
          return bROI - aROI
        case "name":
          return a.project_name.localeCompare(b.project_name, "ar")
        default:
          return 0
      }
    })

    return filtered
  }, [allProjects, searchQuery, selectedCountry, selectedSector, sortBy])

  const formatCurrency = (amount) => {
    if (typeof amount !== "number") return "غير محدد"
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
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
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-l from-teal-800 via-emerald-600 to-teal-500 bg-clip-text text-transparent mb-6">
              محفظة مشاريعنا
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
              اكتشف أكثر من {allProjects.length} مشروعًا ناجحًا عبر 4 دول و12 قطاعًا متخصصًا
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-teal-600">{allProjects.length}+</div>
                <div className="text-sm text-gray-600">مشروع</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-amber-600">4</div>
                <div className="text-sm text-gray-600">دول</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-emerald-600">12</div>
                <div className="text-sm text-gray-600">قطاع</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-purple-600">500M+</div>
                <div className="text-sm text-gray-600">دولار استثمارات</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="البحث في المشاريع..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="اختر الدولة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الدول</SelectItem>
                  {Object.keys(countryNames).map((country) => (
                    <SelectItem key={country} value={country}>
                      {countryNames[country]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="اختر القطاع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع القطاعات</SelectItem>
                  {Object.keys(sectorNames).map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sectorNames[sector]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="ترتيب حسب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="investment">حجم الاستثمار</SelectItem>
                  <SelectItem value="roi">معدل العائد</SelectItem>
                  <SelectItem value="name">الاسم</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredAndSortedProjects.map((project) => (
              <motion.div key={project.id} variants={itemVariants}>
                <Link href={`/projects/${project.id}`}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="secondary" className="mb-2">
                          {sectorNames[project.sector]}
                        </Badge>
                        <Badge variant="outline">{project.country}</Badge>
                      </div>
                      <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-teal-700 transition-colors line-clamp-2">
                        {project.project_name}
                      </CardTitle>
                      <CardDescription className="line-clamp-3">{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{project.location}</span>
                        </div>

                        {typeof project.financial_indicators.total_investment === "number" && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <DollarSign className="h-4 w-4" />
                            <span>{formatCurrency(project.financial_indicators.total_investment)}</span>
                          </div>
                        )}

                        {project.financial_indicators.internal_rate_of_return !== "غير محدد" && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <TrendingUp className="h-4 w-4" />
                            <span>معدل العائد: {project.financial_indicators.internal_rate_of_return}</span>
                          </div>
                        )}

                        {project.financial_indicators.payback_period !== "غير محدد" && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>فترة الاسترداد: {project.financial_indicators.payback_period}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 text-amber-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        عرض التفاصيل ←
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {filteredAndSortedProjects.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">لم يتم العثور على مشاريع تطابق معايير البحث</div>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCountry("all")
                  setSelectedSector("all")
                }}
                className="mt-4"
                variant="outline"
              >
                إعادة تعيين الفلاتر
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
