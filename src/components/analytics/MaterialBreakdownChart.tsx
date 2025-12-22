import { CalculationResult } from "@/types/calculator";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo } from "react";

interface MaterialBreakdownChartProps {
  data: CalculationResult[];
}

export function MaterialBreakdownChart({ data }: MaterialBreakdownChartProps) {
  const chartData = useMemo(() => {
    const totalMaterial = data.reduce((sum, d) => sum + d.materialCost, 0);
    const totalLabor = data.reduce((sum, d) => sum + d.laborCost, 0);
    const totalMachine = data.reduce((sum, d) => sum + d.machineCost, 0);
    const total = totalMaterial + totalLabor + totalMachine;

    return [
      {
        category: "Material",
        value: totalMaterial,
        percentage: ((totalMaterial / total) * 100).toFixed(1),
        fill: "hsl(var(--accent))",
      },
      {
        category: "Labor",
        value: totalLabor,
        percentage: ((totalLabor / total) * 100).toFixed(1),
        fill: "hsl(var(--primary))",
      },
      {
        category: "Machine",
        value: totalMachine,
        percentage: ((totalMachine / total) * 100).toFixed(1),
        fill: "hsl(var(--success))",
      },
    ];
  }, [data]);

  const recentBreakdown = useMemo(() => {
    return [...data].slice(0, 10).reverse().map((item, index) => ({
      name: `#${data.length - 9 + index}`,
      material: Number((item.materialCost / item.quantity).toFixed(3)),
      labor: Number((item.laborCost / item.quantity).toFixed(3)),
      machine: Number((item.machineCost / item.quantity).toFixed(3)),
    }));
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={recentBreakdown} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
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
            name.charAt(0).toUpperCase() + name.slice(1)
          ]}
        />
        <Legend
          wrapperStyle={{ paddingTop: "20px" }}
          formatter={(value) => (
            <span style={{ color: "hsl(var(--foreground))" }}>
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </span>
          )}
        />
        <Bar dataKey="material" stackId="a" fill="hsl(var(--accent))" radius={[0, 0, 0, 0]} />
        <Bar dataKey="labor" stackId="a" fill="hsl(var(--primary))" radius={[0, 0, 0, 0]} />
        <Bar dataKey="machine" stackId="a" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
