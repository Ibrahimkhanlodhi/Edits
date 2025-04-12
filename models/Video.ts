// models/Video.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IVideo extends Document {
  userId: string;
  title: string;
  url: string;
  cloudinaryId: string;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    cloudinaryId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent mongoose from creating multiple models
const Video = mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);

export default Video;