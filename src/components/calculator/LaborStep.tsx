import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LaborCosts } from "@/types/calculator";
import { Users, Scissors, Package, Printer, Shirt } from "lucide-react";

interface LaborStepProps {
  labor: LaborCosts;
  onChange: (labor: LaborCosts) => void;
  quantity: number;
  onQuantityChange: (qty: number) => void;
}

const laborItems = [
  { key: 'cuttingLabor' as const, label: 'Cutting Labor', icon: Scissors, description: 'Per 1000 bags' },
  { key: 'stitchingLabor' as const, label: 'Stitching Labor', icon: Shirt, description: 'Per 1000 bags' },
  { key: 'printingLabor' as const, label: 'Printing Labor', icon: Printer, description: 'Per 1000 bags' },
  { key: 'topHemmingLabor' as const, label: 'Top Hemming', icon: Package, description: 'Per 1000 bags' },
  { key: 'packingLabor' as const, label: 'Packing Labor', icon: Package, description: 'Per 1000 bags' },
];

export function LaborStep({ labor, onChange, quantity, onQuantityChange }: LaborStepProps) {
  const handleChange = (field: keyof LaborCosts, value: string) => {
    onChange({ ...labor, [field]: parseFloat(value) || 0 });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">
          Labor Costs & Quantity
        </h2>
        <p className="text-muted-foreground mt-1">
          Enter labor charges per 1000 bags and order quantity
        </p>
      </div>

      {/* Quantity */}
      <div className="bg-gradient-accent rounded-xl p-5 shadow-glow">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-accent-foreground/10 flex items-center justify-center">
            <Package className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-accent-foreground">Order Quantity</h3>
            <p className="text-xs text-accent-foreground/70">Total number of bags</p>
          </div>
        </div>
        <Input
          type="number"
          min="1"
          value={quantity || ''}
          onChange={(e) => onQuantityChange(parseInt(e.target.value) || 0)}
          placeholder="e.g., 10000"
          className="h-14 text-lg font-semibold bg-card border-2 border-accent-foreground/20"
        />
      </div>

      {/* Labor Costs */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Labor Charges</h3>
            <p className="text-xs text-muted-foreground">Rates per 1000 bags (₹)</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {laborItems.map((item) => (
            <div key={item.key} className="space-y-2">
              <Label className="text-sm flex items-center gap-2">
                <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                {item.label}
              </Label>
              <Input
                type="number"
                step="0.01"
                value={labor[item.key] || ''}
                onChange={(e) => handleChange(item.key, e.target.value)}
                placeholder="e.g., 150.00"
                className="h-11"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
