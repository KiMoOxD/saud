"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function BookingModal({ isOpen, onClose }) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectName: "",
    message: "",
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "الاسم مطلوب"
    }

    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صالح"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "رقم الهاتف مطلوب"
    }

    if (!formData.projectName.trim()) {
      newErrors.projectName = "اسم المشروع مطلوب"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Replace these with your actual EmailJS service ID, template ID, and public key
      const serviceId = "YOUR_SERVICE_ID"
      const templateId = "YOUR_TEMPLATE_ID"
      const publicKey = "YOUR_PUBLIC_KEY"

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        from_phone: formData.phone,
        project_name: formData.projectName,
        message: formData.message,
      }

      // Uncomment this when you have your EmailJS credentials
      // await emailjs.send(serviceId, templateId, templateParams, publicKey);

      // For demo purposes, we'll simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "تم حجز الاستشارة!",
        description: "سنتواصل معك قريبًا لتأكيد موعد الاستشارة.",
        variant: "success",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        projectName: "",
        message: "",
      })

      // Close modal after successful submission
      onClose()
    } catch (error) {
      console.error("Error sending email:", error)
      toast({
        title: "حدث خطأ ما",
        description: "يرجى المحاولة مرة أخرى لاحقًا أو الاتصال بنا مباشرة.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 500,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
      },
    },
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={overlayVariants}
              onClick={onClose}
            />

            <motion.div
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
              dir="rtl"
            >
              {/* Decorative header */}
              <div className="h-3 bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-500" />

              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-700 to-emerald-600 bg-clip-text text-transparent">
                    حجز استشارة
                  </h2>
                  <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-gray-100">
                    <X className="h-5 w-5 text-gray-500" />
                  </Button>
                </div>

                <p className="text-gray-600 mb-6">املأ النموذج أدناه وسيتواصل فريقنا معك خلال 24 ساعة.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      الاسم الكامل <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="محمد عبدالله"
                      className={errors.name ? "border-red-500" : ""}
                      aria-invalid={errors.name ? "true" : "false"}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      البريد الإلكتروني <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@domain.com"
                      className={errors.email ? "border-red-500" : ""}
                      aria-invalid={errors.email ? "true" : "false"}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      رقم الهاتف <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+966 5X XXX XXXX"
                      className={errors.phone ? "border-red-500" : ""}
                      aria-invalid={errors.phone ? "true" : "false"}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="projectName" className="text-sm font-medium">
                      اسم المشروع <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="projectName"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleChange}
                      placeholder="إعادة تصميم موقع الويب"
                      className={errors.projectName ? "border-red-500" : ""}
                      aria-invalid={errors.projectName ? "true" : "false"}
                    />
                    {errors.projectName && <p className="text-red-500 text-xs mt-1">{errors.projectName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-medium">
                      تفاصيل إضافية
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="أخبرنا المزيد عن مشروعك..."
                      rows={4}
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-500 hover:from-teal-600 hover:via-emerald-500 hover:to-teal-400 text-white py-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          جاري المعالجة...
                        </div>
                      ) : (
                        "حجز استشارة"
                      )}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Decorative footer */}
              <div className="h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <Toaster />
    </>
  )
}
