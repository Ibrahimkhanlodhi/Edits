// app/api/delete-video/route.ts
/* eslint-disable */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { v2 as cloudinary } from 'cloudinary';
import connectToDatabase from '@/lib/db';
import Video from '@/models/Video';
import mongoose from 'mongoose';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get video ID from query parameters
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('id');

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }

    // Validate video ID format
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return NextResponse.json({ error: 'Invalid video ID format' }, { status: 400 });
    }

    // Connect to MongoDB
    await connectToDatabase();

    // Find the video to ensure it belongs to the current user
    const video = await Video.findOne({ _id: videoId, userId });

    if (!video) {
      return NextResponse.json({ error: 'Video not found or access denied' }, { status: 404 });
    }

    // Delete from Cloudinary
    if (video.cloudinaryId) {
      await new Promise<void>((resolve, reject) => {
        cloudinary.uploader.destroy(
          video.cloudinaryId,
          { resource_type: 'video' },
          (error) => {
            if (error) reject(error);
            else resolve();
          }
        );
      });
    }

    // Delete from database
    await Video.deleteOne({ _id: videoId });

    return NextResponse.json({
      success: true,
      message: 'Video deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete video',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
