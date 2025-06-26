"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Briefcase, Home, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Enhanced BookingSystem component with modern RTL styling
const BookingSystem = () => (
    <motion.button 
        className="relative group px-6 py-3 text-sm font-bold text-white bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
    >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-300 via-teal-400 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1 right-2 w-1 h-1 bg-white rounded-full animate-pulse" />
            <div className="absolute bottom-2 left-3 w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.5s'}} />
            <div className="absolute top-2 left-1 w-1 h-1 bg-white/40 rounded-full animate-ping" style={{animationDelay: '1s'}} />
        </div>
        
        <span className="relative z-10 flex items-center gap-2">
            <Sparkles size={16} className="animate-pulse" />
            احجز استشارة
        </span>
    </motion.button>
);

// Enhanced Logo with modern RTL styling
const Logo = () => (
    <Link href="/" className="flex items-center gap-3 z-50 group">
        <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="relative"
        >
            <svg width="32" height="32" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#14B8A6" />
                        <stop offset="100%" stopColor="#0F172A" />
                    </linearGradient>
                </defs>
                <path d="M14 0L20.4952 7.50481L14 15.0096L7.50481 7.50481L14 0Z" fill="url(#logoGradient)"/>
                <path d="M20.4952 7.50481L28 14L14 28L0 14L7.50481 7.50481L14 15.0096L20.4952 7.50481Z" fill="#14B8A6"/>
            </svg>
            <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-slate-700 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm" />
        </motion.div>
        <div className="flex flex-col">
            <span className="text-2xl font-black bg-gradient-to-l from-slate-800 via-slate-700 to-teal-600 bg-clip-text text-transparent">
                شركة سعود
            </span>
            <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-l from-teal-500 to-slate-600 transition-all duration-500 rounded-full" />
        </div>
    </Link>
)

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const pathname = usePathname()

    // Enhanced navigation links with RTL ordering
    const navLinks = [
        { href: "/projects", label: "المشاريع", icon: Briefcase },
        { href: "/", label: "الرئيسية", icon: Home },
    ]

    // Mouse tracking for subtle interactions
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY })
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])
    
    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
    }, [isMenuOpen]);

    useEffect(() => {
        if (isMenuOpen) setIsMenuOpen(false)
    }, [pathname])

    // Enhanced animation variants
    const headerVariants = {
        initial: { y: -100, opacity: 0 },
        animate: { y: 0, opacity: 1 },
    }
    
    const mobileMenuVariants = {
        closed: { 
            x: "100%", 
            opacity: 0,
            scale: 0.95
        },
        open: { 
            x: "0%", 
            opacity: 1,
            scale: 1
        },
    }
    
    const backdropVariants = {
        closed: { opacity: 0 },
        open: { opacity: 1 },
    }

    const linkHoverVariants = {
        rest: { scale: 1, y: 0 },
        hover: { scale: 1.05, y: -2 }
    }

    return (
        <>
            {/* Ambient background effect */}
            <div 
                className="fixed inset-0 pointer-events-none z-0"
                style={{
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(20, 184, 166, 0.03), transparent 40%)`
                }}
            />
            
            <motion.header
                className={`sticky top-0 z-50 w-full transition-all duration-500 backdrop-blur-xl border-b border-slate-200/20
                    ${scrolled 
                        ? "bg-white/70 shadow-2xl shadow-slate-900/10 border-slate-300/30" 
                        : "bg-white/40 shadow-none"
                    }`
                }
                variants={headerVariants}
                initial="initial"
                animate="animate"
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <nav className="container mx-auto px-6" dir="rtl">
                    <div className="flex items-center justify-between py-5">
                        <Logo />

                        {/* Enhanced Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            <ul className="flex items-center gap-8">
                                {navLinks.map((link, index) => (
                                    <motion.li 
                                        key={link.href}
                                        variants={linkHoverVariants}
                                        initial="rest"
                                        whileHover="hover"
                                        className="relative"
                                    >
                                        <Link
                                            href={link.href}
                                            className={`relative flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-xl group
                                                ${pathname === link.href 
                                                    ? "text-white bg-gradient-to-l from-teal-500 to-slate-700 shadow-lg" 
                                                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/60"
                                                }`
                                            }
                                        >
                                            <link.icon 
                                                size={18} 
                                                className={`transition-all duration-300 ${
                                                    pathname === link.href 
                                                        ? "text-white" 
                                                        : "text-teal-500 group-hover:scale-110"
                                                }`} 
                                            />
                                            <span>{link.label}</span>
                                            
                                            {/* Animated underline for active state */}
                                            {pathname === link.href && (
                                                <motion.div
                                                    layoutId="active-nav-pill"
                                                    className="absolute inset-0 bg-gradient-to-l from-teal-500 to-slate-700 rounded-xl -z-10"
                                                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                                />
                                            )}
                                            
                                            {/* Hover glow effect */}
                                            <div className="absolute inset-0 bg-gradient-to-l from-teal-400/20 to-slate-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                            
                            {/* Enhanced divider with gradient */}
                            <div className="w-px h-8 bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
                            
                            <div className="mr-3">
                                <BookingSystem />
                            </div>
                        </div>

                        {/* Enhanced Mobile Navigation Trigger */}
                        <div className="md:hidden">
                            <motion.button
                                onClick={() => setIsMenuOpen(true)}
                                className="relative p-3 text-slate-800 focus:outline-none rounded-xl hover:bg-slate-100/60 transition-colors"
                                whileTap={{ scale: 0.9 }}
                                whileHover={{ scale: 1.05 }}
                                aria-label="Open Menu"
                            >
                                <Menu size={24} />
                                <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-slate-600/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
                            </motion.button>
                        </div>
                    </div>
                </nav>
            </motion.header>

            {/* Enhanced Mobile Drawer Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            variants={backdropVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            transition={{ duration: 0.3 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-40"
                        />
                        <motion.div
                            variants={mobileMenuVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="md:hidden fixed top-0 right-0 bottom-0 w-[90%] max-w-sm bg-white/95 backdrop-blur-xl shadow-2xl z-50 p-6 flex flex-col"
                            dir="rtl"
                        >
                            {/* Mobile header with enhanced styling */}
                            <div className="flex justify-between items-center mb-12 pb-6 border-b border-slate-200/50">
                                <Logo />
                                <motion.button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-3 text-slate-800 focus:outline-none rounded-xl hover:bg-slate-100/60 transition-colors relative"
                                    whileTap={{ scale: 0.9 }}
                                    whileHover={{ scale: 1.05 }}
                                    aria-label="Close Menu"
                                >
                                    <X size={24} />
                                    <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-slate-600/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
                                </motion.button>
                            </div>
                            
                            {/* Enhanced mobile navigation links */}
                            <ul className="flex flex-col gap-3 flex-grow">
                                {navLinks.map((link, i) => (
                                    <motion.li
                                        key={link.href}
                                        initial={{ x: 50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 + (i * 0.1), type: "spring", stiffness: 200 }}
                                    >
                                        <Link
                                            href={link.href}
                                            className={`relative flex items-center gap-4 p-5 rounded-2xl text-lg font-semibold transition-all duration-300 group overflow-hidden
                                                ${pathname === link.href
                                                    ? "text-white bg-gradient-to-l from-teal-500 to-slate-700 shadow-lg"
                                                    : "text-slate-700 hover:text-slate-900 hover:bg-gradient-to-l hover:from-slate-50 hover:to-teal-50"
                                                }`
                                            }
                                        >
                                            <link.icon 
                                                className={`h-6 w-6 transition-all duration-300 ${
                                                    pathname === link.href 
                                                        ? "text-white" 
                                                        : "text-teal-500 group-hover:scale-110"
                                                }`} 
                                            />
                                            <span className="flex-grow text-right">{link.label}</span>
                                            
                                            {/* Mobile link decoration */}
                                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-0 group-hover:h-full bg-gradient-to-b from-teal-400 to-slate-600 transition-all duration-300 rounded-full" />
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                            
                            {/* Enhanced mobile CTA section */}
                            <motion.div 
                                className="mt-auto pt-8 border-t border-slate-200/50"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <div className="text-center mb-4">
                                    <p className="text-sm text-slate-600 mb-3">جاهز لبدء مشروعك؟</p>
                                    <BookingSystem />
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}