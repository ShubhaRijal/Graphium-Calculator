import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { checkExpression } from '@/lib/mathEngine';
import { CheckCircle, XCircle, AlertTriangle, Sparkles } from 'lucide-react';

interface CheckResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function ErrorChecker() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState<CheckResult | null>(null);

  const handleCheck = () => {
    const checkResult = checkExpression(expression);
    setResult(checkResult);
  };

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="glass-panel p-4 space-y-4">
        <div>
          <Textarea
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="Enter an expression to check for errors...

Examples:
  x^2 + 3x - 5
  sin(x) * cos(x)
  (a + b) * (c - d)
  sqrt(x^2 + y^2)"
            className="font-mono h-32"
          />
        </div>
        
        <Button onClick={handleCheck} className="w-full">
          <Sparkles className="h-4 w-4 mr-2" />
          Check Expression
        </Button>
      </div>

      {result && (
        <div className="space-y-3 animate-fade-in">
          {/* Status */}
          <div className={`glass-panel p-4 flex items-center gap-3 ${
            result.valid ? 'border-success/50' : 'border-destructive/50'
          } border`}>
            {result.valid ? (
              <>
                <CheckCircle className="h-6 w-6 text-success" />
                <div>
                  <div className="font-medium text-success">Expression is valid</div>
                  <div className="text-sm text-muted-foreground">No syntax errors detected</div>
                </div>
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6 text-destructive" />
                <div>
                  <div className="font-medium text-destructive">Expression has errors</div>
                  <div className="text-sm text-muted-foreground">Please fix the issues below</div>
                </div>
              </>
            )}
          </div>

          {/* Errors */}
          {result.errors.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-destructive flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Errors
              </h3>
              {result.errors.map((error, i) => (
                <div key={i} className="glass-panel p-3 border border-destructive/30 text-sm">
                  {error}
                </div>
              ))}
            </div>
          )}

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-warning flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Warnings
              </h3>
              {result.warnings.map((warning, i) => (
                <div key={i} className="glass-panel p-3 border border-warning/30 text-sm">
                  {warning}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      <div className="glass-panel p-4">
        <h3 className="text-sm font-medium mb-3">Common Expression Issues</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-destructive">•</span>
            <span><strong>Unbalanced parentheses:</strong> Make sure every ( has a matching )</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-warning">•</span>
            <span><strong>Implicit multiplication:</strong> Write 2*x instead of 2x for clarity</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-destructive">•</span>
            <span><strong>Unknown functions:</strong> Use sqrt() not √, use ^ for exponents</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-warning">•</span>
            <span><strong>Consecutive operators:</strong> Avoid ++, --, etc.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
