import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GranuleCosts, BagType, BAG_TYPE_CONFIG } from "@/types/calculator";
import { cn } from "@/lib/utils";
import { Beaker, Recycle, Blend, Percent, FlaskConical } from "lucide-react";

interface GranulesStepProps {
  granules: GranuleCosts;
  bagType: BagType;
  onChange: (granules: GranuleCosts) => void;
}

const granuleTypes = [
  {
    id: 'virgin' as const,
    name: 'Virgin Granules',
    description: '100% new raw material',
    icon: Beaker,
    priceFactor: 'Premium',
  },
  {
    id: 'recycled' as const,
    name: 'Recycled Granules',
    description: 'Reprocessed plastic material',
    icon: Recycle,
    priceFactor: 'Economy',
  },
  {
    id: 'mixed' as const,
    name: 'Mixed Blend',
    description: 'Virgin + recycled combination',
    icon: Blend,
    priceFactor: 'Standard',
  },
];

export function GranulesStep({ granules, bagType, onChange }: GranulesStepProps) {
  const config = BAG_TYPE_CONFIG[bagType];
  const isWoven = config.isWoven;

  const handleChange = (field: keyof GranuleCosts, value: number | string) => {
    onChange({
      ...granules,
      [field]: typeof value === 'string' ? value : Number(value) || 0,
    });
  };

  if (isWoven) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">
            Granules & Raw Material
          </h2>
          <p className="text-muted-foreground mt-1">
            Configure raw material costs for woven fabric production
          </p>
        </div>

        <div className="p-6 rounded-xl bg-secondary/50 border border-border text-center">
          <FlaskConical className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-semibold text-foreground mb-2">Woven Bag Selected</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            For woven bags (PP/HDPE), granule costs are typically included in the fabric rate. 
            Configure fabric costs in the Materials step instead.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">
          Granules & Raw Material
        </h2>
        <p className="text-muted-foreground mt-1">
          Configure plastic granule costs for {config.name} production
        </p>
      </div>

      {/* Granule Type Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Granule Type</Label>
        <div className="grid sm:grid-cols-3 gap-3">
          {granuleTypes.map((type) => {
            const isSelected = granules.granuleType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => handleChange('granuleType', type.id)}
                className={cn(
                  "relative p-4 rounded-xl border-2 text-left transition-all duration-300 group",
                  isSelected
                    ? "border-accent bg-accent/10 shadow-glow"
                    : "border-border bg-card hover:border-accent/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                      isSelected
                        ? "bg-accent text-accent-foreground"
                        : "bg-secondary text-secondary-foreground"
                    )}
                  >
                    <type.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">
                      {type.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {type.priceFactor}
                    </p>
                  </div>
                </div>
                {isSelected && (
                  <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-accent animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Granule Rate */}
      <div className="p-5 rounded-xl bg-card border border-border space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Beaker className="h-5 w-5 text-accent" />
          <h3 className="font-semibold text-foreground">Base Granule Cost</h3>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="granuleRate">Granule Rate (₹/kg)</Label>
            <Input
              id="granuleRate"
              type="number"
              value={granules.granuleRate || ''}
              onChange={(e) => handleChange('granuleRate', parseFloat(e.target.value))}
              placeholder="Enter rate per kg"
              className="bg-background"
            />
            <p className="text-xs text-muted-foreground">
              Current market rate for {bagType.toUpperCase()} granules
            </p>
          </div>
        </div>
      </div>

      {/* Masterbatch */}
      <div className="p-5 rounded-xl bg-card border border-border space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Percent className="h-5 w-5 text-accent" />
          <h3 className="font-semibold text-foreground">Masterbatch (Color/Additives)</h3>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="masterbatchRate">Masterbatch Rate (₹/kg)</Label>
            <Input
              id="masterbatchRate"
              type="number"
              value={granules.masterbatchRate || ''}
              onChange={(e) => handleChange('masterbatchRate', parseFloat(e.target.value))}
              placeholder="Rate per kg"
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="masterbatchPercentage">Masterbatch %</Label>
            <Input
              id="masterbatchPercentage"
              type="number"
              value={granules.masterbatchPercentage || ''}
              onChange={(e) => handleChange('masterbatchPercentage', parseFloat(e.target.value))}
              placeholder="% of total weight"
              min="0"
              max="10"
              step="0.5"
              className="bg-background"
            />
            <p className="text-xs text-muted-foreground">Typically 1-3% of total weight</p>
          </div>
        </div>
      </div>

      {/* Filler */}
      <div className="p-5 rounded-xl bg-card border border-border space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <FlaskConical className="h-5 w-5 text-accent" />
          <h3 className="font-semibold text-foreground">Filler (CaCO₃/Talc)</h3>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fillerRate">Filler Rate (₹/kg)</Label>
            <Input
              id="fillerRate"
              type="number"
              value={granules.fillerRate || ''}
              onChange={(e) => handleChange('fillerRate', parseFloat(e.target.value))}
              placeholder="Rate per kg"
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fillerPercentage">Filler %</Label>
            <Input
              id="fillerPercentage"
              type="number"
              value={granules.fillerPercentage || ''}
              onChange={(e) => handleChange('fillerPercentage', parseFloat(e.target.value))}
              placeholder="% of total weight"
              min="0"
              max="30"
              step="1"
              className="bg-background"
            />
            <p className="text-xs text-muted-foreground">0-30% depending on quality needed</p>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="p-4 rounded-xl bg-accent/10 border border-accent/30">
        <h4 className="font-semibold text-sm text-foreground mb-2">Cost Mix Summary</h4>
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground">Base Granules:</span>
            <p className="font-medium text-foreground">
              {(100 - granules.masterbatchPercentage - granules.fillerPercentage).toFixed(1)}%
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Masterbatch:</span>
            <p className="font-medium text-foreground">{granules.masterbatchPercentage}%</p>
          </div>
          <div>
            <span className="text-muted-foreground">Filler:</span>
            <p className="font-medium text-foreground">{granules.fillerPercentage}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
