"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Facebook, Twitter, Instagram, Linkedin, ArrowUp, Briefcase } from "lucide-react"

// --- Scroll-to-Top Button Component ---
function ScrollToTopButton({ show }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <motion.button
      className="fixed bottom-6 right-6 bg-emerald-700/80 backdrop-blur-sm text-white p-3 rounded-full shadow-lg z-50"
      onClick={scrollToTop}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.8 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      whileHover={{ scale: 1.1, backgroundColor: 'rgba(4, 120, 87, 1)' }}
      whileTap={{ scale: 0.95 }}
    >
      <ArrowUp size={20} />
    </motion.button>
  )
}

// --- Layered Waves Background Component (Now Static) ---
const LayeredWaves = () => (
  <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden">
    {/* Wave 1 - Deepest Layer */}
    <svg
      className="absolute bottom-0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 320"
      style={{ zIndex: 1 }}
    >
      <path fill="#00FF87" fillOpacity="0.4" d="M0,224L48,208C96,192,192,160,288,165.3C384,171,480,213,576,240C672,267,768,277,864,256C960,235,1056,181,1152,154.7C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
    </svg>
    {/* Wave 2 - Middle Layer */}
    <svg
      className="absolute bottom-0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 320"
      style={{ zIndex: 2 }}
    >
      <path fill="#00FF87" fillOpacity="0.5" d="M0,160L48,176C96,192,192,224,288,229.3C384,235,480,213,576,192C672,171,768,149,864,154.7C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
    </svg>
    {/* Wave 3 - Top Layer */}
    <svg
      className="absolute bottom-0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 320"
      style={{ zIndex: 3 }}
    >
      <path fill="#00FF87" fillOpacity="0.6" d="M0,256L48,240C96,224,192,192,288,197.3C384,203,480,245,576,234.7C672,224,768,160,864,149.3C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
    </svg>
  </div>
);


export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400)
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
    // UPDATED: Removed background color and reduced top padding for a smaller, transparent footer
    <footer className="relative pt-20 pb-12 text-black overflow-hidden">
      <LayeredWaves />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center">
          
          {/* <a href="/" className="flex items-center gap-3 mb-6">
            <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg">
              <Briefcase size={22} className="text-emerald-400"/>
            </div>
            <h3 className="text-xl font-bold text-white">استشارات الخليج</h3>
          </a> */}

          {/* <nav className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mb-6">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-sm text-slate-300 hover:text-white transition-colors duration-300">
                {link.name}
              </a>
            ))}
          </nav> */}

          <div className="flex items-center gap-5 mb-8">
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                aria-label={social.name}
                className="text-green-500 hover:text-green-900 transition-colors duration-300"
                whileHover={{ y: -3, scale: 1.1 }}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>

          {/* <p className="text-sm text-green-600">
            © {new Date().getFullYear()} جميع الحقوق محفوظة.
          </p> */}

        </div>
      </div>
      
      <ScrollToTopButton show={showScrollTop} />
    </footer>
  )
}