"use client"

import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, ImageIcon, Upload, Clock, Download } from "lucide-react"

export function LandingPage() {
  const { t, dir } = useLanguage()

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Blur and Gradient */}
        <div className="absolute inset-0">
          <Image
            src="/images/manga-hero.jpg"
            alt="Manga Background"
            fill
            className="object-cover object-top"
            priority
          />
          {/* Blur overlay on the image */}
          <div className="absolute inset-0 backdrop-blur-sm" />
          {/* Gradient fade to background color */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 pt-24 pb-16 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/10 backdrop-blur-sm border border-foreground/20 mb-8">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">{t("hero.badge")}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-balance max-w-4xl mx-auto">
            {t("hero.title")}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty">
            {t("hero.subtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="gap-2 text-base px-8" asChild>
              <Link href="/translate">
                {t("hero.cta")}
                <ArrowRight className={`h-4 w-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8" asChild>
              <a href="#features">{t("hero.secondary")}</a>
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-foreground/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-foreground/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            {t("features.title")}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl border border-border bg-card hover:bg-accent/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-foreground/10 flex items-center justify-center mb-6 group-hover:bg-foreground/20 transition-colors">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t("feature1.title")}</h3>
              <p className="text-muted-foreground">{t("feature1.desc")}</p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl border border-border bg-card hover:bg-accent/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-foreground/10 flex items-center justify-center mb-6 group-hover:bg-foreground/20 transition-colors">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t("feature2.title")}</h3>
              <p className="text-muted-foreground">{t("feature2.desc")}</p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl border border-border bg-card hover:bg-accent/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-foreground/10 flex items-center justify-center mb-6 group-hover:bg-foreground/20 transition-colors">
                <ImageIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t("feature3.title")}</h3>
              <p className="text-muted-foreground">{t("feature3.desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            {t("howItWorks.title")}
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-foreground text-background flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <div className="w-12 h-12 rounded-xl bg-foreground/10 flex items-center justify-center mx-auto mb-4">
                <Upload className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t("step1.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("step1.desc")}</p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-foreground text-background flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <div className="w-12 h-12 rounded-xl bg-foreground/10 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t("step2.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("step2.desc")}</p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-foreground text-background flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <div className="w-12 h-12 rounded-xl bg-foreground/10 flex items-center justify-center mx-auto mb-4">
                <Download className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t("step3.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("step3.desc")}</p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Button size="lg" className="gap-2 text-base px-8" asChild>
              <Link href="/translate">
                {t("hero.cta")}
                <ArrowRight className={`h-4 w-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
