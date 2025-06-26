"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function ServiceDetail({ service }) {
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
    <>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background with gradient and pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-teal-50 via-emerald-50 to-white">
          {/* Saudi-inspired geometric pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23065f46' fillOpacity='0.4'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40zm0-40h2l-2 2V0zm0 4l4-4h2l-6 6V4zm0 4l8-8h2L40 10V8zm0 4L52 0h2L40 14v-2zm0 4L56 0h2L40 18v-2zm0 4L60 0h2L40 22v-2zm0 4L64 0h2L40 26v-2zm0 4L68 0h2L40 30v-2zm0 4L72 0h2L40 34v-2zm0 4L76 0h2L40 38v-2zm0 4L80 0v2L42 40h-2zm4 0L80 4v2L46 40h-2zm4 0L80 8v2L50 40h-2zm4 0l28-28v2L54 40h-2zm4 0l24-24v2L58 40h-2zm4 0l20-20v2L62 40h-2zm4 0l16-16v2L66 40h-2zm4 0l12-12v2L70 40h-2zm4 0l8-8v2l-6 6h-2zm4 0l4-4v2l-2 2h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="flex items-center mb-8">
            <Link href="/" className="text-teal-700 hover:text-amber-600 transition-colors">
              الرئيسية
            </Link>
            <span className="mx-2 text-gray-500">/</span>
            <Link href="/#services" className="text-teal-700 hover:text-amber-600 transition-colors">
              خدماتنا
            </Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-amber-600">{service.title}</span>
          </div>

          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1
              className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${service.color} bg-clip-text text-transparent mb-6`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {service.title}
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {service.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button
                className={`bg-gradient-to-r ${service.color} hover:opacity-90 text-white text-lg px-8 py-6 shadow-lg`}
              >
                طلب هذه الخدمة
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Sub-services Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-amber-400/10 to-transparent rounded-br-full"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-teal-400/10 to-transparent rounded-tl-full"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2
              className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${service.color} bg-clip-text text-transparent mb-4`}
            >
              خدماتنا في مجال {service.title}
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              نقدم مجموعة متكاملة من الخدمات المتخصصة في {service.title} لتلبية احتياجات عملائنا بأعلى معايير الجودة
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {service.subServices.map((subService, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <Card className="h-full border-0 hover:shadow-xl transition-all duration-300 overflow-hidden relative">
                  {/* Card background with gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-white z-0"></div>

                  {/* Decorative accent */}
                  <div className={`absolute top-0 right-0 w-full h-1 bg-gradient-to-r ${service.color}`}></div>

                  <CardHeader className="pb-2 relative z-10">
                    <CardTitle className="text-xl font-bold text-gray-800">{subService.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="text-gray-700 text-base">{subService.description}</CardDescription>
                    <div className="mt-4">
                      <Button
                        variant="ghost"
                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 p-0 flex items-center gap-2"
                      >
                        <span>اطلب هذه الخدمة</span>
                        <ArrowRight size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-b from-white to-teal-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-amber-400/10 to-transparent rounded-br-full"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-teal-400/10 to-transparent rounded-tl-full"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8 border-0 relative overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            {/* Decorative accent */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${service.color}`}></div>

            <h3 className="text-2xl font-bold text-teal-800 mb-4 text-center">هل أنت مستعد لبدء مشروعك؟</h3>
            <p className="text-gray-700 mb-8 text-center">
              فريقنا من الخبراء جاهز لمساعدتك في تحقيق أهدافك. تواصل معنا اليوم للحصول على استشارة مجانية.
            </p>
            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                className={`bg-gradient-to-r ${service.color} hover:opacity-90 text-white text-lg px-8 py-6 shadow-lg`}
              >
                تواصل معنا الآن
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
