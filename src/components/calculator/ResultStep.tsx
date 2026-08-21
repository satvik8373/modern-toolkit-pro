import { CalculationResult, BAG_TYPE_CONFIG, PAPER_TYPE_CONFIG } from "@/types/calculator";
import { IndianRupee, Package, Layers, Zap, Users, Download, RotateCcw, Scale, ReceiptText, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ResultStepProps {
  result: CalculationResult;
  onReset: () => void;
  onSave: () => void;
}

export function ResultStep({ result, onReset, onSave }: ResultStepProps) {
  const navigate = useNavigate();
  const isPaper = result.productCategory === 'paper';
  const plasticConfig = !isPaper && result.bagType ? BAG_TYPE_CONFIG[result.bagType] : null;
  const paperConfig = isPaper && result.paperType ? PAPER_TYPE_CONFIG[result.paperType] : null;
  const typeName = isPaper 
    ? (paperConfig?.name || 'Paper Carry Bag')
    : (plasticConfig?.name || 'Woven / Poly Bag');
  
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
      label: isPaper ? 'Material & Printing Cost' : 'Material Cost',
      value: result.materialCost,
      icon: Layers,
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
    {
      label: isPaper ? 'Machine & Electricity Cost' : 'Machine/Electricity Cost',
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

  const handleCreateInvoice = () => {
    onSave();
    // Navigate to billing with state to auto-import this result
    navigate('/billing', { state: { importResult: result } });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider mb-2">
          {isPaper ? <FileText className="h-3.5 w-3.5" /> : <Package className="h-3.5 w-3.5" />}
          {isPaper ? 'Paper Bag Costing' : 'Plastic Bag Costing'}
        </div>
        <h2 className="text-2xl font-display font-bold text-foreground">
          Cost Calculation Complete
        </h2>
        <p className="text-muted-foreground mt-1">
          Precision calculated to ₹0.001 per bag
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
          <div>
            <span className="text-lg font-semibold text-foreground">Total Order Cost</span>
            <p className="text-xs text-muted-foreground">For {result.quantity.toLocaleString('en-IN')} bags</p>
          </div>
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
            <span className="text-muted-foreground">Product:</span>
            <span className="font-medium text-foreground capitalize">{result.productCategory || 'plastic'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Type:</span>
            <span className="font-medium text-foreground">{typeName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Dimensions:</span>
            <span className="font-medium text-foreground">
              {result.dimensions.length} × {result.dimensions.width} cm
            </span>
          </div>
          {!isPaper && plasticConfig && !plasticConfig.isWoven && result.dimensions.thickness > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Thickness:</span>
              <span className="font-medium text-foreground">{result.dimensions.thickness} µm</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Gusset:</span>
            <span className="font-medium text-foreground capitalize">
              {result.dimensions.gussetType === 'none' || !result.dimensions.gusset
                ? 'None' 
                : `${result.dimensions.gussetType} (${result.dimensions.gusset}cm)`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Bag Weight:</span>
            <span className="font-medium text-foreground">{result.bagWeight.toFixed(2)} g</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Weight:</span>
            <span className="font-medium text-foreground">{((result.bagWeight * result.quantity) / 1000).toFixed(2)} kg</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order Quantity:</span>
            <span className="font-medium text-foreground">{result.quantity.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Button
          variant="outline"
          className="h-12"
          onClick={onReset}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          New Calculation
        </Button>
        <Button
          variant="secondary"
          className="h-12"
          onClick={onSave}
        >
          <Download className="h-4 w-4 mr-2" />
          Save to History
        </Button>
        <Button
          variant="accent"
          className="h-12 shadow-glow"
          onClick={handleCreateInvoice}
        >
          <ReceiptText className="h-4 w-4 mr-2" />
          Create Tax Invoice
        </Button>
      </div>
    </div>
  );
}
