import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { MachineCosts, BagType, BAG_TYPE_CONFIG } from "@/types/calculator";
import { Scissors, Printer, Zap, Bot, Hand, Cog, Percent } from "lucide-react";
import { cn } from "@/lib/utils";

interface MachineStepProps {
  machines: MachineCosts;
  bagType: BagType;
  onChange: (machines: MachineCosts) => void;
}

const printingTypes = [
  { id: 'bag-to-bag' as const, name: 'Bag to Bag', description: 'Finished bags' },
  { id: 'roll-to-roll' as const, name: 'Roll to Roll', description: 'Pre-cut rolls' },
  { id: 'flexo' as const, name: 'Flexographic', description: 'High volume' },
  { id: 'rotogravure' as const, name: 'Rotogravure', description: 'Premium quality' },
];

export function MachineStep({ machines, bagType, onChange }: MachineStepProps) {
  const config = BAG_TYPE_CONFIG[bagType];
  const isWoven = config.isWoven;

  const handleChange = (field: keyof MachineCosts, value: string | boolean | number | 'auto' | 'manual' | 'bag-to-bag' | 'roll-to-roll' | 'flexo' | 'rotogravure') => {
    if (typeof value === 'boolean') {
      onChange({ ...machines, [field]: value });
    } else if (field === 'cuttingType' || field === 'stitchingType' || field === 'printingType') {
      onChange({ ...machines, [field]: value });
    } else if (typeof value === 'number') {
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
          Configure machine types for {config.name} production
        </p>
      </div>

      <div className="space-y-6">
        {/* Extrusion for Poly Bags */}
        {!isWoven && (
          <div className="bg-card rounded-xl border border-border p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Cog className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Film Extrusion</h3>
                  <p className="text-xs text-muted-foreground">Blow film production</p>
                </div>
              </div>
              <Switch
                checked={machines.extrusionRequired}
                onCheckedChange={(checked) => handleChange('extrusionRequired', checked)}
              />
            </div>
            {machines.extrusionRequired && (
              <div className="space-y-2 animate-slide-up">
                <Label className="text-sm">Blow Up Ratio (BUR)</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="1.5"
                  max="4"
                  value={machines.blowingRatio || ''}
                  onChange={(e) => handleChange('blowingRatio', e.target.value)}
                  placeholder="e.g., 2.5"
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground">
                  Typical range: 1.5-4.0 (affects bubble diameter)
                </p>
              </div>
            )}
          </div>
        )}

        {/* Cutting Machine */}
        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Scissors className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Cutting Machine</h3>
              <p className="text-xs text-muted-foreground">
                {isWoven ? 'Fabric cutting process' : 'Film cutting/sealing'}
              </p>
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

        {/* Stitching Machine - Only for Woven Bags */}
        {isWoven && (
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
        )}

        {/* Printing */}
        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Printer className="h-5 w-5 text-warning" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Printing</h3>
                <p className="text-xs text-muted-foreground">Custom branding & design</p>
              </div>
            </div>
            <Switch
              checked={machines.printingRequired}
              onCheckedChange={(checked) => handleChange('printingRequired', checked)}
            />
          </div>
          {machines.printingRequired && (
            <div className="space-y-4 animate-slide-up">
              <div className="grid grid-cols-2 gap-2">
                {printingTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleChange('printingType', type.id)}
                    className={cn(
                      "p-3 rounded-lg border-2 transition-all text-center",
                      machines.printingType === type.id
                        ? "border-accent bg-accent/10"
                        : "border-border hover:border-accent/50"
                    )}
                  >
                    <p className="font-medium text-sm text-foreground">
                      {type.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {type.description}
                    </p>
                  </button>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Number of Colors</Label>
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
                <div className="space-y-2">
                  <Label className="text-sm flex items-center gap-1">
                    <Percent className="h-3 w-3" />
                    Ink Coverage
                  </Label>
                  <div className="pt-2">
                    <Slider
                      value={[machines.inkCoverage]}
                      onValueChange={(value) => handleChange('inkCoverage', value[0])}
                      max={100}
                      min={5}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>5%</span>
                      <span className="font-medium text-foreground">{machines.inkCoverage}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
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
