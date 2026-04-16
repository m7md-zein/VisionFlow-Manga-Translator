"use client"

import { LanguageProvider } from "@/context/language-context"
import { ThemeProvider } from "@/context/theme-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LandingPage } from "@/components/landing-page"

export default function Home() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Header />
          <main>
            <LandingPage />
          </main>
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  )
}
