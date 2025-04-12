// app/api/get-user-videos/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectToDatabase from '@/lib/db';
import Video from '@/models/Video';

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const { userId } =  await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to MongoDB
    await connectToDatabase();

    // Get all videos for the user
    const videos = await Video.find({ userId })
      .sort({ createdAt: -1 }) // Sort by newest first
      .lean();

    return NextResponse.json({
      success: true,
      videos: videos,
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' }, 
      { status: 500 }
    );
  }
}