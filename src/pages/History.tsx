import { Layout } from "@/components/layout/Layout";
import { useCalculator } from "@/hooks/useCalculator";
import { Button } from "@/components/ui/button";
import { History, Trash2, Package, Calendar, IndianRupee } from "lucide-react";
import { toast } from "sonner";

export default function HistoryPage() {
  const { history, clearHistory } = useCalculator();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 3,
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleClear = () => {
    clearHistory();
    toast.success("History cleared successfully");
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
              <History className="h-4 w-4" />
              Calculation History
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Past Calculations
            </h1>
            <p className="text-muted-foreground mt-1">
              View and manage your saved cost calculations
            </p>
          </div>
          {history.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleClear} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>

        {/* History List */}
        {history.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border">
            <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No calculations yet</h3>
            <p className="text-muted-foreground">
              Start calculating bag costs to see your history here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="bg-card rounded-xl border border-border p-5 hover:border-accent/50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Package className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {item.bagType.toUpperCase()} Woven Bag
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.dimensions.length} × {item.dimensions.width} cm
                        {item.dimensions.gussetType !== 'none' && ` • ${item.dimensions.gussetType} gusset`}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(item.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 md:text-right">
                    <div>
                      <p className="text-xs text-muted-foreground">Quantity</p>
                      <p className="font-semibold text-foreground">
                        {item.quantity.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Cost/Bag</p>
                      <p className="font-bold text-accent flex items-center gap-1">
                        <IndianRupee className="h-3 w-3" />
                        {formatCurrency(item.costPerBag).replace('₹', '')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total</p>
                      <p className="font-bold text-foreground">
                        {formatCurrency(item.totalCost)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
