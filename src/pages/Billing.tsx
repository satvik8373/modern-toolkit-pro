import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useInvoices } from "@/hooks/useInvoices";
import {
  Invoice,
  InvoiceItem,
  InvoiceParty,
  calculateInvoiceTotals,
  CalculationResult,
} from "@/types/calculator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Receipt,
  Plus,
  Printer,
  Trash2,
  Copy,
  Edit3,
  CheckCircle,
  Truck,
  IndianRupee,
  Building2,
  FileText,
  Search,
  ArrowLeft,
  Settings2,
  Download,
  AlertCircle,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// HSN Presets for quick packaging selection
const HSN_PRESETS = [
  { code: "6305", label: "6305 - PP/HDPE Woven Sacks & Bags" },
  { code: "3923", label: "3923 - Plastic Articles & Carry Bags" },
  { code: "4819", label: "4819 - Paper Bags, Cartons & Boxes" },
  { code: "3920", label: "3920 - Plastic Film & Sheets" },
  { code: "4818", label: "4818 - Paper Rolls & Cellulose Wadding" },
];

function numberToWordsINR(num: number): string {
  const a = [
    '', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ',
    'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const inWords = (n: number): string => {
    if (n === 0) return '';
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : ' ');
    if (n < 1000) return a[Math.floor(n / 100)] + 'Hundred ' + inWords(n % 100);
    if (n < 100000) return inWords(Math.floor(n / 1000)) + 'Thousand ' + inWords(n % 1000);
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + 'Lakh ' + inWords(n % 100000);
    return inWords(Math.floor(n / 10000000)) + 'Crore ' + inWords(n % 10000000);
  };

  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);

  let words = integerPart === 0 ? 'Zero ' : inWords(integerPart);
  words = 'Rupees ' + words.trim();

  if (decimalPart > 0) {
    words += ' and ' + inWords(decimalPart).trim() + ' Paise';
  }
  return words + ' Only';
}

export default function BillingPage() {
  const location = useLocation();
  const {
    invoices,
    activeInvoice,
    setActiveInvoice,
    sellerProfile,
    saveSellerProfile,
    buildInvoiceDraft,
    createInvoice,
    importFromCalculation,
    saveInvoice,
    deleteInvoice,
    duplicateInvoice,
    updateInvoiceStatus,
  } = useInvoices();

  const [mode, setMode] = useState<"list" | "edit" | "print">("list");
  const [currentEdit, setCurrentEdit] = useState<Invoice | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sellerModalOpen, setSellerModalOpen] = useState(false);
  const [sellerForm, setSellerForm] = useState<InvoiceParty>(sellerProfile);

  const navigate = useNavigate();
  const importedRef = useRef(false);

  // Auto-import calculation result if passed from Calculator/History (only once)
  useEffect(() => {
    const stateObj = location.state as { importResult?: CalculationResult } | null;
    if (stateObj?.importResult && !importedRef.current) {
      importedRef.current = true;
      const created = importFromCalculation(stateObj.importResult);
      setCurrentEdit(created);
      setMode("edit");
      toast.success("Imported calculation into Tax Invoice draft");
      // Clear navigation state so re-renders / reloads do not duplicate
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, importFromCalculation, navigate]);

  const handleStartNew = () => {
    const newInv = buildInvoiceDraft();
    setCurrentEdit(newInv);
    setMode("edit");
  };

  const handleEdit = (inv: Invoice) => {
    setCurrentEdit(JSON.parse(JSON.stringify(inv)));
    setMode("edit");
  };

  const handlePrintView = (inv: Invoice) => {
    setCurrentEdit(inv);
    setMode("print");
  };

  const handleSaveCurrent = () => {
    if (!currentEdit) return;
    if (!currentEdit.buyer.name) {
      toast.error("Please enter the Buyer / Customer Name");
      return;
    }
    saveInvoice(currentEdit);
    toast.success(`Invoice ${currentEdit.invoiceNo} saved successfully!`);
    setMode("list");
  };

  const handleAddItem = () => {
    if (!currentEdit) return;
    const newItem: InvoiceItem = {
      id: crypto.randomUUID(),
      description: "",
      hsn: "6305",
      quantity: 1000,
      unit: "BAGS",
      rate: 10,
      discount: 0,
      taxRate: 18,
    };
    setCurrentEdit({
      ...currentEdit,
      items: [...currentEdit.items, newItem],
    });
  };

  const handleRemoveItem = (id: string) => {
    if (!currentEdit) return;
    if (currentEdit.items.length <= 1) {
      toast.error("Invoice must have at least one line item");
      return;
    }
    setCurrentEdit({
      ...currentEdit,
      items: currentEdit.items.filter((item) => item.id !== id),
    });
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: any) => {
    if (!currentEdit) return;
    setCurrentEdit({
      ...currentEdit,
      items: currentEdit.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const handleSaveSellerProfile = () => {
    saveSellerProfile(sellerForm);
    setSellerModalOpen(false);
    toast.success("Default Business / Seller Profile saved!");
  };

  // Metrics
  const totalInvoiced = invoices.reduce((acc, inv) => acc + calculateInvoiceTotals(inv).grandTotal, 0);
  const paidInvoices = invoices.filter((i) => i.status === "paid");
  const totalPaid = paidInvoices.reduce((acc, inv) => acc + calculateInvoiceTotals(inv).grandTotal, 0);
  const draftCount = invoices.filter((i) => i.status === "draft").length;

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.buyer.gstin.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* =========================================================
            VIEW 1: INVOICE LIST
            ========================================================= */}
        {mode === "list" && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wider mb-2">
                  <Receipt className="h-4 w-4" />
                  GST Billing & Invoicing
                </div>
                <h1 className="text-3xl font-display font-bold text-foreground">
                  Tax Invoices & <span className="text-gradient">E-Way Bills</span>
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Create, print, and manage GST compliant tax invoices with real-time tax breakdown
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSellerForm(sellerProfile);
                    setSellerModalOpen(true);
                  }}
                  className="gap-2"
                >
                  <Building2 className="h-4 w-4" />
                  Business Profile
                </Button>
                <Button variant="accent" onClick={handleStartNew} className="gap-2 shadow-glow">
                  <Plus className="h-4 w-4" />
                  New Tax Invoice
                </Button>
              </div>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
                <div className="text-xs text-muted-foreground font-medium">Total Invoiced</div>
                <div className="text-2xl font-bold font-display text-foreground mt-1">
                  {formatINR(totalInvoiced)}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{invoices.length} invoices generated</div>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
                <div className="text-xs text-muted-foreground font-medium">Total Collected</div>
                <div className="text-2xl font-bold font-display text-success mt-1">
                  {formatINR(totalPaid)}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{paidInvoices.length} paid invoices</div>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
                <div className="text-xs text-muted-foreground font-medium">Pending Drafts</div>
                <div className="text-2xl font-bold font-display text-warning mt-1">
                  {draftCount}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Awaiting dispatch/issue</div>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
                <div className="text-xs text-muted-foreground font-medium">Active GSTIN</div>
                <div className="text-sm font-semibold font-mono text-accent mt-2 truncate">
                  {sellerProfile.gstin || "Not configured"}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{sellerProfile.state}</div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-card p-4 rounded-xl border border-border">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoice #, customer, GSTIN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10"
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] h-10">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="issued">Issued</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Invoices List */}
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-2xl border border-border">
                <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-1">No Invoices Found</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {searchQuery ? "Try refining your search query" : "Create your first GST tax invoice or import from calculation"}
                </p>
                <Button variant="accent" onClick={handleStartNew} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Tax Invoice
                </Button>
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredInvoices.map((inv) => {
                  const totals = calculateInvoiceTotals(inv);
                  const statusColors: Record<string, string> = {
                    draft: "bg-muted text-muted-foreground border-border",
                    issued: "bg-info/10 text-info border-info/30",
                    paid: "bg-success/10 text-success border-success/30",
                    cancelled: "bg-destructive/10 text-destructive border-destructive/30",
                  };

                  return (
                    <div
                      key={inv.id}
                      className="bg-card rounded-xl border border-border p-5 hover:border-accent/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-11 w-11 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent font-bold">
                          <Receipt className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2.5">
                            <span className="font-bold text-foreground font-mono">{inv.invoiceNo}</span>
                            <Badge variant="outline" className={cn("capitalize text-xs", statusColors[inv.status])}>
                              {inv.status}
                            </Badge>
                            {inv.eway.required && (
                              <Badge variant="secondary" className="gap-1 text-[10px]">
                                <Truck className="h-3 w-3" />
                                E-Way: {inv.eway.ewayBillNo || "Pending"}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm font-semibold text-foreground mt-1">
                            {inv.buyer.name || "Unnamed Customer"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Date: {inv.invoiceDate} • Place of Supply: {inv.placeOfSupply}
                            {inv.interState && " (IGST Inter-State)"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-6 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-border">
                        <div className="text-left md:text-right">
                          <div className="text-xs text-muted-foreground">Grand Total</div>
                          <div className="text-lg font-bold text-foreground font-display">
                            {formatINR(totals.grandTotal)}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            Tax: {formatINR(totals.totalTax)}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePrintView(inv)}
                            className="gap-1.5"
                            title="Print / View Tax Invoice"
                          >
                            <Printer className="h-3.5 w-3.5" />
                            Print
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleEdit(inv)}
                            className="gap-1.5"
                            title="Edit Invoice"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              duplicateInvoice(inv.id);
                              toast.success("Invoice duplicated as draft!");
                            }}
                            title="Duplicate"
                            className="h-8 w-8"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (confirm("Delete this invoice permanently?")) {
                                deleteInvoice(inv.id);
                                toast.success("Invoice deleted");
                              }
                            }}
                            title="Delete"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            VIEW 2: EDIT / CREATE INVOICE FORM
            ========================================================= */}
        {mode === "edit" && currentEdit && (
          <div className="space-y-6 animate-fade-in">
            {/* Header / Nav */}
            <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => setMode("list")} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <div>
                  <h2 className="text-xl font-bold font-display text-foreground">
                    {currentEdit.id ? "Edit Tax Invoice" : "Create Tax Invoice"}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {currentEdit.invoiceNo} • {currentEdit.invoiceDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePrintView(currentEdit)}
                  className="gap-2"
                >
                  <Printer className="h-4 w-4" />
                  Preview & Print
                </Button>
                <Button variant="accent" onClick={handleSaveCurrent} className="gap-2 shadow-glow">
                  <CheckCircle className="h-4 w-4" />
                  Save Invoice
                </Button>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Form Sections */}
              <div className="lg:col-span-2 space-y-6">
                {/* 1. Basic Invoice Info */}
                <div className="bg-card rounded-xl border border-border p-5 space-y-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-accent" />
                    Invoice & Tax Settings
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label>Invoice Number</Label>
                      <Input
                        value={currentEdit.invoiceNo}
                        onChange={(e) => setCurrentEdit({ ...currentEdit, invoiceNo: e.target.value })}
                        className="h-10 font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Invoice Date</Label>
                      <Input
                        type="date"
                        value={currentEdit.invoiceDate}
                        onChange={(e) => setCurrentEdit({ ...currentEdit, invoiceDate: e.target.value })}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Due Date</Label>
                      <Input
                        type="date"
                        value={currentEdit.dueDate}
                        onChange={(e) => setCurrentEdit({ ...currentEdit, dueDate: e.target.value })}
                        className="h-10"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <Label>Place of Supply (State)</Label>
                      <Input
                        value={currentEdit.placeOfSupply}
                        onChange={(e) => setCurrentEdit({ ...currentEdit, placeOfSupply: e.target.value })}
                        placeholder="e.g. Maharashtra (27)"
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Status</Label>
                      <Select
                        value={currentEdit.status}
                        onValueChange={(val: any) => setCurrentEdit({ ...currentEdit, status: val })}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="issued">Issued</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/50 border border-border">
                      <div>
                        <Label className="text-xs font-semibold">Inter-State (IGST)?</Label>
                        <p className="text-[10px] text-muted-foreground">Default is Intra (CGST+SGST)</p>
                      </div>
                      <Switch
                        checked={currentEdit.interState}
                        onCheckedChange={(checked) => setCurrentEdit({ ...currentEdit, interState: checked })}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Seller & Buyer Details */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Seller */}
                  <div className="bg-card rounded-xl border border-border p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-primary" />
                        Seller (Your Firm)
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSellerForm(currentEdit.seller);
                          setSellerModalOpen(true);
                        }}
                        className="text-xs h-7"
                      >
                        Edit Profile
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Input
                        placeholder="Seller Business Name"
                        value={currentEdit.seller.name}
                        onChange={(e) =>
                          setCurrentEdit({
                            ...currentEdit,
                            seller: { ...currentEdit.seller, name: e.target.value },
                          })
                        }
                        className="h-9 text-sm"
                      />
                      <Input
                        placeholder="Seller GSTIN"
                        value={currentEdit.seller.gstin}
                        onChange={(e) =>
                          setCurrentEdit({
                            ...currentEdit,
                            seller: { ...currentEdit.seller, gstin: e.target.value.toUpperCase() },
                          })
                        }
                        className="h-9 text-sm font-mono"
                      />
                      <Input
                        placeholder="Seller Address & MIDC Area"
                        value={currentEdit.seller.address}
                        onChange={(e) =>
                          setCurrentEdit({
                            ...currentEdit,
                            seller: { ...currentEdit.seller, address: e.target.value },
                          })
                        }
                        className="h-9 text-sm"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="State"
                          value={currentEdit.seller.state}
                          onChange={(e) =>
                            setCurrentEdit({
                              ...currentEdit,
                              seller: { ...currentEdit.seller, state: e.target.value },
                            })
                          }
                          className="h-9 text-sm"
                        />
                        <Input
                          placeholder="Phone"
                          value={currentEdit.seller.phone}
                          onChange={(e) =>
                            setCurrentEdit({
                              ...currentEdit,
                              seller: { ...currentEdit.seller, phone: e.target.value },
                            })
                          }
                          className="h-9 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Buyer */}
                  <div className="bg-card rounded-xl border border-border p-5 space-y-3">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-accent" />
                      Buyer (Client / Consignee)
                    </h3>
                    <div className="space-y-2">
                      <Input
                        placeholder="Client Company Name *"
                        value={currentEdit.buyer.name}
                        onChange={(e) =>
                          setCurrentEdit({
                            ...currentEdit,
                            buyer: { ...currentEdit.buyer, name: e.target.value },
                          })
                        }
                        className="h-9 text-sm font-medium"
                      />
                      <Input
                        placeholder="Buyer GSTIN (e.g. 27AAAAA0000A1Z5)"
                        value={currentEdit.buyer.gstin}
                        onChange={(e) =>
                          setCurrentEdit({
                            ...currentEdit,
                            buyer: { ...currentEdit.buyer, gstin: e.target.value.toUpperCase() },
                          })
                        }
                        className="h-9 text-sm font-mono"
                      />
                      <Input
                        placeholder="Delivery & Billing Address"
                        value={currentEdit.buyer.address}
                        onChange={(e) =>
                          setCurrentEdit({
                            ...currentEdit,
                            buyer: { ...currentEdit.buyer, address: e.target.value },
                          })
                        }
                        className="h-9 text-sm"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Buyer State"
                          value={currentEdit.buyer.state}
                          onChange={(e) =>
                            setCurrentEdit({
                              ...currentEdit,
                              buyer: { ...currentEdit.buyer, state: e.target.value },
                            })
                          }
                          className="h-9 text-sm"
                        />
                        <Input
                          placeholder="Phone / Mobile"
                          value={currentEdit.buyer.phone}
                          onChange={(e) =>
                            setCurrentEdit({
                              ...currentEdit,
                              buyer: { ...currentEdit.buyer, phone: e.target.value },
                            })
                          }
                          className="h-9 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Line Items Table */}
                <div className="bg-card rounded-xl border border-border p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4 text-info" />
                      Goods / Products Description
                    </h3>
                    <Button variant="secondary" size="sm" onClick={handleAddItem} className="gap-1.5">
                      <Plus className="h-3.5 w-3.5" />
                      Add Item
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {currentEdit.items.map((item, idx) => {
                      const itemTotal = Math.max(item.quantity * item.rate - item.discount, 0);
                      const itemTax = (itemTotal * item.taxRate) / 100;
                      return (
                        <div
                          key={item.id}
                          className="p-4 rounded-xl bg-secondary/30 border border-border space-y-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-muted-foreground">#{idx + 1}</span>
                            <div className="flex items-center gap-2">
                              <Select
                                value={item.hsn}
                                onValueChange={(val) => handleItemChange(item.id, "hsn", val)}
                              >
                                <SelectTrigger className="h-8 text-xs w-[160px]">
                                  <SelectValue placeholder="HSN Code" />
                                </SelectTrigger>
                                <SelectContent>
                                  {HSN_PRESETS.map((hsn) => (
                                    <SelectItem key={hsn.code} value={hsn.code} className="text-xs">
                                      {hsn.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveItem(item.id)}
                                className="h-7 w-7 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>

                          <div>
                            <Input
                              placeholder="Product Description (e.g. PP Woven Sacks 50kg, 60 GSM, 60x90cm)"
                              value={item.description}
                              onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                              className="h-10 text-sm font-medium"
                            />
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                            <div className="space-y-1">
                              <Label className="text-[11px] text-muted-foreground">Quantity</Label>
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity || ""}
                                onChange={(e) => handleItemChange(item.id, "quantity", parseFloat(e.target.value) || 0)}
                                className="h-9 text-sm"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[11px] text-muted-foreground">Unit</Label>
                              <Select
                                value={item.unit}
                                onValueChange={(val) => handleItemChange(item.id, "unit", val)}
                              >
                                <SelectTrigger className="h-9 text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="BAGS">BAGS</SelectItem>
                                  <SelectItem value="PCS">PCS</SelectItem>
                                  <SelectItem value="KG">KG</SelectItem>
                                  <SelectItem value="ROLL">ROLL</SelectItem>
                                  <SelectItem value="MTR">MTR</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[11px] text-muted-foreground">Rate (₹)</Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={item.rate || ""}
                                onChange={(e) => handleItemChange(item.id, "rate", parseFloat(e.target.value) || 0)}
                                className="h-9 text-sm"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[11px] text-muted-foreground">Discount (₹)</Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={item.discount || ""}
                                onChange={(e) => handleItemChange(item.id, "discount", parseFloat(e.target.value) || 0)}
                                className="h-9 text-sm"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[11px] text-muted-foreground">GST %</Label>
                              <Select
                                value={String(item.taxRate)}
                                onValueChange={(val) => handleItemChange(item.id, "taxRate", parseFloat(val))}
                              >
                                <SelectTrigger className="h-9 text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="0">0%</SelectItem>
                                  <SelectItem value="5">5%</SelectItem>
                                  <SelectItem value="12">12%</SelectItem>
                                  <SelectItem value="18">18% (Standard)</SelectItem>
                                  <SelectItem value="28">28%</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-xs text-muted-foreground pt-1 px-1">
                            <span>Taxable: {formatINR(itemTotal)}</span>
                            <span className="font-semibold text-foreground">
                              Line Total (incl. GST): {formatINR(itemTotal + itemTax)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. E-Way Bill Details */}
                <div className="bg-card rounded-xl border border-border p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-info/10 flex items-center justify-center">
                        <Truck className="h-5 w-5 text-info" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">E-Way Bill Details</h3>
                        <p className="text-xs text-muted-foreground">Generate movement document for transportation</p>
                      </div>
                    </div>
                    <Switch
                      checked={currentEdit.eway.required}
                      onCheckedChange={(checked) =>
                        setCurrentEdit({
                          ...currentEdit,
                          eway: { ...currentEdit.eway, required: checked },
                        })
                      }
                    />
                  </div>

                  {currentEdit.eway.required && (
                    <div className="space-y-4 pt-3 border-t border-border animate-fade-in">
                      <div className="grid sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">E-Way Bill No.</Label>
                          <Input
                            placeholder="12-digit E-Way Bill No."
                            value={currentEdit.eway.ewayBillNo}
                            onChange={(e) =>
                              setCurrentEdit({
                                ...currentEdit,
                                eway: { ...currentEdit.eway, ewayBillNo: e.target.value },
                              })
                            }
                            className="h-9 font-mono text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Vehicle Number</Label>
                          <Input
                            placeholder="e.g. MH-04-GP-8821"
                            value={currentEdit.eway.vehicleNo}
                            onChange={(e) =>
                              setCurrentEdit({
                                ...currentEdit,
                                eway: { ...currentEdit.eway, vehicleNo: e.target.value.toUpperCase() },
                              })
                            }
                            className="h-9 font-mono text-sm uppercase"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Approx Distance (KM)</Label>
                          <Input
                            type="number"
                            value={currentEdit.eway.distanceKm || ""}
                            onChange={(e) =>
                              setCurrentEdit({
                                ...currentEdit,
                                eway: { ...currentEdit.eway, distanceKm: parseFloat(e.target.value) || 0 },
                              })
                            }
                            className="h-9 text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Transporter Name</Label>
                          <Input
                            placeholder="e.g. V-Trans Logistics Ltd"
                            value={currentEdit.eway.transporterName}
                            onChange={(e) =>
                              setCurrentEdit({
                                ...currentEdit,
                                eway: { ...currentEdit.eway, transporterName: e.target.value },
                              })
                            }
                            className="h-9 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Transporter ID / GSTIN</Label>
                          <Input
                            placeholder="Transporter GSTIN"
                            value={currentEdit.eway.transporterId}
                            onChange={(e) =>
                              setCurrentEdit({
                                ...currentEdit,
                                eway: { ...currentEdit.eway, transporterId: e.target.value.toUpperCase() },
                              })
                            }
                            className="h-9 font-mono text-sm uppercase"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Dispatch From Address</Label>
                          <Input
                            value={currentEdit.eway.dispatchFrom}
                            onChange={(e) =>
                              setCurrentEdit({
                                ...currentEdit,
                                eway: { ...currentEdit.eway, dispatchFrom: e.target.value },
                              })
                            }
                            className="h-9 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Ship To Address</Label>
                          <Input
                            placeholder="Destination warehouse address"
                            value={currentEdit.eway.shipTo}
                            onChange={(e) =>
                              setCurrentEdit({
                                ...currentEdit,
                                eway: { ...currentEdit.eway, shipTo: e.target.value },
                              })
                            }
                            className="h-9 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Col: Summary & Actions Card */}
              <div className="space-y-6">
                {/* Summary Card */}
                {(() => {
                  const totals = calculateInvoiceTotals(currentEdit);
                  return (
                    <div className="bg-card rounded-xl border border-border p-5 space-y-4 sticky top-20 shadow-lg">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <IndianRupee className="h-4 w-4 text-accent" />
                        Invoice Summary
                      </h3>

                      <div className="space-y-2.5 text-sm">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Taxable Value:</span>
                          <span className="font-medium text-foreground">{formatINR(totals.taxableValue)}</span>
                        </div>

                        {!currentEdit.interState ? (
                          <>
                            <div className="flex justify-between text-muted-foreground">
                              <span>CGST (Central Tax):</span>
                              <span className="font-medium text-foreground">{formatINR(totals.cgst)}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                              <span>SGST (State Tax):</span>
                              <span className="font-medium text-foreground">{formatINR(totals.sgst)}</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex justify-between text-muted-foreground">
                            <span>IGST (Integrated Tax):</span>
                            <span className="font-medium text-foreground">{formatINR(totals.igst)}</span>
                          </div>
                        )}

                        <div className="flex justify-between text-muted-foreground border-t border-border pt-2">
                          <span>Total GST Amount:</span>
                          <span className="font-semibold text-foreground">{formatINR(totals.totalTax)}</span>
                        </div>

                        {currentEdit.roundOff && (
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Round Off:</span>
                            <span>{totals.roundOffValue >= 0 ? `+${totals.roundOffValue.toFixed(2)}` : totals.roundOffValue.toFixed(2)}</span>
                          </div>
                        )}

                        <div className="flex justify-between items-center border-t-2 border-border pt-3">
                          <span className="text-base font-bold text-foreground">Grand Total:</span>
                          <span className="text-2xl font-bold font-display text-accent">
                            {formatINR(totals.grandTotal)}
                          </span>
                        </div>

                        <div className="text-[11px] text-muted-foreground bg-secondary/50 p-2.5 rounded-lg mt-2">
                          <span className="font-semibold text-foreground">In Words:</span>{" "}
                          {numberToWordsINR(totals.grandTotal)}
                        </div>
                      </div>

                      {/* Notes / Terms */}
                      <div className="space-y-1.5 pt-2">
                        <Label className="text-xs">Terms & Payment Notes</Label>
                        <textarea
                          rows={3}
                          value={currentEdit.notes}
                          onChange={(e) => setCurrentEdit({ ...currentEdit, notes: e.target.value })}
                          className="w-full text-xs rounded-lg border border-border bg-background p-2 focus:ring-1 focus:ring-accent"
                          placeholder="Jurisdiction, payment terms, etc."
                        />
                      </div>

                      {/* Action buttons */}
                      <div className="space-y-2 pt-2">
                        <Button
                          variant="accent"
                          className="w-full h-11 shadow-glow gap-2"
                          onClick={handleSaveCurrent}
                        >
                          <CheckCircle className="h-4 w-4" />
                          Save & Confirm Invoice
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full h-10 gap-2"
                          onClick={() => handlePrintView(currentEdit)}
                        >
                          <Printer className="h-4 w-4" />
                          Preview Printable Format
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            VIEW 3: FORMAL PRINTABLE TAX INVOICE
            ========================================================= */}
        {mode === "print" && currentEdit && (
          <div className="space-y-6 animate-fade-in">
            {/* Screen Controls (Hidden on Print) */}
            <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-border print:hidden shadow-sm">
              <Button variant="ghost" onClick={() => setMode("edit")} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Edit
              </Button>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    saveInvoice(currentEdit);
                    toast.success("Saved to invoice records");
                  }}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Save Record
                </Button>
                <Button
                  variant="accent"
                  onClick={() => window.print()}
                  className="gap-2 shadow-glow"
                >
                  <Printer className="h-4 w-4" />
                  Print / Save PDF
                </Button>
              </div>
            </div>

            {/* Actual Printable Invoice Container */}
            {(() => {
              const totals = calculateInvoiceTotals(currentEdit);
              return (
                <div
                  id="tax-invoice-printable"
                  className="bg-white text-black p-8 rounded-xl shadow-2xl border border-gray-300 max-w-4xl mx-auto print:shadow-none print:border-none print:p-0 print:m-0 print:w-full print:max-w-none print:text-xs"
                >
                  {/* Top Header */}
                  <div className="border-b-2 border-black pb-4 mb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h1 className="text-2xl font-bold tracking-wide uppercase text-black">
                          {currentEdit.seller.name}
                        </h1>
                        <p className="text-xs text-gray-700 max-w-md mt-1 leading-relaxed">
                          {currentEdit.seller.address}, {currentEdit.seller.state}
                        </p>
                        <p className="text-xs text-gray-700 mt-0.5">
                          GSTIN: <span className="font-mono font-bold text-black">{currentEdit.seller.gstin}</span> • Phone: {currentEdit.seller.phone}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="inline-block bg-black text-white font-bold text-xs uppercase px-3 py-1 rounded">
                          TAX INVOICE
                        </div>
                        <p className="text-[10px] text-gray-600 uppercase mt-1">
                          Original for Recipient
                        </p>
                        <p className="text-xs font-mono font-bold mt-2">
                          Inv No: {currentEdit.invoiceNo}
                        </p>
                        <p className="text-xs text-gray-700">Date: {currentEdit.invoiceDate}</p>
                      </div>
                    </div>
                  </div>

                  {/* Invoice Details Grid */}
                  <div className="grid grid-cols-2 border border-black text-xs mb-4">
                    {/* Billed To */}
                    <div className="p-3 border-r border-black">
                      <div className="font-bold uppercase text-[11px] text-gray-800 border-b border-gray-300 pb-1 mb-1.5">
                        Details of Receiver (Billed to):
                      </div>
                      <p className="font-bold text-sm text-black">{currentEdit.buyer.name}</p>
                      <p className="text-gray-700 mt-1">{currentEdit.buyer.address}</p>
                      <p className="text-gray-700">State: {currentEdit.buyer.state}</p>
                      <p className="font-mono font-bold mt-1">GSTIN: {currentEdit.buyer.gstin || "URP (Unregistered)"}</p>
                    </div>

                    {/* Delivery / Shipping details */}
                    <div className="p-3 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Place of Supply:</span>
                        <span className="font-semibold">{currentEdit.placeOfSupply}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Due Date:</span>
                        <span className="font-semibold">{currentEdit.dueDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reverse Charge:</span>
                        <span className="font-semibold">NO</span>
                      </div>
                      {currentEdit.eway.required && (
                        <>
                          <div className="flex justify-between border-t border-gray-200 pt-1">
                            <span className="text-gray-600">E-Way Bill No:</span>
                            <span className="font-mono font-bold">{currentEdit.eway.ewayBillNo || "Generated"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Vehicle No:</span>
                            <span className="font-mono font-semibold">{currentEdit.eway.vehicleNo}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Transporter:</span>
                            <span>{currentEdit.eway.transporterName}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Items Table */}
                  <table className="w-full border-collapse border border-black text-xs mb-4">
                    <thead>
                      <tr className="bg-gray-100 border-b border-black text-center font-bold">
                        <th className="border-r border-black p-2 w-8">#</th>
                        <th className="border-r border-black p-2 text-left">Description of Goods</th>
                        <th className="border-r border-black p-2 w-16">HSN</th>
                        <th className="border-r border-black p-2 w-16">Qty</th>
                        <th className="border-r border-black p-2 w-12">Unit</th>
                        <th className="border-r border-black p-2 w-20">Rate (₹)</th>
                        <th className="border-r border-black p-2 w-16">Disc</th>
                        <th className="border-r border-black p-2 w-24">Taxable (₹)</th>
                        <th className="p-2 w-24">GST (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentEdit.items.map((item, idx) => {
                        const lineTaxable = Math.max(item.quantity * item.rate - item.discount, 0);
                        const lineTax = (lineTaxable * item.taxRate) / 100;
                        return (
                          <tr key={item.id} className="border-b border-gray-300">
                            <td className="border-r border-black p-2 text-center">{idx + 1}</td>
                            <td className="border-r border-black p-2 font-medium">{item.description}</td>
                            <td className="border-r border-black p-2 text-center font-mono">{item.hsn}</td>
                            <td className="border-r border-black p-2 text-right">{item.quantity.toLocaleString("en-IN")}</td>
                            <td className="border-r border-black p-2 text-center">{item.unit}</td>
                            <td className="border-r border-black p-2 text-right font-mono">{item.rate.toFixed(2)}</td>
                            <td className="border-r border-black p-2 text-right font-mono">{item.discount.toFixed(2)}</td>
                            <td className="border-r border-black p-2 text-right font-mono font-semibold">{lineTaxable.toFixed(2)}</td>
                            <td className="p-2 text-right font-mono">{lineTax.toFixed(2)} <span className="text-[10px] text-gray-500">({item.taxRate}%)</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Calculations & Tax Breakdown */}
                  <div className="grid grid-cols-2 border border-black text-xs mb-4">
                    {/* Amount In Words & Bank Details */}
                    <div className="p-3 border-r border-black space-y-3">
                      <div>
                        <span className="font-bold text-gray-700">Total In Words:</span>
                        <p className="font-semibold text-black mt-0.5">{numberToWordsINR(totals.grandTotal)}</p>
                      </div>
                      <div className="border-t border-gray-300 pt-2 text-[11px]">
                        <span className="font-bold text-gray-700">Terms & Conditions:</span>
                        <p className="text-gray-600 whitespace-pre-line mt-0.5">{currentEdit.notes}</p>
                      </div>
                    </div>

                    {/* Totals Breakdown */}
                    <div className="p-3 space-y-1.5 font-mono">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-sans">Total Taxable Value:</span>
                        <span className="font-semibold">{totals.taxableValue.toFixed(2)}</span>
                      </div>
                      {!currentEdit.interState ? (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-sans">CGST (Central Tax):</span>
                            <span>{totals.cgst.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 font-sans">SGST (State Tax):</span>
                            <span>{totals.sgst.toFixed(2)}</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-sans">IGST (Integrated Tax):</span>
                          <span>{totals.igst.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-gray-300 pt-1 font-bold">
                        <span className="font-sans">Total Tax Amount:</span>
                        <span>{totals.totalTax.toFixed(2)}</span>
                      </div>
                      {currentEdit.roundOff && (
                        <div className="flex justify-between text-[11px] text-gray-500">
                          <span className="font-sans">Round Off:</span>
                          <span>{totals.roundOffValue.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t-2 border-black pt-1.5 text-sm font-bold text-black">
                        <span className="font-sans">Grand Total:</span>
                        <span>₹{totals.grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Signatures */}
                  <div className="grid grid-cols-2 pt-6 text-xs">
                    <div>
                      <p className="text-[11px] text-gray-500">Customer Signature / Stamp</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">For {currentEdit.seller.name}</p>
                      <div className="h-14"></div>
                      <p className="text-[11px] text-gray-600 border-t border-gray-400 inline-block pt-1">
                        Authorized Signatory
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* =========================================================
            MODAL: SELLER / BUSINESS PROFILE CONFIGURATION
            ========================================================= */}
        <Dialog open={sellerModalOpen} onOpenChange={setSellerModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-accent" />
                Default Business Profile
              </DialogTitle>
              <DialogDescription>
                Configure your manufacturing firm details once. They will automatically prefill all new tax invoices.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="space-y-1">
                <Label className="text-xs">Firm / Company Name</Label>
                <Input
                  value={sellerForm.name}
                  onChange={(e) => setSellerForm({ ...sellerForm, name: e.target.value })}
                  placeholder="Apex Poly & Paper Packagers LLP"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">GSTIN Number</Label>
                <Input
                  value={sellerForm.gstin}
                  onChange={(e) => setSellerForm({ ...sellerForm, gstin: e.target.value.toUpperCase() })}
                  placeholder="27AABCA1234F1Z5"
                  className="h-9 font-mono text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Registered Factory / Office Address</Label>
                <Input
                  value={sellerForm.address}
                  onChange={(e) => setSellerForm({ ...sellerForm, address: e.target.value })}
                  placeholder="Plot 42, MIDC Industrial Area"
                  className="h-9 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">State</Label>
                  <Input
                    value={sellerForm.state}
                    onChange={(e) => setSellerForm({ ...sellerForm, state: e.target.value })}
                    placeholder="Maharashtra"
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Contact Phone</Label>
                  <Input
                    value={sellerForm.phone}
                    onChange={(e) => setSellerForm({ ...sellerForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="h-9 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Email</Label>
                <Input
                  value={sellerForm.email}
                  onChange={(e) => setSellerForm({ ...sellerForm, email: e.target.value })}
                  placeholder="accounts@apexpackagers.com"
                  className="h-9 text-sm"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSellerModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="accent" onClick={handleSaveSellerProfile}>
                Save Profile
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
