"use client"

import { useState, useEffect, useCallback, useMemo, React } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { X, Loader2, CheckCircle, Shield, Clock, AlertTriangle, Mail, Phone, User, Briefcase, MessageSquare, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import emailjs from '@emailjs/browser'

// --- Configuration ---
const EMAILJS_CONFIG = {
  serviceId: 'service_aa68vbb',
  templateId: 'template_bfhencr',
  publicKey: 'pYsKCeeLOmSQ8vSHE'
}

const CONTACT_INFO = {
  email: "dirayaconsulting@gmail.com",
  phone: "01031564641",
  phoneDisplay: "+201031564641"
}

const SPAM_PROTECTION = {
  cooldownMinutes: 20,
  storageKey: 'booking_form_submissions',
  maxAttemptsPerHour: 3
}

// --- EmailJS Initialization ---
if (typeof window !== 'undefined') {
  emailjs.init(EMAILJS_CONFIG.publicKey)
}

// --- Anti-Spam Utility Functions (Kept Logic Intact) ---
const getStoredSubmissions = () => {
  try {
    const stored = localStorage.getItem(SPAM_PROTECTION.storageKey)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const addSubmission = (email) => {
  try {
    const submissions = getStoredSubmissions()
    const now = Date.now()
    const validSubmissions = submissions.filter(sub => now - sub.timestamp < 60 * 60 * 1000)
    validSubmissions.push({ email, timestamp: now })
    localStorage.setItem(SPAM_PROTECTION.storageKey, JSON.stringify(validSubmissions))
  } catch (error) {
    console.warn('Storage error:', error)
  }
}

const checkSpamProtection = (email) => {
  try {
    const submissions = getStoredSubmissions()
    const now = Date.now()
    const cooldownMs = SPAM_PROTECTION.cooldownMinutes * 60 * 1000
    
    const userSubmissions = submissions.filter(sub => sub.email === email)
    
    if (userSubmissions.length >= SPAM_PROTECTION.maxAttemptsPerHour) {
      return {
        canSubmit: false,
        reason: 'max_attempts',
        waitTime: Math.ceil((userSubmissions[0].timestamp + 60 * 60 * 1000 - now) / (60 * 1000))
      }
    }
    
    const lastSubmission = userSubmissions[userSubmissions.length - 1]
    if (lastSubmission && now - lastSubmission.timestamp < cooldownMs) {
      return {
        canSubmit: false,
        reason: 'cooldown',
        waitTime: Math.ceil((lastSubmission.timestamp + cooldownMs - now) / (60 * 1000))
      }
    }
    
    return { canSubmit: true }
  } catch {
    return { canSubmit: true }
  }
}

// --- Validation ---
const validateFormData = (data) => {
  const errors = {};

  if (!data.name.trim()) errors.name = "الاسم مطلوب";
  else if (data.name.trim().length < 2) errors.name = "الاسم قصير جداً";

  if (!data.email.trim()) errors.email = "البريد مطلوب";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "بريد غير صالح";

  if (!data.phone.trim()) errors.phone = "الهاتف مطلوب";
  else if (!/^[\+]?[\d\s\-\(\)]{8,15}$/.test(data.phone.replace(/\s/g, ''))) errors.phone = "رقم غير صالح";

  if (!data.projectName.trim()) errors.projectName = "اسم المشروع مطلوب";

  return errors;
};

export default function BookingModal({ isOpen, onClose }) {
  const { toast } = useToast()
  const prefersReducedMotion = useReducedMotion()
  const [isMounted, setIsMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('idle')
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectName: "",
    message: "",
  })
  const [errors, setErrors] = useState({})
  const [spamCheck, setSpamCheck] = useState({ canSubmit: true })

  useEffect(() => { setIsMounted(true) }, [])

  useEffect(() => {
    if (isOpen) {
      setSubmitStatus('idle')
      setErrors({})
    }
  }, [isOpen])
  
  useEffect(() => {
    if (formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setSpamCheck(checkSpamProtection(formData.email))
    } else {
      setSpamCheck({ canSubmit: true })
    }
  }, [formData.email])

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => { const newErrors = { ...prev }; delete newErrors[name]; return newErrors })
    if (submitStatus !== 'idle') setSubmitStatus('idle')
  }, [errors, submitStatus])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    
    const currentSpamCheck = checkSpamProtection(formData.email)
    if (!currentSpamCheck.canSubmit) {
      toast({
        title: "تنبيه 🛡️",
        description: currentSpamCheck.reason === 'cooldown' 
          ? `يرجى الانتظار ${currentSpamCheck.waitTime} دقيقة`
          : "تم تجاوز الحد المسموح من المحاولات",
        variant: "destructive",
      })
      return
    }

    const validationErrors = validateFormData(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setSubmitStatus('error')
      toast({ title: "خطأ في النموذج", description: "يرجى تصحيح الحقول المطلوبة", variant: "destructive" })
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        project_name: formData.projectName,
        message: formData.message || 'لا توجد تفاصيل إضافية',
        to_name: 'فريق دراية',
        reply_to: formData.email,
        submission_date: new Date().toLocaleString('ar-SA')
      }

      await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams, EMAILJS_CONFIG.publicKey)

      addSubmission(formData.email)
      setSubmitStatus('success')

      toast({
        title: "تم الإرسال بنجاح ✅",
        description: "سنتواصل معك خلال 24 ساعة.",
        variant: "default",
        duration: 5000,
      })
      
      setTimeout(onClose, 3500)

    } catch (error) {
      console.error('EmailJS Error:', error)
      setSubmitStatus('error')
      toast({ title: "فشل الإرسال", description: "يرجى المحاولة لاحقاً أو الاتصال بنا", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, toast, onClose])

  const modalVariants = useMemo(() => ({
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 300 } },
    exit: { opacity: 0, scale: 0.95, y: 10 },
  }), [])

  const formFields = useMemo(() => [
    { id: 'name', name: 'name', type: 'text', label: 'الاسم', placeholder: 'الاسم الكامل', icon: User, required: true },
    { id: 'phone', name: 'phone', type: 'tel', label: 'الهاتف', placeholder: '05X XXX XXXX', icon: Phone, required: true },
    { id: 'email', name: 'email', type: 'email', label: 'البريد', placeholder: 'example@mail.com', icon: Mail, required: true },
    { id: 'projectName', name: 'projectName', type: 'text', label: 'المشروع', placeholder: 'اسم المشروع', icon: Briefcase, required: true }
  ], [])

  const SubmitIcon = isSubmitting ? Loader2 : (submitStatus === 'error' ? AlertTriangle : CheckCircle);

  if (!isMounted) return null

  const modalContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] z-[999]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={submitStatus === 'success' ? undefined : onClose}
          />

          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]"
              variants={modalVariants}
              initial="hidden" animate="visible" exit="exit"
              dir="rtl"
            >
              {/* Header Section */}
              <div className="relative bg-gradient-to-l from-slate-50 to-white border-b px-6 py-4 flex justify-between items-start shrink-0">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">طلب استشارة مجانية</h2>
                    <p className="text-sm text-slate-500 mt-1">املأ النموذج وسنتواصل معك قريباً</p>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full -ml-2 hover:bg-slate-200/50 text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto px-6 py-5 custom-scrollbar">
                <AnimatePresence mode="wait">
                  {submitStatus === 'success' ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-12 text-center h-full"
                    >
                      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">تم استلام طلبك!</h3>
                      <p className="text-slate-600 max-w-xs mx-auto mb-8">شكراً لثقتك. سيقوم فريقنا بمراجعة مشروعك والاتصال بك على الرقم المسجل.</p>
                      <Button variant="outline" onClick={onClose} className="min-w-[150px]">إغلاق النافذة</Button>
                    </motion.div>
                  ) : (
                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      
                      {/* Contact Info Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                        <a href={`tel:${CONTACT_INFO.phone}`} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-green-200 hover:bg-green-50/30 transition-all group">
                            <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-600 group-hover:text-green-600 transition-colors">
                                <Phone className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 font-medium">للتواصل  (واتساب)</span>
                                <span className="text-sm font-bold text-slate-700 group-hover:text-green-700 font-mono" dir="ltr">{CONTACT_INFO.phoneDisplay}</span>
                            </div>
                        </a>
                        <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-green-200 hover:bg-green-50/30 transition-all group">
                            <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-600 group-hover:text-green-600 transition-colors">
                                <Mail className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 font-medium">راسلنا عبر البريد</span>
                                <span className="text-xs font-bold text-slate-700 group-hover:text-green-700 font-sans truncate max-w-[180px]">{CONTACT_INFO.email}</span>
                            </div>
                        </a>
                      </div>

                      {!spamCheck.canSubmit && (
                        <div className="mb-5 p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-3 text-amber-800 text-sm">
                          <Clock className="w-5 h-5 shrink-0 mt-0.5" />
                          <p>{spamCheck.reason === 'cooldown' ? `يرجى الانتظار ${spamCheck.waitTime} دقيقة قبل المحاولة مجدداً.` : "تم تجاوز الحد المسموح للطلبات."}</p>
                        </div>
                      )}

                      <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Grid Layout for Inputs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {formFields.map((field) => (
                            <div key={field.id} className="space-y-1.5">
                              <Label htmlFor={field.id} className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                                <field.icon className="w-3.5 h-3.5" /> {field.label}
                              </Label>
                              <Input
                                id={field.id} name={field.name} type={field.type}
                                value={formData[field.name]} onChange={handleChange}
                                placeholder={field.placeholder}
                                disabled={isSubmitting}
                                className={`bg-slate-50/50 border-slate-200 h-10 focus:bg-white transition-all ${errors[field.name] ? "border-red-400 ring-1 ring-red-400/20" : "focus:border-green-500 focus:ring-green-500/20"}`}
                              />
                              {errors[field.name] && <p className="text-[10px] text-red-500 font-medium px-1">{errors[field.name]}</p>}
                            </div>
                          ))}
                        </div>

                        {/* Message Area */}
                        <div className="space-y-1.5">
                          <Label htmlFor="message" className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5" /> تفاصيل إضافية
                          </Label>
                          <Textarea
                            id="message" name="message"
                            value={formData.message} onChange={handleChange}
                            placeholder="صف مشروعك بإيجاز..."
                            rows={3}
                            disabled={isSubmitting}
                            className="bg-slate-50/50 border-slate-200 min-h-[80px] resize-none focus:bg-white focus:border-green-500 focus:ring-green-500/20"
                          />
                        </div>

                        {/* Footer Action */}
                        <div className="pt-2">
                          <Button 
                            type="submit" 
                            className={`w-full h-11 font-bold shadow-lg shadow-green-900/10 hover:shadow-green-900/20 transition-all duration-300 ${submitStatus === 'error' ? 'bg-red-600 hover:bg-red-700' : 'bg-gradient-to-r from-green-700 to-emerald-600 hover:to-emerald-700'}`}
                            disabled={isSubmitting || !spamCheck.canSubmit}
                          >
                             {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <span className="flex items-center gap-2">
                                  {submitStatus === 'error' ? 'حاول مرة أخرى' : 'تأكيد الحجز'}
                                  <ArrowLeft className="w-4 h-4" />
                                </span>
                             )}
                          </Button>
                          <p className="text-center text-[10px] text-slate-400 mt-3 flex items-center justify-center gap-1">
                            <Shield className="w-3 h-3" /> بياناتك محمية وآمنة 100%
                          </p>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )

  return (
    <>
      {createPortal(modalContent, document.body)}
      <Toaster />
    </>
  )
}