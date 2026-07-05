import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User';
import generateToken from '../utils/generateToken';
import { sendEmail } from '../utils/sendEmail';
import { welcomeEmail, passwordResetEmail } from '../utils/emailTemplates';
import { isStrongPassword, PASSWORD_REQUIREMENTS_MESSAGE } from '../utils/passwordPolicy';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please fill in all fields');
  }

  if (!isStrongPassword(password)) {
    res.status(400);
    throw new Error(PASSWORD_REQUIREMENTS_MESSAGE);
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password });

  sendEmail({ to: user.email, ...welcomeEmail(user.name) });

  const token = generateToken(res, user._id.toString());

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token,
  });
});

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(res, user._id.toString());
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Authenticate with Google & get token
// @route   POST /api/users/auth/google
// @access  Public
export const googleAuth = asyncHandler(async (req: Request, res: Response) => {
  const { idToken } = req.body;

  if (!idToken) {
    res.status(400);
    throw new Error('Missing Google ID token');
  }

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  if (!payload || !payload.email) {
    res.status(401);
    throw new Error('Invalid Google token');
  }

  const { sub: googleId, email, name } = payload;

  let user = await User.findOne({ $or: [{ googleId }, { email }] });

  if (user) {
    if (!user.googleId) {
      user.googleId = googleId;
      user.authProvider = 'google';
      await user.save();
    }
  } else {
    user = await User.create({
      name: name || email.split('@')[0],
      email,
      googleId,
      authProvider: 'google',
    });
    sendEmail({ to: user.email, ...welcomeEmail(user.name) });
  }

  const token = generateToken(res, user._id.toString());

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token,
  });
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out successfully' });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  if (req.body.password) {
    if (!isStrongPassword(req.body.password)) {
      res.status(400);
      throw new Error(PASSWORD_REQUIREMENTS_MESSAGE);
    }
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
  });
});

// @desc    Request a password reset email
// @route   POST /api/users/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user && user.authProvider === 'local') {
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    sendEmail({ to: user.email, ...passwordResetEmail(resetUrl) });
  }

  res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
});

// @desc    Reset password using the token from the emailed link
// @route   PUT /api/users/reset-password/:token
// @access  Public
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: new Date() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired reset link');
  }

  const { password } = req.body;
  if (!password || !isStrongPassword(password)) {
    res.status(400);
    throw new Error(PASSWORD_REQUIREMENTS_MESSAGE);
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({ message: 'Password reset successful. You can now sign in.' });
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (user.isAdmin) {
    res.status(400);
    throw new Error('Cannot delete an admin user');
  }
  await user.deleteOne();
  res.json({ message: 'User removed' });
});
