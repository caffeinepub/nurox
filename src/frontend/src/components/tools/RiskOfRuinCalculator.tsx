import { useState } from 'react';
import { calculateRiskOfRuin } from '../../utils/toolsMath';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatPercent } from '../../utils/format';
import { AlertTriangle } from 'lucide-react';

export default function RiskOfRuinCalculator() {
  const [winRate, setWinRate] = useState(60);
  const [avgWin, setAvgWin] = useState(100);
  const [avgLoss, setAvgLoss] = useState(50);
  const [riskPerTrade, setRiskPerTrade] = useState(2);

  const riskOfRuin = calculateRiskOfRuin(winRate, avgWin, avgLoss, riskPerTrade);

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle>Risk of Ruin Calculator</CardTitle>
        <CardDescription>Estimate your probability of account ruin</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="winRate">Win Rate (%)</Label>
            <Input
              id="winRate"
              type="number"
              step="0.1"
              value={winRate}
              onChange={(e) => setWinRate(parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avgWin">Average Win ($)</Label>
            <Input
              id="avgWin"
              type="number"
              value={avgWin}
              onChange={(e) => setAvgWin(parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avgLoss">Average Loss ($)</Label>
            <Input
              id="avgLoss"
              type="number"
              value={avgLoss}
              onChange={(e) => setAvgLoss(parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="riskPerTrade">Risk Per Trade (%)</Label>
            <Input
              id="riskPerTrade"
              type="number"
              step="0.1"
              value={riskPerTrade}
              onChange={(e) => setRiskPerTrade(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="p-6 rounded-lg bg-gradient-to-r from-red-600/10 to-red-500/10 border border-red-500/30">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">Risk Assessment</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Risk of Ruin:</span>
              <span className="text-2xl font-bold text-red-500">{formatPercent(riskOfRuin)}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {riskOfRuin < 5
                ? 'Very low risk - excellent risk management'
                : riskOfRuin < 20
                ? 'Moderate risk - acceptable for most traders'
                : 'High risk - consider reducing position size'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
