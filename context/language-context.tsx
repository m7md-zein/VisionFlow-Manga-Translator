"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "ar" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  dir: "rtl" | "ltr"
}

const translations = {
  ar: {
    // Landing Page
    "hero.badge": "مترجم المانجا بالذكاء الاصطناعي",
    "hero.title": "ترجم المانجا من العربية للإنجليزية",
    "hero.subtitle": "ارفع صفحات المانجا العربية واحصل على ترجمة احترافية للإنجليزية في ثوانٍ",
    "hero.cta": "ابدأ الترجمة الآن",
    "hero.secondary": "اعرف المزيد",
    
    // Features
    "features.title": "لماذا تختارنا؟",
    "feature1.title": "ترجمة ذكية",
    "feature1.desc": "نستخدم أحدث تقنيات الذكاء الاصطناعي لفهم سياق المانجا وترجمتها بدقة",
    "feature2.title": "سريع وسهل",
    "feature2.desc": "ارفع الصورة واحصل على الترجمة في ثوانٍ معدودة",
    "feature3.title": "جودة عالية",
    "feature3.desc": "نحافظ على جودة الصورة الأصلية مع إضافة الترجمة بشكل احترافي",
    
    // How it works
    "howItWorks.title": "كيف يعمل؟",
    "step1.title": "ارفع الصورة",
    "step1.desc": "اختر صفحة المانجا العربية من جهازك",
    "step2.title": "انتظر الترجمة",
    "step2.desc": "سيقوم الذكاء الاصطناعي بتحليل وترجمة النص",
    "step3.title": "حمّل النتيجة",
    "step3.desc": "احصل على الصورة مترجمة بجودة عالية",
    
    // Header
    "nav.home": "الرئيسية",
    "nav.translate": "ترجم الآن",
    "nav.contact": "تواصل معنا",
    
    // Translator Page
    "translator.title": "مترجم المانجا",
    "translator.subtitle": "ارفع صفحة المانجا العربية وسنترجمها للإنجليزية",
    "translator.upload": "اضغط أو اسحب الصورة هنا",
    "translator.uploadHint": "PNG, JPG حتى 10MB",
    "translator.translating": "جاري الترجمة...",
    "translator.result": "النتيجة",
    "translator.download": "تحميل الصورة",
    "translator.tryAgain": "ترجمة صورة أخرى",
    
    // Footer
    "footer.rights": "جميع الحقوق محفوظة",
    "footer.developers": "المطورين",
    
    // Contact
    "contact.title": "تواصل معنا",
    "contact.desc": "نحن هنا للإجابة على استفساراتك",
    "contact.email": "البريد الإلكتروني",
    "contact.message": "رسالتك",
    "contact.send": "إرسال",
  },
  en: {
    // Landing Page
    "hero.badge": "AI-Powered Manga Translator",
    "hero.title": "Translate Manga from Arabic to English",
    "hero.subtitle": "Upload your Arabic manga pages and get professional English translation in seconds",
    "hero.cta": "Start Translating",
    "hero.secondary": "Learn More",
    
    // Features
    "features.title": "Why Choose Us?",
    "feature1.title": "Smart Translation",
    "feature1.desc": "We use cutting-edge AI to understand manga context and translate accurately",
    "feature2.title": "Fast & Easy",
    "feature2.desc": "Upload your image and get the translation in seconds",
    "feature3.title": "High Quality",
    "feature3.desc": "We preserve original image quality while adding professional translations",
    
    // How it works
    "howItWorks.title": "How It Works?",
    "step1.title": "Upload Image",
    "step1.desc": "Select your Arabic manga page from your device",
    "step2.title": "Wait for Translation",
    "step2.desc": "Our AI will analyze and translate the text",
    "step3.title": "Download Result",
    "step3.desc": "Get your translated image in high quality",
    
    // Header
    "nav.home": "Home",
    "nav.translate": "Translate Now",
    "nav.contact": "Contact Us",
    
    // Translator Page
    "translator.title": "Manga Translator",
    "translator.subtitle": "Upload your Arabic manga page and we will translate it to English",
    "translator.upload": "Click or drag image here",
    "translator.uploadHint": "PNG, JPG up to 10MB",
    "translator.translating": "Translating...",
    "translator.result": "Result",
    "translator.download": "Download Image",
    "translator.tryAgain": "Translate Another",
    
    // Footer
    "footer.rights": "All Rights Reserved",
    "footer.developers": "Developers",
    
    // Contact
    "contact.title": "Contact Us",
    "contact.desc": "We are here to answer your questions",
    "contact.email": "Email",
    "contact.message": "Your Message",
    "contact.send": "Send",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("ar")

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language
    if (saved) setLanguage(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem("language", language)
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = language
  }, [language])

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.ar] || key
  }

  const dir = language === "ar" ? "rtl" : "ltr"

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
