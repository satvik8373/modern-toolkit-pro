import { Header } from "./Header";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container py-6 md:py-8 flex-1">
        {children}
      </main>
      <footer className="border-t border-border/60 py-5 mt-auto bg-card/40 print:hidden">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground/80">
            Mavrix <span className="text-accent font-semibold">Costing Pro</span> • Enterprise Packaging Costing System
          </p>
          <p>
            Precision calculated to ₹0.001 per unit • GST & E-Way Bill Ready
          </p>
        </div>
      </footer>
    </div>
  );
}
