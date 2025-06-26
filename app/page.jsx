import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import Portfolio from "@/components/portfolio"
import WhyUs from "@/components/why-us"
import Countries from "@/components/countries"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-white" dir="rtl">
      <Navbar />
      <Hero />
      <Portfolio />
      <WhyUs />
      <Countries />
      <Footer />
    </main>
  )
}
