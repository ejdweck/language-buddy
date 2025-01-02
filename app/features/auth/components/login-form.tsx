import { Form } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

export function LoginForm() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome to Language Buddy</CardTitle>
          <CardDescription>
            Start your language learning journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post">
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button variant="outline" className="w-full" type="button">
                  <span className="mr-2">🌐</span>
                  Continue with Google
                </Button>
              </div>
              <div className="relative text-center text-sm">
                <span className="relative z-10 bg-card px-2 text-muted-foreground">
                  Or continue with email
                </span>
                <div className="absolute inset-0 top-1/2 -translate-y-1/2 border-t border-border" />
              </div>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="hello@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="/forgot-password"
                      className="ml-auto text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <Input id="password" name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </div>
              <div className="text-center text-sm">
                {`Don't have an account?`}{' '}
                <a href="/signup" className="text-primary hover:underline">
                  Sign up
                </a>
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>
      <p className="text-center text-xs text-muted-foreground">
        By signing in, you agree to our{' '}
        <a href="/tos" className="text-primary hover:underline">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/privacy" className="text-primary hover:underline">
          Privacy Policy
        </a>
      </p>
    </div>
  );
} 