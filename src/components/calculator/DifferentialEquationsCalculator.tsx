import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { evaluate } from 'mathjs';

export function DifferentialEquationsCalculator() {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string>('');

  const updateInput = (key: string, value: string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const solveFirstOrderLinear = () => {
    try {
      // dy/dx + P(x)y = Q(x)
      const results: string[] = [];
      results.push(`First-Order Linear ODE: dy/dx + P(x)y = Q(x)`);
      results.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      results.push(`\nP(x) = ${inputs.pFunction || '?'}`);
      results.push(`Q(x) = ${inputs.qFunction || '?'}`);
      results.push(`\nSolution Method:`);
      results.push(`1. Find integrating factor: μ(x) = e^∫P(x)dx`);
      results.push(`2. Multiply both sides by μ(x)`);
      results.push(`3. Left side becomes d/dx[μ(x)y]`);
      results.push(`4. Integrate both sides`);
      results.push(`5. y = (1/μ(x)) ∫ μ(x)Q(x)dx`);
      results.push(`\nGeneral Solution Form:`);
      results.push(`y = e^(-∫P dx) [∫ e^(∫P dx) Q dx + C]`);
      
      // Numerical solution using Euler's method
      if (inputs.initialX && inputs.initialY && inputs.targetX) {
        const x0 = parseFloat(inputs.initialX);
        const y0 = parseFloat(inputs.initialY);
        const xf = parseFloat(inputs.targetX);
        const h = 0.1;
        const steps = Math.abs(xf - x0) / h;
        
        let x = x0, y = y0;
        results.push(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        results.push(`Euler's Method (h = ${h}):`);
        results.push(`Initial: y(${x0}) = ${y0}`);
        
        for (let i = 0; i < steps; i++) {
          const P = evaluate(inputs.pFunction || '0', { x });
          const Q = evaluate(inputs.qFunction || '0', { x });
          const dydx = Q - P * y;
          y = y + h * dydx;
          x = x + h;
        }
        
        results.push(`Approximate: y(${xf}) ≈ ${y.toFixed(6)}`);
      }
      
      setResult(results.join('\n'));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Invalid input'}`);
    }
  };

  const solveSecondOrderConstant = () => {
    try {
      // ay'' + by' + cy = 0
      const a = parseFloat(inputs.coeffA || '1');
      const b = parseFloat(inputs.coeffB || '0');
      const c = parseFloat(inputs.coeffC || '0');
      
      const results: string[] = [];
      results.push(`Second-Order Homogeneous ODE:`);
      results.push(`${a}y'' + ${b}y' + ${c}y = 0`);
      results.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Characteristic equation: ar² + br + c = 0
      const discriminant = b * b - 4 * a * c;
      results.push(`\nCharacteristic equation: ${a}r² + ${b}r + ${c} = 0`);
      results.push(`Discriminant: Δ = ${discriminant.toFixed(4)}`);
      
      if (discriminant > 0) {
        const r1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const r2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        results.push(`\nCase: Δ > 0 (Two distinct real roots)`);
        results.push(`r₁ = ${r1.toFixed(4)}, r₂ = ${r2.toFixed(4)}`);
        results.push(`\nGeneral Solution:`);
        results.push(`y = C₁e^(${r1.toFixed(4)}x) + C₂e^(${r2.toFixed(4)}x)`);
      } else if (discriminant === 0) {
        const r = -b / (2 * a);
        results.push(`\nCase: Δ = 0 (Repeated real root)`);
        results.push(`r = ${r.toFixed(4)}`);
        results.push(`\nGeneral Solution:`);
        results.push(`y = (C₁ + C₂x)e^(${r.toFixed(4)}x)`);
      } else {
        const alpha = -b / (2 * a);
        const beta = Math.sqrt(-discriminant) / (2 * a);
        results.push(`\nCase: Δ < 0 (Complex conjugate roots)`);
        results.push(`r = ${alpha.toFixed(4)} ± ${beta.toFixed(4)}i`);
        results.push(`\nGeneral Solution:`);
        results.push(`y = e^(${alpha.toFixed(4)}x)[C₁cos(${beta.toFixed(4)}x) + C₂sin(${beta.toFixed(4)}x)]`);
      }
      
      setResult(results.join('\n'));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Invalid input'}`);
    }
  };

  const solveSeparable = () => {
    try {
      const results: string[] = [];
      results.push(`Separable ODE: dy/dx = f(x)g(y)`);
      results.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      results.push(`\nf(x) = ${inputs.fFunction || '?'}`);
      results.push(`g(y) = ${inputs.gFunction || '?'}`);
      results.push(`\nSolution Method:`);
      results.push(`1. Separate: dy/g(y) = f(x)dx`);
      results.push(`2. Integrate both sides:`);
      results.push(`   ∫ (1/g(y)) dy = ∫ f(x) dx + C`);
      results.push(`3. Solve for y (if possible)`);
      
      // Common examples
      results.push(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      results.push(`Common Separable ODEs:`);
      results.push(`\n• dy/dx = xy → y = Ce^(x²/2)`);
      results.push(`• dy/dx = y/x → y = Cx`);
      results.push(`• dy/dx = y² → y = -1/(x + C)`);
      results.push(`• dy/dx = e^(x+y) → -e^(-y) = e^x + C`);
      
      setResult(results.join('\n'));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Invalid input'}`);
    }
  };

  const solveExact = () => {
    try {
      const results: string[] = [];
      results.push(`Exact ODE: M(x,y)dx + N(x,y)dy = 0`);
      results.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      results.push(`\nM(x,y) = ${inputs.mFunction || '?'}`);
      results.push(`N(x,y) = ${inputs.nFunction || '?'}`);
      results.push(`\nExactness Condition:`);
      results.push(`∂M/∂y = ∂N/∂x`);
      results.push(`\nIf exact, solution is F(x,y) = C where:`);
      results.push(`∂F/∂x = M  and  ∂F/∂y = N`);
      results.push(`\nSolution Steps:`);
      results.push(`1. Verify ∂M/∂y = ∂N/∂x`);
      results.push(`2. Integrate M with respect to x: F = ∫M dx + g(y)`);
      results.push(`3. Differentiate F with respect to y`);
      results.push(`4. Compare with N to find g(y)`);
      results.push(`5. Solution: F(x,y) = C`);
      
      results.push(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      results.push(`If Not Exact - Integrating Factor:`);
      results.push(`• If (∂M/∂y - ∂N/∂x)/N = f(x) only → μ = e^∫f(x)dx`);
      results.push(`• If (∂N/∂x - ∂M/∂y)/M = g(y) only → μ = e^∫g(y)dy`);
      
      setResult(results.join('\n'));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Invalid input'}`);
    }
  };

  const rungeKutta = () => {
    try {
      const results: string[] = [];
      const x0 = parseFloat(inputs.rkX0 || '0');
      const y0 = parseFloat(inputs.rkY0 || '1');
      const h = parseFloat(inputs.rkStep || '0.1');
      const xf = parseFloat(inputs.rkXf || '1');
      const func = inputs.rkFunction || 'y';
      
      results.push(`Runge-Kutta 4th Order Method`);
      results.push(`dy/dx = f(x,y) = ${func}`);
      results.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      results.push(`\nStep size h = ${h}`);
      results.push(`Initial condition: y(${x0}) = ${y0}`);
      results.push(`\n    x         y(x)`);
      results.push('─────────────────────');
      
      let x = x0, y = y0;
      results.push(`  ${x.toFixed(4)}    ${y.toFixed(6)}`);
      
      const f = (x: number, y: number) => evaluate(func, { x, y });
      
      while (x < xf - h/2) {
        const k1 = f(x, y);
        const k2 = f(x + h/2, y + h*k1/2);
        const k3 = f(x + h/2, y + h*k2/2);
        const k4 = f(x + h, y + h*k3);
        
        y = y + (h/6) * (k1 + 2*k2 + 2*k3 + k4);
        x = x + h;
        results.push(`  ${x.toFixed(4)}    ${y.toFixed(6)}`);
      }
      
      results.push(`\nFinal: y(${xf}) ≈ ${y.toFixed(6)}`);
      
      setResult(results.join('\n'));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Invalid input'}`);
    }
  };

  return (
    <Card className="glass-panel">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-primary">Differential Equations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="first-order" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="first-order">1st Order</TabsTrigger>
            <TabsTrigger value="second-order">2nd Order</TabsTrigger>
            <TabsTrigger value="numerical">Numerical</TabsTrigger>
          </TabsList>

          <TabsContent value="first-order" className="space-y-4">
            <Select onValueChange={(v) => updateInput('firstOrderType', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select ODE type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linear">Linear: dy/dx + P(x)y = Q(x)</SelectItem>
                <SelectItem value="separable">Separable: dy/dx = f(x)g(y)</SelectItem>
                <SelectItem value="exact">Exact: M dx + N dy = 0</SelectItem>
              </SelectContent>
            </Select>

            {inputs.firstOrderType === 'linear' && (
              <div className="space-y-2">
                <Input placeholder="P(x)" onChange={(e) => updateInput('pFunction', e.target.value)} />
                <Input placeholder="Q(x)" onChange={(e) => updateInput('qFunction', e.target.value)} />
                <div className="text-xs text-muted-foreground">For numerical: add initial conditions</div>
                <div className="grid grid-cols-3 gap-2">
                  <Input placeholder="x₀" onChange={(e) => updateInput('initialX', e.target.value)} />
                  <Input placeholder="y₀" onChange={(e) => updateInput('initialY', e.target.value)} />
                  <Input placeholder="x target" onChange={(e) => updateInput('targetX', e.target.value)} />
                </div>
                <Button onClick={solveFirstOrderLinear} className="w-full">Solve</Button>
              </div>
            )}

            {inputs.firstOrderType === 'separable' && (
              <div className="space-y-2">
                <Input placeholder="f(x)" onChange={(e) => updateInput('fFunction', e.target.value)} />
                <Input placeholder="g(y)" onChange={(e) => updateInput('gFunction', e.target.value)} />
                <Button onClick={solveSeparable} className="w-full">Show Method</Button>
              </div>
            )}

            {inputs.firstOrderType === 'exact' && (
              <div className="space-y-2">
                <Input placeholder="M(x,y)" onChange={(e) => updateInput('mFunction', e.target.value)} />
                <Input placeholder="N(x,y)" onChange={(e) => updateInput('nFunction', e.target.value)} />
                <Button onClick={solveExact} className="w-full">Show Method</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="second-order" className="space-y-4">
            <Label className="text-xs text-muted-foreground">ay'' + by' + cy = 0</Label>
            <div className="grid grid-cols-3 gap-2">
              <Input placeholder="a" onChange={(e) => updateInput('coeffA', e.target.value)} />
              <Input placeholder="b" onChange={(e) => updateInput('coeffB', e.target.value)} />
              <Input placeholder="c" onChange={(e) => updateInput('coeffC', e.target.value)} />
            </div>
            <Button onClick={solveSecondOrderConstant} className="w-full">Solve Characteristic Equation</Button>
          </TabsContent>

          <TabsContent value="numerical" className="space-y-4">
            <Label className="text-xs text-muted-foreground">Runge-Kutta 4th Order: dy/dx = f(x,y)</Label>
            <Input placeholder="f(x,y) e.g., x*y, sin(x)+y" onChange={(e) => updateInput('rkFunction', e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="x₀" onChange={(e) => updateInput('rkX0', e.target.value)} />
              <Input placeholder="y₀" onChange={(e) => updateInput('rkY0', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Step size h" defaultValue="0.1" onChange={(e) => updateInput('rkStep', e.target.value)} />
              <Input placeholder="x final" onChange={(e) => updateInput('rkXf', e.target.value)} />
            </div>
            <Button onClick={rungeKutta} className="w-full">Run Runge-Kutta</Button>
          </TabsContent>
        </Tabs>

        {result && (
          <pre className="mt-4 p-3 bg-muted/50 rounded-lg text-xs font-mono whitespace-pre-wrap overflow-x-auto max-h-72 overflow-y-auto">
            {result}
          </pre>
        )}
      </CardContent>
    </Card>
  );
}
