import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import Coupon from '../models/Coupon';
import { computeDiscount, getCouponValidationError } from '../utils/coupon';
import { getEffectivePrice } from '../utils/pricing';
import { sendEmail } from '../utils/sendEmail';
import { orderConfirmationEmail, orderDeliveredEmail } from '../utils/emailTemplates';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = asyncHandler(async (req: Request, res: Response) => {
  const { orderItems, shippingAddress, paymentMethod, couponCode } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  const dbProducts = await Product.find({ _id: { $in: orderItems.map((i: any) => i.product) } });

  let itemsPrice = 0;
  const validatedItems = orderItems.map((item: any) => {
    const match = dbProducts.find((p) => p._id.toString() === item.product);
    if (!match) {
      res.status(400);
      throw new Error(`Product not found: ${item.name}`);
    }
    if (match.countInStock < item.qty) {
      res.status(400);
      throw new Error(`Insufficient stock for ${match.name}`);
    }
    const price = getEffectivePrice(match);
    itemsPrice += price * item.qty;
    return {
      name: match.name,
      qty: item.qty,
      image: match.image,
      price,
      product: match._id,
    };
  });
  itemsPrice = Number(itemsPrice.toFixed(2));

  const taxPrice = Number((0.08 * itemsPrice).toFixed(2));
  let shippingPrice = itemsPrice > 100 ? 0 : itemsPrice > 0 ? 9.99 : 0;

  let discountAmount = 0;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: String(couponCode).toUpperCase() });
    const validationError = getCouponValidationError(coupon, itemsPrice);
    if (validationError) {
      res.status(400);
      throw new Error(validationError);
    }
    const result = computeDiscount(coupon!, itemsPrice);
    discountAmount = result.discountAmount;
    if (result.freeShipping) shippingPrice = 0;
  }

  const totalPrice = Math.max(0, Number((itemsPrice + taxPrice + shippingPrice - discountAmount).toFixed(2)));

  const order = new Order({
    orderItems: validatedItems,
    user: req.user!._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    couponCode: couponCode ? String(couponCode).toUpperCase() : undefined,
    discountAmount,
    totalPrice,
  });

  const created = await order.save();

  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, { $inc: { countInStock: -item.qty } });
  }

  sendEmail({ to: req.user!.email, ...orderConfirmationEmail(created) });

  res.status(201).json(created);
});

// @desc    Get logged in user's orders
// @route   GET /api/orders/mine
// @access  Private
export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await Order.find({ user: req.user!._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user._id.toString() !== req.user!._id.toString() && !req.user!.isAdmin) {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json(order);
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.isPaid = true;
  order.paidAt = new Date();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.email_address,
  };

  const updated = await order.save();
  res.json(updated);
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id).populate<{ user: { email: string } }>('user', 'email');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.isDelivered = true;
  order.deliveredAt = new Date();

  if (order.paymentMethod === 'CashOnDelivery' && !order.isPaid) {
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: 'COD',
      status: 'paid_on_delivery',
      update_time: new Date().toISOString(),
      email_address: '',
    };
  }

  const updated = await order.save();

  sendEmail({ to: (order.user as any).email, ...orderDeliveredEmail(order) });

  res.json(updated);
});

// @desc    Get all orders, optionally filtered by status
// @route   GET /api/orders?status=pending|paid|delivered|not_delivered
// @access  Private/Admin
export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  let filter: Record<string, boolean> = {};
  switch (req.query.status) {
    case 'pending':
      filter = { isPaid: false };
      break;
    case 'paid':
      filter = { isPaid: true };
      break;
    case 'delivered':
      filter = { isDelivered: true };
      break;
    case 'not_delivered':
      filter = { isDelivered: false };
      break;
  }

  const orders = await Order.find(filter).populate('user', 'id name').sort({ createdAt: -1 });
  res.json(orders);
});
