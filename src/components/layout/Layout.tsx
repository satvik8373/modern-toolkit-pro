import { Header } from "./Header";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 md:py-10">
        {children}
      </main>
      <footer className="border-t border-border/50 py-6 mt-auto">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 BagCostPro. Precision costing for woven bag manufacturers.</p>
        </div>
      </footer>
    </div>
  );
}
