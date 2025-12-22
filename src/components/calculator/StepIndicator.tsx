import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                  currentStep > step.id
                    ? "border-success bg-success text-success-foreground"
                    : currentStep === step.id
                    ? "border-accent bg-accent text-accent-foreground shadow-glow"
                    : "border-border bg-muted text-muted-foreground"
                )}
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-bold">{step.id}</span>
                )}
              </div>
              <div className="mt-2 text-center hidden sm:block">
                <p
                  className={cn(
                    "text-xs font-semibold",
                    currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </p>
                <p className="text-[10px] text-muted-foreground max-w-[80px]">
                  {step.description}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 mx-2 transition-all duration-300",
                  currentStep > step.id ? "bg-success" : "bg-border"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
