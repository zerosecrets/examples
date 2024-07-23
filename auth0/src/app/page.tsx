'use client';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function Home() {
  const userContext = useUser();

  return (
    <main>
      <h1 className="text-4xl font-bold mb-6">Next.js Auth0 App</h1>

      <p className="mb-4">
        {userContext.user
          ? `You are logged in as ${userContext.user.email}`
          : 'You are not logged in.'}
      </p>

      <p>
        {userContext.user ? (
          <a href="/api/auth/logout" className="text-blue-600 underline">
            Log out
          </a>
        ) : (
          <a href="/api/auth/login" className="text-blue-600 underline">
            Log in
          </a>
        )}
      </p>
    </main>
  );
}
