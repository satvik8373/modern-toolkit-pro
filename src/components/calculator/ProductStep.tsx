import { Recycle, FileText, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductCategory } from "@/types/calculator";

interface ProductStepProps {
  productCategory: ProductCategory;
  onChange: (category: ProductCategory) => void;
}

const products = [
  {
    id: 'plastic' as ProductCategory,
    name: 'Plastic Bags',
    icon: Recycle,
    description: 'Woven sacks & poly film bags (PP, HDPE, LDPE, LLDPE, BOPP, HM, LD)',
    points: ['Granule based costing', 'Thickness / GSM weight', 'Extrusion & stitching'],
  },
  {
    id: 'paper' as ProductCategory,
    name: 'Paper Bags',
    icon: FileText,
    description: 'Kraft, duplex, art & recycled paper carry bags',
    points: ['GSM based paper costing', 'Handle & gusset options', 'Printing & pasting'],
  },
];

export function ProductStep({ productCategory, onChange }: ProductStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">
          Select Product
        </h2>
        <p className="text-muted-foreground mt-1">
          Choose what you manufacture — the costing sheet adapts automatically
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {products.map((product) => {
          const isSelected = productCategory === product.id;
          return (
            <button
              key={product.id}
              onClick={() => onChange(product.id)}
              className={cn(
                "relative p-5 rounded-2xl border-2 text-left transition-all duration-300 group",
                isSelected
                  ? "border-accent bg-accent/10 shadow-glow"
                  : "border-border bg-card hover:border-accent/50 hover:bg-accent/5"
              )}
            >
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl mb-4 transition-colors",
                  isSelected
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-secondary-foreground group-hover:bg-accent/20"
                )}
              >
                <product.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-foreground">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
              <ul className="mt-4 space-y-1.5">
                {product.points.map((point) => (
                  <li key={point} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
              {isSelected && (
                <div className="absolute top-4 right-4 h-2.5 w-2.5 rounded-full bg-accent animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
