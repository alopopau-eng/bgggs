import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileText, CreditCard } from "lucide-react";
import type { ApplicationType } from "@shared/schema";

interface ApplicationTypeStepProps {
  value: ApplicationType;
  onChange: (value: ApplicationType) => void;
}

export function ApplicationTypeStep({
  value,
  onChange,
}: ApplicationTypeStepProps) {
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

      <RadioGroup
        value={value}
        onValueChange={(v) => onChange(v as ApplicationType)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <RadioGroupItem
            value="passport"
            id="passport"
            className="peer sr-only"
          />
          <Label htmlFor="passport" className="cursor-pointer">
            <Card
              className={`
                transition-all hover-elevate cursor-pointer
                ${value === "passport" ? "ring-2 ring-[#8A1538] border-[#8A1538]" : ""}
              `}
              data-testid="card-passport-option"
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
                  <li>وقت المعالجة: 4-6 أسابيع</li>
                  <li>الرسوم: من 150 ر.ق</li>
                </ul>
              </CardContent>
            </Card>
          </Label>
        </div>

        <div>
          <RadioGroupItem
            value="id_card"
            id="id_card"
            className="peer sr-only"
          />
          <Label htmlFor="id_card" className="cursor-pointer">
            <Card
              className={`
                transition-all hover-elevate cursor-pointer
                ${value === "id_card" ? "ring-2 ring-[#8A1538] border-[#8A1538]" : ""}
              `}
              data-testid="card-id-option"
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
                  <li>وقت المعالجة: 2-3 أسابيع</li>
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
