import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { StepIndicator } from "@/components/calculator/StepIndicator";
import { ProductStep } from "@/components/calculator/ProductStep";
import { BagTypeStep } from "@/components/calculator/BagTypeStep";
import { DimensionsStep } from "@/components/calculator/DimensionsStep";
import { GranulesStep } from "@/components/calculator/GranulesStep";
import { MaterialsStep } from "@/components/calculator/MaterialsStep";
import { MachineStep } from "@/components/calculator/MachineStep";
import { LaborStep } from "@/components/calculator/LaborStep";
import { PaperSpecsStep } from "@/components/calculator/PaperSpecsStep";
import { PaperCostsStep } from "@/components/calculator/PaperCostsStep";
import { ResultStep } from "@/components/calculator/ResultStep";
import { Button } from "@/components/ui/button";
import { useCalculator } from "@/hooks/useCalculator";
import { CalculationResult, BAG_TYPE_CONFIG, PAPER_TYPE_CONFIG } from "@/types/calculator";
import { ArrowLeft, ArrowRight, Calculator } from "lucide-react";
import { toast } from "sonner";

const plasticSteps = [
  { id: 1, title: "Product", description: "Category choice" },
  { id: 2, title: "Bag Type", description: "Material selection" },
  { id: 3, title: "Dimensions", description: "Size & gauge" },
  { id: 4, title: "Granules", description: "Raw material" },
  { id: 5, title: "Materials", description: "Costs & GSM" },
  { id: 6, title: "Machines", description: "Processing" },
  { id: 7, title: "Labor", description: "Workforce & Qty" },
  { id: 8, title: "Results", description: "Final costing" },
];

const paperSteps = [
  { id: 1, title: "Product", description: "Category choice" },
  { id: 2, title: "Paper & Size", description: "Grade & dimensions" },
  { id: 3, title: "Rates & Qty", description: "Material & labour" },
  { id: 4, title: "Results", description: "Final costing" },
];

export default function CalculatorPage() {
  const {
    state,
    setStep,
    setProductCategory,
    setBagType,
    setDimensions,
    setMaterials,
    setMachines,
    setLabor,
    setGranules,
    setPaper,
    setPaperType,
    setQuantity,
    calculateCost,
    saveResult,
    reset,
  } = useCalculator();

  const [result, setResult] = useState<CalculationResult | null>(null);

  const isPaper = state.productCategory === 'paper';
  const steps = isPaper ? paperSteps : plasticSteps;
  const lastInputStep = isPaper ? 3 : 7;
  const resultStepId = isPaper ? 4 : 8;

  const plasticConfig = !isPaper && state.bagType ? BAG_TYPE_CONFIG[state.bagType] : null;
  const paperConfig = isPaper && state.paper.paperType ? PAPER_TYPE_CONFIG[state.paper.paperType] : null;

  const handleProductCategoryChange = (category: typeof state.productCategory) => {
    setProductCategory(category);
    setResult(null);
    setStep(1);
  };

  const handleNext = () => {
    if (state.step === lastInputStep) {
      const calculatedResult = calculateCost();
      setResult(calculatedResult);
      setStep(resultStepId);
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
    if (isPaper) {
      switch (state.step) {
        case 1:
          return true;
        case 2:
          return (
            state.paper.length > 0 &&
            state.paper.width > 0 &&
            state.paper.gsm > 0 &&
            (!state.paper.gussetRequired || state.paper.gusset > 0)
          );
        case 3:
          return state.quantity > 0 && state.paper.paperRate > 0;
        default:
          return true;
      }
    } else {
      switch (state.step) {
        case 1:
          return true;
        case 2:
          return true;
        case 3:
          if (plasticConfig?.isWoven) {
            return state.dimensions.length > 0 && state.dimensions.width > 0;
          }
          return (
            state.dimensions.length > 0 &&
            state.dimensions.width > 0 &&
            state.dimensions.thickness > 0
          );
        case 4:
          // Granules step - required for poly bags
          if (plasticConfig && !plasticConfig.isWoven) {
            return state.granules.granuleRate > 0;
          }
          return true;
        case 5:
          // Materials step - fabric required for woven, optional for poly
          if (plasticConfig?.isWoven) {
            return state.materials.fabricRate > 0 && state.materials.fabricGSM > 0;
          }
          return true;
        case 6:
          return state.machines.electricityRate > 0;
        case 7:
          return state.quantity > 0;
        default:
          return true;
      }
    }
  };

  const categoryTitle = isPaper 
    ? (paperConfig ? paperConfig.name : 'Paper Bags') 
    : (plasticConfig ? plasticConfig.name : 'Plastic & Woven Bags');

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider mb-2">
            <Calculator className="h-3.5 w-3.5" />
            Cost Estimator
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            {categoryTitle} <span className="text-gradient">Costing</span>
          </h1>
          <p className="text-muted-foreground text-xs mt-1">
            Specify manufacturing parameters below to calculate exact unit costs
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicator steps={steps} currentStep={state.step} />
        </div>

        {/* Step Content */}
        <div className="bg-card rounded-2xl border border-border shadow-lg p-6 md:p-8 mb-6 animate-fade-in">
          {/* STEP 1: Product selection for all */}
          {state.step === 1 && (
            <ProductStep
              productCategory={state.productCategory}
              onChange={handleProductCategoryChange}
            />
          )}

          {/* PAPER WORKFLOW */}
          {isPaper && state.step === 2 && (
            <PaperSpecsStep
              paper={state.paper}
              onChange={setPaper}
              onPaperTypeChange={setPaperType}
            />
          )}

          {isPaper && state.step === 3 && (
            <PaperCostsStep
              paper={state.paper}
              onChange={setPaper}
              quantity={state.quantity}
              onQuantityChange={setQuantity}
            />
          )}

          {isPaper && state.step === 4 && result && (
            <ResultStep result={result} onReset={handleReset} onSave={handleSave} />
          )}

          {/* PLASTIC WORKFLOW */}
          {!isPaper && state.step === 2 && (
            <BagTypeStep bagType={state.bagType} onChange={setBagType} />
          )}

          {!isPaper && state.step === 3 && (
            <DimensionsStep
              dimensions={state.dimensions}
              bagType={state.bagType}
              onChange={setDimensions}
            />
          )}

          {!isPaper && state.step === 4 && (
            <GranulesStep
              granules={state.granules}
              bagType={state.bagType}
              onChange={setGranules}
            />
          )}

          {!isPaper && state.step === 5 && (
            <MaterialsStep
              materials={state.materials}
              bagType={state.bagType}
              onChange={setMaterials}
            />
          )}

          {!isPaper && state.step === 6 && (
            <MachineStep
              machines={state.machines}
              bagType={state.bagType}
              onChange={setMachines}
            />
          )}

          {!isPaper && state.step === 7 && (
            <LaborStep
              labor={state.labor}
              onChange={setLabor}
              quantity={state.quantity}
              onQuantityChange={setQuantity}
            />
          )}

          {!isPaper && state.step === 8 && result && (
            <ResultStep result={result} onReset={handleReset} onSave={handleSave} />
          )}
        </div>

        {/* Navigation */}
        {state.step < resultStepId && (
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
              {state.step === lastInputStep ? "Calculate Cost" : "Next Step"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
