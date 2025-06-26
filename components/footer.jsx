"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, ArrowUp, Briefcase } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

// A dedicated component for the scroll-to-top button for cleanliness.
function ScrollToTopButton({ show }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <motion.button
      className="fixed bottom-6 right-6 bg-slate-800/50 backdrop-blur-sm text-white p-3 rounded-full shadow-lg z-50"
      onClick={scrollToTop}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.8 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      whileHover={{ scale: 1.1, backgroundColor: 'rgba(51, 65, 85, 0.8)' }}
      whileTap={{ scale: 0.95 }}
    >
      <ArrowUp size={20} />
    </motion.button>
  )
}


export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "الرئيسية", href: "/" },
    { name: "من نحن", href: "#about" },
    { name: "خدماتنا", href: "#services" },
    { name: "تواصل معنا", href: "#contact" },
  ]

  const socialLinks = [
    { name: "Facebook", icon: <Facebook size={20} />, href: "#" },
    { name: "Twitter", icon: <Twitter size={20} />, href: "#" },
    { name: "Instagram", icon: <Instagram size={20} />, href: "#" },
    { name: "Linkedin", icon: <Linkedin size={20} />, href: "#" },
  ]

  return (
    <footer className="relative bg-gray-900 text-slate-300 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* Left Side: Branding and Copyright */}
          <div className="text-center md:text-right">
            <Link href="/" className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <div className="bg-teal-500 p-2 rounded-lg">
                    <Briefcase size={20} className="text-white"/>
                </div>
                <h3 className="text-xl font-bold text-white">
                  استشارات الخليج
                </h3>
            </Link>
            <p className="text-sm text-slate-400">
                © {new Date().getFullYear()} جميع الحقوق محفوظة.
            </p>
          </div>

          {/* Right Side: Navigation and Social Links */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <nav className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className="text-sm text-slate-300 hover:text-white transition-colors duration-300">
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="hidden md:block w-px h-6 bg-slate-700"></div> {/* Divider */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                 <motion.a
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                    className="text-slate-400 hover:text-white transition-colors duration-300"
                    whileHover={{ y: -3, scale: 1.1 }}
                  >
                   {social.icon}
                 </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <ScrollToTopButton show={showScrollTop} />
    </footer>
  )
}