"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { Upload, ImageIcon, Download, RefreshCw, Loader2 } from "lucide-react"
import { useDropzone } from "react-dropzone"

export function TranslatorPage() {
  const { t } = useLanguage()
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isTranslating, setIsTranslating] = useState(false)
  const [translatedImage, setTranslatedImage] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setUploadedImage(reader.result as string)
        setTranslatedImage(null)
        // Simulate translation
        simulateTranslation()
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const simulateTranslation = () => {
    setIsTranslating(true)
    // Simulate API call delay
    setTimeout(() => {
      setIsTranslating(false)
      // For demo, we'll just show the same image
      // In real app, this would be the translated image from API
      setTranslatedImage(uploadedImage)
    }, 3000)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const handleReset = () => {
    setUploadedImage(null)
    setTranslatedImage(null)
    setIsTranslating(false)
  }

  const handleDownload = () => {
    if (translatedImage) {
      const link = document.createElement("a")
      link.href = translatedImage
      link.download = "translated-manga.png"
      link.click()
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-foreground/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-foreground/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t("translator.title")}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("translator.subtitle")}
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {!uploadedImage ? (
            /* Upload Area */
            <div
              {...getRootProps()}
              className={`
                relative border-2 border-dashed rounded-2xl p-12 md:p-20 text-center cursor-pointer
                transition-all duration-300 ease-out
                ${
                  isDragActive
                    ? "border-foreground bg-foreground/5 scale-[1.02]"
                    : "border-border hover:border-foreground/50 hover:bg-foreground/5"
                }
              `}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-foreground/10 flex items-center justify-center">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-lg font-medium mb-2">{t("translator.upload")}</p>
                  <p className="text-sm text-muted-foreground">{t("translator.uploadHint")}</p>
                </div>
              </div>

              {/* Decorative corners */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-foreground/30 rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-foreground/30 rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-foreground/30 rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-foreground/30 rounded-br-lg" />
            </div>
          ) : (
            /* Result Area */
            <div className="space-y-8">
              {/* Images Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Original Image */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <ImageIcon className="h-4 w-4" />
                    Original
                  </div>
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-border bg-muted">
                    <Image
                      src={uploadedImage}
                      alt="Original manga"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Translated Image */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <ImageIcon className="h-4 w-4" />
                    {t("translator.result")}
                  </div>
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-border bg-muted">
                    {isTranslating ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="h-10 w-10 animate-spin text-foreground" />
                        <p className="text-sm font-medium">{t("translator.translating")}</p>
                      </div>
                    ) : translatedImage ? (
                      <Image
                        src={translatedImage}
                        alt="Translated manga"
                        fill
                        className="object-contain"
                      />
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  onClick={handleDownload}
                  disabled={!translatedImage || isTranslating}
                  className="gap-2 min-w-[200px]"
                >
                  <Download className="h-4 w-4" />
                  {t("translator.download")}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleReset}
                  className="gap-2 min-w-[200px]"
                >
                  <RefreshCw className="h-4 w-4" />
                  {t("translator.tryAgain")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
