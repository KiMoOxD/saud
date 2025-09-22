"use client"
import { useState, useEffect, useRef } from "react"
import { motion, useInView, useSpring, useTransform, useScroll } from "framer-motion"
import { MapPin, DollarSign, Target, Award, TrendingUp, CheckCircle, ArrowRight, Sparkles, Eye, Users, Clock, BarChart3, Zap, Globe, Star, Image as ImageIcon } from "lucide-react"
import BookingModal from "@/components/booking-modal"

// --- Animation Variants (Structure preserved) ---
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3, when: "beforeChildren" } } };
const itemVariants = { hidden: { opacity: 0, y: 40, scale: 0.95, rotateX: -15 }, visible: { opacity: 1, y: 0, scale: 1, rotateX: 0, transition: { type: "spring", stiffness: 120, damping: 15, duration: 0.8 } } };
const floatingVariants = { initial: { y: 0, rotate: 0 }, animate: { y: [-10, 10, -10], rotate: [-2, 2, -2], transition: { duration: 6, repeat: Infinity, ease: "easeInOut" } } };
const glowVariants = { initial: { boxShadow: "0 0 20px rgba(16, 185, 129, 0)" }, animate: { boxShadow: ["0 0 20px rgba(16, 185, 129, 0.3)", "0 0 40px rgba(16, 185, 129, 0.6)", "0 0 20px rgba(16, 185, 129, 0.3)"], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } } };

// --- Reusable Animated Counter ---
const AnimatedCounter = ({ value, isCurrency = false, suffix = "" }) => {
    const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
    const display = useTransform(spring, (current) => {
        if (isCurrency) {
            return new Intl.NumberFormat("ar-SA", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(current.toFixed(0));
        }
        return current.toFixed(0) + suffix;
    });

    useEffect(() => { spring.set(value); }, [spring, value]);

    return (
        <motion.span>
            {display}
        </motion.span>
    );
};

export default function ProjectDetailClient({ project }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [imageError, setImageError] = useState(false)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [isHovering, setIsHovering] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    // Check if device is mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }
        
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start end", "end start"] });

    const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const formatCurrency = (amount) => {
        if (typeof amount !== "number") return "غير محدد"
        return new Intl.NumberFormat("ar-SA", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)
    }

    // ✅ Themed sector colors
    const getSectorColor = (sectorKey) => {
        const colors = {
            Technology: { gradient: "from-green-600 to-emerald-500" },
            Agriculture: { gradient: "from-green-600 to-emerald-500" },
            "Cosmetics and Perfumes": { gradient: "from-pink-500 to-rose-500" },
            // Add other sectors if needed
            default: { gradient: "from-slate-600 to-slate-500" },
        }
        return colors[sectorKey] || colors.default
    }
    const sectorColors = getSectorColor(project?.sector?.en);

    const PrimaryButton = ({ children, className = "", icon: Icon, ...props }) => (
        <motion.button
            onClick={() => setIsModalOpen(true)}
            className={`group relative overflow-hidden bg-green-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg shadow-green-500/30 transition-all duration-500 ${className}`}
            whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.4)", y: -5 }}
            whileTap={{ scale: 0.95 }}
            {...props}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center gap-3 z-10">
                {Icon && <Icon className="w-5 h-5" />}
                {children}
                <motion.div className="group-hover:translate-x-1 transition-transform duration-300" animate={{ x: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                    <ArrowRight className="w-5 h-5" />
                </motion.div>
            </div>
        </motion.button>
    )

    const financialsRef = useRef(null);
    const isInView = useInView(financialsRef, { once: true, amount: 0.3 });

    if (!project) {
        // Optional: Render a loading state or a placeholder if project data is not yet available
        return <div className="min-h-screen flex items-center justify-center bg-slate-50">جاري تحميل بيانات المشروع...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800" dir="rtl">
            <div className="fixed inset-0 bg-gradient-to-br from-white via-green-50 to-slate-50" />

            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <motion.div variants={floatingVariants} initial="initial" animate="animate" className="absolute top-20 right-10 w-20 h-20 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-xl" />
                <motion.div variants={floatingVariants} initial="initial" animate="animate" style={{ animationDelay: "2s" }} className="absolute bottom-20 left-10 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-xl" />
            </div>

            <motion.section
                ref={heroRef}
                style={{ y, opacity }}
                className="relative pt-20 pb-32 md:pb-16 overflow-hidden"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {isHovering && !isMobile && <motion.div className="absolute pointer-events-none z-[5] w-96 h-96 rounded-full bg-gradient-to-r from-green-500/5 to-emerald-500/5 blur-3xl" animate={{ x: mousePosition.x - 192, y: mousePosition.y - 192 }} transition={{ type: "spring", stiffness: 150, damping: 15 }} />}

                <div className="relative z-20 container mx-auto px-6">
                    <motion.div className="flex flex-col-reverse lg:flex-row items-center gap-16" variants={containerVariants} initial="hidden" animate="visible">
                        <motion.div className="flex-1 text-right space-y-8" variants={itemVariants}>
                            <div className="space-y-4">
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-3 bg-green-100/80 backdrop-blur-sm border border-green-200/50 rounded-full px-4 py-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-green-800 font-medium text-sm">مشروع استثماري متميز</span>
                                </motion.div>
                                <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight">
                                    <motion.span initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8, type: "spring" }} className="block bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                                        {project.project_name}
                                    </motion.span>
                                </h1>
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="flex items-center gap-4 flex-wrap">
                                    <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${sectorColors.gradient} text-white font-medium shadow-lg`}>
                                        {project.sector?.ar || project.sector?.en}
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <MapPin className="w-4 h-4 text-green-500" />
                                        <span>{project.governate} • {project.location}</span>
                                    </div>
                                </motion.div>
                            </div>
                            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="text-xl text-slate-600 leading-relaxed max-w-2xl">
                                {project.description}
                            </motion.p>
                            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="grid grid-cols-2 gap-6 max-w-lg">
                                <div className="group relative overflow-hidden bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500">
                                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative z-10">
                                        <div className="text-sm text-slate-500 mb-2">المساحة الإجمالية</div>
                                        <div className="text-2xl font-bold text-slate-900">{project.area ? `${project.area.toLocaleString()} م²` : 'غير محدد'}</div>
                                        <div className="w-full h-1 bg-green-500/20 rounded-full mt-3">
                                            <motion.div className="h-full bg-green-500 rounded-full" initial={{ width: 0 }} animate={{ width: "75%" }} transition={{ delay: 1.2, duration: 1.5 }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="group relative overflow-hidden bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500">
                                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative z-10">
                                        <div className="text-sm text-slate-500 mb-2">الاستثمار المطلوب</div>
                                        <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                            {formatCurrency(project.financial_indicators?.total_investment)}
                                        </div>
                                        <div className="flex items-center gap-1 mt-2 text-green-600">
                                            <TrendingUp className="w-4 h-4" />
                                            <span className="text-xs font-medium">عائد متميز</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="flex flex-wrap gap-4">
                                <PrimaryButton icon={Sparkles}>احجز استشارة </PrimaryButton>
                            </motion.div>
                        </motion.div>
                        <motion.div className="pt-12 md:pt-0 w-full lg:w-auto flex justify-center relative z-10" variants={itemVariants} style={{ scale }}>
                            <div className="relative">
                                {/* Main image container with blob outline */}
                                <motion.div className="relative w-72 h-72 md:w-96 md:h-96">
                                    {/* Morphing blob outline behind the image - DISABLED ON MOBILE */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-br from-green-400/30 to-emerald-500/40"
                                        style={{
                                            borderRadius: isMobile ? "50%" : "60% 40% 70% 30% / 50% 60% 40% 70%",
                                            filter: "blur(3px)",
                                            scale: 1.1
                                        }}
                                        animate={!isMobile ? {
                                            borderRadius: [
                                                "60% 40% 70% 30% / 50% 60% 40% 70%",
                                                "30% 70% 40% 60% / 70% 30% 60% 50%",
                                                "70% 30% 50% 70% / 40% 70% 30% 60%",
                                                "40% 60% 30% 70% / 60% 40% 70% 30%",
                                                "60% 40% 70% 30% / 50% 60% 40% 70%"
                                            ],
                                            scale: [1.1, 1.15, 1.08, 1.12, 1.1],
                                            rotate: [0, 90, 180, 270, 360]
                                        } : {}}
                                        transition={!isMobile ? { duration: 15, repeat: Infinity, ease: "easeInOut" } : {}}
                                    />

                                    {/* Secondary blob outline with different color - DISABLED ON MOBILE */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-br from-cyan-400/25 to-blue-500/35"
                                        style={{
                                            borderRadius: isMobile ? "50%" : "40% 70% 60% 30% / 60% 30% 70% 50%",
                                            filter: "blur(4px)",
                                            scale: 1.06
                                        }}
                                        animate={!isMobile ? {
                                            borderRadius: [
                                                "40% 70% 60% 30% / 60% 30% 70% 50%",
                                                "70% 30% 50% 60% / 40% 70% 30% 60%",
                                                "30% 60% 40% 70% / 70% 50% 60% 40%",
                                                "60% 40% 70% 50% / 30% 60% 40% 70%",
                                                "40% 70% 60% 30% / 60% 30% 70% 50%"
                                            ],
                                            scale: [1.06, 1.09, 1.04, 1.07, 1.06],
                                            rotate: [0, -60, -120, -180, -240, -300, -360]
                                        } : {}}
                                        transition={!isMobile ? { duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 } : {}}
                                    />

                                    {/* Third subtle blob outline - DISABLED ON MOBILE */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-500/30"
                                        style={{
                                            borderRadius: isMobile ? "50%" : "50% 50% 40% 60% / 70% 40% 60% 30%",
                                            filter: "blur(5px)",
                                            scale: 1.03
                                        }}
                                        animate={!isMobile ? {
                                            borderRadius: [
                                                "50% 50% 40% 60% / 70% 40% 60% 30%",
                                                "60% 40% 70% 30% / 50% 60% 30% 70%",
                                                "40% 60% 30% 70% / 60% 30% 70% 40%",
                                                "70% 30% 60% 40% / 40% 70% 50% 60%",
                                                "50% 50% 40% 60% / 70% 40% 60% 30%"
                                            ],
                                            scale: [1.03, 1.05, 1.02, 1.04, 1.03],
                                            rotate: [0, 45, 90, 135, 180, 225, 270, 315, 360]
                                        } : {}}
                                        transition={!isMobile ? { duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2.5 } : {}}
                                    />

                                    {/* Subtle background glow - REDUCED ANIMATION ON MOBILE */}
                                    <motion.div
                                        className="absolute -inset-8 bg-gradient-to-r from-green-500/5 to-emerald-500/10 rounded-full blur-3xl"
                                        animate={!isMobile ? {
                                            scale: [1, 1.2, 1],
                                            opacity: [0.3, 0.6, 0.3]
                                        } : {
                                            opacity: 0.4
                                        }}
                                        transition={!isMobile ? { duration: 8, repeat: Infinity, ease: "easeInOut" } : {}}
                                    />

                                    {/* Clean circular image - positioned above the blobs */}
                                    <motion.div
                                        className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-white z-10"
                                        whileHover={!isMobile ? {
                                            scale: 1.02,
                                            boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.4)",
                                            borderColor: "rgba(255, 255, 255, 1)"
                                        } : {}}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                    >
                                        {!imageError ? (
                                            <img
                                                src={project.image}
                                                alt={project.project_name}
                                                className="w-full h-full object-cover"
                                                onError={() => setImageError(true)}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500">
                                                <ImageIcon className="w-16 h-16" />
                                            </div>
                                        )}
                                    </motion.div>

                                    {/* Subtle inner ring animation - DISABLED ON MOBILE */}
                                    <motion.div
                                        className="absolute inset-3 rounded-full border border-white/30 z-20"
                                        animate={!isMobile ? {
                                            rotate: [0, 360],
                                            opacity: [0.1, 0.4, 0.1]
                                        } : {
                                            opacity: 0.2
                                        }}
                                        transition={!isMobile ? {
                                            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                                            opacity: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                                        } : {}}
                                    />
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            <section className="py-32 relative bg-slate-50">
                <div className="container mx-auto px-6">
                    <motion.div className="text-center max-w-4xl mx-auto mb-20" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                        <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-xl border border-white/50 rounded-full px-6 py-3 shadow-xl mb-8">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse" />
                            <span className="text-slate-700 font-medium">تفاصيل المشروع</span>
                            <Zap className="w-4 h-4 text-green-500" />
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
                            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-500 bg-clip-text text-transparent">فرصة استثمارية</span><br /><span className="text-slate-800">لا تُفوّت</span>
                        </h2>
                        <p className="text-xl text-slate-600 leading-relaxed">اكتشف التفاصيل الشاملة لهذا المشروع الاستثماري الرائد والفرص الواعدة التي يوفرها</p>
                    </motion.div>

                    <motion.div className="grid lg:grid-cols-5 gap-16" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
                        <div className="lg:col-span-3 space-y-10">
                            <motion.div variants={itemVariants}><EnhancedFeatureCard icon={Globe} title="فرص السوق وحجمه">{project.market_size}</EnhancedFeatureCard></motion.div>
                            <motion.div variants={itemVariants}><EnhancedFeatureCard icon={Award} title="الميزة التنافسية">{project.competitive_advantage}</EnhancedFeatureCard></motion.div>
                            <motion.div variants={itemVariants}><EnhancedFeatureCard icon={Target} title="الرؤية والتوافق">{project.vision_alignment}</EnhancedFeatureCard></motion.div>
                        </div>
                        <aside className="lg:col-span-2 lg:sticky top-24 self-start space-y-8">
                            <motion.div variants={itemVariants} ref={financialsRef}>
                                <div className="group relative overflow-hidden bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700">
                                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                    <div className="relative z-10 p-6 md:p-8">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="p-4 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 shadow-inner">
                                                <TrendingUp className="h-8 w-8 text-green-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-slate-900">المؤشرات المالية</h3>
                                                <p className="text-slate-600">الأرقام الرئيسية</p>
                                            </div>
                                        </div>
                                        {/* ✅ UPDATED: Financial indicators section */}
                                        <div className="grid grid-cols-1 gap-4">
                                            <EnhancedFinancialCard label="إجمالي الاستثمار" value={isInView ? <AnimatedCounter value={project.financial_indicators.total_investment} isCurrency /> : "0"} icon={DollarSign} />
                                            <EnhancedFinancialCard label="معدل العائد الداخلي" value={project.financial_indicators.internal_rate_of_return} icon={BarChart3} />
                                            <EnhancedFinancialCard label="فترة الاسترداد" value={project.financial_indicators.payback_period} icon={Clock} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </aside>
                    </motion.div>
                </div>
            </section>

            <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    )
}

// Enhanced Sub-components
const EnhancedFeatureCard = ({ icon: Icon, title, children }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className="group relative overflow-hidden bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl transition-all duration-700"
            whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)", scale: 1.02 }}
            onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)}
        >
            <div className={`absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
            <div className="relative z-10 p-10">
                <div className="flex items-start gap-6 mb-6">
                    <motion.div className={`p-4 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 shadow-lg`} animate={isHovered ? { rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] } : {}} transition={{ duration: 0.6 }}>
                        <Icon className={`h-8 w-8 text-green-600`} />
                    </motion.div>
                    <div className="flex-1">
                        <h3 className="text-3xl font-bold text-slate-900 mb-3 group-hover:text-green-600 transition-colors duration-300">{title}</h3>
                        <motion.div className="w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" initial={{ width: 0 }} whileInView={{ width: 64 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.8 }} />
                    </div>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg">{children}</p>
                <motion.div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" whileHover={{ scale: 1.1 }}>
                    <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-500 rounded-full flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};


// ✅ NEW: More appealing financial indicator card component
const EnhancedFinancialCard = ({ label, value, icon: Icon }) => (
    <motion.div
        className="group relative bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:border-green-200 hover:-translate-y-1"
        whileHover={{ scale: 1.02 }}
    >
        <div className="flex justify-between items-start">
            <div className='space-y-1'>
                <span className="text-slate-600 font-medium text-sm md:text-base">{label}</span>
                <div className="font-bold text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {value}
                </div>
            </div>
            {Icon && (
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 shadow-inner border border-white/50">
                    <Icon className="w-6 h-6 text-green-600" />
                </div>
            )}
        </div>
    </motion.div>
);