import { useState, useCallback } from 'react';
import { 
  CalculatorState, 
  CalculationResult, 
  BagDimensions, 
  MaterialCosts, 
  MachineCosts, 
  LaborCosts,
  GranuleCosts,
  BagType,
  ProductCategory,
  PaperBagSpecs,
  PaperType,
  PAPER_TYPE_CONFIG,
  MATERIAL_DENSITIES,
  BAG_TYPE_CONFIG
} from '@/types/calculator';

const initialDimensions: BagDimensions = {
  length: 0,
  width: 0,
  gusset: 0,
  gussetType: 'none',
  thickness: 50, // default 50 microns
};

const initialMaterials: MaterialCosts = {
  fabricRate: 0,
  fabricGSM: 0,
  laminationRequired: false,
  laminationRate: 0,
  laminationGSM: 0,
  linerRequired: false,
  linerRate: 0,
  linerGSM: 0,
};

const initialMachines: MachineCosts = {
  cuttingType: 'auto',
  stitchingType: 'auto',
  printingRequired: false,
  printingType: 'bag-to-bag',
  printColors: 1,
  inkCoverage: 30,
  electricityRate: 0,
  extrusionRequired: false,
  blowingRatio: 2.5,
};

const initialLabor: LaborCosts = {
  cuttingLabor: 0,
  stitchingLabor: 0,
  printingLabor: 0,
  topHemmingLabor: 0,
  packingLabor: 0,
  extrusionLabor: 0,
};

const initialGranules: GranuleCosts = {
  granuleRate: 0,
  granuleType: 'virgin',
  masterbatchRate: 0,
  masterbatchPercentage: 2,
  fillerRate: 0,
  fillerPercentage: 0,
};

const initialPaper: PaperBagSpecs = {
  paperType: 'kraft',
  gsm: 90,
  length: 0,
  width: 0,
  gussetRequired: false,
  gusset: 0,
  gussetRate: 0,
  paperRate: 0,
  wastagePercentage: 5,
  handleRequired: false,
  handleType: 'none',
  handleRate: 0,
  printingRequired: false,
  printingRate: 0,
  printColors: 1,
  laminationRequired: false,
  laminationRate: 0,
  glueRate: 0,
  laborRate: 0,
  electricityRate: 0,
  powerLoad: 8,
  bagsPerHour: 3000,
};

const initialState: CalculatorState = {
  step: 1,
  productCategory: 'plastic',
  paper: initialPaper,
  bagType: 'pp',
  dimensions: initialDimensions,
  materials: initialMaterials,
  machines: initialMachines,
  labor: initialLabor,
  granules: initialGranules,
  quantity: 1000,
};

export function useCalculator() {
  const [state, setState] = useState<CalculatorState>(initialState);
  const [history, setHistory] = useState<CalculationResult[]>(() => {
    const saved = localStorage.getItem('bagcost-history');
    return saved ? JSON.parse(saved) : [];
  });

  const setStep = useCallback((step: number) => {
    setState((prev) => ({ ...prev, step }));
  }, []);

  const setBagType = useCallback((bagType: BagType) => {
    const config = BAG_TYPE_CONFIG[bagType];
    setState((prev) => ({ 
      ...prev, 
      bagType,
      dimensions: {
        ...prev.dimensions,
        thickness: config.defaultThickness,
      },
      materials: {
        ...prev.materials,
        fabricGSM: config.defaultGSM,
      },
      machines: {
        ...prev.machines,
        extrusionRequired: !config.isWoven,
      }
    }));
  }, []);

  const setDimensions = useCallback((dimensions: BagDimensions) => {
    setState((prev) => ({ ...prev, dimensions }));
  }, []);

  const setMaterials = useCallback((materials: MaterialCosts) => {
    setState((prev) => ({ ...prev, materials }));
  }, []);

  const setMachines = useCallback((machines: MachineCosts) => {
    setState((prev) => ({ ...prev, machines }));
  }, []);

  const setLabor = useCallback((labor: LaborCosts) => {
    setState((prev) => ({ ...prev, labor }));
  }, []);

  const setGranules = useCallback((granules: GranuleCosts) => {
    setState((prev) => ({ ...prev, granules }));
  }, []);

  const setProductCategory = useCallback((productCategory: ProductCategory) => {
    setState((prev) => ({ ...prev, productCategory }));
  }, []);

  const setPaper = useCallback((paper: PaperBagSpecs) => {
    setState((prev) => ({ ...prev, paper }));
  }, []);

  const setPaperType = useCallback((paperType: PaperType) => {
    setState((prev) => ({
      ...prev,
      paper: { ...prev.paper, paperType, gsm: PAPER_TYPE_CONFIG[paperType].defaultGSM },
    }));
  }, []);

  const loadState = useCallback((next: CalculatorState) => {
    setState({ ...next });
  }, []);

  const setQuantity = useCallback((quantity: number) => {
    setState((prev) => ({ ...prev, quantity }));
  }, []);

  /**
   * Calculate bag weight using industry-standard formulas
   * - Woven bags: GSM-based (Weight = Area × GSM / 1000)
   * - Poly bags: Gauge/thickness-based (Weight = L × W × Gauge / constant)
   */
  const calculateBagWeight = useCallback((
    dimensions: BagDimensions, 
    bagType: BagType,
    gsm: number
  ): number => {
    const config = BAG_TYPE_CONFIG[bagType];
    const density = MATERIAL_DENSITIES[bagType];
    
    const lengthCm = dimensions.length;
    const widthCm = dimensions.width;
    const gussetCm = dimensions.gusset;
    const thicknessMicrons = dimensions.thickness;

    if (config.isWoven) {
      // Woven bag weight formula: Area (sq.m) × GSM / 1000 = kg
      // Convert cm to meters for area calculation
      const lengthM = lengthCm / 100;
      const widthM = widthCm / 100;
      const gussetM = gussetCm / 100;
      
      let bagArea = lengthM * widthM * 2; // Both sides
      if (dimensions.gussetType !== 'none') {
        bagArea += lengthM * gussetM * 2;
      }
      
      const weightKg = bagArea * gsm / 1000;
      return weightKg * 1000; // Return in grams
    } else {
      // Poly bag weight formula: (Width" × Length" × Gauge) / 3300 = lbs per 1000 bags
      // Convert to metric: Weight (g) = Width(cm) × Length(cm) × 2 × Thickness(µm) × Density(g/cm³) / 10000
      let effectiveWidth = widthCm;
      if (dimensions.gussetType !== 'none') {
        effectiveWidth = widthCm + gussetCm;
      }
      
      // Weight in grams = L × W × 2 × thickness(µm) × density / 10000
      const weightGrams = (lengthCm * effectiveWidth * 2 * thicknessMicrons * density) / 10000;
      return weightGrams;
    }
  }, []);

  /**
   * Paper bag costing (industry method)
   * Sheet area (m²) = ((2×W + 2×G + flap) / 100) × ((L + bottom) / 100)
   * Paper weight (g) = area × GSM ; cost = weight/1000 × rate × (1 + wastage%)
   */
  const calculatePaperCost = useCallback((): CalculationResult => {
    const p = state.paper;
    const quantity = state.quantity;

    const gusset = p.gussetRequired ? p.gusset : 0;
    const flapCm = 3;    // side pasting flap
    const bottomCm = 5;  // bottom fold allowance

    const sheetWidthM = (2 * p.width + 2 * gusset + flapCm) / 100;
    const sheetLengthM = (p.length + bottomCm) / 100;
    const areaSqM = sheetWidthM * sheetLengthM;

    const bagWeight = areaSqM * p.gsm; // grams per bag
    const bagWeightKg = bagWeight / 1000;

    // Raw material (paper) cost including wastage
    let materialCost = bagWeightKg * p.paperRate * (1 + p.wastagePercentage / 100);

    if (p.handleRequired) materialCost += p.handleRate;
    if (p.laminationRequired) materialCost += p.laminationRate;
    if (p.gussetRequired) materialCost += p.gussetRate;
    materialCost += p.glueRate / 1000;

    // Printing cost (rate per 1000 bags × colors)
    const printingCost = p.printingRequired
      ? (p.printingRate * Math.max(p.printColors, 1)) / 1000
      : 0;

    // Electricity: power load × hours per bag × rate
    const hoursPerBag = p.bagsPerHour > 0 ? 1 / p.bagsPerHour : 0;
    const machineCost = p.powerLoad * hoursPerBag * p.electricityRate;

    // Labour per 1000 bags
    const laborCost = p.laborRate / 1000;

    const costPerBag = materialCost + printingCost + machineCost + laborCost;

    return {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      productCategory: 'paper',
      paperType: p.paperType,
      bagType: 'pp',
      dimensions: {
        length: p.length,
        width: p.width,
        gusset,
        gussetType: p.gussetRequired ? 'straight' : 'none',
        thickness: 0,
      },
      materialCost: (materialCost + printingCost) * quantity,
      machineCost: machineCost * quantity,
      laborCost: laborCost * quantity,
      totalCost: costPerBag * quantity,
      costPerBag,
      quantity,
      bagWeight,
      snapshot: state,
    };
  }, [state]);

  const calculatePlasticCost = useCallback((): CalculationResult => {
    const { dimensions, materials, machines, labor, granules, quantity, bagType } = state;
    const config = BAG_TYPE_CONFIG[bagType];

    // Calculate bag weight
    const bagWeight = calculateBagWeight(dimensions, bagType, materials.fabricGSM);
    const bagWeightKg = bagWeight / 1000;

    let materialCost = 0;
    let granuleCost = 0;

    if (config.isWoven) {
      // Woven bag: use fabric rate and GSM
      materialCost = bagWeightKg * materials.fabricRate;
    } else {
      // Poly bag: use granule costs
      const baseGranuleWeight = bagWeightKg * (100 - granules.masterbatchPercentage - granules.fillerPercentage) / 100;
      const masterbatchWeight = bagWeightKg * granules.masterbatchPercentage / 100;
      const fillerWeight = bagWeightKg * granules.fillerPercentage / 100;

      // Granule quality factor
      const qualityFactor = granules.granuleType === 'virgin' ? 1 : 
                           granules.granuleType === 'recycled' ? 0.7 : 0.85;

      granuleCost = (baseGranuleWeight * granules.granuleRate * qualityFactor) +
                   (masterbatchWeight * granules.masterbatchRate) +
                   (fillerWeight * granules.fillerRate);
      
      materialCost = granuleCost;
    }

    // Lamination cost (for both woven and poly if required)
    if (materials.laminationRequired) {
      const lengthM = dimensions.length / 100;
      const widthM = dimensions.width / 100;
      const gussetM = dimensions.gusset / 100;
      
      let laminationArea = lengthM * widthM * 2;
      if (dimensions.gussetType !== 'none') {
        laminationArea += lengthM * gussetM * 2;
      }
      
      const laminationWeight = laminationArea * materials.laminationGSM / 1000;
      materialCost += laminationWeight * materials.laminationRate;
    }

    // Liner cost
    if (materials.linerRequired) {
      const lengthM = dimensions.length / 100;
      const widthM = dimensions.width / 100;
      const linerArea = lengthM * widthM * 2;
      const linerWeight = linerArea * materials.linerGSM / 1000;
      materialCost += linerWeight * materials.linerRate;
    }

    // Machine cost (electricity consumption)
    let totalPower = 0;
    
    // Extrusion power (for poly bags)
    if (machines.extrusionRequired || !config.isWoven) {
      totalPower += 15; // kW for extrusion
    }

    // Cutting power
    totalPower += machines.cuttingType === 'auto' ? 5 : 1;
    
    // Stitching power (only for woven)
    if (config.isWoven) {
      totalPower += machines.stitchingType === 'auto' ? 3 : 0.5;
    }
    
    // Printing power with ink coverage factor
    if (machines.printingRequired) {
      let printPower = 0;
      switch (machines.printingType) {
        case 'rotogravure':
          printPower = 12;
          break;
        case 'flexo':
          printPower = 8;
          break;
        case 'roll-to-roll':
          printPower = 6;
          break;
        case 'bag-to-bag':
          printPower = 4;
          break;
      }
      totalPower += printPower * machines.printColors * (machines.inkCoverage / 100);
    }
    
    const hoursPerBag = 0.001;
    const machineCost = totalPower * hoursPerBag * machines.electricityRate;

    // Labor cost (per bag from per 1000 rate)
    let laborTotal = labor.cuttingLabor + labor.packingLabor;
    
    if (config.isWoven) {
      laborTotal += labor.stitchingLabor + labor.topHemmingLabor;
    } else {
      laborTotal += labor.extrusionLabor;
    }
    
    if (machines.printingRequired) {
      laborTotal += labor.printingLabor;
    }
    
    const laborCost = laborTotal / 1000;

    const costPerBag = materialCost + machineCost + laborCost;
    const totalCost = costPerBag * quantity;

    return {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      bagType,
      dimensions,
      materialCost: materialCost * quantity,
      machineCost: machineCost * quantity,
      laborCost: laborCost * quantity,
      totalCost,
      costPerBag,
      quantity,
      bagWeight,
      granuleCost: granuleCost * quantity,
      productCategory: 'plastic',
      snapshot: state,
    };
  }, [state, calculateBagWeight]);

  const calculateCost = useCallback((): CalculationResult => {
    return state.productCategory === 'paper' ? calculatePaperCost() : calculatePlasticCost();
  }, [state.productCategory, calculatePaperCost, calculatePlasticCost]);

  const saveResult = useCallback((result: CalculationResult) => {
    const newHistory = [result, ...history].slice(0, 50);
    setHistory(newHistory);
    localStorage.setItem('bagcost-history', JSON.stringify(newHistory));
  }, [history]);

  const updateResult = useCallback((id: string, updates: Partial<CalculationResult>) => {
    const newHistory = history.map((h) => (h.id === id ? { ...h, ...updates } : h));
    setHistory(newHistory);
    localStorage.setItem('bagcost-history', JSON.stringify(newHistory));
  }, [history]);

  const deleteResult = useCallback((id: string) => {
    const newHistory = history.filter((h) => h.id !== id);
    setHistory(newHistory);
    localStorage.setItem('bagcost-history', JSON.stringify(newHistory));
  }, [history]);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('bagcost-history');
  }, []);

  return {
    state,
    history,
    setStep,
    setProductCategory,
    setPaper,
    setPaperType,
    loadState,
    setBagType,
    setDimensions,
    setMaterials,
    setMachines,
    setLabor,
    setGranules,
    setQuantity,
    calculateCost,
    saveResult,
    updateResult,
    deleteResult,
    reset,
    clearHistory,
  };
}
