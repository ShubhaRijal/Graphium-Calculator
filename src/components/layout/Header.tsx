import { Calculator } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center glow-primary">
            <Calculator className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Graphium</h1>
            <p className="text-xs text-muted-foreground">Advanced Calculator Suite</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="hidden sm:block text-xs text-muted-foreground">
            Powered by math.js
          </div>
        </div>
      </div>
    </header>
  );
}
