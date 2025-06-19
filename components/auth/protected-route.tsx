'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if not loading and not authenticated
    // Also check if we're not already on the signin page to prevent loops
    if (!isLoading && !isAuthenticated && typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (currentPath !== '/signin') {
        console.log('ProtectedRoute: Redirecting to signin');
        router.replace('/signin');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // If still loading, show nothing and let ClientLayout handle loading
  if (isLoading) {
    return null;
  }

  // If not authenticated, show nothing (redirect is happening)
  if (!isAuthenticated) {
    return null;
  }

  // If authenticated, render children
  return <>{children}</>;
}
