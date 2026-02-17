import { Outlet } from '@tanstack/react-router';
import TopBar from './TopBar';
import SideNav from './SideNav';

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopBar />
      <div className="flex flex-1">
        <SideNav />
        <main className="flex-1 overflow-y-auto">
          <div className="container max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
      <footer className="border-t border-border/40 bg-card/30 backdrop-blur py-4">
        <div className="container px-4 sm:px-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Built with ❤️ using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== 'undefined' ? window.location.hostname : 'nurox-app'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
