import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import streamifier from 'streamifier';
import cloudinary from '../config/cloudinary';

// @desc    Upload a product image to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No image file provided');
  }

  const secureUrl = await new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'marrow-ecommerce' },
      (error, result) => {
        if (error || !result) return reject(error || new Error('Upload failed'));
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(req.file!.buffer).pipe(uploadStream);
  });

  res.json({ url: secureUrl });
});
