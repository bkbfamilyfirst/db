'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { usePathname } from 'next/navigation';
import Header from '@/components/header';
import BottomNav from '@/components/bottom-nav';
import { ProtectedRoute } from '@/components/auth/protected-route';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  
  // Pages that don't require authentication
  const publicRoutes = ['/signin'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Always render public routes immediately
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Show loading state for protected routes
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Render protected routes with header/nav
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 pb-20 sm:pb-24 md:pb-28">{children}</main>
        <BottomNav />
      </div>
    </ProtectedRoute>
  );
}
