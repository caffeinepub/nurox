import { useState } from 'react';
import { useGetSettings } from '../../hooks/useQueries';
import { calculateLotSize, calculateRiskAmount, calculateStopDistance } from '../../utils/tradingCalculations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatNumber } from '../../utils/format';

export default function LotSizeCalculator() {
  const { data: settings } = useGetSettings();
  const [accountSize, setAccountSize] = useState(settings?.defaultAccount || 10000);
  const [riskPercent, setRiskPercent] = useState(settings?.defaultRiskPercent || 1);
  const [entryPrice, setEntryPrice] = useState(1.1000);
  const [stopLoss, setStopLoss] = useState(1.0950);
  const [pipValue, setPipValue] = useState(0.0001);

  const riskAmount = calculateRiskAmount(accountSize, riskPercent);
  const stopDistance = calculateStopDistance(entryPrice, stopLoss);
  const lotSize = calculateLotSize(riskAmount, stopDistance, pipValue);

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle>Lot Size Calculator</CardTitle>
        <CardDescription>
          Formula: Lot Size = Risk Amount / (Stop Distance × Pip Value)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="accountSize">Account Size ($)</Label>
            <Input
              id="accountSize"
              type="number"
              value={accountSize}
              onChange={(e) => setAccountSize(parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="riskPercent">Risk (%)</Label>
            <Input
              id="riskPercent"
              type="number"
              step="0.1"
              value={riskPercent}
              onChange={(e) => setRiskPercent(parseFloat(e.target.value) || 0)}
            />
          </div>

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
            <Label htmlFor="stopLoss">Stop Loss</Label>
            <Input
              id="stopLoss"
              type="number"
              step="0.00001"
              value={stopLoss}
              onChange={(e) => setStopLoss(parseFloat(e.target.value) || 0)}
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
              <span className="text-muted-foreground">Risk Amount:</span>
              <span className="text-xl font-bold">${formatNumber(riskAmount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Stop Distance:</span>
              <span className="text-xl font-bold">{formatNumber(stopDistance, 5)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Lot Size:</span>
              <span className="text-2xl font-bold text-yellow-500">{formatNumber(lotSize)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
