'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, logout, getCurrentUser, isAuthenticated, clearAuthData, type LoginCredentials, type User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Development mode - for testing without backend
const DEV_MODE = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEV_MODE === 'true';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const router = useRouter();  
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      
      // Check if we're in the browser before accessing localStorage
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        
        // If on signin page, just set as unauthenticated
        if (currentPath === '/signin') {
          setUser(null);
          setIsLoading(false);
          return;
        }
        
        // In development mode, bypass authentication
        if (DEV_MODE) {
          console.log('Development mode: bypassing authentication');
          setUser({
            id: 'dev-user',
            name: 'Dev User',
            email: 'dev@example.com',
            role: 'db'
          });
          setIsLoading(false);
          return;
        }
        
        // Check if user has a valid token
        const hasToken = isAuthenticated();
        console.log('Has access token:', hasToken);
        
        if (hasToken) {
          try {
            console.log('Attempting to get current user...');
            const currentUser = await getCurrentUser();
            console.log('Successfully authenticated user:', currentUser);
            setUser(currentUser);
          } catch (error) {
            // If getCurrentUser fails, clear auth data and redirect to signin
            console.warn('Authentication failed:', error);
            clearAuthData();
            setUser(null);
            // Only set redirect if not already on signin page
            if (currentPath !== '/signin') {
              setShouldRedirect(true);
            }
            return;
          }
        } else {
          // No token found, user is not authenticated
          console.log('No access token found, redirecting to signin');
          setUser(null);
          // Only set redirect if not already on signin page
          if (currentPath !== '/signin') {
            setShouldRedirect(true);
          }
          return;
        }
      } else {
        // Server-side, assume not authenticated
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      clearAuthData();
      setUser(null);
      // Only set redirect if not already on signin page
      if (typeof window !== 'undefined' && window.location.pathname !== '/signin') {
        setShouldRedirect(true);
      }
    } finally {
      setIsLoading(false);
    }
  };
  // Handle redirect in a separate effect
  useEffect(() => {
    if (shouldRedirect && !isLoading && typeof window !== 'undefined') {
      // Prevent redirect loops by checking current path
      const currentPath = window.location.pathname;
      if (currentPath !== '/signin') {
        router.replace('/signin');
      }
      setShouldRedirect(false);
    }
  }, [shouldRedirect, isLoading, router]);  useEffect(() => {
    // Only check auth once on mount
    checkAuth();
    
    // Fallback timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn('Auth check took too long, forcing completion');
        setIsLoading(false);
        // Only redirect if not already authenticated and not on signin page
        if (!user && typeof window !== 'undefined' && window.location.pathname !== '/signin') {
          setShouldRedirect(true);
        }
      }
    }, 5000); // 5 second timeout
    
    return () => clearTimeout(timeout);
  }, []); // Empty dependency array to run only once

  const handleLogin = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await login(credentials);
      setUser(response.user);
      router.push('/');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      clearAuthData();
      setIsLoading(false);
      router.push('/signin');
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: handleLogin,
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
