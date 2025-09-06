"use client"

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { motion, useMotionValue, useTransform, animate, useScroll, useReducedMotion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Sparkles, TrendingUp, Lightbulb, Shield, Zap, ArrowLeft, Star } from "lucide-react"
import BookingModal from "@/components/booking-modal"

// Memoized AnimatedStat with reduced animations on lower-end devices
const AnimatedStat = React.memo(({ value, label, icon: Icon, index, prefersReducedMotion }) => {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const { ref, inView } = useInView({ 
    triggerOnce: true, 
    threshold: 0.2,
    rootMargin: '50px'
  })

  useEffect(() => {
    if (inView) {
      const controls = animate(count, value, { 
        duration: prefersReducedMotion ? 1 : 2.5, 
        ease: "easeOut",
        delay: prefersReducedMotion ? 0 : index * 0.2 
      })
      return controls.stop
    }
  }, [inView, count, value, index, prefersReducedMotion])

  const cardVariants = useMemo(() => ({
    hidden: { opacity: 0, y: prefersReducedMotion ? 20 : 50, scale: prefersReducedMotion ? 1 : 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: prefersReducedMotion ? 0.3 : 0.8, 
        delay: prefersReducedMotion ? 0 : index * 0.15,
        type: prefersReducedMotion ? "tween" : "spring",
        stiffness: 100
      }
    }
  }), [index, prefersReducedMotion])

  return (
    <motion.div
      ref={ref}
      className="relative group"
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover={prefersReducedMotion ? {} : { scale: 1.05, y: -10 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_60px_rgba(93,197,107,0.15)] transition-all duration-700">
        
        {/* Simplified gradient overlay - only on hover */}
        {!prefersReducedMotion && (
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        )}
        
        <div className="relative z-10 text-center">
          {/* Simplified icon with conditional animation */}
          <motion.div 
            className="relative inline-flex items-center justify-center w-16 h-16 mb-6"
            whileHover={prefersReducedMotion ? {} : { rotate: 360 }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl blur-xl" />
            <div className="relative bg-gradient-to-br from-green-500/10 to-green-600/10 w-full h-full rounded-2xl flex items-center justify-center">
              <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
          </motion.div>
          
          {/* Optimized number display */}
          <div className="flex items-baseline justify-center gap-1 mb-3">
            <motion.span 
              className="text-2xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {rounded}
            </motion.span>
            {(label.includes("+") || label.includes("%") || label.includes("/7")) && (
              <motion.span 
                className="text-xl sm:text-3xl font-black text-green-600"
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={prefersReducedMotion ? { duration: 0.2 } : { delay: 2 + index * 0.2, type: "spring" }}
              >
                {label.includes("+") && "+"}
                {label.includes("%") && "%"}
                {label.includes("/7") && "/7"}
              </motion.span>
            )}
          </div>
          
          <p className="text-xs sm:text-sm text-gray-600 font-medium tracking-wide">
            {label.replace("+", "").replace("%", "").replace('/7', '')}
          </p>
        </div>
      </div>
    </motion.div>
  )
})

// Main Hero Component with performance optimizations
export default function OptimizedHero() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const { scrollY } = useScroll()
  
  // Reduced scroll transforms for better performance
  const y1 = useTransform(scrollY, [0, 300], [0, prefersReducedMotion ? 0 : 50])
  const y2 = useTransform(scrollY, [0, 300], [0, prefersReducedMotion ? 0 : -25])
  
  const { ref: heroRef, inView: heroInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '100px'
  })

  // Memoized animation variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: prefersReducedMotion ? 0.05 : 0.15, 
        delayChildren: prefersReducedMotion ? 0.1 : 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      } 
    },
  }), [prefersReducedMotion])

  const itemVariants = useMemo(() => ({
    hidden: { y: prefersReducedMotion ? 20 : 80, opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: prefersReducedMotion ? "tween" : "spring", 
        stiffness: 80, 
        damping: 20,
        duration: prefersReducedMotion ? 0.3 : 0.8 
      } 
    },
  }), [prefersReducedMotion])

  // Memoized stats data
  const stats = useMemo(() => [
    { icon: TrendingUp, value: 500, label: "مشروع ناجح+" },
    { icon: Lightbulb, value: 15, label: "سنة خبرة" },
    { icon: Shield, value: 98, label: "رضا العملاء %" },
    { icon: Zap, value: 24, label: "دعم فني/7" },
  ], [])

  // Optimized resize handler with debouncing
  const handleResize = useCallback(() => {
    try {
      setIsMobile(window.innerWidth < 640)
    } catch (e) {
      setIsMobile(false)
    }
  }, [])

  useEffect(() => {
    handleResize()
    const debouncedResize = debounce(handleResize, 150)
    window.addEventListener('resize', debouncedResize)
    return () => window.removeEventListener('resize', debouncedResize)
  }, [handleResize])

  // Debounce helper
  function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  const handleModalOpen = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  return (
    <section 
      ref={heroRef} 
      className="relative w-full min-h-screen flex flex-col justify-center py-12 sm:py-16 md:py-24 overflow-hidden bg-white" 
      dir="rtl"
    >

      {/* Content Container */}
      <div className="relative z-20 container mx-auto px-6 max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
        >
          {/* Simplified Badge */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-12"
          >
            <motion.div 
              className="inline-flex items-center gap-4 px-6 py-3 text-sm font-semibold text-green-700 bg-white/60 backdrop-blur-xl border border-white/40 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={prefersReducedMotion ? {} : { scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={prefersReducedMotion ? {} : { rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              <span className="tracking-wider">رواد الاستشارات الاقتصادية</span>
              <Star className="w-4 h-4 text-amber-500" />
            </motion.div>
          </motion.div>

          {/* Optimized Main Heading */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-12"
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black leading-[0.95] tracking-tight mb-8">
              <motion.span 
                className="block text-gray-900"
                initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -50 }}
                animate={heroInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: prefersReducedMotion ? 0.1 : 0.5, duration: prefersReducedMotion ? 0.3 : 0.8 }}
              >
                نحن شركاؤكم في
              </motion.span>
              
              <motion.span 
                className="block mt-2 text-gray-800"
                initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 50 }}
                animate={heroInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: prefersReducedMotion ? 0.2 : 0.7, duration: prefersReducedMotion ? 0.3 : 0.8 }}
              >
                تحويل الأفكار إلى
              </motion.span>
              
              <motion.span className="relative inline-block mt-4 sm:mt-6">
                <motion.span 
                  className="relative z-10 bg-gradient-to-r from-green-600 via-emerald-500 to-green-700 bg-clip-text text-transparent text-2xl sm:text-3xl md:text-5xl lg:text-6xl"
                  initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.8 }}
                  animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: prefersReducedMotion ? 0.3 : 0.9, duration: prefersReducedMotion ? 0.3 : 0.8, type: prefersReducedMotion ? "tween" : "spring" }}
                >
                  مشاريع ناجحة
                </motion.span>
                
                {/* Simplified underline */}
                <motion.div
                  className="absolute -bottom-6 right-0 w-full h-2 bg-gradient-to-r from-transparent via-green-500 to-transparent rounded-full"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={heroInView ? { scaleX: 1, opacity: 0.8 } : {}}
                  transition={{ duration: prefersReducedMotion ? 0.5 : 1.5, delay: prefersReducedMotion ? 0.4 : 1.2 }}
                />
                
                {!prefersReducedMotion && (
                  <>
                    <div className="absolute inset-0 -z-10 blur-3xl bg-green-500/20" />
                    <div className="absolute inset-0 -z-20 blur-[100px] bg-emerald-400/10" />
                  </>
                )}
              </motion.span>
            </h1>
          </motion.div>

          {/* Simplified Description */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-16"
          >
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0, y: prefersReducedMotion ? 10 : 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: prefersReducedMotion ? 0.4 : 1.1, duration: prefersReducedMotion ? 0.3 : 0.8 }}
            >
              نقدم حلولًا استشارية شاملة تُبنى على أسس علمية وخبرات عملية ميدانية,
              <br className="hidden md:block" />
              <motion.span
                className="text-green-700 font-medium"
                initial={{ opacity: 0 }}
                animate={heroInView ? { opacity: 1 } : {}}
                transition={{ delay: prefersReducedMotion ? 0.5 : 1.5, duration: prefersReducedMotion ? 0.3 : 0.8 }}
              >
                لنجسد جسرًا يربط بين رؤيتكم والواقع.
              </motion.span>
            </motion.p>
          </motion.div>

          {/* Optimized CTA Section */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-28"
          >
            <motion.div 
              whileHover={prefersReducedMotion ? {} : { scale: 1.05, y: -5 }} 
              whileTap={{ scale: 0.95 }}
              className="inline-block relative"
            >
              {!prefersReducedMotion && (
                <div className="absolute -inset-4 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-full blur-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
              )}
              
              <button
                onClick={handleModalOpen}
                className="relative py-3 px-8 sm:py-4 sm:px-12 md:py-6 md:px-16 text-base sm:text-lg font-bold rounded-full overflow-hidden group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-[0_15px_50px_rgba(93,197,107,0.4)] hover:shadow-[0_25px_80px_rgba(93,197,107,0.6)] transition-all duration-500"
              >
                <span className="relative z-10 flex items-center gap-4 font-bold text-lg">
                  اطلب استشارة
                  <motion.div
                    animate={prefersReducedMotion ? {} : { x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </motion.div>
                </span>
                
                {/* Simplified background overlay */}
                {!prefersReducedMotion && (
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                    initial={{ x: '-100%', skewX: -15 }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.8 }}
                  />
                )}
              </button>
            </motion.div>
            
            {/* Simplified subtitle */}
            <motion.div
              initial={{ opacity: 0, y: prefersReducedMotion ? 10 : 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: prefersReducedMotion ? 0.6 : 1.8, duration: prefersReducedMotion ? 0.3 : 0.6 }}
              className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-500"
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 bg-green-500 rounded-full ${prefersReducedMotion ? '' : 'animate-pulse'}`} />
                <span>لا يتطلب بطاقة ائتمان</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full" />
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 bg-emerald-500 rounded-full ${prefersReducedMotion ? '' : 'animate-pulse'}`} />
                <span>استشارة فورية</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Optimized Stats Grid */}
          <motion.div
            className="w-full"
            variants={containerVariants}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
              {stats.map((stat, i) => (
                <AnimatedStat
                  key={i}
                  value={stat.value}
                  label={stat.label}
                  icon={stat.icon}
                  index={i}
                  prefersReducedMotion={prefersReducedMotion}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      <BookingModal isOpen={isModalOpen} onClose={handleModalClose} />
    </section>
  )
}