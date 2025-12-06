import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

export function DiscreteMathCalculator() {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string>('');

  const updateInput = (key: string, value: string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  // Helper functions
  const factorial = (n: number): number => {
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  };

  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const lcm = (a: number, b: number): number => Math.abs(a * b) / gcd(a, b);

  const isPrime = (n: number): boolean => {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
      if (n % i === 0) return false;
    }
    return true;
  };

  const primeFactors = (n: number): number[] => {
    const factors: number[] = [];
    let num = n;
    for (let i = 2; i <= num; i++) {
      while (num % i === 0) {
        factors.push(i);
        num /= i;
      }
    }
    return factors;
  };

  const calculateCombinatorics = () => {
    try {
      const n = parseInt(inputs.n || '0');
      const r = parseInt(inputs.r || '0');
      
      const results: string[] = [];
      results.push(`Combinatorics: n = ${n}, r = ${r}`);
      results.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Factorial
      results.push(`\nn! = ${factorial(n)}`);
      results.push(`r! = ${factorial(r)}`);
      
      // Permutations
      const perm = factorial(n) / factorial(n - r);
      results.push(`\nPermutations P(n,r) = n!/(n-r)! = ${perm}`);
      
      // Combinations
      const comb = factorial(n) / (factorial(r) * factorial(n - r));
      results.push(`Combinations C(n,r) = n!/[r!(n-r)!] = ${comb}`);
      
      // Permutations with repetition
      results.push(`\nPermutations with repetition: n^r = ${Math.pow(n, r)}`);
      
      // Combinations with repetition
      const combRep = factorial(n + r - 1) / (factorial(r) * factorial(n - 1));
      results.push(`Combinations with repetition: C(n+r-1,r) = ${combRep}`);
      
      // Derangements
      let derangement = 0;
      for (let i = 0; i <= n; i++) {
        derangement += (Math.pow(-1, i) * factorial(n)) / factorial(i);
      }
      results.push(`\nDerangements D(n) = ${Math.round(derangement)}`);
      
      // Catalan number
      const catalan = factorial(2*n) / (factorial(n+1) * factorial(n));
      results.push(`Catalan number C_n = ${catalan}`);
      
      // Stirling numbers (second kind, approximation)
      results.push(`\nBell number B_${n} = ${bellNumber(n)}`);
      
      setResult(results.join('\n'));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Invalid input'}`);
    }
  };

  const bellNumber = (n: number): number => {
    const bell: number[][] = Array(n + 1).fill(0).map(() => Array(n + 1).fill(0));
    bell[0][0] = 1;
    for (let i = 1; i <= n; i++) {
      bell[i][0] = bell[i - 1][i - 1];
      for (let j = 1; j <= i; j++) {
        bell[i][j] = bell[i - 1][j - 1] + bell[i][j - 1];
      }
    }
    return bell[n][0];
  };

  const calculateNumberTheory = () => {
    try {
      const a = parseInt(inputs.numA || '0');
      const b = parseInt(inputs.numB || '0');
      
      const results: string[] = [];
      results.push(`Number Theory: a = ${a}, b = ${b}`);
      results.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      results.push(`\nGCD(${a}, ${b}) = ${gcd(a, b)}`);
      results.push(`LCM(${a}, ${b}) = ${lcm(a, b)}`);
      
      // Extended Euclidean Algorithm
      const extGcd = extendedGcd(a, b);
      results.push(`\nExtended GCD: ${a}×${extGcd.x} + ${b}×${extGcd.y} = ${extGcd.gcd}`);
      
      results.push(`\n${a} is ${isPrime(a) ? '' : 'not '}prime`);
      results.push(`${b} is ${isPrime(b) ? '' : 'not '}prime`);
      
      results.push(`\nPrime factorization:`);
      results.push(`  ${a} = ${primeFactors(a).join(' × ') || a}`);
      results.push(`  ${b} = ${primeFactors(b).join(' × ') || b}`);
      
      // Euler's totient
      results.push(`\nEuler's totient:`);
      results.push(`  φ(${a}) = ${eulerTotient(a)}`);
      results.push(`  φ(${b}) = ${eulerTotient(b)}`);
      
      // Divisors
      const divsA = divisors(a);
      const divsB = divisors(b);
      results.push(`\nDivisors:`);
      results.push(`  σ(${a}) = [${divsA.join(', ')}]`);
      results.push(`  σ(${b}) = [${divsB.join(', ')}]`);
      results.push(`  Sum of divisors: ${a} → ${divsA.reduce((s, d) => s + d, 0)}`);
      
      setResult(results.join('\n'));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Invalid input'}`);
    }
  };

  const extendedGcd = (a: number, b: number): { gcd: number; x: number; y: number } => {
    if (b === 0) return { gcd: a, x: 1, y: 0 };
    const { gcd, x, y } = extendedGcd(b, a % b);
    return { gcd, x: y, y: x - Math.floor(a / b) * y };
  };

  const eulerTotient = (n: number): number => {
    let result = n;
    for (let p = 2; p * p <= n; p++) {
      if (n % p === 0) {
        while (n % p === 0) n /= p;
        result -= result / p;
      }
    }
    if (n > 1) result -= result / n;
    return Math.round(result);
  };

  const divisors = (n: number): number[] => {
    const divs: number[] = [];
    for (let i = 1; i <= Math.sqrt(n); i++) {
      if (n % i === 0) {
        divs.push(i);
        if (i !== n / i) divs.push(n / i);
      }
    }
    return divs.sort((a, b) => a - b);
  };

  const calculateSetOperations = () => {
    try {
      const setA = new Set(inputs.setA?.split(',').map(s => s.trim()) || []);
      const setB = new Set(inputs.setB?.split(',').map(s => s.trim()) || []);
      
      const results: string[] = [];
      results.push(`Set Operations`);
      results.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      results.push(`A = {${[...setA].join(', ')}}`);
      results.push(`B = {${[...setB].join(', ')}}`);
      
      // Union
      const union = new Set([...setA, ...setB]);
      results.push(`\nA ∪ B = {${[...union].join(', ')}}`);
      
      // Intersection
      const intersection = new Set([...setA].filter(x => setB.has(x)));
      results.push(`A ∩ B = {${[...intersection].join(', ')}}`);
      
      // Difference
      const diffAB = new Set([...setA].filter(x => !setB.has(x)));
      const diffBA = new Set([...setB].filter(x => !setA.has(x)));
      results.push(`A - B = {${[...diffAB].join(', ')}}`);
      results.push(`B - A = {${[...diffBA].join(', ')}}`);
      
      // Symmetric difference
      const symDiff = new Set([...diffAB, ...diffBA]);
      results.push(`A △ B = {${[...symDiff].join(', ')}}`);
      
      // Cardinality
      results.push(`\n|A| = ${setA.size}`);
      results.push(`|B| = ${setB.size}`);
      results.push(`|A ∪ B| = ${union.size}`);
      results.push(`|A ∩ B| = ${intersection.size}`);
      
      // Power set size
      results.push(`\n|P(A)| = 2^|A| = ${Math.pow(2, setA.size)}`);
      results.push(`|A × B| = ${setA.size * setB.size}`);
      
      setResult(results.join('\n'));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Invalid input'}`);
    }
  };

  const calculateLogic = () => {
    try {
      const results: string[] = [];
      results.push(`Propositional Logic Truth Tables`);
      results.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      results.push(`\n P | Q | P∧Q | P∨Q | P→Q | P↔Q | ¬P`);
      results.push(`───┼───┼─────┼─────┼─────┼─────┼────`);
      
      const values = [[true, true], [true, false], [false, true], [false, false]];
      for (const [p, q] of values) {
        const and = p && q;
        const or = p || q;
        const implies = !p || q;
        const iff = p === q;
        const notP = !p;
        results.push(` ${p ? 'T' : 'F'} | ${q ? 'T' : 'F'} |  ${and ? 'T' : 'F'}  |  ${or ? 'T' : 'F'}  |  ${implies ? 'T' : 'F'}  |  ${iff ? 'T' : 'F'}  |  ${notP ? 'T' : 'F'}`);
      }
      
      results.push(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      results.push(`Logical Equivalences:`);
      results.push(`• De Morgan's: ¬(P∧Q) ≡ ¬P∨¬Q`);
      results.push(`• De Morgan's: ¬(P∨Q) ≡ ¬P∧¬Q`);
      results.push(`• Implication: P→Q ≡ ¬P∨Q`);
      results.push(`• Contrapositive: P→Q ≡ ¬Q→¬P`);
      results.push(`• Biconditional: P↔Q ≡ (P→Q)∧(Q→P)`);
      results.push(`• Double negation: ¬¬P ≡ P`);
      results.push(`• Distributive: P∧(Q∨R) ≡ (P∧Q)∨(P∧R)`);
      results.push(`• Distributive: P∨(Q∧R) ≡ (P∨Q)∧(P∨R)`);
      
      setResult(results.join('\n'));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Invalid input'}`);
    }
  };

  const calculateGraph = () => {
    try {
      const vertices = parseInt(inputs.vertices || '0');
      const edges = parseInt(inputs.edges || '0');
      
      const results: string[] = [];
      results.push(`Graph Theory: V = ${vertices}, E = ${edges}`);
      results.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Complete graph
      const completeEdges = (vertices * (vertices - 1)) / 2;
      results.push(`\nComplete graph K_${vertices}:`);
      results.push(`  Edges: ${completeEdges}`);
      results.push(`  Is complete: ${edges === completeEdges ? 'Yes' : 'No'}`);
      
      // Euler's formula for planar graphs
      const faces = 2 - vertices + edges;
      results.push(`\nEuler's formula (planar): V - E + F = 2`);
      results.push(`  Faces (if planar): ${faces}`);
      
      // Check if planar (necessary condition)
      const isPlanarPossible = edges <= 3 * vertices - 6;
      results.push(`  Possibly planar: ${isPlanarPossible ? 'Yes' : 'No'} (E ≤ 3V - 6)`);
      
      // Handshaking lemma
      const avgDegree = (2 * edges) / vertices;
      results.push(`\nHandshaking lemma: Σdeg(v) = 2E = ${2 * edges}`);
      results.push(`  Average degree: ${avgDegree.toFixed(2)}`);
      
      // Tree properties
      results.push(`\nTree with ${vertices} vertices:`);
      results.push(`  Must have exactly ${vertices - 1} edges`);
      results.push(`  Current graph: ${edges === vertices - 1 ? 'Could be a tree' : 'Not a tree'}`);
      
      // Chromatic number bounds
      results.push(`\nChromatic number bounds:`);
      results.push(`  χ(G) ≥ clique number ω(G)`);
      results.push(`  χ(G) ≤ Δ(G) + 1 (max degree + 1)`);
      
      // Special graphs
      results.push(`\nSpecial graphs with ${vertices} vertices:`);
      results.push(`  Cycle C_${vertices}: ${vertices} edges`);
      results.push(`  Path P_${vertices}: ${vertices - 1} edges`);
      results.push(`  Star S_${vertices}: ${vertices - 1} edges`);
      results.push(`  Wheel W_${vertices}: ${2 * (vertices - 1)} edges`);
      
      setResult(results.join('\n'));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Invalid input'}`);
    }
  };

  const calculateRecurrence = () => {
    try {
      const results: string[] = [];
      results.push(`Recurrence Relations`);
      results.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Calculate based on type
      const type = inputs.recurrenceType || 'fibonacci';
      const n = parseInt(inputs.recN || '10');
      
      if (type === 'fibonacci') {
        const fib = [0, 1];
        for (let i = 2; i <= n; i++) fib[i] = fib[i-1] + fib[i-2];
        results.push(`\nFibonacci: F(n) = F(n-1) + F(n-2)`);
        results.push(`F(0) = 0, F(1) = 1`);
        results.push(`\nFirst ${n + 1} terms:`);
        results.push(fib.slice(0, Math.min(n + 1, 15)).join(', ') + (n > 14 ? '...' : ''));
        results.push(`\nF(${n}) = ${fib[n]}`);
        results.push(`\nClosed form: F(n) = (φⁿ - ψⁿ)/√5`);
        results.push(`where φ = (1+√5)/2 ≈ 1.618 (golden ratio)`);
      } else if (type === 'lucas') {
        const luc = [2, 1];
        for (let i = 2; i <= n; i++) luc[i] = luc[i-1] + luc[i-2];
        results.push(`\nLucas: L(n) = L(n-1) + L(n-2)`);
        results.push(`L(0) = 2, L(1) = 1`);
        results.push(`\nFirst ${n + 1} terms:`);
        results.push(luc.slice(0, Math.min(n + 1, 15)).join(', ') + (n > 14 ? '...' : ''));
        results.push(`\nL(${n}) = ${luc[n]}`);
      } else if (type === 'tribonacci') {
        const trib = [0, 0, 1];
        for (let i = 3; i <= n; i++) trib[i] = trib[i-1] + trib[i-2] + trib[i-3];
        results.push(`\nTribonacci: T(n) = T(n-1) + T(n-2) + T(n-3)`);
        results.push(`T(0) = T(1) = 0, T(2) = 1`);
        results.push(`\nFirst ${n + 1} terms:`);
        results.push(trib.slice(0, Math.min(n + 1, 15)).join(', ') + (n > 14 ? '...' : ''));
        results.push(`\nT(${n}) = ${trib[n]}`);
      }
      
      results.push(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      results.push(`Solving Linear Recurrences:`);
      results.push(`\n1. Find characteristic equation`);
      results.push(`2. Solve for roots r₁, r₂, ...`);
      results.push(`3. General solution: aₙ = c₁r₁ⁿ + c₂r₂ⁿ + ...`);
      results.push(`4. Use initial conditions to find c₁, c₂, ...`);
      
      setResult(results.join('\n'));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Invalid input'}`);
    }
  };

  const calculateModular = () => {
    try {
      const a = parseInt(inputs.modA || '0');
      const b = parseInt(inputs.modB || '0');
      const m = parseInt(inputs.modM || '1');
      
      const results: string[] = [];
      results.push(`Modular Arithmetic (mod ${m})`);
      results.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      results.push(`\na ≡ ${((a % m) + m) % m} (mod ${m})`);
      results.push(`b ≡ ${((b % m) + m) % m} (mod ${m})`);
      
      results.push(`\nOperations:`);
      results.push(`  (a + b) mod ${m} = ${((a + b) % m + m) % m}`);
      results.push(`  (a - b) mod ${m} = ${((a - b) % m + m) % m}`);
      results.push(`  (a × b) mod ${m} = ${((a * b) % m + m) % m}`);
      
      // Modular exponentiation
      const exp = parseInt(inputs.modExp || '2');
      let modPow = 1n;
      let base = BigInt(a);
      let exponent = BigInt(exp);
      const mod = BigInt(m);
      while (exponent > 0n) {
        if (exponent % 2n === 1n) modPow = (modPow * base) % mod;
        base = (base * base) % mod;
        exponent = exponent / 2n;
      }
      results.push(`  a^${exp} mod ${m} = ${modPow}`);
      
      // Modular inverse (if exists)
      const g = gcd(a, m);
      if (g === 1) {
        const inv = extendedGcd(a, m).x;
        results.push(`  a⁻¹ mod ${m} = ${((inv % m) + m) % m}`);
      } else {
        results.push(`  a⁻¹ mod ${m} = DNE (gcd(${a},${m}) ≠ 1)`);
      }
      
      // Fermat's little theorem
      if (isPrime(m)) {
        results.push(`\nFermat's Little Theorem (${m} is prime):`);
        results.push(`  a^(${m}-1) ≡ 1 (mod ${m}) when gcd(a,${m}) = 1`);
      }
      
      // Chinese Remainder Theorem hint
      results.push(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      results.push(`Chinese Remainder Theorem:`);
      results.push(`For coprime moduli m₁, m₂, ..., mₖ:`);
      results.push(`System x ≡ aᵢ (mod mᵢ) has unique solution`);
      results.push(`modulo M = m₁ × m₂ × ... × mₖ`);
      
      setResult(results.join('\n'));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Invalid input'}`);
    }
  };

  return (
    <Card className="glass-panel">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-primary">Discrete Mathematics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="combinatorics" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="combinatorics">Counting</TabsTrigger>
            <TabsTrigger value="number">Number</TabsTrigger>
            <TabsTrigger value="sets">Sets/Logic</TabsTrigger>
            <TabsTrigger value="graphs">Graphs</TabsTrigger>
          </TabsList>

          <TabsContent value="combinatorics" className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="n" onChange={(e) => updateInput('n', e.target.value)} />
              <Input placeholder="r" onChange={(e) => updateInput('r', e.target.value)} />
            </div>
            <Button onClick={calculateCombinatorics} className="w-full">Calculate Combinatorics</Button>
            
            <div className="border-t pt-3 mt-3">
              <Label className="text-xs text-muted-foreground">Recurrence Relations</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={() => { updateInput('recurrenceType', 'fibonacci'); calculateRecurrence(); }}>Fibonacci</Button>
                <Button variant="outline" size="sm" onClick={() => { updateInput('recurrenceType', 'lucas'); calculateRecurrence(); }}>Lucas</Button>
                <Button variant="outline" size="sm" onClick={() => { updateInput('recurrenceType', 'tribonacci'); calculateRecurrence(); }}>Tribonacci</Button>
              </div>
              <Input className="mt-2" placeholder="n (terms)" onChange={(e) => updateInput('recN', e.target.value)} />
            </div>
          </TabsContent>

          <TabsContent value="number" className="space-y-4">
            <Label className="text-xs text-muted-foreground">Number Theory</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="a" onChange={(e) => updateInput('numA', e.target.value)} />
              <Input placeholder="b" onChange={(e) => updateInput('numB', e.target.value)} />
            </div>
            <Button onClick={calculateNumberTheory} className="w-full">Analyze Numbers</Button>
            
            <div className="border-t pt-3 mt-3">
              <Label className="text-xs text-muted-foreground">Modular Arithmetic</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Input placeholder="a" onChange={(e) => updateInput('modA', e.target.value)} />
                <Input placeholder="b" onChange={(e) => updateInput('modB', e.target.value)} />
                <Input placeholder="mod m" onChange={(e) => updateInput('modM', e.target.value)} />
              </div>
              <Input className="mt-2" placeholder="exponent (for a^exp mod m)" onChange={(e) => updateInput('modExp', e.target.value)} />
              <Button onClick={calculateModular} className="w-full mt-2">Calculate Modular</Button>
            </div>
          </TabsContent>

          <TabsContent value="sets" className="space-y-4">
            <Label className="text-xs text-muted-foreground">Set Operations (comma-separated elements)</Label>
            <Input placeholder="Set A: a, b, c" onChange={(e) => updateInput('setA', e.target.value)} />
            <Input placeholder="Set B: b, c, d" onChange={(e) => updateInput('setB', e.target.value)} />
            <Button onClick={calculateSetOperations} className="w-full">Calculate Set Operations</Button>
            
            <div className="border-t pt-3 mt-3">
              <Button onClick={calculateLogic} className="w-full" variant="outline">Show Logic Truth Tables</Button>
            </div>
          </TabsContent>

          <TabsContent value="graphs" className="space-y-4">
            <Label className="text-xs text-muted-foreground">Graph Properties</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Vertices (V)" onChange={(e) => updateInput('vertices', e.target.value)} />
              <Input placeholder="Edges (E)" onChange={(e) => updateInput('edges', e.target.value)} />
            </div>
            <Button onClick={calculateGraph} className="w-full">Analyze Graph</Button>
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
