import { cn } from '@/lib/utils';
import { 
  Calculator, 
  LineChart, 
  Sigma, 
  BarChart3, 
  Scale, 
  AlertCircle 
} from 'lucide-react';

export type CalculatorMode = 
  | 'scientific' 
  | 'graphing' 
  | 'calculus' 
  | 'statistics' 
  | 'units' 
  | 'errors';

interface NavigationProps {
  activeMode: CalculatorMode;
  onModeChange: (mode: CalculatorMode) => void;
}

const modes = [
  { id: 'scientific', label: 'Scientific', icon: Calculator, description: 'Basic & advanced calculations' },
  { id: 'graphing', label: 'Graphing', icon: LineChart, description: '2D function plotting' },
  { id: 'calculus', label: 'Calculus', icon: Sigma, description: 'Derivatives, integrals, limits' },
  { id: 'statistics', label: 'Statistics', icon: BarChart3, description: 'Data analysis & regression' },
  { id: 'units', label: 'Units', icon: Scale, description: 'Unit conversion' },
  { id: 'errors', label: 'Error Check', icon: AlertCircle, description: 'Expression validation' },
] as const;

export function Navigation({ activeMode, onModeChange }: NavigationProps) {
  return (
    <nav className="overflow-x-auto scrollbar-thin pb-2">
      <div className="flex gap-2 min-w-max">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = activeMode === mode.id;
          
          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id as CalculatorMode)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200',
                'border border-transparent',
                isActive
                  ? 'bg-primary text-primary-foreground border-primary/50 shadow-lg shadow-primary/20'
                  : 'bg-secondary/50 text-secondary-foreground hover:bg-secondary hover:border-border'
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="font-medium text-sm whitespace-nowrap">{mode.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export function NavigationVertical({ activeMode, onModeChange }: NavigationProps) {
  return (
    <nav className="space-y-1">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = activeMode === mode.id;
        
        return (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id as CalculatorMode)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            )}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <div>
              <div className="font-medium text-sm">{mode.label}</div>
              <div className={cn(
                'text-xs',
                isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
              )}>
                {mode.description}
              </div>
            </div>
          </button>
        );
      })}
    </nav>
  );
}
