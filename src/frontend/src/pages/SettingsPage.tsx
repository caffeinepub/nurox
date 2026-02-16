import { useState, useEffect } from 'react';
import { useGetSettings, useSaveSettings } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const { data: settings, isLoading } = useGetSettings();
  const saveSettings = useSaveSettings();
  const { theme, setTheme } = useTheme();

  const [formData, setFormData] = useState({
    defaultAccount: 10000,
    defaultRiskPercent: 1,
    baseCurrency: 'USD',
    theme: 'dark',
    strategyPresets: '',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        defaultAccount: settings.defaultAccount,
        defaultRiskPercent: settings.defaultRiskPercent,
        baseCurrency: settings.baseCurrency,
        theme: settings.theme,
        strategyPresets: settings.strategyPresets,
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await saveSettings.mutateAsync(formData);
      setTheme(formData.theme);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">Configure your trading preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Default Values</CardTitle>
            <CardDescription>These values will prefill new trade entries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="defaultAccount">Default Account Size ($)</Label>
                <Input
                  id="defaultAccount"
                  type="number"
                  value={formData.defaultAccount}
                  onChange={(e) =>
                    setFormData({ ...formData, defaultAccount: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultRiskPercent">Default Risk (%)</Label>
                <Input
                  id="defaultRiskPercent"
                  type="number"
                  step="0.1"
                  value={formData.defaultRiskPercent}
                  onChange={(e) =>
                    setFormData({ ...formData, defaultRiskPercent: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="baseCurrency">Base Currency</Label>
                <Select
                  value={formData.baseCurrency}
                  onValueChange={(value) => setFormData({ ...formData, baseCurrency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="JPY">JPY</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={formData.theme}
                  onValueChange={(value) => setFormData({ ...formData, theme: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="strategyPresets">Strategy Presets (one per line)</Label>
              <Textarea
                id="strategyPresets"
                value={formData.strategyPresets}
                onChange={(e) => setFormData({ ...formData, strategyPresets: e.target.value })}
                rows={5}
                placeholder="Order Block&#10;Liquidity Sweep&#10;Supply/Demand&#10;Structure Break"
              />
              <p className="text-xs text-muted-foreground">
                Enter each strategy name on a new line. These will appear in the Journal's New Trade form.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={saveSettings.isPending}
            className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-black font-semibold"
          >
            {saveSettings.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
