import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import slugify from 'slugify';
import Product from '../models/Product';

// @desc    Fetch all products with pagination, search, category & price filters, sorting
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const pageSize = Number(req.query.pageSize) || 12;
  const page = Number(req.query.page) || 1;

  const keyword = req.query.keyword
    ? { $text: { $search: String(req.query.keyword) } }
    : {};

  const category = req.query.category && req.query.category !== 'all'
    ? { category: req.query.category }
    : {};

  const priceFilter: any = {};
  if (req.query.minPrice) priceFilter.$gte = Number(req.query.minPrice);
  if (req.query.maxPrice) priceFilter.$lte = Number(req.query.maxPrice);
  const price = Object.keys(priceFilter).length ? { price: priceFilter } : {};

  const filter = { ...keyword, ...category, ...price };

  let sort: any = { createdAt: -1 };
  switch (req.query.sort) {
    case 'price_asc':
      sort = { price: 1 };
      break;
    case 'price_desc':
      sort = { price: -1 };
      break;
    case 'rating':
      sort = { rating: -1 };
      break;
    case 'newest':
      sort = { createdAt: -1 };
      break;
  }

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort(sort)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
});

// @desc    Fetch featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await Product.find({ isFeatured: true }).limit(6);
  res.json(products);
});

// @desc    Fetch all distinct categories
// @route   GET /api/products/categories
// @access  Public
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await Product.distinct('category');
  res.json(categories);
});

// @desc    Lightweight name-match suggestions for search-as-you-type
// @route   GET /api/products/suggestions?keyword=
// @access  Public
export const getProductSuggestions = asyncHandler(async (req: Request, res: Response) => {
  const keyword = String(req.query.keyword || '').trim();
  if (keyword.length < 3) {
    res.json([]);
    return;
  }

  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const products = await Product.find({ name: { $regex: escaped, $options: 'i' } })
    .select('name slug image price salePrice onSale')
    .limit(6);

  res.json(products);
});

// @desc    Fetch single product by slug or id
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = id.match(/^[0-9a-fA-F]{24}$/)
    ? await Product.findById(id)
    : await Product.findOne({ slug: id });

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
});

// @desc    Fetch products similar to the given product (same category)
// @route   GET /api/products/:id/recommendations
// @access  Public
export const getRecommendedProducts = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const recommendations = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .sort({ rating: -1, createdAt: -1 })
    .limit(4);

  res.json(recommendations);
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const { name, price, image, images, brand, category, countInStock, description, isFeatured, onSale, salePrice } = req.body;

  const product = new Product({
    name: name || 'Sample name',
    slug: slugify(name || `sample-${Date.now()}`, { lower: true, strict: true }) + '-' + Date.now().toString().slice(-5),
    price: price ?? 0,
    user: req.user!._id,
    image: image || '/images/sample.jpg',
    images: images || [],
    brand: brand || 'Sample brand',
    category: category || 'uncategorized',
    countInStock: countInStock ?? 0,
    description: description || 'Sample description',
    isFeatured: isFeatured ?? false,
    onSale: onSale ?? false,
    salePrice: salePrice ?? undefined,
  });

  const created = await product.save();
  res.status(201).json(created);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { name, price, description, image, images, brand, category, countInStock, isFeatured, onSale, salePrice } = req.body;

  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (name && name !== product.name) {
    product.slug = slugify(name, { lower: true, strict: true }) + '-' + Date.now().toString().slice(-5);
  }
  product.name = name ?? product.name;
  product.price = price ?? product.price;
  product.description = description ?? product.description;
  product.image = image ?? product.image;
  product.images = images ?? product.images;
  product.brand = brand ?? product.brand;
  product.category = category ?? product.category;
  product.countInStock = countInStock ?? product.countInStock;
  product.onSale = onSale ?? product.onSale;
  product.salePrice = onSale === false ? undefined : salePrice ?? product.salePrice;
  product.isFeatured = isFeatured ?? product.isFeatured;

  const updated = await product.save();
  res.json(updated);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await product.deleteOne();
  res.json({ message: 'Product removed' });
});

// @desc    Create a new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = asyncHandler(async (req: Request, res: Response) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user!._id.toString()
  );
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed');
  }

  const review = {
    name: req.user!.name,
    rating: Number(rating),
    comment,
    user: req.user!._id,
  };

  product.reviews.push(review as any);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ message: 'Review added' });
});

// @desc    Update the logged-in user's own review
// @route   PUT /api/products/:id/reviews/:reviewId
// @access  Private
export const updateProductReview = asyncHandler(async (req: Request, res: Response) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const review = product.reviews.find((r) => r._id.toString() === req.params.reviewId);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  if (review.user.toString() !== req.user!._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to edit this review');
  }

  review.rating = Number(rating);
  review.comment = comment;
  product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

  await product.save();
  res.json({ message: 'Review updated' });
});

// @desc    Delete the logged-in user's own review
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private
export const deleteProductReview = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const index = product.reviews.findIndex((r) => r._id.toString() === req.params.reviewId);
  if (index === -1) {
    res.status(404);
    throw new Error('Review not found');
  }
  if (product.reviews[index].user.toString() !== req.user!._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this review');
  }

  product.reviews.splice(index, 1);
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.length
    ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
    : 0;

  await product.save();
  res.json({ message: 'Review removed' });
});
