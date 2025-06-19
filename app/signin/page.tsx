'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Shield, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getErrorMessage } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated && typeof window !== 'undefined') {
      // Only redirect if not already navigating
      const currentPath = window.location.pathname;
      if (currentPath === '/signin') {
        router.replace('/');
      }
    }
  }, [isAuthenticated, isLoading, router]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login({ email, password });
      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: getErrorMessage(error),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header Card */}
        <Card className="border-0 bg-gradient-to-r from-electric-purple via-electric-blue to-electric-cyan animate-gradient-shift">
          <CardContent className="p-6 text-white text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Family First</h1>
                <Sparkles className="h-5 w-5 text-electric-yellow" />
              </div>
            </div>
            <p className="text-white/90">Distributor Control Center</p>
          </CardContent>
        </Card>

        {/* Sign In Form */}
        <Card className="border shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Welcome back
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to your distributor account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 font-medium"
                disabled={isSubmitting || !email || !password}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Secure access to your distributor dashboard
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Family First Parental Control System</p>
          <p className="mt-1">© 2025 All rights reserved</p>
        </div>
      </div>
    </div>
  );
}
