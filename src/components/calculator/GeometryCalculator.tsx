import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type GeometryMode = '2d-shapes' | '3d-shapes' | 'transformations' | 'proofs' | 'coordinates' | 'trigonometry';

export function GeometryCalculator() {
  const [mode, setMode] = useState<GeometryMode>('2d-shapes');
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string>('');

  const updateInput = (key: string, value: string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const calculate2DShapes = (shape: string) => {
    try {
      const results: string[] = [];
      
      switch (shape) {
        case 'triangle': {
          const a = parseFloat(inputs.sideA || '0');
          const b = parseFloat(inputs.sideB || '0');
          const c = parseFloat(inputs.sideC || '0');
          const s = (a + b + c) / 2;
          const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
          const perimeter = a + b + c;
          
          // Check triangle type
          const sides = [a, b, c].sort((x, y) => x - y);
          let type = '';
          if (sides[0] === sides[1] && sides[1] === sides[2]) type = 'Equilateral';
          else if (sides[0] === sides[1] || sides[1] === sides[2]) type = 'Isosceles';
          else type = 'Scalene';
          
          // Check if right triangle
          const isRight = Math.abs(sides[0]**2 + sides[1]**2 - sides[2]**2) < 0.0001;
          
          results.push(`Triangle (${type}${isRight ? ', Right' : ''})`);
          results.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          results.push(`Sides: a=${a}, b=${b}, c=${c}`);
          results.push(`Perimeter: ${perimeter.toFixed(4)}`);
          results.push(`Semi-perimeter: ${s.toFixed(4)}`);
          results.push(`Area (Heron's): ${area.toFixed(4)}`);
          
          // Angles using law of cosines
          const angleA = Math.acos((b*b + c*c - a*a) / (2*b*c)) * 180 / Math.PI;
          const angleB = Math.acos((a*a + c*c - b*b) / (2*a*c)) * 180 / Math.PI;
          const angleC = 180 - angleA - angleB;
          results.push(`\nAngles:`);
          results.push(`  A = ${angleA.toFixed(2)}°`);
          results.push(`  B = ${angleB.toFixed(2)}°`);
          results.push(`  C = ${angleC.toFixed(2)}°`);
          
          // Circumradius and Inradius
          const R = (a * b * c) / (4 * area);
          const r = area / s;
          results.push(`\nCircumradius: ${R.toFixed(4)}`);
          results.push(`Inradius: ${r.toFixed(4)}`);
          break;
        }
        case 'circle': {
          const r = parseFloat(inputs.radius || '0');
          results.push('Circle');
          results.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          results.push(`Radius: ${r}`);
          results.push(`Diameter: ${(2 * r).toFixed(4)}`);
          results.push(`Circumference: ${(2 * Math.PI * r).toFixed(4)}`);
          results.push(`Area: ${(Math.PI * r * r).toFixed(4)}`);
          results.push(`\nArc Length (θ in radians): r × θ`);
          results.push(`Sector Area: (1/2) × r² × θ`);
          break;
        }
        case 'polygon': {
          const n = parseInt(inputs.sides || '6');
          const s = parseFloat(inputs.sideLength || '1');
          const perimeter = n * s;
          const apothem = s / (2 * Math.tan(Math.PI / n));
          const area = (perimeter * apothem) / 2;
          const interiorAngle = ((n - 2) * 180) / n;
          const exteriorAngle = 360 / n;
          
          results.push(`Regular ${n}-gon`);
          results.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          results.push(`Side length: ${s}`);
          results.push(`Perimeter: ${perimeter.toFixed(4)}`);
          results.push(`Apothem: ${apothem.toFixed(4)}`);
          results.push(`Area: ${area.toFixed(4)}`);
          results.push(`\nInterior angle: ${interiorAngle.toFixed(2)}°`);
          results.push(`Exterior angle: ${exteriorAngle.toFixed(2)}°`);
          results.push(`Sum of interior angles: ${((n - 2) * 180)}°`);
          results.push(`Diagonals: ${(n * (n - 3)) / 2}`);
          break;
        }
        case 'ellipse': {
          const a = parseFloat(inputs.semiMajor || '0');
          const b = parseFloat(inputs.semiMinor || '0');
          const c = Math.sqrt(a*a - b*b);
          const e = c / a;
          const area = Math.PI * a * b;
          // Ramanujan approximation for circumference
          const h = ((a - b) * (a - b)) / ((a + b) * (a + b));
          const circumference = Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
          
          results.push('Ellipse');
          results.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          results.push(`Semi-major axis (a): ${a}`);
          results.push(`Semi-minor axis (b): ${b}`);
          results.push(`Linear eccentricity (c): ${c.toFixed(4)}`);
          results.push(`Eccentricity (e): ${e.toFixed(4)}`);
          results.push(`Area: ${area.toFixed(4)}`);
          results.push(`Circumference (approx): ${circumference.toFixed(4)}`);
          results.push(`\nFoci: (±${c.toFixed(4)}, 0)`);
          break;
        }
      }
      
      setResult(results.join('\n'));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Invalid input'}`);
    }
  };

  const calculate3DShapes = (shape: string) => {
    try {
      const results: string[] = [];
      
      switch (shape) {
        case 'sphere': {
          const r = parseFloat(inputs.radius || '0');
          results.push('Sphere');
          results.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          results.push(`Radius: ${r}`);
          results.push(`Diameter: ${(2 * r).toFixed(4)}`);
          results.push(`Surface Area: ${(4 * Math.PI * r * r).toFixed(4)}`);
          results.push(`Volume: ${((4/3) * Math.PI * r * r * r).toFixed(4)}`);
          break;
        }
        case 'cylinder': {
          const r = parseFloat(inputs.radius || '0');
          const h = parseFloat(inputs.height || '0');
          results.push('Cylinder');
          results.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          results.push(`Radius: ${r}, Height: ${h}`);
          results.push(`Lateral Surface: ${(2 * Math.PI * r * h).toFixed(4)}`);
          results.push(`Total Surface: ${(2 * Math.PI * r * (r + h)).toFixed(4)}`);
          results.push(`Volume: ${(Math.PI * r * r * h).toFixed(4)}`);
          break;
        }
        case 'cone': {
          const r = parseFloat(inputs.radius || '0');
          const h = parseFloat(inputs.height || '0');
          const l = Math.sqrt(r*r + h*h);
          results.push('Cone');
          results.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          results.push(`Radius: ${r}, Height: ${h}`);
          results.push(`Slant height: ${l.toFixed(4)}`);
          results.push(`Lateral Surface: ${(Math.PI * r * l).toFixed(4)}`);
          results.push(`Total Surface: ${(Math.PI * r * (r + l)).toFixed(4)}`);
          results.push(`Volume: ${((1/3) * Math.PI * r * r * h).toFixed(4)}`);
          break;
        }
        case 'torus': {
          const R = parseFloat(inputs.majorRadius || '0');
          const r = parseFloat(inputs.minorRadius || '0');
          results.push('Torus');
          results.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          results.push(`Major radius (R): ${R}, Minor radius (r): ${r}`);
          results.push(`Surface Area: ${(4 * Math.PI * Math.PI * R * r).toFixed(4)}`);
          results.push(`Volume: ${(2 * Math.PI * Math.PI * R * r * r).toFixed(4)}`);
          break;
        }
        case 'platonic': {
          const a = parseFloat(inputs.edge || '1');
          const solid = inputs.solid || 'tetrahedron';
          
          const solids: Record<string, { name: string; faces: number; vertices: number; edges: number; volume: (a: number) => number; surface: (a: number) => number }> = {
            tetrahedron: {
              name: 'Tetrahedron',
              faces: 4, vertices: 4, edges: 6,
              volume: (a) => (a**3 * Math.sqrt(2)) / 12,
              surface: (a) => Math.sqrt(3) * a**2
            },
            cube: {
              name: 'Cube (Hexahedron)',
              faces: 6, vertices: 8, edges: 12,
              volume: (a) => a**3,
              surface: (a) => 6 * a**2
            },
            octahedron: {
              name: 'Octahedron',
              faces: 8, vertices: 6, edges: 12,
              volume: (a) => (Math.sqrt(2) / 3) * a**3,
              surface: (a) => 2 * Math.sqrt(3) * a**2
            },
            dodecahedron: {
              name: 'Dodecahedron',
              faces: 12, vertices: 20, edges: 30,
              volume: (a) => ((15 + 7 * Math.sqrt(5)) / 4) * a**3,
              surface: (a) => 3 * Math.sqrt(25 + 10 * Math.sqrt(5)) * a**2
            },
            icosahedron: {
              name: 'Icosahedron',
              faces: 20, vertices: 12, edges: 30,
              volume: (a) => (5 * (3 + Math.sqrt(5)) / 12) * a**3,
              surface: (a) => 5 * Math.sqrt(3) * a**2
            }
          };
          
          const s = solids[solid];
          results.push(s.name);
          results.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          results.push(`Edge length: ${a}`);
          results.push(`Faces: ${s.faces}, Vertices: ${s.vertices}, Edges: ${s.edges}`);
          results.push(`Euler characteristic: ${s.vertices - s.edges + s.faces} (V - E + F = 2)`);
          results.push(`Surface Area: ${s.surface(a).toFixed(6)}`);
          results.push(`Volume: ${s.volume(a).toFixed(6)}`);
          break;
        }
      }
      
      setResult(results.join('\n'));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Invalid input'}`);
    }
  };

  const calculateTransformations = () => {
    try {
      const x = parseFloat(inputs.pointX || '0');
      const y = parseFloat(inputs.pointY || '0');
      const angle = parseFloat(inputs.angle || '0') * Math.PI / 180;
      const sx = parseFloat(inputs.scaleX || '1');
      const sy = parseFloat(inputs.scaleY || '1');
      
      const results: string[] = [];
      results.push(`Original Point: (${x}, ${y})`);
      results.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Rotation
      const rotX = x * Math.cos(angle) - y * Math.sin(angle);
      const rotY = x * Math.sin(angle) + y * Math.cos(angle);
      results.push(`\nRotation by ${inputs.angle}°:`);
      results.push(`  (${rotX.toFixed(4)}, ${rotY.toFixed(4)})`);
      results.push(`  Matrix: [cos θ  -sin θ]`);
      results.push(`          [sin θ   cos θ]`);
      
      // Reflection
      results.push(`\nReflections:`);
      results.push(`  Over x-axis: (${x}, ${-y})`);
      results.push(`  Over y-axis: (${-x}, ${y})`);
      results.push(`  Over origin: (${-x}, ${-y})`);
      results.push(`  Over y=x: (${y}, ${x})`);
      results.push(`  Over y=-x: (${-y}, ${-x})`);
      
      // Scaling
      results.push(`\nScaling by (${sx}, ${sy}):`);
      results.push(`  (${(x * sx).toFixed(4)}, ${(y * sy).toFixed(4)})`);
      
      // Shear
      const shearX = parseFloat(inputs.shearX || '0');
      const shearY = parseFloat(inputs.shearY || '0');
      results.push(`\nShear (kx=${shearX}, ky=${shearY}):`);
      results.push(`  (${(x + shearX * y).toFixed(4)}, ${(shearY * x + y).toFixed(4)})`);
      
      setResult(results.join('\n'));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Invalid input'}`);
    }
  };

  const calculateCoordinates = () => {
    try {
      const x1 = parseFloat(inputs.x1 || '0');
      const y1 = parseFloat(inputs.y1 || '0');
      const x2 = parseFloat(inputs.x2 || '0');
      const y2 = parseFloat(inputs.y2 || '0');
      const x3 = parseFloat(inputs.x3 || '0');
      const y3 = parseFloat(inputs.y3 || '0');
      
      const results: string[] = [];
      results.push('Coordinate Geometry Calculations');
      results.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Distance between two points
      const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      results.push(`\nPoints: A(${x1}, ${y1}), B(${x2}, ${y2}), C(${x3}, ${y3})`);
      results.push(`\n▸ Distance AB: ${distance.toFixed(4)}`);
      results.push(`  Formula: √[(x₂-x₁)² + (y₂-y₁)²]`);
      
      // Midpoint
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      results.push(`\n▸ Midpoint of AB: (${midX.toFixed(4)}, ${midY.toFixed(4)})`);
      
      // Slope
      const slope = (y2 - y1) / (x2 - x1);
      results.push(`\n▸ Slope of AB: ${isFinite(slope) ? slope.toFixed(4) : 'undefined (vertical)'}`);
      results.push(`  Perpendicular slope: ${isFinite(slope) && slope !== 0 ? (-1/slope).toFixed(4) : slope === 0 ? 'undefined' : '0'}`);
      
      // Line equation
      if (isFinite(slope)) {
        const b = y1 - slope * x1;
        results.push(`\n▸ Line equation (AB): y = ${slope.toFixed(4)}x ${b >= 0 ? '+' : '-'} ${Math.abs(b).toFixed(4)}`);
      }
      
      // Area of triangle using 3 points
      const area = Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2);
      results.push(`\n▸ Triangle Area (ABC): ${area.toFixed(4)}`);
      results.push(`  Formula: ½|x₁(y₂-y₃) + x₂(y₃-y₁) + x₃(y₁-y₂)|`);
      
      // Centroid
      const centroidX = (x1 + x2 + x3) / 3;
      const centroidY = (y1 + y2 + y3) / 3;
      results.push(`\n▸ Centroid: (${centroidX.toFixed(4)}, ${centroidY.toFixed(4)})`);
      
      // Collinearity check
      const collinear = Math.abs(area) < 0.0001;
      results.push(`\n▸ Collinearity: ${collinear ? 'Points are collinear' : 'Points are NOT collinear'}`);
      
      // Section formula
      const m = parseFloat(inputs.ratioM || '1');
      const n = parseFloat(inputs.ratioN || '1');
      const secX = (m * x2 + n * x1) / (m + n);
      const secY = (m * y2 + n * y1) / (m + n);
      results.push(`\n▸ Point dividing AB in ratio ${m}:${n}`);
      results.push(`  Internal: (${secX.toFixed(4)}, ${secY.toFixed(4)})`);
      const extX = (m * x2 - n * x1) / (m - n);
      const extY = (m * y2 - n * y1) / (m - n);
      if (m !== n) {
        results.push(`  External: (${extX.toFixed(4)}, ${extY.toFixed(4)})`);
      }
      
      setResult(results.join('\n'));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Invalid input'}`);
    }
  };

  const showProof = (proofType: string) => {
    const proofs: Record<string, string> = {
      pythagoras: `Pythagorean Theorem: a² + b² = c²
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROOF (by similar triangles):

Given: Right triangle ABC with right angle at C
       altitude h from C to hypotenuse AB

1. △ABC ~ △ACD ~ △CBD (AA similarity)

2. From △ABC ~ △ACD:
   c/a = a/p → a² = cp

3. From △ABC ~ △CBD:
   c/b = b/q → b² = cq

4. Adding equations:
   a² + b² = cp + cq = c(p + q) = c·c = c²

∴ a² + b² = c² ∎`,
      
      eulerLine: `Euler Line Theorem
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The centroid (G), circumcenter (O), and 
orthocenter (H) of a triangle are collinear.

Moreover: OG : GH = 1 : 2

PROOF SKETCH:

1. Define G = (A + B + C)/3 (centroid)

2. Let O be the circumcenter

3. Define H = A + B + C - 2O (orthocenter)

4. Verify: G = (2O + H)/3
   
   G = (A + B + C)/3
     = (A + B + C - 2O + 2O)/3
     = ((A + B + C - 2O) + 2O)/3
     = (H + 2O)/3 = (2O + H)/3

5. This shows G divides OH in ratio 1:2

∴ O, G, H are collinear ∎`,

      triangleAngleSum: `Triangle Angle Sum Theorem
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The sum of interior angles in a triangle = 180°

PROOF:

Given: Triangle ABC with angles α, β, γ

1. Draw line DE through A parallel to BC

2. ∠DAB = β (alternate interior angles)
   ∠EAC = γ (alternate interior angles)

3. ∠DAB + ∠BAC + ∠EAC = 180° (straight line)
   
4. β + α + γ = 180°

∴ α + β + γ = 180° ∎`,

      inscribedAngle: `Inscribed Angle Theorem
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
An inscribed angle is half of the central angle
that subtends the same arc.

PROOF (Central angle case):

1. Let O be center, P on circle, chord AB

2. Draw PO and extend to point Q on circle

3. △OAP is isosceles (OA = OP = radius)
   ∴ ∠OAP = ∠OPA = α

4. ∠AOQ = ∠OAP + ∠OPA = 2α (exterior angle)

5. Similarly for △OBP:
   ∠BOQ = 2β

6. Central ∠AOB = 2α + 2β = 2(α + β)
   Inscribed ∠APB = α + β

∴ Inscribed angle = ½ × Central angle ∎`,

      thales: `Thales' Theorem
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
If A, B, C are points on a circle where AB 
is a diameter, then angle ACB = 90°.

PROOF:

1. Let O be the center of the circle

2. Since AB is diameter, O is midpoint of AB

3. OA = OB = OC = radius (r)

4. △OAC is isosceles: ∠OAC = ∠OCA = α
   △OBC is isosceles: ∠OBC = ∠OCB = β

5. In △ABC:
   ∠CAB + ∠ABC + ∠ACB = 180°
   α + β + (α + β) = 180°
   2(α + β) = 180°
   α + β = 90°

6. ∠ACB = ∠OCA + ∠OCB = α + β = 90°

∴ Any angle inscribed in a semicircle is 90° ∎`,

      parallelogram: `Parallelogram Diagonals Theorem
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The diagonals of a parallelogram bisect each other.

PROOF:

Given: Parallelogram ABCD with diagonals AC and BD
       intersecting at point P

1. In △APB and △CPD:
   - ∠PAB = ∠PCD (alternate interior angles, AB ∥ CD)
   - ∠PBA = ∠PDC (alternate interior angles, AB ∥ CD)
   - AB = CD (opposite sides of parallelogram)

2. By ASA congruence:
   △APB ≅ △CPD

3. Therefore:
   AP = CP (CPCTC)
   BP = DP (CPCTC)

∴ Diagonals bisect each other ∎`,

      isoscelesBase: `Isosceles Triangle Base Angles
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Base angles of an isosceles triangle are equal.

PROOF:

Given: △ABC with AB = AC

1. Draw angle bisector AD from A to BC

2. In △ABD and △ACD:
   - AB = AC (given)
   - ∠BAD = ∠CAD (AD is angle bisector)
   - AD = AD (common side)

3. By SAS congruence:
   △ABD ≅ △ACD

4. Therefore:
   ∠ABD = ∠ACD (CPCTC)

∴ Base angles are equal ∎`,

      midpointTheorem: `Midpoint Theorem
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The line segment joining midpoints of two sides
of a triangle is parallel to the third side and
half its length.

PROOF:

Given: △ABC with D, E midpoints of AB, AC

1. Extend DE to F where EF = DE

2. In △ADE and △CEF:
   - AE = EC (E is midpoint)
   - DE = EF (construction)
   - ∠AED = ∠CEF (vertical angles)

3. By SAS: △ADE ≅ △CEF

4. Therefore:
   - AD = CF
   - ∠ADE = ∠CFE (alternate interior angles)
   
5. Since AD = DB and AD = CF:
   DB = CF and DB ∥ CF

6. DBCF is a parallelogram

7. ∴ DE ∥ BC and DF = BC, so DE = BC/2

∴ DE ∥ BC and DE = ½BC ∎`,

      exteriorAngle: `Exterior Angle Theorem
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
An exterior angle of a triangle equals the sum
of the two non-adjacent interior angles.

PROOF:

Given: △ABC with exterior angle ∠ACD

1. Interior angles: ∠A, ∠B, ∠ACB

2. ∠ACD + ∠ACB = 180° (linear pair)

3. ∠A + ∠B + ∠ACB = 180° (angle sum property)

4. From (2): ∠ACB = 180° - ∠ACD

5. Substituting in (3):
   ∠A + ∠B + (180° - ∠ACD) = 180°
   ∠A + ∠B = ∠ACD

∴ Exterior angle = Sum of remote interior angles ∎`,

      sas: `SAS Congruence Postulate
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
If two sides and the included angle of one 
triangle are equal to two sides and the included
angle of another, the triangles are congruent.

PROOF (by superposition):

Given: △ABC and △DEF where
       AB = DE, AC = DF, ∠A = ∠D

1. Place △ABC on △DEF so that:
   - A coincides with D
   - AB lies along DE

2. Since AB = DE, B coincides with E

3. Since ∠A = ∠D, AC lies along DF

4. Since AC = DF, C coincides with F

5. ∴ △ABC exactly covers △DEF

∴ △ABC ≅ △DEF ∎`,

      circleChord: `Perpendicular from Center Bisects Chord
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A perpendicular from the center of a circle
to a chord bisects the chord.

PROOF:

Given: Circle with center O, chord AB,
       OM ⊥ AB at M

1. Join OA and OB

2. In △OMA and △OMB:
   - OA = OB (radii)
   - OM = OM (common)
   - ∠OMA = ∠OMB = 90° (given)

3. By RHS congruence:
   △OMA ≅ △OMB

4. Therefore:
   AM = BM (CPCTC)

∴ M is the midpoint of AB ∎`
    };

    setResult(proofs[proofType] || 'Proof not found');
  };

  return (
    <Card className="glass-panel">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-primary">Geometry Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="2d" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-4">
            <TabsTrigger value="2d">2D</TabsTrigger>
            <TabsTrigger value="3d">3D</TabsTrigger>
            <TabsTrigger value="coords">Coords</TabsTrigger>
            <TabsTrigger value="transform">Transform</TabsTrigger>
            <TabsTrigger value="proofs">Proofs</TabsTrigger>
          </TabsList>

          <TabsContent value="2d" className="space-y-4">
            <Select onValueChange={(v) => updateInput('shape2d', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select shape" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="triangle">Triangle</SelectItem>
                <SelectItem value="circle">Circle</SelectItem>
                <SelectItem value="polygon">Regular Polygon</SelectItem>
                <SelectItem value="ellipse">Ellipse</SelectItem>
              </SelectContent>
            </Select>

            {inputs.shape2d === 'triangle' && (
              <div className="grid grid-cols-3 gap-2">
                <Input placeholder="Side a" onChange={(e) => updateInput('sideA', e.target.value)} />
                <Input placeholder="Side b" onChange={(e) => updateInput('sideB', e.target.value)} />
                <Input placeholder="Side c" onChange={(e) => updateInput('sideC', e.target.value)} />
              </div>
            )}
            {inputs.shape2d === 'circle' && (
              <Input placeholder="Radius" onChange={(e) => updateInput('radius', e.target.value)} />
            )}
            {inputs.shape2d === 'polygon' && (
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Number of sides" onChange={(e) => updateInput('sides', e.target.value)} />
                <Input placeholder="Side length" onChange={(e) => updateInput('sideLength', e.target.value)} />
              </div>
            )}
            {inputs.shape2d === 'ellipse' && (
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Semi-major (a)" onChange={(e) => updateInput('semiMajor', e.target.value)} />
                <Input placeholder="Semi-minor (b)" onChange={(e) => updateInput('semiMinor', e.target.value)} />
              </div>
            )}
            
            <Button onClick={() => calculate2DShapes(inputs.shape2d)} className="w-full" disabled={!inputs.shape2d}>
              Calculate
            </Button>
          </TabsContent>

          <TabsContent value="3d" className="space-y-4">
            <Select onValueChange={(v) => updateInput('shape3d', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select 3D shape" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sphere">Sphere</SelectItem>
                <SelectItem value="cylinder">Cylinder</SelectItem>
                <SelectItem value="cone">Cone</SelectItem>
                <SelectItem value="torus">Torus</SelectItem>
                <SelectItem value="platonic">Platonic Solids</SelectItem>
              </SelectContent>
            </Select>

            {(inputs.shape3d === 'sphere' || inputs.shape3d === 'cylinder' || inputs.shape3d === 'cone') && (
              <Input placeholder="Radius" onChange={(e) => updateInput('radius', e.target.value)} />
            )}
            {(inputs.shape3d === 'cylinder' || inputs.shape3d === 'cone') && (
              <Input placeholder="Height" onChange={(e) => updateInput('height', e.target.value)} />
            )}
            {inputs.shape3d === 'torus' && (
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Major radius (R)" onChange={(e) => updateInput('majorRadius', e.target.value)} />
                <Input placeholder="Minor radius (r)" onChange={(e) => updateInput('minorRadius', e.target.value)} />
              </div>
            )}
            {inputs.shape3d === 'platonic' && (
              <>
                <Select onValueChange={(v) => updateInput('solid', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select solid" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tetrahedron">Tetrahedron (4 faces)</SelectItem>
                    <SelectItem value="cube">Cube (6 faces)</SelectItem>
                    <SelectItem value="octahedron">Octahedron (8 faces)</SelectItem>
                    <SelectItem value="dodecahedron">Dodecahedron (12 faces)</SelectItem>
                    <SelectItem value="icosahedron">Icosahedron (20 faces)</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Edge length" onChange={(e) => updateInput('edge', e.target.value)} />
              </>
            )}
            
            <Button onClick={() => calculate3DShapes(inputs.shape3d)} className="w-full" disabled={!inputs.shape3d}>
              Calculate
            </Button>
          </TabsContent>

          <TabsContent value="coords" className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Point A: x₁" onChange={(e) => updateInput('x1', e.target.value)} />
              <Input placeholder="Point A: y₁" onChange={(e) => updateInput('y1', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Point B: x₂" onChange={(e) => updateInput('x2', e.target.value)} />
              <Input placeholder="Point B: y₂" onChange={(e) => updateInput('y2', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Point C: x₃" onChange={(e) => updateInput('x3', e.target.value)} />
              <Input placeholder="Point C: y₃" onChange={(e) => updateInput('y3', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Ratio m" defaultValue="1" onChange={(e) => updateInput('ratioM', e.target.value)} />
              <Input placeholder="Ratio n" defaultValue="1" onChange={(e) => updateInput('ratioN', e.target.value)} />
            </div>
            <Button onClick={calculateCoordinates} className="w-full">Calculate</Button>
          </TabsContent>

          <TabsContent value="transform" className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Point X" onChange={(e) => updateInput('pointX', e.target.value)} />
              <Input placeholder="Point Y" onChange={(e) => updateInput('pointY', e.target.value)} />
            </div>
            <Input placeholder="Rotation angle (degrees)" onChange={(e) => updateInput('angle', e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Scale X" defaultValue="1" onChange={(e) => updateInput('scaleX', e.target.value)} />
              <Input placeholder="Scale Y" defaultValue="1" onChange={(e) => updateInput('scaleY', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Shear X" defaultValue="0" onChange={(e) => updateInput('shearX', e.target.value)} />
              <Input placeholder="Shear Y" defaultValue="0" onChange={(e) => updateInput('shearY', e.target.value)} />
            </div>
            <Button onClick={calculateTransformations} className="w-full">Apply Transformations</Button>
          </TabsContent>

          <TabsContent value="proofs" className="space-y-4">
            <p className="text-xs text-muted-foreground mb-2">Select a theorem to view its proof:</p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => showProof('pythagoras')}>Pythagorean Theorem</Button>
              <Button variant="outline" size="sm" onClick={() => showProof('triangleAngleSum')}>Triangle Angle Sum</Button>
              <Button variant="outline" size="sm" onClick={() => showProof('inscribedAngle')}>Inscribed Angle</Button>
              <Button variant="outline" size="sm" onClick={() => showProof('thales')}>Thales' Theorem</Button>
              <Button variant="outline" size="sm" onClick={() => showProof('eulerLine')}>Euler Line</Button>
              <Button variant="outline" size="sm" onClick={() => showProof('exteriorAngle')}>Exterior Angle</Button>
              <Button variant="outline" size="sm" onClick={() => showProof('midpointTheorem')}>Midpoint Theorem</Button>
              <Button variant="outline" size="sm" onClick={() => showProof('parallelogram')}>Parallelogram Diagonals</Button>
              <Button variant="outline" size="sm" onClick={() => showProof('isoscelesBase')}>Isosceles Base Angles</Button>
              <Button variant="outline" size="sm" onClick={() => showProof('sas')}>SAS Congruence</Button>
              <Button variant="outline" size="sm" onClick={() => showProof('circleChord')}>Chord Bisector</Button>
            </div>
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
