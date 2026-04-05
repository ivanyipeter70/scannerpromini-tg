"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Shield, AlertTriangle, CheckCircle } from "lucide-react"

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void
        expand: () => void
        MainButton: {
          hide: () => void
          show: () => void
          setText: (text: string) => void
          onClick: (callback: () => void) => void
        }
        themeParams: {
          bg_color?: string
          text_color?: string
          hint_color?: string
          link_color?: string
          button_color?: string
          button_text_color?: string
          secondary_bg_color?: string
        }
        colorScheme: "light" | "dark"
        initDataUnsafe: {
          user?: {
            id: number
            first_name: string
            last_name?: string
            username?: string
          }
        }
      }
    }
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default function ScannerProMini() {
  const [isLoading, setIsLoading] = useState(true)
  const [url, setUrl] = useState("")
  const [scanning, setScanning] = useState(false)
  const [output, setOutput] = useState<string[]>([])
  const [isTelegram, setIsTelegram] = useState(false)
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load Telegram WebApp SDK
    const script = document.createElement("script")
    script.src = "https://telegram.org/js/telegram-web-app.js"
    script.async = true
    script.onload = () => {
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp
        tg.ready()
        tg.expand()
        tg.MainButton.hide()
        setIsTelegram(true)
      }
      setIsLoading(false)
    }
    script.onerror = () => {
      setIsLoading(false)
    }
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  const handleScan = async () => {
    if (!url.trim()) return

    setScanning(true)
    setOutput([])

    const steps = [
      { text: "🔍 Probing edge nodes…", delay: 600 },
      { text: "🌐 Fingerprinting CDN…", delay: 500 },
      { text: "📡 Enumerating subdomains…", delay: 700 },
      { text: "🔐 Checking security headers…", delay: 400 },
      { text: "🛡️ Analyzing SSL/TLS configuration…", delay: 550 },
      { text: "📋 Scanning for common vulnerabilities…", delay: 650 },
    ]

    for (const step of steps) {
      setOutput((prev) => [...prev, step.text])
      await sleep(step.delay)
    }

    // Generate pseudo vulnerabilities
    const vulns = [
      { severity: "high", text: "X-Frame-Options header missing" },
      { severity: "medium", text: "CSP contains unsafe-inline directive" },
      { severity: "high", text: "Exposed .git directory detected" },
      { severity: "low", text: "Debug headers may leak information" },
      { severity: "medium", text: "Potential open redirect vulnerability" },
      { severity: "low", text: "Server version exposed in headers" },
    ]

    setOutput((prev) => [...prev, "", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "🔓 SCAN RESULTS:", ""])

    for (const vuln of vulns) {
      const icon = vuln.severity === "high" ? "🔴" : vuln.severity === "medium" ? "🟡" : "🟢"
      setOutput((prev) => [...prev, `${icon} [${vuln.severity.toUpperCase()}] ${vuln.text}`])
      await sleep(200)
    }

    setOutput((prev) => [
      ...prev,
      "",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      `✅ Scan completed for: ${url}`,
      `📊 Found ${vulns.length} potential issues`,
    ])

    setScanning(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground font-mono">INITIALIZING…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
              Scanner Pro Mini
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {isTelegram ? "🔷 Running in Telegram" : "Security Analysis Tool"}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                type="url"
                placeholder="https://target.site"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={scanning}
                className="font-mono text-sm bg-background/50"
                onKeyDown={(e) => e.key === "Enter" && handleScan()}
              />
              <Button
                onClick={handleScan}
                disabled={scanning || !url.trim()}
                className="w-full bg-gradient-to-r from-pink-500 to-primary hover:from-pink-600 hover:to-primary/90"
              >
                {scanning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Scan Target
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {output.length > 0 && (
          <Card className="border-primary/20 bg-card/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                Scan Output
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                ref={outputRef}
                className="bg-background/80 rounded-lg p-4 font-mono text-xs max-h-80 overflow-y-auto space-y-1"
              >
                {output.map((line, i) => (
                  <div
                    key={i}
                    className={`${
                      line.includes("🔴")
                        ? "text-red-400"
                        : line.includes("🟡")
                          ? "text-yellow-400"
                          : line.includes("🟢")
                            ? "text-green-400"
                            : line.includes("✅")
                              ? "text-green-500"
                              : "text-foreground/80"
                    }`}
                  >
                    {line || "\u00A0"}
                  </div>
                ))}
                {scanning && (
                  <div className="flex items-center gap-2 text-primary">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Processing...</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {!scanning && output.length > 0 && output.some((line) => line.includes("✅")) && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-sm text-green-500">
              <CheckCircle className="h-4 w-4" />
              Scan Complete
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
