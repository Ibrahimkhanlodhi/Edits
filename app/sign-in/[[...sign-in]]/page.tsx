'use client';

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="auth-container">
      <SignIn 
      appearance={{
    elements: {
      card: {
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        borderRadius: '1rem',
      },
    },
  }}/>
    </div>
  );
}