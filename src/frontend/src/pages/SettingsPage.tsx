import { useState, useEffect } from 'react';
import { useGetSettings, useSaveSettings } from '../hooks/useQueries';
import { useActor } from '../hooks/useActor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save, Settings as SettingsIcon } from 'lucide-react';
import { toast } from 'sonner';
import StartFreshSection from '../components/settings/StartFreshSection';
import type { Settings } from '../backend';

/**
 * Settings page with gold + black theme matching Dashboard styling, including trading defaults, strategy presets, and Start Fresh section.
 */
export default function SettingsPage() {
  const { actor } = useActor();
  const { data: settings, isLoading } = useGetSettings();
  const saveSettings = useSaveSettings();

  const [formData, setFormData] = useState<Settings>({
    defaultAccount: 0,
    defaultRiskPercent: 0,
    baseCurrency: 'USD',
    theme: 'dark',
    strategyPresets: '',
  });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
      setHasChanges(false);
    }
  }, [settings]);

  const handleChange = (field: keyof Settings, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      await saveSettings.mutateAsync(formData);
      setHasChanges(false);
      toast.success('Settings saved successfully');
    } catch (error: any) {
      console.error('Failed to save settings:', error);
      toast.error(error.message || 'Failed to save settings');
    }
  };

  if (!actor || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-8 w-8 text-yellow-500" />
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground">Manage your trading preferences and defaults</p>
        </div>
      </div>

      <Card className="border-border/40 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle>Trading Defaults</CardTitle>
          <CardDescription>
            Set default values for your trading calculations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="defaultAccount">Default Account Size</Label>
              <Input
                id="defaultAccount"
                type="number"
                step="0.01"
                value={formData.defaultAccount}
                onChange={(e) => handleChange('defaultAccount', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultRiskPercent">Default Risk %</Label>
              <Input
                id="defaultRiskPercent"
                type="number"
                step="0.1"
                value={formData.defaultRiskPercent}
                onChange={(e) => handleChange('defaultRiskPercent', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="baseCurrency">Base Currency</Label>
            <Input
              id="baseCurrency"
              value={formData.baseCurrency}
              onChange={(e) => handleChange('baseCurrency', e.target.value)}
              placeholder="USD"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/40 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle>Strategy Presets</CardTitle>
          <CardDescription>
            Add your trading strategies (one per line)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.strategyPresets}
            onChange={(e) => handleChange('strategyPresets', e.target.value)}
            placeholder="Enter strategy names, one per line..."
            rows={8}
            className="font-mono text-sm"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={!hasChanges || saveSettings.isPending}
          size="lg"
          className="bg-yellow-500 hover:bg-yellow-600 text-black"
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

      <StartFreshSection />
    </div>
  );
}
