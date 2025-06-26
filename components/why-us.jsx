"use client"

import { Clock, BarChart4, FileCheck, Briefcase, Users, Eye, Fingerprint } from "lucide-react"
import { motion } from "framer-motion"
import { useIsMobile } from "@/hooks/useIsMobile" // Assuming the hook is in this path

export default function WhyUs() {
  const isMobile = useIsMobile();

  const reasons = [
    {
      icon: <Clock className="h-8 w-8" />,
      title: "سرعة الإنجاز",
      description: "نلتزم بجدول زمني واضح وننهي خدماتنا في أسرع وقت ممكن دون مساومة على الجودة، لأننا نعلم أن الوقت هو رأس مالكم.",
      gradient: "from-sky-400 to-cyan-400",
    },
    {
      icon: <BarChart4 className="h-8 w-8" />,
      title: "كفاءة مُثبتة",
      description: "نستخدم أحدث الأدوات التحليلية لتحقيق الاستغلال الأمثل للموارد، مما يضمن لكم توفيرًا في التكاليف ونتائجًا ملموسة.",
      gradient: "from-green-400 to-emerald-400",
    },
    {
      icon: <FileCheck className="h-8 w-8" />,
      title: "دقة علمية",
      description: "دراساتنا تعتمد على منهجيات بحثية مُحكمة وبيانات مُحدثة، لضمان نتائج خالية من الأخطاء وقابلة للتنفيذ.",
      gradient: "from-violet-400 to-purple-400",
    },
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: "نهج عملي",
      description: "لا نقدم نظريات، بل حلولًا قابلة للتنفيذ تتناسب مع واقع السوق ومتطلبات مشروعك الفعلية.",
      gradient: "from-rose-400 to-pink-400",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "فريق متعدد التخصصات",
      description: "خبراء في الاقتصاد، التسويق، التمويل، والهندسة يعملون معًا لضمان تغطية شاملة لجميع جوانب مشروعك.",
      gradient: "from-blue-400 to-indigo-400",
    },
    {
      icon: <Fingerprint className="h-8 w-8" />,
      title: "تخصيص كامل",
      description: "نرفض الحلول الجاهزة؛ كل مشروع له بصمة فريدة ويستحق دراسة مخصصة تناسب ظروفه وأهدافه الخاصة.",
      gradient: "from-amber-400 to-orange-400",
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15, duration: 0.5 },
    },
  };

  return (
    <section 
      className="relative w-full overflow-hidden bg-[#F7F9FC] text-slate-800 py-24 md:py-32"
      // OPTIMIZATION: Replaced the two large, blurred div elements with a high-performance CSS radial gradient background.
      style={{
        backgroundImage: 'radial-gradient(circle at 10% 20%, hsl(180 80% 90%), transparent 40%), radial-gradient(circle at 90% 80%, hsl(260 90% 92%), transparent 40%)',
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            لماذا نحن شريكك المثالي للنجاح؟
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            نحن لا نقدم خدمات استشارية فقط، بل نبني شراكات استراتيجية قائمة على أسس من الخبرة، الدقة، والابتكار.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              // OPTIMIZATION: Hover effect is disabled on mobile for better performance.
              whileHover={!isMobile ? { y: -8, scale: 1.02 } : {}}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              // OPTIMIZATION: Removed expensive backdrop-blur and heavy shadows.
              // Replaced with a lightweight, translucent background and a subtle shadow.
              className="relative p-8 rounded-3xl h-full bg-white/95 border border-white/80 shadow-lg shadow-slate-900/5"
            >
              <div className={`flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-gradient-to-br ${reason.gradient} text-white shadow-md`}>
                {reason.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{reason.title}</h3>
              <p className="text-slate-600 leading-relaxed">{reason.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-24 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {/* OPTIMIZATION: The concluding card is also optimized with a lightweight background and shadow. */}
          <div className="relative p-8 text-center rounded-3xl bg-white/95 border border-white/80 shadow-lg shadow-slate-900/5">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 text-white mb-4">
                <Eye className="h-8 w-8"/>
            </div>
            <p className="text-xl md:text-2xl font-medium text-slate-700 leading-relaxed">
              "لنبدأ رحلتك الاستثمارية معًا — حيث تُحلل الفرص، تُقاس المخاطر، و<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500 font-bold">يُبنى النجاح</span>."
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}