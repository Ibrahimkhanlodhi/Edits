"use client";

import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import styles from "../UserButton.module.scss";

// Dynamically import the component that uses FFmpeg, ensuring it's only run on the client-side.
const VideoEditor = dynamic(() => import("../components/VideoEditor"), { ssr: false });

export default function Home() {
  return <>
  <ClerkProvider>
    <SignedIn>
      <div>
        <VideoEditor/>
      </div>

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
  </ClerkProvider>
  </>
 
}
