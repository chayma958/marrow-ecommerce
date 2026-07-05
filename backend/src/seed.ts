import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import slugify from 'slugify';
import connectDB from './config/db';
import User from './models/User';
import Product from './models/Product';
import Order from './models/Order';
import Coupon from './models/Coupon';

const users = [
  { name: 'Admin User', email: 'admin@example.com', password: 'admin123', isAdmin: true },
  { name: 'Jane Doe', email: 'jane@example.com', password: 'jane1234', isAdmin: false },
];

const productsData = [
  {
    name: 'Aria Wireless Headphones',
    brand: 'Sonora',
    category: 'Electronics',
    price: 89.99,
    onSale: true,
    salePrice: 69.99,
    countInStock: 25,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    images: [],
    description: 'Over-ear wireless headphones with active noise cancellation, 30-hour battery life, and plush memory-foam ear cushions for all-day comfort.',
  },
  {
    name: 'Pulse Smartwatch Series 4',
    brand: 'Pulse',
    category: 'Electronics',
    price: 149.0,
    countInStock: 15,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
    images: [],
    description: 'Track your workouts, heart rate, and sleep with this sleek smartwatch. Water resistant up to 50m with a 7-day battery.',
  },
  {
    name: 'Nimbus Mechanical Keyboard',
    brand: 'Nimbus',
    category: 'Electronics',
    price: 119.5,
    countInStock: 30,
    isFeatured: false,
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600',
    images: [],
    description: 'Hot-swappable mechanical keyboard with per-key RGB lighting and tactile brown switches, built for gamers and typists alike.',
  },
  {
    name: 'Drift Canvas Backpack',
    brand: 'Drift',
    category: 'Accessories',
    price: 54.99,
    countInStock: 40,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
    images: [],
    description: 'Water-resistant canvas backpack with a padded 15" laptop sleeve, multiple compartments, and reinforced stitching.',
  },
  {
    name: 'Meridian Leather Wallet',
    brand: 'Meridian',
    category: 'Accessories',
    price: 29.99,
    countInStock: 60,
    isFeatured: false,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600',
    images: [],
    description: 'Slim genuine-leather bifold wallet with RFID-blocking technology and 6 card slots.',
  },
  {
    name: 'Halo Ceramic Desk Lamp',
    brand: 'Halo',
    category: 'Home',
    price: 39.0,
    countInStock: 20,
    isFeatured: false,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600',
    images: [],
    description: 'Minimalist ceramic-base desk lamp with 3 warm-white brightness levels and a soft-touch dimmer.',
  },
  {
    name: 'Terra Ceramic Mug Set',
    brand: 'Terra',
    category: 'Home',
    price: 24.5,
    countInStock: 50,
    isFeatured: false,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600',
    images: [],
    description: 'Set of 4 handcrafted stoneware mugs, dishwasher and microwave safe, in a matte earth-tone finish.',
  },
  {
    name: 'Voyage Running Shoes',
    brand: 'Voyage',
    category: 'Footwear',
    price: 79.99,
    onSale: true,
    salePrice: 59.99,
    countInStock: 35,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    images: [],
    description: 'Lightweight breathable mesh running shoes with responsive foam cushioning for daily training.',
  },
  {
    name: 'Summit Trail Jacket',
    brand: 'Summit',
    category: 'Apparel',
    price: 94.0,
    countInStock: 18,
    isFeatured: false,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600',
    images: [],
    description: 'Packable waterproof shell jacket with taped seams, built for unpredictable weather on the trail.',
  },
  {
    name: 'Cascade Insulated Bottle',
    brand: 'Cascade',
    category: 'Accessories',
    price: 19.99,
    countInStock: 70,
    isFeatured: false,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600',
    images: [],
    description: 'Double-wall vacuum insulated stainless steel bottle, keeps drinks cold for 24 hours or hot for 12.',
  },
  {
    name: 'Orbit Bluetooth Speaker',
    brand: 'Orbit',
    category: 'Electronics',
    price: 45.0,
    countInStock: 28,
    isFeatured: false,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600',
    images: [],
    description: 'Compact IPX7 waterproof speaker delivering rich 360° sound with 12 hours of playtime.',
  },
  {
    name: 'Loom Wool Throw Blanket',
    brand: 'Loom',
    category: 'Home',
    price: 49.99,
    countInStock: 22,
    isFeatured: false,
    image: 'https://images.unsplash.com/photo-1616627561950-9f746e330187?w=600',
    images: [],
    description: 'Soft woven wool-blend throw blanket, perfect for the couch, bed, or a chilly evening outdoors.',
  },
];

const couponsData = [
  { code: 'SAVE10', type: 'percentage' as const, value: 10, minOrderValue: 0 },
  { code: 'WELCOME20', type: 'fixed' as const, value: 20, minOrderValue: 0 },
  { code: 'FREESHIP', type: 'free_shipping' as const, value: 0, minOrderValue: 0 },
];

const importData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Coupon.deleteMany();

    const createdUsers = await User.create(users);
    const adminUser = createdUsers[0]._id;

    const withSlugs = productsData.map((p) => ({
      ...p,
      slug: slugify(p.name, { lower: true, strict: true }),
    }));

    await Product.insertMany(withSlugs);
    await Coupon.insertMany(couponsData);

    console.log('Data imported successfully!');
    console.log(`Admin login -> email: admin@example.com | password: admin123`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Coupon.deleteMany();
    console.log('Data destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
