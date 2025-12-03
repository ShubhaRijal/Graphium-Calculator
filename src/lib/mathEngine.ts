import * as math from 'mathjs';

export interface CalculationResult {
  value: string;
  error: string | null;
  type: 'number' | 'expression' | 'matrix' | 'unit' | 'error';
}

export interface GraphPoint {
  x: number;
  y: number;
}

export interface GraphData {
  points: GraphPoint[];
  expression: string;
  color: string;
}

// Evaluate a mathematical expression
export function evaluate(expression: string): CalculationResult {
  try {
    if (!expression.trim()) {
      return { value: '', error: null, type: 'expression' };
    }
    
    const result = math.evaluate(expression);
    
    if (typeof result === 'number') {
      if (!isFinite(result)) {
        return { value: result.toString(), error: 'Result is infinite', type: 'error' };
      }
      // Format to avoid floating point issues
      const formatted = Number(result.toPrecision(12)).toString();
      return { value: formatted, error: null, type: 'number' };
    }
    
    if (math.isUnit(result)) {
      return { value: result.toString(), error: null, type: 'unit' };
    }
    
    if (math.isMatrix(result)) {
      return { value: result.toString(), error: null, type: 'matrix' };
    }
    
    return { value: String(result), error: null, type: 'expression' };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid expression';
    return { value: '', error: message, type: 'error' };
  }
}

// Symbolic derivative
export function derivative(expression: string, variable: string = 'x'): CalculationResult {
  try {
    const result = math.derivative(expression, variable);
    return { value: result.toString(), error: null, type: 'expression' };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Cannot compute derivative';
    return { value: '', error: message, type: 'error' };
  }
}

// Numerical integration using Simpson's rule
export function integrate(expression: string, variable: string, lower: number, upper: number): CalculationResult {
  try {
    const n = 1000; // Number of intervals
    const h = (upper - lower) / n;
    let sum = 0;
    
    const f = math.compile(expression);
    
    for (let i = 0; i <= n; i++) {
      const x = lower + i * h;
      const y = f.evaluate({ [variable]: x });
      
      if (i === 0 || i === n) {
        sum += y;
      } else if (i % 2 === 0) {
        sum += 2 * y;
      } else {
        sum += 4 * y;
      }
    }
    
    const result = (h / 3) * sum;
    return { value: result.toPrecision(10), error: null, type: 'number' };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Cannot compute integral';
    return { value: '', error: message, type: 'error' };
  }
}

// Limit calculation (numerical approximation)
export function limit(expression: string, variable: string, approaching: number): CalculationResult {
  try {
    const f = math.compile(expression);
    const epsilon = 1e-10;
    
    const leftLimit = f.evaluate({ [variable]: approaching - epsilon });
    const rightLimit = f.evaluate({ [variable]: approaching + epsilon });
    
    if (Math.abs(leftLimit - rightLimit) < 1e-6) {
      return { value: ((leftLimit + rightLimit) / 2).toPrecision(10), error: null, type: 'number' };
    }
    
    return { value: '', error: 'Limit does not exist or is discontinuous', type: 'error' };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Cannot compute limit';
    return { value: '', error: message, type: 'error' };
  }
}

// Generate graph points
export function generateGraphPoints(
  expression: string,
  xMin: number = -10,
  xMax: number = 10,
  numPoints: number = 500
): GraphPoint[] {
  try {
    const f = math.compile(expression);
    const points: GraphPoint[] = [];
    const step = (xMax - xMin) / numPoints;
    
    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + i * step;
      try {
        const y = f.evaluate({ x });
        if (typeof y === 'number' && isFinite(y) && Math.abs(y) < 1e10) {
          points.push({ x, y });
        } else {
          points.push({ x, y: NaN });
        }
      } catch {
        points.push({ x, y: NaN });
      }
    }
    
    return points;
  } catch {
    return [];
  }
}

// Unit conversion
export function convertUnit(value: number, fromUnit: string, toUnit: string): CalculationResult {
  try {
    const result = math.evaluate(`${value} ${fromUnit} to ${toUnit}`);
    return { value: result.toString(), error: null, type: 'unit' };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Cannot convert units';
    return { value: '', error: message, type: 'error' };
  }
}

// Statistical functions
export function statistics(data: number[]): {
  mean: number;
  median: number;
  mode: number[];
  stdDev: number;
  variance: number;
  min: number;
  max: number;
  range: number;
  sum: number;
  count: number;
} {
  const n = data.length;
  
  // Calculate mean
  const sum = data.reduce((acc, val) => acc + val, 0);
  const mean = sum / n;
  
  // Calculate median
  const sorted = [...data].sort((a, b) => a - b);
  const median = n % 2 === 0 
    ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 
    : sorted[Math.floor(n / 2)];
  
  // Calculate variance and std dev
  const squaredDiffs = data.map(val => (val - mean) ** 2);
  const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / n;
  const stdDev = Math.sqrt(variance);
  
  // Calculate min/max
  const min = Math.min(...data);
  const max = Math.max(...data);
  
  // Calculate mode
  const frequency: { [key: number]: number } = {};
  data.forEach(val => {
    frequency[val] = (frequency[val] || 0) + 1;
  });
  const maxFreq = Math.max(...Object.values(frequency));
  const mode = Object.keys(frequency)
    .filter(key => frequency[Number(key)] === maxFreq)
    .map(Number);
  
  return {
    mean,
    median,
    mode,
    stdDev,
    variance,
    min,
    max,
    range: max - min,
    sum,
    count: n,
  };
}

// Regression analysis
export function linearRegression(xData: number[], yData: number[]): {
  slope: number;
  intercept: number;
  rSquared: number;
  equation: string;
} {
  const n = xData.length;
  const sumX = xData.reduce((a, b) => a + b, 0);
  const sumY = yData.reduce((a, b) => a + b, 0);
  const sumXY = xData.reduce((acc, x, i) => acc + x * yData[i], 0);
  const sumX2 = xData.reduce((acc, x) => acc + x * x, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // R-squared
  const yMean = sumY / n;
  const ssTotal = yData.reduce((acc, y) => acc + (y - yMean) ** 2, 0);
  const ssResidual = yData.reduce((acc, y, i) => {
    const predicted = slope * xData[i] + intercept;
    return acc + (y - predicted) ** 2;
  }, 0);
  const rSquared = 1 - ssResidual / ssTotal;
  
  const equation = `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}`;
  
  return { slope, intercept, rSquared, equation };
}

// Polynomial regression
export function polynomialRegression(xData: number[], yData: number[], degree: number): {
  coefficients: number[];
  equation: string;
  rSquared: number;
} {
  // Build Vandermonde matrix manually
  const n = xData.length;
  const X: number[][] = [];
  for (let i = 0; i < n; i++) {
    const row: number[] = [];
    for (let j = 0; j <= degree; j++) {
      row.push(Math.pow(xData[i], j));
    }
    X.push(row);
  }
  
  // Use math.js matrix operations with proper types
  const Xm = math.matrix(X);
  const Ym = math.matrix(yData);
  const XT = math.transpose(Xm);
  const XTX = math.multiply(XT, Xm);
  const XTY = math.multiply(XT, Ym);
  
  // Solve the system
  const coefficientsMatrix = math.lusolve(XTX, XTY);
  const coefficients = (coefficientsMatrix.toArray() as number[][]).flat();
  
  // Calculate R-squared
  const yMean = yData.reduce((a, b) => a + b, 0) / n;
  const ssTotal = yData.reduce((acc, y) => acc + (y - yMean) ** 2, 0);
  const ssResidual = yData.reduce((acc, y, i) => {
    let predicted = 0;
    for (let j = 0; j <= degree; j++) {
      predicted += coefficients[j] * Math.pow(xData[i], j);
    }
    return acc + (y - predicted) ** 2;
  }, 0);
  const rSquared = 1 - ssResidual / ssTotal;
  
  // Build equation string
  const terms = coefficients.map((c, i) => {
    if (i === 0) return c.toFixed(4);
    if (i === 1) return `${c.toFixed(4)}x`;
    return `${c.toFixed(4)}x^${i}`;
  });
  const equation = `y = ${terms.join(' + ')}`;
  
  return { coefficients, equation, rSquared };
}

// Error analysis
export function checkExpression(expression: string): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check for balanced parentheses
  let parenCount = 0;
  for (const char of expression) {
    if (char === '(') parenCount++;
    if (char === ')') parenCount--;
    if (parenCount < 0) {
      errors.push('Unbalanced parentheses: extra closing parenthesis');
      break;
    }
  }
  if (parenCount > 0) {
    errors.push(`Unbalanced parentheses: missing ${parenCount} closing parenthesis(es)`);
  }
  
  // Check for common mistakes
  if (/[+\-*/^]{2,}/.test(expression.replace(/\s/g, ''))) {
    warnings.push('Consecutive operators detected');
  }
  
  if (/\d[a-zA-Z]/.test(expression) && !/\d[a-zA-Z]\(/.test(expression)) {
    warnings.push('Implicit multiplication detected (e.g., "2x"). Consider using "2*x" for clarity.');
  }
  
  // Try to parse the expression
  try {
    math.parse(expression);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid expression syntax';
    errors.push(message);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export { math };
