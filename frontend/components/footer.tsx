"use client"

import Link from "next/link"
import { useLanguage } from "@/context/language-context"

export function Footer() {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-foreground rounded-sm flex items-center justify-center">
              <span className="text-background font-bold text-xs">漫</span>
            </div>
            <span className="font-bold text-sm">MangaTranslate</span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("nav.home")}
            </Link>
            <Link
              href="/translate"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("nav.translate")}
            </Link>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("nav.contact")}
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {currentYear} MangaTranslate. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  )
}
