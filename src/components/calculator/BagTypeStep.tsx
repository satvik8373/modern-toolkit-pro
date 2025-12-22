import { Package2, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface BagTypeStepProps {
  bagType: 'pp' | 'hdpe';
  onChange: (type: 'pp' | 'hdpe') => void;
}

const bagTypes = [
  {
    id: 'pp' as const,
    name: 'PP Woven Bags',
    description: 'Polypropylene woven bags for versatile applications',
    icon: Package2,
    features: ['High tensile strength', 'UV resistant', 'Lightweight'],
  },
  {
    id: 'hdpe' as const,
    name: 'HDPE Woven Bags',
    description: 'High-density polyethylene for heavy-duty use',
    icon: Layers,
    features: ['Chemical resistant', 'Moisture barrier', 'Durable'],
  },
];

export function BagTypeStep({ bagType, onChange }: BagTypeStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">
          Select Bag Type
        </h2>
        <p className="text-muted-foreground mt-1">
          Choose the base material for your woven bag
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {bagTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onChange(type.id)}
            className={cn(
              "relative p-6 rounded-xl border-2 text-left transition-all duration-300 group",
              bagType === type.id
                ? "border-accent bg-accent/5 shadow-glow"
                : "border-border bg-card hover:border-accent/50 hover:bg-accent/5"
            )}
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-lg transition-colors",
                  bagType === type.id
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-secondary-foreground group-hover:bg-accent/20"
                )}
              >
                <type.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-lg text-foreground">
                  {type.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {type.description}
                </p>
                <ul className="mt-3 space-y-1">
                  {type.features.map((feature) => (
                    <li
                      key={feature}
                      className="text-xs text-muted-foreground flex items-center gap-2"
                    >
                      <span className="h-1 w-1 rounded-full bg-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {bagType === type.id && (
              <div className="absolute top-4 right-4 h-3 w-3 rounded-full bg-accent animate-pulse" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
