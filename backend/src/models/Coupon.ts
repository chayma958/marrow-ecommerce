import mongoose, { Document, Schema } from 'mongoose';

export type CouponType = 'percentage' | 'fixed' | 'free_shipping';

export interface ICoupon extends Document {
  code: string;
  type: CouponType;
  value: number;
  isActive: boolean;
  expiresAt?: Date;
  minOrderValue: number;
  createdAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ['percentage', 'fixed', 'free_shipping'], required: true },
    value: { type: Number, required: true, default: 0 },
    isActive: { type: Boolean, required: true, default: true },
    expiresAt: { type: Date },
    minOrderValue: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const Coupon = mongoose.model<ICoupon>('Coupon', couponSchema);
export default Coupon;
