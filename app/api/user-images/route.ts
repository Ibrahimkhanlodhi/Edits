// app/api/user-images/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import EditedImage from '@/models/EditedImage';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const userId = req.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: 'Missing userId' }, { status: 400 });
    }

    const images = await EditedImage.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json(images, { status: 200 });
  } catch (error) {
    console.error('Fetch Images Error:', error);
    return NextResponse.json({ message: 'Failed to fetch images' }, { status: 500 });
  }
}
