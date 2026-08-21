import { useState, useCallback, useEffect } from 'react';
import {
  Invoice,
  InvoiceItem,
  InvoiceParty,
  CalculationResult,
  BAG_TYPE_CONFIG,
  PAPER_TYPE_CONFIG,
} from '@/types/calculator';

const DEFAULT_SELLER: InvoiceParty = {
  name: 'Apex Poly & Paper Packagers LLP',
  gstin: '27AABCA1234F1Z5',
  address: 'Plot No. 42, Sector 8, Industrial Area, MIDC, Rabale',
  state: 'Maharashtra',
  phone: '+91 98765 43210',
  email: 'accounts@apexpackagers.com',
};

const DEFAULT_BUYER: InvoiceParty = {
  name: 'Sunrise Agro & Retail Ventures Pvt Ltd',
  gstin: '27AAACS9876Q1ZB',
  address: 'Shop 101, APMC Market Yard, Phase II, Vashi',
  state: 'Maharashtra',
  phone: '+91 91234 56780',
  email: 'procurement@sunriseagro.in',
};

const sampleInvoice: Invoice = {
  id: 'sample-inv-101',
  invoiceNo: 'INV-2026-0042',
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  placeOfSupply: 'Maharashtra (27)',
  interState: false,
  seller: DEFAULT_SELLER,
  buyer: DEFAULT_BUYER,
  items: [
    {
      id: 'item-1',
      description: 'PP Woven Sacks - 60 GSM (60 × 90 cm) White Plain',
      hsn: '6305',
      quantity: 5000,
      unit: 'BAGS',
      rate: 12.45,
      discount: 0,
      taxRate: 18,
    },
    {
      id: 'item-2',
      description: 'Kraft Paper Bags with Twisted Handle (25 × 35 + 8 cm Gusset)',
      hsn: '4819',
      quantity: 2000,
      unit: 'BAGS',
      rate: 8.80,
      discount: 200,
      taxRate: 18,
    },
  ],
  eway: {
    required: true,
    ewayBillNo: '331002984512',
    transporterName: 'V-Trans Express Logistics',
    transporterId: '27AABCV8811K1Z2',
    transportMode: 'road',
    vehicleNo: 'MH-04-GP-8821',
    vehicleType: 'regular',
    distanceKm: 145,
    docType: 'tax-invoice',
    supplyType: 'outward',
    subSupplyType: 'Supply',
    dispatchFrom: 'Plot No. 42, Sector 8, Industrial Area, MIDC, Rabale, Navi Mumbai',
    shipTo: 'Warehouse 4, APMC Market Yard, Phase II, Vashi, Navi Mumbai',
  },
  notes: '1. Goods once sold will not be taken back.\n2. Interest @ 18% p.a. will be charged if payment is delayed beyond due date.\n3. Subject to Mumbai jurisdiction only.',
  roundOff: true,
  status: 'issued',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function useInvoices() {
  const [sellerProfile, setSellerProfile] = useState<InvoiceParty>(() => {
    const saved = localStorage.getItem('bagcost-seller-profile');
    return saved ? JSON.parse(saved) : DEFAULT_SELLER;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('bagcost-invoices');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [sampleInvoice];
      }
    }
    return [sampleInvoice];
  });

  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('bagcost-invoices', JSON.stringify(invoices));
  }, [invoices]);

  const saveSellerProfile = useCallback((profile: InvoiceParty) => {
    setSellerProfile(profile);
    localStorage.setItem('bagcost-seller-profile', JSON.stringify(profile));
  }, []);

  // Creates an invoice draft object without mutating the saved invoice list until user saves
  const buildInvoiceDraft = useCallback((initial?: Partial<Invoice>): Invoice => {
    const now = new Date();
    const randCode = Math.floor(1000 + Math.random() * 9000);
    const invNumber = `INV-${now.getFullYear()}-${randCode}`;
    
    return {
      id: crypto.randomUUID(),
      invoiceNo: initial?.invoiceNo || invNumber,
      invoiceDate: initial?.invoiceDate || now.toISOString().split('T')[0],
      dueDate: initial?.dueDate || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      placeOfSupply: initial?.placeOfSupply || 'Maharashtra (27)',
      interState: initial?.interState ?? false,
      seller: initial?.seller || sellerProfile,
      buyer: initial?.buyer || {
        name: '',
        gstin: '',
        address: '',
        state: 'Maharashtra',
        phone: '',
        email: '',
      },
      items: initial?.items || [
        {
          id: crypto.randomUUID(),
          description: 'Industrial Packaging Bags',
          hsn: '3923',
          quantity: 1000,
          unit: 'BAGS',
          rate: 10,
          discount: 0,
          taxRate: 18,
        },
      ],
      eway: initial?.eway || {
        required: false,
        ewayBillNo: '',
        transporterName: '',
        transporterId: '',
        transportMode: 'road',
        vehicleNo: '',
        vehicleType: 'regular',
        distanceKm: 50,
        docType: 'tax-invoice',
        supplyType: 'outward',
        subSupplyType: 'Supply',
        dispatchFrom: sellerProfile.address,
        shipTo: '',
      },
      notes: initial?.notes || '1. Terms: Payment within due date.\n2. Standard warranty against manufacturing defects applies.',
      roundOff: initial?.roundOff ?? true,
      status: initial?.status || 'draft',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
  }, [sellerProfile]);

  const createInvoice = useCallback((initial?: Partial<Invoice>): Invoice => {
    const newInvoice = buildInvoiceDraft(initial);
    setInvoices((prev) => [newInvoice, ...prev]);
    setActiveInvoice(newInvoice);
    return newInvoice;
  }, [buildInvoiceDraft]);

  const importFromCalculation = useCallback((result: CalculationResult): Invoice => {
    const isPaper = result.productCategory === 'paper';
    const desc = isPaper
      ? `${PAPER_TYPE_CONFIG[result.paperType || 'kraft']?.name || 'Paper Bag'} (${result.dimensions.length} × ${result.dimensions.width} cm${result.dimensions.gusset ? ` + ${result.dimensions.gusset}cm gusset` : ''})`
      : `${BAG_TYPE_CONFIG[result.bagType]?.name || 'Woven Bags'} (${result.dimensions.length} × ${result.dimensions.width} cm)`;

    const hsn = isPaper ? '4819' : (result.bagType === 'pp' || result.bagType === 'hdpe' ? '6305' : '3923');

    const item: InvoiceItem = {
      id: crypto.randomUUID(),
      description: desc,
      hsn,
      quantity: result.quantity,
      unit: 'BAGS',
      rate: Number(result.costPerBag.toFixed(2)),
      discount: 0,
      taxRate: 18,
    };

    return buildInvoiceDraft({
      items: [item],
      notes: `Imported from Mavrix Costing Pro calculation #${result.id.slice(0, 8)}.\nEstimated unit weight: ${result.bagWeight.toFixed(2)}g.`,
    });
  }, [buildInvoiceDraft]);

  const saveInvoice = useCallback((invoice: Invoice) => {
    const updated = { ...invoice, updatedAt: new Date().toISOString() };
    setInvoices((prev) => {
      const exists = prev.some((inv) => inv.id === invoice.id);
      if (exists) {
        return prev.map((inv) => (inv.id === invoice.id ? updated : inv));
      }
      return [updated, ...prev];
    });
    if (activeInvoice?.id === invoice.id) {
      setActiveInvoice(updated);
    }
  }, [activeInvoice?.id]);

  const deleteInvoice = useCallback((id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    if (activeInvoice?.id === id) {
      setActiveInvoice(null);
    }
  }, [activeInvoice?.id]);

  const duplicateInvoice = useCallback((id: string): Invoice | null => {
    const target = invoices.find((inv) => inv.id === id);
    if (!target) return null;

    const copy: Invoice = {
      ...target,
      id: crypto.randomUUID(),
      invoiceNo: `${target.invoiceNo}-COPY`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setInvoices((prev) => [copy, ...prev]);
    setActiveInvoice(copy);
    return copy;
  }, [invoices]);

  const updateInvoiceStatus = useCallback((id: string, status: Invoice['status']) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status, updatedAt: new Date().toISOString() } : inv))
    );
  }, []);

  return {
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
  };
}
