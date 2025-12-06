import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function TopologyCalculator() {
  const [result, setResult] = useState<string>('');
  const [inputs, setInputs] = useState<Record<string, string>>({});

  const updateInput = (key: string, value: string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const showTopologyBasics = () => {
    const results = `Topology Fundamentals
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📐 Topological Space (X, τ):
A set X with a collection τ of subsets satisfying:
1. ∅, X ∈ τ
2. Arbitrary unions of sets in τ are in τ
3. Finite intersections of sets in τ are in τ

Sets in τ are called "open sets"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Common Topologies:

Discrete: τ = P(X) (all subsets)
  - Every set is open
  - Finest possible topology

Indiscrete: τ = {∅, X}
  - Only ∅ and X are open
  - Coarsest possible topology

Standard on ℝ:
  - Open intervals (a,b) form a basis
  - Open sets = unions of open intervals

Cofinite: τ = {U : X\\U is finite} ∪ {∅}
  - Closed sets are finite

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Key Concepts:

Closed Set: Complement of an open set
Interior: Largest open set contained in A
Closure: Smallest closed set containing A
Boundary: cl(A) ∩ cl(X\\A)
Dense Set: cl(A) = X

Continuous Function f: X → Y:
  f⁻¹(V) is open in X for every open V in Y

Homeomorphism:
  Continuous bijection with continuous inverse
  "Topological equivalence"`;

    setResult(results);
  };

  const showCompactness = () => {
    const results = `Compactness
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Definition:
X is compact if every open cover has 
a finite subcover.

Open cover: {Uα} with ∪Uα ⊇ X
Subcover: A subset that still covers X

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Theorems:

Heine-Borel (in ℝⁿ):
  Compact ⟺ Closed and Bounded

Extreme Value Theorem:
  If f: X → ℝ is continuous and X is compact,
  then f attains its max and min.

Closed in Compact is Compact:
  If K ⊂ X is closed and X is compact,
  then K is compact.

Compact in Hausdorff is Closed:
  If K ⊂ X is compact and X is Hausdorff,
  then K is closed.

Product Theorem (Tychonoff):
  Product of compact spaces is compact.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Related Concepts:

Sequentially Compact:
  Every sequence has a convergent subsequence.
  (Equivalent to compactness in metric spaces)

Limit Point Compact:
  Every infinite set has a limit point.

Locally Compact:
  Every point has a compact neighborhood.

Examples:
  Compact: [0,1], Sⁿ, Tⁿ (torus)
  Not Compact: (0,1), ℝ, ℤ`;

    setResult(results);
  };

  const showConnectedness = () => {
    const results = `Connectedness
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Definition:
X is connected if it cannot be written as
a union of two disjoint nonempty open sets.

Equivalently:
Only clopen sets are ∅ and X.
(Clopen = both closed and open)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Theorems:

Intermediate Value Theorem:
  If f: X → ℝ is continuous and X is connected,
  then f(X) is an interval.

Continuous Image of Connected:
  If f: X → Y is continuous and X is connected,
  then f(X) is connected.

Union of Connected Sets:
  If {Aα} are connected and ∩Aα ≠ ∅,
  then ∪Aα is connected.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Related Concepts:

Path Connected:
  Any two points can be joined by a path.
  (Stronger than connected)

Simply Connected:
  Connected + every loop can be contracted.
  π₁(X) = 0 (trivial fundamental group)

Components:
  Maximal connected subsets.
  Partition the space.

Examples:
  Connected: ℝ, intervals, Sⁿ (n≥1)
  Path Connected: all above
  Not Connected: ℚ, {0,1}, ℝ\\{0}
  Connected but not Path Connected:
    Topologist's sine curve`;

    setResult(results);
  };

  const calculateEulerCharacteristic = () => {
    try {
      const v = parseInt(inputs.vertices || '0');
      const e = parseInt(inputs.edges || '0');
      const f = parseInt(inputs.faces || '0');
      
      const results: string[] = [];
      results.push(`Euler Characteristic Calculator`);
      results.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      const chi = v - e + f;
      
      results.push(`\nFor surface/polyhedron:`);
      results.push(`  V (vertices) = ${v}`);
      results.push(`  E (edges) = ${e}`);
      results.push(`  F (faces) = ${f}`);
      results.push(`\n  χ = V - E + F = ${v} - ${e} + ${f} = ${chi}`);
      
      results.push(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      results.push(`Known Euler Characteristics:`);
      results.push(`\n  Sphere S²: χ = 2`);
      results.push(`  Torus T²: χ = 0`);
      results.push(`  Projective Plane ℝP²: χ = 1`);
      results.push(`  Klein Bottle: χ = 0`);
      results.push(`  g-Torus (genus g): χ = 2 - 2g`);
      
      // Identify surface
      if (chi === 2) {
        results.push(`\n⟹ Your surface is topologically a sphere!`);
      } else if (chi === 0) {
        results.push(`\n⟹ Your surface could be a torus or Klein bottle`);
      } else if (chi === 1) {
        results.push(`\n⟹ Your surface could be a projective plane`);
      } else if (chi < 2 && chi % 2 === 0) {
        const genus = (2 - chi) / 2;
        results.push(`\n⟹ If orientable: genus ${genus} surface (${genus}-torus)`);
      }
      
      results.push(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      results.push(`Classification Theorem:`);
      results.push(`Every compact connected surface is:`);
      results.push(`  • Sphere (χ=2), or`);
      results.push(`  • Connected sum of g tori (χ=2-2g), or`);
      results.push(`  • Connected sum of k projective planes (χ=2-k)`);
      
      setResult(results.join('\n'));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Invalid input'}`);
    }
  };

  const showFundamentalGroup = () => {
    const results = `Fundamental Group π₁
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Definition:
π₁(X, x₀) = homotopy classes of loops based at x₀

Group operation: concatenation of paths

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Common Fundamental Groups:

Space               π₁
────────────────────────────────
Point               {e} (trivial)
ℝⁿ                  {e}
Sⁿ (n ≥ 2)          {e}
S¹ (circle)         ℤ
Torus T²            ℤ × ℤ
g-Torus             ⟨a₁,b₁,...,aₙ,bₙ | ∏[aᵢ,bᵢ]=1⟩
ℝP²                 ℤ/2ℤ
Klein Bottle        ⟨a,b | abab⁻¹=1⟩
Figure-8            Free group F₂

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Theorems:

Van Kampen's Theorem:
  π₁(X∪Y) can be computed from
  π₁(X), π₁(Y), π₁(X∩Y)

Covering Space Correspondence:
  Covering spaces of X correspond to
  subgroups of π₁(X)

Universal Cover:
  Simply connected covering space.
  π₁(X) = Deck transformations.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Higher Homotopy Groups:

πₙ(X) = [Sⁿ, X] (homotopy classes of maps)

πₙ(Sᵐ):
  = {e} if n < m
  = ℤ if n = m
  ≠ {e} for many n > m (complex!)

Example: π₃(S²) = ℤ (Hopf fibration)`;

    setResult(results);
  };

  const showMetricSpaces = () => {
    const results = `Metric Spaces
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Definition:
A metric space (X, d) has distance function
d: X × X → ℝ satisfying:

1. d(x,y) ≥ 0 (non-negativity)
2. d(x,y) = 0 ⟺ x = y (identity)
3. d(x,y) = d(y,x) (symmetry)
4. d(x,z) ≤ d(x,y) + d(y,z) (triangle ineq)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Common Metrics on ℝⁿ:

Euclidean (L²):
  d(x,y) = √(Σ(xᵢ-yᵢ)²)

Manhattan (L¹):
  d(x,y) = Σ|xᵢ-yᵢ|

Chebyshev (L∞):
  d(x,y) = max|xᵢ-yᵢ|

p-metric (Lᵖ):
  d(x,y) = (Σ|xᵢ-yᵢ|ᵖ)^(1/p)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Key Concepts:

Open Ball: B(x,r) = {y : d(x,y) < r}
Closed Ball: B̄(x,r) = {y : d(x,y) ≤ r}

Cauchy Sequence:
  For all ε>0, ∃N: m,n>N ⟹ d(xₘ,xₙ)<ε

Complete Metric Space:
  Every Cauchy sequence converges.

Bounded Set:
  A ⊂ X is bounded if diam(A) < ∞
  diam(A) = sup{d(x,y) : x,y ∈ A}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Contraction Mapping Theorem:
  If f: X → X is a contraction on complete X,
  then f has a unique fixed point.`;

    setResult(results);
  };

  return (
    <Card className="glass-panel">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-primary">Topology</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="basics" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="basics">Basics</TabsTrigger>
            <TabsTrigger value="surfaces">Surfaces</TabsTrigger>
            <TabsTrigger value="algebraic">Algebraic</TabsTrigger>
          </TabsList>

          <TabsContent value="basics" className="space-y-3">
            <Button onClick={showTopologyBasics} className="w-full" variant="outline">
              Topological Spaces
            </Button>
            <Button onClick={showMetricSpaces} className="w-full" variant="outline">
              Metric Spaces
            </Button>
            <Button onClick={showCompactness} className="w-full" variant="outline">
              Compactness
            </Button>
            <Button onClick={showConnectedness} className="w-full" variant="outline">
              Connectedness
            </Button>
          </TabsContent>

          <TabsContent value="surfaces" className="space-y-4">
            <Label className="text-xs">Euler Characteristic Calculator</Label>
            <div className="grid grid-cols-3 gap-2">
              <Input placeholder="Vertices (V)" onChange={(e) => updateInput('vertices', e.target.value)} />
              <Input placeholder="Edges (E)" onChange={(e) => updateInput('edges', e.target.value)} />
              <Input placeholder="Faces (F)" onChange={(e) => updateInput('faces', e.target.value)} />
            </div>
            <Button onClick={calculateEulerCharacteristic} className="w-full">
              Calculate χ = V - E + F
            </Button>
            
            <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted/30 rounded">
              Examples: Tetrahedron (4,6,4)→χ=2, Cube (8,12,6)→χ=2
            </div>
          </TabsContent>

          <TabsContent value="algebraic" className="space-y-3">
            <Button onClick={showFundamentalGroup} className="w-full" variant="outline">
              Fundamental Group π₁
            </Button>
            <div className="p-3 bg-muted/30 rounded-lg text-xs">
              <p className="font-semibold mb-2">Quick Reference:</p>
              <p>π₁(S¹) = ℤ</p>
              <p>π₁(T²) = ℤ × ℤ</p>
              <p>π₁(S² ) = 0</p>
              <p>π₁(figure-8) = F₂ (free group)</p>
            </div>
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
