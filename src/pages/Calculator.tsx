import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { StepIndicator } from "@/components/calculator/StepIndicator";
import { BagTypeStep } from "@/components/calculator/BagTypeStep";
import { DimensionsStep } from "@/components/calculator/DimensionsStep";
import { MaterialsStep } from "@/components/calculator/MaterialsStep";
import { MachineStep } from "@/components/calculator/MachineStep";
import { LaborStep } from "@/components/calculator/LaborStep";
import { ResultStep } from "@/components/calculator/ResultStep";
import { Button } from "@/components/ui/button";
import { useCalculator } from "@/hooks/useCalculator";
import { CalculationResult } from "@/types/calculator";
import { ArrowLeft, ArrowRight, Calculator } from "lucide-react";
import { toast } from "sonner";

const steps = [
  { id: 1, title: "Bag Type", description: "Material selection" },
  { id: 2, title: "Dimensions", description: "Size & gusset" },
  { id: 3, title: "Materials", description: "Costs & GSM" },
  { id: 4, title: "Machines", description: "Processing" },
  { id: 5, title: "Labor", description: "Workforce costs" },
  { id: 6, title: "Results", description: "Final costing" },
];

export default function CalculatorPage() {
  const {
    state,
    setStep,
    setBagType,
    setDimensions,
    setMaterials,
    setMachines,
    setLabor,
    setQuantity,
    calculateCost,
    saveResult,
    reset,
  } = useCalculator();

  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleNext = () => {
    if (state.step === 5) {
      const calculatedResult = calculateCost();
      setResult(calculatedResult);
      setStep(6);
    } else {
      setStep(state.step + 1);
    }
  };

  const handlePrev = () => {
    if (state.step > 1) {
      setStep(state.step - 1);
    }
  };

  const handleReset = () => {
    reset();
    setResult(null);
  };

  const handleSave = () => {
    if (result) {
      saveResult(result);
      toast.success("Calculation saved to history!");
    }
  };

  const canProceed = () => {
    switch (state.step) {
      case 2:
        return state.dimensions.length > 0 && state.dimensions.width > 0;
      case 3:
        return state.materials.fabricRate > 0 && state.materials.fabricGSM > 0;
      case 4:
        return state.machines.electricityRate > 0;
      case 5:
        return state.quantity > 0;
      default:
        return true;
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            <Calculator className="h-4 w-4" />
            Bag Cost Calculator
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
            Calculate Your <span className="text-gradient">Bag Costs</span>
          </h1>
          <p className="text-muted-foreground">
            Precision costing in under 1 minute
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicator steps={steps} currentStep={state.step} />
        </div>

        {/* Step Content */}
        <div className="bg-card rounded-2xl border border-border shadow-lg p-6 md:p-8 mb-6 animate-fade-in">
          {state.step === 1 && (
            <BagTypeStep bagType={state.bagType} onChange={setBagType} />
          )}
          {state.step === 2 && (
            <DimensionsStep dimensions={state.dimensions} onChange={setDimensions} />
          )}
          {state.step === 3 && (
            <MaterialsStep materials={state.materials} onChange={setMaterials} />
          )}
          {state.step === 4 && (
            <MachineStep machines={state.machines} onChange={setMachines} />
          )}
          {state.step === 5 && (
            <LaborStep
              labor={state.labor}
              onChange={setLabor}
              quantity={state.quantity}
              onQuantityChange={setQuantity}
            />
          )}
          {state.step === 6 && result && (
            <ResultStep result={result} onReset={handleReset} onSave={handleSave} />
          )}
        </div>

        {/* Navigation */}
        {state.step < 6 && (
          <div className="flex justify-between gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrev}
              disabled={state.step === 1}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="accent"
              size="lg"
              onClick={handleNext}
              disabled={!canProceed()}
              className="gap-2"
            >
              {state.step === 5 ? "Calculate Cost" : "Next Step"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
