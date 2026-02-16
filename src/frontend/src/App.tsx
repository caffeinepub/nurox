import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import LoginView from './components/auth/LoginView';
import UserProfileSetupModal from './components/auth/UserProfileSetupModal';
import AppLayout from './components/shell/AppLayout';
import DashboardPage from './pages/DashboardPage';
import JournalPage from './pages/JournalPage';
import ToolsPage from './pages/ToolsPage';
import SettingsPage from './pages/SettingsPage';

function RootLayout() {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}

function AuthenticatedApp() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (!isAuthenticated) {
    return <LoginView />;
  }

  if (showProfileSetup) {
    return <UserProfileSetupModal />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'auth',
  component: AuthenticatedApp,
});

const dashboardRoute = createRoute({
  getParentRoute: () => authRoute,
  path: '/',
  component: DashboardPage,
});

const journalRoute = createRoute({
  getParentRoute: () => authRoute,
  path: '/journal',
  component: JournalPage,
});

const toolsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: '/tools',
  component: ToolsPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: '/settings',
  component: SettingsPage,
});

const routeTree = rootRoute.addChildren([
  authRoute.addChildren([dashboardRoute, journalRoute, toolsRoute, settingsRoute]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
