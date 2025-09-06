"use client"

import { Clock, BarChart4, FileCheck, Briefcase, Users, Eye, Fingerprint } from "lucide-react"
import { motion } from "framer-motion"
import { useIsMobile } from "@/hooks/useIsMobile" // Assuming the hook is in this path
import React from "react"

// --- Background Blobs with Updated Color ---
const BackgroundBlobs = () => (
  <div className="absolute inset-0 z-0 overflow-hidden">
    <motion.div
      className="absolute top-[-10%] left-[-15%] w-[30rem] h-[30rem] rounded-full filter blur-3xl opacity-15"
      // UPDATED: Blob color changed to #00FF87
      style={{ backgroundColor: '#00FF87' }}
      animate={{
        x: [0, 50, -30, 0],
        y: [0, -40, 60, 0],
        rotate: [0, 120, -100, 0],
        scale: [1, 1.1, 0.9, 1],
      }}
      transition={{
        duration: 30,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror",
      }}
    />
    <motion.div
      className="absolute bottom-[-10%] right-[-15%] w-[25rem] h-[25rem] rounded-full filter blur-3xl opacity-20"
      // UPDATED: Blob color changed to #00FF87
      style={{ backgroundColor: '#00FF87' }}
      animate={{
        x: [0, -50, 40, 0],
        y: [0, 60, -30, 0],
        rotate: [0, -150, 80, 0],
      }}
      transition={{
        duration: 25,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror",
        delay: 5,
      }}
    />
  </div>
);

// --- NEW: Animated Particles Component ---
const Particles = React.memo(({ count = 100 }) => {
  const particles = Array.from({ length: count }).map((_, i) => {
    const size = Math.random() * 2 + 1;
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 5;
    const initialX = Math.random() * 100;
    const initialY = Math.random() * 100;
    const finalY = initialY + (Math.random() > 0.5 ? -1 : 1) * (Math.random() * 20 + 10);
    const finalX = initialX + (Math.random() > 0.5 ? -1 : 1) * (Math.random() * 20 + 10);

    return (
      <motion.circle
        key={i}
        cx={`${initialX}%`}
        cy={`${initialY}%`}
        r={size}
        fill="#00FF87"
        opacity={0.3}
        animate={{
          cx: [`${initialX}%`, `${finalX}%`, `${initialX}%`],
          cy: [`${initialY}%`, `${finalY}%`, `${initialY}%`],
        }}
        transition={{
          duration,
          delay,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
    );
  });

  return <svg className="absolute inset-0 w-full h-full z-0">{particles}</svg>;
});


export default function WhyUs() {
  const isMobile = useIsMobile();

  const reasons = [
    { icon: Clock, title: "سرعة الإنجاز", description: "نلتزم بجدول زمني واضح وننهي خدماتنا في أسرع وقت ممكن دون مساومة على الجودة، لأننا نعلم أن الوقت هو رأس مالكم." },
    { icon: BarChart4, title: "كفاءة مُثبتة", description: "نستخدم أحدث الأدوات التحليلية لتحقيق الاستغلال الأمثل للموارد، مما يضمن لكم توفيرًا في التكاليف ونتائجًا ملموسة." },
    { icon: FileCheck, title: "دقة علمية", description: "دراساتنا تعتمد على منهجيات بحثية مُحكمة وبيانات مُحدثة، لضمان نتائج خالية من الأخطاء وقابلة للتنفيذ." },
    { icon: Briefcase, title: "نهج عملي", description: "لا نقدم نظريات، بل حلولًا قابلة للتنفيذ تتناسب مع واقع السوق ومتطلبات مشروعك الفعلية." },
    { icon: Users, title: "فريق متعدد التخصصات", description: "خبراء في الاقتصاد، التسويق، التمويل، والهندسة يعملون معًا لضمان تغطية شاملة لجميع جوانب مشروعك." },
    { icon: Fingerprint, title: "تخصيص كامل", description: "نرفض الحلول الجاهزة؛ كل مشروع له بصمة فريدة ويستحق دراسة مخصصة تناسب ظروفه وأهدافه الخاصة." },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15, duration: 0.5 } },
  };

  return (
    <section className="relative w-full overflow-hidden bg-white text-slate-800 py-24 md:py-32">
      <BackgroundBlobs />
      {/* NEW: Particles are added to the background */}
      <Particles count={isMobile ? 30 : 60} />
      
      <svg className="absolute w-0 h-0">
        <defs>
          <linearGradient id="icon-stroke-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#5dc56b' }} />
            <stop offset="100%" style={{ stopColor: '#3a9d47' }} />
          </linearGradient>
        </defs>
      </svg>

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
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={!isMobile ? { y: -8, scale: 1.02 } : {}}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="relative p-8 rounded-3xl h-full bg-white/60 backdrop-blur-sm border border-slate-200/50 shadow-lg shadow-slate-900/5"
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl mb-6 shadow-md shadow-slate-500/10">
                  <Icon 
                    className="h-9 w-9" 
                    stroke="url(#icon-stroke-gradient)"
                    strokeWidth={2.5}
                    fill="none"
                  />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{reason.title}</h3>
                <p className="text-slate-600 leading-relaxed">{reason.description}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* <motion.div
          className="mt-24 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="relative p-8 text-center rounded-3xl bg-white/60 backdrop-blur-sm border border-slate-200/50 shadow-lg shadow-slate-900/5">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 shadow-md shadow-slate-500/10">
                <Eye 
                  className="h-9 w-9"
                  stroke="url(#icon-stroke-gradient)"
                  strokeWidth={2.5}
                  fill="none"
                />
            </div>
            <p className="text-xl md:text-2xl font-medium text-slate-700 leading-relaxed">
              "لنبدأ رحلتك الاستثمارية معًا — حيث تُحلل الفرص، تُقاس المخاطر، و<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500 font-bold">يُبنى النجاح</span>."
            </p>
          </div>
        </motion.div> */}
      </div>
    </section>
  )
}