import { cn } from '@/lib/utils';

interface CalculatorDisplayProps {
  expression: string;
  result: string;
  error?: string | null;
  history?: string[];
  className?: string;
}

export function CalculatorDisplay({
  expression,
  result,
  error,
  history = [],
  className,
}: CalculatorDisplayProps) {
  return (
    <div className={cn('calc-display space-y-2', className)}>
      {/* History */}
      {history.length > 0 && (
        <div className="space-y-1 max-h-20 overflow-y-auto scrollbar-thin border-b border-border/30 pb-2 mb-2">
          {history.slice(-3).map((item, i) => (
            <div key={i} className="text-muted-foreground text-sm truncate">
              {item}
            </div>
          ))}
        </div>
      )}
      
      {/* Current Expression */}
      <div className="text-muted-foreground text-lg min-h-[28px] break-all">
        {expression || '0'}
      </div>
      
      {/* Result */}
      <div className="min-h-[48px]">
        {error ? (
          <div className="text-destructive text-xl animate-fade-in">
            {error}
          </div>
        ) : (
          <div className="text-foreground text-4xl font-semibold tracking-tight animate-fade-in">
            {result || '0'}
          </div>
        )}
      </div>
    </div>
  );
}
