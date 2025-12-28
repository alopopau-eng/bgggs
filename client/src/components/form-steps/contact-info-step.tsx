import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ContactInfo } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Pin } from "lucide-react";
const REGIONS = [
  { value: "doha", label: "الدوحة" },
  { value: "al_rayyan", label: "الريان" },
  { value: "umm_said", label: "الوكرة" },
  { value: "al_khor", label: "الخور" },
  { value: "al_daayen", label: "الضعاين" },
  { value: "al_shamal", label: "الشمال" },
  { value: "umm_salal", label: "أم صلال" },
];

const CITIES_BY_REGION: Record<string, { value: string; label: string }[]> = {
  doha: [
    { value: "west_bay", label: "الخليج الغربي" },
    { value: "lusail", label: "لوسيل" },
    { value: "al_sadd", label: "السد" },
    { value: "old_airport", label: "المطار القديم" },
  ],
  al_rayyan: [
    { value: "al_rayyan_city", label: "مدينة الريان" },
    { value: "education_city", label: "المدينة التعليمية" },
  ],
  umm_said: [
    { value: "al_wakrah", label: "الوكرة" },
    { value: "mesaimeer", label: "المسيمير" },
  ],
  al_khor: [
    { value: "al_khor_city", label: "مدينة الخور" },
    { value: "al_thakira", label: "الذخيرة" },
  ],
  al_daayen: [
    { value: "al_daayen_city", label: "الضعاين" },
  ],
  al_shamal: [
    { value: "madinat_al_shamal", label: "مدينة الشمال" },
  ],
  umm_salal: [
    { value: "umm_salal_ali", label: "أم صلال علي" },
    { value: "umm_salal_mohammed", label: "أم صلال محمد" },
  ],
};

interface ContactInfoStepProps {
  value: Partial<ContactInfo>;
  onChange: (value: Partial<ContactInfo>) => void;
  errors: Record<string, string>;
}

export function ContactInfoStep({ value, onChange, errors }: ContactInfoStepProps) {
  const updateField = <K extends keyof ContactInfo>(field: K, val: ContactInfo[K]) => {
    onChange({ ...value, [field]: val });
  };

  const handleDetectLocation = async () => {
    if (!navigator.geolocation) {
      alert("المتصفح لا يدعم تحديد الموقع");
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
  
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
  
          onChange({
            ...value,
            city: data.address.city || data.address.town || "",
            state: data.address.state || "",
            country: data.address.country || "",
            postalCode: data.address.postcode || "",
            currentAddress: data.display_name || "",
          });
        } catch (err) {
          console.error(err);
          alert("فشل في جلب بيانات الموقع");
        }
      },
      () => {
        alert("لم يتم السماح بالوصول إلى الموقع");
      }
    );
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">معلومات الاتصال</h2>
        <p className="text-sm text-muted-foreground mt-1">
          أدخل بيانات الاتصال الحالية للمراسلات
        </p>
      </div>
     

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="email">
            البريد الإلكتروني <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={value.email || ""}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="example@email.com"
            data-testid="input-email"
            dir="ltr"
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            رقم الهاتف <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            value={value.phone || ""}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="+966 5X XXX XXXX"
            data-testid="input-phone"
            dir="ltr"
          />
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="alternatePhone">رقم هاتف بديل (اختياري)</Label>
          <Input
            id="alternatePhone"
            type="tel"
            value={value.alternatePhone || ""}
            onChange={(e) => updateField("alternatePhone", e.target.value)}
            placeholder="+966 5X XXX XXXX"
            data-testid="input-alternate-phone"
            dir="ltr"
          />
        </div>
        <button
  type="button"
  onClick={handleDetectLocation}
  className="flex justify-center px-4 py-2 text-sm rounded-md bg-[#8A1538] text-primary-foreground hover:bg-[]/90"
>
 <Pin className="h-4"/> تحديد الموقع الحالي
</button>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="currentAddress">
            العنوان الحالي <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="currentAddress"
            value={value.currentAddress || ""}
            onChange={(e) => updateField("currentAddress", e.target.value)}
            placeholder="الشارع، رقم المبنى، الشقة، إلخ."
            rows={3}
            data-testid="input-address"
          />
          {errors.currentAddress && (
            <p className="text-xs text-destructive">{errors.currentAddress}</p>
          )}
        </div>

        <div className="space-y-2">
  <Label>
    المنطقة <span className="text-destructive">*</span>
  </Label>
  <Select
    value={value.state || ""}
    onValueChange={(val) =>
      onChange({ ...value, state: val, city: "" })
    }
  >
    <SelectTrigger>
      <SelectValue placeholder="اختر المحافظة" />
    </SelectTrigger>
    <SelectContent>
      {REGIONS.map((r) => (
        <SelectItem key={r.value} value={r.value}>
          {r.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
  {errors.state && <p className="text-xs text-destructive">{errors.state}</p>}
</div>


<div className="space-y-2">
  <Label>
    المدينة <span className="text-destructive">*</span>
  </Label>
  <Select
    value={value.city || ""}
    onValueChange={(val) => updateField("city", val)}
    disabled={!value.state}
  >
    <SelectTrigger data-testid="select-city">
      <SelectValue placeholder="اختر المدينة" />
    </SelectTrigger>
    <SelectContent>
      {(CITIES_BY_REGION[value.state || ""] || []).map((city) => (
        <SelectItem key={city.value} value={city.value}>
          {city.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
  {errors.city && (
    <p className="text-xs text-destructive">{errors.city}</p>
  )}
</div>


        <div className="space-y-2">
          <Label htmlFor="postalCode">
            الرمز البريدي <span className="text-destructive">*</span>
          </Label>
          <Input
            id="postalCode"
            value={value.postalCode || ""}
            onChange={(e) => updateField("postalCode", e.target.value)}
            placeholder="أدخل الرمز البريدي"
            data-testid="input-postal-code"
            dir="ltr"
          />
          {errors.postalCode && (
            <p className="text-xs text-destructive">{errors.postalCode}</p>
          )}
        </div>

      
      </div>
    </div>
  );
}
