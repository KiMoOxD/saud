"use client"

import { Button } from "@/components/ui/button"
import { motion, useMotionValue, useTransform } from "framer-motion"
import { useInView } from "react-intersection-observer"
import BookingModal from "@/components/booking-modal" // Import the booking modal
import { Sparkles, Play, TrendingUp, Lightbulb, Shield, Zap } from "lucide-react"
import React, { useState } from "react" // Import useState
import { useIsMobile } from "@/hooks/useIsMobile"

// --- Helper Component: GridCard ---
const GridCard = ({ item, className }) => {
  const isMobile = useIsMobile()

  // 3D Tilt effect logic for Desktop
  const mouseX = useMotionValue(200)
  const mouseY = useMotionValue(125)

  const rotateX = useTransform(mouseY, [0, 250], [10, -10])
  const rotateY = useTransform(mouseX, [0, 400], [-10, 10])

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  const cardStyle = {
    rotateX,
    rotateY,
    transformStyle: "preserve-3d",
  }

  const glowStyle = {
    background: `radial-gradient(circle at ${useTransform(mouseX, (val) => val + "px")} ${useTransform(
      mouseY,
      (val) => val + "px"
    )}, rgba(16, 185, 129, 0.25), transparent 50%)`,
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  }

  if (isMobile) {
    return (
      <motion.div
        variants={cardVariants}
        className={`relative rounded-3xl bg-white/60 border border-slate-200/80 shadow-sm p-6 flex flex-col items-center justify-center text-center h-full ${className}`}
      >
        <div className={`p-3 mb-3 rounded-xl text-white bg-gradient-to-br ${item.color}`}>
          <item.icon size={24} />
        </div>
        <p className="text-3xl font-bold text-slate-800 mb-1">{item.value}</p>
        <p className="text-sm text-slate-600">{item.label}</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(200)
        mouseY.set(125)
      }}
      style={cardStyle}
      variants={cardVariants}
      className={`group relative rounded-3xl bg-white/40 backdrop-blur-md border border-slate-200/80 shadow-sm transition-shadow duration-300 hover:shadow-lg ${className}`}
    >
      <motion.div
        style={glowStyle}
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
      <div className="relative p-6 flex flex-col items-center justify-center text-center h-full">
        <div className={`p-3 mb-3 rounded-xl text-white bg-gradient-to-br ${item.color}`}>
          <item.icon size={24} />
        </div>
        <p className="text-3xl font-bold text-slate-800 mb-1">{item.value}</p>
        <p className="text-sm text-slate-600">{item.label}</p>
      </div>
    </motion.div>
  )
}

// --- Helper Component: HeroGrid ---
const HeroGrid = () => {
  const gridItems = [
    { icon: TrendingUp, value: "500+", label: "مشروع ناجح", color: "from-emerald-500 to-teal-500" },
    { icon: Lightbulb, value: "15+", label: "سنة خبرة", color: "from-amber-400 to-orange-400" },
    { icon: Shield, value: "98%", label: "رضا العملاء", color: "from-blue-500 to-cyan-500" },
    { icon: Zap, value: "24/7", label: "دعم فني", color: "from-purple-500 to-pink-500" },
  ]

  return (
    <div style={{ perspective: "1000px" }}>
      <div className="grid grid-cols-2 gap-4 md:gap-6">
        {gridItems.map((item, i) => (
          <GridCard key={i} item={item} className="h-48" />
        ))}
      </div>
    </div>
  )
}

// --- Main Hero Component ---
export default function Hero() {
  const isMobile = useIsMobile()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { ref: heroRef, inView: heroInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 20, duration: 0.8 } },
  }

  return (
    <section className="relative w-full min-h-screen py-24 md:py-32 overflow-hidden bg-slate-50" dir="rtl">
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute inset-0"
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #A7F3D0 0%, transparent 30%), radial-gradient(circle at 80% 70%, #BAE6FD 0%, transparent 30%)",
          }}
        />
        <div className={`absolute inset-0 ${isMobile ? "bg-white/60" : "bg-white/30 backdrop-blur-sm"}`}></div>

        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <motion.div
            className="absolute top-0 -left-1/3 h-full w-1 bg-gradient-to-b from-transparent via-emerald-200 to-transparent opacity-50"
            animate={{ x: ["0%", "400%"], y: ["-50%", "50%"] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
          />
          <motion.div
            className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-transparent via-cyan-200 to-transparent opacity-50"
            animate={{ x: ["100%", "300%"], y: ["50%", "-50%"] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", repeatType: "mirror", delay: 3 }}
          />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          ref={heroRef}
          className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center"
          variants={containerVariants}
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
        >
          <div className="text-center lg:text-right">
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-emerald-700 bg-emerald-100/70 border border-emerald-200/80 rounded-full"
            >
              <Sparkles size={16} />
              <span>رواد الاستشارات الاقتصادية في المنطقة</span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl font-extrabold text-slate-800 mb-6"
              variants={itemVariants}
            >
              نحن شركاؤكم في تحويل الأفكار إلى
              <span className="block mt-2 bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                مشاريع ناجحة
              </span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0"
              variants={itemVariants}
            >
              نقدم حلولًا استشارية شاملة تُبنى على أسس علمية وخبرات عملية ميدانية، لنجسد جسرًا يربط بين رؤيتكم
              والواقع.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4"
              variants={itemVariants}
            >
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="!py-3 !px-6 !text-base !rounded-xl !shadow-lg !bg-emerald-500 hover:!bg-emerald-600"
                >
                  طلب استشارة
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  className="text-slate-700 hover:bg-slate-200/70 text-base px-6 py-3 rounded-xl group"
                >
                  <Play size={18} className="ml-2 group-hover:scale-110 transition-transform" />
                  شاهد الفيديو
                </Button>
              </motion.div>
            </motion.div>
          </div>

          <motion.div variants={itemVariants}>
            <HeroGrid />
          </motion.div>
        </motion.div>
      </div>
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}