import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { evaluate, derivative, parse } from 'mathjs';

export function ParametricPolarCalculator() {
  const [parametricX, setParametricX] = useState('cos(t)');
  const [parametricY, setParametricY] = useState('sin(t)');
  const [polarR, setPolarR] = useState('2 + cos(3*theta)');
  const [tMin, setTMin] = useState('0');
  const [tMax, setTMax] = useState('2*pi');
  const [asymptoteFunc, setAsymptoteFunc] = useState('1/x');
  const [result, setResult] = useState<string>('');

  const evaluateParametric = () => {
    try {
      const tMinVal = evaluate(tMin);
      const tMaxVal = evaluate(tMax);
      const points: { t: number; x: number; y: number }[] = [];
      const steps = 20;
      
      for (let i = 0; i <= steps; i++) {
        const t = tMinVal + (tMaxVal - tMinVal) * (i / steps);
        const x = evaluate(parametricX, { t });
        const y = evaluate(parametricY, { t });
        points.push({ t: parseFloat(t.toFixed(4)), x: parseFloat(x.toFixed(4)), y: parseFloat(y.toFixed(4)) });
      }

      // Calculate arc length approximation
      let arcLength = 0;
      for (let i = 1; i < points.length; i++) {
        const dx = points[i].x - points[i-1].x;
        const dy = points[i].y - points[i-1].y;
        arcLength += Math.sqrt(dx*dx + dy*dy);
      }

      setResult(`Parametric Curve: x(t) = ${parametricX}, y(t) = ${parametricY}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Domain: t ∈ [${tMinVal.toFixed(4)}, ${tMaxVal.toFixed(4)}]

Sample Points:
${points.slice(0, 5).map(p => `  t=${p.t}: (${p.x}, ${p.y})`).join('\n')}
  ...

Arc Length (approx): ${arcLength.toFixed(6)}

Derivatives:
  dx/dt = ${derivative(parametricX, 't').toString()}
  dy/dt = ${derivative(parametricY, 't').toString()}
  dy/dx = (dy/dt)/(dx/dt)`);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Invalid expression'}`);
    }
  };

  const evaluatePolar = () => {
    try {
      const points: { theta: number; r: number; x: number; y: number }[] = [];
      const steps = 24;
      
      for (let i = 0; i <= steps; i++) {
        const theta = (2 * Math.PI * i) / steps;
        const r = evaluate(polarR, { theta });
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);
        points.push({
          theta: parseFloat(theta.toFixed(4)),
          r: parseFloat(r.toFixed(4)),
          x: parseFloat(x.toFixed(4)),
          y: parseFloat(y.toFixed(4))
        });
      }

      // Calculate area using polar area formula: A = (1/2)∫r²dθ
      let area = 0;
      const dTheta = (2 * Math.PI) / steps;
      for (const p of points) {
        area += 0.5 * p.r * p.r * dTheta;
      }

      setResult(`Polar Curve: r(θ) = ${polarR}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Domain: θ ∈ [0, 2π]

Sample Points:
${points.slice(0, 6).map(p => `  θ=${(p.theta * 180 / Math.PI).toFixed(0)}°: r=${p.r}, (${p.x}, ${p.y})`).join('\n')}
  ...

Enclosed Area (approx): ${Math.abs(area).toFixed(6)}

Conversion Formulas:
  x = r·cos(θ) = (${polarR})·cos(θ)
  y = r·sin(θ) = (${polarR})·sin(θ)`);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Invalid expression'}`);
    }
  };

  const findAsymptotes = () => {
    try {
      const results: string[] = [];
      
      // Vertical asymptotes - find where denominator = 0
      results.push(`Function: f(x) = ${asymptoteFunc}`);
      results.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Check for vertical asymptotes by testing limits
      const testPoints = [-1000, -100, -10, -1, -0.1, 0, 0.1, 1, 10, 100, 1000];
      const verticalAsymptotes: number[] = [];
      
      for (let x = -10; x <= 10; x += 0.1) {
        try {
          const val = evaluate(asymptoteFunc, { x });
          const valNext = evaluate(asymptoteFunc, { x: x + 0.01 });
          if (Math.abs(val) > 1000 || Math.abs(valNext) > 1000) {
            const rounded = Math.round(x * 10) / 10;
            if (!verticalAsymptotes.some(v => Math.abs(v - rounded) < 0.2)) {
              verticalAsymptotes.push(rounded);
            }
          }
        } catch {
          // Point where function is undefined
        }
      }

      if (verticalAsymptotes.length > 0) {
        results.push(`\nVertical Asymptotes: ${verticalAsymptotes.map(v => `x = ${v}`).join(', ')}`);
      }

      // Horizontal asymptotes - check limits as x → ±∞
      try {
        const limPosInf = evaluate(asymptoteFunc, { x: 100000 });
        const limNegInf = evaluate(asymptoteFunc, { x: -100000 });
        
        if (Math.abs(limPosInf) < 1000) {
          results.push(`Horizontal Asymptote (x→+∞): y = ${limPosInf.toFixed(6)}`);
        }
        if (Math.abs(limNegInf) < 1000 && Math.abs(limPosInf - limNegInf) > 0.0001) {
          results.push(`Horizontal Asymptote (x→-∞): y = ${limNegInf.toFixed(6)}`);
        }
      } catch {
        results.push('Could not determine horizontal asymptotes');
      }

      // Oblique asymptotes - check if limit of f(x)/x exists
      try {
        const slope = evaluate(asymptoteFunc, { x: 100000 }) / 100000;
        if (Math.abs(slope) > 0.0001 && Math.abs(slope) < 1000) {
          const intercept = evaluate(asymptoteFunc, { x: 100000 }) - slope * 100000;
          if (Math.abs(intercept) < 1000) {
            results.push(`Oblique Asymptote: y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}`);
          }
        }
      } catch {
        // No oblique asymptote
      }

      setResult(results.join('\n'));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Invalid expression'}`);
    }
  };

  return (
    <Card className="glass-panel">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-primary">Parametric, Polar & Asymptotes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="parametric" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="parametric">Parametric</TabsTrigger>
            <TabsTrigger value="polar">Polar</TabsTrigger>
            <TabsTrigger value="asymptotes">Asymptotes</TabsTrigger>
          </TabsList>

          <TabsContent value="parametric" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">x(t)</Label>
                <Input
                  value={parametricX}
                  onChange={(e) => setParametricX(e.target.value)}
                  placeholder="cos(t)"
                  className="font-mono text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">y(t)</Label>
                <Input
                  value={parametricY}
                  onChange={(e) => setParametricY(e.target.value)}
                  placeholder="sin(t)"
                  className="font-mono text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">t min</Label>
                <Input
                  value={tMin}
                  onChange={(e) => setTMin(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">t max</Label>
                <Input
                  value={tMax}
                  onChange={(e) => setTMax(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
            </div>
            <Button onClick={evaluateParametric} className="w-full">Evaluate Parametric Curve</Button>
          </TabsContent>

          <TabsContent value="polar" className="space-y-4">
            <div>
              <Label className="text-xs">r(θ)</Label>
              <Input
                value={polarR}
                onChange={(e) => setPolarR(e.target.value)}
                placeholder="2 + cos(3*theta)"
                className="font-mono text-sm"
              />
            </div>
            <div className="text-xs text-muted-foreground">
              Use 'theta' for θ. Examples: 2*cos(theta), 1 + sin(theta), theta/pi
            </div>
            <Button onClick={evaluatePolar} className="w-full">Evaluate Polar Curve</Button>
          </TabsContent>

          <TabsContent value="asymptotes" className="space-y-4">
            <div>
              <Label className="text-xs">f(x)</Label>
              <Input
                value={asymptoteFunc}
                onChange={(e) => setAsymptoteFunc(e.target.value)}
                placeholder="1/x, (x^2-1)/(x-2), etc."
                className="font-mono text-sm"
              />
            </div>
            <Button onClick={findAsymptotes} className="w-full">Find Asymptotes</Button>
          </TabsContent>
        </Tabs>

        {result && (
          <pre className="mt-4 p-3 bg-muted/50 rounded-lg text-xs font-mono whitespace-pre-wrap overflow-x-auto max-h-64 overflow-y-auto">
            {result}
          </pre>
        )}
      </CardContent>
    </Card>
  );
}
