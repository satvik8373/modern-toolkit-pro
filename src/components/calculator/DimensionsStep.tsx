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
        {/* Visual Representation */}
        <div className="bg-secondary/50 rounded-xl p-6 flex items-center justify-center min-h-[320px]">
          <div className="relative flex items-center justify-center">
            {/* Animated Bag Container */}
            <div
              className="border-2 border-dashed border-accent rounded-lg flex items-center justify-center bg-gradient-to-br from-accent/5 to-accent/10 shadow-lg transition-all duration-500 ease-out"
              style={{
                width: Math.min(Math.max(dimensions.width * 3, 80), 220),
                height: Math.min(Math.max(dimensions.length * 3, 100), 280),
                transform: `scale(${dimensions.length > 0 && dimensions.width > 0 ? 1 : 0.9})`,
                opacity: dimensions.length > 0 && dimensions.width > 0 ? 1 : 0.6,
              }}
            >
              {/* Inner bag design */}
              <div 
                className="absolute inset-2 border border-accent/30 rounded transition-all duration-500"
                style={{
                  opacity: dimensions.length > 10 ? 1 : 0,
                }}
              />
              
              {/* Gusset visualization */}
              {dimensions.gussetType === 'twist' && (
                <div className="absolute inset-y-4 left-1 w-1.5 bg-accent/20 rounded-full transition-all duration-300" 
                  style={{ 
                    height: `calc(100% - 32px)`,
                    transform: `scaleX(${dimensions.gusset ? Math.min(dimensions.gusset / 10, 1.5) : 0.5})`
                  }} 
                />
              )}
              {dimensions.gussetType === 'twist' && (
                <div className="absolute inset-y-4 right-1 w-1.5 bg-accent/20 rounded-full transition-all duration-300"
                  style={{ 
                    height: `calc(100% - 32px)`,
                    transform: `scaleX(${dimensions.gusset ? Math.min(dimensions.gusset / 10, 1.5) : 0.5})`
                  }} 
                />
              )}
              {dimensions.gussetType === 'straight' && (
                <div className="absolute inset-x-4 bottom-1 h-1.5 bg-accent/20 rounded-full transition-all duration-300"
                  style={{ 
                    width: `calc(100% - 32px)`,
                    transform: `scaleY(${dimensions.gusset ? Math.min(dimensions.gusset / 10, 1.5) : 0.5})`
                  }} 
                />
              )}
              
              <div className="text-center z-10">
                <Ruler className="h-8 w-8 text-accent mx-auto mb-2 transition-transform duration-300 hover:rotate-12" />
                <p className="text-sm font-semibold text-accent transition-all duration-300">
                  {dimensions.length || 0} × {dimensions.width || 0} cm
                </p>
                {dimensions.gussetType !== 'none' && dimensions.gusset > 0 && (
                  <p className="text-[10px] text-muted-foreground mt-1 animate-fade-in">
                    Gusset: {dimensions.gusset} cm
                  </p>
                )}
              </div>
            </div>
            
            {/* Length indicator with animated line */}
            <div className="absolute -right-10 top-0 bottom-0 flex items-center">
              <div className="flex flex-col items-center h-full">
                <div 
                  className="w-0.5 bg-gradient-to-b from-accent via-accent to-accent/50 transition-all duration-500 rounded-full"
                  style={{
                    height: Math.min(Math.max(dimensions.length * 3, 100), 280),
                  }}
                />
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs text-accent font-bold bg-accent/10 px-2 py-0.5 rounded-full">
                    {dimensions.length || 0}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Width indicator with animated line */}
            <div className="absolute -bottom-10 left-0 right-0 flex justify-center">
              <div className="flex flex-col items-center">
                <div 
                  className="h-0.5 bg-gradient-to-r from-accent/50 via-accent to-accent/50 transition-all duration-500 rounded-full"
                  style={{
                    width: Math.min(Math.max(dimensions.width * 3, 80), 220),
                  }}
                />
                <span className="text-xs text-accent font-bold bg-accent/10 px-2 py-0.5 rounded-full mt-2">
                  {dimensions.width || 0}
                </span>
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
