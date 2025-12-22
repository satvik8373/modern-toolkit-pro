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
