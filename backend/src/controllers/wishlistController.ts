import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import User from '../models/User';

// @desc    Get logged in user's wishlist
// @route   GET /api/users/wishlist
// @access  Private
export const getWishlist = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!._id).populate('wishlist');
  res.json(user?.wishlist || []);
});

// @desc    Add a product to the wishlist
// @route   POST /api/users/wishlist/:productId
// @access  Private
export const addToWishlist = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { productId } = req.params;
  if (!user.wishlist.some((id) => id.toString() === productId)) {
    user.wishlist.push(productId as any);
    await user.save();
  }

  const updated = await User.findById(user._id).populate('wishlist');
  res.json(updated?.wishlist || []);
});

// @desc    Remove a product from the wishlist
// @route   DELETE /api/users/wishlist/:productId
// @access  Private
export const removeFromWishlist = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { productId } = req.params;
  user.wishlist = user.wishlist.filter((id) => id.toString() !== productId) as any;
  await user.save();

  const updated = await User.findById(user._id).populate('wishlist');
  res.json(updated?.wishlist || []);
});
