import { useState } from 'react';
import { calculateStopDistance } from '../../utils/tradingCalculations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatNumber } from '../../utils/format';

export default function PipCalculator() {
  const [entryPrice, setEntryPrice] = useState(1.1000);
  const [exitPrice, setExitPrice] = useState(1.1050);
  const [pipValue, setPipValue] = useState(0.0001);

  const distance = calculateStopDistance(entryPrice, exitPrice);
  const pips = distance / pipValue;

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle>Pip Calculator</CardTitle>
        <CardDescription>Calculate pip distance between two prices</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="entryPrice">Entry Price</Label>
            <Input
              id="entryPrice"
              type="number"
              step="0.00001"
              value={entryPrice}
              onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="exitPrice">Exit Price</Label>
            <Input
              id="exitPrice"
              type="number"
              step="0.00001"
              value={exitPrice}
              onChange={(e) => setExitPrice(parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pipValue">Pip Value</Label>
            <Input
              id="pipValue"
              type="number"
              step="0.00001"
              value={pipValue}
              onChange={(e) => setPipValue(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="p-6 rounded-lg bg-gradient-to-r from-yellow-600/10 to-yellow-500/10 border border-yellow-500/30">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Price Distance:</span>
              <span className="text-xl font-bold">{formatNumber(distance, 5)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Pips:</span>
              <span className="text-2xl font-bold text-yellow-500">{formatNumber(pips, 1)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
