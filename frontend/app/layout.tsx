import type { Metadata } from "next"
import { Noto_Sans_Arabic, Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
})

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
})

export const metadata: Metadata = {
  title: "MangaTranslate - ترجمة المانجا من العربية للإنجليزية",
  description:
    "مترجم المانجا بالذكاء الاصطناعي - ارفع صفحات المانجا العربية واحصل على ترجمة احترافية للإنجليزية في ثوانٍ | AI-Powered Manga Translator from Arabic to English",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark bg-background" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${notoSansArabic.variable} font-sans antialiased`}
      >
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
