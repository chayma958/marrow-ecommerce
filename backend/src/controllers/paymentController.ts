import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10' as any,
});

// @desc    Create a Stripe PaymentIntent for the given amount (in the order's currency)
// @route   POST /api/payments/create-payment-intent
// @access  Private
export const createPaymentIntent = asyncHandler(async (req: Request, res: Response) => {
  const { amount, currency = 'usd' } = req.body;

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error('Invalid amount');
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // convert to cents
    currency,
    payment_method_types: ['card'],
    metadata: { userId: req.user!._id.toString() },
  });

  res.json({ clientSecret: paymentIntent.client_secret });
});
