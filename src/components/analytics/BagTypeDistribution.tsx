import { CalculationResult } from "@/types/calculator";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useMemo } from "react";

interface BagTypeDistributionProps {
  data: CalculationResult[];
}

const COLORS = [
  "hsl(var(--accent))",
  "hsl(var(--primary))",
  "hsl(var(--success))",
  "hsl(var(--warning))",
];

export function BagTypeDistribution({ data }: BagTypeDistributionProps) {
  const chartData = useMemo(() => {
    const distribution = data.reduce((acc, item) => {
      const key = item.bagType.toUpperCase();
      if (!acc[key]) {
        acc[key] = { count: 0, quantity: 0, value: 0 };
      }
      acc[key].count += 1;
      acc[key].quantity += item.quantity;
      acc[key].value += item.totalCost;
      return acc;
    }, {} as Record<string, { count: number; quantity: number; value: number }>);

    return Object.entries(distribution).map(([name, stats]) => ({
      name,
      count: stats.count,
      quantity: stats.quantity,
      value: stats.value,
    }));
  }, [data]);

  const totalCount = chartData.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center h-full gap-8">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            innerRadius={60}
            fill="#8884d8"
            dataKey="count"
            stroke="hsl(var(--background))"
            strokeWidth={2}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
            formatter={(value: number, name: string, props) => {
              const item = props.payload;
              return [
                <div key="tooltip" className="space-y-1">
                  <div>Calculations: {item.count}</div>
                  <div>Quantity: {item.quantity.toLocaleString()} bags</div>
                  <div>Total Value: ₹{item.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>,
                item.name
              ];
            }}
          />
          <Legend
            formatter={(value, entry) => (
              <span style={{ color: "hsl(var(--foreground))" }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
        {chartData.map((item, index) => (
          <div
            key={item.name}
            className="p-4 rounded-lg border border-border/50 bg-card/50"
            style={{ borderLeftColor: COLORS[index % COLORS.length], borderLeftWidth: 4 }}
          >
            <div className="text-sm font-medium text-muted-foreground">{item.name} Bags</div>
            <div className="text-2xl font-bold text-foreground">{item.count}</div>
            <div className="text-xs text-muted-foreground">
              {((item.count / totalCount) * 100).toFixed(1)}% of total
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
