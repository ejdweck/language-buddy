import { Form, useLoaderData } from '@remix-run/react';
import { loader as parentLoader } from '~/routes/dashboard';
import type { LoaderFunctionArgs } from '@remix-run/node';

export async function loader({ request, params, context }: LoaderFunctionArgs) {
  const parentData = await parentLoader({ request, params, context });
  const parentJson = await parentData.json();
  
  return Response.json({
    ...parentJson
  });
}

export default function DashboardIndex() {
  const data = useLoaderData<typeof loader>();
  
  if (!data.user) {
    return (
      <div className="rounded-xl bg-card p-6 shadow">
        <h3 className="text-lg font-semibold">Loading...</h3>
      </div>
    );
  }
  
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-card p-6 shadow">
          <h3 className="text-lg font-semibold">Profile</h3>
          <div className="mt-4 space-y-2">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Email:</span> {data.user.email}
            </p>
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Member since:</span>{' '}
              {new Date(data.user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="rounded-xl bg-card p-6 shadow">
          <h3 className="text-lg font-semibold">Account Status</h3>
          <div className="mt-4">
            <p className="text-muted-foreground">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2" />
              Active
            </p>
            <p className="text-muted-foreground mt-2">
              Last updated: {new Date(data.user.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="rounded-xl bg-card p-6 shadow">
          <h3 className="text-lg font-semibold">Actions</h3>
          <div className="mt-4 space-y-2">
            <Form action="/logout" method="post">
              <button 
                type="submit"
                className="w-full rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Logout
              </button>
            </Form>
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-card p-6 shadow">
        <h2 className="text-xl font-bold mb-4">Account Security</h2>
        <div className="text-muted-foreground space-y-2">
          <p>• Your account is protected with a secure password</p>
          <p>• Last password change: {new Date(data.user.updatedAt).toLocaleDateString()}</p>
        </div>
      </div>
    </>
  );
}