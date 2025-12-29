import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import type { DocumentInfo, ApplicationType } from "@shared/schema";

interface DocumentInfoStepProps {
  value: Partial<DocumentInfo>;
  onChange: (value: Partial<DocumentInfo>) => void;
  applicationType: ApplicationType;
  errors: Record<string, string>;
}

export function DocumentInfoStep({ value, onChange, applicationType, errors }: DocumentInfoStepProps) {
  const updateField = <K extends keyof DocumentInfo>(field: K, val: DocumentInfo[K]) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">معلومات الوثائق</h2>
        <p className="text-sm text-muted-foreground mt-1">
          أدخل تفاصيل أي وثائق سفر أو هوية موجودة لديك
        </p>
      </div>

      {applicationType === "passport" && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-0.5">
                <Label htmlFor="hasExistingPassport" className="text-base">
                  هل لديك جواز سفر حالي؟
                </Label>
                <p className="text-xs text-muted-foreground">
                  إذا كان لديك جواز سفر ساري أو منتهي الصلاحية، يرجى تقديم التفاصيل
                </p>
              </div>
              <Switch
                id="hasExistingPassport"
                checked={value.hasExistingPassport || false}
                onCheckedChange={(checked) => updateField("hasExistingPassport", checked)}
                data-testid="switch-has-passport"
              />
            </div>

            {value.hasExistingPassport && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="existingPassportNumber">رقم جواز السفر</Label>
                  <Input
                    id="existingPassportNumber"
                    value={value.existingPassportNumber || ""}
                    onChange={(e) => updateField("existingPassportNumber", e.target.value)}
                    placeholder="أدخل رقم جواز السفر"
                    data-testid="input-passport-number"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="existingPassportExpiry">تاريخ الانتهاء</Label>
                  <Input
                    id="existingPassportExpiry"
                    type="date"
                    value={value.existingPassportExpiry || ""}
                    onChange={(e) => updateField("existingPassportExpiry", e.target.value)}
                    data-testid="input-passport-expiry"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

    
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-0.5">
              <Label htmlFor="hasNationalId" className="text-base">
                هل لديك هوية وطنية؟
              </Label>
              <p className="text-xs text-muted-foreground">
                في حال وجود هوية وطنية أو أي وثيقة تعريف رسمية
              </p>
            </div>
            <Switch
              id="hasNationalId"
              checked={value.hasNationalId || false}
              onCheckedChange={(checked) =>
                updateField("hasNationalId", checked)
              }
              data-testid="switch-has-national-id"
            />
          </div>

          {value.hasNationalId && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="idType">نوع الهوية</Label>
                <Input
                  id="idType"
                  value={value.idType || ""}
                  onChange={(e) => updateField("idType", e.target.value)}
                  placeholder="مثال: هوية وطنية، رخصة قيادة"
                  data-testid="input-id-type"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="idNumber">رقم الهوية</Label>
                <Input
                  id="idNumber"
                  value={value.idNumber || ""}
                  onChange={(e) => updateField("idNumber", e.target.value)}
                  placeholder="أدخل رقم الهوية"
                  data-testid="input-id-number"
                  dir="ltr"
                  maxLength={10}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
