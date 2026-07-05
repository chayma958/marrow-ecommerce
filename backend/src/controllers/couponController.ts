import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import Coupon from '../models/Coupon';
import { computeDiscount, getCouponValidationError } from '../utils/coupon';

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = asyncHandler(async (req: Request, res: Response) => {
  const { code, type, value, isActive, expiresAt, minOrderValue } = req.body;

  if (!code || !type) {
    res.status(400);
    throw new Error('Code and type are required');
  }

  const exists = await Coupon.findOne({ code: String(code).toUpperCase() });
  if (exists) {
    res.status(400);
    throw new Error('A coupon with this code already exists');
  }

  const coupon = await Coupon.create({
    code,
    type,
    value: value ?? 0,
    isActive: isActive ?? true,
    expiresAt: expiresAt || undefined,
    minOrderValue: minOrderValue ?? 0,
  });

  res.status(201).json(coupon);
});

// @desc    List all coupons
// @route   GET /api/coupons
// @access  Private/Admin
export const getCoupons = asyncHandler(async (req: Request, res: Response) => {
  const coupons = await Coupon.find({}).sort({ createdAt: -1 });
  res.json(coupons);
});

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = asyncHandler(async (req: Request, res: Response) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }
  await coupon.deleteOne();
  res.json({ message: 'Coupon removed' });
});

// @desc    Validate a coupon code against a cart subtotal
// @route   POST /api/coupons/validate
// @access  Private
export const validateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const { code, itemsPrice } = req.body;

  if (!code || itemsPrice === undefined) {
    res.status(400);
    throw new Error('Coupon code and items price are required');
  }

  const coupon = await Coupon.findOne({ code: String(code).toUpperCase() });
  const validationError = getCouponValidationError(coupon, Number(itemsPrice));
  if (validationError) {
    res.status(400);
    throw new Error(validationError);
  }

  const { discountAmount, freeShipping } = computeDiscount(coupon!, Number(itemsPrice));

  res.json({
    code: coupon!.code,
    type: coupon!.type,
    value: coupon!.value,
    minOrderValue: coupon!.minOrderValue,
    discountAmount,
    freeShipping,
  });
});
