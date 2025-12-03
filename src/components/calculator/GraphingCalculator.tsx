import { useState, useMemo, useCallback, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { generateGraphPoints, checkExpression, evaluate } from '@/lib/mathEngine';
import { Plus, Trash2, Eye, EyeOff, ZoomIn, ZoomOut, Move } from 'lucide-react';

interface GraphExpression {
  id: string;
  expression: string;
  color: string;
  visible: boolean;
}

const COLORS = ['#14b8a6', '#f97316', '#8b5cf6', '#ec4899', '#eab308', '#22c55e'];

export function GraphingCalculator() {
  const [expressions, setExpressions] = useState<GraphExpression[]>([
    { id: '1', expression: 'x^2', color: COLORS[0], visible: true }
  ]);
  const [xRange, setXRange] = useState({ min: -10, max: 10 });
  const [yRange, setYRange] = useState({ min: -10, max: 10 });
  const [inspectX, setInspectX] = useState<number | null>(null);
  const [animationT, setAnimationT] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number | null>(null);

  const graphData = useMemo(() => {
    const data: { x: number; [key: string]: number | null }[] = [];
    const numPoints = 500;
    const step = (xRange.max - xRange.min) / numPoints;

    for (let i = 0; i <= numPoints; i++) {
      const x = xRange.min + i * step;
      const point: { x: number; [key: string]: number | null } = { x };
      
      expressions.forEach(expr => {
        if (expr.visible && expr.expression.trim()) {
          const points = generateGraphPoints(
            expr.expression.replace(/t/g, String(animationT)),
            x - step / 2,
            x + step / 2,
            1
          );
          const y = points[0]?.y;
          point[expr.id] = (y !== undefined && isFinite(y) && y >= yRange.min && y <= yRange.max) ? y : null;
        }
      });
      
      data.push(point);
    }
    
    return data;
  }, [expressions, xRange, yRange, animationT]);

  const addExpression = useCallback(() => {
    const newId = String(Date.now());
    const colorIndex = expressions.length % COLORS.length;
    setExpressions(prev => [
      ...prev,
      { id: newId, expression: '', color: COLORS[colorIndex], visible: true }
    ]);
  }, [expressions.length]);

  const updateExpression = useCallback((id: string, value: string) => {
    setExpressions(prev =>
      prev.map(expr => (expr.id === id ? { ...expr, expression: value } : expr))
    );
  }, []);

  const toggleVisibility = useCallback((id: string) => {
    setExpressions(prev =>
      prev.map(expr => (expr.id === id ? { ...expr, visible: !expr.visible } : expr))
    );
  }, []);

  const removeExpression = useCallback((id: string) => {
    setExpressions(prev => prev.filter(expr => expr.id !== id));
  }, []);

  const handleZoom = useCallback((factor: number) => {
    const xCenter = (xRange.min + xRange.max) / 2;
    const yCenter = (yRange.min + yRange.max) / 2;
    const xHalf = (xRange.max - xRange.min) / 2 * factor;
    const yHalf = (yRange.max - yRange.min) / 2 * factor;
    
    setXRange({ min: xCenter - xHalf, max: xCenter + xHalf });
    setYRange({ min: yCenter - yHalf, max: yCenter + yHalf });
  }, [xRange, yRange]);

  const resetView = useCallback(() => {
    setXRange({ min: -10, max: 10 });
    setYRange({ min: -10, max: 10 });
  }, []);

  const toggleAnimation = useCallback(() => {
    if (isAnimating) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      setIsAnimating(false);
    } else {
      setIsAnimating(true);
      const animate = () => {
        setAnimationT(prev => (prev + 0.05) % (2 * Math.PI));
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [isAnimating]);

  const inspectionData = useMemo(() => {
    if (inspectX === null) return null;
    
    return expressions.map(expr => {
      if (!expr.visible || !expr.expression.trim()) return null;
      const result = evaluate(expr.expression.replace(/x/g, `(${inspectX})`).replace(/t/g, String(animationT)));
      return {
        expression: expr.expression,
        color: expr.color,
        x: inspectX,
        y: result.error ? 'undefined' : result.value
      };
    }).filter(Boolean);
  }, [inspectX, expressions, animationT]);

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Graph */}
      <div className="glass-panel p-4 relative">
        <div className="absolute top-2 right-2 flex gap-2 z-10">
          <Button size="icon" variant="ghost" onClick={() => handleZoom(0.8)} className="h-8 w-8">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => handleZoom(1.25)} className="h-8 w-8">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={resetView} className="h-8 w-8">
            <Move className="h-4 w-4" />
          </Button>
        </div>
        
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={graphData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--graph-grid))" />
            <XAxis 
              dataKey="x" 
              type="number" 
              domain={[xRange.min, xRange.max]}
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={(v) => v.toFixed(1)}
            />
            <YAxis 
              type="number" 
              domain={[yRange.min, yRange.max]}
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={(v) => v.toFixed(1)}
            />
            <ReferenceLine x={0} stroke="hsl(var(--muted-foreground))" strokeWidth={1} />
            <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeWidth={1} />
            <Tooltip 
              contentStyle={{ 
                background: 'hsl(var(--popover))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))'
              }}
              formatter={(value: number) => [value?.toFixed(4), 'y']}
              labelFormatter={(label) => `x = ${Number(label).toFixed(4)}`}
            />
            {expressions.map(expr => (
              expr.visible && (
                <Line
                  key={expr.id}
                  type="monotone"
                  dataKey={expr.id}
                  stroke={expr.color}
                  strokeWidth={2}
                  dot={false}
                  connectNulls={false}
                  isAnimationActive={false}
                />
              )
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Expression Input */}
      <div className="space-y-2">
        {expressions.map((expr, index) => {
          const check = checkExpression(expr.expression);
          return (
            <div key={expr.id} className="flex gap-2 items-center animate-fade-in">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: expr.color }}
              />
              <div className="flex-1 relative">
                <Input
                  value={expr.expression}
                  onChange={(e) => updateExpression(expr.id, e.target.value)}
                  placeholder={`f${index + 1}(x) = `}
                  className={`font-mono ${!check.valid && expr.expression ? 'border-destructive' : ''}`}
                />
                {!check.valid && expr.expression && (
                  <div className="absolute -bottom-5 left-0 text-xs text-destructive">
                    {check.errors[0]}
                  </div>
                )}
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => toggleVisibility(expr.id)}
                className="h-9 w-9"
              >
                {expr.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
              {expressions.length > 1 && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeExpression(expr.id)}
                  className="h-9 w-9 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button onClick={addExpression} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" /> Add Function
        </Button>
        <Button onClick={toggleAnimation} variant={isAnimating ? 'default' : 'outline'} size="sm">
          {isAnimating ? 'Stop' : 'Animate'} (t)
        </Button>
      </div>

      {/* Smart Inspection */}
      <div className="glass-panel p-4">
        <h3 className="text-sm font-medium mb-2">Inspect Point</h3>
        <div className="flex gap-2 items-center">
          <span className="text-muted-foreground">x =</span>
          <Input
            type="number"
            value={inspectX ?? ''}
            onChange={(e) => setInspectX(e.target.value ? Number(e.target.value) : null)}
            className="w-32 font-mono"
            placeholder="Enter x"
          />
        </div>
        {inspectionData && inspectionData.length > 0 && (
          <div className="mt-3 space-y-1">
            {inspectionData.map((data: any, i) => (
              <div key={i} className="flex items-center gap-2 text-sm font-mono">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
                <span className="text-muted-foreground">y =</span>
                <span className="text-foreground">{data.y}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
