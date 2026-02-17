import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, TrendingUp, Shield, Brain } from 'lucide-react';
import { BRANDING } from '../constants/branding';

/**
 * About page with creator story, core principles, and inspirational quote.
 * Preserves all existing UI, text, and branding presentation.
 */
export default function AboutPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <img
          src={BRANDING.logo}
          alt="NUROX Logo"
          className="h-32 sm:h-40 mx-auto object-contain"
          loading="eager"
          decoding="async"
          onError={(e) => {
            console.error('Logo failed to load');
            e.currentTarget.style.display = 'none';
          }}
        />
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
          About ShadowJack
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A disciplined trader's journey to mastering the markets through structure, patience, and relentless self-improvement.
        </p>
      </div>

      <Card className="border-border/40 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl">The Story</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            ShadowJack isn't just a name—it's a philosophy. Born from countless hours of screen time, blown accounts, and hard-earned lessons, this
            journal represents the evolution from emotional trading to disciplined execution.
          </p>
          <p>
            Every trade logged here is a step toward mastery. Every violation tracked is a reminder that the market rewards discipline, not hope. Every
            metric calculated is a mirror reflecting the truth: consistency beats brilliance, and process beats prediction.
          </p>
          <p>
            This tool was built by a trader, for traders who understand that the real edge isn't in the strategy—it's in the execution, the psychology,
            and the unwavering commitment to the plan.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Target className="h-6 w-6 text-yellow-500" />
              </div>
              <CardTitle>Structure First</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Every trade must respect market structure. No entries without confirmation. No exceptions.
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <TrendingUp className="h-6 w-6 text-yellow-500" />
              </div>
              <CardTitle>Liquidity Awareness</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            The market moves to liquidity. Identify where it's hiding, and you'll know where price is going.
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Shield className="h-6 w-6 text-yellow-500" />
              </div>
              <CardTitle>Risk Management</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Protect capital at all costs. A trader who can't survive today won't be around to profit tomorrow.
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Brain className="h-6 w-6 text-yellow-500" />
              </div>
              <CardTitle>Emotional Control</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            The market doesn't care about your feelings. Trade the plan, not the emotion.
          </CardContent>
        </Card>
      </div>

      <Card className="border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-transparent backdrop-blur">
        <CardContent className="pt-6">
          <blockquote className="text-center space-y-4">
            <p className="text-xl sm:text-2xl font-semibold text-yellow-500 italic">
              "The market is a device for transferring money from the impatient to the patient."
            </p>
            <footer className="text-muted-foreground">— Warren Buffett</footer>
          </blockquote>
        </CardContent>
      </Card>
    </div>
  );
}
