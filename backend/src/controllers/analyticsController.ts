import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import Order from '../models/Order';
import User from '../models/User';

const MONTHS_BACK = 12;

const monthsAgo = (n: number) => {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  d.setMonth(d.getMonth() - n + 1);
  return d;
};

// Fills in zero-count months so charts don't skip gaps where nothing happened.
const fillMonths = <T extends { _id: string; value: number }>(rows: T[]): { month: string; value: number }[] => {
  const byMonth = new Map(rows.map((r) => [r._id, r.value]));
  const result: { month: string; value: number }[] = [];
  const cursor = monthsAgo(MONTHS_BACK);
  for (let i = 0; i < MONTHS_BACK; i++) {
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`;
    result.push({ month: key, value: byMonth.get(key) || 0 });
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return result;
};

// @desc    Revenue from paid orders, grouped by month (last 12 months)
// @route   GET /api/admin/analytics/revenue
// @access  Private/Admin
export const getRevenueByMonth = asyncHandler(async (req: Request, res: Response) => {
  const rows = await Order.aggregate([
    { $match: { isPaid: true, paidAt: { $gte: monthsAgo(MONTHS_BACK) } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$paidAt' } },
        value: { $sum: '$totalPrice' },
      },
    },
  ]);
  res.json(fillMonths(rows));
});

// @desc    Order count grouped by month (last 12 months)
// @route   GET /api/admin/analytics/orders
// @access  Private/Admin
export const getOrdersByMonth = asyncHandler(async (req: Request, res: Response) => {
  const rows = await Order.aggregate([
    { $match: { createdAt: { $gte: monthsAgo(MONTHS_BACK) } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        value: { $sum: 1 },
      },
    },
  ]);
  res.json(fillMonths(rows));
});

// @desc    Top 5 best-selling products by quantity sold
// @route   GET /api/admin/analytics/top-products
// @access  Private/Admin
export const getTopProducts = asyncHandler(async (req: Request, res: Response) => {
  const rows = await Order.aggregate([
    { $unwind: '$orderItems' },
    {
      $group: {
        _id: '$orderItems.product',
        name: { $first: '$orderItems.name' },
        totalQty: { $sum: '$orderItems.qty' },
      },
    },
    { $sort: { totalQty: -1 } },
    { $limit: 5 },
  ]);
  res.json(rows.map((r) => ({ name: r.name, value: r.totalQty })));
});

// @desc    New user signups grouped by month (last 12 months)
// @route   GET /api/admin/analytics/new-users
// @access  Private/Admin
export const getNewUsersByMonth = asyncHandler(async (req: Request, res: Response) => {
  const rows = await User.aggregate([
    { $match: { createdAt: { $gte: monthsAgo(MONTHS_BACK) } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        value: { $sum: 1 },
      },
    },
  ]);
  res.json(fillMonths(rows));
});
