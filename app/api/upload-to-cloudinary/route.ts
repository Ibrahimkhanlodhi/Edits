/* eslint-disable */
import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectToDatabase from '@/lib/db';
import Video from '@/models/Video';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated with Clerk
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Process the FormData
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string || `Video ${Date.now()}`;

    if (!file) {
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 });
    }

    // Create a temporary file path
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Generate a unique filename
    const tempFilePath = join(tmpdir(), `${randomUUID()}.mp4`);
    
    // Write the file to the temporary directory
    await writeFile(tempFilePath, new Uint8Array(buffer));

    // Upload to Cloudinary
    const cloudinaryResponse = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          folder: 'user_videos',
          public_id: `video_${Date.now()}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      // Stream the file to Cloudinary
      const fs = require('fs');
      const readStream = fs.createReadStream(tempFilePath);
      readStream.pipe(uploadStream);
    });

    // Connect to MongoDB
    await connectToDatabase();

    // Create a new video document
    const newVideo = await Video.create({
      userId: userId,
      cloudinaryId: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
      title: title,
    });

    // Clean up the temporary file (using require for fs unlink to handle callbacks)
    require('fs').unlinkSync(tempFilePath);

    // Return success response with video info
    return NextResponse.json({
      success: true,
      video: {
        id: newVideo._id,
        cloudinaryId: newVideo.cloudinaryId,
        url: newVideo.url,
        title: newVideo.title,
        createdAt: newVideo.createdAt,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload video', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}