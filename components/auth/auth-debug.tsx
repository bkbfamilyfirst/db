'use client';

import { useAuth } from '@/components/auth/auth-provider';

export function AuthDebug() {
  const { user, isLoading, isAuthenticated } = useAuth();
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs font-mono z-50">
      <div>Loading: {isLoading ? 'true' : 'false'}</div>
      <div>Authenticated: {isAuthenticated ? 'true' : 'false'}</div>
      <div>User: {user ? user.name : 'null'}</div>
      <div>Path: {typeof window !== 'undefined' ? window.location.pathname : 'SSR'}</div>
    </div>
  );
}
