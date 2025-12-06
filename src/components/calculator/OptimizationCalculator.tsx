import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { evaluate, derivative } from 'mathjs';

export function OptimizationCalculator() {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string>('');

  const updateInput = (key: string, value: string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const findCriticalPoints = () => {
    try {
      const func = inputs.function || 'x^2';
      const xMin = parseFloat(inputs.xMin || '-10');
      const xMax = parseFloat(inputs.xMax || '10');
      
      const results: string[] = [];
      results.push(`Optimization: f(x) = ${func}`);
      results.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // First derivative
      const df = derivative(func, 'x').toString();
      results.push(`\nf'(x) = ${df}`);
      
      // Second derivative
      const d2f = derivative(derivative(func, 'x'), 'x').toString();
      results.push(`f''(x) = ${d2f}`);
      
      // Find critical points numerically
      const criticalPoints: { x: number; y: number; type: string }[] = [];
      const step = (xMax - xMin) / 1000;
      
      for (let x = xMin + step; x < xMax - step; x += step) {
        const dfPrev = evaluate(df, { x: x - step });
        const dfCurr = evaluate(df, { x });
        
        // Sign change in derivative
        if (dfPrev * dfCurr < 0) {
          // Newton-Raphson refinement
          let xCrit = x;
          for (let i = 0; i < 10; i++) {
            const dfVal = evaluate(df, { x: xCrit });
            const d2fVal = evaluate(d2f, { x: xCrit });
            if (Math.abs(d2fVal) > 0.0001) {
              xCrit = xCrit - dfVal / d2fVal;
            }
          }
          
          if (xCrit >= xMin && xCrit <= xMax) {
            const y = evaluate(func, { x: xCrit });
            const d2fVal = evaluate(d2f, { x: xCrit });
            const type = d2fVal > 0 ? 'Local Minimum' : d2fVal < 0 ? 'Local Maximum' : 'Inflection Point';
            
            // Check if not duplicate
            if (!criticalPoints.some(p => Math.abs(p.x - xCrit) < 0.01)) {
              criticalPoints.push({ x: xCrit, y, type });
            }
          }
        }
      }
      
      // Boundary values
      const yMin = evaluate(func, { x: xMin });
      const yMax = evaluate(func, { x: xMax });
      
      results.push(`\nCritical Points:`);
      if (criticalPoints.length === 0) {
        results.push(`  No critical points found in [${xMin}, ${xMax}]`);
      } else {
        for (const p of criticalPoints) {
          results.push(`  x = ${p.x.toFixed(4)}: f(x) = ${p.y.toFixed(4)} (${p.type})`);
        }
      }
      
      results.push(`\nBoundary Values:`);
      results.push(`  f(${xMin}) = ${yMin.toFixed(4)}`);
      results.push(`  f(${xMax}) = ${yMax.toFixed(4)}`);
      
      // Find absolute extrema
      const allPoints = [
        { x: xMin, y: yMin },
        { x: xMax, y: yMax },
        ...criticalPoints
      ];
      
      const absMin = allPoints.reduce((min, p) => p.y < min.y ? p : min);
      const absMax = allPoints.reduce((max, p) => p.y > max.y ? p : max);
      
      results.push(`\nAbsolute Extrema on [${xMin}, ${xMax}]:`);
      results.push(`  Minimum: f(${absMin.x.toFixed(4)}) = ${absMin.y.toFixed(4)}`);
      results.push(`  Maximum: f(${absMax.x.toFixed(4)}) = ${absMax.y.toFixed(4)}`);
      
      setResult(results.join('\n'));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Invalid input'}`);
    }
  };

  const solveLinearProgramming = () => {
    try {
      // Simple 2-variable LP: maximize c1*x + c2*y subject to constraints
      const c1 = parseFloat(inputs.objX || '1');
      const c2 = parseFloat(inputs.objY || '1');
      
      const results: string[] = [];
      results.push(`Linear Programming (Graphical Method)`);
      results.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      results.push(`\nObjective: Maximize Z = ${c1}x + ${c2}y`);
      
      // Parse constraints (format: "ax + by <= c")
      const constraintsText = inputs.constraints || '2x + y <= 20\nx + 2y <= 20\nx >= 0\ny >= 0';
      const constraintLines = constraintsText.split('\n').filter(l => l.trim());
      
      results.push(`\nConstraints:`);
      constraintLines.forEach((c, i) => results.push(`  (${i + 1}) ${c}`));
      
      // Find corner points (simplified - assumes standard form)
      const corners: { x: number; y: number; z: number }[] = [];
      
      // Parse simple constraints ax + by <= c
      const constraints: { a: number; b: number; c: number; type: string }[] = [];
      for (const line of constraintLines) {
        const match = line.match(/([+-]?\d*\.?\d*)x\s*([+-]\s*\d*\.?\d*)y\s*(<=|>=|=)\s*([+-]?\d*\.?\d+)/);
        if (match) {
          const a = parseFloat(match[1] || '1');
          const b = parseFloat(match[2].replace(/\s/g, '') || '1');
          const c = parseFloat(match[4]);
          const type = match[3];
          constraints.push({ a, b, c, type });
        }
      }
      
      // Check corner (0,0)
      corners.push({ x: 0, y: 0, z: 0 });
      
      // Find intersections
      for (let i = 0; i < constraints.length; i++) {
        for (let j = i + 1; j < constraints.length; j++) {
          const { a: a1, b: b1, c: c1 } = constraints[i];
          const { a: a2, b: b2, c: c2 } = constraints[j];
          
          const det = a1 * b2 - a2 * b1;
          if (Math.abs(det) > 0.0001) {
            const x = (c1 * b2 - c2 * b1) / det;
            const y = (a1 * c2 - a2 * c1) / det;
            
            if (x >= 0 && y >= 0) {
              // Check if feasible (satisfies all constraints)
              let feasible = true;
              for (const con of constraints) {
                const val = con.a * x + con.b * y;
                if (con.type === '<=' && val > con.c + 0.001) feasible = false;
                if (con.type === '>=' && val < con.c - 0.001) feasible = false;
              }
              
              if (feasible) {
                const z = c1 * x + c2 * y;
                corners.push({ x, y, z });
              }
            }
          }
        }
      }
      
      // Axis intersections
      for (const con of constraints) {
        if (con.a !== 0) {
          const x = con.c / con.a;
          if (x >= 0) {
            let feasible = true;
            for (const c of constraints) {
              if (c.type === '<=' && c.a * x > c.c + 0.001) feasible = false;
            }
            if (feasible) corners.push({ x, y: 0, z: c1 * x });
          }
        }
        if (con.b !== 0) {
          const y = con.c / con.b;
          if (y >= 0) {
            let feasible = true;
            for (const c of constraints) {
              if (c.type === '<=' && c.b * y > c.c + 0.001) feasible = false;
            }
            if (feasible) corners.push({ x: 0, y, z: c2 * y });
          }
        }
      }
      
      // Remove duplicates
      const uniqueCorners = corners.filter((c, i) => 
        corners.findIndex(p => Math.abs(p.x - c.x) < 0.01 && Math.abs(p.y - c.y) < 0.01) === i
      );
      
      results.push(`\nCorner Points:`);
      for (const c of uniqueCorners) {
        results.push(`  (${c.x.toFixed(2)}, ${c.y.toFixed(2)}): Z = ${c.z.toFixed(2)}`);
      }
      
      if (uniqueCorners.length > 0) {
        const optimal = uniqueCorners.reduce((max, c) => c.z > max.z ? c : max);
        results.push(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        results.push(`Optimal Solution:`);
        results.push(`  x = ${optimal.x.toFixed(4)}`);
        results.push(`  y = ${optimal.y.toFixed(4)}`);
        results.push(`  Maximum Z = ${optimal.z.toFixed(4)}`);
      }
      
      setResult(results.join('\n'));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Invalid input'}`);
    }
  };

  const gradientDescent = () => {
    try {
      const func = inputs.gdFunction || 'x^2 + y^2';
      let x = parseFloat(inputs.gdStartX || '5');
      let y = parseFloat(inputs.gdStartY || '5');
      const alpha = parseFloat(inputs.gdAlpha || '0.1');
      const iterations = parseInt(inputs.gdIterations || '100');
      
      const results: string[] = [];
      results.push(`Gradient Descent: f(x,y) = ${func}`);
      results.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      results.push(`\nLearning rate α = ${alpha}`);
      results.push(`Starting point: (${x}, ${y})`);
      results.push(`\n  Iter      x           y         f(x,y)`);
      results.push('───────────────────────────────────────');
      
      // Numerical gradient
      const h = 0.0001;
      const grad = (x: number, y: number) => {
        const fx = (evaluate(func, { x: x + h, y }) - evaluate(func, { x: x - h, y })) / (2 * h);
        const fy = (evaluate(func, { x, y: y + h }) - evaluate(func, { x, y: y - h })) / (2 * h);
        return { dx: fx, dy: fy };
      };
      
      results.push(`  ${0}      ${x.toFixed(4).padStart(8)}  ${y.toFixed(4).padStart(8)}  ${evaluate(func, { x, y }).toFixed(6)}`);
      
      for (let i = 1; i <= iterations; i++) {
        const g = grad(x, y);
        x = x - alpha * g.dx;
        y = y - alpha * g.dy;
        
        if (i <= 5 || i === iterations || i % 20 === 0) {
          const fVal = evaluate(func, { x, y });
          results.push(`  ${i.toString().padStart(4)}  ${x.toFixed(4).padStart(8)}  ${y.toFixed(4).padStart(8)}  ${fVal.toFixed(6)}`);
        }
      }
      
      const finalVal = evaluate(func, { x, y });
      results.push(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      results.push(`Converged to:`);
      results.push(`  x* = ${x.toFixed(6)}`);
      results.push(`  y* = ${y.toFixed(6)}`);
      results.push(`  f(x*,y*) = ${finalVal.toFixed(6)}`);
      
      setResult(results.join('\n'));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Invalid input'}`);
    }
  };

  const newtonMethod = () => {
    try {
      const func = inputs.newtonFunc || 'x^3 - 2*x - 5';
      let x = parseFloat(inputs.newtonStart || '2');
      const tol = parseFloat(inputs.newtonTol || '0.000001');
      
      const results: string[] = [];
      results.push(`Newton's Method: f(x) = ${func}`);
      results.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      const df = derivative(func, 'x').toString();
      results.push(`f'(x) = ${df}`);
      results.push(`\nStarting point: x₀ = ${x}`);
      results.push(`Tolerance: ${tol}`);
      results.push(`\n  Iter      x            f(x)`);
      results.push('─────────────────────────────────');
      
      for (let i = 0; i < 50; i++) {
        const fx = evaluate(func, { x });
        const dfx = evaluate(df, { x });
        
        results.push(`  ${i.toString().padStart(4)}  ${x.toFixed(8)}  ${fx.toFixed(10)}`);
        
        if (Math.abs(fx) < tol) {
          results.push(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
          results.push(`Converged in ${i} iterations!`);
          results.push(`Root: x = ${x.toFixed(10)}`);
          break;
        }
        
        if (Math.abs(dfx) < 1e-10) {
          results.push(`\nDerivative near zero - method failed`);
          break;
        }
        
        x = x - fx / dfx;
      }
      
      setResult(results.join('\n'));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Invalid input'}`);
    }
  };

  return (
    <Card className="glass-panel">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-primary">Optimization</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="calculus" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="calculus">Calculus</TabsTrigger>
            <TabsTrigger value="lp">Linear Prog.</TabsTrigger>
            <TabsTrigger value="numerical">Numerical</TabsTrigger>
          </TabsList>

          <TabsContent value="calculus" className="space-y-4">
            <div>
              <Label className="text-xs">f(x)</Label>
              <Input placeholder="x^3 - 3*x" onChange={(e) => updateInput('function', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="x min" defaultValue="-10" onChange={(e) => updateInput('xMin', e.target.value)} />
              <Input placeholder="x max" defaultValue="10" onChange={(e) => updateInput('xMax', e.target.value)} />
            </div>
            <Button onClick={findCriticalPoints} className="w-full">Find Extrema</Button>
            
            <div className="border-t pt-3 mt-3">
              <Label className="text-xs">Newton's Method (Root Finding)</Label>
              <Input className="mt-2" placeholder="f(x) = 0" onChange={(e) => updateInput('newtonFunc', e.target.value)} />
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Input placeholder="Start x₀" onChange={(e) => updateInput('newtonStart', e.target.value)} />
                <Input placeholder="Tolerance" defaultValue="0.000001" onChange={(e) => updateInput('newtonTol', e.target.value)} />
              </div>
              <Button onClick={newtonMethod} className="w-full mt-2" variant="outline">Run Newton's Method</Button>
            </div>
          </TabsContent>

          <TabsContent value="lp" className="space-y-4">
            <Label className="text-xs text-muted-foreground">Maximize Z = c₁x + c₂y</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="c₁ (x coeff)" onChange={(e) => updateInput('objX', e.target.value)} />
              <Input placeholder="c₂ (y coeff)" onChange={(e) => updateInput('objY', e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Constraints (one per line)</Label>
              <textarea 
                className="w-full h-24 p-2 text-xs font-mono bg-muted/50 rounded-lg border border-border"
                placeholder="2x + y <= 20&#10;x + 2y <= 20&#10;x >= 0&#10;y >= 0"
                onChange={(e) => updateInput('constraints', e.target.value)}
              />
            </div>
            <Button onClick={solveLinearProgramming} className="w-full">Solve LP</Button>
          </TabsContent>

          <TabsContent value="numerical" className="space-y-4">
            <Label className="text-xs text-muted-foreground">Gradient Descent (2D)</Label>
            <Input placeholder="f(x,y) = x^2 + y^2" onChange={(e) => updateInput('gdFunction', e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Start x" defaultValue="5" onChange={(e) => updateInput('gdStartX', e.target.value)} />
              <Input placeholder="Start y" defaultValue="5" onChange={(e) => updateInput('gdStartY', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Learning rate α" defaultValue="0.1" onChange={(e) => updateInput('gdAlpha', e.target.value)} />
              <Input placeholder="Iterations" defaultValue="100" onChange={(e) => updateInput('gdIterations', e.target.value)} />
            </div>
            <Button onClick={gradientDescent} className="w-full">Run Gradient Descent</Button>
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
