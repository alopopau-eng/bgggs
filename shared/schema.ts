import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ================================
// Nationalities
// ================================
export const nationalities = [
  { value: "saudi", label: "سعودي" },
  { value: "egyptian", label: "مصري" },
  { value: "emirati", label: "إماراتي" },
  { value: "kuwaiti", label: "كويتي" },
  { value: "qatari", label: "قطري" },
  { value: "bahraini", label: "بحريني" },
  { value: "omani", label: "عماني" },
  { value: "jordanian", label: "أردني" },
  { value: "palestinian", label: "فلسطيني" },
  { value: "moroccan", label: "مغربي" },
  { value: "tunisian", label: "تونسي" },
  { value: "algerian", label: "جزائري" },
  { value: "sudanese", label: "سوداني" },
  { value: "yemeni", label: "يمني" },
] as const;

// ================================
// Users Table
// ================================
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// ================================
// Application Types & Status
// ================================
export const applicationTypes = ["passport", "id_card"] as const;
export type ApplicationType = typeof applicationTypes[number];

export const applicationStatuses = ["draft", "submitted", "processing", "approved", "rejected"] as const;
export type ApplicationStatus = typeof applicationStatuses[number];

export const paymentStatuses = ["pending", "paid", "failed"] as const;
export type PaymentStatus = typeof paymentStatuses[number];

// ================================
// Personal Information Schema
// ================================
export const personalInfoSchema = z.object({
  firstName: z.string().min(1, "الاسم الأول مطلوب"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "اسم العائلة مطلوب"),
  dateOfBirth: z.string().min(1, "تاريخ الميلاد مطلوب"),
  idNumber: z.string().optional(),
  placeOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  nationality: z.enum(
    nationalities.map((n) => n.value) as [string, ...string[]],
    { errorMap: () => ({ message: "الجنسية مطلوبة" }) }
  ),
  maritalStatus: z.enum(["single", "married", "divorced", "widowed"]),
});

export type PersonalInfo = z.infer<typeof personalInfoSchema>;

// ================================
// Contact Information Schema
// ================================
export const contactInfoSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح").optional(),
  phone: z.string().min(8, "رقم الهاتف يجب أن يكون 8 أرقام على الأقل"),
  alternatePhone: z.string().optional(),
  currentAddress: z.string().min(1, "العنوان الحالي مطلوب"),
  city: z.string().min(1, "المدينة مطلوبة"),
  state: z.string().min(1, "المنطقة/المحافظة مطلوبة").optional(),
  postalCode: z.string().min(1, "الرمز البريدي مطلوب").optional(),
  country: z.string().min(1, "الدولة مطلوبة").optional(),
});

export type ContactInfo = z.infer<typeof contactInfoSchema>;

// ================================
// Emergency Contact Schema
// ================================
export const emergencyContactSchema = z.object({
  name: z.string().min(1, "اسم جهة الاتصال للطوارئ مطلوب"),
  relationship: z.string().min(1, "صلة القرابة مطلوبة"),
  phone: z.string().min(8, "رقم الهاتف يجب أن يكون 8 أرقام على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صالح").optional(),
});

export type EmergencyContact = z.infer<typeof emergencyContactSchema>;

// ================================
// Document Information Schema
// ================================
export const documentInfoSchema = z.object({
  hasExistingPassport: z.boolean(),
  existingPassportNumber: z.string().optional(),
  existingPassportExpiry: z.string().optional(),
  hasNationalId: z.boolean(),
  idType: z.string().optional(),
  idNumber: z.string().optional(),
});

export type DocumentInfo = z.infer<typeof documentInfoSchema>;

// ================================
// Complete Application Schema
// ================================
export const applicationSchema = z.object({
  applicationType: z.enum(applicationTypes),
  personalInfo: personalInfoSchema,
  contactInfo: contactInfoSchema,
  emergencyContact: emergencyContactSchema,
  documentInfo: documentInfoSchema,
  termsAccepted: z.boolean().refine(val => val === true, "يجب الموافقة على الشروط والأحكام"),
});

export type Application = z.infer<typeof applicationSchema>;

// ================================
// Applications Table
// ================================
export const applications = pgTable("applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  referenceNumber: varchar("reference_number").notNull().unique(),
  applicationType: varchar("application_type").notNull(),
  status: varchar("status").notNull().default("draft"),
  paymentStatus: varchar("payment_status").notNull().default("pending"),
  personalInfo: jsonb("personal_info").notNull(),
  contactInfo: jsonb("contact_info").notNull(),
  emergencyContact: jsonb("emergency_contact").notNull(),
  documentInfo: jsonb("document_info").notNull(),
  termsAccepted: boolean("terms_accepted").notNull().default(false),
});

export const insertApplicationSchema = createInsertSchema(applications).omit({ id: true });

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type StoredApplication = typeof applications.$inferSelect;

// ================================
// Form Steps
// ================================
export interface FormStep {
  id: number;
  title: string;
  description: string;
}

export const formSteps: FormStep[] = [
  { id: 1, title: "نوع الطلب", description: "اختر نوع الوثيقة" },
  { id: 2, title: "البيانات الشخصية", description: "معلوماتك الأساسية" },
  { id: 3, title: "معلومات الاتصال", description: "كيفية التواصل معك" },
  { id: 4, title: "جهة اتصال الطوارئ", description: "في حالات الطوارئ" },
  { id: 5, title: "الوثائق", description: "الوثائق الموجودة" },
  { id: 6, title: "الدفع", description: "دفع الرسوم" },
  { id: 7, title: "المراجعة والإرسال", description: "تأكيد البيانات" },
];

// ================================
// Application Fees
// ================================
export const applicationFees = {
  passport: {
    standard: 150,
    express: 300,
  },
  id_card: {
    standard: 50,
    express: 100,
  },
};
