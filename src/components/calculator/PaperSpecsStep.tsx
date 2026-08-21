import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PaperBagSpecs, PaperType, PAPER_TYPE_CONFIG } from "@/types/calculator";
import { FileText, Ruler, Move3D } from "lucide-react";

interface PaperSpecsStepProps {
  paper: PaperBagSpecs;
  onChange: (paper: PaperBagSpecs) => void;
  onPaperTypeChange: (type: PaperType) => void;
}

export function PaperSpecsStep({ paper, onChange, onPaperTypeChange }: PaperSpecsStepProps) {
  const num = (field: keyof PaperBagSpecs, value: string) =>
    onChange({ ...paper, [field]: parseFloat(value) || 0 });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">
          Paper & Dimensions
        </h2>
        <p className="text-muted-foreground mt-1">
          Select paper grade, grammage and bag size
        </p>
      </div>

      {/* Paper type */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {(Object.keys(PAPER_TYPE_CONFIG) as PaperType[]).map((type) => {
          const config = PAPER_TYPE_CONFIG[type];
          const isSelected = paper.paperType === type;
          return (
            <button
              key={type}
              onClick={() => onPaperTypeChange(type)}
              className={cn(
                "p-4 rounded-xl border-2 text-left transition-all",
                isSelected
                  ? "border-accent bg-accent/10 shadow-glow"
                  : "border-border bg-card hover:border-accent/50"
              )}
            >
              <div className="flex items-center gap-2">
                <FileText className={cn("h-4 w-4", isSelected ? "text-accent" : "text-muted-foreground")} />
                <h4 className="font-semibold text-sm text-foreground">{config.name}</h4>
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{config.description}</p>
              <Badge variant="secondary" className="mt-2 text-[10px]">
                {config.defaultGSM} GSM default
              </Badge>
            </button>
          );
        })}
      </div>

      {/* Dimensions */}
      <div className="bg-card rounded-xl border border-border p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Ruler className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Bag Size & GSM</h3>
            <p className="text-xs text-muted-foreground">Measurements in centimetres</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Length / Height (cm)</Label>
            <Input
              type="number"
              step="0.1"
              value={paper.length || ''}
              onChange={(e) => num('length', e.target.value)}
              placeholder="e.g., 35"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label>Width (cm)</Label>
            <Input
              type="number"
              step="0.1"
              value={paper.width || ''}
              onChange={(e) => num('width', e.target.value)}
              placeholder="e.g., 25"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label>Paper GSM</Label>
            <Input
              type="number"
              value={paper.gsm || ''}
              onChange={(e) => num('gsm', e.target.value)}
              placeholder="e.g., 90"
              className="h-11"
            />
          </div>
        </div>
      </div>

      {/* Gusset */}
      <div className="bg-card rounded-xl border border-border p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
              <Move3D className="h-5 w-5 text-info" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Gusset Required?</h3>
              <p className="text-xs text-muted-foreground">Side folds for box-shaped bags</p>
            </div>
          </div>
          <Switch
            checked={paper.gussetRequired}
            onCheckedChange={(checked) =>
              onChange({ ...paper, gussetRequired: checked, gusset: checked ? paper.gusset || 8 : 0 })
            }
          />
        </div>

        {paper.gussetRequired && (
          <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-border">
            <div className="space-y-2">
              <Label>Gusset Width (cm)</Label>
              <Input
                type="number"
                step="0.1"
                value={paper.gusset || ''}
                onChange={(e) => num('gusset', e.target.value)}
                placeholder="e.g., 8"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label>Gusset Forming Rate (₹ / bag)</Label>
              <Input
                type="number"
                step="0.001"
                value={paper.gussetRate || ''}
                onChange={(e) => num('gussetRate', e.target.value)}
                placeholder="e.g., 0.150"
                className="h-11"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
