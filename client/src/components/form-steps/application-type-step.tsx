"use client";

import { useState } from "react";
import type { ApplicationType } from "@shared/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { FileText, CreditCard } from "lucide-react";

interface ApplicationTypeStepProps {
  value: ApplicationType;
  onChange: (value: ApplicationType) => void;
}

type RequestMode = "new" | "renew"|"newpasss" | "renew";

export function ApplicationTypeStep({
  value,
  onChange,
}: ApplicationTypeStepProps) {
  const [requestMode, setRequestMode] = useState<RequestMode>("new");

  const handlePayValue = (val: string) => {
    localStorage.setItem("amount", val);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          اختر نوع الطلب
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          اختر نوع الوثيقة التي تريد التقدم للحصول عليها
        </p>
      </div>
      <div className="flex gap-2 mb-3 w-full">
                  <Button
                    type="button"
                    size="sm"
                    className={requestMode === "new" ?"w-full bg-[#8A1538] border-0":"w-full border-0"}
                    variant={requestMode === "new" ? "default" : "outline"}
                    onClick={() => {
                      setRequestMode("new");
                      handlePayValue("150 QAR");
                    }}
                  >
                    إصدار جديد
                  </Button>

                  <Button
                    type="button"
                    size="sm"                    className={requestMode === "new" ?"w-full bg-[#8A1538] border-0":"w-full border-0"}

                    variant={requestMode === "renew" ? "default" : "outline"}
                    onClick={() => {
                      setRequestMode("renew");
                      handlePayValue("100 QAR");
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
              setRequestMode("new");
              handlePayValue("150 QAR");
            }}
          />

          <Label htmlFor="passport" className="cursor-pointer">
            <Card
              className={`transition-all hover-elevate cursor-pointer ${
                value === "passport"
                  ? "ring-2 ring-[#8A1538] border-[#8A1538]"
                  : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-[#8A1538]/10">
                    <FileText className="h-6 w-6 text-[#8A1538]" />
                  </div>
                  <div>
                    <CardTitle className="text-base">جواز السفر</CardTitle>
                    <CardDescription className="text-xs">
                      وثيقة السفر الدولي
                    </CardDescription>
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
              setRequestMode("new");
              handlePayValue("50 QAR");
            }}
          />

          <Label htmlFor="id_card" className="cursor-pointer">
            <Card
              className={`transition-all hover-elevate cursor-pointer ${
                value === "id_card"
                  ? "ring-2 ring-[#8A1538] border-[#8A1538]"
                  : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-[#8A1538]/10">
                    <CreditCard className="h-6 w-6 text-[#8A1538]" />
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      بطاقة الهوية الوطنية
                    </CardTitle>
                    <CardDescription className="text-xs">
                      وثيقة الهوية الرسمية
                    </CardDescription>
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
    </div>
  );
}
