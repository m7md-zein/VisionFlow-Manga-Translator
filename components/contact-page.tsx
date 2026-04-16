"use client"

import { useState } from "react"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Send, CheckCircle } from "lucide-react"

export function ContactPage() {
  const { t } = useLanguage()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 1500)
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-foreground/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-foreground/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-foreground/10 flex items-center justify-center mx-auto mb-6">
              <Mail className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{t("contact.title")}</h1>
            <p className="text-muted-foreground">{t("contact.desc")}</p>
          </div>

          {/* Form */}
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  {t("contact.email")}
                </label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  {t("contact.message")}
                </label>
                <Textarea
                  id="message"
                  required
                  placeholder="..."
                  className="min-h-[150px] resize-none"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {t("contact.send")}
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-foreground/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
              <p className="text-muted-foreground mb-6">
                {"We'll get back to you as soon as possible."}
              </p>
              <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                Send Another Message
              </Button>
            </div>
          )}

          {/* Contact Info */}
          <div className="mt-12 pt-12 border-t border-border">
            <div className="grid gap-6">
              <a
                href="mailto:contact@mangatranslate.com"
                className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-accent/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-foreground/10 flex items-center justify-center">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("contact.email")}</p>
                  <p className="font-medium">contact@mangatranslate.com</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
