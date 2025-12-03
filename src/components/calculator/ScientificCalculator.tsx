import { useState, useCallback } from 'react';
import { CalculatorDisplay } from './CalculatorDisplay';
import { CalculatorKey } from './CalculatorKey';
import { evaluate, checkExpression } from '@/lib/mathEngine';
import { cn } from '@/lib/utils';

export function ScientificCalculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [isInverse, setIsInverse] = useState(false);
  const [isRadians, setIsRadians] = useState(true);

  const handleInput = useCallback((value: string) => {
    setExpression(prev => prev + value);
    setError(null);
  }, []);

  const handleClear = useCallback(() => {
    setExpression('');
    setResult('');
    setError(null);
  }, []);

  const handleBackspace = useCallback(() => {
    setExpression(prev => prev.slice(0, -1));
  }, []);

  const handleCalculate = useCallback(() => {
    const check = checkExpression(expression);
    if (!check.valid) {
      setError(check.errors[0]);
      return;
    }

    let expr = expression;
    // Convert degrees to radians if needed
    if (!isRadians) {
      expr = expr
        .replace(/sin\(/g, 'sin(pi/180*')
        .replace(/cos\(/g, 'cos(pi/180*')
        .replace(/tan\(/g, 'tan(pi/180*');
    }

    const calcResult = evaluate(expr);
    if (calcResult.error) {
      setError(calcResult.error);
    } else {
      setResult(calcResult.value);
      setHistory(prev => [...prev, `${expression} = ${calcResult.value}`]);
    }
  }, [expression, isRadians]);

  const handleFunction = useCallback((func: string) => {
    if (isInverse) {
      const inverseFuncs: { [key: string]: string } = {
        'sin(': 'asin(',
        'cos(': 'acos(',
        'tan(': 'atan(',
        'log10(': '10^(',
        'ln(': 'e^(',
      };
      handleInput(inverseFuncs[func] || func);
      setIsInverse(false);
    } else {
      handleInput(func);
    }
  }, [isInverse, handleInput]);

  const scientificKeys = [
    { label: isInverse ? 'sin⁻¹' : 'sin', action: () => handleFunction('sin(') },
    { label: isInverse ? 'cos⁻¹' : 'cos', action: () => handleFunction('cos(') },
    { label: isInverse ? 'tan⁻¹' : 'tan', action: () => handleFunction('tan(') },
    { label: 'INV', action: () => setIsInverse(!isInverse), variant: isInverse ? 'primary' : 'operator' },
    { label: isRadians ? 'RAD' : 'DEG', action: () => setIsRadians(!isRadians), variant: 'operator' },
    
    { label: isInverse ? '10ˣ' : 'log', action: () => handleFunction('log10(') },
    { label: isInverse ? 'eˣ' : 'ln', action: () => handleFunction('ln(') },
    { label: 'x²', action: () => handleInput('^2') },
    { label: 'xⁿ', action: () => handleInput('^') },
    { label: '√', action: () => handleInput('sqrt(') },
    
    { label: '(', action: () => handleInput('(') },
    { label: ')', action: () => handleInput(')') },
    { label: 'π', action: () => handleInput('pi') },
    { label: 'e', action: () => handleInput('e') },
    { label: '|x|', action: () => handleInput('abs(') },
    
    { label: 'n!', action: () => handleInput('factorial(') },
    { label: '%', action: () => handleInput('%') },
    { label: 'mod', action: () => handleInput(' mod ') },
    { label: '1/x', action: () => handleInput('^(-1)') },
    { label: 'EXP', action: () => handleInput('e') },
  ];

  const mainKeys = [
    { label: 'C', action: handleClear, variant: 'destructive' },
    { label: '⌫', action: handleBackspace, variant: 'operator' },
    { label: '÷', action: () => handleInput('/'), variant: 'operator' },
    { label: '×', action: () => handleInput('*'), variant: 'operator' },
    
    { label: '7', action: () => handleInput('7') },
    { label: '8', action: () => handleInput('8') },
    { label: '9', action: () => handleInput('9') },
    { label: '−', action: () => handleInput('-'), variant: 'operator' },
    
    { label: '4', action: () => handleInput('4') },
    { label: '5', action: () => handleInput('5') },
    { label: '6', action: () => handleInput('6') },
    { label: '+', action: () => handleInput('+'), variant: 'operator' },
    
    { label: '1', action: () => handleInput('1') },
    { label: '2', action: () => handleInput('2') },
    { label: '3', action: () => handleInput('3') },
    { label: '=', action: handleCalculate, variant: 'primary', rowSpan: true },
    
    { label: '0', action: () => handleInput('0'), colSpan: true },
    { label: '.', action: () => handleInput('.') },
  ];

  return (
    <div className="space-y-4 animate-fade-in-up">
      <CalculatorDisplay
        expression={expression}
        result={result}
        error={error}
        history={history}
      />

      {/* Scientific Keys */}
      <div className="grid grid-cols-5 gap-2">
        {scientificKeys.map((key, i) => (
          <CalculatorKey
            key={i}
            onClick={key.action}
            variant={(key.variant as any) || 'operator'}
            className="h-12 text-sm"
          >
            {key.label}
          </CalculatorKey>
        ))}
      </div>

      {/* Main Keys */}
      <div className="grid grid-cols-4 gap-2">
        {mainKeys.map((key, i) => (
          <CalculatorKey
            key={i}
            onClick={key.action}
            variant={(key.variant as any) || 'default'}
            className={cn(
              key.colSpan && 'col-span-2',
              key.rowSpan && 'row-span-2'
            )}
          >
            {key.label}
          </CalculatorKey>
        ))}
      </div>
    </div>
  );
}
