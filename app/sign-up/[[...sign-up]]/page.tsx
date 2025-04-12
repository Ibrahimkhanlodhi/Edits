'use client';

import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="auth-container">
      <SignUp
      appearance={{
    elements: {
      card: {
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        borderRadius: '1rem',
      },
    },
  }} />
    </div>
  );
}
