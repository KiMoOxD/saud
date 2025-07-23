"use client"

import Image from "next/image"
import { CardContent } from "@/components/ui/card"
import { motion, useInView, animate } from "framer-motion"
import Link from "next/link"
import projectsData from "@/data/projectsData.json"
import { useEffect, useRef } from "react"
import { ArrowLeft, Sparkles, Trophy, Star, Award, TrendingUp, Users, Globe, Anchor, Landmark, Mountain } from "lucide-react"

function AnimatedCounter({ value }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView && ref.current) {
      const node = ref.current;
      const controls = animate(0, value, {
        duration: 2,
        ease: "easeOut",
        onUpdate(latest) {
          node.textContent = Math.round(latest);
        },
      });
      return () => controls.stop();
    }
  }, [isInView, value]);

  return <span ref={ref}>0</span>;
}

// Main Countries Component
export default function Countries() {
  // UPDATED: Added all countries from the projectsData.json file
  const countries = [
    {
      name: "المملكة العربية السعودية",
      flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Flag_of_Saudi_Arabia.svg/1200px-Flag_of_Saudi_Arabia.svg.png",
      key: "saudi_arabia",
      projects: projectsData.projects.filter(p => p.country === "السعودية").length,
      color: "emerald",
      icon: Trophy,
    },
    {
      name: "الإمارات العربية المتحدة",
      flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_the_United_Arab_Emirates.svg/1200px-Flag_of_the_United_Arab_Emirates.svg.png",
      key: "united_arab_emirates",
      projects: projectsData.projects.filter(p => p.country === "الإمارات العربية المتحدة").length,
      color: "sky",
      icon: Star,
    },
    {
      name: "قطر",
      flag: "https://upload.wikimedia.org/wikipedia/commons/6/65/Flag_of_Qatar.svg",
      key: "qatar",
      projects: projectsData.projects.filter(p => p.country === "قطر").length,
      color: "rose",
      icon: Award,
    },
    {
      name: "مصر",
      flag: "data:image/png;base64,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",
      key: "egypt",
      projects: projectsData.projects.filter(p => p.country === "مصر").length,
      color: "amber",
      icon: TrendingUp,
    },
    // ADDED: New countries from the data file
    {
      name: "تنزانيا",
      flag: "https://upload.wikimedia.org/wikipedia/commons/3/38/Flag_of_Tanzania.svg",
      key: "tanzania",
      projects: projectsData.projects.filter(p => p.country === "تنزانيا").length,
      color: "blue",
      icon: Globe,
    },
    {
      name: "سلطنة عمان",
      flag: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Flag_of_Oman.svg",
      key: "oman",
      projects: projectsData.projects.filter(p => p.country === "سلطنة عمان").length,
      color: "red",
      icon: Anchor,
    },
    {
      name: "تركيا",
      flag: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Turkey.svg",
      key: "turkey",
      projects: projectsData.projects.filter(p => p.country === "تركيا").length,
      color: "orange",
      icon: Landmark,
    },
    {
      name: "اليمن",
      flag: "https://upload.wikimedia.org/wikipedia/commons/8/89/Flag_of_Yemen.svg",
      key: "yemen",
      projects: projectsData.projects.filter(p => p.country === "اليمن").length,
      color: "yellow",
      icon: Mountain,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section id="countries" className="py-24 md:py-32 bg-gradient-to-b from-gray-50 to-slate-100 overflow-hidden relative">
        {/* Simplified Background */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.1),rgba(255,255,255,0))]"></div>

        <div className="container mx-auto px-4 relative z-10">
            {/* --- Refined Header Section --- */}
            <motion.div
              className="text-center mb-16 md:mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-emerald-100/70 text-emerald-800 px-4 py-2 rounded-full border border-emerald-200/80 mb-6">
                <Sparkles className="h-5 w-5" />
                <span className="font-semibold text-sm">حضور إقليمي متميز</span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 text-slate-900 leading-tight">
                شركاؤنا عبر المنطقة
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                نقدم خبراتنا ورؤيتنا الاستراتيجية في قلب الاقتصادات الأكثر حيوية في الشرق الأوسط، ونفخر بشبكة واسعة من المشاريع الناجحة.
              </p>
            </motion.div>

            {/* UPDATED: The grid now supports more cards dynamically */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {countries.map((country, index) => {
                const hasProjects = country.projects > 0;
                const CardWrapper = hasProjects ? Link : "div";
                const cardProps = hasProjects ? { href: `/country/${encodeURIComponent(country.key)}` } : {};
                const IconComponent = country.icon;
                const colorClass = `text-${country.color}-600`;
                const hoverShadowClass = `hover:shadow-${country.color}-500/20`;

                return (
                  <motion.div
                    key={country.key}
                    variants={itemVariants}
                    whileHover={{ y: -8, scale: 1.03 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className="h-full"
                  >
                    <CardWrapper {...cardProps} className="h-full block group">
                      <div className={`relative h-full bg-white/60 backdrop-blur-lg rounded-2xl border border-slate-200/70 shadow-lg shadow-slate-300/40 transition-all duration-300 ${hoverShadowClass} ${!hasProjects ? "opacity-80 saturate-70" : "cursor-pointer"}`}>
                        <CardContent className="relative p-6 flex flex-col items-center text-center h-full">

                          {/* --- Square Flag Display --- */}
                          <motion.div
                            className="relative w-24 h-24 rounded-2xl bg-white shadow-md p-2 ring-2 ring-white/50 mb-6"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                          >
                            <Image
                              src={country.flag}
                              alt={`علم ${country.name}`}
                              width={80}
                              height={80}
                              className="object-cover w-full h-full rounded-lg"
                              priority={index < 2}
                            />
                            {hasProjects && (
                                <div className={`absolute -top-2 -right-2 w-8 h-8 bg-${country.color}-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm`}>
                                    <IconComponent className="h-4 w-4 text-white" />
                                </div>
                            )}
                          </motion.div>

                          <h3 className="text-xl font-bold text-slate-800 mb-2 min-h-[3.5rem] flex items-center justify-center">
                            {country.name}
                          </h3>

                          {/* --- Simplified Projects Section --- */}
                          <div className="mt-auto pt-4 w-full">
                            {hasProjects ? (
                              <div className="space-y-4">
                                <div className={`text-5xl font-bold ${colorClass}`}>
                                  <AnimatedCounter value={country.projects * 20} />
                                </div>
                                <div className="text-sm font-medium text-slate-600">مشروع منجز</div>
                                <div className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <span>استكشف المشاريع</span>
                                  <ArrowLeft className="h-4 w-4" />
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 bg-slate-100/80 px-4 py-2 rounded-full">
                                <Star className="h-4 w-4" />
                                <span>قريبًا</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </div>
                    </CardWrapper>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* --- Streamlined Bottom Section --- */}
            <motion.div
              className="mt-24 max-w-5xl mx-auto bg-white/70 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-slate-200/80 shadow-xl shadow-slate-200/50"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="lg:order-last">
                  <h3 className="text-3xl md:text-4xl font-extrabold mb-4 text-slate-900 text-center lg:text-right">
                    خبرة عالمية برؤية محلية
                  </h3>
                  <p className="text-base md:text-lg text-slate-600 leading-relaxed text-center lg:text-right">
                    بفضل خبرتنا العميقة الممتدة لسنوات في أسواق المنطقة، نقدم استشارات متخصصة تراعي أدق تفاصيل كل سوق، مما يمكّن عملائنا من التوسع بثقة وتحقيق نجاح مستدام.
                  </p>
                </div>
                <div className="lg:order-first space-y-4">
                  {[
                    { number: "15+", label: "سنوات من الخبرة", icon: Award },
                    { number: "50+", label: "عميل راضٍ", icon: Users },
                    { number: "200%", label: "نمو في استثمارات العملاء", icon: TrendingUp }
                  ].map((metric) => (
                    <div key={metric.label} className="flex items-center gap-4 p-4 bg-white/80 rounded-xl border border-slate-200/70 shadow-md">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-sm">
                            <metric.icon size={24} />
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold text-slate-800">{metric.number}</p>
                            <p className="text-sm text-slate-500 font-medium">{metric.label}</p>
                        </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
        </div>
    </section>
  )
}