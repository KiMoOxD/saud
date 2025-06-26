"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { motion, useInView, animate } from "framer-motion"
import Link from "next/link"
import { getProjectsByCountry } from "@/data/projects"
import { useEffect, useRef } from "react"
import { Globe, ArrowLeft, MapPin, Trophy, Star, Sparkles, TrendingUp, Users, Award } from "lucide-react"

// Animated Counter for Project Numbers
function AnimatedCounter({ value }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView && ref.current) {
      const node = ref.current;
      const controls = animate(0, value, {
        duration: 2.5,
        ease: [0.16, 1, 0.3, 1],
        onUpdate(latest) {
          node.textContent = Math.round(latest);
        },
      });
      return () => controls.stop();
    }
  }, [isInView, value]);

  return <span ref={ref}>0</span>;
}

// Enhanced floating particles animation
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${
            i % 3 === 0 ? 'w-1 h-1 bg-emerald-400/40' :
            i % 3 === 1 ? 'w-2 h-2 bg-teal-400/30' :
            'w-1.5 h-1.5 bg-cyan-400/35'
          }`}
          animate={{
            x: [0, Math.random() * 200 - 100],
            y: [0, Math.random() * -200],
            rotate: [0, 360],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${50 + Math.random() * 50}%`,
          }}
        />
      ))}
    </div>
  )
}

// Animated mesh background
function MeshBackground() {
  return (
    <div className="absolute inset-0 opacity-30">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-teal-500/5"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
          <defs>
            <pattern id="mesh" patternUnits="userSpaceOnUse" width="40" height="40">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="url(#gradient)" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#0d9488" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#mesh)" />
        </svg>
      </div>
    </div>
  )
}

export default function Countries() {
  const countries = [
    {
      name: "المملكة العربية السعودية",
      flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Flag_of_Saudi_Arabia.svg/1200px-Flag_of_Saudi_Arabia.svg.png",
      key: "السعودية",
      projects: getProjectsByCountry("السعودية").length,
      primaryColor: "emerald",
      accentColor: "green",
      gradients: {
        card: "from-emerald-50/90 via-green-50/80 to-emerald-100/90",
        glow: "from-emerald-300/40 to-green-400/40",
        border: "from-emerald-200/60 to-green-300/60",
        text: "from-emerald-700 to-green-600"
      },
      icon: Trophy,
    },
    {
      name: "الإمارات العربية المتحدة",
      flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_the_United_Arab_Emirates.svg/1200px-Flag_of_the_United_Arab_Emirates.svg.png",
      key: "الإمارات العربية المتحدة",
      projects: getProjectsByCountry("الإمارات العربية المتحدة").length,
      primaryColor: "sky",
      accentColor: "blue",
      gradients: {
        card: "from-sky-50/90 via-blue-50/80 to-cyan-100/90",
        glow: "from-sky-300/40 to-blue-400/40",
        border: "from-sky-200/60 to-blue-300/60",
        text: "from-sky-700 to-blue-600"
      },
      icon: Star,
    },
    {
      name: "قطر",
      flag: "https://upload.wikimedia.org/wikipedia/commons/6/65/Flag_of_Qatar.svg",
      key: "قطر",
      projects: getProjectsByCountry("قطر").length,
      primaryColor: "rose",
      accentColor: "red",
      gradients: {
        card: "from-rose-50/90 via-pink-50/80 to-red-100/90",
        glow: "from-rose-300/40 to-red-400/40",
        border: "from-rose-200/60 to-red-300/60",
        text: "from-rose-700 to-red-600"
      },
      icon: Award,
    },
    {
      name: "مصر",
      flag: "data:image/png;base64,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",
      key: "مصر",
      projects: getProjectsByCountry("مصر").length,
      primaryColor: "amber",
      accentColor: "orange",
      gradients: {
        card: "from-amber-50/90 via-orange-50/80 to-yellow-100/90",
        glow: "from-amber-300/40 to-orange-400/40",
        border: "from-amber-200/60 to-orange-300/60",
        text: "from-amber-700 to-orange-600"
      },
      icon: TrendingUp,
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.4 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 40, rotateX: -15 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 20,
        duration: 0.8
      },
    },
  }

  return (
    <section id="countries" className="py-32 md:py-40 bg-gradient-to-br from-slate-50 via-gray-50/50 to-slate-100 overflow-hidden relative min-h-screen">
      {/* Ultra Premium Background Effects */}
      <MeshBackground />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-50/20 via-transparent to-teal-50/20"></div>
        <div className="absolute top-[-30rem] left-[-30rem] w-[60rem] h-[60rem] bg-gradient-to-br from-emerald-200/15 via-teal-200/15 to-transparent rounded-full filter blur-3xl animate-pulse opacity-60"></div>
        <div className="absolute bottom-[-30rem] right-[-30rem] w-[60rem] h-[60rem] bg-gradient-to-tl from-amber-200/15 via-orange-200/15 to-transparent rounded-full filter blur-3xl animate-pulse opacity-60"></div>
        <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-r from-sky-200/8 via-cyan-200/8 to-blue-200/8 rounded-full filter blur-3xl animate-pulse opacity-40"></div>
      </div>

      <FloatingParticles />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500/8 to-teal-500/8 backdrop-blur-xl px-8 py-4 rounded-full border border-emerald-200/30 mb-8 shadow-lg shadow-emerald-100/20"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          >
            <Sparkles className="h-5 w-5 text-emerald-600" />
            <span className="text-emerald-700 font-bold text-sm tracking-wide">حضور إقليمي متميز</span>
            <Sparkles className="h-5 w-5 text-emerald-600" />
          </motion.div>

          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
            <motion.span
              className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              شركاؤنا
            </motion.span>
            <motion.span
              className="block bg-gradient-to-r from-slate-800 via-gray-700 to-slate-900 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              عبر المنطقة
            </motion.span>
          </h2>

          <motion.p
            className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-medium"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            نقدم خبراتنا ورؤيتنا الاستراتيجية في قلب الاقتصادات الأكثر حيوية في الشرق الأوسط,
            ونفخر بشبكة واسعة من المشاريع الناجحة التي تعكس التزامنا بالتميز والابتكار.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {countries.map((country, index) => {
            const hasProjects = country.projects > 0
            const CardWrapper = hasProjects ? Link : "div"
            const cardProps = hasProjects ? { href: `/country/${encodeURIComponent(country.key)}` } : {}
            const IconComponent = country.icon

            return (
              <motion.div
                key={country.key}
                variants={itemVariants}
                className="h-full perspective-1000"
                whileHover={{ y: -16, rotateY: 5, rotateX: 5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <CardWrapper {...cardProps} className="h-full block">
                  <div className={`group relative h-full transition-all duration-700 transform-gpu ${
                    hasProjects ? "cursor-pointer" : "cursor-not-allowed"
                  }`}>

                    {/* Ultra Premium Glow Effect */}
                    <div className={`absolute -inset-2 rounded-3xl bg-gradient-to-r ${country.gradients.glow} opacity-0 group-hover:opacity-100 transition-all duration-700 blur-xl scale-105`}></div>

                    {/* Main Card with Enhanced Glass Effect */}
                    <div className={`relative h-full bg-gradient-to-br ${country.gradients.card} backdrop-blur-2xl rounded-3xl border-2 border-gradient-to-r ${country.gradients.border} shadow-2xl shadow-slate-200/60 overflow-hidden group-hover:shadow-3xl group-hover:shadow-slate-300/70 transition-all duration-700 ${
                      !hasProjects ? "opacity-70 saturate-50" : ""
                    }`}>

                      {/* Enhanced Decorative Elements */}
                      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-white/40 to-transparent rounded-full -translate-y-20 translate-x-20 group-hover:scale-110 transition-transform duration-700"></div>
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-white/30 to-transparent rounded-full translate-y-16 -translate-x-16 group-hover:scale-110 transition-transform duration-700"></div>

                      {/* Animated background pattern */}
                      <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent transform rotate-45 scale-150"></div>
                      </div>

                      {/* Content */}
                      <CardContent className="relative p-8 flex flex-col items-center text-center h-full">

                        {/* Ultra Premium Flag Display */}
                        <div className="relative mb-8">
                          <motion.div
                            className="relative w-28 h-28 rounded-full bg-white shadow-2xl shadow-slate-400/50 p-3 ring-4 ring-white/60 group-hover:ring-6 group-hover:ring-white/80 transition-all duration-500"
                            whileHover={{ scale: 1.15, rotate: 10 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                          >
                            <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center shadow-inner">
                              <Image
                                src={country.flag}
                                alt={`علم ${country.name}`}
                                width={80}
                                height={80}
                                className="object-cover w-full h-full rounded-full scale-110 group-hover:scale-125 transition-transform duration-500"
                                priority={index < 2}
                              />
                            </div>

                            {/* Multiple Decorative Rings */}
                            <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-spin-slow opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-white/20 via-transparent to-white/20 animate-pulse"></div>
                          </motion.div>

                          {/* Enhanced Status Badge */}
                          {hasProjects && (
                            <motion.div
                              className={`absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r ${country.gradients.text} rounded-full flex items-center justify-center shadow-xl shadow-${country.primaryColor}-300/50 border-2 border-white`}
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: 0.8 + index * 0.15, type: 'spring', stiffness: 400 }}
                              whileHover={{ scale: 1.2, rotate: 15 }}
                            >
                              <IconComponent className="h-5 w-5 text-white" />
                            </motion.div>
                          )}
                        </div>

                        {/* Enhanced Country Name */}
                        <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 leading-tight min-h-[4rem] flex items-center px-2">
                          {country.name}
                        </h3>

                        {/* Enhanced Projects Section */}
                        <div className="mt-auto w-full">
                          {hasProjects ? (
                            <motion.div
                              className="space-y-6"
                              initial={{ opacity: 0, y: 30 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 + index * 0.15 }}
                            >
                              <div className="relative">
                                <div className={`text-6xl md:text-7xl font-black bg-gradient-to-r ${country.gradients.text} bg-clip-text text-transparent drop-shadow-sm`}>
                                  <AnimatedCounter value={country.projects} />
                                </div>
                                <div className="text-sm font-bold text-slate-600 mt-2 tracking-wide">مشروع منجز بتميز</div>
                              </div>

                              {/* Premium Interactive CTA */}
                              <motion.div
                                className={`flex items-center justify-center gap-3 text-sm font-bold bg-gradient-to-r ${country.gradients.text} bg-clip-text text-transparent bg-white/60 backdrop-blur-sm px-5 py-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 border border-${country.primaryColor}-200/50 shadow-lg hover:shadow-xl`}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Sparkles className={`h-4 w-4 text-${country.primaryColor}-600`} />
                                <span>استكشف المشاريع</span>
                                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
                              </motion.div>
                            </motion.div>
                          ) : (
                            <motion.div
                              className="flex items-center justify-center gap-3 text-sm font-bold text-slate-500 bg-slate-100/90 backdrop-blur-sm px-5 py-3 rounded-full border border-slate-200/60 shadow-lg"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.6 + index * 0.15, type: 'spring' }}
                            >
                              <Star className="h-4 w-4" />
                              <span>قريبًا إن شاء الله</span>
                            </motion.div>
                          )}
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </CardWrapper>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Ultra Premium Bottom Section */}
        <motion.div
          className="relative max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          {/* Enhanced Glow Effect */}
          <div className="absolute -inset-6 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-3xl blur-2xl -z-10"></div>
          
          <div className="relative bg-white/70 backdrop-blur-2xl rounded-2xl p-8 md:p-12 border border-white/50 shadow-xl shadow-slate-200/50">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: Metrics */}
              <motion.div
                className="lg:col-span-2 space-y-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                transition={{ staggerChildren: 0.2, delayChildren: 0.2 }}
              >
                {[
                  { number: "15+", label: "سنوات من الخبرة", icon: Award },
                  { number: "50+", label: "عميل راضٍ", icon: Users },
                  { number: "200%", label: "نمو في استثمارات العملاء", icon: TrendingUp }
                ].map((metric) => (
                  <motion.div
                    key={metric.label}
                    className="flex items-center gap-5 p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg shadow-slate-200/60"
                    variants={{
                      hidden: { opacity: 0, x: -30 },
                      visible: { opacity: 1, x: 0, transition: { type: "spring", damping: 15, stiffness: 100 } },
                    }}
                  >
                    <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-400/50">
                      <metric.icon size={28} />
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-slate-800">{metric.number}</p>
                      <p className="text-base text-slate-500 font-medium">{metric.label}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Right Column: Text Content */}
              <div className="lg:col-span-3 text-center lg:text-right">
                <h3 className="text-4xl md:text-5xl font-black mb-6">
                  <span className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent leading-tight block">
                    خبرة عالمية برؤية محلية
                  </span>
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                  بفضل خبرتنا العميقة الممتدة لسنوات في أسواق المنطقة، نقدم استشارات متخصصة تراعي أدق تفاصيل كل سوق وقوانينه المحلية، مما يمكّن عملائنا من التوسع بثقة مطلقة وتحقيق نجاح استثنائي ومستدام عبر الحدود.
                </p>
              </div>
              
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}