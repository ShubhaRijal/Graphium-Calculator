import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { convertUnit } from '@/lib/mathEngine';
import { ArrowRight, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const unitCategories = {
  Length: ['m', 'km', 'cm', 'mm', 'mi', 'yd', 'ft', 'in', 'nm', 'angstrom'],
  Mass: ['kg', 'g', 'mg', 'lb', 'oz', 'ton', 'tonne'],
  Time: ['s', 'ms', 'min', 'h', 'day', 'week', 'year'],
  Temperature: ['degC', 'degF', 'K'],
  Area: ['m^2', 'km^2', 'cm^2', 'ft^2', 'mi^2', 'acre', 'hectare'],
  Volume: ['L', 'mL', 'm^3', 'cm^3', 'gallon', 'quart', 'pint', 'cup', 'floz'],
  Speed: ['m/s', 'km/h', 'mph', 'knot', 'ft/s'],
  Force: ['N', 'kN', 'lbf', 'dyn'],
  Energy: ['J', 'kJ', 'cal', 'kcal', 'Wh', 'kWh', 'eV', 'BTU'],
  Power: ['W', 'kW', 'MW', 'hp'],
  Pressure: ['Pa', 'kPa', 'bar', 'atm', 'psi', 'mmHg', 'torr'],
  Data: ['bit', 'byte', 'kB', 'MB', 'GB', 'TB'],
};

export function UnitConverter() {
  const [category, setCategory] = useState<keyof typeof unitCategories>('Length');
  const [value, setValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');

  const units = unitCategories[category];

  const result = useMemo(() => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return null;
    return convertUnit(numValue, fromUnit, toUnit);
  }, [value, fromUnit, toUnit]);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleCategoryChange = (newCategory: keyof typeof unitCategories) => {
    setCategory(newCategory);
    const newUnits = unitCategories[newCategory];
    setFromUnit(newUnits[0]);
    setToUnit(newUnits[1]);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Category Selection */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {Object.keys(unitCategories).map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat as keyof typeof unitCategories)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              category === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Converter */}
      <div className="glass-panel p-6 space-y-4">
        <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-end">
          {/* From */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">From</Label>
            <Input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="text-xl font-mono h-14"
              placeholder="Enter value"
            />
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger className="font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit} value={unit} className="font-mono">
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Swap Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSwap}
            className="h-14 w-14 rounded-full mb-8"
          >
            <ArrowLeftRight className="h-5 w-5" />
          </Button>

          {/* To */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">To</Label>
            <div className="calc-display h-14 flex items-center justify-end">
              <span className="text-xl font-mono text-primary">
                {result?.error ? '—' : result?.value || '—'}
              </span>
            </div>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger className="font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit} value={unit} className="font-mono">
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {result?.error && (
          <div className="text-destructive text-sm animate-fade-in">
            {result.error}
          </div>
        )}
      </div>

      {/* Quick Reference */}
      <div className="glass-panel p-4">
        <h3 className="text-sm font-medium mb-3">Common Conversions</h3>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono text-muted-foreground">
          {category === 'Length' && (
            <>
              <div>1 mi = 1.609 km</div>
              <div>1 ft = 0.3048 m</div>
              <div>1 in = 2.54 cm</div>
              <div>1 yd = 0.9144 m</div>
            </>
          )}
          {category === 'Mass' && (
            <>
              <div>1 lb = 0.4536 kg</div>
              <div>1 oz = 28.35 g</div>
              <div>1 ton = 907.2 kg</div>
              <div>1 tonne = 1000 kg</div>
            </>
          )}
          {category === 'Temperature' && (
            <>
              <div>°F = °C × 9/5 + 32</div>
              <div>K = °C + 273.15</div>
              <div>0°C = 32°F = 273.15K</div>
              <div>100°C = 212°F = 373.15K</div>
            </>
          )}
          {category === 'Volume' && (
            <>
              <div>1 gallon = 3.785 L</div>
              <div>1 cup = 236.6 mL</div>
              <div>1 floz = 29.57 mL</div>
              <div>1 L = 1000 mL</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
