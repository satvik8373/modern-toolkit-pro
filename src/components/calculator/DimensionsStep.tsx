import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BagDimensions, BagType, BAG_TYPE_CONFIG } from "@/types/calculator";
import { Ruler, Move3D, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface DimensionsStepProps {
  dimensions: BagDimensions;
  bagType: BagType;
  onChange: (dimensions: BagDimensions) => void;
}

const gussetTypes = [
  { id: 'none' as const, label: 'No Gusset', description: 'Flat bag' },
  { id: 'twist' as const, label: 'Twist Gusset', description: 'Side folds' },
  { id: 'straight' as const, label: 'Straight Gusset', description: 'Bottom fold' },
];

export function DimensionsStep({ dimensions, bagType, onChange }: DimensionsStepProps) {
  const config = BAG_TYPE_CONFIG[bagType];
  const isWoven = config.isWoven;

  const handleChange = (field: keyof BagDimensions, value: string | 'none' | 'twist' | 'straight') => {
    if (field === 'gussetType') {
      onChange({ ...dimensions, gussetType: value as 'none' | 'twist' | 'straight' });
    } else {
      onChange({ ...dimensions, [field]: parseFloat(value) || 0 });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">
          Bag Dimensions
        </h2>
        <p className="text-muted-foreground mt-1">
          Enter the exact measurements for {config.name}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Visual Representation */}
        <div className="bg-secondary/50 rounded-xl p-6 flex items-center justify-center">
          <div className="relative">
            <div
              className="border-2 border-dashed border-accent rounded-lg flex items-center justify-center"
              style={{
                width: Math.min(Math.max(dimensions.width * 2, 80), 200),
                height: Math.min(Math.max(dimensions.length * 2, 120), 280),
              }}
            >
              <div className="text-center">
                <Ruler className="h-8 w-8 text-accent mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">
                  {dimensions.length} × {dimensions.width} cm
                </p>
                {!isWoven && dimensions.thickness > 0 && (
                  <p className="text-xs text-accent mt-1">
                    {dimensions.thickness} µm
                  </p>
                )}
              </div>
            </div>
            {/* Length indicator */}
            <div className="absolute -right-8 top-0 bottom-0 flex items-center">
              <div className="flex flex-col items-center">
                <div className="h-full w-0.5 bg-accent" />
                <span className="text-[10px] text-accent font-medium mt-1">L</span>
              </div>
            </div>
            {/* Width indicator */}
            <div className="absolute -bottom-8 left-0 right-0 flex justify-center">
              <div className="flex items-center gap-1">
                <div className="w-full h-0.5 bg-accent" />
                <span className="text-[10px] text-accent font-medium">W</span>
              </div>
            </div>
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="length" className="text-sm font-medium">
                Length (cm)
              </Label>
              <Input
                id="length"
                type="number"
                step="0.1"
                value={dimensions.length || ''}
                onChange={(e) => handleChange('length', e.target.value)}
                placeholder="e.g., 60"
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="width" className="text-sm font-medium">
                Width (cm)
              </Label>
              <Input
                id="width"
                type="number"
                step="0.1"
                value={dimensions.width || ''}
                onChange={(e) => handleChange('width', e.target.value)}
                placeholder="e.g., 40"
                className="h-12"
              />
            </div>
          </div>

          {/* Thickness for Poly Bags */}
          {!isWoven && (
            <div className="space-y-2 animate-slide-up">
              <Label htmlFor="thickness" className="text-sm font-medium flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Film Thickness (microns)
              </Label>
              <Input
                id="thickness"
                type="number"
                step="1"
                value={dimensions.thickness || ''}
                onChange={(e) => handleChange('thickness', e.target.value)}
                placeholder="e.g., 50"
                className="h-12"
              />
              <p className="text-xs text-muted-foreground">
                Common: LDPE 30-100µm, HDPE 10-40µm, BOPP 15-40µm
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Move3D className="h-4 w-4" />
              Gusset Type
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {gussetTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleChange('gussetType', type.id)}
                  className={cn(
                    "p-3 rounded-lg border-2 text-center transition-all duration-200",
                    dimensions.gussetType === type.id
                      ? "border-accent bg-accent/10"
                      : "border-border hover:border-accent/50"
                  )}
                >
                  <p className="text-sm font-medium text-foreground">{type.label}</p>
                  <p className="text-[10px] text-muted-foreground">{type.description}</p>
                </button>
              ))}
            </div>
          </div>

          {dimensions.gussetType !== 'none' && (
            <div className="space-y-2 animate-slide-up">
              <Label htmlFor="gusset" className="text-sm font-medium">
                Gusset Size (cm)
              </Label>
              <Input
                id="gusset"
                type="number"
                step="0.1"
                value={dimensions.gusset || ''}
                onChange={(e) => handleChange('gusset', e.target.value)}
                placeholder="e.g., 10"
                className="h-12"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
