import { CalculationResult } from "@/types/calculator";
import {
  Line,
  LineChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo } from "react";

interface ProfitAnalysisChartProps {
  data: CalculationResult[];
}

export function ProfitAnalysisChart({ data }: ProfitAnalysisChartProps) {
  const chartData = useMemo(() => {
    const avgCostPerBag = data.reduce((sum, d) => sum + d.costPerBag, 0) / data.length;
    
    // Generate profit margins at different markup percentages
    const markups = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
    
    return markups.map((markup) => {
      const sellingPrice = avgCostPerBag * (1 + markup / 100);
      const profitPerBag = sellingPrice - avgCostPerBag;
      const profitMargin = (profitPerBag / sellingPrice) * 100;
      
      // Calculate for a standard order of 10,000 bags
      const orderQuantity = 10000;
      const totalProfit = profitPerBag * orderQuantity;
      
      return {
        markup: `${markup}%`,
        sellingPrice: Number(sellingPrice.toFixed(3)),
        profitPerBag: Number(profitPerBag.toFixed(3)),
        profitMargin: Number(profitMargin.toFixed(1)),
        totalProfit: Number(totalProfit.toFixed(0)),
      };
    });
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
        <XAxis
          dataKey="markup"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          label={{ value: "Markup %", position: "insideBottom", offset: -5, fill: "hsl(var(--muted-foreground))" }}
        />
        <YAxis
          yAxisId="left"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${value}`}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
          labelStyle={{ color: "hsl(var(--foreground))" }}
          formatter={(value: number, name: string) => {
            if (name === "sellingPrice") return [`₹${value.toFixed(3)}`, "Selling Price"];
            if (name === "profitPerBag") return [`₹${value.toFixed(3)}`, "Profit/Bag"];
            if (name === "profitMargin") return [`${value}%`, "Profit Margin"];
            if (name === "totalProfit") return [`₹${value.toLocaleString()}`, "Profit (10K bags)"];
            return [value, name];
          }}
        />
        <Legend
          wrapperStyle={{ paddingTop: "20px" }}
          formatter={(value) => {
            const labels: Record<string, string> = {
              sellingPrice: "Selling Price",
              profitPerBag: "Profit/Bag",
              profitMargin: "Profit Margin %",
            };
            return <span style={{ color: "hsl(var(--foreground))" }}>{labels[value] || value}</span>;
          }}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="sellingPrice"
          stroke="hsl(var(--accent))"
          strokeWidth={2}
          dot={{ fill: "hsl(var(--accent))", strokeWidth: 2 }}
          activeDot={{ r: 6, fill: "hsl(var(--accent))" }}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="profitPerBag"
          stroke="hsl(var(--success))"
          strokeWidth={2}
          dot={{ fill: "hsl(var(--success))", strokeWidth: 2 }}
          activeDot={{ r: 6, fill: "hsl(var(--success))" }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="profitMargin"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
          activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
