import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { sendEmail } from '../utils/sendEmail';

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// @desc    Send a message from the Contact Us form
// @route   POST /api/contact
// @access  Public
export const sendContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    res.status(400);
    throw new Error('Name, email, and message are required');
  }

  await sendEmail({
    to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER || '',
    subject: `[Contact form] ${escapeHtml(subject || 'New message')} — from ${escapeHtml(name)}`,
    html: `
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(subject || '(none)')}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(String(message)).replace(/\n/g, '<br />')}</p>
    `,
  });

  res.json({ message: "Your message has been sent. We'll get back to you soon." });
});
