"use client"

import { LanguageProvider } from "@/context/language-context"
import { ThemeProvider } from "@/context/theme-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContactPage } from "@/components/contact-page"

export default function Contact() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Header />
          <main>
            <ContactPage />
          </main>
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  )
}
