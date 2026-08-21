import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useCalculator } from "@/hooks/useCalculator";
import { CalculationResult, BAG_TYPE_CONFIG, PAPER_TYPE_CONFIG, CalculatorState } from "@/types/calculator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  History,
  Trash2,
  Package,
  Calendar,
  IndianRupee,
  Edit3,
  Search,
  Receipt,
  RotateCcw,
  FileText,
  Layers,
  Scale,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function HistoryPage() {
  const navigate = useNavigate();
  const { history, clearHistory, updateResult, deleteResult, loadState } = useCalculator();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [editingItem, setEditingItem] = useState<CalculationResult | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editQty, setEditQty] = useState<number>(0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(value);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleOpenEdit = (item: CalculationResult) => {
    setEditingItem(item);
    setEditLabel(item.label || "");
    setEditNotes(item.notes || "");
    setEditQty(item.quantity || 1000);
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    const newQty = editQty > 0 ? editQty : editingItem.quantity;
    const newTotal = editingItem.costPerBag * newQty;
    const newMaterial = (editingItem.materialCost / editingItem.quantity) * newQty;
    const newMachine = (editingItem.machineCost / editingItem.quantity) * newQty;
    const newLabor = (editingItem.laborCost / editingItem.quantity) * newQty;

    updateResult(editingItem.id, {
      label: editLabel,
      notes: editNotes,
      quantity: newQty,
      totalCost: newTotal,
      materialCost: newMaterial,
      machineCost: newMachine,
      laborCost: newLabor,
    });

    toast.success("Calculation updated successfully");
    setEditingItem(null);
  };

  const handleLoadInCalculator = (item: CalculationResult) => {
    if (item.snapshot) {
      loadState(item.snapshot as CalculatorState);
      toast.success("Loaded calculation parameters into Calculator");
      navigate("/calculator");
    } else {
      toast.error("Snapshot data not available for this record");
    }
  };

  const handleCreateInvoice = (item: CalculationResult) => {
    navigate("/billing", { state: { importResult: item } });
  };

  const handleDeleteItem = (id: string) => {
    deleteResult(id);
    toast.success("Calculation removed from history");
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear all calculation history?")) {
      clearHistory();
      toast.success("History cleared successfully");
    }
  };

  const filteredHistory = history.filter((item) => {
    const isPaper = item.productCategory === "paper";
    const typeName = isPaper
      ? (item.paperType && PAPER_TYPE_CONFIG[item.paperType]?.name) || "Paper Bag"
      : (item.bagType && BAG_TYPE_CONFIG[item.bagType]?.name) || "Plastic Bag";

    const matchesSearch =
      typeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.label && item.label.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      `${item.dimensions.length}x${item.dimensions.width}`.includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" ||
      (categoryFilter === "paper" && isPaper) ||
      (categoryFilter === "plastic" && !isPaper);

    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
              <History className="h-4 w-4" />
              Calculation Archive
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Costing <span className="text-gradient">History</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              View, edit, re-estimate, and export invoices from past calculations
            </p>
          </div>
          {history.length > 0 && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleClear} className="gap-2 text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
                Clear All
              </Button>
            </div>
          )}
        </div>

        {/* Filter / Search Controls */}
        {history.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-xl border border-border">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, size, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px] h-10">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="plastic">Plastic Sacks</SelectItem>
                  <SelectItem value="paper">Paper Bags</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* History List */}
        {history.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border">
            <History className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No calculations saved</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Perform bag costing in the calculator to record cost breakdowns here
            </p>
            <Button variant="accent" onClick={() => navigate("/calculator")} className="gap-2">
              <Sparkles className="h-4 w-4" />
              Go to Calculator
            </Button>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-2xl border border-border">
            <Search className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
            <h3 className="text-base font-semibold text-foreground">No matching calculations</h3>
            <p className="text-muted-foreground text-xs mt-1">Try changing your search term or filter</p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredHistory.map((item) => {
              const isPaper = item.productCategory === "paper";
              const typeName = isPaper
                ? (item.paperType && PAPER_TYPE_CONFIG[item.paperType]?.name) || "Paper Bag"
                : (item.bagType && BAG_TYPE_CONFIG[item.bagType]?.name) || "Plastic Woven Bag";

              return (
                <div
                  key={item.id}
                  className="bg-card rounded-xl border border-border p-5 hover:border-accent/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0",
                        isPaper ? "bg-warning/10 text-warning" : "bg-accent/10 text-accent"
                      )}
                    >
                      {isPaper ? <FileText className="h-6 w-6" /> : <Package className="h-6 w-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-foreground">
                          {item.label ? item.label : typeName}
                        </h3>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[10px] uppercase font-semibold",
                            isPaper ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-accent/10 text-accent"
                          )}
                        >
                          {isPaper ? "Paper Bag" : "Plastic Sack"}
                        </Badge>
                        {item.label && (
                          <span className="text-xs text-muted-foreground font-medium">({typeName})</span>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
                        <span>
                          {item.dimensions.length} × {item.dimensions.width} cm
                        </span>
                        {item.dimensions.gusset > 0 && (
                          <span>• {item.dimensions.gusset}cm gusset</span>
                        )}
                        <span>• {item.bagWeight ? `${item.bagWeight.toFixed(1)}g/bag` : ""}</span>
                      </p>

                      {item.notes && (
                        <p className="text-xs text-muted-foreground/80 italic mt-1 line-clamp-1 bg-secondary/50 px-2 py-0.5 rounded inline-block">
                          Note: {item.notes}
                        </p>
                      )}

                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1.5">
                        <Calendar className="h-3 w-3" />
                        {formatDate(item.timestamp)}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-border">
                    <div className="text-left md:text-right">
                      <p className="text-xs text-muted-foreground">
                        {item.quantity.toLocaleString("en-IN")} bags @
                      </p>
                      <p className="font-bold text-accent text-base flex items-center gap-0.5 md:justify-end">
                        <IndianRupee className="h-3.5 w-3.5" />
                        {formatCurrency(item.costPerBag).replace("₹", "")}
                        <span className="text-xs font-normal text-muted-foreground">/bag</span>
                      </p>
                      <p className="text-xs font-semibold text-foreground">
                        Total: {formatCurrency(item.totalCost)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleCreateInvoice(item)}
                        className="gap-1 text-xs"
                        title="Create Tax Invoice"
                      >
                        <Receipt className="h-3.5 w-3.5" />
                        Invoice
                      </Button>
                      {item.snapshot && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLoadInCalculator(item)}
                          className="gap-1 text-xs"
                          title="Load into Calculator"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          Reopen
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(item)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        title="Edit / Annotate"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteItem(item.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* =========================================================
            EDIT / DETAILS MODAL
            ========================================================= */}
        <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-accent" />
                Edit Calculation Record
              </DialogTitle>
              <DialogDescription>
                Add custom project tags, client notes, or adjust batch quantity.
              </DialogDescription>
            </DialogHeader>

            {editingItem && (
              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label>Project / Client Label</Label>
                  <Input
                    placeholder="e.g., Order for GreenGrocers 50k Bags"
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    className="h-10"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Order Quantity (bags)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={editQty || ""}
                    onChange={(e) => setEditQty(parseInt(e.target.value) || 0)}
                    className="h-10 font-semibold"
                  />
                  <p className="text-xs text-muted-foreground">
                    Cost per bag is ₹{editingItem.costPerBag.toFixed(3)} • Total will adjust to{" "}
                    {formatCurrency(editingItem.costPerBag * (editQty || 1))}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label>Production Notes & Instructions</Label>
                  <textarea
                    rows={3}
                    placeholder="e.g., Use virgin granules + 2% UV masterbatch with flexo print"
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    className="w-full text-sm rounded-lg border border-border bg-background p-2.5 focus:ring-1 focus:ring-accent"
                  />
                </div>

                {/* Specs quick view */}
                <div className="bg-secondary/40 rounded-xl p-3 border border-border text-xs space-y-1">
                  <div className="font-semibold text-foreground mb-1">Specifications:</div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Dimensions:</span>
                    <span className="font-medium text-foreground">
                      {editingItem.dimensions.length} × {editingItem.dimensions.width} cm
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Unit Weight:</span>
                    <span className="font-medium text-foreground">
                      {editingItem.bagWeight.toFixed(2)} g
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Material Cost (Total):</span>
                    <span className="font-medium text-foreground">
                      {formatCurrency((editingItem.materialCost / editingItem.quantity) * editQty)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingItem(null)}>
                Cancel
              </Button>
              <Button variant="accent" onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
