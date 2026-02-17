import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, LayoutDashboard, BookOpen, Wrench, Settings as SettingsIcon, User } from 'lucide-react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useState } from 'react';
import { BRANDING } from '../../constants/branding';

export default function MobileNav() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [open, setOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/journal', label: 'Journal', icon: BookOpen },
    { path: '/tools', label: 'Tools', icon: Wrench },
    { path: '/about', label: 'About Me', icon: User },
    { path: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  const handleNavigate = (path: string) => {
    navigate({ to: path });
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 bg-background/95 backdrop-blur">
        <SheetHeader>
          <SheetTitle className="text-left">
            <div className="flex items-center gap-3">
              <img 
                src={BRANDING.logo}
                alt={BRANDING.appName}
                className="h-10 w-auto object-contain"
                loading="eager"
                decoding="async"
                onError={(e) => {
                  console.error('Mobile nav logo failed to load:', BRANDING.logo);
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                  {BRANDING.appName}
                </div>
                <div className="text-xs text-muted-foreground font-normal">{BRANDING.tagline}</div>
              </div>
            </div>
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-8 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
