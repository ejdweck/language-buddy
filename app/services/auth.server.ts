import { Authenticator } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';

// Define your user type
interface User {
  email: string;
  id: string;
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

    // This is where you would validate the password against your database
    if (email === 'test@example.com' && password === 'password') {
      return {
        id: '1',
        email,
      };
    }

    throw new Error('Invalid credentials');
  }),
  'user-pass'
); 