export interface BagDimensions {
  length: number;
  width: number;
  gusset: number;
  gussetType: 'none' | 'twist' | 'straight';
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
  printingType: 'bag-to-bag' | 'roll-to-roll';
  printColors: number;
  electricityRate: number;
}

export interface LaborCosts {
  cuttingLabor: number;
  stitchingLabor: number;
  printingLabor: number;
  topHemmingLabor: number;
  packingLabor: number;
}

export interface CalculationResult {
  id: string;
  timestamp: Date;
  bagType: string;
  dimensions: BagDimensions;
  materialCost: number;
  machineCost: number;
  laborCost: number;
  totalCost: number;
  costPerBag: number;
  quantity: number;
}

export interface CalculatorState {
  step: number;
  bagType: 'pp' | 'hdpe';
  dimensions: BagDimensions;
  materials: MaterialCosts;
  machines: MachineCosts;
  labor: LaborCosts;
  quantity: number;
}
