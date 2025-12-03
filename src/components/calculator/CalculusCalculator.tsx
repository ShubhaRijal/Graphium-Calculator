import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { derivative, integrate, limit, checkExpression } from '@/lib/mathEngine';
import { ArrowRight } from 'lucide-react';

export function CalculusCalculator() {
  const [derivativeInput, setDerivativeInput] = useState({ expr: '', variable: 'x' });
  const [derivativeResult, setDerivativeResult] = useState<{ value: string; error: string | null } | null>(null);

  const [integralInput, setIntegralInput] = useState({ expr: '', variable: 'x', lower: '0', upper: '1' });
  const [integralResult, setIntegralResult] = useState<{ value: string; error: string | null } | null>(null);

  const [limitInput, setLimitInput] = useState({ expr: '', variable: 'x', approaching: '0' });
  const [limitResult, setLimitResult] = useState<{ value: string; error: string | null } | null>(null);

  const handleDerivative = () => {
    const check = checkExpression(derivativeInput.expr);
    if (!check.valid) {
      setDerivativeResult({ value: '', error: check.errors[0] });
      return;
    }
    const result = derivative(derivativeInput.expr, derivativeInput.variable);
    setDerivativeResult(result);
  };

  const handleIntegral = () => {
    const check = checkExpression(integralInput.expr);
    if (!check.valid) {
      setIntegralResult({ value: '', error: check.errors[0] });
      return;
    }
    const result = integrate(
      integralInput.expr,
      integralInput.variable,
      Number(integralInput.lower),
      Number(integralInput.upper)
    );
    setIntegralResult(result);
  };

  const handleLimit = () => {
    const check = checkExpression(limitInput.expr);
    if (!check.valid) {
      setLimitResult({ value: '', error: check.errors[0] });
      return;
    }
    const result = limit(limitInput.expr, limitInput.variable, Number(limitInput.approaching));
    setLimitResult(result);
  };

  return (
    <div className="space-y-4 animate-fade-in-up">
      <Tabs defaultValue="derivative" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="derivative">Derivative</TabsTrigger>
          <TabsTrigger value="integral">Integral</TabsTrigger>
          <TabsTrigger value="limit">Limit</TabsTrigger>
        </TabsList>

        <TabsContent value="derivative" className="space-y-4">
          <div className="glass-panel p-4 space-y-4">
            <div className="flex items-center gap-2 text-xl font-mono">
              <span className="text-muted-foreground">d/d</span>
              <Input
                value={derivativeInput.variable}
                onChange={(e) => setDerivativeInput(prev => ({ ...prev, variable: e.target.value }))}
                className="w-12 text-center font-mono"
              />
              <span className="text-muted-foreground">[</span>
              <Input
                value={derivativeInput.expr}
                onChange={(e) => setDerivativeInput(prev => ({ ...prev, expr: e.target.value }))}
                placeholder="x^2 + 3x"
                className="flex-1 font-mono"
              />
              <span className="text-muted-foreground">]</span>
            </div>

            <Button onClick={handleDerivative} className="w-full">
              Calculate Derivative
            </Button>

            {derivativeResult && (
              <div className="calc-display animate-fade-in">
                {derivativeResult.error ? (
                  <div className="text-destructive">{derivativeResult.error}</div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Result:</div>
                    <div className="text-2xl font-mono text-primary">{derivativeResult.value}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            <p className="mb-2">Examples:</p>
            <ul className="space-y-1 font-mono text-xs">
              <li>• x^3 + 2x^2 - 5x + 1</li>
              <li>• sin(x) * cos(x)</li>
              <li>• e^x * ln(x)</li>
              <li>• sqrt(x^2 + 1)</li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="integral" className="space-y-4">
          <div className="glass-panel p-4 space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex flex-col items-center">
                <Input
                  value={integralInput.upper}
                  onChange={(e) => setIntegralInput(prev => ({ ...prev, upper: e.target.value }))}
                  className="w-16 h-8 text-center text-sm font-mono mb-1"
                  placeholder="b"
                />
                <span className="text-4xl text-muted-foreground">∫</span>
                <Input
                  value={integralInput.lower}
                  onChange={(e) => setIntegralInput(prev => ({ ...prev, lower: e.target.value }))}
                  className="w-16 h-8 text-center text-sm font-mono mt-1"
                  placeholder="a"
                />
              </div>
              <div className="flex-1">
                <Input
                  value={integralInput.expr}
                  onChange={(e) => setIntegralInput(prev => ({ ...prev, expr: e.target.value }))}
                  placeholder="x^2"
                  className="font-mono"
                />
              </div>
              <span className="text-muted-foreground font-mono">d</span>
              <Input
                value={integralInput.variable}
                onChange={(e) => setIntegralInput(prev => ({ ...prev, variable: e.target.value }))}
                className="w-12 text-center font-mono"
              />
            </div>

            <Button onClick={handleIntegral} className="w-full">
              Calculate Definite Integral
            </Button>

            {integralResult && (
              <div className="calc-display animate-fade-in">
                {integralResult.error ? (
                  <div className="text-destructive">{integralResult.error}</div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Definite Integral ≈</div>
                    <div className="text-2xl font-mono text-primary">{integralResult.value}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Uses Simpson's rule for numerical integration (1000 intervals).</p>
          </div>
        </TabsContent>

        <TabsContent value="limit" className="space-y-4">
          <div className="glass-panel p-4 space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xl text-muted-foreground">lim</span>
              <div className="flex flex-col text-sm">
                <Input
                  value={limitInput.variable}
                  onChange={(e) => setLimitInput(prev => ({ ...prev, variable: e.target.value }))}
                  className="w-12 h-7 text-center font-mono text-xs"
                />
                <div className="flex items-center gap-1">
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <Input
                    value={limitInput.approaching}
                    onChange={(e) => setLimitInput(prev => ({ ...prev, approaching: e.target.value }))}
                    className="w-16 h-7 text-center font-mono text-xs"
                    placeholder="0"
                  />
                </div>
              </div>
              <Input
                value={limitInput.expr}
                onChange={(e) => setLimitInput(prev => ({ ...prev, expr: e.target.value }))}
                placeholder="sin(x)/x"
                className="flex-1 font-mono"
              />
            </div>

            <Button onClick={handleLimit} className="w-full">
              Calculate Limit
            </Button>

            {limitResult && (
              <div className="calc-display animate-fade-in">
                {limitResult.error ? (
                  <div className="text-destructive">{limitResult.error}</div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Limit ≈</div>
                    <div className="text-2xl font-mono text-primary">{limitResult.value}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            <p className="mb-2">Examples:</p>
            <ul className="space-y-1 font-mono text-xs">
              <li>• sin(x)/x as x → 0</li>
              <li>• (1+1/x)^x as x → infinity</li>
              <li>• (x^2-1)/(x-1) as x → 1</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
