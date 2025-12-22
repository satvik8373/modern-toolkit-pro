import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCalculator } from "@/hooks/useCalculator";
import { TrendingUp, TrendingDown, Package, IndianRupee, Layers, Users } from "lucide-react";
import { CostTrendsChart } from "@/components/analytics/CostTrendsChart";
import { MaterialBreakdownChart } from "@/components/analytics/MaterialBreakdownChart";
import { ProfitAnalysisChart } from "@/components/analytics/ProfitAnalysisChart";
import { BagTypeDistribution } from "@/components/analytics/BagTypeDistribution";
import { useMemo } from "react";

export default function Analytics() {
  const { history } = useCalculator();

  const stats = useMemo(() => {
    if (history.length === 0) {
      return {
        totalCalculations: 0,
        totalQuantity: 0,
        avgCostPerBag: 0,
        totalValue: 0,
        costTrend: 0,
        materialCostRatio: 0,
      };
    }

    const totalCalculations = history.length;
    const totalQuantity = history.reduce((sum, h) => sum + h.quantity, 0);
    const avgCostPerBag = history.reduce((sum, h) => sum + h.costPerBag, 0) / history.length;
    const totalValue = history.reduce((sum, h) => sum + h.totalCost, 0);

    // Calculate cost trend (comparing recent vs older calculations)
    const midpoint = Math.floor(history.length / 2);
    const recentAvg = history.slice(0, midpoint).reduce((sum, h) => sum + h.costPerBag, 0) / (midpoint || 1);
    const olderAvg = history.slice(midpoint).reduce((sum, h) => sum + h.costPerBag, 0) / (history.length - midpoint || 1);
    const costTrend = olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;

    // Material cost ratio
    const totalMaterialCost = history.reduce((sum, h) => sum + h.materialCost, 0);
    const materialCostRatio = (totalMaterialCost / totalValue) * 100;

    return {
      totalCalculations,
      totalQuantity,
      avgCostPerBag,
      totalValue,
      costTrend,
      materialCostRatio,
    };
  }, [history]);

  return (
    <Layout>
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track cost trends, material usage patterns, and profit analysis over time
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Calculations
              </CardTitle>
              <Package className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.totalCalculations}</div>
              <p className="text-xs text-muted-foreground">Bag cost estimates</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Quantity
              </CardTitle>
              <Layers className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.totalQuantity.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Bags calculated</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Cost/Bag
              </CardTitle>
              <IndianRupee className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground">
                  ₹{stats.avgCostPerBag.toFixed(3)}
                </span>
                {stats.costTrend !== 0 && (
                  <span className={`flex items-center text-xs ${stats.costTrend > 0 ? 'text-destructive' : 'text-success'}`}>
                    {stats.costTrend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {Math.abs(stats.costTrend).toFixed(1)}%
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Average unit cost</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Value
              </CardTitle>
              <Users className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ₹{stats.totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <p className="text-xs text-muted-foreground">Combined order value</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        {history.length === 0 ? (
          <Card className="bg-card/50 border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Package className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Data Yet</h3>
              <p className="text-muted-foreground max-w-md">
                Start calculating bag costs to see analytics. Your cost trends, material usage patterns, 
                and profit analysis will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="trends" className="space-y-6">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="trends">Cost Trends</TabsTrigger>
              <TabsTrigger value="materials">Material Breakdown</TabsTrigger>
              <TabsTrigger value="profit">Profit Analysis</TabsTrigger>
              <TabsTrigger value="distribution">Bag Types</TabsTrigger>
            </TabsList>

            <TabsContent value="trends" className="space-y-4">
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle>Cost Trends Over Time</CardTitle>
                  <CardDescription>
                    Track how your bag costs have changed across calculations
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <CostTrendsChart data={history} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="materials" className="space-y-4">
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle>Material Cost Breakdown</CardTitle>
                  <CardDescription>
                    Analyze how costs are distributed across materials, machines, and labor
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <MaterialBreakdownChart data={history} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profit" className="space-y-4">
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle>Profit Margin Analysis</CardTitle>
                  <CardDescription>
                    Simulate profit margins at different markup percentages
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ProfitAnalysisChart data={history} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="distribution" className="space-y-4">
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle>Bag Type Distribution</CardTitle>
                  <CardDescription>
                    See the breakdown of calculations by bag type
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <BagTypeDistribution data={history} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
}
