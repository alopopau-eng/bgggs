"use client"

import { useState } from "react"
import type { ApplicationType } from "@shared/schema"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, CreditCard, Zap } from "lucide-react"

interface ApplicationTypeStepProps {
  value: ApplicationType
  onChange: (value: ApplicationType) => void
}

type RequestMode = "new" | "renew"

export function ApplicationTypeStep({ value, onChange }: ApplicationTypeStepProps) {
  const [requestMode, setRequestMode] = useState<RequestMode>("new")
  const [quickDelivery, setQuickDelivery] = useState(false)

  const handlePayValue = (baseAmount: number) => {
    const quickDeliveryFee = quickDelivery ? 100 : 0
    const total = baseAmount + quickDeliveryFee

    localStorage.setItem("baseAmount", `${baseAmount} QAR`)
    localStorage.setItem("quickDeliveryFee", `${quickDeliveryFee} QAR`)
    localStorage.setItem("amount", `${total} QAR`)
  }

  const getBasePrice = () => {
    if (value === "passport") {
      return requestMode === "new" ? 150 : 100
    } else if (value === "id_card") {
      return 50
    }
    return 0
  }

  const handleQuickDeliveryChange = (checked: boolean) => {
    setQuickDelivery(checked)
    const basePrice = getBasePrice()
    if (basePrice > 0) {
      const quickDeliveryFee = checked ? 100 : 0
      const total = basePrice + quickDeliveryFee

      localStorage.setItem("baseAmount", `${basePrice} QAR`)
      localStorage.setItem("quickDeliveryFee", `${quickDeliveryFee} QAR`)
      localStorage.setItem("amount", `${total} QAR`)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">اختر نوع الطلب</h2>
        <p className="text-sm text-muted-foreground mt-1">اختر نوع الوثيقة التي تريد التقدم للحصول عليها</p>
      </div>

      <div className="flex gap-2 mb-3 w-full">
        <Button
          type="button"
          size="sm"
          className={requestMode === "new" ? "w-full bg-[#8A1538] border-0" : "w-full border-0"}
          variant={requestMode === "new" ? "default" : "outline"}
          onClick={() => {
            setRequestMode("new")
            handlePayValue(value === "passport" ? 150 : 50)
          }}
        >
          إصدار جديد
        </Button>

        <Button
          type="button"
          size="sm"
          className={requestMode === "renew" ? "w-full bg-[#8A1538] border-0" : "w-full border-0"}
          variant={requestMode === "renew" ? "default" : "outline"}
          onClick={() => {
            setRequestMode("renew")
            handlePayValue(100)
          }}
        >
          تجديد
        </Button>
      </div>

      <RadioGroup
        value={value}
        onValueChange={(v) => onChange(v as ApplicationType)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* ================= PASSPORT ================= */}
        <div>
          <RadioGroupItem
            value="passport"
            id="passport"
            className="peer sr-only"
            onClick={() => {
              setRequestMode("new")
              handlePayValue(150)
            }}
          />

          <Label htmlFor="passport" className="cursor-pointer">
            <Card
              className={`transition-all hover-elevate cursor-pointer ${
                value === "passport" ? "ring-2 ring-[#8A1538] border-[#8A1538]" : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-[#8A1538]/10">
                    <FileText className="h-6 w-6 text-[#8A1538]" />
                  </div>
                  <div>
                    <CardTitle className="text-base">جواز السفر</CardTitle>
                    <CardDescription className="text-xs">وثيقة السفر الدولي</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>صالح للسفر الدولي</li>
                  <li>صلاحية 10 سنوات للبالغين</li>
                  <li>وقت المعالجة: 2-1 أسابيع</li>
                  <li>الرسوم: من 150 ر.ق</li>
                </ul>
              </CardContent>
            </Card>
          </Label>
        </div>

        {/* ================= ID CARD ================= */}
        <div>
          <RadioGroupItem
            value="id_card"
            id="id_card"
            className="peer sr-only"
            onClick={() => {
              setRequestMode("new")
              handlePayValue(50)
            }}
          />

          <Label htmlFor="id_card" className="cursor-pointer">
            <Card
              className={`transition-all hover-elevate cursor-pointer ${
                value === "id_card" ? "ring-2 ring-[#8A1538] border-[#8A1538]" : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-[#8A1538]/10">
                    <CreditCard className="h-6 w-6 text-[#8A1538]" />
                  </div>
                  <div>
                    <CardTitle className="text-base">بطاقة الهوية الوطنية</CardTitle>
                    <CardDescription className="text-xs">وثيقة الهوية الرسمية</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>إثبات الهوية والجنسية</li>
                  <li>صلاحية 5 سنوات</li>
                  <li>وقت المعالجة: 2-1 أسابيع</li>
                  <li>الرسوم: من 50 ر.ق</li>
                </ul>
              </CardContent>
            </Card>
          </Label>
        </div>
      </RadioGroup>

      <Card className="border-2 border-dashed border-[#8A1538]/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Checkbox id="quick-delivery" checked={quickDelivery} onCheckedChange={handleQuickDeliveryChange} />
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="quick-delivery"
                  className="text-sm font-medium leading-none cursor-pointer flex items-center gap-2"
                >
                  <Zap className="h-4 w-4 text-[#8A1538]" />
                  التوصيل السريع
                </Label>
                <span className="text-xs font-semibold text-[#8A1538] bg-[#8A1538]/10 px-2 py-1 rounded">+100 ر.ق</span>
              </div>
              <p className="text-xs text-muted-foreground">احصل على وثيقتك في 3-1 أيام عمل بدلاً من 2-1 أسابيع</p>
              {quickDelivery && (
                <div className="text-xs font-medium text-[#8A1538] bg-[#8A1538]/5 p-2 rounded-md mt-2">
                  المبلغ الإجمالي: {getBasePrice() + 100} ر.ق
                  <span className="text-muted-foreground text-xs mr-2">
                    ({getBasePrice()} ر.ق + 100 ر.ق رسوم التوصيل السريع)
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
