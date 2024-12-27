import { json, redirect, type ActionFunctionArgs } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { createUser } from '~/services/auth.server';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');

  if (
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    return json(
      { error: 'Invalid form submission' },
      { status: 400 }
    );
  }

  try {
    await createUser(email, password);
    return redirect('/login');
  } catch (error) {
    return json(
      { error: 'Error creating user' },
      { status: 500 }
    );
  }
}

export default function SignUp() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="max-w-md mx-auto mt-8">
      <Form method="post" className="space-y-4">
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            id="password"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        {actionData?.error && (
          <div className="text-red-600">{actionData.error}</div>
        )}
        <button
          type="submit"
          className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Sign Up
        </button>
      </Form>
    </div>
  );
} 