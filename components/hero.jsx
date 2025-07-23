"use client"

import { Button } from "@/components/ui/button"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useInView } from "react-intersection-observer"
import BookingModal from "@/components/booking-modal" // Assumed path
import { Sparkles, TrendingUp, Lightbulb, Shield, Zap, ArrowLeft } from "lucide-react"
import React, { useState, useEffect } from "react"

// --- Helper Component: AnimatedStat ---
const AnimatedStat = ({ value, label, icon: Icon, iconColor }) => {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  useEffect(() => {
    if (inView) {
      const controls = animate(count, value, { duration: 2, ease: "easeOut" })
      return controls.stop
    }
  }, [inView, count, value])

  return (
    <motion.div
      ref={ref}
      className="text-center"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      }}
    >
      <div className="flex items-center justify-center gap-2">
        <Icon className={`w-7 h-7 ${iconColor}`} />
        <motion.span className="text-4xl font-bold text-slate-50">{rounded}</motion.span>
        <span className="text-4xl font-bold text-slate-50">{label.includes("+") && "+"}</span>
      </div>
      <p className="text-sm text-slate-300 mt-1">{label.replace("+", "")}</p>
    </motion.div>
  )
}


// --- Main Hero Component ---
export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { ref: heroRef, inView: heroInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  }

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } },
  }

  const stats = [
    { icon: TrendingUp, value: 500, label: "مشروع ناجح+", iconColor: "text-green-400" },
    { icon: Lightbulb, value: 15, label: "سنة خبرة", iconColor: "text-amber-400" },
    { icon: Shield, value: 98, label: "رضا العملاء %", iconColor: "text-green-400" },
    { icon: Zap, value: 24, label: "دعم فني/7", iconColor: "text-slate-400" },
  ]

  return (
    <section 
      ref={heroRef} 
      // UPDATED: Base color is now a lighter, more vibrant dark green.
      className="relative w-full min-h-screen flex items-center justify-center py-24 md:py-32 overflow-hidden bg-[#006C35]" 
      dir="rtl"
    >
      {/* Background Liquid Effect */}
      <div className="absolute inset-0 z-0 filter blur-3xl">
        
        {/* UPDATED: Mixture of lighter colored blobs for the liquid effect */}
        <motion.div 
          className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/50 rounded-full"
          animate={{
            x: [-100, 50, -100],
            y: [-50, 100, -50],
            rotate: [0, 180, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-green-600/60 rounded-full"
          animate={{
            x: [100, -100, 100],
            y: [50, -150, 50],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 50, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror', delay: 5 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/3 w-80 h-80 bg-teal-700/50 rounded-full"
          animate={{
            y: [80, -80, 80],
            x: [50, -50, 50],
            scale: [1, 0.9, 1]
          }}
          transition={{ duration: 60, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror', delay: 10 }}
        />
         <motion.div 
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-600/50 rounded-full"
          animate={{
            y: [-80, 80, -80],
            rotate: [0, -180, 0],
          }}
          transition={{ duration: 70, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror', delay: 15 }}
        />
      </div>

      <div className="relative z-20 container mx-auto px-4 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
        >
          {/* Top badge updated for better contrast */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-semibold text-green-100 bg-white/10 border border-green-400/20 rounded-full shadow-sm backdrop-blur-sm"
          >
            <Sparkles className="w-5 h-5 text-green-300" />
            <span>رواد الاستشارات الاقتصادية في المنطقة</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight"
          >
            نحن شركاؤكم في تحويل الأفكار إلى
            <br />
            <span className="relative inline-block mt-2">
              {/* Headline gradient made brighter */}
              <span className="bg-gradient-to-r from-green-200 to-emerald-300 bg-clip-text text-transparent">
                مشاريع ناجحة
              </span>
              <motion.span
                className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-green-300 to-emerald-400"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: heroInView ? 1 : 0 }}
                transition={{ duration: 1, delay: 0.8, ease: [0.25, 1, 0.5, 1] }}
                style={{ originX: 1 }}
              />
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-slate-200 mb-12 max-w-3xl mx-auto"
          >
            نقدم حلولًا استشارية شاملة تُبنى على أسس علمية وخبرات عملية ميدانية، لنجسد جسرًا يربط بين رؤيتكم والواقع.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex justify-center items-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}>
              {/* Button updated for high contrast */}
              <Button
                onClick={() => setIsModalOpen(true)}
                className="!py-3.5 !px-8 !text-base !font-bold !rounded-full !shadow-lg !bg-green-400 hover:!bg-green-300 !text-green-950 transition-all duration-300"
              >
                اطلب استشارة مجانية
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* --- Stats Section --- */}
        <motion.div
          className="mt-24 w-full"
          variants={containerVariants}
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
        >
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-4">
            {stats.map((stat, i) => (
              <AnimatedStat
                key={i}
                value={stat.value}
                label={stat.label}
                icon={stat.icon}
                iconColor={stat.iconColor}
              />
            ))}
          </div>
        </motion.div>
      </div>
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}