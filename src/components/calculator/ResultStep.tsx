import { CalculationResult, BAG_TYPE_CONFIG } from "@/types/calculator";
import { IndianRupee, Package, Layers, Zap, Users, Download, RotateCcw, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResultStepProps {
  result: CalculationResult;
  onReset: () => void;
  onSave: () => void;
}

export function ResultStep({ result, onReset, onSave }: ResultStepProps) {
  const config = BAG_TYPE_CONFIG[result.bagType];
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(value);
  };

  const costBreakdown = [
    {
      label: 'Material Cost',
      value: result.materialCost,
      icon: Layers,
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
    {
      label: 'Machine/Electricity Cost',
      value: result.machineCost,
      icon: Zap,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      label: 'Labor Cost',
      value: result.laborCost,
      icon: Users,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-display font-bold text-foreground">
          Cost Calculation Complete
        </h2>
        <p className="text-muted-foreground mt-1">
          Precision calculated to ₹0.001
        </p>
      </div>

      {/* Main Result Card */}
      <div className="bg-gradient-hero rounded-2xl p-6 text-center shadow-xl">
        <div className="flex items-center justify-center gap-2 mb-2">
          <IndianRupee className="h-5 w-5 text-accent" />
          <span className="text-sm text-primary-foreground/70 font-medium">Cost Per Bag</span>
        </div>
        <div className="text-5xl font-display font-bold text-primary-foreground mb-2">
          {formatCurrency(result.costPerBag)}
        </div>
        <div className="flex items-center justify-center gap-4 text-sm text-primary-foreground/60">
          <span className="flex items-center gap-1">
            <Package className="h-4 w-4" />
            {result.quantity.toLocaleString('en-IN')} bags
          </span>
          <span className="flex items-center gap-1">
            <Scale className="h-4 w-4" />
            {result.bagWeight.toFixed(2)}g/bag
          </span>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="grid gap-3">
        {costBreakdown.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between bg-card rounded-xl border border-border p-4"
          >
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg ${item.bgColor} flex items-center justify-center`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <span className="font-medium text-foreground">{item.label}</span>
            </div>
            <span className="font-semibold text-foreground">
              {formatCurrency(item.value)}
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="bg-secondary rounded-xl p-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-foreground">Total Order Cost</span>
          <span className="text-2xl font-display font-bold text-accent">
            {formatCurrency(result.totalCost)}
          </span>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-3">Bag Specifications</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Type:</span>
            <span className="font-medium text-foreground">{config.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Dimensions:</span>
            <span className="font-medium text-foreground">
              {result.dimensions.length} × {result.dimensions.width} cm
            </span>
          </div>
          {!config.isWoven && result.dimensions.thickness > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Thickness:</span>
              <span className="font-medium text-foreground">{result.dimensions.thickness} µm</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Gusset:</span>
            <span className="font-medium text-foreground capitalize">
              {result.dimensions.gussetType === 'none' ? 'None' : `${result.dimensions.gussetType} (${result.dimensions.gusset}cm)`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Bag Weight:</span>
            <span className="font-medium text-foreground">{result.bagWeight.toFixed(2)} g</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Quantity:</span>
            <span className="font-medium text-foreground">{result.quantity.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1 h-12"
          onClick={onReset}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          New Calculation
        </Button>
        <Button
          variant="accent"
          className="flex-1 h-12"
          onClick={onSave}
        >
          <Download className="h-4 w-4 mr-2" />
          Save & Export
        </Button>
      </div>
    </div>
  );
}
