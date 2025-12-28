import { formSteps } from "@shared/schema";
import { Check } from "lucide-react";

interface ProgressIndicatorProps {
  currentStep: number;
  completedSteps: number[];
}

export function ProgressIndicator({
  currentStep,
  completedSteps,
}: ProgressIndicatorProps) {
  return (
    <div className="w-full px-4 py-6">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {formSteps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isUpcoming = step.id > currentStep && !isCompleted;

          return (
            <div
              key={step.id}
              className="flex items-center flex-1 last:flex-none"
            >
              {index > 0 && (
                <div
                  className={`
                    flex-1 h-0.5 mx-2 transition-colors
                    ${completedSteps.includes(formSteps[index - 1].id) ? "bg-[#8A1538]" : "bg-muted"}
                  `}
                />
              )}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-colors
                    ${isCompleted ? "bg-[#8A1538] text-[#8A1538]-foreground" : ""}
                    ${isCurrent ? "bg-[#8A1538] text-[#8A1538]-foreground ring-4 ring-[#8A1538]/20" : ""}
                    ${isUpcoming ? "bg-muted text-muted-foreground" : ""}
                  `}
                  data-testid={`step-indicator-${step.id}`}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : step.id}
                </div>
                <span
                  className={`
                    mt-2 text-xs font-medium text-center hidden md:block max-w-16
                    ${isCurrent ? "text-foreground" : "text-muted-foreground"}
                  `}
                >
                  {step.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
