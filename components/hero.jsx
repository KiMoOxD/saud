"use client"

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { motion, useMotionValue, useTransform, animate, useScroll, useReducedMotion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Sparkles, TrendingUp, Lightbulb, Shield, Zap, ArrowLeft, Star } from "lucide-react"
import BookingModal from "@/components/booking-modal"

// Simplified AnimatedStat: Removed per-stat useInView (now shared), reduced hovers, lighter shadows
const AnimatedStat = React.memo(({ value, label, icon: Icon, index, inView, prefersReducedMotion }) => {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))

  useEffect(() => {
    if (inView) {
      const controls = animate(count, value, { 
        duration: prefersReducedMotion ? 1 : 2, // Slightly shorter
        ease: "easeOut",
        delay: prefersReducedMotion ? 0 : index * 0.15 
      })
      return controls.stop
    }
  }, [inView, count, value, index, prefersReducedMotion])

  const cardVariants = useMemo(() => ({
    hidden: { opacity: 0, y: prefersReducedMotion ? 10 : 30, scale: prefersReducedMotion ? 1 : 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: prefersReducedMotion ? 0.3 : 0.6, // Faster
        delay: prefersReducedMotion ? 0 : index * 0.1,
        type: prefersReducedMotion ? "tween" : "spring",
        stiffness: 100
      }
    }
  }), [index, prefersReducedMotion])

  return (
    <motion.div
      className="relative group" // Removed whileHover/whileTap for perf; add back if critical
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <div className="overflow-hidden bg-white/90 border border-white/60 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-500"> {/* Lighter shadow, no rgba calc; smaller blur */}
        
        {/* Removed gradient overlay - too repaint-heavy on hover */}
        
        <div className="relative z-10 text-center">
          {/* Simplified icon: No motion wrapper, static rotation on hover only if needed */}
          <div className="relative inline-flex items-center justify-center w-16 h-16 mb-6 group-hover:rotate-12 transition-transform duration-500"> {/* Conditional hover only */}
            <div className="absolute inset-0 bg-green-500/10 rounded-2xl" /> {/* Simplified, no blur */}
            <div className="relative bg-green-500/5 w-full h-full rounded-2xl flex items-center justify-center"> {/* Solid-ish bg */}
              <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
          </div>
          
          {/* Number display */}
          <div className="flex items-baseline justify-center gap-1 mb-3">
            <motion.span 
              className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900" // Removed gradient clip - use solid for perf
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {rounded}
            </motion.span>
            {(label.includes("+") || label.includes("%") || label.includes("/7")) && (
              <motion.span 
                className="text-xl sm:text-3xl font-black text-green-600"
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={prefersReducedMotion ? { duration: 0.2 } : { delay: 1.5 + index * 0.15, type: "spring" }}
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

// Optimized Hero: Batched motions, shared observers, lighter effects
export default function OptimizedHero() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const { scrollY } = useScroll()
  
  // Reduced parallax: Only on key elements, shorter range
  const y1 = useTransform(scrollY, [0, 200], [0, prefersReducedMotion ? 0 : 30]) // Shorter scroll range
  const y2 = useTransform(scrollY, [0, 200], [0, prefersReducedMotion ? 0 : -15])
  
  const { ref: heroRef, inView: heroInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '100px'
  })

  // Shared stat observer: One for the whole grid
  const { ref: statsRef, inView: statsInView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
    rootMargin: '50px'
  })

  // Memoized variants: Simplified, fewer children
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: prefersReducedMotion ? 0.05 : 0.1, // Tighter stagger
        delayChildren: prefersReducedMotion ? 0.1 : 0.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      } 
    },
  }), [prefersReducedMotion])

  const itemVariants = useMemo(() => ({
    hidden: { y: prefersReducedMotion ? 10 : 40, opacity: 0, scale: prefersReducedMotion ? 1 : 0.98 },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: prefersReducedMotion ? "tween" : "spring", 
        stiffness: 80, 
        damping: 20,
        duration: prefersReducedMotion ? 0.3 : 0.6 // Faster base duration
      } 
    },
  }), [prefersReducedMotion])

  // Stats data
  const stats = useMemo(() => [
    { icon: TrendingUp, value: 1200, label: "مشروع ناجح+" },
    { icon: Lightbulb, value: 15, label: "سنة خبرة" },
    { icon: Shield, value: 85, label: "رضا العملاء %" },
    { icon: Zap, value: 24, label: "دعم فني/7" },
  ], [])

  // Debounced resize (unchanged, but minor)
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

  const handleModalOpen = useCallback(() => setIsModalOpen(true), [])
  const handleModalClose = useCallback(() => setIsModalOpen(false), [])

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
          {/* Badge: Simplified motion */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <motion.div 
              className="inline-flex items-center gap-4 px-6 py-3 text-sm font-semibold text-green-700 bg-white/80 border border-white/50 rounded-full shadow-md hover:shadow-lg transition-all duration-300" // Lighter bg/shadow, no blur
              whileHover={prefersReducedMotion ? {} : { scale: 1.02, y: -1 }} // Milder hover
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                animate={prefersReducedMotion ? {} : { rotate: [0, 360] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }} // Slower for less CPU
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              <span className="tracking-wider">رواد الاستشارات الاقتصادية</span>
              <Star className="w-4 h-4 text-amber-500" />
            </motion.div>
          </motion.div>

          {/* Heading: Batched into fewer motions */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black leading-[0.95] tracking-tight mb-8">
              <motion.span 
                className="block text-gray-900"
                initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -30 }}
                animate={heroInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: prefersReducedMotion ? 0.1 : 0.3, duration: prefersReducedMotion ? 0.3 : 0.6 }}
              >
                نحن شركاؤكم في
              </motion.span>
              
              <motion.span 
                className="block mt-2 text-gray-800"
                initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 30 }}
                animate={heroInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: prefersReducedMotion ? 0.2 : 0.4, duration: prefersReducedMotion ? 0.3 : 0.6 }}
              >
                تحويل الأفكار إلى
              </motion.span>
              
              <motion.span 
                className="relative inline-block mt-4 sm:mt-6"
                initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.9 }}
                animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: prefersReducedMotion ? 0.3 : 0.5, duration: prefersReducedMotion ? 0.3 : 0.6, type: prefersReducedMotion ? "tween" : "spring" }}
              >
                <span className="relative z-10 text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-green-600"> {/* Solid color, no gradient clip */}
                  مشاريع ناجحة
                </span>
                
                {/* Simplified underline: No blur */}
                <motion.div
                  className="absolute -bottom-6 right-0 w-full h-2 bg-green-500 rounded-full opacity-60" // Solid bg
                  initial={{ scaleX: 0 }}
                  animate={heroInView ? { scaleX: 1 } : {}}
                  transition={{ duration: prefersReducedMotion ? 0.4 : 1, delay: prefersReducedMotion ? 0.4 : 0.7 }}
                />
                
                {/* Removed multi-blur divs - too heavy */}
              </motion.span>
            </h1>
          </motion.div>

          {/* Description: Single motion */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0, y: prefersReducedMotion ? 5 : 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: prefersReducedMotion ? 0.4 : 0.6, duration: prefersReducedMotion ? 0.3 : 0.5 }}
            >
              نقدم حلولًا استشارية شاملة تُبنى على أسس علمية وخبرات عملية ميدانية,
              <br className="hidden md:block" />
              <span className="text-green-700 font-medium">لنجسد جسرًا يربط بين رؤيتكم والواقع.</span> {/* Inline, no separate motion */}
            </motion.p>
          </motion.div>

          {/* CTA: Simplified hover, no complex overlay */}
          <motion.div variants={itemVariants} className="text-center mb-28">
            <motion.div 
              whileHover={prefersReducedMotion ? {} : { scale: 1.02, y: -2 }} // Milder
              whileTap={{ scale: 0.98 }}
              className="inline-block relative"
            >
              {/* Removed inset blur overlay */}
              
              <button
                onClick={handleModalOpen}
                className="relative py-3 px-8 sm:py-4 sm:px-12 md:py-6 md:px-16 text-base sm:text-lg font-bold rounded-full overflow-hidden group bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300" // Solid bg, lighter shadow, no gradient/rgba
              >
                <span className="relative z-10 flex items-center gap-4 font-bold text-lg">
                  اطلب استشارة
                  <motion.div
                    animate={prefersReducedMotion ? {} : { x: [0, 3, 0] }} // Shorter wiggle
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </motion.div>
                </span>
                
                {/* Removed shine overlay */}
              </button>
            </motion.div>
            
            {/* Subtitle: No motion, static pulses */}
            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 bg-green-500 rounded-full ${prefersReducedMotion ? '' : 'animate-pulse'}`} />
                <span>لا يتطلب بطاقة ائتمان</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full" />
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 bg-emerald-500 rounded-full ${prefersReducedMotion ? '' : 'animate-pulse'}`} />
                <span>استشارة فورية</span>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid: Shared observer, lighter cards */}
          <motion.div
            ref={statsRef}
            className="w-full"
            variants={containerVariants}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"} // Use shared inView
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
              {stats.map((stat, i) => (
                <AnimatedStat
                  key={i}
                  value={stat.value}
                  label={stat.label}
                  icon={stat.icon}
                  index={i}
                  inView={statsInView} // Pass shared
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