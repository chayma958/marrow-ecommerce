import mongoose, { Document, Schema } from 'mongoose';

export interface IReview {
  _id: mongoose.Types.ObjectId;
  name: string;
  rating: number;
  comment: string;
  user: mongoose.Types.ObjectId;
  createdAt?: Date;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  image: string;
  images: string[];
  brand: string;
  category: string;
  description: string;
  reviews: IReview[];
  rating: number;
  numReviews: number;
  price: number;
  onSale: boolean;
  salePrice?: number;
  countInStock: number;
  isFeatured: boolean;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  { timestamps: true }
);

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    images: [{ type: String }],
    brand: { type: String, required: true },
    category: { type: String, required: true, index: true },
    description: { type: String, required: true },
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    onSale: { type: Boolean, required: true, default: false },
    salePrice: { type: Number },
    countInStock: { type: Number, required: true, default: 0 },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', brand: 'text' });

const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;
