import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BagDimensions } from "@/types/calculator";
import { Ruler, Move3D } from "lucide-react";
import { cn } from "@/lib/utils";

interface DimensionsStepProps {
  dimensions: BagDimensions;
  onChange: (dimensions: BagDimensions) => void;
}

const gussetTypes = [
  { id: 'none' as const, label: 'No Gusset', description: 'Flat bag' },
  { id: 'twist' as const, label: 'Twist Gusset', description: 'Side folds' },
  { id: 'straight' as const, label: 'Straight Gusset', description: 'Bottom fold' },
];

export function DimensionsStep({ dimensions, onChange }: DimensionsStepProps) {
  const handleChange = (field: keyof BagDimensions, value: string | 'none' | 'twist' | 'straight') => {
    if (field === 'gussetType') {
      onChange({ ...dimensions, gussetType: value as 'none' | 'twist' | 'straight' });
    } else {
      onChange({ ...dimensions, [field]: parseFloat(value) || 0 });
    }
  };

  // Calculate visual dimensions with smooth scaling
  const visualWidth = Math.min(Math.max(dimensions.width * 2.5, 80), 180);
  const visualHeight = Math.min(Math.max(dimensions.length * 2.5, 100), 240);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">
          Bag Dimensions
        </h2>
        <p className="text-muted-foreground mt-1">
          Enter the exact measurements in centimeters
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Visual Representation with Animated Dimension Lines */}
        <div className="bg-secondary/50 rounded-xl p-8 flex items-center justify-center min-h-[320px]">
          <div className="relative">
            {/* Left Length Indicator Line */}
            <div className="absolute -left-12 top-0 flex flex-col items-center">
              {/* Top arrow */}
              <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[8px] border-b-accent" />
              {/* Animated line */}
              <div 
                className="w-0.5 bg-gradient-to-b from-accent via-accent to-accent transition-all duration-500 ease-out"
                style={{ height: visualHeight }}
              />
              {/* Bottom arrow */}
              <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[8px] border-t-accent" />
              {/* Length label */}
              <div className="absolute top-1/2 -translate-y-1/2 -left-8 -rotate-90">
                <span className="text-xs font-bold text-accent bg-background/80 px-2 py-0.5 rounded whitespace-nowrap">
                  {dimensions.length || 0} cm
                </span>
              </div>
            </div>

            {/* The Bag Shape */}
            <div
              className="relative border-2 border-accent rounded-lg bg-gradient-to-br from-accent/5 to-accent/15 transition-all duration-500 ease-out flex items-center justify-center overflow-hidden"
              style={{
                width: visualWidth,
                height: visualHeight,
              }}
            >
              {/* Inner pattern */}
              <div className="absolute inset-2 border border-dashed border-accent/30 rounded" />
              
              {/* Center content */}
              <div className="text-center z-10">
                <Ruler className="h-8 w-8 text-accent mx-auto mb-2 opacity-60" />
                <p className="text-xs text-muted-foreground font-medium">
                  {dimensions.length || 0} × {dimensions.width || 0}
                </p>
              </div>

              {/* Gusset visualization */}
              {dimensions.gussetType === 'twist' && dimensions.gusset > 0 && (
                <>
                  <div 
                    className="absolute left-0 top-0 bottom-0 bg-accent/20 border-r border-dashed border-accent/50 transition-all duration-300"
                    style={{ width: Math.min(dimensions.gusset * 2, visualWidth / 4) }}
                  />
                  <div 
                    className="absolute right-0 top-0 bottom-0 bg-accent/20 border-l border-dashed border-accent/50 transition-all duration-300"
                    style={{ width: Math.min(dimensions.gusset * 2, visualWidth / 4) }}
                  />
                </>
              )}
              {dimensions.gussetType === 'straight' && dimensions.gusset > 0 && (
                <div 
                  className="absolute left-0 right-0 bottom-0 bg-accent/20 border-t border-dashed border-accent/50 transition-all duration-300"
                  style={{ height: Math.min(dimensions.gusset * 2, visualHeight / 4) }}
                />
              )}
            </div>

            {/* Bottom Width Indicator Line */}
            <div className="absolute -bottom-12 left-0 flex items-center" style={{ width: visualWidth }}>
              {/* Left arrow */}
              <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[8px] border-r-accent" />
              {/* Animated line */}
              <div 
                className="h-0.5 bg-gradient-to-r from-accent via-accent to-accent transition-all duration-500 ease-out flex-1"
              />
              {/* Right arrow */}
              <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-accent" />
              {/* Width label */}
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-6">
                <span className="text-xs font-bold text-accent bg-background/80 px-2 py-0.5 rounded whitespace-nowrap">
                  {dimensions.width || 0} cm
                </span>
              </div>
            </div>

            {/* Gusset indicator (if applicable) */}
            {dimensions.gussetType !== 'none' && dimensions.gusset > 0 && (
              <div className="absolute -right-16 top-1/2 -translate-y-1/2">
                <div className="flex items-center gap-1">
                  <div className="h-8 w-0.5 bg-warning transition-all duration-300" />
                  <span className="text-[10px] font-bold text-warning whitespace-nowrap">
                    G: {dimensions.gusset}cm
                  </span>
                </div>
              </div>
            )}
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
