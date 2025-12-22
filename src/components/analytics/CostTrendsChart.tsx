import { CalculationResult } from "@/types/calculator";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";

interface CostTrendsChartProps {
  data: CalculationResult[];
}

export function CostTrendsChart({ data }: CostTrendsChartProps) {
  const chartData = [...data]
    .reverse()
    .map((item, index) => ({
      name: `#${index + 1}`,
      date: format(new Date(item.timestamp), "MMM dd"),
      costPerBag: Number(item.costPerBag.toFixed(3)),
      materialCost: Number((item.materialCost / item.quantity).toFixed(3)),
      laborCost: Number((item.laborCost / item.quantity).toFixed(3)),
      machineCost: Number((item.machineCost / item.quantity).toFixed(3)),
    }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorMaterial" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
        <XAxis
          dataKey="name"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
          labelStyle={{ color: "hsl(var(--foreground))" }}
          formatter={(value: number, name: string) => [
            `₹${value.toFixed(3)}`,
            name === "costPerBag" ? "Total Cost/Bag" : 
            name === "materialCost" ? "Material Cost" :
            name === "laborCost" ? "Labor Cost" : "Machine Cost"
          ]}
        />
        <Area
          type="monotone"
          dataKey="costPerBag"
          stroke="hsl(var(--accent))"
          fillOpacity={1}
          fill="url(#colorCost)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="materialCost"
          stroke="hsl(var(--primary))"
          fillOpacity={1}
          fill="url(#colorMaterial)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
