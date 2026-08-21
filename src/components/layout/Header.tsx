import { Calculator, History, Settings, Menu, X, BarChart3, Receipt, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Calculator, label: "Cost Calculator", path: "/calculator" },
  { icon: Receipt, label: "GST Invoices", path: "/billing" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: History, label: "History", path: "/history" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-card/90 backdrop-blur-xl print:hidden">
      <div className="container flex h-16 items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-accent shadow-glow text-accent-foreground font-bold transition-transform group-hover:scale-105">
            <Box className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-extrabold tracking-tight text-foreground">
                Mavrix <span className="text-accent">Costing Pro</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-secondary text-muted-foreground border border-border">
                v2.0
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground font-medium -mt-0.5">
              Industrial Packaging & Bag Costing
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "gap-2 font-medium text-xs h-9 px-3.5 transition-all",
                    isActive
                      ? "bg-secondary text-foreground font-semibold shadow-sm border border-border/80"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", isActive ? "text-accent" : "text-muted-foreground")} />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card animate-slide-down shadow-xl">
          <nav className="container py-3 flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 h-10 text-sm font-medium",
                      isActive ? "bg-secondary font-semibold text-foreground" : "text-muted-foreground"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", isActive ? "text-accent" : "text-muted-foreground")} />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
