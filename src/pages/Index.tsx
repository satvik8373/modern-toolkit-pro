import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Calculator, 
  Zap, 
  Package, 
  TrendingUp, 
  Clock, 
  Shield, 
  ArrowRight,
  Layers,
  Users,
  CheckCircle2
} from "lucide-react";

const features = [
  {
    icon: Calculator,
    title: "Precision Costing",
    description: "Calculate costs accurate to ₹0.001 with our advanced algorithms",
  },
  {
    icon: Clock,
    title: "1-Minute Calculations",
    description: "Complete cost estimation in under 60 seconds",
  },
  {
    icon: Package,
    title: "All Bag Types",
    description: "PP/HDPE woven, laminated, with gussets and liners",
  },
  {
    icon: Zap,
    title: "Machine Integration",
    description: "Accounts for 7+ machine types and electricity costs",
  },
  {
    icon: Users,
    title: "Labor Tracking",
    description: "Comprehensive labor cost management per process",
  },
  {
    icon: TrendingUp,
    title: "Profit Optimization",
    description: "Eliminate hidden losses with transparent breakdowns",
  },
];

const bagTypes = [
  "PP Woven Bags",
  "HDPE Woven Bags",
  "Laminated (LD) Bags",
  "Unlaminated Bags",
  "Gusseted Bags",
  "Liner Bags",
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6 animate-fade-in">
            <Shield className="h-4 w-4" />
            Trusted by 500+ Manufacturers
          </div>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6 animate-slide-up">
            Bag Costing Made{" "}
            <span className="text-gradient">Simple & Precise</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "100ms" }}>
            The most advanced costing software for PP & HDPE woven sack manufacturers. 
            Calculate material, machine, and labor costs with 0.001₹ precision.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <Link to="/calculator">
              <Button variant="accent" size="xl" className="gap-2 w-full sm:w-auto">
                <Calculator className="h-5 w-5" />
                Start Calculating
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/history">
              <Button variant="outline" size="xl" className="gap-2 w-full sm:w-auto">
                View History
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border bg-secondary/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "0.001₹", label: "Precision" },
            { value: "<1 min", label: "Calculation Time" },
            { value: "7+", label: "Machine Types" },
            { value: "100%", label: "Accuracy" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl md:text-4xl font-display font-bold text-accent">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Everything You Need
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive costing tools designed specifically for woven bag manufacturers
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-card rounded-xl border border-border p-6 hover:border-accent/50 hover:shadow-lg transition-all duration-300 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <feature.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-display font-bold text-lg text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Supported Bag Types */}
      <section className="py-16 md:py-24 bg-secondary/30 -mx-4 md:-mx-8 px-4 md:px-8 rounded-3xl">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Layers className="h-4 w-4" />
              Supported Types
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Calculate Any Bag Type
            </h2>
            <p className="text-muted-foreground">
              Our software supports all major woven bag configurations
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {bagTypes.map((type) => (
              <div
                key={type}
                className="flex items-center gap-3 bg-card rounded-lg border border-border p-4"
              >
                <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                <span className="font-medium text-foreground">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="bg-gradient-hero rounded-3xl p-8 md:p-12 text-center shadow-xl">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
            Ready to Optimize Your Costing?
          </h2>
          <p className="text-primary-foreground/70 mb-8 max-w-xl mx-auto">
            Start calculating precise bag costs today and eliminate hidden losses in your manufacturing process.
          </p>
          <Link to="/calculator">
            <Button variant="accent" size="xl" className="gap-2 shadow-glow">
              <Calculator className="h-5 w-5" />
              Start Free Calculation
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
