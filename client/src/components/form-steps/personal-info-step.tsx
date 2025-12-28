import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { nationalities, type PersonalInfo } from "@shared/schema";

interface PersonalInfoStepProps {
  value: Partial<PersonalInfo>;
  onChange: (value: Partial<PersonalInfo>) => void;
  errors: Record<string, string>;
}


export function PersonalInfoStep({ value, onChange, errors }: PersonalInfoStepProps) {
  const updateField = <K extends keyof PersonalInfo>(field: K, val: PersonalInfo[K]) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">البيانات الشخصية</h2>
        <p className="text-sm text-muted-foreground mt-1">
          يرجى إدخال بياناتك الشخصية كما تظهر في الوثائق الرسمية
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">
            الاسم الأول <span className="text-destructive">*</span>
          </Label>
          <Input
            id="firstName"
            value={value.firstName || ""}
            onChange={(e) => updateField("firstName", e.target.value)}
            placeholder="أدخل الاسم الأول"
            data-testid="input-first-name"
          />
          {errors.firstName && (
            <p className="text-xs text-destructive">{errors.firstName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="middleName">اسم الأب</Label>
          <Input
            id="middleName"
            value={value.middleName || ""}
            onChange={(e) => updateField("middleName", e.target.value)}
            placeholder="أدخل اسم الأب (اختياري)"
            data-testid="input-middle-name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">
            اسم العائلة <span className="text-destructive">*</span>
          </Label>
          <Input
            id="lastName"
            value={value.lastName || ""}
            onChange={(e) => updateField("lastName", e.target.value)}
            placeholder="أدخل اسم العائلة"
            data-testid="input-last-name"
          />
          {errors.lastName && (
            <p className="text-xs text-destructive">{errors.lastName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">
            تاريخ الميلاد <span className="text-destructive">*</span>
          </Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={value.dateOfBirth || ""}
            onChange={(e) => updateField("dateOfBirth", e.target.value)}
            data-testid="input-dob"
          />
          {errors.dateOfBirth && (
            <p className="text-xs text-destructive">{errors.dateOfBirth}</p>
          )}
        </div>

        <div className="space-y-2">
  <Label htmlFor="placeOfBirth">
    محل الميلاد <span className="text-destructive">*</span>
  </Label>
  <Input
    id="placeOfBirth"
    value={value.placeOfBirth || ""}
    onChange={(e) => updateField("placeOfBirth", e.target.value)}
    placeholder="أدخل محل الميلاد"
    data-testid="input-place-of-birth"
  />
  {errors.placeOfBirth && (
    <p className="text-xs text-destructive">{errors.placeOfBirth}</p>
  )}
</div>


        <div className="space-y-2">
          <Label htmlFor="gender">
            الجنس <span className="text-destructive">*</span>
          </Label>
          <Select
            value={value.gender || ""}
            onValueChange={(v) => updateField("gender", v as PersonalInfo["gender"])}
          >
            <SelectTrigger id="gender" data-testid="select-gender">
              <SelectValue placeholder="اختر الجنس" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">ذكر</SelectItem>
              <SelectItem value="female">أنثى</SelectItem>
              <SelectItem value="other">آخر</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && (
            <p className="text-xs text-destructive">{errors.gender}</p>
          )}
        </div>
        <div className="space-y-2">
  <Label htmlFor="nationality">
    الجنسية <span className="text-destructive">*</span>
  </Label>

  <Select
    value={value.nationality || ""}
    onValueChange={(val) =>
      updateField("nationality", val as PersonalInfo["nationality"])
    }
  >
    <SelectTrigger id="nationality" data-testid="select-nationality">
      <SelectValue placeholder="اختر جنسيتك" />
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
    <p className="text-xs text-destructive">{errors.nationality}</p>
  )}
</div>

        <div className="space-y-2">
          <Label htmlFor="maritalStatus">
            الحالة الاجتماعية <span className="text-destructive">*</span>
          </Label>
          <Select
            value={value.maritalStatus || ""}
            onValueChange={(v) => updateField("maritalStatus", v as PersonalInfo["maritalStatus"])}
          >
            <SelectTrigger id="maritalStatus" data-testid="select-marital-status">
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
            <p className="text-xs text-destructive">{errors.maritalStatus}</p>
          )}
        </div>
      </div>
    </div>
  );
}
