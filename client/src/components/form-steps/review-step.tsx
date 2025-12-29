"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { FileText, CreditCard, User, MapPin, Phone, AlertCircle, Edit2 } from "lucide-react"
import type { ApplicationType, PersonalInfo, ContactInfo, EmergencyContact, DocumentInfo } from "@shared/schema"
import { SignaturePad } from "../signature-pad"

interface ReviewStepProps {
  data: {
    applicationType: ApplicationType
    personalInfo: Partial<PersonalInfo>
    contactInfo: Partial<ContactInfo>
    emergencyContact: Partial<EmergencyContact>
    documentInfo: Partial<DocumentInfo>
    termsAccepted: boolean
    signature?: string | null
  }
  onEdit: (step: number) => void
  onTermsChange: (accepted: boolean) => void
  onSignatureChange: (signature: string | null) => void
}

function InfoRow({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div className="flex flex-wrap justify-between py-2 gap-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value || "-"}</span>
    </div>
  )
}

export function ReviewStep({ data, onEdit, onTermsChange, onSignatureChange }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">مراجعة طلبك</h2>
        <p className="text-sm text-muted-foreground mt-1">
          يرجى مراجعة جميع المعلومات قبل الإرسال. اضغط على تعديل لإجراء أي تغييرات.
        </p>
      </div>

      {/* نوع الطلب */}
      <Card data-testid="card-application-type-review">
        <CardHeader className="py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              {data.applicationType === "passport" ? (
                <FileText className="h-5 w-5 text-[#8A1538]" />
              ) : (
                <CreditCard className="h-5 w-5 text-[#8A1538]" />
              )}
              <CardTitle className="text-base">نوع الطلب</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onEdit(1)} data-testid="button-edit-type">
              <Edit2 className="h-4 w-4 mr-1" />
              تعديل
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <span className="text-sm font-medium capitalize">
            {data.applicationType === "passport" ? "جواز السفر" : "بطاقة الهوية الوطنية"}
          </span>
        </CardContent>
      </Card>

      {/* المعلومات الشخصية */}
      <Card data-testid="card-personal-info-review">
        <CardHeader className="py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-[#8A1538]" />
              <CardTitle className="text-base">المعلومات الشخصية</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onEdit(2)} data-testid="button-edit-personal">
              <Edit2 className="h-4 w-4 mr-1" />
              تعديل
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="divide-y">
            <InfoRow
              label="الاسم الكامل"
              value={`${data.personalInfo.firstName || ""} ${data.personalInfo.middleName || ""} ${data.personalInfo.lastName || ""}`.trim()}
            />
            <InfoRow label="تاريخ الميلاد" value={data.personalInfo.dateOfBirth} />
            <InfoRow label="مكان الميلاد" value={data.personalInfo.nationality} />
            <InfoRow
              label="الحالة الاجتماعية"
              value={
                data.personalInfo.maritalStatus
                  ? data.personalInfo.maritalStatus === "single"
                    ? "أعزب/عزباء"
                    : data.personalInfo.maritalStatus === "married"
                      ? "متزوج/متزوجة"
                      : data.personalInfo.maritalStatus === "divorced"
                        ? "مطلق/مطلقة"
                        : "أرمل/أرملة"
                  : undefined
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* معلومات الاتصال */}
      <Card data-testid="card-contact-info-review">
        <CardHeader className="py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-[#8A1538]" />
              <CardTitle className="text-base">معلومات الاتصال</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onEdit(3)} data-testid="button-edit-contact">
              <Edit2 className="h-4 w-4 mr-1" />
              تعديل
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="divide-y">
            <InfoRow label="البريد الإلكتروني" value={data.contactInfo.email} />
            <InfoRow label="رقم الهاتف" value={data.contactInfo.phone} />
            <InfoRow label="العنوان" value={data.contactInfo.currentAddress} />
            <InfoRow label="المدينة" value={data.contactInfo.city} />
            <InfoRow label="المنطقة/المحافظة" value={data.contactInfo.state} />
            <InfoRow label="الرمز البريدي" value={data.contactInfo.postalCode} />
            <InfoRow label="الدولة" value={data.contactInfo.country} />
          </div>
        </CardContent>
      </Card>

      {/* جهة اتصال الطوارئ */}
      <Card data-testid="card-emergency-contact-review">
        <CardHeader className="py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-[#8A1538]" />
              <CardTitle className="text-base">جهة اتصال الطوارئ</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onEdit(4)} data-testid="button-edit-emergency">
              <Edit2 className="h-4 w-4 mr-1" />
              تعديل
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="divide-y">
            <InfoRow label="الاسم" value={data.emergencyContact.name} />
            <InfoRow label="صلة القرابة" value={data.emergencyContact.relationship} />
            <InfoRow label="رقم الهاتف" value={data.emergencyContact.phone} />
            <InfoRow label="البريد الإلكتروني" value={data.emergencyContact.email} />
          </div>
        </CardContent>
      </Card>

      {/* معلومات الوثائق */}
      <Card data-testid="card-documents-review">
        <CardHeader className="py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-[#8A1538]" />
              <CardTitle className="text-base">معلومات الوثائق</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onEdit(5)} data-testid="button-edit-documents">
              <Edit2 className="h-4 w-4 mr-1" />
              تعديل
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="divide-y">
            {data.applicationType === "passport" && (
              <InfoRow label="هل لديك جواز سفر حالي؟" value={data.documentInfo.hasExistingPassport ? "نعم" : "لا"} />
            )}
            {data.documentInfo.hasExistingPassport && (
              <>
                <InfoRow label="رقم جواز السفر" value={data.documentInfo.existingPassportNumber} />
                <InfoRow label="تاريخ انتهاء الجواز" value={data.documentInfo.existingPassportExpiry} />
              </>
            )}
            <InfoRow label="نوع الهوية" value={data.documentInfo.idType} />
            <InfoRow label="رقم الهوية" value={data.documentInfo.idNumber} />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* سلسلة التوقيع */}
      <SignaturePad onSignatureChange={onSignatureChange} value={data.signature} />

      <Separator />

      {/* شروط الموافقة */}
      <div className="flex items-start gap-3 p-4 bg-muted rounded-md">
        <Checkbox
          id="terms"
          checked={data.termsAccepted}
          onCheckedChange={(checked) => onTermsChange(checked === true)}
          data-testid="checkbox-terms"
        />
        <div className="space-y-1">
          <Label htmlFor="terms" className="text-sm font-medium leading-none cursor-pointer">
            أؤكد أن جميع المعلومات المقدمة صحيحة
          </Label>
          <p className="text-xs text-muted-foreground">
            من خلال تحديد هذا المربع، أصرح بأن المعلومات المقدمة في هذا الطلب صحيحة وكاملة ودقيقة. أفهم أن تقديم معلومات
            خاطئة قد يؤدي إلى رفض طلبي وإجراءات قانونية محتملة.
          </p>
        </div>
      </div>
    </div>
  )
}
