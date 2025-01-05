import { json, redirect } from '@remix-run/node';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { useActionData } from '@remix-run/react';
import { LoginForm } from '~/components/auth/login-form';
import { authenticator } from '~/services/auth.server';
import { sessionStorage } from '~/utils/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await sessionStorage.getSession(request.headers.get('cookie'));
  const user = session.get('user');
  if (user) return redirect('/dashboard');
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.clone().formData();
    console.log('Form submission:', {
      email: formData.get('email'),
      hasPassword: !!formData.get('password'),
    });

    const user = await authenticator.authenticate('user-pass', request);
    console.log('Authenticated user:', user);

    const session = await sessionStorage.getSession(request.headers.get('cookie'));
    session.set('user', user);

    return redirect('/dashboard', {
      headers: {
        'Set-Cookie': await sessionStorage.commitSession(session),
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );
  }
}

export default function LoginPage() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="text-sm">🗣️</span>
          </div>
          Language Buddy
        </a>
        {actionData?.error && (
          <div className="text-sm text-destructive text-center">
            {actionData.error}
          </div>
        )}
        <LoginForm />
      </div>
    </div>
  );
} 