import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { evaluate } from 'mathjs';

export function RealAnalysisCalculator() {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string>('');

  const updateInput = (key: string, value: string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const analyzeSequence = () => {
    try {
      const formula = inputs.sequence || 'n/(n+1)';
      const terms = parseInt(inputs.numTerms || '15');
      
      const results: string[] = [];
      results.push(`Sequence Analysis: aₙ = ${formula}`);
      results.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      const values: number[] = [];
      results.push(`\nFirst ${Math.min(terms, 15)} terms:`);
      for (let n = 1; n <= terms; n++) {
        const val = evaluate(formula, { n });
        values.push(val);
        if (n <= 15) {
          results.push(`  a_${n} = ${val.toFixed(6)}`);
        }
      }
      
      // Check monotonicity
      let increasing = true;
      let decreasing = true;
      for (let i = 1; i < values.length; i++) {
        if (values[i] <= values[i-1]) increasing = false;
        if (values[i] >= values[i-1]) decreasing = false;
      }
      
      results.push(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      results.push(`Properties:`);
      results.push(`  Monotone increasing: ${increasing ? 'Yes' : 'No'}`);
      results.push(`  Monotone decreasing: ${decreasing ? 'No' : 'No'}`);
      
      // Bounds
      const sup = Math.max(...values);
      const inf = Math.min(...values);
      results.push(`  Supremum (approx): ${sup.toFixed(6)}`);
      results.push(`  Infimum (approx): ${inf.toFixed(6)}`);
      results.push(`  Bounded: ${Math.abs(sup) < 1e10 && Math.abs(inf) < 1e10 ? 'Yes' : 'Maybe not'}`);
      
      // Estimate limit
      const lastValues = values.slice(-5);
      const avgLast = lastValues.reduce((a, b) => a + b, 0) / lastValues.length;
      const variance = lastValues.reduce((s, v) => s + (v - avgLast) ** 2, 0) / lastValues.length;
      
      if (variance < 0.0001) {
        results.push(`\n  Appears to converge to: ${avgLast.toFixed(6)}`);
      } else {
        results.push(`\n  Sequence may diverge or converge slowly`);
      }
      
      // Check if Cauchy
      const isCauchy = values.slice(-10).every((v, i, arr) => 
        i === 0 || Math.abs(v - arr[i-1]) < 0.01
      );
      results.push(`  Cauchy (approx): ${isCauchy ? 'Yes' : 'Unclear'}`);
      
      setResult(results.join('\n'));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Invalid input'}`);
    }
  };

  const analyzeSeries = () => {
    try {
      const formula = inputs.seriesTerm || '1/n^2';
      const terms = parseInt(inputs.seriesTerms || '100');
      
      const results: string[] = [];
      results.push(`Series Analysis: Σ aₙ where aₙ = ${formula}`);
      results.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      let partialSum = 0;
      const partialSums: { n: number; sum: number }[] = [];
      
      for (let n = 1; n <= terms; n++) {
        const term = evaluate(formula, { n });
        partialSum += term;
        if (n <= 10 || n === terms || n % (terms / 5) < 1) {
          partialSums.push({ n, sum: partialSum });
        }
      }
      
      results.push(`\nPartial Sums S_n = Σₖ₌₁ⁿ aₖ:`);
      for (const ps of partialSums.slice(0, 12)) {
        results.push(`  S_${ps.n} = ${ps.sum.toFixed(8)}`);
      }
      
      // Convergence tests
      results.push(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      results.push(`Convergence Analysis:`);
      
      // Term test (necessary condition)
      const lastTerm = evaluate(formula, { n: terms });
      results.push(`\n  Term Test: lim aₙ = ${lastTerm.toFixed(8)}`);
      if (Math.abs(lastTerm) > 0.0001) {
        results.push(`    ⟹ Series DIVERGES (terms don't → 0)`);
      } else {
        results.push(`    ⟹ Inconclusive (terms → 0 is necessary, not sufficient)`);
      }
      
      // Ratio test
      const an = evaluate(formula, { n: terms });
      const anPlus1 = evaluate(formula, { n: terms + 1 });
      const ratio = Math.abs(anPlus1 / an);
      results.push(`\n  Ratio Test: |a_{n+1}/aₙ| → ${ratio.toFixed(6)}`);
      if (ratio < 1) {
        results.push(`    ⟹ Series CONVERGES (ratio < 1)`);
      } else if (ratio > 1) {
        results.push(`    ⟹ Series DIVERGES (ratio > 1)`);
      } else {
        results.push(`    ⟹ Inconclusive (ratio = 1)`);
      }
      
      // Estimated sum
      const lastSums = partialSums.slice(-3).map(ps => ps.sum);
      const sumVariance = lastSums.reduce((s, v, _, arr) => 
        s + (v - arr[arr.length-1]) ** 2, 0);
      
      if (sumVariance < 0.0001) {
        results.push(`\n  Estimated Sum: ${partialSum.toFixed(8)}`);
      }
      
      // Known series
      results.push(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      results.push(`Known Series:`);
      results.push(`  Σ 1/n² = π²/6 ≈ 1.6449`);
      results.push(`  Σ 1/n = ∞ (harmonic, diverges)`);
      results.push(`  Σ 1/2ⁿ = 1 (geometric)`);
      results.push(`  Σ (-1)ⁿ/n = ln(2) ≈ 0.6931`);
      
      setResult(results.join('\n'));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Invalid input'}`);
    }
  };

  const showEpsilonDelta = () => {
    const results = `ε-δ Definitions in Real Analysis
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📐 Limit of a Function:
lim_{x→a} f(x) = L means:
∀ε > 0, ∃δ > 0: 
  0 < |x - a| < δ ⟹ |f(x) - L| < ε

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📐 Continuity at a point:
f is continuous at a if:
∀ε > 0, ∃δ > 0:
  |x - a| < δ ⟹ |f(x) - f(a)| < ε

Equivalently: lim_{x→a} f(x) = f(a)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📐 Sequence Convergence:
(aₙ) → L means:
∀ε > 0, ∃N ∈ ℕ:
  n > N ⟹ |aₙ - L| < ε

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📐 Cauchy Sequence:
(aₙ) is Cauchy if:
∀ε > 0, ∃N ∈ ℕ:
  m, n > N ⟹ |aₘ - aₙ| < ε

Theorem: In ℝ, Cauchy ⟺ Convergent

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📐 Uniform Continuity:
f: D → ℝ is uniformly continuous if:
∀ε > 0, ∃δ > 0:
  ∀x, y ∈ D: |x - y| < δ ⟹ |f(x) - f(y)| < ε

(Same δ works for all points!)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📐 Uniform Convergence:
(fₙ) → f uniformly on D if:
∀ε > 0, ∃N ∈ ℕ:
  n > N ⟹ ∀x ∈ D: |fₙ(x) - f(x)| < ε

(Same N works for all x!)`;

    setResult(results);
  };

  const showIntegrationTheory = () => {
    const results = `Integration Theory
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📐 Riemann Integral:
Partition P = {x₀, x₁, ..., xₙ}
Lower sum: L(f,P) = Σ (inf f on [xᵢ,xᵢ₊₁]) Δxᵢ
Upper sum: U(f,P) = Σ (sup f on [xᵢ,xᵢ₊₁]) Δxᵢ

f is Riemann integrable if:
  sup L(f,P) = inf U(f,P)
  
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Key Theorems:

Fundamental Theorem of Calculus (Part 1):
  If f is continuous on [a,b], then
  F(x) = ∫ₐˣ f(t)dt is differentiable
  and F'(x) = f(x)

Fundamental Theorem (Part 2):
  If F' = f on [a,b], then
  ∫ₐᵇ f(x)dx = F(b) - F(a)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Integrability Conditions:

• Continuous ⟹ Riemann integrable
• Monotone ⟹ Riemann integrable
• Bounded + finitely many discontinuities ⟹ RI
• Riemann integrable ⟹ Lebesgue integrable

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Improper Integrals:

Type I (infinite interval):
  ∫ₐ^∞ f = lim_{b→∞} ∫ₐᵇ f

Type II (unbounded function):
  ∫ₐᵇ f = lim_{c→b⁻} ∫ₐᶜ f  (if f→∞ as x→b)

Comparison Test:
  If 0 ≤ f ≤ g and ∫g converges, then ∫f converges

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Common Results:

∫₀^∞ e⁻ˣ dx = 1
∫₀^∞ e⁻ˣ² dx = √π/2
∫₁^∞ 1/xᵖ dx converges iff p > 1`;

    setResult(results);
  };

  const showDifferentiability = () => {
    const results = `Differentiability
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📐 Definition:
f is differentiable at a if:
  lim_{h→0} [f(a+h) - f(a)]/h exists

This limit = f'(a) = derivative at a

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Implications:

Differentiable ⟹ Continuous
Continuous ⟹̸ Differentiable
  (e.g., |x| at x=0)

Differentiable ⟹ Local linearization:
  f(a+h) ≈ f(a) + f'(a)h

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Key Theorems:

Mean Value Theorem:
  If f is continuous on [a,b] and 
  differentiable on (a,b), then ∃c ∈ (a,b):
  f'(c) = [f(b) - f(a)]/(b - a)

Rolle's Theorem:
  If f(a) = f(b) and f is continuous on [a,b],
  differentiable on (a,b), then ∃c: f'(c) = 0

L'Hôpital's Rule:
  If lim f/g is 0/0 or ∞/∞ form:
  lim f/g = lim f'/g' (if latter exists)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Taylor's Theorem:

f(x) = Σₖ₌₀ⁿ [f⁽ᵏ⁾(a)/k!](x-a)ᵏ + Rₙ(x)

Remainder forms:
  Lagrange: Rₙ = [f⁽ⁿ⁺¹⁾(c)/(n+1)!](x-a)ⁿ⁺¹
  Integral: Rₙ = ∫ₐˣ [f⁽ⁿ⁺¹⁾(t)/n!](x-t)ⁿ dt

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Pathological Examples:

Weierstrass function:
  Continuous everywhere
  Differentiable nowhere!

Cantor function:
  Continuous, increasing
  Derivative = 0 almost everywhere
  Yet goes from 0 to 1`;

    setResult(results);
  };

  const checkConvergence = () => {
    try {
      const formula = inputs.limitFunc || '(1 + 1/n)^n';
      const variable = inputs.limitVar || 'n';
      const toward = inputs.limitToward || 'infinity';
      
      const results: string[] = [];
      results.push(`Limit Evaluation`);
      results.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      results.push(`\nf(${variable}) = ${formula}`);
      results.push(`${variable} → ${toward}`);
      
      // Numerical evaluation
      const testValues = toward === 'infinity' 
        ? [10, 100, 1000, 10000, 100000]
        : toward === '0' 
        ? [0.1, 0.01, 0.001, 0.0001, 0.00001]
        : [parseFloat(toward) + 0.1, parseFloat(toward) + 0.01, parseFloat(toward) + 0.001];
      
      results.push(`\nNumerical approach:`);
      
      for (const val of testValues) {
        try {
          const result = evaluate(formula, { [variable]: val });
          results.push(`  f(${val}) = ${result.toFixed(8)}`);
        } catch {
          results.push(`  f(${val}) = undefined`);
        }
      }
      
      // Estimate limit
      const lastVals = testValues.slice(-3).map(v => {
        try { return evaluate(formula, { [variable]: v }); }
        catch { return NaN; }
      }).filter(v => !isNaN(v));
      
      if (lastVals.length >= 2) {
        const diff = Math.abs(lastVals[lastVals.length - 1] - lastVals[lastVals.length - 2]);
        if (diff < 0.0001) {
          results.push(`\n  Estimated limit: ${lastVals[lastVals.length - 1].toFixed(8)}`);
        } else {
          results.push(`\n  Limit may not exist or converges slowly`);
        }
      }
      
      setResult(results.join('\n'));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Invalid input'}`);
    }
  };

  return (
    <Card className="glass-panel">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-primary">Real Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="sequences" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="sequences">Sequences</TabsTrigger>
            <TabsTrigger value="series">Series</TabsTrigger>
            <TabsTrigger value="theory">Theory</TabsTrigger>
          </TabsList>

          <TabsContent value="sequences" className="space-y-4">
            <div>
              <Label className="text-xs">Sequence formula aₙ (use 'n')</Label>
              <Input placeholder="n/(n+1), 1/n^2, (1+1/n)^n" onChange={(e) => updateInput('sequence', e.target.value)} />
            </div>
            <Input placeholder="Number of terms" defaultValue="15" onChange={(e) => updateInput('numTerms', e.target.value)} />
            <Button onClick={analyzeSequence} className="w-full">Analyze Sequence</Button>
            
            <div className="border-t pt-3 mt-3">
              <Label className="text-xs">Limit Calculator</Label>
              <Input className="mt-2" placeholder="f(n) or f(x)" onChange={(e) => updateInput('limitFunc', e.target.value)} />
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Input placeholder="Variable (n or x)" defaultValue="n" onChange={(e) => updateInput('limitVar', e.target.value)} />
                <Input placeholder="→ (infinity, 0, or value)" defaultValue="infinity" onChange={(e) => updateInput('limitToward', e.target.value)} />
              </div>
              <Button onClick={checkConvergence} className="w-full mt-2" variant="outline">Evaluate Limit</Button>
            </div>
          </TabsContent>

          <TabsContent value="series" className="space-y-4">
            <div>
              <Label className="text-xs">Series term aₙ (use 'n')</Label>
              <Input placeholder="1/n^2, 1/2^n, (-1)^n/n" onChange={(e) => updateInput('seriesTerm', e.target.value)} />
            </div>
            <Input placeholder="Number of terms" defaultValue="100" onChange={(e) => updateInput('seriesTerms', e.target.value)} />
            <Button onClick={analyzeSeries} className="w-full">Analyze Series Convergence</Button>
          </TabsContent>

          <TabsContent value="theory" className="space-y-3">
            <Button onClick={showEpsilonDelta} className="w-full" variant="outline">
              ε-δ Definitions
            </Button>
            <Button onClick={showDifferentiability} className="w-full" variant="outline">
              Differentiability
            </Button>
            <Button onClick={showIntegrationTheory} className="w-full" variant="outline">
              Integration Theory
            </Button>
          </TabsContent>
        </Tabs>

        {result && (
          <pre className="mt-4 p-3 bg-muted/50 rounded-lg text-xs font-mono whitespace-pre-wrap overflow-x-auto max-h-80 overflow-y-auto">
            {result}
          </pre>
        )}
      </CardContent>
    </Card>
  );
}
