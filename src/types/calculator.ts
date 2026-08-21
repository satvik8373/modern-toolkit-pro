export interface BagDimensions {
  length: number;
  width: number;
  gusset: number;
  gussetType: 'none' | 'twist' | 'straight';
  thickness: number; // microns/gauge for poly bags
}

export type BagType = 'pp' | 'hdpe' | 'ldpe' | 'lldpe' | 'bopp' | 'hm' | 'ld';

export interface GranuleCosts {
  granuleRate: number; // ₹ per kg
  granuleType: 'virgin' | 'recycled' | 'mixed';
  masterbatchRate: number; // ₹ per kg
  masterbatchPercentage: number; // % of total weight
  fillerRate: number; // ₹ per kg (calcium carbonate etc)
  fillerPercentage: number; // % of total weight
}

export interface MaterialCosts {
  fabricRate: number;
  fabricGSM: number;
  laminationRequired: boolean;
  laminationRate: number;
  laminationGSM: number;
  linerRequired: boolean;
  linerRate: number;
  linerGSM: number;
}

export interface MachineCosts {
  cuttingType: 'auto' | 'manual';
  stitchingType: 'auto' | 'manual';
  printingRequired: boolean;
  printingType: 'bag-to-bag' | 'roll-to-roll' | 'flexo' | 'rotogravure';
  printColors: number;
  inkCoverage: number; // % ink coverage
  electricityRate: number;
  extrusionRequired: boolean; // for poly bags
  blowingRatio: number; // blow up ratio for film extrusion
}

export interface LaborCosts {
  cuttingLabor: number;
  stitchingLabor: number;
  printingLabor: number;
  topHemmingLabor: number;
  packingLabor: number;
  extrusionLabor: number;
}

export interface CalculationResult {
  id: string;
  timestamp: Date;
  bagType: BagType;
  dimensions: BagDimensions;
  materialCost: number;
  machineCost: number;
  laborCost: number;
  totalCost: number;
  costPerBag: number;
  quantity: number;
  bagWeight: number; // grams per bag
  granuleCost?: number;
}

export interface CalculatorState {
  step: number;
  bagType: BagType;
  dimensions: BagDimensions;
  materials: MaterialCosts;
  machines: MachineCosts;
  labor: LaborCosts;
  granules: GranuleCosts;
  quantity: number;
}

// Material densities in g/cm³ (industry standard)
export const MATERIAL_DENSITIES: Record<BagType, number> = {
  pp: 0.91,      // Polypropylene
  hdpe: 0.95,    // High-Density Polyethylene
  ldpe: 0.92,    // Low-Density Polyethylene
  lldpe: 0.92,   // Linear Low-Density Polyethylene
  bopp: 0.90,    // Biaxially Oriented Polypropylene
  hm: 0.95,      // HM (HDPE/LDPE blend)
  ld: 0.92,      // LD (Low Density)
};

// Bag type configurations
export const BAG_TYPE_CONFIG: Record<BagType, {
  name: string;
  description: string;
  features: string[];
  isWoven: boolean;
  defaultGSM: number;
  defaultThickness: number; // microns
}> = {
  pp: {
    name: 'PP Woven Bags',
    description: 'Polypropylene woven bags for versatile applications',
    features: ['High tensile strength', 'UV resistant', 'Lightweight'],
    isWoven: true,
    defaultGSM: 60,
    defaultThickness: 0,
  },
  hdpe: {
    name: 'HDPE Woven Bags',
    description: 'High-density polyethylene for heavy-duty use',
    features: ['Chemical resistant', 'Moisture barrier', 'Durable'],
    isWoven: true,
    defaultGSM: 70,
    defaultThickness: 0,
  },
  ldpe: {
    name: 'LDPE Poly Bags',
    description: 'Low-density polyethylene for flexible packaging',
    features: ['Flexible', 'Transparent', 'Seal-friendly'],
    isWoven: false,
    defaultGSM: 0,
    defaultThickness: 50,
  },
  lldpe: {
    name: 'LLDPE Poly Bags',
    description: 'Linear LDPE for enhanced stretch and puncture resistance',
    features: ['Stretchable', 'Puncture resistant', 'Cost-effective'],
    isWoven: false,
    defaultGSM: 0,
    defaultThickness: 40,
  },
  bopp: {
    name: 'BOPP Bags',
    description: 'Biaxially oriented PP for premium printing',
    features: ['Crystal clear', 'High gloss', 'Excellent printability'],
    isWoven: false,
    defaultGSM: 0,
    defaultThickness: 25,
  },
  hm: {
    name: 'HM Poly Bags',
    description: 'HDPE/LDPE blend for milk pouches and general use',
    features: ['Food grade', 'Good seal strength', 'Economical'],
    isWoven: false,
    defaultGSM: 0,
    defaultThickness: 60,
  },
  ld: {
    name: 'LD Carry Bags',
    description: 'Low density bags for retail and shopping',
    features: ['Soft feel', 'Easy to carry', 'Printable'],
    isWoven: false,
    defaultGSM: 0,
    defaultThickness: 30,
  },
};

/* ==========================================================
   PRODUCT CATEGORIES (Phase 1 selection: Plastic or Paper)
   ========================================================== */

export type ProductCategory = 'plastic' | 'paper';

export type PaperType = 'kraft' | 'virgin-white' | 'duplex' | 'art' | 'recycled';

export interface PaperBagSpecs {
  paperType: PaperType;
  gsm: number;                 // paper grammage
  length: number;              // cm
  width: number;               // cm
  gussetRequired: boolean;     // yes / no
  gusset: number;              // cm (side gusset)
  gussetRate: number;          // ₹ extra per bag for gusset forming
  paperRate: number;           // ₹ per kg (raw material rate)
  wastagePercentage: number;   // % wastage
  handleRequired: boolean;
  handleType: 'none' | 'flat-paper' | 'twisted-paper' | 'rope' | 'die-cut';
  handleRate: number;          // ₹ per bag (pair)
  printingRequired: boolean;
  printingRate: number;        // ₹ per 1000 bags
  printColors: number;
  laminationRequired: boolean;
  laminationRate: number;      // ₹ per bag
  glueRate: number;            // ₹ per 1000 bags (pasting / gum)
  laborRate: number;           // ₹ per 1000 bags
  electricityRate: number;     // ₹ per unit (kWh)
  powerLoad: number;           // kW total machine load
  bagsPerHour: number;         // machine output
}

export const PAPER_TYPE_CONFIG: Record<PaperType, {
  name: string;
  description: string;
  features: string[];
  defaultGSM: number;
}> = {
  kraft: {
    name: 'Kraft Paper',
    description: 'Natural brown kraft for grocery & food bags',
    features: ['High strength', 'Eco friendly', 'Economical'],
    defaultGSM: 90,
  },
  'virgin-white': {
    name: 'Virgin White Paper',
    description: 'Bleached virgin paper for premium retail bags',
    features: ['Bright white', 'Food grade', 'Premium look'],
    defaultGSM: 100,
  },
  duplex: {
    name: 'Duplex Board',
    description: 'Coated board for rigid carry & shopping bags',
    features: ['Stiff body', 'Coated surface', 'Great printing'],
    defaultGSM: 250,
  },
  art: {
    name: 'Art Paper',
    description: 'Glossy coated paper for branded bags',
    features: ['High gloss', 'Sharp print', 'Lamination ready'],
    defaultGSM: 130,
  },
  recycled: {
    name: 'Recycled Paper',
    description: 'Recycled fibre paper for low-cost bags',
    features: ['Lowest cost', 'Sustainable', 'Matte finish'],
    defaultGSM: 80,
  },
};

/* ==========================================================
   TAX INVOICE / E-WAY BILL
   ========================================================== */

export interface InvoiceItem {
  id: string;
  description: string;
  hsn: string;
  quantity: number;
  unit: string;
  rate: number;      // ₹ per unit
  discount: number;  // ₹
  taxRate: number;   // GST %
}

export interface InvoiceParty {
  name: string;
  gstin: string;
  address: string;
  state: string;
  phone: string;
  email: string;
}

export interface EwayBillDetails {
  required: boolean;
  ewayBillNo: string;
  transporterName: string;
  transporterId: string;
  transportMode: 'road' | 'rail' | 'air' | 'ship';
  vehicleNo: string;
  vehicleType: 'regular' | 'over-dimensional';
  distanceKm: number;
  docType: 'tax-invoice' | 'bill-of-supply' | 'delivery-challan';
  supplyType: 'outward' | 'inward';
  subSupplyType: string;
  dispatchFrom: string;
  shipTo: string;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  invoiceDate: string;
  dueDate: string;
  placeOfSupply: string;
  interState: boolean;
  seller: InvoiceParty;
  buyer: InvoiceParty;
  items: InvoiceItem[];
  eway: EwayBillDetails;
  notes: string;
  roundOff: boolean;
  status: 'draft' | 'issued' | 'paid' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceTotals {
  taxableValue: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  grandTotal: number;
  roundOffValue: number;
}

export function calculateInvoiceTotals(invoice: Invoice): InvoiceTotals {
  let taxableValue = 0;
  let totalTax = 0;

  invoice.items.forEach((item) => {
    const line = Math.max(item.quantity * item.rate - item.discount, 0);
    taxableValue += line;
    totalTax += (line * item.taxRate) / 100;
  });

  const cgst = invoice.interState ? 0 : totalTax / 2;
  const sgst = invoice.interState ? 0 : totalTax / 2;
  const igst = invoice.interState ? totalTax : 0;

  const raw = taxableValue + totalTax;
  const grandTotal = invoice.roundOff ? Math.round(raw) : raw;

  return {
    taxableValue,
    cgst,
    sgst,
    igst,
    totalTax,
    grandTotal,
    roundOffValue: grandTotal - raw,
  };
}
