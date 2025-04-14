
'use client';
import React from "react";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import ClerkClientProvider from "./ClerkClientProvider";
import styles from "../UserButton.module.scss"

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  return (
    <ClerkClientProvider>
      <SignedIn>
        {children}
        <div className={styles['user-button-wrapper']}>
<UserButton
appearance={{
elements: {
userButtonAvatarBox: {
width: '48px',
height: '48px',
display: 'flex',
justifyContent: 'center',
alignItems: 'center',
 },
 },
 }}
/>
</div>
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </ClerkClientProvider>
  );
}