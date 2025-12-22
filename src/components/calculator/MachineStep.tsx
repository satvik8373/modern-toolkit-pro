import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { MachineCosts } from "@/types/calculator";
import { Scissors, Printer, Zap, Bot, Hand } from "lucide-react";
import { cn } from "@/lib/utils";

interface MachineStepProps {
  machines: MachineCosts;
  onChange: (machines: MachineCosts) => void;
}

export function MachineStep({ machines, onChange }: MachineStepProps) {
  const handleChange = (field: keyof MachineCosts, value: string | boolean | 'auto' | 'manual' | 'bag-to-bag' | 'roll-to-roll') => {
    if (typeof value === 'boolean') {
      onChange({ ...machines, [field]: value });
    } else if (field === 'cuttingType' || field === 'stitchingType' || field === 'printingType') {
      onChange({ ...machines, [field]: value });
    } else {
      onChange({ ...machines, [field]: parseFloat(value as string) || 0 });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">
          Machine & Processing
        </h2>
        <p className="text-muted-foreground mt-1">
          Configure machine types and electricity rates
        </p>
      </div>

      <div className="space-y-6">
        {/* Cutting Machine */}
        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Scissors className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Cutting Machine</h3>
              <p className="text-xs text-muted-foreground">Fabric cutting process</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(['auto', 'manual'] as const).map((type) => (
              <button
                key={type}
                onClick={() => handleChange('cuttingType', type)}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-lg border-2 transition-all",
                  machines.cuttingType === type
                    ? "border-accent bg-accent/10"
                    : "border-border hover:border-accent/50"
                )}
              >
                {type === 'auto' ? (
                  <Bot className="h-5 w-5 text-accent" />
                ) : (
                  <Hand className="h-5 w-5 text-muted-foreground" />
                )}
                <div className="text-left">
                  <p className="font-medium text-foreground capitalize">{type}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {type === 'auto' ? 'Higher speed' : 'Lower cost'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Stitching Machine */}
        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Scissors className="h-5 w-5 text-success rotate-90" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Stitching Machine</h3>
              <p className="text-xs text-muted-foreground">Bag sewing process</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(['auto', 'manual'] as const).map((type) => (
              <button
                key={type}
                onClick={() => handleChange('stitchingType', type)}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-lg border-2 transition-all",
                  machines.stitchingType === type
                    ? "border-accent bg-accent/10"
                    : "border-border hover:border-accent/50"
                )}
              >
                {type === 'auto' ? (
                  <Bot className="h-5 w-5 text-accent" />
                ) : (
                  <Hand className="h-5 w-5 text-muted-foreground" />
                )}
                <div className="text-left">
                  <p className="font-medium text-foreground capitalize">{type}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {type === 'auto' ? 'Consistent quality' : 'Flexible'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Printing */}
        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Printer className="h-5 w-5 text-warning" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Flexographic Printing</h3>
                <p className="text-xs text-muted-foreground">Custom branding</p>
              </div>
            </div>
            <Switch
              checked={machines.printingRequired}
              onCheckedChange={(checked) => handleChange('printingRequired', checked)}
            />
          </div>
          {machines.printingRequired && (
            <div className="space-y-4 animate-slide-up">
              <div className="grid grid-cols-2 gap-3">
                {(['bag-to-bag', 'roll-to-roll'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleChange('printingType', type)}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all text-center",
                      machines.printingType === type
                        ? "border-accent bg-accent/10"
                        : "border-border hover:border-accent/50"
                    )}
                  >
                    <p className="font-medium text-foreground capitalize">
                      {type.replace('-', ' to ')}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {type === 'bag-to-bag' ? 'Finished bags' : 'Pre-cut rolls'}
                    </p>
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Number of Print Colors</Label>
                <Input
                  type="number"
                  min="1"
                  max="8"
                  value={machines.printColors || ''}
                  onChange={(e) => handleChange('printColors', e.target.value)}
                  placeholder="e.g., 2"
                  className="h-11"
                />
              </div>
            </div>
          )}
        </div>

        {/* Electricity Rate */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Electricity Rate</h3>
              <p className="text-xs text-muted-foreground">Per unit consumption cost</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Rate (₹/unit)</Label>
            <Input
              type="number"
              step="0.01"
              value={machines.electricityRate || ''}
              onChange={(e) => handleChange('electricityRate', e.target.value)}
              placeholder="e.g., 8.50"
              className="h-11"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
