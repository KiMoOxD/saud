"use client"

import { motion, useInView, animate } from "framer-motion"
import React, { useEffect, useRef, useState } from "react"
import { ArrowLeft, Award, Users, TrendingUp } from "lucide-react"

// --- MOCK DATA to prevent build errors ---
const projectsData = {
  projects: [
    { country: { en: "Saudi Arabia" } }, { country: { en: "Saudi Arabia" } }, { country: { en: "Saudi Arabia" } }, { country: { en: "Saudi Arabia" } },
    { country: { en: "Qatar" } }, { country: { en: "Qatar" } }, { country: { en: "Qatar" } },
    { country: { en: "Egypt" } }, { country: { en: "Egypt" } }, { country: { en: "Egypt" } }, { country: { en: "Egypt" } }, { country: { en: "Egypt" } },
    { country: { en: "Tanzania" } }, { country: { en: "Tanzania" } },
    { country: { en: "Oman" } }, { country: { en: "Oman" } }, { country: { en: "Oman" } },
    { country: { en: "Turkey" } },
  ]
};

// --- Helper Component: AnimatedCounter ---
function AnimatedCounter({ value, className }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView && ref.current) {
      const node = ref.current;
      const controls = animate(0, value, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate(latest) {
          node.textContent = Math.round(latest);
        },
      });
      return () => controls.stop();
    }
  }, [isInView, value]);

  return <span ref={ref} className={className}>0</span>;
}

// --- Main Countries Component ---
export default function Countries() {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    // Media query to check for desktop screens (768px is a common breakpoint for md)
    const checkScreenSize = () => setIsDesktop(window.innerWidth >= 768);
    checkScreenSize(); // Check on initial render
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize); // Cleanup
  }, []);

  const countries = [
    // FIX: Added separate, optimized positions for mobile and desktop layouts
    { name: "المملكة العربية السعودية", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Flag_of_Saudi_Arabia.svg/1200px-Flag_of_Saudi_Arabia.svg.png", key: "saudi_arabia", projects: projectsData.projects.filter(p => p.country.en === "Saudi Arabia").length, desktopPosition: { top: '5%', left: '65%' }, mobilePosition: { top: '0%', left: '50%' } },
    { name: "قطر", flag: "https://upload.wikimedia.org/wikipedia/commons/6/65/Flag_of_Qatar.svg", key: "qatar", projects: projectsData.projects.filter(p => p.country.en === "Qatar").length, desktopPosition:  { top: '30%', left: '55%' }, mobilePosition: { top: '20%', left: '50%' } },
    // FIX: Replaced corrupted base64 with a reliable URL for Egypt's flag.
    { name: "مصر", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flag_of_Egypt.svg/1200px-Flag_of_Egypt.svg.png", key: "egypt", projects: projectsData.projects.filter(p => p.country.en === "Egypt").length, desktopPosition: { top: '15%', left: '15%' }, mobilePosition: { top: '40%', left: '50%' } },
    { name: "تنزانيا", flag: "https://upload.wikimedia.org/wikipedia/commons/3/38/Flag_of_Tanzania.svg", key: "tanzania", projects: projectsData.projects.filter(p => p.country.en === "Tanzania").length, desktopPosition: { top: '60%', left: '70%' }, mobilePosition: { top: '60%', left: '50%' } },
    { name: "سلطنة عمان", flag: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Flag_of_Oman.svg", key: "oman", projects: projectsData.projects.filter(p => p.country.en === "Oman").length, desktopPosition: { top: '48%', left: '25%' }, mobilePosition: { top: '80%', left: '50%' } },
    { name: "تركيا", flag: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Turkey.svg", key: "turkey", projects: projectsData.projects.filter(p => p.country.en === "Turkey").length, desktopPosition: { top: '80%', left: '45%' }, mobilePosition: { top: '97%', left: '50%' } },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } },
  };

  return (
    <section id="countries" className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-24">
          {/* --- Left Info Panel --- */}
          <div className="lg:sticky top-24 h-fit text-center lg:text-right mb-16 lg:mb-0">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }} viewport={{ once: true }}>
              <h2 className="text-4xl sm:text-5xl font-extrabold mb-5 text-slate-900 leading-tight">حضور إقليمي وشراكات ممتدة</h2>
              <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-10">
                نقدم خبراتنا في قلب الاقتصادات الأكثر حيوية في الشرق الأوسط وأفريقيا، ونفخر بشبكة واسعة من المشاريع الناجحة التي تعكس رؤيتنا العالمية.
              </p>
            </motion.div>
            <motion.div className="space-y-4 max-w-md mx-auto lg:mx-0" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }} viewport={{ once: true }}>
              {[
                { number: "15+", label: "سنوات من الخبرة العميقة", icon: Award },
                { number: "50+", label: "عميل وشريك نجاح", icon: Users },
                { number: "200%", label: "متوسط نمو استثمارات العملاء", icon: TrendingUp }
              ].map((metric) => (
                <div key={metric.label} className="flex items-center text-right gap-4 p-4 bg-slate-50/70 rounded-xl border border-slate-200/80">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm">
                    <metric.icon size={24} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-800">{metric.number}</p>
                    <p className="text-sm text-slate-500 font-medium">{metric.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
          {/* --- Right Interactive Map Panel --- */}
          {/* FIX: Container height is now responsive */}
          <motion.div className="relative h-[550px] sm:h-[450px] md:h-[600px]" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            {countries.map((country) => {
              const hasProjects = country.projects > 0;
              // FIX: Using standard <a> tag instead of Next.js <Link>
              const Wrapper = hasProjects ? 'a' : 'div';
              const wrapperProps = hasProjects ? { href: `/country/${encodeURIComponent(country.key)}` } : {};
              // FIX: Selects the correct position based on screen size
              const position = isDesktop ? country.desktopPosition : country.mobilePosition;

              return (
                <motion.div
                  key={country.key}
                  variants={itemVariants}
                  className={`absolute group w-full md:w-fit`}
                  // FIX: Applies responsive positioning
                  style={{ top: position.top, left: position.left, translateX: "-50%"}}
                >
                  <Wrapper {...wrapperProps}>
                    <div className="flex justify-start items-center gap-3 p-3 rounded-full bg-white shadow-xl shadow-slate-300/60 border border-slate-200/80 hover:shadow-emerald-500/20 hover:scale-105 hover:z-10 transition-all duration-300">
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
                        {/* FIX: Using <img> tag instead of Next.js <Image> */}
                        <img src={country.flag} alt={`علم ${country.name}`} className="object-cover w-full h-full rounded-full ring-2 ring-white/80" loading="lazy" />
                      </div>
                      <div className="text-right">
                        <h3 className="font-bold text-slate-800 whitespace-nowrap">{country.name}</h3>
                        {hasProjects ? (
                          <div className="flex items-center gap-2 text-sm">
                            <AnimatedCounter value={country.projects} className="font-bold text-lg text-emerald-600" />
                            <span className="text-slate-500">مشروع</span>
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-slate-400">قريبًا</span>
                        )}
                      </div>
                      {hasProjects && (
                        <div className="mr-auto ml-3 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-transform duration-300">
                           <ArrowLeft className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  </Wrapper>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}