// app/api/save-image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import EditedImage from '@/models/EditedImage';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { userId, imageUrl } = body;

    if (!userId || !imageUrl) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const newImage = await EditedImage.create({
      userId,
      imageUrl,
    });

    return NextResponse.json({ message: 'Image saved', data: newImage }, { status: 201 });
  } catch (error) {
    console.error('Save Image Error:', error);
    return NextResponse.json({ message: 'Failed to save image' }, { status: 500 });
  }
}
