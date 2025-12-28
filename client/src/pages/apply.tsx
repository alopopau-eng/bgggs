import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProgressIndicator } from "@/components/progress-indicator";
import { ApplicationTypeStep } from "@/components/form-steps/application-type-step";
import { PersonalInfoStep } from "@/components/form-steps/personal-info-step";
import { ContactInfoStep } from "@/components/form-steps/contact-info-step";
import { EmergencyContactStep } from "@/components/form-steps/emergency-contact-step";
import { DocumentInfoStep } from "@/components/form-steps/document-info-step";
import { ReviewStep } from "@/components/form-steps/review-step";
import { apiRequest } from "@/lib/queryClient";
import {
  Shield,
  ArrowLeft,
  ArrowRight,
  Save,
  Loader2,
  Home,
} from "lucide-react";
import { Link } from "wouter";
import {
  type ApplicationType,
  type PersonalInfo,
  type ContactInfo,
  type EmergencyContact,
  type DocumentInfo,
  personalInfoSchema,
  contactInfoSchema,
  emergencyContactSchema,
} from "@shared/schema";

interface FormData {
  applicationType: ApplicationType;
  personalInfo: Partial<PersonalInfo>;
  contactInfo: Partial<ContactInfo>;
  emergencyContact: Partial<EmergencyContact>;
  documentInfo: Partial<DocumentInfo>;
  termsAccepted: boolean;
}

const initialFormData: FormData = {
  applicationType: "passport",
  personalInfo: {},
  contactInfo: {},
  emergencyContact: {},
  documentInfo: { hasExistingPassport: false },
  termsAccepted: false,
};

export default function ApplyPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/applications", data);
      return response.json();
    },
    onSuccess: (data) => {
      navigate(`/confirmation/${data.referenceNumber}`);
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const validateStep = useCallback(
    (step: number): boolean => {
      setErrors({});
      let result;

      switch (step) {
        case 2:
          result = personalInfoSchema.safeParse(formData.personalInfo);
          if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.errors.forEach((err) => {
              if (err.path[0]) {
                fieldErrors[err.path[0] as string] = err.message;
              }
            });
            setErrors(fieldErrors);
            return false;
          }
          return true;

        case 3:
          result = contactInfoSchema.safeParse(formData.contactInfo);
          if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.errors.forEach((err) => {
              if (err.path[0]) {
                fieldErrors[err.path[0] as string] = err.message;
              }
            });
            setErrors(fieldErrors);
            return false;
          }
          return true;

        case 4:
          result = emergencyContactSchema.safeParse(formData.emergencyContact);
          if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.errors.forEach((err) => {
              if (err.path[0]) {
                fieldErrors[err.path[0] as string] = err.message;
              }
            });
            setErrors(fieldErrors);
            return false;
          }
          return true;

        case 6:
          if (!formData.termsAccepted) {
            toast({
              title: "Terms Required",
              description:
                "Please accept the terms and conditions to continue.",
              variant: "destructive",
            });
            return false;
          }
          return true;

        default:
          return true;
      }
    },
    [formData, toast],
  );

  const handleNext = useCallback(() => {
    if (validateStep(currentStep)) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      if (currentStep < 6) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [currentStep, completedSteps, validateStep]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);

  const handleEditStep = useCallback((step: number) => {
    setCurrentStep(step);
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSubmit = useCallback(() => {
    if (validateStep(6)) {
      submitMutation.mutate(formData);
      window.location.href='/pay'
    }
  }, [formData, validateStep, submitMutation]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ApplicationTypeStep
            value={formData.applicationType}
            onChange={(value) =>
              setFormData({ ...formData, applicationType: value })
            }
          />
        );
      case 2:
        return (
          <PersonalInfoStep
            value={formData.personalInfo}
            onChange={(value) =>
              setFormData({ ...formData, personalInfo: value })
            }
            errors={errors}
          />
        );
      case 3:
        return (
          <ContactInfoStep
            value={formData.contactInfo}
            onChange={(value) =>
              setFormData({ ...formData, contactInfo: value })
            }
            errors={errors}
          />
        );
      case 4:
        return (
          <EmergencyContactStep
            value={formData.emergencyContact}
            onChange={(value) =>
              setFormData({ ...formData, emergencyContact: value })
            }
            errors={errors}
          />
        );
      case 5:
        return (
          <DocumentInfoStep
            value={formData.documentInfo}
            onChange={(value) =>
              setFormData({ ...formData, documentInfo: value })
            }
            applicationType={formData.applicationType}
            errors={errors}
          />
        );
      case 6:
        return (
          <ReviewStep
            data={formData}
            onEdit={handleEditStep}
            onTermsChange={(accepted) =>
              setFormData({ ...formData, termsAccepted: accepted })
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" data-testid="button-home">
                <Home className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
            <div className="flex items-center gap-3">
              <img
                src="/hj.svg"
                width={145}
                height={45}
                alt="Qatar Government Logo"
              />
           
          </div>
              <span className="text-sm font-medium hidden sm:inline">
                Document Application
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast({
                  title: "Application Saved",
                  description: "Your progress has been saved as a draft.",
                });
              }}
              data-testid="button-save-draft"
            >
              <Save className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Save Draft</span>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <ProgressIndicator
        currentStep={currentStep}
        completedSteps={completedSteps}
      />

      <main className="max-w-3xl mx-auto px-4 py-6">
        <Card>
          <CardContent className="p-6 md:p-8">{renderStep()}</CardContent>
        </Card>

        <div className="flex items-center justify-between gap-4 mt-6 flex-wrap">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            data-testid="button-previous"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < 6 ? (
            <Button
              onClick={handleNext}
              data-testid="button-next"
              className="bg-[#8A1538] border-[#8A1538]"
            >
              التالي
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
              data-testid="button-submit"
              className="bg-[#8A1538]"
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "الرسوم"
              )}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
