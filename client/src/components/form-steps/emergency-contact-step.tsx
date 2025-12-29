import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { EmergencyContact } from "@shared/schema";

interface EmergencyContactStepProps {
  value: Partial<EmergencyContact>;
  onChange: (value: Partial<EmergencyContact>) => void;
  errors: Record<string, string>;
}

export function EmergencyContactStep({ value, onChange, errors }: EmergencyContactStepProps) {
  const updateField = <K extends keyof EmergencyContact>(field: K, val: EmergencyContact[K]) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">جهة اتصال الطوارئ</h2>
        <p className="text-sm text-muted-foreground mt-1">
          أدخل بيانات شخص يمكننا التواصل معه في حالات الطوارئ
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="emergencyName">
            الاسم الكامل <span className="text-destructive">*</span>
          </Label>
          <Input
            id="emergencyName"
            value={value.name || ""}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="الاسم الكامل لجهة الاتصال"
            data-testid="input-emergency-name"
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="relationship">
            صلة القرابة <span className="text-destructive">*</span>
          </Label>
          <Select
            value={value.relationship || ""}
            onValueChange={(v) => updateField("relationship", v)}
          >
            <SelectTrigger id="relationship" data-testid="select-relationship">
              <SelectValue placeholder="اختر صلة القرابة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="spouse">الزوج/الزوجة</SelectItem>
              <SelectItem value="parent">الوالد/الوالدة</SelectItem>
              <SelectItem value="sibling">الأخ/الأخت</SelectItem>
              <SelectItem value="child">الابن/الابنة</SelectItem>
              <SelectItem value="friend">صديق</SelectItem>
              <SelectItem value="other">آخر</SelectItem>
            </SelectContent>
          </Select>
          {errors.relationship && (
            <p className="text-xs text-destructive">{errors.relationship}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            رقم الهاتف <span className="text-destructive">*</span>
          </Label>
          <div className="flex flex-row" dir="ltr">
          <Input className="w-20" value={'+974' } readOnly/>
          <Input
            id="phone"
            className="w-full" 
            type="tel"
            value={value.phone || ""}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder=" XX XXX XX"
            data-testid="input-phone"
            dir="ltr"
            maxLength={8}

          />
          </div>
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="emergencyEmail">البريد الإلكتروني (اختياري)</Label>
          <Input
            id="emergencyEmail"
            type="email"
            value={value.email || ""}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="contact@example.com"
            data-testid="input-emergency-email"
            dir="ltr"
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>
      </div>
    </div>
  );
}
