import { Link, useRouterState } from '@tanstack/react-router';
import { cn } from '@/lib/utils';
import { LayoutDashboard, BookOpen, Calculator, Settings, MessageSquare } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/journal', label: 'Journal', icon: BookOpen },
  { path: '/tools', label: 'Tools', icon: Calculator },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function SideNav() {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-border/40 lg:bg-card/50 lg:pt-16">
      <nav className="flex flex-1 flex-col gap-2 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all',
                isActive
                  ? 'bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      
      <footer className="p-4 border-t border-border/40">
        <p className="text-xs text-center text-muted-foreground">
          © {new Date().getFullYear()} Built with ❤️ using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-500 hover:text-yellow-400 transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </aside>
  );
}
