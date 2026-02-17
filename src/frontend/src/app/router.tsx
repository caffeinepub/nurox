import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import AppLayout from '../components/shell/AppLayout';
import DashboardPage from '../pages/DashboardPage';
import JournalPage from '../pages/JournalPage';
import ToolsPage from '../pages/ToolsPage';
import SettingsPage from '../pages/SettingsPage';
import AboutPage from '../pages/AboutPage';

/**
 * Application router configuration with all route definitions.
 * Preserves exact route paths and page components from the existing app.
 */

const rootRoute = createRootRoute({
  component: AppLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

const journalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/journal',
  component: JournalPage,
});

const toolsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tools',
  component: ToolsPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  journalRoute,
  toolsRoute,
  settingsRoute,
  aboutRoute,
]);

export const appRouter = createRouter({ routeTree });
