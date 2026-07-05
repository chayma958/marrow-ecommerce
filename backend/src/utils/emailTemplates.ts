import { IOrder } from '../models/Order';

const wrapper = (title: string, body: string) => `
  <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #14161f;">
    <h1 style="font-size: 20px; margin-bottom: 4px;">Marrow<span style="color: #5457ee;">.</span></h1>
    <h2 style="font-size: 16px; font-weight: 600;">${title}</h2>
    ${body}
    <p style="color: rgba(20,22,31,0.4); font-size: 12px; margin-top: 32px;">This is an automated message from Marrow.</p>
  </div>
`;

export const welcomeEmail = (name: string) => ({
  subject: 'Welcome to Marrow',
  html: wrapper(
    `Welcome, ${name}!`,
    `<p style="font-size: 14px; line-height: 1.6;">Thanks for creating a Marrow account. Browse our catalog of considered everyday goods and enjoy shopping.</p>`
  ),
});

type OrderConfirmationData = Pick<IOrder, '_id' | 'orderItems' | 'totalPrice' | 'shippingAddress'>;
type OrderDeliveredData = Pick<IOrder, '_id'>;

export const orderConfirmationEmail = (order: OrderConfirmationData) => ({
  subject: `Order confirmation #${order._id.toString().slice(-8).toUpperCase()}`,
  html: wrapper(
    'Your order is confirmed',
    `
      <p style="font-size: 14px; line-height: 1.6;">Thanks for your order! Here's a summary:</p>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 12px;">
        ${order.orderItems
          .map(
            (item) => `
          <tr>
            <td style="padding: 6px 0;">${item.name} × ${item.qty}</td>
            <td style="padding: 6px 0; text-align: right;">$${(item.price * item.qty).toFixed(2)}</td>
          </tr>`
          )
          .join('')}
      </table>
      <p style="font-size: 14px; font-weight: 600; margin-top: 12px; text-align: right;">Total: $${order.totalPrice.toFixed(2)}</p>
      <p style="font-size: 13px; color: rgba(20,22,31,0.6); margin-top: 16px;">
        Shipping to: ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}
      </p>
    `
  ),
});

export const orderDeliveredEmail = (order: OrderDeliveredData) => ({
  subject: `Order #${order._id.toString().slice(-8).toUpperCase()} delivered`,
  html: wrapper(
    'Your order has arrived',
    `<p style="font-size: 14px; line-height: 1.6;">Your order #${order._id
      .toString()
      .slice(-8)
      .toUpperCase()} has been marked as delivered. We hope you enjoy it!</p>`
  ),
});

export const passwordResetEmail = (resetUrl: string) => ({
  subject: 'Reset your Marrow password',
  html: wrapper(
    'Reset your password',
    `
      <p style="font-size: 14px; line-height: 1.6;">We received a request to reset your password. This link expires in 30 minutes.</p>
      <p style="margin: 20px 0;">
        <a href="${resetUrl}" style="background: #14161f; color: #fff; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-size: 14px; font-weight: 500;">Reset password</a>
      </p>
      <p style="font-size: 13px; color: rgba(20,22,31,0.6);">If you didn't request this, you can safely ignore this email.</p>
    `
  ),
});
