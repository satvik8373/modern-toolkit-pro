import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { PaperBagSpecs } from "@/types/calculator";
import { IndianRupee, Printer, Users, Zap, Handshake, Layers } from "lucide-react";

interface PaperCostsStepProps {
  paper: PaperBagSpecs;
  onChange: (paper: PaperBagSpecs) => void;
  quantity: number;
  onQuantityChange: (qty: number) => void;
}

const handleTypes: { id: PaperBagSpecs['handleType']; label: string }[] = [
  { id: 'flat-paper', label: 'Flat Paper' },
  { id: 'twisted-paper', label: 'Twisted Paper' },
  { id: 'rope', label: 'Rope / Cotton' },
  { id: 'die-cut', label: 'Die Cut (D-Cut)' },
];

export function PaperCostsStep({ paper, onChange, quantity, onQuantityChange }: PaperCostsStepProps) {
  const num = (field: keyof PaperBagSpecs, value: string) =>
    onChange({ ...paper, [field]: parseFloat(value) || 0 });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">
          Rates & Quantity
        </h2>
        <p className="text-muted-foreground mt-1">
          Raw material, printing, labour and electricity rates
        </p>
      </div>

      {/* Quantity */}
      <div className="bg-gradient-accent rounded-xl p-5 shadow-glow">
        <h3 className="font-semibold text-accent-foreground mb-3">Order Quantity (bags)</h3>
        <Input
          type="number"
          min="1"
          value={quantity || ''}
          onChange={(e) => onQuantityChange(parseInt(e.target.value) || 0)}
          placeholder="e.g., 10000"
          className="h-14 text-lg font-semibold bg-card border-2 border-accent-foreground/20"
        />
      </div>

      {/* Raw material */}
      <div className="bg-card rounded-xl border border-border p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
            <IndianRupee className="h-5 w-5 text-info" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Raw Material</h3>
            <p className="text-xs text-muted-foreground">Paper reel / sheet rate and wastage</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Paper Rate (₹ / kg)</Label>
            <Input
              type="number"
              step="0.01"
              value={paper.paperRate || ''}
              onChange={(e) => num('paperRate', e.target.value)}
              placeholder="e.g., 62.00"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label>Wastage (%)</Label>
            <Input
              type="number"
              step="0.1"
              value={paper.wastagePercentage || ''}
              onChange={(e) => num('wastagePercentage', e.target.value)}
              placeholder="e.g., 5"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label>Glue / Pasting (₹ per 1000)</Label>
            <Input
              type="number"
              step="0.01"
              value={paper.glueRate || ''}
              onChange={(e) => num('glueRate', e.target.value)}
              placeholder="e.g., 90.00"
              className="h-11"
            />
          </div>
        </div>
      </div>

      {/* Handle */}
      <div className="bg-card rounded-xl border border-border p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Handshake className="h-5 w-5 text-success" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Handle Required?</h3>
              <p className="text-xs text-muted-foreground">Carry handle type & cost</p>
            </div>
          </div>
          <Switch
            checked={paper.handleRequired}
            onCheckedChange={(checked) =>
              onChange({
                ...paper,
                handleRequired: checked,
                handleType: checked ? (paper.handleType === 'none' ? 'flat-paper' : paper.handleType) : 'none',
              })
            }
          />
        </div>
        {paper.handleRequired && (
          <div className="space-y-4 pt-2 border-t border-border">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {handleTypes.map((h) => (
                <button
                  key={h.id}
                  onClick={() => onChange({ ...paper, handleType: h.id })}
                  className={cn(
                    "px-3 py-2 rounded-lg border text-xs font-medium transition-colors",
                    paper.handleType === h.id
                      ? "border-accent bg-accent/10 text-foreground"
                      : "border-border bg-secondary/50 text-muted-foreground hover:border-accent/50"
                  )}
                >
                  {h.label}
                </button>
              ))}
            </div>
            <div className="space-y-2 max-w-xs">
              <Label>Handle Rate (₹ / bag)</Label>
              <Input
                type="number"
                step="0.001"
                value={paper.handleRate || ''}
                onChange={(e) => num('handleRate', e.target.value)}
                placeholder="e.g., 0.400"
                className="h-11"
              />
            </div>
          </div>
        )}
      </div>

      {/* Printing */}
      <div className="bg-card rounded-xl border border-border p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Printer className="h-5 w-5 text-warning" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Printing Required?</h3>
              <p className="text-xs text-muted-foreground">Flexo / offset printing charges</p>
            </div>
          </div>
          <Switch
            checked={paper.printingRequired}
            onCheckedChange={(checked) => onChange({ ...paper, printingRequired: checked })}
          />
        </div>
        {paper.printingRequired && (
          <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-border">
            <div className="space-y-2">
              <Label>Printing Rate (₹ per 1000, per colour)</Label>
              <Input
                type="number"
                step="0.01"
                value={paper.printingRate || ''}
                onChange={(e) => num('printingRate', e.target.value)}
                placeholder="e.g., 250.00"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label>Number of Colours</Label>
              <Input
                type="number"
                min="1"
                max="8"
                value={paper.printColors || ''}
                onChange={(e) => num('printColors', e.target.value)}
                className="h-11"
              />
            </div>
          </div>
        )}
      </div>

      {/* Lamination */}
      <div className="bg-card rounded-xl border border-border p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Layers className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Lamination Required?</h3>
              <p className="text-xs text-muted-foreground">Gloss / matte BOPP lamination</p>
            </div>
          </div>
          <Switch
            checked={paper.laminationRequired}
            onCheckedChange={(checked) => onChange({ ...paper, laminationRequired: checked })}
          />
        </div>
        {paper.laminationRequired && (
          <div className="space-y-2 max-w-xs pt-2 border-t border-border">
            <Label>Lamination Rate (₹ / bag)</Label>
            <Input
              type="number"
              step="0.001"
              value={paper.laminationRate || ''}
              onChange={(e) => num('laminationRate', e.target.value)}
              placeholder="e.g., 0.250"
              className="h-11"
            />
          </div>
        )}
      </div>

      {/* Labour & Electricity */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-success" />
            </div>
            <h3 className="font-semibold text-foreground">Labour</h3>
          </div>
          <div className="space-y-2">
            <Label>Labour Rate (₹ per 1000 bags)</Label>
            <Input
              type="number"
              step="0.01"
              value={paper.laborRate || ''}
              onChange={(e) => num('laborRate', e.target.value)}
              placeholder="e.g., 300.00"
              className="h-11"
            />
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-warning" />
            </div>
            <h3 className="font-semibold text-foreground">Electricity</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label className="text-xs">Rate (₹/unit)</Label>
              <Input
                type="number"
                step="0.01"
                value={paper.electricityRate || ''}
                onChange={(e) => num('electricityRate', e.target.value)}
                placeholder="8.50"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Load (kW)</Label>
              <Input
                type="number"
                step="0.1"
                value={paper.powerLoad || ''}
                onChange={(e) => num('powerLoad', e.target.value)}
                placeholder="8"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Bags/hour</Label>
              <Input
                type="number"
                value={paper.bagsPerHour || ''}
                onChange={(e) => num('bagsPerHour', e.target.value)}
                placeholder="3000"
                className="h-11"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
