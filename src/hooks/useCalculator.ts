import { useState, useCallback } from 'react';
import { CalculatorState, CalculationResult, BagDimensions, MaterialCosts, MachineCosts, LaborCosts } from '@/types/calculator';

const initialDimensions: BagDimensions = {
  length: 0,
  width: 0,
  gusset: 0,
  gussetType: 'none',
};

const initialMaterials: MaterialCosts = {
  fabricRate: 0,
  fabricGSM: 0,
  granuleRequired: false,
  granuleRate: 0,
  granulePercentage: 0,
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
  electricityRate: 0,
};

const initialLabor: LaborCosts = {
  cuttingLabor: 0,
  stitchingLabor: 0,
  printingLabor: 0,
  topHemmingLabor: 0,
  packingLabor: 0,
};

const initialState: CalculatorState = {
  step: 1,
  bagType: 'pp',
  dimensions: initialDimensions,
  materials: initialMaterials,
  machines: initialMachines,
  labor: initialLabor,
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

  const setBagType = useCallback((bagType: 'pp' | 'hdpe') => {
    setState((prev) => ({ ...prev, bagType }));
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

  const setQuantity = useCallback((quantity: number) => {
    setState((prev) => ({ ...prev, quantity }));
  }, []);

  const calculateCost = useCallback((): CalculationResult => {
    const { dimensions, materials, machines, labor, quantity, bagType } = state;

    // Calculate bag area in square meters
    const length = dimensions.length / 100;
    const width = dimensions.width / 100;
    const gusset = dimensions.gusset / 100;
    
    let bagArea = length * width * 2; // Both sides
    if (dimensions.gussetType !== 'none') {
      bagArea += length * gusset * 2; // Gusset area
    }

    // Material cost calculation
    const fabricWeight = bagArea * materials.fabricGSM / 1000; // kg per bag
    let materialCost = fabricWeight * materials.fabricRate;

    // Plastic granule cost (based on percentage of fabric weight)
    if (materials.granuleRequired && materials.granulePercentage > 0) {
      const granuleWeight = fabricWeight * (materials.granulePercentage / 100);
      materialCost += granuleWeight * materials.granuleRate;
    }

    if (materials.laminationRequired) {
      const laminationWeight = bagArea * materials.laminationGSM / 1000;
      materialCost += laminationWeight * materials.laminationRate;
    }

    if (materials.linerRequired) {
      const linerWeight = bagArea * materials.linerGSM / 1000;
      materialCost += linerWeight * materials.linerRate;
    }

    // Machine cost (electricity consumption)
    const cuttingPower = machines.cuttingType === 'auto' ? 5 : 1; // kW
    const stitchingPower = machines.stitchingType === 'auto' ? 3 : 0.5; // kW
    const printingPower = machines.printingRequired ? (machines.printingType === 'roll-to-roll' ? 8 : 4) * machines.printColors : 0;
    
    const totalPower = cuttingPower + stitchingPower + printingPower;
    const hoursPerBag = 0.001; // Estimated
    const machineCost = totalPower * hoursPerBag * machines.electricityRate;

    // Labor cost (per bag from per 1000 rate)
    const laborCost = (
      labor.cuttingLabor +
      labor.stitchingLabor +
      (machines.printingRequired ? labor.printingLabor : 0) +
      labor.topHemmingLabor +
      labor.packingLabor
    ) / 1000;

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
    };
  }, [state]);

  const saveResult = useCallback((result: CalculationResult) => {
    const newHistory = [result, ...history].slice(0, 50); // Keep last 50
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
    setBagType,
    setDimensions,
    setMaterials,
    setMachines,
    setLabor,
    setQuantity,
    calculateCost,
    saveResult,
    reset,
    clearHistory,
  };
}
