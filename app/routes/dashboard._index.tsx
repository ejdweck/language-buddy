import { useLoaderData } from '@remix-run/react';
import { loader as parentLoader } from '~/routes/dashboard';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { Flame } from 'lucide-react';

export async function loader({ request, params, context }: LoaderFunctionArgs) {
  const parentData = await parentLoader({ request, params, context });
  const parentJson = await parentData.json();
  
  return Response.json({
    ...parentJson
  });
}

export default function DashboardIndex() {
  const { user } = useLoaderData<typeof parentLoader>();
  // TODO: Replace with actual streak data from the database
  const streakCount = 7; // Placeholder streak count
  
  if (!user) {
    return (
      <div className="rounded-xl bg-card p-6 shadow">
        <h3 className="text-lg font-semibold">Loading...</h3>
      </div>
    );
  }
  
  return (
    <div className="grid gap-4">
      <div className="rounded-xl bg-card p-6 shadow">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Flame className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{streakCount} Day Streak!</h3>
            <p className="text-muted-foreground">
              Keep up the great work, {user.email.split('@')[0]}!
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-card p-6 shadow">
          <h3 className="text-lg font-semibold">Today's Progress</h3>
          <div className="mt-4">
            <p className="text-3xl font-bold">0/3</p>
            <p className="text-muted-foreground">lessons completed</p>
          </div>
        </div>
        
        <div className="rounded-xl bg-card p-6 shadow">
          <h3 className="text-lg font-semibold">Weekly Goal</h3>
          <div className="mt-4">
            <p className="text-3xl font-bold">5/7</p>
            <p className="text-muted-foreground">days practiced</p>
          </div>
        </div>
        
        <div className="rounded-xl bg-card p-6 shadow">
          <h3 className="text-lg font-semibold">Total Time</h3>
          <div className="mt-4">
            <p className="text-3xl font-bold">12.5</p>
            <p className="text-muted-foreground">hours this week</p>
          </div>
        </div>
      </div>
    </div>
  );
}