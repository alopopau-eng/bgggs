"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { nationalities, type PersonalInfo } from "@shared/schema";

interface PersonalInfoStepProps {
  value: Partial<PersonalInfo>;
  onChange: (value: Partial<PersonalInfo>) => void;
  errors: Record<string, string>;
}

export function PersonalInfoStep({
  value,
  onChange,
  errors,
}: PersonalInfoStepProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const updateField = <K extends keyof PersonalInfo>(
    field: K,
    val: PersonalInfo[K]
  ) => {
    onChange({ ...value, [field]: val });
  };

  const handlePhotoUpload = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("يرجى اختيار صورة فقط");
      return;
    }


    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* العنوان */}
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          البيانات الشخصية
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          يرجى إدخال بياناتك الشخصية كما تظهر في الوثائق الرسمية
        </p>
      </div>

      {/* المحتوى */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* الصورة الشخصية */}
        <div className="space-y-2 md:col-span-2">
          <Label>
            الصورة الشخصية <span className="text-destructive">*</span>
          </Label>

          <div className="flex flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-full border flex items-center justify-center overflow-hidden bg-muted">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-muted-foreground">
                  لا توجد صورة
                </span>
              )}
            </div>

            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handlePhotoUpload(e.target.files?.[0])
              }
            />
          </div>

          {errors.photo && (
            <p className="text-xs text-destructive">{errors.photo}</p>
          )}
        </div>
  {/* الاسم الأول */}
  <div className="space-y-2">
          <Label htmlFor="firstName">
            الرقم الوطني <span className="text-destructive">*</span>
          </Label>
          <Input
            id="idNumber"
            value={value.idNumber || ""}
            maxLength={12}
            onChange={(e) =>
              updateField("idNumber", e.target.value)
            }
            placeholder="أدخل الرقم الوطني "
          />
          {errors.firstName && (
            <p className="text-xs text-destructive">
              {errors.firstName}
            </p>
          )}
        </div>
        <div className="space-y-2">
        <Label htmlFor="firstName">
          مدة الاصدار<span className="text-destructive">*</span>
          </Label>
        <Select dir="rtl">
        <SelectTrigger>
              <SelectValue placeholder="اختر مدة الاصدار" />
            </SelectTrigger>
            <SelectContent>
            {[1,2,3,4,5].map((r) => (
        <SelectItem key={r} value={r.toString()}>
          <span>{' '}  {r}{' '} 
          سنة </span>
        </SelectItem>
      ))}
            </SelectContent>
        </Select>
        </div>

        {/* الاسم الأول */}
        <div className="space-y-2">
          <Label htmlFor="firstName">
            الاسم الأول <span className="text-destructive">*</span>
          </Label>
          <Input
            id="firstName"
            value={value.firstName || ""}
            onChange={(e) =>
              updateField("firstName", e.target.value)
            }
            placeholder="أدخل الاسم الأول"
          />
          {errors.firstName && (
            <p className="text-xs text-destructive">
              {errors.firstName}
            </p>
          )}
        </div>

        {/* اسم الأب */}
        <div className="space-y-2">
          <Label htmlFor="middleName">اسم الأب</Label>
          <Input
            id="middleName"
            value={value.middleName || ""}
            onChange={(e) =>
              updateField("middleName", e.target.value)
            }
            placeholder="أدخل اسم الأب "
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="grand"> اسم الجد</Label>
          <Input
            id="grand"
           
            placeholder="أدخل اسم الجد "
          />
        </div>
        {/* اسم العائلة */}
        <div className="space-y-2">
          <Label htmlFor="lastName">
            اسم العائلة <span className="text-destructive">*</span>
          </Label>
          <Input
            id="lastName"
            value={value.lastName || ""}
            onChange={(e) =>
              updateField("lastName", e.target.value)
            }
            placeholder="أدخل اسم العائلة"
          />
          {errors.lastName && (
            <p className="text-xs text-destructive">
              {errors.lastName}
            </p>
          )}
        </div>

        {/* تاريخ الميلاد */}
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">
            تاريخ الميلاد <span className="text-destructive">*</span>
          </Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={value.dateOfBirth || ""}
            onChange={(e) =>
              updateField("dateOfBirth", e.target.value)
            }
          />
          {errors.dateOfBirth && (
            <p className="text-xs text-destructive">
              {errors.dateOfBirth}
            </p>
          )}
        </div>

       
        {/* الجنسية */}
        <div className="space-y-2">
          <Label>
          محل الميلاد <span className="text-destructive">*</span>
 <span className="text-destructive">*</span>
          </Label>
          <Select
            value={value.nationality || ""}
            onValueChange={(v) =>
              updateField(
                "nationality",
                v as PersonalInfo["nationality"]
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر محل الميلاد" />
            </SelectTrigger>
            <SelectContent>
              {nationalities.map((n) => (
                <SelectItem key={n.value} value={n.value}>
                  {n.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.nationality && (
            <p className="text-xs text-destructive">
              {errors.nationality}
            </p>
          )}
        </div>

        {/* الحالة الاجتماعية */}
        <div className="space-y-2">
          <Label>
            الحالة الاجتماعية <span className="text-destructive">*</span>
          </Label>
          <Select
            value={value.maritalStatus || ""}
            onValueChange={(v) =>
              updateField(
                "maritalStatus",
                v as PersonalInfo["maritalStatus"]
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر الحالة الاجتماعية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">أعزب</SelectItem>
              <SelectItem value="married">متزوج</SelectItem>
              <SelectItem value="divorced">مطلق</SelectItem>
              <SelectItem value="widowed">أرمل</SelectItem>
            </SelectContent>
          </Select>
          {errors.maritalStatus && (
            <p className="text-xs text-destructive">
              {errors.maritalStatus}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
