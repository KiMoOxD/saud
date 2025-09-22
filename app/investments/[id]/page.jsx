import React from "react"
import Link from "next/link"
import Image from "next/image"
import BookingTrigger from "@/components/booking-trigger"

import investmentsData from "@/data/investments.json"

const { investments } = investmentsData

function formatCurrency(amount) {
  if (typeof amount !== 'number') return amount
  try {
    return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(amount)
  } catch (e) {
    return amount
  }
}

export default function InvestmentDetailPage({ params }) {
  // `params` may be a Promise in this Next.js runtime; unwrap with React.use
  const resolvedParams = React.use(params)
  const id = parseInt(resolvedParams?.id)
  const investment = investments.find(i => Number(i.id) === id)

  if (!investment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">لم يتم العثور على الفرصة الاستثمارية</h2>
          <Link href="/investments" className="text-green-600 underline">عودة إلى الفرص</Link>
        </div>
      </div>
    )
  }

  const { name, description, country, location, image, financial_indicators = {}, market_size, competitive_advantage, sector, area, tags, contact, documents, team, stage } = investment

  return (
    <div className="min-h-screen bg-white text-slate-800" dir="rtl">

      <header className="relative bg-gradient-to-b from-green-50 to-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-right">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">{name}</h1>
            <p className="text-slate-600 mb-6">{description}</p>
            <div className="flex flex-wrap gap-4 items-center">
              {country?.ar && <div className="inline-flex items-center gap-2 bg-white/60 p-2 rounded-md shadow">{country.ar}</div>}
              {location && <div className="inline-flex items-center gap-2 bg-white/60 p-2 rounded-md shadow">{location}</div>}
              <Link href="/investments" className="ml-auto text-sm text-green-600 underline">العودة إلى الفرص</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {image && (
              <div className="rounded-2xl overflow-hidden shadow-lg relative w-full" style={{ minHeight: 288 }}>
                <Image src={image} alt={name} fill className="object-cover" />
              </div>
            )}

            <section className="bg-white rounded-2xl p-6 shadow">
              <h2 className="text-2xl font-bold mb-3">وصف الفرصة</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{description}</p>
            </section>

            {/* Optional market & advantage sections */}
            {market_size && (
              <section className="bg-white rounded-2xl p-6 shadow">
                <h3 className="text-lg font-semibold mb-2">حجم السوق</h3>
                <p className="text-slate-600 whitespace-pre-wrap">{market_size}</p>
              </section>
            )}

            {competitive_advantage && (
              <section className="bg-white rounded-2xl p-6 shadow">
                <h3 className="text-lg font-semibold mb-2">الميزة التنافسية</h3>
                <p className="text-slate-600 whitespace-pre-wrap">{competitive_advantage}</p>
              </section>
            )}

            {team && (
              <section className="bg-white rounded-2xl p-6 shadow">
                <h3 className="text-lg font-semibold mb-2">فريق العمل</h3>
                <p className="text-slate-600 whitespace-pre-wrap">{typeof team === 'string' ? team : JSON.stringify(team)}</p>
              </section>
            )}

          </div>

          <aside className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow">
              <h3 className="text-lg font-bold mb-2">المؤشرات المالية</h3>
              <div className="space-y-3 text-right">
                {typeof financial_indicators.total_investment_cost === 'number' && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">حجم الاستثمار</span>
                    <span className="font-semibold">{formatCurrency(financial_indicators.total_investment_cost)}</span>
                  </div>
                )}
                {financial_indicators.roi && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">العائد على الاستثمار</span>
                    <span className="font-semibold text-green-600">{financial_indicators.roi}</span>
                  </div>
                )}
                {financial_indicators.payback_period && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">فترة الاسترداد</span>
                    <span className="font-semibold">{financial_indicators.payback_period}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow text-right">
              <h4 className="font-semibold mb-3">تفاصيل إضافية</h4>
              <div className="space-y-3 text-sm text-slate-600">
                {sector && <div><span className="font-medium">القطاع: </span>{sector?.ar || sector?.en || sector}</div>}
                {area && <div><span className="font-medium">المساحة/الحجم: </span>{area}</div>}
                {tags && Array.isArray(tags) && <div><span className="font-medium">الوسوم: </span>{tags.join('، ')}</div>}
                {stage && <div><span className="font-medium">المرحلة: </span>{stage}</div>}
                {contact && (
                  <div>
                    <div className="font-medium">معلومات الاتصال:</div>
                    <div className="text-slate-700">
                      {contact.name && <div>الاسم: {contact.name}</div>}
                      {contact.email && <div>البريد: {contact.email}</div>}
                      {contact.phone && <div>الهاتف: {contact.phone}</div>}
                    </div>
                  </div>
                )}
                {documents && Array.isArray(documents) && (
                  <div>
                    <div className="font-medium">مستندات:</div>
                    <ul className="list-disc list-inside text-slate-700">
                      {documents.map((d, idx) => (
                        <li key={idx}><a href={d.url} target="_blank" rel="noreferrer" className="text-green-600 underline">{d.name || d.url}</a></li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-3 flex flex-col gap-3">
                  <Link href="/investments" className="text-slate-700 p-3 rounded-lg border">العودة إلى الفرص</Link>
                  <BookingTrigger />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

    </div>
  )
}
