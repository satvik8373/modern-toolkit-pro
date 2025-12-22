import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { MaterialCosts } from "@/types/calculator";
import { Layers, Film, Square, CircleDot } from "lucide-react";

interface MaterialsStepProps {
  materials: MaterialCosts;
  onChange: (materials: MaterialCosts) => void;
}

export function MaterialsStep({ materials, onChange }: MaterialsStepProps) {
  const handleChange = (field: keyof MaterialCosts, value: string | boolean) => {
    if (typeof value === 'boolean') {
      onChange({ ...materials, [field]: value });
    } else {
      onChange({ ...materials, [field]: parseFloat(value) || 0 });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">
          Material Costs
        </h2>
        <p className="text-muted-foreground mt-1">
          Enter material rates and specifications
        </p>
      </div>

      <div className="space-y-6">
        {/* Woven Fabric */}
        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Layers className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Woven Fabric</h3>
              <p className="text-xs text-muted-foreground">Base material for the bag</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Rate (₹/kg)</Label>
              <Input
                type="number"
                step="0.01"
                value={materials.fabricRate || ''}
                onChange={(e) => handleChange('fabricRate', e.target.value)}
                placeholder="e.g., 95.50"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">GSM</Label>
              <Input
                type="number"
                step="1"
                value={materials.fabricGSM || ''}
                onChange={(e) => handleChange('fabricGSM', e.target.value)}
                placeholder="e.g., 70"
                className="h-11"
              />
            </div>
          </div>
        </div>

        {/* Plastic Granule */}
        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CircleDot className="h-5 w-5 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Plastic Granule</h3>
                <p className="text-xs text-muted-foreground">PP/HDPE raw granules</p>
              </div>
            </div>
            <Switch
              checked={materials.granuleRequired}
              onCheckedChange={(checked) => handleChange('granuleRequired', checked)}
            />
          </div>
          {materials.granuleRequired && (
            <div className="grid grid-cols-2 gap-4 animate-slide-up">
              <div className="space-y-2">
                <Label className="text-sm">Rate (₹/kg)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={materials.granuleRate || ''}
                  onChange={(e) => handleChange('granuleRate', e.target.value)}
                  placeholder="e.g., 85.00"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Usage (%)</Label>
                <Input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={materials.granulePercentage || ''}
                  onChange={(e) => handleChange('granulePercentage', e.target.value)}
                  placeholder="e.g., 10"
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
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Film className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">LD Lamination</h3>
                <p className="text-xs text-muted-foreground">Protective layer coating</p>
              </div>
            </div>
            <Switch
              checked={materials.laminationRequired}
              onCheckedChange={(checked) => handleChange('laminationRequired', checked)}
            />
          </div>
          {materials.laminationRequired && (
            <div className="grid grid-cols-2 gap-4 animate-slide-up">
              <div className="space-y-2">
                <Label className="text-sm">Rate (₹/kg)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={materials.laminationRate || ''}
                  onChange={(e) => handleChange('laminationRate', e.target.value)}
                  placeholder="e.g., 110.00"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">GSM</Label>
                <Input
                  type="number"
                  step="1"
                  value={materials.laminationGSM || ''}
                  onChange={(e) => handleChange('laminationGSM', e.target.value)}
                  placeholder="e.g., 25"
                  className="h-11"
                />
              </div>
            </div>
          )}
        </div>

        {/* Liner */}
        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
                <Square className="h-5 w-5 text-info" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Inner Liner</h3>
                <p className="text-xs text-muted-foreground">Additional inner protection</p>
              </div>
            </div>
            <Switch
              checked={materials.linerRequired}
              onCheckedChange={(checked) => handleChange('linerRequired', checked)}
            />
          </div>
          {materials.linerRequired && (
            <div className="grid grid-cols-2 gap-4 animate-slide-up">
              <div className="space-y-2">
                <Label className="text-sm">Rate (₹/kg)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={materials.linerRate || ''}
                  onChange={(e) => handleChange('linerRate', e.target.value)}
                  placeholder="e.g., 85.00"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">GSM</Label>
                <Input
                  type="number"
                  step="1"
                  value={materials.linerGSM || ''}
                  onChange={(e) => handleChange('linerGSM', e.target.value)}
                  placeholder="e.g., 50"
                  className="h-11"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
