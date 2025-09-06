"use client"

import { useState } from "react"
import BookingModal from "@/components/booking-modal"

export default function BookingTrigger({ label = 'طلب استشارة', className = 'bg-green-600 text-white text-center py-3 rounded-lg', initialProjectName = '' }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className={className}>
        {label}
      </button>
      <BookingModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
