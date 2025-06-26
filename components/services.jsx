"use client"

import { LineChart, Factory, Briefcase, Users, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import Link from "next/link"

export default function Services() {
  const services = [
    {
      icon: <LineChart className="h-12 w-12 text-teal-600" />,
      title: "دراسات الجدوى المبدئية والشاملة",
      description:
        "لا تخاطر بوقتك ومالك! نُقدم لك تقييمًا مبدئيًا سريعًا لفكرتك، نكشف لك مدى جدواها، ثم نعمق التحليل في دراسة شاملة تغطي الجوانب الفنية، المالية، والتسويقية.",
      href: "/services/feasibility-studies",
      color: "from-teal-500 to-emerald-400",
    },
    {
      icon: <Briefcase className="h-12 w-12 text-amber-600" />,
      title: "إعداد الميزانيات وخطط الأعمال",
      description:
        "ميزانيتك ليست مجرد أرقام، بل هي خارطة مالية لمستقبل مشروعك. نُصمم معك خطة عمل واقعية ومُحكمة، تُحدد أولوياتك، وتُوزع مواردك بكفاءة.",
      href: "/services/business-plans",
      color: "from-amber-500 to-yellow-400",
    },
    {
      icon: <Users className="h-12 w-12 text-purple-600" />,
      title: "تحليل المنافسين وتقارير السوق",
      description:
        "اعرف منافسيك أكثر مما يعرفون عن أنفسهم! نُحلل السوق بدقة، نكشف فرصك التنافسية، ونرسم لك استراتيجية تسويقية تُبرز تميزك.",
      href: "/services/market-analysis",
      color: "from-purple-500 to-indigo-400",
    },
    {
      icon: <TrendingUp className="h-12 w-12 text-rose-600" />,
      title: "البدائل الاستثمارية وتقييم الفرص",
      description:
        "ليس كل استثمار مُربحًا، وليس كل فرصة مناسبة لك. نُقيم لك البدائل الاستثمارية المتاحة، ونختار معك الأنسب لرأس مالك وأهدافك.",
      href: "/services/opportunity-evaluation",
      color: "from-rose-500 to-pink-400",
    },
    {
      icon: <Factory className="h-12 w-12 text-blue-600" />,
      title: "خطوط الإنتاج والدراسات الفنية",
      description:
        "من التصميم إلى التصنيع، نُخطط معك لخط إنتاجٍ يُوازن بين الجودة والتكلفة. ندرس الموارد التقنية والعمليات التشغيلية لضمان كفاءة إنتاجية.",
      href: "/services/technical-studies",
      color: "from-blue-500 to-sky-400",
    },
  ]

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
    <section id="services" className="py-20 bg-gradient-to-b from-white to-teal-50 relative overflow-hidden">
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
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-l from-teal-800 via-emerald-600 to-teal-500 bg-clip-text text-transparent mb-4">
            خدماتنا
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            نقدم مجموعة متكاملة من الخدمات الاستشارية المتخصصة لمساعدتك في تحقيق النجاح والنمو المستدام لمشروعك
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Link href={service.href}>
                <Card className="border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full overflow-hidden group relative">
                  {/* Card background with gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-white z-0"></div>

                  {/* Decorative accent */}
                  <div className={`absolute top-0 right-0 w-full h-1 bg-gradient-to-r ${service.color}`}></div>

                  <CardHeader className="pb-2 relative z-10">
                    <motion.div
                      className="mb-4 bg-white/80 w-16 h-16 rounded-full flex items-center justify-center shadow-sm"
                      whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
                    >
                      {service.icon}
                    </motion.div>
                    <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-teal-700 transition-colors duration-300">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="text-gray-700 text-base leading-relaxed">
                      {service.description}
                    </CardDescription>
                    <div className="mt-4 text-amber-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      اكتشف المزيد ←
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
