
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEditedImage extends Document {
  userId: string;
  imageUrl: string;
  editedAt?: Date;
}

const EditedImageSchema: Schema<IEditedImage> = new Schema(
  {
    userId: { type: String, required: true, index: true },
    imageUrl: { type: String, required: true },
    editedAt: { type: Date, default: Date.now },
  },
  { timestamps: true } 
);

const EditedImage: Model<IEditedImage> =
  mongoose.models.EditedImage || mongoose.model<IEditedImage>('EditedImage', EditedImageSchema);

export default EditedImage;
