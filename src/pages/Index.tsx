import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCalculator } from "@/hooks/useCalculator";
import { useInvoices } from "@/hooks/useInvoices";
import { calculateInvoiceTotals, BAG_TYPE_CONFIG, PAPER_TYPE_CONFIG } from "@/types/calculator";
import {
  Calculator,
  Receipt,
  BarChart3,
  History,
  ArrowRight,
  Package,
  FileText,
  Truck,
  IndianRupee,
  Layers,
  Sparkles,
  TrendingUp,
  Settings,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Index() {
  const navigate = useNavigate();
  const { history, setProductCategory, setStep } = useCalculator();
  const { invoices, sellerProfile } = useInvoices();

  const handleLaunchPlastic = () => {
    setProductCategory("plastic");
    setStep(1);
    navigate("/calculator");
  };

  const handleLaunchPaper = () => {
    setProductCategory("paper");
    setStep(1);
    navigate("/calculator");
  };

  // Quick stats
  const totalInvoiced = invoices.reduce((acc, inv) => acc + calculateInvoiceTotals(inv).grandTotal, 0);
  const recentHistory = history.slice(0, 3);
  const recentInvoices = invoices.slice(0, 3);

  const formatINR = (val: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Top Header Hub */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/70 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              Mavrix Costing Pro • Packaging Suite
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-extrabold text-foreground tracking-tight">
              Manufacturing Costing & <span className="text-gradient">GST Invoicing</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Accurate ₹0.001 unit cost engine for PP/HDPE woven sacks, poly film, and paper carry bags.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/calculator">
              <Button variant="accent" size="lg" className="gap-2 shadow-glow font-semibold text-sm">
                <Calculator className="h-4 w-4" />
                New Calculation
              </Button>
            </Link>
            <Link to="/billing">
              <Button variant="outline" size="lg" className="gap-2 font-semibold text-sm">
                <Receipt className="h-4 w-4" />
                Create Tax Invoice
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Launch Cards */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Costing Workflows
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Plastic & Woven Card */}
            <div
              onClick={handleLaunchPlastic}
              className="bg-card rounded-2xl border border-border p-6 hover:border-accent/60 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-105 transition-transform">
                  <Package className="h-6 w-6" />
                </div>
                <Badge variant="secondary" className="text-xs font-medium">
                  PP • HDPE • Poly Film • BOPP
                </Badge>
              </div>

              <div className="mt-4">
                <h3 className="text-xl font-bold font-display text-foreground group-hover:text-accent transition-colors flex items-center gap-2">
                  Plastic & Woven Sacks
                  <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
                  Granule formulations, fabric GSM, gauge thickness, extrusion electricity, lamination, and cutting/stitching labour.
                </p>
              </div>

              <div className="flex items-center gap-2 mt-5 pt-4 border-t border-border/60 text-xs font-semibold text-accent">
                Launch Plastic Calculator →
              </div>
            </div>

            {/* Paper Bag Card */}
            <div
              onClick={handleLaunchPaper}
              className="bg-card rounded-2xl border border-border p-6 hover:border-accent/60 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-105 transition-transform">
                  <FileText className="h-6 w-6" />
                </div>
                <Badge variant="secondary" className="text-xs font-medium">
                  Kraft • Duplex • Art • Recycled
                </Badge>
              </div>

              <div className="mt-4">
                <h3 className="text-xl font-bold font-display text-foreground group-hover:text-accent transition-colors flex items-center gap-2">
                  Paper Carry Bags
                  <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
                  Sheet area weight calculation, paper reel rate, wastage %, side gussets, handle types, flexo printing, and pasting gum.
                </p>
              </div>

              <div className="flex items-center gap-2 mt-5 pt-4 border-t border-border/60 text-xs font-semibold text-accent">
                Launch Paper Calculator →
              </div>
            </div>
          </div>
        </div>

        {/* Operational Overview Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Calculations</span>
              <Calculator className="h-4 w-4 text-accent" />
            </div>
            <div className="text-2xl font-bold font-display text-foreground mt-2">
              {history.length}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Stored in history</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">GST Invoices</span>
              <Receipt className="h-4 w-4 text-info" />
            </div>
            <div className="text-2xl font-bold font-display text-foreground mt-2">
              {invoices.length}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Tax records generated</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Total Invoiced</span>
              <IndianRupee className="h-4 w-4 text-success" />
            </div>
            <div className="text-2xl font-bold font-display text-foreground mt-2">
              {formatINR(totalInvoiced)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Gross order volume</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Company Profile</span>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-sm font-semibold font-mono text-foreground mt-2 truncate">
              {sellerProfile.gstin || "Default Profile"}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{sellerProfile.name}</p>
          </div>
        </div>

        {/* Recent Costings & Invoices Two-Column Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Calculations */}
          <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground text-base flex items-center gap-2">
                <History className="h-4 w-4 text-accent" />
                Recent Cost Estimates
              </h3>
              <Link to="/history" className="text-xs font-medium text-accent hover:underline">
                View All ({history.length}) →
              </Link>
            </div>

            {recentHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-xs">
                No calculation records yet. Click New Calculation to start.
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentHistory.map((item) => {
                  const isPaper = item.productCategory === "paper";
                  const name = isPaper
                    ? (item.paperType && PAPER_TYPE_CONFIG[item.paperType]?.name) || "Paper Bag"
                    : (item.bagType && BAG_TYPE_CONFIG[item.bagType]?.name) || "Woven Sack";

                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-secondary/40 border border-border/80 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg", isPaper ? "bg-amber-500/10 text-amber-500" : "bg-accent/10 text-accent")}>
                          {isPaper ? <FileText className="h-4 w-4" /> : <Package className="h-4 w-4" />}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{item.label || name}</div>
                          <div className="text-[11px] text-muted-foreground">
                            {item.dimensions.length} × {item.dimensions.width} cm • {item.quantity.toLocaleString("en-IN")} bags
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-foreground">₹{item.costPerBag.toFixed(3)}/bag</div>
                        <div className="text-[10px] text-muted-foreground">Total: {formatINR(item.totalCost)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Tax Invoices */}
          <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground text-base flex items-center gap-2">
                <Receipt className="h-4 w-4 text-info" />
                Recent Tax Invoices
              </h3>
              <Link to="/billing" className="text-xs font-medium text-accent hover:underline">
                View All ({invoices.length}) →
              </Link>
            </div>

            {recentInvoices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-xs">
                No invoices issued yet.
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentInvoices.map((inv) => {
                  const totals = calculateInvoiceTotals(inv);
                  return (
                    <div
                      key={inv.id}
                      className="p-3 rounded-xl bg-secondary/40 border border-border/80 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-info/10 text-info">
                          <Receipt className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-semibold font-mono text-foreground">{inv.invoiceNo}</div>
                          <div className="text-[11px] text-muted-foreground truncate max-w-[150px]">
                            {inv.buyer.name || "Client"}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-foreground">{formatINR(totals.grandTotal)}</div>
                        <Badge variant="outline" className="text-[9px] capitalize px-1.5 py-0">
                          {inv.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
