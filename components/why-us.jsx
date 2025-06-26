"use client"

import { Clock, BarChart4, FileCheck, Briefcase, Users, Eye, Fingerprint } from "lucide-react"
import { motion } from "framer-motion"

export default function WhyUs() {
  const reasons = [
    {
      icon: <Clock className="h-8 w-8" />,
      title: "سرعة الإنجاز",
      description: "نلتزم بجدول زمني واضح وننهي خدماتنا في أسرع وقت ممكن دون مساومة على الجودة، لأننا نعلم أن الوقت هو رأس مالكم.",
      gradient: "from-sky-300 to-cyan-300",
    },
    {
      icon: <BarChart4 className="h-8 w-8" />,
      title: "كفاءة مُثبتة",
      description: "نستخدم أحدث الأدوات التحليلية لتحقيق الاستغلال الأمثل للموارد، مما يضمن لكم توفيرًا في التكاليف ونتائجًا ملموسة.",
      gradient: "from-green-300 to-emerald-300",
    },
    {
      icon: <FileCheck className="h-8 w-8" />,
      title: "دقة علمية",
      description: "دراساتنا تعتمد على منهجيات بحثية مُحكمة وبيانات مُحدثة، لضمان نتائج خالية من الأخطاء وقابلة للتنفيذ.",
      gradient: "from-violet-300 to-purple-300",
    },
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: "نهج عملي",
      description: "لا نقدم نظريات، بل حلولًا قابلة للتنفيذ تتناسب مع واقع السوق ومتطلبات مشروعك الفعلية.",
      gradient: "from-rose-300 to-pink-300",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "فريق متعدد التخصصات",
      description: "خبراء في الاقتصاد، التسويق، التمويل، والهندسة يعملون معًا لضمان تغطية شاملة لجميع جوانب مشروعك.",
      gradient: "from-blue-300 to-indigo-300",
    },
    {
      icon: <Fingerprint className="h-8 w-8" />,
      title: "تخصيص كامل",
      description: "نرفض الحلول الجاهزة؛ كل مشروع له بصمة فريدة ويستحق دراسة مخصصة تناسب ظروفه وأهدافه الخاصة.",
      gradient: "from-amber-200 to-orange-300",
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
    <section className="relative w-full overflow-hidden bg-[#F7F9FC] text-slate-800 py-24 md:py-32">
      {/* Background Gradient Orbs */}
      <div className="absolute top-[-10rem] -left-1/4 w-full h-full bg-gradient-to-br from-cyan-100/80 to-transparent rounded-full filter blur-3xl opacity-50 -z-10"></div>
      <div className="absolute bottom-[-15rem] -right-1/4 w-full h-full bg-gradient-to-tl from-violet-100/80 to-transparent rounded-full filter blur-3xl opacity-50 -z-10"></div>

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

        {/* Premium Glassmorphism Grid */}
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
              whileHover={{ y: -10, scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="group relative p-8 rounded-3xl h-full overflow-hidden
                         bg-white/50 backdrop-blur-2xl border border-white/50
                         shadow-xl shadow-slate-300/20"
            >
              {/* Subtle glow effect on hover */}
              <div className={`absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${reason.gradient} blur-3xl`}></div>
              
              <div className={`flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-gradient-to-br ${reason.gradient} text-white shadow-lg shadow-slate-400/10`}>
                {reason.icon}
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-3">{reason.title}</h3>
              <p className="text-slate-600 leading-relaxed">{reason.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Concluding Statement Card */}
        <motion.div
          className="mt-24 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="relative p-8 text-center rounded-3xl bg-white/50 backdrop-blur-2xl border border-white/50 shadow-xl shadow-slate-300/20">
             <div className="absolute -inset-4 bg-gradient-to-r from-green-200 to-cyan-200 rounded-full blur-3xl opacity-30 -z-10"></div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-300 to-cyan-300 text-white mb-4">
                  <Eye className="h-8 w-8"/>
              </div>
              <p className="text-xl md:text-2xl font-medium text-slate-700 leading-relaxed">
              "لنبدأ رحلتك الاستثمارية معًا — حيث تُحلل الفرص، تُقاس المخاطر، و<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">يُبنى النجاح</span>."
              </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}