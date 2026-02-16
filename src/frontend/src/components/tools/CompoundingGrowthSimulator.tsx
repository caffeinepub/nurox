import { useState } from 'react';
import { calculateCompoundGrowth } from '../../utils/toolsMath';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/format';

export default function CompoundingGrowthSimulator() {
  const [initialBalance, setInitialBalance] = useState(10000);
  const [monthlyReturn, setMonthlyReturn] = useState(5);
  const [months, setMonths] = useState(12);

  const results = calculateCompoundGrowth(initialBalance, monthlyReturn, months);
  const finalBalance = results[results.length - 1]?.balance || initialBalance;
  const totalGain = finalBalance - initialBalance;
  const totalGainPercent = ((totalGain / initialBalance) * 100);

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle>Compounding Growth Simulator</CardTitle>
        <CardDescription>Project your account growth with consistent returns</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="initialBalance">Initial Balance ($)</Label>
            <Input
              id="initialBalance"
              type="number"
              value={initialBalance}
              onChange={(e) => setInitialBalance(parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyReturn">Monthly Return (%)</Label>
            <Input
              id="monthlyReturn"
              type="number"
              step="0.1"
              value={monthlyReturn}
              onChange={(e) => setMonthlyReturn(parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="months">Months</Label>
            <Input
              id="months"
              type="number"
              value={months}
              onChange={(e) => setMonths(parseInt(e.target.value) || 1)}
            />
          </div>
        </div>

        <div className="p-6 rounded-lg bg-gradient-to-r from-yellow-600/10 to-yellow-500/10 border border-yellow-500/30">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Final Balance:</span>
              <span className="text-2xl font-bold text-yellow-500">{formatCurrency(finalBalance)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Gain:</span>
              <span className="text-xl font-bold text-green-500">
                +{formatCurrency(totalGain)} ({totalGainPercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={results}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
            <XAxis 
              dataKey="month" 
              stroke="oklch(var(--muted-foreground))"
              label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              stroke="oklch(var(--muted-foreground))"
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'oklch(var(--popover))',
                border: '1px solid oklch(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [formatCurrency(value), 'Balance']}
            />
            <Line 
              type="monotone" 
              dataKey="balance" 
              stroke="oklch(var(--chart-1))" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
