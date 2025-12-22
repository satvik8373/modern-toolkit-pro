import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Save, Building2, Zap, IndianRupee } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface DefaultSettings {
  companyName: string;
  defaultElectricityRate: number;
  defaultFabricRate: number;
  defaultLaminationRate: number;
  currency: string;
}

const defaultValues: DefaultSettings = {
  companyName: '',
  defaultElectricityRate: 8.5,
  defaultFabricRate: 95,
  defaultLaminationRate: 110,
  currency: 'INR',
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<DefaultSettings>(defaultValues);

  useEffect(() => {
    const saved = localStorage.getItem('bagcost-settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('bagcost-settings', JSON.stringify(settings));
    toast.success("Settings saved successfully!");
  };

  const handleChange = (field: keyof DefaultSettings, value: string | number) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-2">
            <Settings className="h-4 w-4" />
            Settings
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Application Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure default values and preferences
          </p>
        </div>

        {/* Settings Form */}
        <div className="space-y-6">
          {/* Company Info */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Company Information</h3>
                <p className="text-xs text-muted-foreground">Your business details</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input
                  value={settings.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  placeholder="Enter your company name"
                  className="h-11"
                />
              </div>
            </div>
          </div>

          {/* Default Rates */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <IndianRupee className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Default Rates</h3>
                <p className="text-xs text-muted-foreground">Pre-fill values for new calculations</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Default Fabric Rate (₹/kg)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={settings.defaultFabricRate}
                  onChange={(e) => handleChange('defaultFabricRate', parseFloat(e.target.value) || 0)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>Default Lamination Rate (₹/kg)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={settings.defaultLaminationRate}
                  onChange={(e) => handleChange('defaultLaminationRate', parseFloat(e.target.value) || 0)}
                  className="h-11"
                />
              </div>
            </div>
          </div>

          {/* Electricity */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-warning" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Electricity</h3>
                <p className="text-xs text-muted-foreground">Power consumption settings</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Default Electricity Rate (₹/unit)</Label>
              <Input
                type="number"
                step="0.01"
                value={settings.defaultElectricityRate}
                onChange={(e) => handleChange('defaultElectricityRate', parseFloat(e.target.value) || 0)}
                className="h-11 max-w-xs"
              />
            </div>
          </div>

          {/* Save Button */}
          <Button
            variant="accent"
            size="lg"
            className="w-full gap-2"
            onClick={handleSave}
          >
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </Layout>
  );
}
