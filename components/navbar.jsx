"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { usePathname } from 'next/navigation'
import { Menu, X, Briefcase, Home, Sparkles, DollarSign, Wrench } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import BookingModal from "./booking-modal" 

const primaryGradient = "linear-gradient(to right, #5dc56b, #3a9d47)"
const primaryGradientHover = "linear-gradient(to right, #4caf50, #2e7d37)" // Slightly darker for hover states

// Memoized BookingSystem component
const BookingSystem = ({ onModalStateChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    onModalStateChange?.(false)
    document.body.style.overflow = "auto"
  }, [onModalStateChange])

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true)
    onModalStateChange?.(true)
    document.body.style.overflow = "hidden"
  }, [onModalStateChange])

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="relative group inline-flex items-center justify-center h-12 px-6 text-white text-sm font-bold rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        style={{ background: primaryGradient }}
      >
        {!prefersReducedMotion && (
          <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shine" />
        )}
        <span className="relative z-10 flex items-center gap-2">
          <Sparkles size={18} className="group-hover:animate-pulse" />
          احجز استشارة
        </span>
      </button>
      
      <BookingModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  )
}

// Memoized Logo component
const Logo = ({ scrolled }) => {
  const prefersReducedMotion = useReducedMotion()
  
  return (
    <Link href="/" className="flex items-center gap-3 z-50 group cursor-pointer">
      <div className={`relative p-2.5 rounded-full shadow-lg transition-all duration-300 backdrop-blur-sm ${
        scrolled 
          ? "bg-green-50/90 shadow-green-200/50" 
          : "bg-white/90 shadow-slate-300/50"
      } group-hover:shadow-xl group-hover:bg-green-50/80`}>
        <div className={`transform transition-all duration-500 ${
          prefersReducedMotion ? '' : 'group-hover:rotate-[-12deg] group-hover:scale-110'
        }`}>
          <svg width="30" height="30" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5dc56b" />
                <stop offset="100%" stopColor="#3a9d47" />
              </linearGradient>
              <filter id="logoGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <g filter="url(#logoGlow)">
              <path d="M14 0L20.4952 7.50481L14 15.0096L7.50481 7.50481L14 0Z" fill="url(#logoGradient)"/>
              <path d="M20.4952 7.50481L28 14L14 28L0 14L7.50481 7.50481L14 15.0096L20.4952 7.50481Z" fill="url(#logoGradient)"/>
            </g>
          </svg>
        </div>
      </div>
      <div className="flex flex-col">
        <span className={`text-2xl font-bold bg-clip-text text-transparent transition-all duration-300 leading-tight ${
          scrolled 
            ? "bg-gradient-to-r from-gray-800 to-gray-900" 
            : "bg-gradient-to-r from-slate-700 to-slate-900"
        }`}>
          شركة دِرَايَة
        </span>
        <div className="h-0.5 w-0 group-hover:w-full rounded-full transition-all duration-700 ease-out" style={{ background: primaryGradient }}/>
      </div>
    </Link>
  )
}

// Memoized NavLink component
const NavLink = ({ link, isActive, linkColor, onMobileClick, isMobile = false }) => {
  const prefersReducedMotion = useReducedMotion()
  
  const baseClasses = isMobile
    ? "group relative flex items-center gap-4 p-4 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-sm hover:shadow-md"
    : "group relative flex items-center justify-center h-12 px-6 text-sm font-medium rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
  
  const scaleClass = prefersReducedMotion ? "" : "transform hover:scale-105"
  
  return (
    <Link 
      href={link.href} 
      onClick={onMobileClick}
      className={`${baseClasses} ${scaleClass} ${linkColor}`}
    >
      <div 
        className={`absolute inset-0 ${isMobile ? 'rounded-2xl' : 'rounded-full'} transition-all duration-300 backdrop-blur-sm ${
          isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'
        }`} 
        style={{ background: isActive ? primaryGradientHover : primaryGradient }} 
      />
      <div className="relative z-10 flex items-center gap-2">
        <link.icon size={isMobile ? 24 : 20} className={isActive ? "text-white" : ""} />
        <span className="relative">{link.label}</span>
      </div>
    </Link>
  )
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hasActiveModal, setHasActiveModal] = useState(false)
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()
  
  // Memoized navigation links
  const navLinks = useMemo(() => [
    { href: "/", label: "الرئيسية", icon: Home },
    { href: "/projects", label: "المشاريع", icon: Briefcase },
    { href: "/investments", label: "الاستثمارات", icon: DollarSign },
    { href: "/services", label: "الخدمات", icon: Wrench }
  ], [])

  // Optimized scroll handler with throttling
  const handleScroll = useCallback(() => {
    const shouldScroll = window.scrollY > 50
    if (shouldScroll !== scrolled) {
      setScrolled(shouldScroll)
    }
  }, [scrolled])

  // Throttle scroll events
  useEffect(() => {
    let ticking = false
    
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", throttledHandleScroll, { passive: true })
    return () => window.removeEventListener("scroll", throttledHandleScroll)
  }, [handleScroll])
  
  // Optimized body overflow management
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else if (!hasActiveModal) {
      document.body.style.overflow = "auto"
    }
  }, [isMenuOpen, hasActiveModal])

  // Memoized header classes
  const headerClasses = useMemo(() => {
    if (scrolled) {
      return "bg-white/98 backdrop-blur-xl shadow-xl border-b border-green-50/50"
    }
    return pathname === "/"
      ? "bg-gradient-to-b from-white to-[#00FF87]"
      : "bg-white/95 backdrop-blur-xl border-b border-gray-100"
  }, [scrolled, pathname])

  // Memoized mobile menu handlers
  const handleMenuOpen = useCallback(() => setIsMenuOpen(true), [])
  const handleMenuClose = useCallback(() => setIsMenuOpen(false), [])
  const handleModalStateChange = useCallback((isOpen) => setHasActiveModal(isOpen), [])

  // Memoized animation variants for reduced motion
  const overlayVariants = useMemo(() => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: prefersReducedMotion ? 0.2 : 0.3 }
  }), [prefersReducedMotion])

  const drawerVariants = useMemo(() => ({
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 },
    transition: prefersReducedMotion 
      ? { duration: 0.2, ease: "easeOut" }
      : { type: 'spring', damping: 25, stiffness: 200 }
  }), [prefersReducedMotion])

  return (
    <>
      <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${headerClasses}`}>
        <nav className="container mx-auto px-4 md:px-8 lg:px-12" dir="rtl">
          <div className="flex items-center justify-between py-4 md:py-5">
            <Logo scrolled={scrolled} />
            
            <div className="hidden md:flex items-center gap-3 lg:gap-4">
              <ul className="flex items-center gap-2 lg:gap-3">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href
                  const linkColor = isActive
                    ? "text-white shadow-lg"
                    : scrolled || pathname !== "/"
                      ? "text-gray-700 hover:text-white"
                      : "text-slate-600 hover:text-white"

                  return (
                    <li key={link.href}>
                      <NavLink 
                        link={link}
                        isActive={isActive}
                        linkColor={linkColor}
                      />
                    </li>
                  )
                })}
              </ul>
              
              <div className={`w-px h-8 mx-2 lg:mx-3 transition-colors duration-300 ${
                scrolled || pathname !== '/' ? "bg-gray-200" : "bg-slate-200"
              }`} />
              
              <BookingSystem onModalStateChange={handleModalStateChange} />
            </div>

            <div className="md:hidden">
              <button 
                onClick={handleMenuOpen} 
                className={`p-2.5 focus:outline-none rounded-xl transition-all duration-300 shadow-sm hover:shadow-md ${
                  prefersReducedMotion ? '' : 'transform hover:scale-110'
                } ${
                  scrolled || pathname !== '/'
                    ? "text-gray-700 bg-gray-50 hover:bg-gray-100" 
                    : "text-slate-700 bg-white/70 hover:bg-slate-200/70"
                }`} 
                aria-label="Open Menu"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <>
            <motion.div
              {...overlayVariants}
              onClick={handleMenuClose}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-md z-[60]"
            />
            <motion.div
              {...drawerVariants}
              className="fixed top-0 right-0 bottom-0 w-[90%] max-w-sm bg-white/95 backdrop-blur-xl shadow-2xl p-6 flex flex-col z-[60] border-l border-gray-100/50"
              dir="rtl"
            >
              <div className="flex justify-between items-center pb-6 border-b border-gray-100">
                <Logo scrolled={true} />
                <button 
                  onClick={handleMenuClose} 
                  className={`p-2.5 text-gray-700 focus:outline-none rounded-xl hover:bg-red-50/80 transition-all duration-300 shadow-sm hover:shadow-md ${
                    prefersReducedMotion ? '' : 'transform hover:scale-110'
                  }`}
                  aria-label="Close Menu"
                >
                  <X size={24} />
                </button>
              </div>
              
              <ul className="flex flex-col gap-3 lg:gap-4 flex-grow mt-8">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href
                  const linkColor = isActive ? "text-white shadow-lg" : "text-gray-700 hover:text-white"
                  
                  return (
                    <li key={link.href}>
                      <NavLink 
                        link={link}
                        isActive={isActive}
                        linkColor={linkColor}
                        onMobileClick={handleMenuClose}
                        isMobile={true}
                      />
                    </li>
                  )
                })}
              </ul>
              
              <div className="mt-auto pt-6 border-t border-gray-100 text-center pb-4">
                <p className="text-sm text-gray-600 mb-4 font-medium">جاهز لبدء مشروعك؟</p>
                <BookingSystem onModalStateChange={handleModalStateChange} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}