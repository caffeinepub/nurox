import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';
import MobileNav from './MobileNav';
import { BRANDING } from '../../constants/branding';

export default function TopBar() {
  const { clear, identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const userInitials = userProfile?.name
    ? userProfile.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <MobileNav />
          <div className="flex items-center gap-3">
            <img 
              src={BRANDING.logo}
              alt={`${BRANDING.appName} Logo`}
              className="h-12 sm:h-14 w-auto object-contain"
              loading="eager"
              decoding="async"
              onError={(e) => {
                console.error('Logo failed to load:', BRANDING.logo);
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="hidden sm:block">
              <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                {BRANDING.appName}
              </div>
              <div className="text-xs text-muted-foreground">{BRANDING.tagline}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-yellow-600 to-yellow-500 text-black font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{userProfile?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {identity?.getPrincipal().toString().slice(0, 20)}...
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
