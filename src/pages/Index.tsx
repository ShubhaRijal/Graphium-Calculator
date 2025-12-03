import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Navigation, NavigationVertical, type CalculatorMode } from '@/components/layout/Navigation';
import { ScientificCalculator } from '@/components/calculator/ScientificCalculator';
import { GraphingCalculator } from '@/components/calculator/GraphingCalculator';
import { CalculusCalculator } from '@/components/calculator/CalculusCalculator';
import { StatisticsCalculator } from '@/components/calculator/StatisticsCalculator';
import { UnitConverter } from '@/components/calculator/UnitConverter';
import { ErrorChecker } from '@/components/calculator/ErrorChecker';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [activeMode, setActiveMode] = useState<CalculatorMode>('scientific');
  const isMobile = useIsMobile();

  const renderCalculator = () => {
    switch (activeMode) {
      case 'scientific':
        return <ScientificCalculator />;
      case 'graphing':
        return <GraphingCalculator />;
      case 'calculus':
        return <CalculusCalculator />;
      case 'statistics':
        return <StatisticsCalculator />;
      case 'units':
        return <UnitConverter />;
      case 'errors':
        return <ErrorChecker />;
      default:
        return <ScientificCalculator />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {isMobile ? (
          // Mobile Layout
          <div className="space-y-4">
            <Navigation activeMode={activeMode} onModeChange={setActiveMode} />
            <div className="glass-panel p-4">
              {renderCalculator()}
            </div>
          </div>
        ) : (
          // Desktop Layout
          <div className="grid grid-cols-[280px,1fr] gap-6">
            <aside className="glass-panel p-4 h-fit sticky top-24">
              <NavigationVertical activeMode={activeMode} onModeChange={setActiveMode} />
            </aside>
            <div className="glass-panel p-6 max-w-2xl">
              {renderCalculator()}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Graphium Calculator • Built with precision in mind</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
