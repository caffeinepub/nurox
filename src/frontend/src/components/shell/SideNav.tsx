import { useNavigate, useRouterState } from '@tanstack/react-router';
import { LayoutDashboard, BookOpen, Wrench, Settings as SettingsIcon, User } from 'lucide-react';

export const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/journal', label: 'Journal', icon: BookOpen },
  { path: '/tools', label: 'Tools', icon: Wrench },
  { path: '/about', label: 'About Me', icon: User },
  { path: '/settings', label: 'Settings', icon: SettingsIcon },
];

export default function SideNav() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border/40 bg-card/30 backdrop-blur">
      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate({ to: item.path })}
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
    </aside>
  );
}
