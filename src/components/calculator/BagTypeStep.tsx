import { Package2, Layers, Film, CircleDot, Sparkles, Milk, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { BagType, BAG_TYPE_CONFIG } from "@/types/calculator";
import { Badge } from "@/components/ui/badge";

interface BagTypeStepProps {
  bagType: BagType;
  onChange: (type: BagType) => void;
}

const bagTypeIcons: Record<BagType, React.ComponentType<{ className?: string }>> = {
  pp: Package2,
  hdpe: Layers,
  ldpe: Film,
  lldpe: CircleDot,
  bopp: Sparkles,
  hm: Milk,
  ld: ShoppingBag,
};

const bagTypeCategories = [
  {
    category: 'Woven Bags',
    description: 'Heavy-duty bags with woven fabric structure',
    types: ['pp', 'hdpe'] as BagType[],
  },
  {
    category: 'Poly Bags',
    description: 'Flexible film bags for various applications',
    types: ['ldpe', 'lldpe', 'bopp', 'hm', 'ld'] as BagType[],
  },
];

export function BagTypeStep({ bagType, onChange }: BagTypeStepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">
          Select Bag Type
        </h2>
        <p className="text-muted-foreground mt-1">
          Choose the material type based on your manufacturing process
        </p>
      </div>

      {bagTypeCategories.map((category) => (
        <div key={category.category} className="space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-foreground">
              {category.category}
            </h3>
            <Badge variant="secondary" className="text-xs">
              {category.types.length} types
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground -mt-2">
            {category.description}
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {category.types.map((typeId) => {
              const config = BAG_TYPE_CONFIG[typeId];
              const Icon = bagTypeIcons[typeId];
              const isSelected = bagType === typeId;
              
              return (
                <button
                  key={typeId}
                  onClick={() => onChange(typeId)}
                  className={cn(
                    "relative p-4 rounded-xl border-2 text-left transition-all duration-300 group",
                    isSelected
                      ? "border-accent bg-accent/10 shadow-glow"
                      : "border-border bg-card hover:border-accent/50 hover:bg-accent/5"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg transition-colors shrink-0",
                        isSelected
                          ? "bg-accent text-accent-foreground"
                          : "bg-secondary text-secondary-foreground group-hover:bg-accent/20"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-bold text-sm text-foreground truncate">
                          {config.name}
                        </h4>
                        {!config.isWoven && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0">
                            Film
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {config.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-1">
                    {config.features.slice(0, 2).map((feature) => (
                      <span
                        key={feature}
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full",
                          isSelected
                            ? "bg-accent/20 text-accent-foreground"
                            : "bg-secondary text-muted-foreground"
                        )}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  {isSelected && (
                    <div className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-accent animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Material Info Card */}
      <div className="p-4 rounded-xl bg-secondary/50 border border-border">
        <h4 className="font-semibold text-sm text-foreground mb-2">
          Material Properties
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground">Selected:</span>
            <p className="font-medium text-foreground">{BAG_TYPE_CONFIG[bagType].name}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Type:</span>
            <p className="font-medium text-foreground">
              {BAG_TYPE_CONFIG[bagType].isWoven ? 'Woven Fabric' : 'Film/Sheet'}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Default GSM:</span>
            <p className="font-medium text-foreground">
              {BAG_TYPE_CONFIG[bagType].defaultGSM || 'N/A'}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Default Thickness:</span>
            <p className="font-medium text-foreground">
              {BAG_TYPE_CONFIG[bagType].defaultThickness 
                ? `${BAG_TYPE_CONFIG[bagType].defaultThickness} µm` 
                : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
