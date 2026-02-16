import { useState } from 'react';
import { useGetSettings } from '../../hooks/useQueries';
import { calculateRiskPercent } from '../../utils/toolsMath';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatPercent, formatNumber } from '../../utils/format';

export default function RiskPercentCalculator() {
  const { data: settings } = useGetSettings();
  const [accountSize, setAccountSize] = useState(settings?.defaultAccount || 10000);
  const [riskAmount, setRiskAmount] = useState(100);

  const riskPercent = calculateRiskPercent(accountSize, riskAmount);

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle>Risk Percent Calculator</CardTitle>
        <CardDescription>Calculate risk percentage from dollar amount</CardDescription>
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
            <Label htmlFor="riskAmount">Risk Amount ($)</Label>
            <Input
              id="riskAmount"
              type="number"
              value={riskAmount}
              onChange={(e) => setRiskAmount(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="p-6 rounded-lg bg-gradient-to-r from-yellow-600/10 to-yellow-500/10 border border-yellow-500/30">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Risk Percent:</span>
            <span className="text-2xl font-bold text-yellow-500">{formatPercent(riskPercent)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
