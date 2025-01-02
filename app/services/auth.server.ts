import { Authenticator } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';
import { db, users } from '~/db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { redirect } from '@remix-run/node';
import { sessionStorage } from '~/utils/session.server';

// Define your user type
interface User {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create an instance of the authenticator
export const authenticator = new Authenticator<User>();

// Register the Form Strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get('email');
    const password = form.get('password');

    if (!email || !password) {
      throw new Error('Invalid credentials');
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      throw new Error('Invalid form data');
    }

    const user = await verifyLogin(email, password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    return user;
  }),
  'user-pass'
); 

export async function createUser(email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const [user] = await db.insert(users)
      .values({
        email,
        password: hashedPassword,
      })
      .returning();
    
    return user;
  } catch (error) {
    // Handle unique constraint violations or other errors
    throw new Error('Error creating user');
  }
}

export async function verifyLogin(email: string, password: string) {
  const [user] = await db.select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return user;
}

export async function requireUserId(request: Request) {
  const session = await sessionStorage.getSession(request.headers.get('Cookie'));
  const user = session.get('user');

  if (!user?.id) {
    throw redirect('/login');
  }

  return user.id;
}