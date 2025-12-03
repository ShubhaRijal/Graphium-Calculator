import { useState, useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { statistics, linearRegression, polynomialRegression } from '@/lib/mathEngine';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Line } from 'recharts';

export function StatisticsCalculator() {
  const [dataInput, setDataInput] = useState('1, 2, 3, 4, 5, 6, 7, 8, 9, 10');
  const [xDataInput, setXDataInput] = useState('1, 2, 3, 4, 5');
  const [yDataInput, setYDataInput] = useState('2.1, 4.0, 5.9, 8.1, 10.0');
  const [polyDegree, setPolyDegree] = useState(1);

  const parseData = (input: string): number[] => {
    return input
      .split(/[,\s\n]+/)
      .map(s => parseFloat(s.trim()))
      .filter(n => !isNaN(n));
  };

  const data = useMemo(() => parseData(dataInput), [dataInput]);
  const xData = useMemo(() => parseData(xDataInput), [xDataInput]);
  const yData = useMemo(() => parseData(yDataInput), [yDataInput]);

  const stats = useMemo(() => {
    if (data.length < 2) return null;
    return statistics(data);
  }, [data]);

  const regression = useMemo(() => {
    if (xData.length < 2 || yData.length < 2 || xData.length !== yData.length) return null;
    
    if (polyDegree === 1) {
      return linearRegression(xData, yData);
    } else {
      return polynomialRegression(xData, yData, polyDegree);
    }
  }, [xData, yData, polyDegree]);

  const histogramData = useMemo(() => {
    if (data.length < 2) return [];
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const binCount = Math.min(10, Math.ceil(Math.sqrt(data.length)));
    const binSize = (max - min) / binCount || 1;
    
    const bins: { range: string; count: number }[] = [];
    for (let i = 0; i < binCount; i++) {
      const start = min + i * binSize;
      const end = start + binSize;
      const count = data.filter(v => v >= start && (i === binCount - 1 ? v <= end : v < end)).length;
      bins.push({ range: `${start.toFixed(1)}-${end.toFixed(1)}`, count });
    }
    
    return bins;
  }, [data]);

  const scatterData = useMemo(() => {
    return xData.map((x, i) => ({ x, y: yData[i] })).filter(p => !isNaN(p.y));
  }, [xData, yData]);

  const regressionLineData = useMemo(() => {
    if (!regression || scatterData.length === 0) return [];
    
    const minX = Math.min(...xData);
    const maxX = Math.max(...xData);
    const points = [];
    
    for (let x = minX; x <= maxX; x += (maxX - minX) / 50) {
      let y;
      if ('slope' in regression) {
        y = regression.slope * x + regression.intercept;
      } else {
        y = regression.coefficients.reduce((sum, c, i) => sum + c * Math.pow(x, i), 0);
      }
      points.push({ x, y });
    }
    
    return points;
  }, [regression, xData]);

  return (
    <div className="space-y-4 animate-fade-in-up">
      <Tabs defaultValue="statistics" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="regression">Regression</TabsTrigger>
        </TabsList>

        <TabsContent value="statistics" className="space-y-4">
          <div className="glass-panel p-4 space-y-4">
            <div>
              <Label className="mb-2 block">Data (comma or space separated)</Label>
              <Textarea
                value={dataInput}
                onChange={(e) => setDataInput(e.target.value)}
                placeholder="Enter numbers separated by commas or spaces"
                className="font-mono text-sm h-20"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {data.length} values parsed
              </div>
            </div>
          </div>

          {stats && (
            <>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Mean', value: stats.mean.toFixed(4) },
                  { label: 'Median', value: stats.median.toFixed(4) },
                  { label: 'Mode', value: stats.mode.join(', ') },
                  { label: 'Std Dev', value: stats.stdDev.toFixed(4) },
                  { label: 'Variance', value: stats.variance.toFixed(4) },
                  { label: 'Range', value: stats.range.toFixed(4) },
                  { label: 'Min', value: stats.min.toFixed(4) },
                  { label: 'Max', value: stats.max.toFixed(4) },
                  { label: 'Sum', value: stats.sum.toFixed(4) },
                  { label: 'Count', value: stats.count.toString() },
                ].map((item, i) => (
                  <div key={i} className="glass-panel p-3">
                    <div className="text-xs text-muted-foreground">{item.label}</div>
                    <div className="text-lg font-mono text-primary">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="glass-panel p-4">
                <h3 className="text-sm font-medium mb-3">Histogram</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={histogramData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--graph-grid))" />
                    <XAxis 
                      dataKey="range" 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'hsl(var(--popover))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="regression" className="space-y-4">
          <div className="glass-panel p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">X Data</Label>
                <Textarea
                  value={xDataInput}
                  onChange={(e) => setXDataInput(e.target.value)}
                  className="font-mono text-sm h-20"
                  placeholder="1, 2, 3, 4, 5"
                />
              </div>
              <div>
                <Label className="mb-2 block">Y Data</Label>
                <Textarea
                  value={yDataInput}
                  onChange={(e) => setYDataInput(e.target.value)}
                  className="font-mono text-sm h-20"
                  placeholder="2, 4, 6, 8, 10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label>Polynomial Degree:</Label>
              <Input
                type="number"
                min={1}
                max={5}
                value={polyDegree}
                onChange={(e) => setPolyDegree(Number(e.target.value))}
                className="w-20"
              />
            </div>
          </div>

          {regression && (
            <>
              <div className="glass-panel p-4 space-y-2">
                <div className="text-sm text-muted-foreground">Equation:</div>
                <div className="text-lg font-mono text-primary">{regression.equation}</div>
                <div className="flex items-center gap-4 mt-2">
                  <div>
                    <span className="text-xs text-muted-foreground">R² = </span>
                    <span className="font-mono text-success">{regression.rSquared.toFixed(6)}</span>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-4">
                <h3 className="text-sm font-medium mb-3">Scatter Plot with Regression Line</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--graph-grid))" />
                    <XAxis 
                      type="number" 
                      dataKey="x" 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="y"
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'hsl(var(--popover))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Scatter data={scatterData} fill="hsl(var(--primary))" />
                    <Scatter data={regressionLineData} fill="hsl(var(--warning))" line={{ stroke: 'hsl(var(--warning))', strokeWidth: 2 }} shape={() => null} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
