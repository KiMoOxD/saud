import "./globals.css"
import { Inter, Noto_Sans_Arabic } from 'next/font/google';
import Navbar from '../components/navbar'
import Footer from '../components/footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-noto-sans-arabic',
});

export const metadata = {
  title: "شركة دراية | خدمات استشارية متكاملة",
  description:
    "شركة استشارات متخصصة في دراسات الجدوى وخطط الأعمال والدراسات الفنية في المملكة العربية السعودية ودول الخليج",
    generator: 'دراية'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSansArabic.variable}`}>
      <body className="bg-white text-gray-800">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
