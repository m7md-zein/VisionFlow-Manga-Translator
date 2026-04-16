"use client"

import { LanguageProvider } from "@/context/language-context"
import { ThemeProvider } from "@/context/theme-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { TranslatorPage } from "@/components/translator-page"

export default function Translate() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Header />
          <main>
            <TranslatorPage />
          </main>
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  )
}
