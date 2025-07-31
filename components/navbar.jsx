"use client"

import { useState, useEffect } from "react"
import { usePathname } from 'next/navigation'
import { Menu, X, Briefcase, Home, Sparkles, DollarSign, Wrench } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import BookingModal from "./booking-modal" 

const primaryGradient = "linear-gradient(to right, #5dc56b, #3a9d47)";

const BookingSystem = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };


  return (
    <>
      <button
        onClick={handleOpenModal}
        className="relative group inline-flex items-center justify-center h-11 px-6 text-white text-sm font-bold rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105"
        style={{ background: primaryGradient }}
      >
        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
        <span className="relative z-10 flex items-center gap-2">
          <Sparkles size={18} />
          احجز استشارة
        </span>
      </button>
      
      {/* Render your real modal and pass state and control functions */}
      <BookingModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

const Logo = () => (
    <Link href="/" className="flex items-center gap-3 z-50 group cursor-pointer">
        <div className="relative p-2 bg-white/80 rounded-full shadow-inner shadow-slate-200 group-hover:shadow-md transition-shadow duration-300">
            <div className="transform transition-transform duration-500 group-hover:rotate-[-15deg]">
                 <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs><linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#5dc56b" /><stop offset="100%" stopColor="#3a9d47" /></linearGradient></defs>
                    <path d="M14 0L20.4952 7.50481L14 15.0096L7.50481 7.50481L14 0Z" fill="url(#logoGradient)"/>
                    <path d="M20.4952 7.50481L28 14L14 28L0 14L7.50481 7.50481L14 15.0096L20.4952 7.50481Z" fill="url(#logoGradient)" style={{filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'}}/>
                </svg>
            </div>
        </div>
        <div className="flex flex-col">
            <span className="text-2xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #334155, #0f172a)'}}>شركة سعود</span>
            <div className="h-0.5 w-0 group-hover:w-full rounded-full transition-all duration-500" style={{ background: primaryGradient }}/>
        </div>
    </Link>
);


export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const navLinks = [
        { href: "/", label: "الرئيسية", icon: Home },
        { href: "/projects", label: "المشاريع", icon: Briefcase },
        { href: "/investments", label: "الاستثمارات", icon: DollarSign },
        { href: "/services", label: "الخدمات", icon: Wrench }
            ]

  useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    
    useEffect(() => {
        // Prevents body scroll only when the mobile menu is open
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            // This allows the BookingModal to control the scroll lock
            // without being overridden by the navbar's effect.
            if (!document.querySelector('[role="dialog"]')) {
                 document.body.style.overflow = "auto";
            }
        }
    }, [isMenuOpen]);

    return (
        <>
            <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${scrolled ? "bg-slate-50/80 shadow-md shadow-slate-900/5 backdrop-blur-lg border-b border-slate-200/50" : "bg-transparent"}`}>
                <nav className="container mx-auto px-6 md:px-8" dir="rtl">
                    <div className="flex items-center justify-between py-4">
                        <Logo />
                        <div className="hidden md:flex items-center gap-4">
                            <ul className="flex items-center gap-2">
                                {navLinks.map((link) => {
                                    const isActive = pathname === link.href;
                                    return (
                                        <li key={link.href}>
                                            <Link href={link.href} className={`group relative flex items-center justify-center h-11 px-5 text-sm font-medium rounded-full transition-all duration-300 transform hover:scale-105 ${isActive ? "text-white" : "text-slate-600 hover:text-white"}`}>
                                                <div className={`absolute inset-0 rounded-full transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} style={{ background: primaryGradient }} />
                                                <div className="relative z-10 flex items-center gap-2">
                                                    <link.icon size={18} />
                                                    <span>{link.label}</span>
                                                </div>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                            <div className="w-px h-8 bg-slate-200 mx-2" />
                            <BookingSystem />
                        </div>
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(true)} className="p-2 text-slate-700 focus:outline-none rounded-full hover:bg-slate-200/70 transition-all duration-300 transform hover:scale-110" aria-label="Open Menu">
                                <Menu size={24} />
                            </button>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Mobile Drawer Menu */}
            <AnimatePresence>
            {isMenuOpen && (
                 <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMenuOpen(false)}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-slate-50 shadow-2xl p-6 flex flex-col z-50"
                        dir="rtl"
                    >
                        <div className="flex justify-between items-center pb-6 border-b border-slate-200">
                            <Logo />
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 text-slate-700 focus:outline-none rounded-full hover:bg-red-100/80 transition-all duration-300 transform hover:scale-110" aria-label="Close Menu">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <ul className="flex flex-col gap-4 flex-grow mt-8">
                            {navLinks.map((link) => {
                                 const isActive = pathname === link.href;
                                 return (
                                    <li key={link.href}>
                                        <Link href={link.href} onClick={() => setIsMenuOpen(false)} className={`group relative flex items-center gap-4 p-4 rounded-xl text-md font-semibold transition-all duration-300 transform hover:scale-105 ${isActive ? "text-white" : "text-slate-700 hover:text-white"}`}>
                                            <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} style={{ background: primaryGradient }} />
                                            <div className="relative z-10 flex items-center gap-4">
                                                <link.icon className="h-6 w-6" />
                                                <span>{link.label}</span>
                                            </div>
                                        </Link>
                                    </li>
                                 );
                            })}
                        </ul>
                        
                        <div className="mt-auto pt-6 border-t border-slate-200 text-center">
                            <p className="text-sm text-slate-600 mb-4">جاهز لبدء مشروعك؟</p>
                            <BookingSystem />
                        </div>
                    </motion.div>
                </>
            )}
            </AnimatePresence>
        </>
    )
}