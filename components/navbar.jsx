"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { usePathname } from 'next/navigation'
import { Menu, X, Briefcase, Home, Sparkles, DollarSign, Wrench } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import BookingModal from "./booking-modal" 

const primaryGradient = "linear-gradient(to right, #5dc56b, #3a9d47)"

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
        className="relative group inline-flex items-center justify-center h-11 px-6 text-white text-sm font-bold rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105"
        style={{ background: primaryGradient }}
      >
        {!prefersReducedMotion && (
          <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
        )}
        <span className="relative z-10 flex items-center gap-2">
          <Sparkles size={18} />
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
      <div className={`relative p-2 rounded-full shadow-inner transition-all duration-300 ${
        scrolled 
          ? "bg-green-50/80 shadow-green-100" 
          : "bg-white/80 shadow-slate-200"
      } group-hover:shadow-md`}>
        <div className={`transform transition-transform duration-500 ${
          prefersReducedMotion ? '' : 'group-hover:rotate-[-15deg]'
        }`}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5dc56b" />
                <stop offset="100%" stopColor="#3a9d47" />
              </linearGradient>
            </defs>
            <path d="M14 0L20.4952 7.50481L14 15.0096L7.50481 7.50481L14 0Z" fill="url(#logoGradient)"/>
            <path d="M20.4952 7.50481L28 14L14 28L0 14L7.50481 7.50481L14 15.0096L20.4952 7.50481Z" fill="url(#logoGradient)" style={{filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'}}/>
          </svg>
        </div>
      </div>
      <div className="flex flex-col">
        <span className={`text-2xl font-bold bg-clip-text text-transparent transition-all duration-300 ${
          scrolled 
            ? "bg-gradient-to-r from-gray-800 to-gray-900" 
            : "bg-gradient-to-r from-slate-700 to-slate-900"
        }`}>
          شركة سعود
        </span>
        <div className="h-0.5 w-0 group-hover:w-full rounded-full transition-all duration-500" style={{ background: primaryGradient }}/>
      </div>
    </Link>
  )
}

// Memoized NavLink component
const NavLink = ({ link, isActive, linkColor, onMobileClick, isMobile = false }) => {
  const prefersReducedMotion = useReducedMotion()
  
  const baseClasses = isMobile
    ? "group relative flex items-center gap-4 p-4 rounded-xl text-md font-semibold transition-all duration-300"
    : "group relative flex items-center justify-center h-11 px-5 text-sm font-medium rounded-full transition-all duration-300"
  
  const scaleClass = prefersReducedMotion ? "" : "transform hover:scale-105"
  
  return (
    <Link 
      href={link.href} 
      onClick={onMobileClick}
      className={`${baseClasses} ${scaleClass} ${linkColor}`}
    >
      <div 
        className={`absolute inset-0 ${isMobile ? 'rounded-xl' : 'rounded-full'} transition-all duration-300 ${
          isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`} 
        style={{ background: primaryGradient }} 
      />
      <div className="relative z-10 flex items-center gap-2">
        <link.icon size={isMobile ? 24 : 18} />
        <span>{link.label}</span>
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
      return "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100"
    }
    return pathname === "/"
      ? "bg-gradient-to-b from-white to-[#00FF87]"
      : "bg-white border-b border-gray-100"
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
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
    transition: prefersReducedMotion 
      ? { duration: 0.2, ease: "easeOut" }
      : { type: 'spring', damping: 25, stiffness: 200 }
  }), [prefersReducedMotion])

  return (
    <>
      <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${headerClasses}`}>
        <nav className="container mx-auto px-6 md:px-8" dir="rtl">
          <div className="flex items-center justify-between py-4">
            <Logo scrolled={scrolled} />
            
            <div className="hidden md:flex items-center gap-4">
              <ul className="flex items-center gap-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href
                  const linkColor = isActive
                    ? "text-white"
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
              
              <div className={`w-px h-8 mx-2 transition-colors duration-300 ${
                scrolled || pathname !== '/' ? "bg-gray-200" : "bg-slate-200"
              }`} />
              
              <BookingSystem onModalStateChange={handleModalStateChange} />
            </div>

            <div className="md:hidden">
              <button 
                onClick={handleMenuOpen} 
                className={`p-2 focus:outline-none rounded-full transition-all duration-300 ${
                  prefersReducedMotion ? '' : 'transform hover:scale-110'
                } ${
                  scrolled || pathname !== '/'
                    ? "text-gray-700 hover:bg-gray-100" 
                    : "text-slate-700 hover:bg-slate-200/70"
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
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
            />
            <motion.div
              {...drawerVariants}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl p-6 flex flex-col z-[60]"
              dir="rtl"
            >
              <div className="flex justify-between items-center pb-6 border-b border-gray-200">
                <Logo scrolled={true} />
                <button 
                  onClick={handleMenuClose} 
                  className={`p-2 text-gray-700 focus:outline-none rounded-full hover:bg-red-100/80 transition-all duration-300 ${
                    prefersReducedMotion ? '' : 'transform hover:scale-110'
                  }`}
                  aria-label="Close Menu"
                >
                  <X size={24} />
                </button>
              </div>
              
              <ul className="flex flex-col gap-4 flex-grow mt-8">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href
                  const linkColor = isActive ? "text-white" : "text-gray-700 hover:text-white"
                  
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
              
              <div className="mt-auto pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600 mb-4">جاهز لبدء مشروعك؟</p>
                <BookingSystem onModalStateChange={handleModalStateChange} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}