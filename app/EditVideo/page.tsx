"use client";


import dynamic from "next/dynamic";

import AuthWrapper from "../components/AuthWrapper";


// Dynamically import the component that uses FFmpeg, ensuring it's only run on the client-side.
const VideoEditor = dynamic(() => import("../components/VideoEditor"), { ssr: false });

export default function Home() {
  return (
    <AuthWrapper>
      <div>
        <VideoEditor />
      </div>
    </AuthWrapper>
  )
      
 
}
