"use client"

import { useState, useEffect, useCallback, useMemo, React } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { X, Loader2, CheckCircle, Shield, Clock, AlertTriangle, Mail, Phone, User, Briefcase, MessageSquare } from "lucide-react"
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

const SPAM_PROTECTION = {
  cooldownMinutes: 20,
  storageKey: 'booking_form_submissions',
  maxAttemptsPerHour: 3
}

// --- EmailJS Initialization ---
if (typeof window !== 'undefined') {
  emailjs.init(EMAILJS_CONFIG.publicKey)
}

// --- Anti-Spam Utility Functions ---
const getStoredSubmissions = () => {
  try {
    const stored = localStorage.getItem(SPAM_PROTECTION.storageKey)
    return stored ? JSON.parse(stored) : []
  } catch {
    console.warn('Could not parse stored submission data.')
    return []
  }
}

const addSubmission = (email) => {
  try {
    const submissions = getStoredSubmissions()
    const now = Date.now()
    
    const validSubmissions = submissions.filter(
      sub => now - sub.timestamp < 60 * 60 * 1000
    )
    
    validSubmissions.push({ email, timestamp: now })
    localStorage.setItem(SPAM_PROTECTION.storageKey, JSON.stringify(validSubmissions))
  } catch (error) {
    console.warn('Could not store submission data:', error)
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
      const waitTime = Math.ceil((lastSubmission.timestamp + cooldownMs - now) / (60 * 1000))
      return {
        canSubmit: false,
        reason: 'cooldown',
        waitTime
      }
    }
    
    return { canSubmit: true }
  } catch {
    return { canSubmit: true }
  }
}

// --- Validation Helper Function ---
const validateFormData = (data) => {
  const errors = {};

  if (!data.name.trim()) {
    errors.name = "الاسم مطلوب";
  } else if (data.name.trim().length < 2) {
    errors.name = "الاسم يجب أن يكون على الأقل حرفين";
  } else if (!/^[\u0600-\u06FF\s\u0621-\u064Aa-zA-Z]+$/.test(data.name.trim())) {
    errors.name = "الاسم يجب أن يحتوي على أحرف عربية أو إنجليزية فقط";
  }

  if (!data.email.trim()) {
    errors.email = "البريد الإلكتروني مطلوب";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "البريد الإلكتروني غير صالح";
  }

  if (!data.phone.trim()) {
    errors.phone = "رقم الهاتف مطلوب";
  } else if (!/^[\+]?[\d\s\-\(\)]{8,15}$/.test(data.phone.replace(/\s/g, ''))) {
    errors.phone = "رقم الهاتف غير صالح";
  }

  if (!data.projectName.trim()) {
    errors.projectName = "اسم المشروع مطلوب";
  } else if (data.projectName.trim().length < 3) {
    errors.projectName = "اسم المشروع يجب أن يكون على الأقل 3 أحرف";
  }

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

  useEffect(() => {
    setIsMounted(true)
  }, [])

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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }

    if (submitStatus !== 'idle') {
      setSubmitStatus('idle')
    }
  }, [errors, submitStatus])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    
    const currentSpamCheck = checkSpamProtection(formData.email)
    if (!currentSpamCheck.canSubmit) {
      const message = currentSpamCheck.reason === 'cooldown' 
        ? `يرجى الانتظار ${currentSpamCheck.waitTime} دقيقة قبل إرسال طلب جديد`
        : `تم تجاوز الحد المسموح (${SPAM_PROTECTION.maxAttemptsPerHour} طلبات في الساعة). يرجى المحاولة لاحقاً`
      
      toast({
        title: "حماية من الرسائل المكررة 🛡️",
        description: message,
        variant: "destructive",
        duration: 6000,
      })
      return
    }

    const validationErrors = validateFormData(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setSubmitStatus('error')
      const firstError = Object.values(validationErrors)[0]
      
      toast({
        title: "خطأ في النموذج ❌",
        description: firstError,
        variant: "destructive",
      })
      return
    }

    setErrors({})
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        project_name: formData.projectName,
        message: formData.message || 'لم يتم تقديم تفاصيل إضافية',
        to_name: 'فريق شركة سعود',
        reply_to: formData.email,
        submission_date: new Date().toLocaleDateString('ar-SA', {
          year: 'numeric', month: 'long', day: 'numeric',
          hour: '2-digit', minute: '2-digit'
        })
      }

      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
        EMAILJS_CONFIG.publicKey
      )

      addSubmission(formData.email)
      setSubmitStatus('success')

      toast({
        title: "تم إرسال طلب الاستشارة بنجاح! ✅",
        description: "شكراً لك! سيتواصل معك فريقنا خلال 24 ساعة لتأكيد موعد الاستشارة .",
        variant: "default",
        duration: 5000,
      })
      
      setTimeout(onClose, 3000)

    } catch (error) {
      console.error('EmailJS Error:', error)
      setSubmitStatus('error')
      
      let errorMessage = "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى أو الاتصال بنا مباشرة."
      if (error && typeof error.status === 'number') {
        switch (error.status) {
          case 400: errorMessage = "خطأ في البيانات المرسلة. يرجى التحقق من صحة المعلومات."; break;
          case 401: errorMessage = "خطأ في التحقق من الهوية. يرجى المحاولة لاحقاً."; break;
          case 402: errorMessage = "تم تجاوز حد الرسائل المسموح. يرجى المحاولة غداً أو الاتصال بنا مباشرة."; break;
          case 404: errorMessage = "خدمة البريد الإلكتروني غير متاحة حالياً. يرجى الاتصال بنا مباشرة."; break;
        }
      }

      toast({
        title: "فشل في إرسال الطلب ❌",
        description: errorMessage,
        variant: "destructive",
        duration: 6000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, toast, onClose])

  const modalVariants = useMemo(() => ({
    hidden: { opacity: 0, scale: prefersReducedMotion ? 1 : 0.95, y: prefersReducedMotion ? 10 : 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: prefersReducedMotion ? { duration: 0.2, ease: "easeOut" } : { type: "spring", damping: 25, stiffness: 200 } },
    exit: { opacity: 0, scale: prefersReducedMotion ? 1 : 0.95, y: prefersReducedMotion ? 10 : 20, transition: { duration: prefersReducedMotion ? 0.15 : 0.2 } },
  }), [prefersReducedMotion])

  const overlayVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: prefersReducedMotion ? 0.15 : 0.3 }
  }), [prefersReducedMotion])

  const formFields = useMemo(() => [
    { id: 'name', name: 'name', type: 'text', label: 'الاسم الكامل', placeholder: 'محمد عبدالله', icon: User, required: true },
    { id: 'email', name: 'email', type: 'email', label: 'البريد الإلكتروني', placeholder: 'example@domain.com', icon: Mail, required: true },
    { id: 'phone', name: 'phone', type: 'tel', label: 'رقم الهاتف', placeholder: '+966 5X XXX XXXX', icon: Phone, required: true },
    { id: 'projectName', name: 'projectName', type: 'text', label: 'اسم المشروع', placeholder: 'تطوير عقاري', icon: Briefcase, required: true }
  ], [])

  const getStatusColor = () => {
    if (submitStatus === 'error') return 'from-red-600 to-red-500'
    return 'from-green-600 to-emerald-500'
  }

  const SubmitIcon = useMemo(() => {
    if (isSubmitting) return Loader2;
    if (submitStatus === 'error') return AlertTriangle;
    return CheckCircle;
  }, [isSubmitting, submitStatus]);

  const modalContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[999]"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={submitStatus === 'success' ? undefined : onClose}
          />

          <div className="fixed inset-0 z-[1000] flex items-center justify-center px-3 py-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <motion.div
              className="w-full max-w-md max-h-[95vh] bg-white rounded-2xl shadow-xl shadow-green-900/20 z-[1000] overflow-hidden flex flex-col"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              dir="rtl"
            >
              <div className={`h-1.5 bg-gradient-to-r ${getStatusColor()} transition-colors duration-300`} />
              
              <div className="flex-1 overflow-y-auto p-5">
                <AnimatePresence mode="wait">
                  {submitStatus === 'success' ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="text-center py-6"
                    >
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-green-700 mb-2">تم إرسال طلبك بنجاح! 🎉</h3>
                      <p className="text-slate-600 mb-4 leading-relaxed text-sm">شكراً لك على ثقتك بنا. سيتواصل معك فريقنا خلال <strong>24 ساعة</strong> لتأكيد موعد الاستشارة .</p>
                      <div className="flex items-center justify-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-lg p-2">
                        <Shield className="w-3 h-3" />
                        <span>يمكنك إرسال طلب جديد خلال {SPAM_PROTECTION.cooldownMinutes} دقيقة</span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 id="modal-title" className="text-xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">حجز استشارة</h2>
                          <p className="text-slate-600 mt-1 text-sm">املأ النموذج وسيتواصل فريقنا معك خلال 24 ساعة.</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-slate-100 flex-shrink-0 -mr-2 -mt-2 h-8 w-8" disabled={isSubmitting} aria-label="إغلاق النافذة">
                          <X className="h-4 w-4 text-slate-500" />
                        </Button>
                      </div>

                      {!spamCheck.canSubmit && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2"
                        >
                          <Clock className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-amber-800 mb-1 text-sm">حماية من الرسائل المكررة</h4>
                            <p className="text-xs text-amber-700">
                              {spamCheck.reason === 'cooldown'
                                ? `يرجى الانتظار ${spamCheck.waitTime} دقيقة قبل إرسال طلب جديد.`
                                : `تم تجاوز الحد المسموح (${SPAM_PROTECTION.maxAttemptsPerHour} طلبات في الساعة).`}
                            </p>
                          </div>
                        </motion.div>
                      )}
                      
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 gap-3">
                          {formFields.map(({ id, name, type, label, placeholder, icon: Icon, required }) => (
                            <div key={id} className="space-y-1">
                              <Label htmlFor={id} className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <Icon className="w-3.5 h-3.5" />
                                {label} {required && <span className="text-red-500">*</span>}
                              </Label>
                              <Input 
                                id={id} name={name} type={type}
                                value={formData[name]}
                                onChange={handleChange}
                                placeholder={placeholder}
                                className={`bg-slate-50 border-slate-200 h-10 focus:border-green-500 focus:ring-green-500/20 transition-all duration-200 ${
                                  errors[name] && "border-red-500 focus:border-red-500 focus:ring-red-500/20 shake-animation"
                                }`}
                                aria-invalid={!!errors[name]}
                                aria-describedby={errors[name] ? `${id}-error` : undefined}
                                disabled={isSubmitting}
                              />
                              {errors[name] && (
                                <motion.p 
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  id={`${id}-error`} 
                                  className="text-red-600 text-xs flex items-center gap-1" 
                                  role="alert"
                                >
                                  <AlertTriangle className="w-3 h-3" />
                                  {errors[name]}
                                </motion.p>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="message" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <MessageSquare className="w-3.5 h-3.5" />
                            تفاصيل إضافية (اختياري)
                          </Label>
                          <Textarea 
                            id="message" name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="أخبرنا المزيد عن مشروعك وما تحتاجه من استشارة..."
                            rows={2}
                            className="bg-slate-50 border-slate-200 focus:border-green-500 focus:ring-green-500/20 resize-none transition-colors text-sm"
                            disabled={isSubmitting}
                          />
                        </div>

                        <div className="pt-2">
                          <Button 
                            onClick={handleSubmit}
                            className={`w-full h-11 text-base font-bold bg-gradient-to-r text-white rounded-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed ${getStatusColor()} hover:opacity-90`}
                            disabled={isSubmitting || !spamCheck.canSubmit}
                          >
                            <div className="flex items-center justify-center">
                              <SubmitIcon className={`ml-2 h-4 w-4 ${isSubmitting && 'animate-spin'}`} />
                              {isSubmitting ? 'جاري الإرسال...' : (submitStatus === 'error' ? 'إعادة المحاولة' : 'إرسال طلب الاستشارة')}
                            </div>
                          </Button>
                        </div>

                        <div className="flex items-center justify-center gap-3 text-xs text-slate-500 pt-1">
                          <div className="flex items-center gap-1"><Shield className="w-3 h-3" /><span>حماية من الرسائل المكررة</span></div>
                          <div className="w-1 h-1 bg-slate-300 rounded-full" />
                          <div className="flex items-center gap-1"><Clock className="w-3 h-3" /><span>رد خلال 24 ساعة</span></div>
                        </div>
                      </div>
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

  if (!isMounted) return null

  return (
    <>
      {createPortal(modalContent, document.body)}
      <Toaster />
      <style jsx global>{`
        @keyframes shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-3px); }
          40%, 60% { transform: translateX(3px); }
        }
        .shake-animation {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </>
  )
}